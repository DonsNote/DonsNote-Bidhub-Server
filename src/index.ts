import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auctionRoutes from './routes/auction.routes';
import bidRoutes from './routes/bid.routes';
import tradeOfferRoutes from './routes/tradeOffer.routes';
import notificationRoutes from './routes/notification.routes';
import { corsOptions } from './config/cors.config';
import { requestLogger } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler, setupProcessErrorHandlers } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { logger } from './utils/logger.util';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Process error handlers
setupProcessErrorHandlers();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Rate limiting (API 전체)
app.use('/api', apiLimiter);

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'BidHub API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/trade-offers', tradeOfferRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler (마지막에 배치)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`);
  logger.info(`📡 API available at http://localhost:${PORT}/api`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
