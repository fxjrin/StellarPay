import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConnectWalletButtonProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  fullWidth?: boolean;
}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  className,
  size = 'default',
  variant = 'default',
  fullWidth = false,
}) => {
  const { isConnected, isConnecting, connect } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connect();
    } finally {
      setLoading(false);
    }
  };

  if (isConnected) {
    return null;
  }

  const isLoadingState = loading || isConnecting;

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoadingState}
      size={size}
      variant={variant}
      className={cn(fullWidth && 'w-full', className)}
    >
      {isLoadingState ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};
