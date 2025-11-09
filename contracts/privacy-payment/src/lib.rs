#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Vec, symbol_short};

/// User profile
#[contracttype]
#[derive(Clone, Debug)]
pub struct UserProfile {
    pub username: String,
    pub address: Address,
    pub created_at: u64,
}

/// Payment record
#[contracttype]
#[derive(Clone, Debug)]
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

#[contract]
pub struct SimplePaymentContract;

#[contractimpl]
impl SimplePaymentContract {
    /// Register user
    pub fn register(env: Env, caller: Address, username: String) {
        caller.require_auth();

        if env.storage().persistent().has(&(symbol_short!("UMAP"), username.clone())) {
            panic!("Username already exists");
        }

        let profile = UserProfile {
            username: username.clone(),
            address: caller.clone(),
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&(symbol_short!("USER"), username.clone()), &profile);
        env.storage().persistent().set(&(symbol_short!("UMAP"), username.clone()), &true);
        env.storage().persistent().set(&(symbol_short!("ADDR"), caller), &username);

        env.events().publish((symbol_short!("register"),), username);
    }
    
    /// Get user profile
    pub fn get_profile(env: Env, username: String) -> Option<UserProfile> {
        env.storage().persistent().get(&(symbol_short!("USER"), username))
    }

    /// Get username by address
    pub fn get_username_by_address(env: Env, address: Address) -> Option<String> {
        env.storage().persistent().get(&(symbol_short!("ADDR"), address))
    }

    /// Check if username is available
    pub fn check_username(env: Env, username: String) -> bool {
        !env.storage().persistent().has(&(symbol_short!("UMAP"), username))
    }
    
    /// Create escrow payment
    pub fn create_payment(
        env: Env,
        sender: Address,
        recipient_username: String,
        token: Address,
        amount: i128,
        message: String,
    ) -> u64 {
        sender.require_auth();

        let payment_id = env.ledger().timestamp();

        let contract_address = env.current_contract_address();
        let token_client = token::TokenClient::new(&env, &token);
        token_client.transfer(&sender, &contract_address, &amount);

        let payment = Payment {
            payment_id,
            recipient_username: recipient_username.clone(),
            sender: sender.clone(),
            token: token.clone(),
            amount,
            message,
            timestamp: payment_id,
            claimed: false,
        };

        env.storage().persistent().set(&(symbol_short!("PAY"), payment_id), &payment);

        let key = (symbol_short!("UPAY"), recipient_username.clone());
        let mut user_payments: Vec<u64> = match env.storage().persistent().get(&key) {
            Some(payments) => payments,
            None => Vec::new(&env),
        };
        user_payments.push_back(payment_id);
        env.storage().persistent().set(&(symbol_short!("UPAY"), recipient_username), &user_payments);

        env.events().publish((symbol_short!("payment"),), (payment_id, amount));

        payment_id
    }
    
    /// Claim payment
    pub fn claim_payment(env: Env, recipient: Address, payment_id: u64) {
        recipient.require_auth();

        let payment_opt: Option<Payment> = env.storage().persistent()
            .get(&(symbol_short!("PAY"), payment_id));

        if let Some(mut payment) = payment_opt {
            if !payment.claimed {
                let contract_address = env.current_contract_address();
                let token_client = token::TokenClient::new(&env, &payment.token);
                token_client.transfer(&contract_address, &recipient, &payment.amount);

                payment.claimed = true;
                env.storage().persistent().set(&(symbol_short!("PAY"), payment_id), &payment);

                env.events().publish((symbol_short!("claimed"),), payment_id);
            }
        }
    }
    
    /// Get payment
    pub fn get_payment(env: Env, payment_id: u64) -> Option<Payment> {
        env.storage().persistent().get(&(symbol_short!("PAY"), payment_id))
    }

    /// Get user payments
    pub fn get_user_payments(env: Env, username: String) -> Vec<u64> {
        match env.storage().persistent().get(&(symbol_short!("UPAY"), username)) {
            Some(payments) => payments,
            None => Vec::new(&env),
        }
    }
}
