import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

/**
 * Get all bids for a specific user (Bidding History)
 * GET /api/bids/my-bids/:userId
 */
export const getMyBids = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get all bids by this user with item details
    const { data: bids, error } = await supabase
      .from('bids')
      .select(`
        *,
        items:item_id (
          id,
          title,
          current_price,
          end_time,
          image_urls,
          status
        )
      `)
      .eq('bidder_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bids:', error);
      return res.status(500).json({ error: 'Failed to fetch bids' });
    }

    // Transform the data to match frontend expectations
    const transformedBids = bids?.map((bid: any) => ({
      id: bid.id,
      itemId: bid.item_id,
      name: bid.items?.title || 'Unknown Item',
      status: bid.status,
      myBid: bid.amount,
      currentBid: bid.items?.current_price || 0,
      timeLeft: bid.items?.end_time || null,
      image: bid.items?.image_urls?.[0] || '/images/placeholder.png',
      canRebid: bid.status === 'outbid',
      itemStatus: bid.items?.status || 'active'
    }));

    return res.status(200).json({
      success: true,
      data: transformedBids
    });
  } catch (error) {
    console.error('Error in getMyBids:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all items listed by a specific user (My Listings)
 * GET /api/bids/my-listings/:userId
 */
export const getMyListings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get all items sold by this user
    const { data: items, error } = await supabase
      .from('items')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      return res.status(500).json({ error: 'Failed to fetch listings' });
    }

    // Transform the data to match frontend expectations
    const transformedListings = items?.map((item: any) => ({
      id: item.id,
      name: item.title,
      highestBid: item.current_price || item.starting_price || 0,
      timeLeft: item.end_time,
      status: item.status,
      image: item.image_urls?.[0] || '/images/placeholder.png',
      bidCount: item.bid_count || 0,
      viewCount: item.view_count || 0
    }));

    return res.status(200).json({
      success: true,
      data: transformedListings
    });
  } catch (error) {
    console.error('Error in getMyListings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get bid history for a specific item
 * GET /api/bids/item/:itemId
 */
export const getItemBids = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    // Get all bids for this item with bidder info
    const { data: bids, error } = await supabase
      .from('bids')
      .select(`
        *,
        bidder:bidder_id (
          id,
          email
        )
      `)
      .eq('item_id', itemId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching item bids:', error);
      return res.status(500).json({ error: 'Failed to fetch bids' });
    }

    // Transform the data
    const transformedBids = bids?.map((bid: any) => ({
      id: bid.id,
      bidder: bid.bidder?.email?.split('@')[0] || 'Anonymous',
      amount: bid.amount,
      time: bid.created_at
    }));

    return res.status(200).json({
      success: true,
      data: transformedBids
    });
  } catch (error) {
    console.error('Error in getItemBids:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
