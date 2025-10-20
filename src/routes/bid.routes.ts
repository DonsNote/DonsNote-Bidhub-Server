import { Router } from 'express';
import { getMyBids, getMyListings, getItemBids } from '../controllers/bid.controller';

const router = Router();

// GET routes
router.get('/my-bids/:userId', getMyBids);
router.get('/my-listings/:userId', getMyListings);
router.get('/item/:itemId', getItemBids);

export default router;
