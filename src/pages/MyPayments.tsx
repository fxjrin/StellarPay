import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { contractService, stroopsToXlm } from '../services/contract.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageContainer } from '@/components/layout';
import { ConnectWalletButton } from '@/components/wallet';
import {
  Inbox,
  RefreshCw,
  Loader2,
  Check,
  Clock,
  Calendar,
  Send as SendIcon,
  Wallet,
  UserPlus,
  ArrowRight
} from 'lucide-react';

interface Payment {
  payment_id: bigint;
  recipient_username: string;
  sender: string;
  token: string;
  amount: bigint;
  message: string;
  timestamp: bigint;
  claimed: boolean;
}

export const MyPayments: React.FC = () => {
  const { profile, isConnected, address } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<bigint | null>(null);

  useEffect(() => {
    if (profile?.username) {
      loadPayments();
    }
  }, [profile]);

  const loadPayments = async () => {
    if (!profile?.username) return;

    setLoading(true);
    try {

      // Get payment IDs for this user from contract
      const paymentIds = await contractService.getUserPayments(profile.username);

      // Load each payment detail
      const paymentDetails = await Promise.all(
        paymentIds.map(async (id) => {
          const payment = await contractService.getPayment(id);
          return payment;
        })
      );

      // Filter out nulls and set state
      const validPayments = paymentDetails.filter(p => p !== null) as Payment[];
      setPayments(validPayments);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (paymentId: bigint) => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }

    setClaiming(paymentId);
    const toastId = toast.loading('Claiming payment...');

    try {

      await contractService.claimPayment(address, paymentId);

      toast.success('Payment claimed successfully!', { id: toastId });

      // Reload payments
      await loadPayments();
    } catch (error: any) {
      toast.error(`Failed to claim payment: ${error.message || 'Unknown error'}`, { id: toastId });
    } finally {
      setClaiming(null);
    }
  };

  if (!isConnected) {
    return (
      <PageContainer maxWidth="md" className="py-20">
        <Card className="border-2">
          <CardHeader className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
            >
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Connect Wallet</CardTitle>
            <CardDescription className="text-base">
              Please connect your wallet to view your payments
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <ConnectWalletButton size="lg" />
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
              style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
            >
              <UserPlus className="w-8 h-8 text-stellar" />
            </div>
            <CardTitle className="text-3xl">No Profile</CardTitle>
            <CardDescription className="text-base">
              Please register a username first
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button asChild size="lg">
              <a href="/profile/create">
                Create Profile
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const unclaimedPayments = payments.filter(p => !p.claimed);
  const claimedPayments = payments.filter(p => p.claimed);

  return (
    <PageContainer maxWidth="xl" className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">My Payments</h1>
            <p className="text-muted-foreground mt-1">
              Manage and claim your incoming payments
            </p>
          </div>
          <Button
            onClick={loadPayments}
            disabled={loading}
            variant="outline"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>

        {/* Payments Tabs */}
        <Tabs defaultValue="unclaimed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unclaimed" className="gap-2">
              <Clock className="w-4 h-4" />
              Unclaimed ({unclaimedPayments.length})
            </TabsTrigger>
            <TabsTrigger value="claimed" className="gap-2">
              <Check className="w-4 h-4" />
              Claimed ({claimedPayments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unclaimed" className="space-y-4 mt-6">
            {loading ? (
              <Card className="border-2">
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                    <p className="text-muted-foreground">Loading payments...</p>
                  </div>
                </CardContent>
              </Card>
            ) : unclaimedPayments.length === 0 ? (
              <Card className="border-2">
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl mb-2">No Unclaimed Payments</CardTitle>
                  <CardDescription>
                    Share your username (@{profile.username}) to receive payments!
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              unclaimedPayments.map((payment) => (
                <Card
                  key={payment.payment_id.toString()}
                  className="border-2"
                  style={{
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)'
                  }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-3xl font-bold">
                          {stroopsToXlm(payment.amount)} XLM
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <SendIcon className="w-4 h-4" />
                          From: <code className="text-xs bg-muted px-2 py-1 rounded">{payment.sender.substring(0, 12)}...{payment.sender.substring(payment.sender.length - 6)}</code>
                        </CardDescription>
                      </div>
                      <Badge className="bg-success text-success-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        Unclaimed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {payment.message && (
                      <>
                        <Separator />
                        <div>
                          <Label className="text-xs text-muted-foreground">Message</Label>
                          <p className="mt-1 text-sm">{payment.message}</p>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(Number(payment.timestamp) * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <code className="text-xs">ID: {payment.payment_id.toString()}</code>
                    </div>

                    <Button
                      onClick={() => handleClaim(payment.payment_id)}
                      disabled={claiming === payment.payment_id}
                      className="w-full"
                      size="lg"
                    >
                      {claiming === payment.payment_id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Claim Payment
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="claimed" className="space-y-4 mt-6">
            {loading ? (
              <Card className="border-2">
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                    <p className="text-muted-foreground">Loading payments...</p>
                  </div>
                </CardContent>
              </Card>
            ) : claimedPayments.length === 0 ? (
              <Card className="border-2">
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl mb-2">No Claimed Payments</CardTitle>
                  <CardDescription>
                    Claimed payments will appear here
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              claimedPayments.map((payment) => (
                <Card key={payment.payment_id.toString()} className="border-2 opacity-75">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {stroopsToXlm(payment.amount)} XLM
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <SendIcon className="w-4 h-4" />
                          From: <code className="text-xs bg-muted px-2 py-1 rounded">{payment.sender.substring(0, 12)}...{payment.sender.substring(payment.sender.length - 6)}</code>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        <Check className="w-3 h-3 mr-1" />
                        Claimed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {payment.message && (
                      <>
                        <Separator />
                        <div>
                          <Label className="text-xs text-muted-foreground">Message</Label>
                          <p className="mt-1 text-sm">{payment.message}</p>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(Number(payment.timestamp) * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <code className="text-xs">ID: {payment.payment_id.toString()}</code>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

      </div>
    </PageContainer>
  );
};
