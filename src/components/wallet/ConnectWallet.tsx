import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const ConnectWallet: React.FC = () => {
  const { address, isConnected, connect, disconnect } = useAuth();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      alert('Failed to connect wallet. Please install Freighter extension.');
    }
  };

  if (isConnected && address) {
    const addressStr = typeof address === 'string' ? address : String(address);
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {addressStr.substring(0, 4)}...{addressStr.substring(addressStr.length - 4)}
        </span>
        <button
          onClick={disconnect}
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
    >
      Connect Wallet
    </button>
  );
};
