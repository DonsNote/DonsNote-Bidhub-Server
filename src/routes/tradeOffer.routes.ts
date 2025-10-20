import { Router } from 'express';
import { getTradeOffersByItem, createTradeOffer } from '../controllers/tradeOffer.controller';

const router = Router();

// Get trade offers for a specific item
router.get('/item/:itemId', getTradeOffersByItem);

// Create a new trade offer
router.post('/', createTradeOffer);

export default router;
