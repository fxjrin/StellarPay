import React from 'react';
import { Copy, Check, ExternalLink, User, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export const WalletInfo: React.FC = () => {
  const { address, profile } = useAuth();
  const [copied, setCopied] = React.useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://stellar.expert/explorer/testnet/account/${address}`, '_blank');
    }
  };

  if (!address) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Wallet Information</span>
        </CardTitle>
        <CardDescription>Your connected Stellar wallet details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p className="text-lg font-semibold">@{profile.username}</p>
              </div>
              <Badge variant="secondary">Registered</Badge>
            </div>
            {profile.created_at && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(Number(profile.created_at) * 1000).toLocaleDateString()}</span>
              </div>
            )}
            <Separator />
          </>
        )}

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Wallet Address</p>
          <div className="flex items-center space-x-2">
            <code className="flex-1 text-xs bg-muted px-3 py-2 rounded-md font-mono break-all">
              {address}
            </code>
            <Button variant="outline" size="icon" onClick={copyAddress}>
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={openExplorer} className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Stellar Explorer
        </Button>
      </CardContent>
    </Card>
  );
};
