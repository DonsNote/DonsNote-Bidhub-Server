/**
 * Auction/Item related type definitions
 */

export interface Item {
  id: string;
  title: string;
  description: string;
  starting_price: number;
  current_price: number;
  reserve_price?: number;
  image_urls: string[];
  seller_id: string;
  category_id?: string;
  status: ItemStatus;
  end_time: string;
  created_at: string;
  bid_count: number;
  view_count: number;
  condition?: string;
  location?: string;
  shipping_cost?: number;
}

export type ItemStatus = 'active' | 'sold' | 'expired' | 'cancelled';

export interface CreateItemDto {
  title: string;
  description: string;
  starting_price: number;
  reserve_price?: number;
  image_urls: string[];
  seller_id: string;
  category_id?: string;
  end_time: string;
  condition?: string;
  location?: string;
  shipping_cost?: number;
}

export interface UpdateItemDto {
  title?: string;
  description?: string;
  current_price?: number;
  status?: ItemStatus;
  bid_count?: number;
  view_count?: number;
}

export interface ItemResponse {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  startingBid: number;
  reservePrice?: number;
  timeLeft: string | null;
  images: string[];
  condition?: string;
  location?: string;
  shippingCost?: number;
  bidCount: number;
  viewCount: number;
  sellerId: string;
}

export interface FeaturedItemResponse {
  id: string;
  title: string;
  currentBid: number;
  timeLeft: string | null;
  image: string;
  bidCount: number;
}
