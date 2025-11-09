# StellarPay

A simple, username-based escrow payment system built on the Stellar blockchain. Send and receive XLM payments using easy-to-remember usernames instead of cryptographic addresses.

## Features

- **Username Registration**: Register with just a username - no complex addresses needed
- **Escrow Payments**: Send payments that are held securely until the recipient claims them
- **User Discovery**: Find and send payments to users by their @username
- **Freighter Wallet Integration**: Secure wallet connection with auto-reconnect
- **Real-time Updates**: Automatic payment status tracking
- **Stellar Network**: Fast, low-cost transactions on Stellar Testnet

## Tech Stack

### Smart Contract
- **Language**: Rust with Soroban SDK
- **Size**: ~140 lines of code
- **Functions**: 8 exported functions
- **Storage**: Persistent on-chain storage

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Wallet**: Freighter API integration
- **Notifications**: Sonner toast notifications

## Quick Start

### Prerequisites
- [Freighter Wallet](https://www.freighter.app/) browser extension
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd my-project

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Usage

1. **Install Freighter Wallet** from your browser's extension store
2. **Connect Wallet** - Click "Connect Wallet" button on the homepage
3. **Create Profile** - Register a unique username
4. **Send Payments** - Navigate to "Send Payment" and enter:
   - Recipient's username
   - Amount in XLM
   - Optional message
5. **Receive Payments** - Check "My Payments" to see incoming payments
6. **Claim Payments** - Click "Claim" on any unclaimed payment

## Smart Contract

### Deployed Contract
- **Contract ID**: `CC6THIWIYPXPQEZJ7WJSBD4DNG4HBALIVKDF53E3GS46BYFFIHUH34QV`
- **Network**: Stellar Testnet
- **Status**: Live and Ready

### Contract Functions

```rust
// User Management
register(caller: Address, username: String)
get_profile(username: String) -> Option<UserProfile>
get_username_by_address(address: Address) -> Option<String>
check_username(username: String) -> bool

// Payment Operations
create_payment(sender: Address, recipient_username: String,
               token: Address, amount: i128, message: String) -> u64
claim_payment(recipient: Address, payment_id: u64)
get_payment(payment_id: u64) -> Option<Payment>
get_user_payments(username: String) -> Vec<u64>
```

### Data Structures

```rust
pub struct UserProfile {
    pub username: String,
    pub address: Address,
    pub created_at: u64,
}

pub struct Payment {
    pub payment_id: u64,
    pub recipient_username: String,
    pub sender: Address,
    pub token: Address,
    pub amount: i128,
    pub message: String,
    pub timestamp: u64,
    pub claimed: bool,
}
```

## Development

### Building the Contract

```bash
# Navigate to contract directory
cd contracts/privacy-payment

# Build the contract
stellar contract build

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/privacy_payment.wasm \
  --network testnet \
  --source <your-identity>
```

### Generating TypeScript Bindings

```bash
stellar contract bindings typescript \
  --contract-id <CONTRACT_ID> \
  --network testnet \
  --output-dir src/contracts/privacy-payment/src \
  --overwrite
```

### Environment Variables

Create a `.env` file in the project root:

```env
PUBLIC_CONTRACT_ADDRESS="CC6THIWIYPXPQEZJ7WJSBD4DNG4HBALIVKDF53E3GS46BYFFIHUH34QV"
```

## Project Structure

```
my-project/
├── contracts/
│   └── privacy-payment/          # Soroban smart contract
│       └── src/
│           └── lib.rs            # Main contract code
├── src/
│   ├── components/               # React components
│   │   ├── layout/               # Header, Footer
│   │   ├── profile/              # Profile creation
│   │   ├── ui/                   # UI primitives
│   │   └── wallet/               # Wallet connection
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.tsx       # Authentication logic
│   ├── pages/                    # Route pages
│   │   ├── Home.tsx              # Landing page
│   │   ├── Dashboard.tsx         # User dashboard
│   │   ├── PaymentPage.tsx       # Send payment
│   │   └── MyPayments.tsx        # View/claim payments
│   ├── services/                 # Business logic
│   │   └── contract.service.ts   # Contract interactions
│   └── main.tsx                  # App entry point
└── README.md
```

## Key Features Implementation

### Authentication Flow
- Auto-reconnect on page load if wallet was previously connected
- Manual disconnect with flag to prevent auto-reconnect
- Profile loading from contract with localStorage caching
- Address-to-username reverse lookup for seamless UX

### Payment Flow
1. **Send**: User enters recipient username, amount, and message
2. **Escrow**: Funds are transferred to contract and held in escrow
3. **Notify**: Payment ID is generated and indexed by recipient username
4. **Claim**: Recipient views payment and claims funds to their wallet

### Error Handling
- Username availability checking before registration
- Address validation and matching
- Transaction simulation before submission
- User-friendly error messages via toast notifications

## Architecture Decisions

### Why Username-Based?
- **Usability**: Easier to remember than 56-character addresses
- **Discovery**: Users can find each other without sharing addresses
- **Familiarity**: Similar UX to traditional payment apps

### Why Escrow?
- **Security**: Recipient must claim payment explicitly
- **Flexibility**: Payments can be indexed before claim
- **Auditability**: Clear payment lifecycle tracking

### Why Stellar?
- **Speed**: 5-second transaction finality
- **Cost**: Minimal transaction fees (~0.00001 XLM)
- **Ecosystem**: Mature tooling and wallet support

## Roadmap

### Current Version (v1.0)
- ✅ Username registration
- ✅ Escrow payment creation
- ✅ Payment claiming
- ✅ Payment history
- ✅ Wallet integration

### Future Enhancements
- Multi-token support (USDC, other assets)
- Payment notifications
- Transaction history export
- Mobile responsive improvements
- Payment request feature
- Recurring payments

## Deployment

### Vercel (Recommended)

The easiest way to deploy StellarPay is using Vercel.

#### Quick Deploy

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository: `fxjrin/StellarPay`
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

3. **Done!** Your site will be live at: `https://stellar-pay-<random>.vercel.app`

#### Local Build

To build locally:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Smart Contracts](https://soroban.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)
- [Scaffold Stellar](https://scaffoldstellar.org/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with Scaffold Stellar
