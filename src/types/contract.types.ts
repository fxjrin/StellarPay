/**
 * TypeScript types for Privacy Payment Contract
 * Generated from Soroban contract types
 */

export interface UserProfile {
  address: string;
  username: string;
  display_name: string;
  created_at: bigint;
  total_received: bigint;
  payment_count: number;
  is_active: boolean;
}

export interface Payment {
  payment_id: string; // BytesN<32> as hex string
  recipient_username: string;
  sender: string | null;
  token: string;
  amount: bigint;
  message: string;
  timestamp: bigint;
  claimed: boolean;
  claimed_at: bigint | null;
}

export enum ContractError {
  // User Profile Errors (1xx)
  UsernameAlreadyExists = 100,
  UsernameNotFound = 101,
  InvalidUsername = 102,
  UserAlreadyRegistered = 103,
  DisplayNameTooLong = 104,
  Unauthorized = 105,

  // Payment Errors (2xx)
  PaymentNotFound = 200,
  PaymentAlreadyClaimed = 201,
  InvalidAmount = 202,
  MessageTooLong = 203,
  InvalidToken = 204,
  RecipientNotFound = 205,
  NotRecipient = 206,

  // Security Errors (3xx)
  ContractPaused = 300,
  RateLimitExceeded = 301,
  InvalidAddress = 302,

  // Storage Errors (4xx)
  StorageError = 400,
  DataNotFound = 401,

  // General Errors (9xx)
  InternalError = 900,
}

export const ERROR_MESSAGES: Record<ContractError, string> = {
  [ContractError.UsernameAlreadyExists]: "This username is already taken",
  [ContractError.UsernameNotFound]: "Username not found",
  [ContractError.InvalidUsername]: "Username must be 3-30 characters (alphanumeric and underscore only)",
  [ContractError.UserAlreadyRegistered]: "You already have a profile",
  [ContractError.DisplayNameTooLong]: "Display name must be 100 characters or less",
  [ContractError.Unauthorized]: "You are not authorized to perform this action",
  [ContractError.PaymentNotFound]: "Payment not found",
  [ContractError.PaymentAlreadyClaimed]: "Payment has already been claimed",
  [ContractError.InvalidAmount]: "Amount must be greater than zero",
  [ContractError.MessageTooLong]: "Message must be 500 characters or less",
  [ContractError.InvalidToken]: "Invalid token address",
  [ContractError.RecipientNotFound]: "Recipient username does not exist",
  [ContractError.NotRecipient]: "You are not the recipient of this payment",
  [ContractError.ContractPaused]: "Contract is currently paused",
  [ContractError.RateLimitExceeded]: "Too many payments. Please wait a few minutes.",
  [ContractError.InvalidAddress]: "Invalid address format",
  [ContractError.StorageError]: "Storage operation failed",
  [ContractError.DataNotFound]: "Data not found",
  [ContractError.InternalError]: "Internal error occurred",
};
