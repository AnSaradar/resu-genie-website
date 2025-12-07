/**
 * Token service types matching backend DTOs
 */

export interface TokenBalanceResponse {
  tokens_remaining: number;
  total_tokens_used: number;
  tokens_last_updated_at: string | null;
}

export interface TokenBalanceApiResponse {
  signal: string;
  data: TokenBalanceResponse;
}

