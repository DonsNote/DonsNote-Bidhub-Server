import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

/**
 * Request Logging Middleware
 * HTTP 요청/응답 로깅
 */

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // 요청 정보 로깅
  logger.info(`Incoming ${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // 응답 완료 시 로깅
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.http(req.method, req.url, res.statusCode, duration);
  });

  next();
};

/**
 * Error Logging Middleware
 * 에러 발생 시 상세 로깅
 */
export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip
  });

  next(err);
};
