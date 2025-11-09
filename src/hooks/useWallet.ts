import { useState, useEffect, useCallback } from 'react';
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  signTransaction
} from '@stellar/freighter-api';

export interface WalletState {
  address: string | null;
  connected: boolean;
  loading: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    connected: false,
    loading: true,
    error: null,
  });

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { isConnected: connected } = await isConnected();
      if (connected) {
        const { isAllowed: allowed } = await isAllowed();
        if (allowed) {
          const { address } = await getAddress();
          setState({
            address,
            connected: true,
            loading: false,
            error: null,
          });
          return;
        }
      }
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to check wallet connection',
      }));
    }
  };

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check if Freighter is installed
      const { isConnected: connected } = await isConnected();
      if (!connected) {
        throw new Error('Freighter wallet not installed. Please install it from freighter.app');
      }

      // Request access (this will show Freighter popup)
      const result = await requestAccess();

      if (result.error) {
        throw new Error(result.error.message || 'Permission denied');
      }

      setState({
        address: result.address,
        connected: true,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        address: null,
        connected: false,
        loading: false,
        error: error.message || 'Failed to connect wallet',
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      connected: false,
      loading: false,
      error: null,
    });
  }, []);

  const signTx = useCallback(async (xdr: string, opts?: { network?: string; networkPassphrase?: string; address?: string }) => {
    try {
      const result = await signTransaction(xdr, {
        networkPassphrase: opts?.networkPassphrase,
        address: opts?.address,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to sign transaction');
      }

      return result.signedTxXdr;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign transaction');
    }
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    signTransaction: signTx,
  };
}
