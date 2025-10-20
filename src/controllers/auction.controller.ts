import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// 모든 경매 조회
export const getAllAuctions = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch auctions',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Featured 아이템 조회 (현재 입찰가가 높은 상위 4개)
export const getFeaturedAuctions = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('status', 'active')
      .order('current_price', { ascending: false })
      .limit(4);

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Featured auctions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured auctions',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Ending Soon 아이템 조회 (종료일이 가까운 순으로 4개)
export const getEndingSoonAuctions = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('status', 'active')
      .order('end_time', { ascending: true })
      .limit(4);

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ending soon auctions',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// 특정 경매 조회
export const getAuctionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch auction',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// 경매 생성
export const createAuction = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      starting_price,
      image_urls,
      category_id,
      end_time,
      seller_id,
      condition,
      location,
      shipping_cost,
    } = req.body;

    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          title,
          description,
          starting_price,
          current_price: starting_price,
          image_urls,
          category_id,
          end_time,
          seller_id,
          condition: condition || 'good',
          status: 'active',
          location,
          shipping_cost: shipping_cost || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Auction created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create auction',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// 입찰하기
export const placeBid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { bidAmount, bidderId } = req.body;

    // 현재 경매 정보 가져오기
    const { data: item, error: fetchError } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Auction not found',
      });
    }

    if (bidAmount <= item.current_price) {
      return res.status(400).json({
        success: false,
        message: 'Bid must be higher than current bid',
      });
    }

    // 입찰 기록 추가
    const { error: bidError } = await supabase.from('bids').insert([
      {
        item_id: id,
        bidder_id: bidderId,
        amount: bidAmount,
      },
    ]);

    if (bidError) throw bidError;

    // 경매의 현재 입찰가 및 입찰 수 업데이트
    const { data: updatedItem, error: updateError } = await supabase
      .from('items')
      .update({
        current_price: bidAmount,
        bid_count: (item.bid_count || 0) + 1,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      data: updatedItem,
      message: 'Bid placed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to place bid',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
