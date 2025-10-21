import { Request, Response, NextFunction } from 'express';

/**
 * Validation Middleware
 * 요청 데이터 검증을 위한 미들웨어
 */

/**
 * UUID 형식 검증
 */
export const validateUUID = (field: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[field] || req.body[field];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!value || !uuidRegex.test(value)) {
      return res.status(400).json({
        success: false,
        error: `Invalid ${field}: must be a valid UUID`
      });
    }

    next();
  };
};

/**
 * 필수 필드 검증
 */
export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];

    for (const field of fields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    next();
  };
};

/**
 * 숫자 범위 검증
 */
export const validateNumberRange = (
  field: string,
  min?: number,
  max?: number
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = Number(req.body[field]);

    if (isNaN(value)) {
      return res.status(400).json({
        success: false,
        error: `${field} must be a number`
      });
    }

    if (min !== undefined && value < min) {
      return res.status(400).json({
        success: false,
        error: `${field} must be at least ${min}`
      });
    }

    if (max !== undefined && value > max) {
      return res.status(400).json({
        success: false,
        error: `${field} must be at most ${max}`
      });
    }

    next();
  };
};

/**
 * 입찰 데이터 검증
 */
export const validateBid = (req: Request, res: Response, next: NextFunction) => {
  const { amount, bidderId } = req.body;
  const { id: itemId } = req.params;

  // UUID 검증
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!itemId || !uuidRegex.test(itemId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid item ID'
    });
  }

  if (!bidderId || !uuidRegex.test(bidderId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid bidder ID'
    });
  }

  // 입찰 금액 검증
  const bidAmount = Number(amount);
  if (isNaN(bidAmount) || bidAmount <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Bid amount must be a positive number'
    });
  }

  next();
};

/**
 * 경매 아이템 생성 데이터 검증
 */
export const validateCreateAuction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    description,
    starting_price,
    image_urls,
    seller_id,
    end_time
  } = req.body;

  // 필수 필드 검증
  if (!title || !description || !starting_price || !seller_id || !end_time) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: title, description, starting_price, seller_id, end_time'
    });
  }

  // 제목 길이 검증
  if (title.length < 3 || title.length > 200) {
    return res.status(400).json({
      success: false,
      error: 'Title must be between 3 and 200 characters'
    });
  }

  // 설명 길이 검증
  if (description.length < 10 || description.length > 5000) {
    return res.status(400).json({
      success: false,
      error: 'Description must be between 10 and 5000 characters'
    });
  }

  // 가격 검증
  const price = Number(starting_price);
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Starting price must be a positive number'
    });
  }

  // 이미지 URL 검증
  if (image_urls && !Array.isArray(image_urls)) {
    return res.status(400).json({
      success: false,
      error: 'Image URLs must be an array'
    });
  }

  // 종료 시간 검증
  const endDate = new Date(end_time);
  const now = new Date();
  if (isNaN(endDate.getTime()) || endDate <= now) {
    return res.status(400).json({
      success: false,
      error: 'End time must be a valid future date'
    });
  }

  // UUID 검증
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(seller_id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid seller ID'
    });
  }

  next();
};

/**
 * 트레이드 오퍼 생성 데이터 검증
 */
export const validateCreateTradeOffer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    itemId,
    offererId,
    title,
    description,
    estimatedValue
  } = req.body;

  // 필수 필드 검증
  if (!itemId || !offererId || !title || !description || !estimatedValue) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  // UUID 검증
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(itemId) || !uuidRegex.test(offererId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid item ID or offerer ID'
    });
  }

  // 추정 가치 검증
  const value = Number(estimatedValue);
  if (isNaN(value) || value <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Estimated value must be a positive number'
    });
  }

  next();
};
