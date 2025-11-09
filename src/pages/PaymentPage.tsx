import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { contractService, getNativeTokenAddress, xlmToStroops } from '../services/contract.service';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/layout';
import { ConnectWalletButton } from '@/components/wallet';
import { Send, Calendar, Loader2, Shield, AlertCircle } from 'lucide-react';

interface UserProfile {
  username: string;
  address: string;
  created_at: bigint;
}

export const PaymentPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { address, isConnected, connect } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    if (!username) return;

    setLoading(true);
    try {
      const result = await contractService.getProfile(username);
      if (result) {
        setProfile(result as UserProfile);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSendPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setSending(true);
    try {

      const tokenAddress = getNativeTokenAddress();
      const amountInStroops = xlmToStroops(amountNum);

      const result = await contractService.createPayment(
        address,
        username!,
        tokenAddress,
        amountInStroops,
        message || 'Payment'
      );


      setAmount('');
      setMessage('');

      toast.success(`Payment sent successfully to @${username}!`);
    } catch (error: any) {
      toast.error(`Failed to send payment: ${error.message || 'Unknown error'}`);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <PageContainer maxWidth="md" className="py-20">
        <Card className="border-2">
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer maxWidth="md" className="py-20">
        <Card className="border-2">
          <CardHeader className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-3xl">User Not Found</CardTitle>
            <CardDescription className="text-base">
              The username @{username} does not exist
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button asChild variant="outline">
              <a href="/">Go to Home</a>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="lg" className="py-12">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-4xl">@{profile.username}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2 mt-2">
              <Calendar className="w-4 h-4" />
              Member since {new Date(Number(profile.created_at) * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Payment Form */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              >
                <Send className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Send XLM Payment</CardTitle>
                <CardDescription>Send XLM securely via smart contract escrow</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                >
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardDescription className="mb-6">
                  Connect your wallet to send payments
                </CardDescription>
                <ConnectWalletButton size="lg" />
              </div>
            ) : (
              <form onSubmit={handleSendPayment} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (XLM)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.0000001"
                    min="0.0000001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="10.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Input
                    id="message"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Payment for..."
                    maxLength={100}
                  />
                </div>


                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full"
                  size="lg"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Payment...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send {amount || '0'} XLM to @{username}
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

      </div>
    </PageContainer>
  );
};
