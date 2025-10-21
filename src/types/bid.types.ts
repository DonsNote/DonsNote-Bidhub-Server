/**
 * Bid related type definitions
 */

export interface Bid {
  id: string;
  item_id: string;
  bidder_id: string;
  amount: number;
  status: BidStatus;
  created_at: string;
}

export type BidStatus = 'active' | 'outbid' | 'won' | 'lost';

export interface CreateBidDto {
  item_id: string;
  bidder_id: string;
  amount: number;
}

export interface UpdateBidDto {
  status?: BidStatus;
  amount?: number;
}

export interface BidHistoryResponse {
  id: string;
  bidder: string;
  amount: number;
  time: string;
}

export interface MyBidResponse {
  id: string;
  itemId: string;
  name: string;
  status: string;
  myBid: number;
  currentBid: number;
  timeLeft: string | null;
  image: string;
  canRebid: boolean;
  itemStatus: string;
}

export interface MyListingResponse {
  id: string;
  name: string;
  highestBid: number;
  timeLeft: string | null;
  status: string;
  image: string;
  bidCount: number;
  viewCount: number;
}
