import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

/**
 * Get all trade offers for a specific item
 * GET /api/trade-offers/item/:itemId
 */
export const getTradeOffersByItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    // Get all trade offers for this item
    const { data: tradeOffers, error } = await supabase
      .from('trade_offers')
      .select('*')
      .eq('item_id', itemId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trade offers:', error);
      return res.status(500).json({ error: 'Failed to fetch trade offers' });
    }

    // Transform the data to match frontend expectations
    const transformedOffers = tradeOffers?.map((offer: any) => ({
      id: offer.id,
      itemId: offer.item_id,
      offererId: offer.offerer_id,
      title: offer.offer_item_title,
      description: offer.offer_item_description,
      estimatedValue: offer.offer_item_value,
      imageUrl: offer.offer_item_image_url,
      status: offer.status,
      createdAt: offer.created_at
    }));

    return res.status(200).json({
      success: true,
      data: transformedOffers
    });
  } catch (error) {
    console.error('Error in getTradeOffersByItem:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create a new trade offer
 * POST /api/trade-offers
 */
export const createTradeOffer = async (req: Request, res: Response) => {
  try {
    const { itemId, offererId, title, description, estimatedValue, imageUrl } = req.body;

    if (!itemId || !offererId || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert new trade offer
    const { data: newOffer, error } = await supabase
      .from('trade_offers')
      .insert([
        {
          item_id: itemId,
          offerer_id: offererId,
          offer_item_title: title,
          offer_item_description: description,
          offer_item_value: estimatedValue,
          offer_item_image_url: imageUrl,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating trade offer:', error);
      return res.status(500).json({ error: 'Failed to create trade offer' });
    }

    return res.status(201).json({
      success: true,
      data: {
        id: newOffer.id,
        itemId: newOffer.item_id,
        offererId: newOffer.offerer_id,
        title: newOffer.offer_item_title,
        description: newOffer.offer_item_description,
        estimatedValue: newOffer.offer_item_value,
        imageUrl: newOffer.offer_item_image_url,
        status: newOffer.status,
        createdAt: newOffer.created_at
      }
    });
  } catch (error) {
    console.error('Error in createTradeOffer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
