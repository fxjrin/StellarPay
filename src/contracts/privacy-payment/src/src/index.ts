import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CC6THIWIYPXPQEZJ7WJSBD4DNG4HBALIVKDF53E3GS46BYFFIHUH34QV",
  }
} as const


export interface UserProfile {
  address: string;
  created_at: u64;
  username: string;
}


export interface Payment {
  amount: i128;
  claimed: boolean;
  message: string;
  payment_id: u64;
  recipient_username: string;
  sender: string;
  timestamp: u64;
  token: string;
}

export interface Client {
  /**
   * Construct and simulate a register transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Register user
   */
  register: ({caller, username}: {caller: string, username: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_profile transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get profile
   */
  get_profile: ({username}: {username: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<UserProfile>>>

  /**
   * Construct and simulate a create_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Create payment with REAL escrow
   */
  create_payment: ({sender, recipient_username, token, amount, message}: {sender: string, recipient_username: string, token: string, amount: i128, message: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_payment_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get payment count for user
   */
  get_payment_count: ({username}: {username: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_payment_id_at transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get payment ID at index for user
   */
  get_payment_id_at: ({username, index}: {username: string, index: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<u64>>>

  /**
   * Construct and simulate a claim_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Claim payment
   */
  claim_payment: ({recipient, payment_id}: {recipient: string, payment_id: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get payment by ID
   */
  get_payment: ({payment_id}: {payment_id: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Payment>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAC1VzZXJQcm9maWxlAAAAAAMAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAAAAAAKY3JlYXRlZF9hdAAAAAAABgAAAAAAAAAIdXNlcm5hbWUAAAAQ",
        "AAAAAQAAAAAAAAAAAAAAB1BheW1lbnQAAAAACAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAdjbGFpbWVkAAAAAAEAAAAAAAAAB21lc3NhZ2UAAAAAEAAAAAAAAAAKcGF5bWVudF9pZAAAAAAABgAAAAAAAAAScmVjaXBpZW50X3VzZXJuYW1lAAAAAAAQAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAYAAAAAAAAABXRva2VuAAAAAAAAEw==",
        "AAAAAAAAAA1SZWdpc3RlciB1c2VyAAAAAAAACHJlZ2lzdGVyAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAh1c2VybmFtZQAAABAAAAAA",
        "AAAAAAAAAAtHZXQgcHJvZmlsZQAAAAALZ2V0X3Byb2ZpbGUAAAAAAQAAAAAAAAAIdXNlcm5hbWUAAAAQAAAAAQAAA+gAAAfQAAAAC1VzZXJQcm9maWxlAA==",
        "AAAAAAAAAB9DcmVhdGUgcGF5bWVudCB3aXRoIFJFQUwgZXNjcm93AAAAAA5jcmVhdGVfcGF5bWVudAAAAAAABQAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAABJyZWNpcGllbnRfdXNlcm5hbWUAAAAAABAAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAdtZXNzYWdlAAAAABAAAAABAAAABg==",
        "AAAAAAAAABpHZXQgcGF5bWVudCBjb3VudCBmb3IgdXNlcgAAAAAAEWdldF9wYXltZW50X2NvdW50AAAAAAAAAQAAAAAAAAAIdXNlcm5hbWUAAAAQAAAAAQAAAAY=",
        "AAAAAAAAACBHZXQgcGF5bWVudCBJRCBhdCBpbmRleCBmb3IgdXNlcgAAABFnZXRfcGF5bWVudF9pZF9hdAAAAAAAAAIAAAAAAAAACHVzZXJuYW1lAAAAEAAAAAAAAAAFaW5kZXgAAAAAAAAGAAAAAQAAA+gAAAAG",
        "AAAAAAAAAA1DbGFpbSBwYXltZW50AAAAAAAADWNsYWltX3BheW1lbnQAAAAAAAACAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAApwYXltZW50X2lkAAAAAAAGAAAAAA==",
        "AAAAAAAAABFHZXQgcGF5bWVudCBieSBJRAAAAAAAAAtnZXRfcGF5bWVudAAAAAABAAAAAAAAAApwYXltZW50X2lkAAAAAAAGAAAAAQAAA+gAAAfQAAAAB1BheW1lbnQA" ]),
      options
    )
  }
  public readonly fromJSON = {
    register: this.txFromJSON<null>,
        get_profile: this.txFromJSON<Option<UserProfile>>,
        create_payment: this.txFromJSON<u64>,
        get_payment_count: this.txFromJSON<u64>,
        get_payment_id_at: this.txFromJSON<Option<u64>>,
        claim_payment: this.txFromJSON<null>,
        get_payment: this.txFromJSON<Option<Payment>>
  }
}