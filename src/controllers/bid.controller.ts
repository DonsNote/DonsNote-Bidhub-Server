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

    // Get all bids for this item
    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select('*')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false });

    if (bidsError) {
      console.error('Error fetching item bids:', bidsError);
      return res.status(500).json({ error: 'Failed to fetch bids' });
    }

    if (!bids || bids.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Group bids by bidder and keep only the latest bid from each bidder
    const bidderMap = new Map();
    bids.forEach((bid: any) => {
      if (!bidderMap.has(bid.bidder_id)) {
        bidderMap.set(bid.bidder_id, bid);
      }
    });

    // Convert map to array and sort by created_at (latest first)
    const uniqueBids = Array.from(bidderMap.values()).sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Transform the data - use bidder ID's first 8 characters as identifier
    const transformedBids = uniqueBids.map((bid: any) => ({
      id: bid.id,
      bidder: `User ${bid.bidder_id.substring(0, 8)}`,
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
