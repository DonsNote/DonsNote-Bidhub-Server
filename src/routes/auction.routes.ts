import { Router } from 'express';
import {
  getAllAuctions,
  getFeaturedAuctions,
  getEndingSoonAuctions,
  getAuctionById,
  createAuction,
  placeBid,
} from '../controllers/auction.controller';

const router = Router();

// GET routes
router.get('/', getAllAuctions);
router.get('/featured', getFeaturedAuctions);
router.get('/ending-soon', getEndingSoonAuctions);
router.get('/:id', getAuctionById);

// POST routes
router.post('/', createAuction);
router.post('/:id/bid', placeBid);

export default router;
