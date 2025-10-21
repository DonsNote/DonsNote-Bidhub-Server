import { Request, Response, NextFunction } from 'express';

/**
 * Rate Limiting Middleware
 * API 요청 제한을 위한 미들웨어 (메모리 기반)
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Rate Limiter 설정 인터페이스
 */
interface RateLimitOptions {
  windowMs: number;    // 시간 윈도우 (밀리초)
  maxRequests: number; // 최대 요청 수
  message?: string;    // 제한 초과 메시지
  skipSuccessfulRequests?: boolean; // 성공한 요청은 카운트 제외
  skipFailedRequests?: boolean;     // 실패한 요청은 카운트 제외
  keyGenerator?: (req: Request) => string; // 키 생성 함수
}

/**
 * 기본 키 생성 함수 (IP 기반)
 */
const defaultKeyGenerator = (req: Request): string => {
  return req.ip || req.socket.remoteAddress || 'unknown';
};

/**
 * Rate Limiter 미들웨어 팩토리
 */
export const rateLimit = (options: RateLimitOptions) => {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = defaultKeyGenerator
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();

    // 스토어 정리 (만료된 항목 제거)
    if (store[key] && now > store[key].resetTime) {
      delete store[key];
    }

    // 초기화
    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs
      };
    }

    // 요청 카운트 증가
    store[key].count++;

    // 제한 확인
    if (store[key].count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000)
      });
    }

    // 응답 헤더 설정
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - store[key].count).toString());
    res.setHeader('X-RateLimit-Reset', new Date(store[key].resetTime).toISOString());

    // skipSuccessfulRequests 또는 skipFailedRequests 처리
    if (skipSuccessfulRequests || skipFailedRequests) {
      const originalSend = res.send;
      res.send = function (body: any) {
        const statusCode = res.statusCode;

        if (
          (skipSuccessfulRequests && statusCode < 400) ||
          (skipFailedRequests && statusCode >= 400)
        ) {
          store[key].count--;
        }

        return originalSend.call(this, body);
      };
    }

    next();
  };
};

/**
 * 사전 정의된 Rate Limiters
 */

// 일반 API 요청 제한 (분당 100회)
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  maxRequests: 100,
  message: 'Too many API requests from this IP, please try again after a minute.'
});

// 인증 관련 엄격한 제한 (15분당 5회)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  maxRequests: 5,
  message: 'Too many authentication attempts, please try again after 15 minutes.',
  skipSuccessfulRequests: true
});

// 입찰 제한 (분당 10회)
export const bidLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  maxRequests: 10,
  message: 'Too many bid attempts, please slow down.'
});

// 경매 생성 제한 (시간당 5회)
export const createAuctionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  maxRequests: 5,
  message: 'Too many auction creations, please try again later.'
});

// 파일 업로드 제한 (분당 3회)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  maxRequests: 3,
  message: 'Too many upload attempts, please try again later.'
});

/**
 * 스토어 정리 (메모리 관리)
 * 주기적으로 만료된 항목 제거
 */
export const cleanupRateLimitStore = () => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  });
};

// 5분마다 스토어 정리
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
