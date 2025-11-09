import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Home, Send, Inbox, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import stellarLogo from '@/images/stellar-xlm-logo.svg';

export const Header: React.FC = () => {
  const { isConnected, address, profile, disconnect } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleDisconnect = () => {
    disconnect();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: User, requiresAuth: true },
    { to: '/my-payments', label: 'My Payments', icon: Inbox, requiresAuth: true },
  ];

  const visibleNavLinks = navLinks.filter(link => !link.requiresAuth || isConnected);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <img
              src={stellarLogo}
              alt="Stellar"
              className="w-8 h-8"
            />
            <span
              style={{
                background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              StellarPay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <>
                {profile && (
                  <Badge variant="secondary" className="font-mono">
                    @{profile.username}
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Link to="/dashboard">
                <Button size="sm">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary px-2 py-2"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="border-t pt-4 space-y-3">
              {isConnected ? (
                <>
                  {profile && (
                    <div className="px-2">
                      <Badge variant="secondary" className="font-mono">
                        @{profile.username}
                      </Badge>
                    </div>
                  )}
                  <Button variant="outline" size="sm" onClick={handleDisconnect} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </>
              ) : (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
