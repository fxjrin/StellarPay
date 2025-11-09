import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Inbox,
  BarChart3,
  Copy,
  Check,
  Calendar,
  Wallet,
  UserPlus,
  ArrowRight,
  Sparkles,
  Clock
} from 'lucide-react';
import { ConnectWalletButton } from '@/components/wallet';
import { PageContainer } from '@/components/layout';
import { toast } from 'sonner';

export const Dashboard: React.FC = () => {
  const { isConnected, profile, address } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const handleSendPayment = () => {
    if (username.trim()) {
      navigate(`/${username.trim()}`);
    } else {
      toast.error('Please enter a username');
    }
  };

  const copyProfileLink = async () => {
    const link = `${window.location.origin}/${profile?.username}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
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
            <CardTitle className="text-3xl">Welcome to StellarPay</CardTitle>
            <CardDescription className="text-base">
              Connect your Freighter wallet to access your dashboard
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
            <CardTitle className="text-3xl">Create Your Profile</CardTitle>
            <CardDescription className="text-base">
              Register a username to start sending and receiving XLM payments
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button asChild size="lg">
              <Link to="/profile/create">
                Create Profile
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl" className="py-8">
      <div className="space-y-8">
        {/* Profile Header */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-4xl">@{profile.username}</CardTitle>
                  <Badge variant="secondary" className="text-sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  {address && (
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {address.substring(0, 20)}...{address.substring(address.length - 10)}
                    </code>
                  )}
                </CardDescription>
              </div>
              {profile.created_at && (
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Member since</span>
                  </div>
                  <p className="font-medium text-foreground mt-1">
                    {new Date(Number(profile.created_at) * 1000).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div className="flex items-center gap-2">
              <Input
                value={`${window.location.origin}/${profile.username}`}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyProfileLink}>
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share this link to receive payments
            </p>
          </CardContent>
        </Card>

        {/* Quick Send */}
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
                <CardTitle className="text-2xl">Quick Send</CardTitle>
                <CardDescription>Send XLM to any registered username</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendPayment()}
                className="flex-1"
              />
              <Button onClick={handleSendPayment} size="lg">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* My Payments Card */}
          <Card
            className="border-2 transition-all duration-300 cursor-pointer group overflow-hidden"
            onClick={() => navigate('/my-payments')}
            style={{
              borderColor: '#e5e7eb'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: '#10b981' }}
                >
                  <Inbox className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-1">My Payments</CardTitle>
                  <CardDescription className="text-sm">View and claim your payments</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground group-hover:text-success transition-colors">
                <span className="font-medium">View Payments</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>

          {/* Analytics Card - Coming Soon */}
          <Card className="border-2 relative overflow-hidden" style={{ borderColor: '#e5e7eb', opacity: 0.6 }}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#f1f5f9' }}
                >
                  <BarChart3 className="w-7 h-7 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-1">Analytics</CardTitle>
                  <CardDescription className="text-sm">Track your payment history</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-medium">Coming Soon</span>
                <Clock className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </PageContainer>
  );
};
