import React from 'react';
import { Github, Twitter, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">StellarPay</h3>
            <p className="text-sm text-muted-foreground">
              Secure escrow payments on the Stellar blockchain. Send XLM to anyone with just a username.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/my-payments" className="hover:text-primary transition-colors">
                  My Payments
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center space-x-2"
                >
                  <Globe className="h-4 w-4" />
                  <span>Stellar Network</span>
                </a>
              </li>
              <li>
                <a
                  href="https://soroban.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center space-x-2"
                >
                  <Globe className="h-4 w-4" />
                  <span>Soroban Docs</span>
                </a>
              </li>
              <li>
                <a
                  href="https://scaffoldstellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center space-x-2"
                >
                  <Globe className="h-4 w-4" />
                  <span>Scaffold Stellar</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} StellarPay. Built on Stellar blockchain.
          </p>
          <p className="text-xs text-muted-foreground">
            Testnet Contract: CC6T...H34QV
          </p>
        </div>
      </div>
    </footer>
  );
};
