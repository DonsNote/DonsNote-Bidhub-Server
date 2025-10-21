/**
 * Trade Offer related type definitions
 */

export interface TradeOffer {
  id: string;
  item_id: string;
  offerer_id: string;
  title: string;
  description: string;
  estimated_value: number;
  image_url: string;
  status: TradeOfferStatus;
  created_at: string;
}

export type TradeOfferStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface CreateTradeOfferDto {
  item_id: string;
  offerer_id: string;
  title: string;
  description: string;
  estimated_value: number;
  image_url: string;
}

export interface UpdateTradeOfferDto {
  status?: TradeOfferStatus;
  description?: string;
  estimated_value?: number;
}

export interface TradeOfferResponse {
  id: string;
  itemId: string;
  offererId: string;
  title: string;
  description: string;
  estimatedValue: number;
  imageUrl: string;
  status: TradeOfferStatus;
  createdAt: string;
}
