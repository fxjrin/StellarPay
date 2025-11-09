import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Zap, DollarSign, ArrowRight, Rocket, Shield, Check } from 'lucide-react';

export const Home: React.FC = () => {
  const { isConnected, profile } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)'
        }}
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 backdrop-blur-sm text-white border-white text-base"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
            >
              <Rocket className="h-4 w-4 mr-2 inline-block" />
              Built on Stellar Blockchain
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Secure Escrow Payments
              <br />
              <span className="text-white/90">
                Made Simple
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Send XLM payments securely with smart contract escrow. Fast, transparent, and trustless.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isConnected ? (
                <Badge
                  variant="outline"
                  className="px-6 py-3 backdrop-blur-sm text-white border-white text-base"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Connect wallet to get started
                </Badge>
              ) : profile ? (
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 shadow-lg"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#3b82f6'
                  }}
                >
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 py-6 shadow-lg"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#3b82f6'
                  }}
                >
                  <Link to="/profile/create">
                    Create Profile
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}

              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 text-white border-white"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.4)'
                }}
              >
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-auto" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#ffffff"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Use Our Platform?</h2>
            <p className="text-xl text-muted-foreground">Simple, secure, and powered by Stellar smart contracts</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2">
              <CardHeader>
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Smart Contract Escrow</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Your XLM is held safely in a Soroban smart contract until the recipient claims it. No middlemen, no trust required.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2">
              <CardHeader>
                <div className="w-14 h-14 bg-success rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Powered by Stellar's high-performance blockchain. Send payments that settle in seconds, not hours.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2">
              <CardHeader>
                <div className="w-14 h-14 bg-stellar rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Low Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Minimal transaction costs thanks to Stellar's efficient consensus. More money goes where it should - to the recipient.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="border-2" style={{ backgroundColor: 'rgba(241, 245, 249, 0.3)' }}>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold">How It Works</CardTitle>
              <p className="text-muted-foreground mt-2">Get started in 4 simple steps</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="relative">
                  <Card className="h-full border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg">
                        1
                      </div>
                      <h4 className="font-bold mb-2 text-lg">Connect Wallet</h4>
                      <p className="text-muted-foreground text-sm">Use Freighter wallet to connect to the platform</p>
                    </CardContent>
                  </Card>
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5" style={{ backgroundColor: '#e5e7eb' }}></div>
                </div>

                <div className="relative">
                  <Card className="h-full border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-success text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg">
                        2
                      </div>
                      <h4 className="font-bold mb-2 text-lg">Register Username</h4>
                      <p className="text-muted-foreground text-sm">Create your unique username on-chain</p>
                    </CardContent>
                  </Card>
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5" style={{ backgroundColor: '#e5e7eb' }}></div>
                </div>

                <div className="relative">
                  <Card className="h-full border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-stellar text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg">
                        3
                      </div>
                      <h4 className="font-bold mb-2 text-lg">Send Payment</h4>
                      <p className="text-muted-foreground text-sm">Send XLM to any username via escrow</p>
                    </CardContent>
                  </Card>
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5" style={{ backgroundColor: '#e5e7eb' }}></div>
                </div>

                <div>
                  <Card className="h-full border-2 hover:shadow-lg transition-all">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-warning text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg">
                        4
                      </div>
                      <h4 className="font-bold mb-2 text-lg">Claim Funds</h4>
                      <p className="text-muted-foreground text-sm">Recipient claims XLM from smart contract</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="text-white py-20"
        style={{
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8" style={{ opacity: 0.8 }}>
              Join the future of secure payments on Stellar blockchain
            </p>
            {!profile && (
              <Button
                asChild
                size="lg"
                className="text-lg px-10 py-6 shadow-xl"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#3b82f6'
                }}
                onClick={(e) => {
                  if (!isConnected) {
                    e.preventDefault();
                    alert('Please connect your wallet first');
                  }
                }}
              >
                <Link to={isConnected ? "/profile/create" : "#"}>
                  Create Your Profile Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
