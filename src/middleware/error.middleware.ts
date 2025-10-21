import { Request, Response, NextFunction } from 'express';
import { AppError, logError, isOperationalError } from '../utils/error.util';

/**
 * Error Handling Middleware
 * 전역 에러 핸들러
 */

/**
 * 404 Not Found 핸들러
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * 전역 에러 핸들러
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 에러 로깅
  logError(err);

  // AppError 인스턴스인 경우
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack
      })
    });
  }

  // Supabase 에러 처리
  if ('code' in err && 'message' in err) {
    const supabaseError = err as any;
    return res.status(400).json({
      success: false,
      error: supabaseError.message,
      code: supabaseError.code
    });
  }

  // 일반 에러 처리
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};

/**
 * Async 에러 래퍼
 * async 함수의 에러를 자동으로 next()로 전달
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 프로세스 레벨 에러 핸들러
 */
export const setupProcessErrorHandlers = () => {
  // Uncaught Exception 처리
  process.on('uncaughtException', (error: Error) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    logError(error);
    process.exit(1);
  });

  // Unhandled Rejection 처리
  process.on('unhandledRejection', (reason: any) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(reason);
    process.exit(1);
  });

  // SIGTERM 처리
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
  });
};
