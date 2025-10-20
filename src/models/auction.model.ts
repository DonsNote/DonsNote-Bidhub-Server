export interface Auction {
  id: string; // UUID
  title: string;
  description?: string;
  starting_price: number;
  current_price: number;
  buy_now_price?: number;
  reserve_price?: number;
  image_urls?: string[];
  seller_id: string; // UUID
  winner_id?: string; // UUID
  category_id?: string; // UUID
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  status: 'draft' | 'active' | 'ended' | 'cancelled' | 'sold';
  start_time: string;
  end_time: string;
  view_count?: number;
  bid_count?: number;
  watch_count?: number;
  shipping_cost?: number;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAuctionDTO {
  title: string;
  description?: string;
  starting_price: number;
  image_urls?: string[];
  category_id?: string;
  end_time: string;
  seller_id: string;
  condition?: string;
  location?: string;
  shipping_cost?: number;
}

export interface UpdateAuctionDTO {
  title?: string;
  description?: string;
  image_urls?: string[];
  category_id?: string;
  end_time?: string;
  condition?: string;
  location?: string;
  shipping_cost?: number;
}

export interface Bid {
  id: string; // UUID
  item_id: string; // UUID
  bidder_id: string; // UUID
  amount: number;
  is_auto_bid?: boolean;
  max_auto_bid?: number;
  created_at: string;
}
