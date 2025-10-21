import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { UnauthorizedError, ForbiddenError } from '../utils/error.util';

/**
 * Authentication Middleware
 * Supabase Auth 기반 인증 미들웨어
 */

// Request 타입 확장
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: string;
      };
    }
  }
}

/**
 * 인증 토큰 검증 미들웨어
 * Authorization 헤더의 Bearer 토큰을 검증
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Authorization 헤더 확인
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authentication token provided');
    }

    // 토큰 추출
    const token = authHeader.substring(7); // 'Bearer ' 제거

    // Supabase로 토큰 검증
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // 사용자 정보를 req.user에 저장
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
};

/**
 * 선택적 인증 미들웨어
 * 토큰이 있으면 검증하지만, 없어도 계속 진행
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (user && !error) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role
        };
      }
    }

    next();
  } catch (error) {
    // 에러가 발생해도 계속 진행
    next();
  }
};

/**
 * 소유자 확인 미들웨어
 * 특정 리소스의 소유자인지 확인
 */
export const checkOwnership = (
  resourceIdParam: string,
  ownerIdField: string = 'seller_id'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const resourceId = req.params[resourceIdParam];
      const userId = req.user.id;

      // 리소스 조회 (예: items 테이블)
      const { data, error } = await supabase
        .from('items')
        .select(ownerIdField)
        .eq('id', resourceId)
        .single();

      if (error || !data) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found'
        });
      }

      // 소유자 확인
      if ((data as any)[ownerIdField] !== userId) {
        throw new ForbiddenError('You do not have permission to access this resource');
      }

      next();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  };
};

/**
 * 역할 기반 접근 제어
 * 특정 역할을 가진 사용자만 접근 가능
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userRole = req.user.role || 'user';

      if (!allowedRoles.includes(userRole)) {
        throw new ForbiddenError('Insufficient permissions');
      }

      next();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  };
};

/**
 * 자기 자신의 리소스인지 확인
 * userId가 본인의 ID와 일치하는지 확인
 */
export const checkSelf = (userIdParam: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const requestedUserId = req.params[userIdParam] || req.body[userIdParam];

      if (requestedUserId !== req.user.id) {
        throw new ForbiddenError('You can only access your own resources');
      }

      next();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      }
      next(error);
    }
  };
};
