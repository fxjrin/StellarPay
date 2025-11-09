import { Client, networks } from '../contracts/privacy-payment/src';
import { StrKey } from '@stellar/stellar-sdk';

const CONTRACT_ID = import.meta.env.PUBLIC_CONTRACT_ADDRESS || 'CC6THIWIYPXPQEZJ7WJSBD4DNG4HBALIVKDF53E3GS46BYFFIHUH34QV';
const NETWORK_PASSPHRASE = networks.testnet.networkPassphrase;
const RPC_URL = 'https://soroban-testnet.stellar.org';

// Export contract address for UI display
export const getContractAddress = () => CONTRACT_ID;

// Initialize contract client
const getContract = (publicKey?: string) => {
  return new Client({
    contractId: CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey,
  });
};

export const contractService = {
  async register(address: string, username: string) {
    const contract = getContract(address);

    const tx = await contract.register({
      caller: address,
      username,
    });

    const sentTx = await tx.signAndSend({
      signTransaction: async (xdr: string) => {
        const { signTransaction } = await import('@stellar/freighter-api');
        return await signTransaction(xdr, {
          networkPassphrase: NETWORK_PASSPHRASE,
        });
      },
    });


    // SentTransaction in Stellar SDK doesn't have getTransaction()
    // The transaction is already sent and we have the response
    // Just return the sent transaction - it contains all we need
    return sentTx;
  },

  // Get username by address
  async getUsernameByAddress(address: string): Promise<string | null> {
    const contract = getContract();

    try {

      const assembled = await contract.get_username_by_address({ address }, { simulate: false });
      const simulated = await assembled.simulate();

      const simulation = simulated.simulation;
      if (!simulation?.result?.retval) {
        return null;
      }

      const retval = simulation.result.retval;

      if (retval._arm === 'void' || !retval._value) {
        return null;
      }

      if (retval._arm === 'str') {
        const usernameData = retval._value?.data || retval._value;
        if (usernameData) {
          const username = Buffer.from(usernameData).toString();
          return username;
        }
      }

      return null;
    } catch (error: any) {
      return null;
    }
  },

  // Get profile by username
  async getProfile(username: string) {
    const contract = getContract();

    try {

      // Build transaction without auto-simulation
      const assembled = await contract.get_profile({ username }, { simulate: false });

      // Manually simulate
      const simulated = await assembled.simulate();

      // Don't access simulated.result yet - it triggers auto-parsing which fails
      // Go straight to manual parsing

      // Fallback: parse raw simulation response manually
      const simulation = simulated.simulation;

      if (!simulation?.result?.retval) {
        return null;
      }

      const retval = simulation.result.retval;

      // Check if it's void (None)
      if (retval._arm === 'void' || !retval._value) {
        return null;
      }

      // Check if it's a map (Some)
      if (retval._arm === 'map' && Array.isArray(retval._value)) {
        const map = retval._value;
        const profile: any = {};

        for (const entry of map) {

          // Safely get key
          const keyObj = entry._attributes?.key;

          const keyData = keyObj?._value?.data || keyObj?._value;

          if (!keyData) {
            continue;
          }

          const key = Buffer.from(keyData).toString();
          const val = entry._attributes.val;


          if (key === 'username' && val?._arm === 'str') {
            const usernameData = val._value?.data || val._value;
            if (usernameData) {
              profile.username = Buffer.from(usernameData).toString();
            }
          } else if (key === 'address' && val?._arm === 'address') {
            // Extract actual address from Address type
            const addressValue = val._value;

            if (typeof addressValue === 'string') {
              profile.address = addressValue;
            } else if (addressValue?._arm === 'accountId' && addressValue._value) {
              // Stellar address is in accountId format
              // Need to convert PublicKey bytes to G... format
              const publicKeyValue = addressValue._value;

              // Try to get the actual address string
              if (publicKeyValue?._value) {
                // If it's wrapped further
                const pkData = publicKeyValue._value;

                // Convert to address string format
                if (pkData instanceof Uint8Array) {
                  profile.address = StrKey.encodeEd25519PublicKey(pkData);
                } else if (typeof pkData === 'string') {
                  profile.address = pkData;
                } else {
                  // Try toString
                  profile.address = String(pkData);
                }
              } else {
                profile.address = String(publicKeyValue);
              }
            } else if (addressValue?._value) {
              // Fallback: address might be wrapped differently
              profile.address = String(addressValue._value);
            }
          } else if (key === 'created_at' && val?._arm === 'u64') {
            const timestampData = val._value?._value || val._value;
            if (timestampData) {
              profile.created_at = BigInt(timestampData);
            }
          }
        }

        return profile;
      }

      return null;
    } catch (error: any) {
      return null;
    }
  },

  // Check username availability - check if profile exists
  async checkUsername(username: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(username);
      // Return true if username is available (profile doesn't exist)
      return profile === null;
    } catch (error) {
      return false;
    }
  },

  // Create payment
  async createPayment(
    sender: string,
    recipientUsername: string,
    token: string,
    amount: bigint,
    message: string
  ) {
    const contract = getContract(sender);

    const tx = await contract.create_payment({
      sender,
      recipient_username: recipientUsername,
      token,
      amount,
      message,
    });

    // Simulate first to properly build the transaction with all auth entries
    const simulated = await tx.simulate();

    const sentTx = await simulated.signAndSend({
      signTransaction: async (xdr: string) => {
        const { signTransaction } = await import('@stellar/freighter-api');
        return await signTransaction(xdr, {
          networkPassphrase: NETWORK_PASSPHRASE,
        });
      },
    });

    return sentTx;
  },

  // Claim payment
  async claimPayment(recipient: string, paymentId: bigint) {
    const contract = getContract(recipient);

    const tx = await contract.claim_payment({
      recipient,
      payment_id: paymentId,
    });

    // Simulate first to properly build the transaction with all auth entries
    const simulated = await tx.simulate();

    const sentTx = await simulated.signAndSend({
      signTransaction: async (xdr: string) => {
        const { signTransaction } = await import('@stellar/freighter-api');
        return await signTransaction(xdr, {
          networkPassphrase: NETWORK_PASSPHRASE,
        });
      },
    });

    return sentTx;
  },

  // Get payment
  async getPayment(paymentId: bigint) {
    const contract = getContract();

    try {
      console.log('[getPayment] Fetching payment ID:', paymentId.toString());

      // Build transaction without auto-simulation
      const assembled = await contract.get_payment({ payment_id: paymentId }, { simulate: false });

      // Manually simulate
      const simulated = await assembled.simulate();

      // Parse raw simulation response manually
      const simulation = simulated.simulation;

      if (!simulation?.result?.retval) {
        console.log('[getPayment] No retval in simulation');
        return null;
      }

      const retval = simulation.result.retval;

      // Check if it's void (None)
      if (retval._arm === 'void' || !retval._value) {
        console.log('[getPayment] Payment not found (void)');
        return null;
      }

      // Manually parse the map (Payment struct)
      if (retval._arm === 'map' && Array.isArray(retval._value)) {
        const map = retval._value;
        const payment: any = {};

        for (const entry of map) {
          const keyObj = entry._attributes?.key;
          const keyData = keyObj?._value?.data || keyObj?._value;

          if (!keyData) continue;

          const key = Buffer.from(keyData).toString();
          const val = entry._attributes.val;

          if (key === 'payment_id' && val?._arm === 'u64') {
            payment.payment_id = BigInt(val._value?._value || val._value);
          } else if (key === 'recipient_username' && val?._arm === 'str') {
            const data = val._value?.data || val._value;
            payment.recipient_username = Buffer.from(data).toString();
          } else if (key === 'sender' && val?._arm === 'address') {
            const addressValue = val._value;
            if (addressValue?._arm === 'accountId' && addressValue._value) {
              const edValue = addressValue._value;
              // Navigate through nested structure to get the actual bytes
              const pkData = edValue._value || edValue;
              if (pkData?.data) {
                payment.sender = StrKey.encodeEd25519PublicKey(Buffer.from(pkData.data));
              } else if (Buffer.isBuffer(pkData)) {
                payment.sender = StrKey.encodeEd25519PublicKey(pkData);
              }
            }
          } else if (key === 'token' && val?._arm === 'address') {
            const addressValue = val._value;
            if (addressValue?._arm === 'contractId') {
              const contractValue = addressValue._value;
              // Get the actual bytes from nested structure
              if (contractValue?.data) {
                payment.token = StrKey.encodeContract(Buffer.from(contractValue.data));
              } else if (Buffer.isBuffer(contractValue)) {
                payment.token = StrKey.encodeContract(contractValue);
              }
            }
          } else if (key === 'amount' && val?._arm === 'i128') {
            const amountData = val._value?._attributes;
            const lo = amountData?.lo?._value || '0';
            payment.amount = BigInt(lo);
          } else if (key === 'message' && val?._arm === 'str') {
            const data = val._value?.data || val._value;
            payment.message = Buffer.from(data).toString();
          } else if (key === 'timestamp' && val?._arm === 'u64') {
            payment.timestamp = BigInt(val._value?._value || val._value);
          } else if (key === 'claimed' && val?._arm === 'b') {
            payment.claimed = val._value === true;
          }
        }

        console.log('[getPayment] Manually parsed payment:', payment);
        return payment;
      }

      console.log('[getPayment] Unexpected retval format');
      return null;
    } catch (error) {
      console.error('[getPayment] Error fetching payment', paymentId.toString(), ':', error);
      return null;
    }
  },

  // Get user's payments using indexing functions
  async getUserPayments(username: string) {
    const contract = getContract();

    try {
      console.log('[getUserPayments] Fetching payments for username:', username);

      // Get total count of payments for this user
      const countTx = await contract.get_payment_count({ username });
      const countResult = await countTx.simulate();
      const count = Number(countResult.result);

      console.log('[getUserPayments] Payment count:', count);

      if (count === 0) {
        console.log('[getUserPayments] No payments found');
        return [];
      }

      // Get all payment IDs for this user
      const paymentIds: bigint[] = [];
      for (let i = 0; i < count; i++) {
        try {
          const idTx = await contract.get_payment_id_at({ username, index: BigInt(i) });
          const idResult = await idTx.simulate();
          if (idResult.result) {
            console.log(`[getUserPayments] Payment ID at index ${i}:`, idResult.result.toString());
            paymentIds.push(idResult.result);
          }
        } catch (e) {
          console.error(`[getUserPayments] Error getting payment at index ${i}:`, e);
        }
      }

      console.log('[getUserPayments] Total payment IDs retrieved:', paymentIds.length);
      return paymentIds;
    } catch (error) {
      console.error('[getUserPayments] Error:', error);
      return [];
    }
  },
};

// Helper to get native XLM token address for testnet
export const getNativeTokenAddress = () => {
  return 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
};

// Helper to convert XLM to stroops
export const xlmToStroops = (xlm: number): bigint => {
  return BigInt(Math.floor(xlm * 10_000_000));
};

// Helper to convert stroops to XLM
export const stroopsToXlm = (stroops: bigint): number => {
  return Number(stroops) / 10_000_000;
};
