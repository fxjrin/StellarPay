import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as freighter from '@stellar/freighter-api';
import { contractService } from '../services/contract.service';

interface UserProfile {
  username: string;
  address: string;
  created_at: number;
}

interface AuthContextType {
  address: string | null;
  isConnected: boolean;
  profile: UserProfile | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  register: (username: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Auto-reconnect on mount if Freighter is connected
  useEffect(() => {
    const autoConnect = async () => {
      try {
        // Check if user manually disconnected
        const manualDisconnect = localStorage.getItem('wallet_manual_disconnect');
        if (manualDisconnect === 'true') {
          return;
        }

        // Check if Freighter is installed
        const isConnected = await freighter.isConnected();

        if (isConnected) {
          // Try to get address without requesting access
          const publicKey = await freighter.getAddress();

          // Extract address from object
          const addressStr = typeof publicKey === 'object' && publicKey !== null && 'address' in publicKey
            ? (publicKey as any).address
            : typeof publicKey === 'string'
            ? publicKey
            : String(publicKey);

          if (addressStr && addressStr !== 'undefined') {
            setAddress(addressStr);
          }
        }
      } catch (error) {
      }
    };

    autoConnect();
  }, []);

  // Load profile when address changes
  useEffect(() => {
    if (address) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [address]);

  const connect = async () => {
    try {

      // Clear manual disconnect flag when user connects
      localStorage.removeItem('wallet_manual_disconnect');

      // Request access first
      const result = await freighter.requestAccess();

      if (!result) {
        throw new Error('Freighter access denied');
      }

      // Get public key - Freighter returns {address: '...'} object
      const publicKey = await freighter.getAddress();

      // Extract address from object
      const addressStr = typeof publicKey === 'object' && publicKey !== null && 'address' in publicKey
        ? (publicKey as any).address
        : typeof publicKey === 'string'
        ? publicKey
        : String(publicKey);

      setAddress(addressStr);
    } catch (error) {
      throw error;
    }
  };

  const disconnect = () => {

    // Set flag to prevent auto-reconnect
    localStorage.setItem('wallet_manual_disconnect', 'true');

    // Clear state
    setAddress(null);
    setProfile(null);

  };

  const loadProfile = async () => {
    if (!address) return;

    try {
      let username = localStorage.getItem(`username_${address}`);

      // If no username in localStorage, try to get it from contract
      if (!username) {
        username = await contractService.getUsernameByAddress(address);

        if (username) {
          // Save to localStorage for future use
          localStorage.setItem(`username_${address}`, username);
        } else {
          setProfile(null);
          return;
        }
      }

      // Now load the full profile using the username
      const result = await contractService.getProfile(username);

      if (result) {
        const profileAddress = typeof result.address === 'string'
          ? result.address
          : (result.address as any)?.toString?.() || String(result.address);


        if (profileAddress === address) {
          setProfile(result as UserProfile);
        } else {
          localStorage.removeItem(`username_${address}`);
          setProfile(null);
        }
      } else {
        localStorage.removeItem(`username_${address}`);
        setProfile(null);
      }
    } catch (error) {
      setProfile(null);
    }
  };

  const register = async (username: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {

      await contractService.register(address, username);

      localStorage.setItem(`username_${address}`, username);

      await loadProfile();
    } catch (error) {
      throw error;
    }
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  const value: AuthContextType = {
    address,
    isConnected: !!address,
    profile,
    connect,
    disconnect,
    register,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
