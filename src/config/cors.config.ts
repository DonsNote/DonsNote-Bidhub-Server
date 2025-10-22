import { CorsOptions } from 'cors';

/**
 * CORS Configuration
 * 환경별 CORS 설정
 */

// 허용된 오리진 목록
const getAllowedOrigins = (): string[] => {
  const origins: string[] = [];

  // 개발 환경
  if (process.env.NODE_ENV === 'development') {
    origins.push('http://localhost:3000');
    origins.push('http://localhost:3001');
    origins.push('http://127.0.0.1:3000');
    origins.push('http://52.184.83.107:3000');
    origins.push('http://52.184.83.107');
  }

  // 프로덕션 환경
  if (process.env.NODE_ENV === 'production') {
    // 프로덕션 도메인 추가
    if (process.env.FRONTEND_URL) {
      origins.push(process.env.FRONTEND_URL);
    }
  }

  // 환경 변수에서 추가 오리진 가져오기
  if (process.env.ALLOWED_ORIGINS) {
    const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',');
    origins.push(...additionalOrigins);
  }

  return origins;
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    // origin이 undefined인 경우 (예: Postman, curl 등)
    if (!origin) {
      return callback(null, true);
    }

    // 허용된 오리진인지 확인
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.length === 0) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // 쿠키 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400 // 24시간 (preflight 캐시)
};
