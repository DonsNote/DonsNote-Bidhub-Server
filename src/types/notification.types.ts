/**
 * Notification Types
 * 알림 시스템을 위한 타입 정의
 */

export enum NotificationType {
  BID_PLACED = 'bid_placed',
  BID_OUTBID = 'bid_outbid',
  AUCTION_ENDING = 'auction_ending',
  AUCTION_WON = 'auction_won',
  AUCTION_LOST = 'auction_lost',
  TRADE_OFFER = 'trade_offer',
  TRADE_ACCEPTED = 'trade_accepted',
  TRADE_REJECTED = 'trade_rejected',
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
  metadata?: {
    auction_id?: string;
    item_title?: string;
    bid_amount?: number;
    bidder_id?: string;
    bidder_name?: string;
    trade_offer_id?: string;
  };
}

export interface NotificationCreateInput {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Notification['metadata'];
}
