# BidHub Server

BidHub의 백엔드 API 서버입니다. Express.js와 TypeScript로 구축되었으며, Supabase(PostgreSQL)를 데이터베이스로 사용합니다.

## 🛠 기술 스택

### 핵심 기술
- **Node.js**: v18+ (런타임 환경)
- **TypeScript**: v5.9.3 (타입 안정성)
- **Express.js**: v5.1.0 (웹 프레임워크)
- **Supabase**: PostgreSQL 기반 BaaS

### 주요 라이브러리
- **cors**: v2.8.5 (CORS 처리)
- **dotenv**: v17.2.3 (환경 변수 관리)
- **@supabase/supabase-js**: v2.75.1 (Supabase 클라이언트)

### 개발 도구
- **ts-node**: v10.9.2 (TypeScript 실행)
- **nodemon**: v3.1.10 (개발 서버 자동 재시작)
- **@types/node**: v24.8.1
- **@types/express**: v5.0.3
- **@types/cors**: v2.8.19

## 📁 프로젝트 구조

```
Bidhub-Server/
├── src/
│   ├── config/
│   │   ├── supabase.ts           # Supabase 클라이언트 설정
│   │   └── cors.config.ts        # CORS 설정
│   ├── controllers/
│   │   ├── auction.controller.ts # 경매 관련 비즈니스 로직
│   │   ├── bid.controller.ts     # 입찰 관련 비즈니스 로직
│   │   ├── tradeOffer.controller.ts # 트레이드 오퍼 관련 로직
│   │   └── notification.controller.ts # 알림 관련 로직
│   ├── routes/
│   │   ├── auction.routes.ts     # 경매 API 라우트
│   │   ├── bid.routes.ts         # 입찰 API 라우트
│   │   ├── tradeOffer.routes.ts  # 트레이드 오퍼 API 라우트
│   │   └── notification.routes.ts # 알림 API 라우트
│   ├── middleware/
│   │   ├── auth.middleware.ts    # 인증 미들웨어
│   │   ├── error.middleware.ts   # 에러 처리 미들웨어
│   │   ├── logger.middleware.ts  # 로거 미들웨어
│   │   ├── rateLimit.middleware.ts # Rate Limiting 미들웨어
│   │   └── validation.middleware.ts # 유효성 검증 미들웨어
│   ├── services/
│   │   └── notification.service.ts # 알림 서비스 로직
│   ├── models/
│   │   └── auction.model.ts      # 경매 데이터 모델
│   ├── utils/
│   │   ├── error.util.ts         # 에러 유틸리티
│   │   ├── logger.util.ts        # 로거 유틸리티
│   │   ├── response.util.ts      # 응답 포맷 유틸리티
│   │   ├── transform.util.ts     # 데이터 변환 유틸리티
│   │   └── index.ts              # 유틸리티 exports
│   ├── types/
│   │   ├── index.ts              # 타입 정의 exports
│   │   ├── auction.types.ts      # 경매 타입
│   │   ├── bid.types.ts          # 입찰 타입
│   │   ├── trade.types.ts        # 트레이드 타입
│   │   ├── notification.types.ts # 알림 타입
│   │   └── response.types.ts     # 응답 타입
│   └── index.ts                  # 애플리케이션 진입점
├── .env                          # 환경 변수 (git ignored)
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ 데이터베이스 스키마

### Tables

#### `items` (경매 아이템)
```sql
- id: UUID (PK)
- title: VARCHAR
- description: TEXT
- starting_price: NUMERIC
- current_price: NUMERIC
- reserve_price: NUMERIC (nullable)
- image_urls: TEXT[]
- seller_id: UUID (FK to auth.users)
- category_id: UUID (FK to categories)
- status: VARCHAR (active, sold, expired)
- end_time: TIMESTAMP
- created_at: TIMESTAMP
- bid_count: INTEGER
- view_count: INTEGER
- condition: VARCHAR
- location: VARCHAR
- shipping_cost: NUMERIC
```

#### `bids` (입찰 기록)
```sql
- id: UUID (PK)
- item_id: UUID (FK to items)
- bidder_id: UUID (FK to auth.users)
- amount: NUMERIC
- status: VARCHAR (active, outbid, won)
- created_at: TIMESTAMP
```

#### `trade_offers` (트레이드 오퍼)
```sql
- id: UUID (PK)
- item_id: UUID (FK to items)
- offerer_id: UUID (FK to auth.users)
- title: VARCHAR
- description: TEXT
- estimated_value: NUMERIC
- image_url: VARCHAR
- status: VARCHAR (pending, accepted, rejected)
- created_at: TIMESTAMP
```

#### `categories` (카테고리)
```sql
- id: UUID (PK)
- name: VARCHAR
- slug: VARCHAR
- description: TEXT
- created_at: TIMESTAMP
```

#### `notifications` (알림)
```sql
- id: UUID (PK)
- user_id: UUID (FK to auth.users)
- type: VARCHAR (bid_placed, bid_outbid, bid_won, auction_ending, trade_offer_received, etc.)
- title: VARCHAR
- message: TEXT
- read: BOOLEAN (default: false)
- data: JSONB (추가 데이터)
- created_at: TIMESTAMP
```

## 🚀 API 엔드포인트

### 경매 (Auctions)

#### `GET /api/auctions/featured`
추천 경매 아이템 목록 조회

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Vintage Watch",
      "currentBid": 1200,
      "timeLeft": "2025-01-30T10:00:00Z",
      "image": "https://...",
      "bidCount": 15
    }
  ]
}
```

#### `GET /api/auctions/ending-soon`
마감 임박 경매 아이템 조회

**Response:** Featured와 동일한 형식

#### `GET /api/auctions/:id`
특정 경매 아이템 상세 정보 조회

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Vintage Watch",
    "description": "Rare 1960s timepiece",
    "currentBid": 1200,
    "startingBid": 800,
    "reservePrice": 1500,
    "timeLeft": "2025-01-30T10:00:00Z",
    "images": ["url1", "url2"],
    "condition": "excellent",
    "location": "New York",
    "shippingCost": 25,
    "bidCount": 15,
    "viewCount": 342,
    "sellerId": "uuid"
  }
}
```

#### `POST /api/auctions`
새 경매 아이템 생성

**Request Body:**
```json
{
  "title": "Item Title",
  "description": "Item description",
  "starting_price": 100,
  "reserve_price": 200,
  "image_urls": ["url1", "url2"],
  "end_time": "2025-01-30T10:00:00Z",
  "seller_id": "uuid",
  "condition": "good",
  "location": "Seoul",
  "shipping_cost": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Auction created successfully",
  "data": { /* created auction object */ }
}
```

#### `POST /api/auctions/:id/bid`
경매 아이템에 입찰

**Request Body:**
```json
{
  "bidderId": "uuid",
  "amount": 1300
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bid placed successfully",
  "data": { /* updated auction object */ }
}
```

### 입찰 (Bids)

#### `GET /api/bids/my-bids/:userId`
사용자의 입찰 내역 조회

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "itemId": "uuid",
      "name": "Vintage Watch",
      "status": "outbid",
      "myBid": 1200,
      "currentBid": 1300,
      "timeLeft": "2025-01-30T10:00:00Z",
      "image": "url",
      "canRebid": true,
      "itemStatus": "active"
    }
  ]
}
```

#### `GET /api/bids/my-listings/:userId`
사용자가 출품한 경매 목록 조회

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Vintage Camera",
      "highestBid": 500,
      "timeLeft": "2025-02-01T12:00:00Z",
      "status": "active",
      "image": "url",
      "bidCount": 8,
      "viewCount": 156
    }
  ]
}
```

#### `GET /api/bids/item/:itemId`
특정 아이템의 입찰 히스토리 조회 (입찰자당 최신 입찰만 표시)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bidder": "User ad0b755e",
      "amount": 1300,
      "time": "2025-01-20T14:30:00Z"
    }
  ]
}
```

### 트레이드 오퍼 (Trade Offers)

#### `GET /api/trade-offers/item/:itemId`
특정 아이템에 대한 트레이드 오퍼 목록 조회

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "itemId": "uuid",
      "offererId": "uuid",
      "title": "Vintage Camera",
      "description": "Trade offer description",
      "estimatedValue": 1200,
      "imageUrl": "url",
      "status": "pending",
      "createdAt": "2025-01-20T10:00:00Z"
    }
  ]
}
```

#### `POST /api/trade-offers`
새 트레이드 오퍼 생성

**Request Body:**
```json
{
  "itemId": "uuid",
  "offererId": "uuid",
  "title": "My Item",
  "description": "Description",
  "estimatedValue": 1000,
  "imageUrl": "url"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trade offer created successfully",
  "data": { /* created trade offer */ }
}
```

### 알림 (Notifications)

#### `GET /api/notifications`
사용자 알림 목록 조회 (인증 필요)

**Query Parameters:**
- `read`: (optional) "true" | "false" - 읽음 상태 필터
- `type`: (optional) 알림 타입 필터
- `limit`: (optional) 조회 개수 제한
- `offset`: (optional) 페이징 오프셋

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "bid_outbid",
      "title": "입찰이 밀렸습니다",
      "message": "Vintage Watch에 더 높은 입찰이 들어왔습니다.",
      "read": false,
      "createdAt": "2025-01-20T10:00:00Z",
      "data": {
        "itemId": "uuid",
        "itemTitle": "Vintage Watch"
      }
    }
  ]
}
```

#### `GET /api/notifications/unread-count`
읽지 않은 알림 개수 조회 (인증 필요)

**Response:**
```json
{
  "success": true,
  "count": 5
}
```

#### `PATCH /api/notifications/:id/read`
특정 알림 읽음 처리 (인증 필요)

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

#### `PATCH /api/notifications/read-all`
모든 알림 읽음 처리 (인증 필요)

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

#### `DELETE /api/notifications/:id`
알림 삭제 (인증 필요)

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

### 헬스 체크

#### `GET /api/health`
서버 상태 확인

**Response:**
```json
{
  "status": "ok",
  "message": "BidHub API is running",
  "timestamp": "2025-01-20T10:00:00Z"
}
```

## ⚙️ 설정 및 실행

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Server
PORT=4000

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (nodemon + tsx)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

서버는 기본적으로 `http://localhost:4000`에서 실행됩니다.

## 🏗 아키텍처 패턴

### 레이어드 아키텍처 (Layered Architecture)

```
Request → Middleware → Routes → Controllers → Services → Supabase → Response
                                      ↓
                                   Models/Types
```

1. **Middleware** (`src/middleware/`): 요청 전처리 (인증, 로깅, 에러 처리, Rate Limiting)
2. **Routes** (`src/routes/`): HTTP 엔드포인트 정의 및 라우팅
3. **Controllers** (`src/controllers/`): HTTP 요청/응답 처리
4. **Services** (`src/services/`): 비즈니스 로직 및 데이터 처리
5. **Models/Types** (`src/models/`, `src/types/`): 데이터 구조 정의
6. **Utils** (`src/utils/`): 공통 유틸리티 함수
7. **Config** (`src/config/`): 설정 파일 (Supabase, CORS 등)

### 미들웨어 구조

#### 인증 미들웨어
```typescript
// Bearer 토큰 기반 인증
authenticate()
optionalAuthenticate()
checkOwnership()
requireRole()
checkSelf()
```

#### 에러 처리 미들웨어
```typescript
// 전역 에러 핸들링
errorHandler()
notFoundHandler()
setupProcessErrorHandlers()
```

#### Rate Limiting
```typescript
// API 요청 제한 (15분당 100회)
apiLimiter
```

#### 로거 미들웨어
```typescript
// 모든 요청 로깅
requestLogger
```

### 에러 처리

커스텀 에러 클래스를 통한 일관된 에러 처리:

```typescript
class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 사용 예시
throw new UnauthorizedError('Invalid token');
throw new NotFoundError('Item not found');
throw new BadRequestError('Invalid input');
```

### CORS 설정

환경별 CORS 정책:

```typescript
// 개발 환경: localhost 허용
// 프로덕션: 특정 도메인만 허용
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
};
```

## 📝 주요 기능

### 1. 실시간 입찰 처리
- 동시 입찰 처리
- 현재가 자동 업데이트
- 입찰 상태 관리 (active, outbid, won)
- 입찰 성공 시 알림 발송

### 2. 입찰 히스토리 그룹화
- 입찰자별 최신 입찰만 표시
- 중복 제거 로직
- 시간순 정렬

### 3. 트레이드 오퍼
- 경매 아이템과 물물교환 제안
- 추정 가치 표시
- 상태 관리 (pending, accepted, rejected)
- 트레이드 오퍼 수신 시 알림

### 4. 알림 시스템
- 실시간 알림 생성 및 관리
- 알림 타입별 분류:
  - `bid_placed`: 새 입찰 알림
  - `bid_outbid`: 입찰이 밀린 경우
  - `bid_won`: 입찰 낙찰
  - `auction_ending`: 경매 마감 임박
  - `trade_offer_received`: 트레이드 오퍼 수신
- 읽음/안읽음 상태 관리
- 필터링 및 페이징 지원

### 5. 데이터 변환
Supabase의 snake_case를 프론트엔드의 camelCase로 변환:

```typescript
const transformedData = items.map(item => ({
  id: item.id,
  currentBid: item.current_price,
  startingBid: item.starting_price,
  // ...
}));
```

### 6. 로깅 시스템
- Winston 기반 구조화된 로깅
- 로그 레벨별 관리 (error, warn, info, debug)
- 모든 API 요청/응답 로깅
- 에러 추적 및 디버깅

## 🔒 보안 고려사항

### 인증 및 권한 관리
- **Bearer 토큰 기반 인증**: Supabase Auth를 통한 JWT 토큰 검증
- **미들웨어 기반 보호**: 민감한 엔드포인트는 `authenticate` 미들웨어로 보호
- **역할 기반 접근 제어 (RBAC)**: `requireRole()` 미들웨어로 권한 검증
- **리소스 소유권 확인**: `checkOwnership()`, `checkSelf()` 미들웨어

### 데이터 보안
- **환경 변수 관리**: `.env` 파일로 민감 정보 관리 (Git에서 제외)
- **Supabase Row Level Security (RLS)**: 데이터베이스 레벨에서 접근 제어
- **입력 검증**: 유효성 검증 미들웨어로 악의적 입력 차단

### 네트워크 보안
- **CORS 정책**: 환경별 허용 도메인 제한
- **Rate Limiting**: API 남용 방지 (15분당 100회 제한)
- **HTTPS 사용 권장**: 프로덕션 환경에서 필수

### 에러 처리
- **민감 정보 노출 방지**: 에러 메시지에서 시스템 정보 제거
- **통일된 에러 응답**: 커스텀 에러 클래스로 일관된 에러 처리
- **로그 기록**: 모든 에러를 로그 시스템에 기록하여 모니터링

## 🧪 개발 팁

### TypeScript 컴파일 없이 실행
```bash
npm run dev  # ts-node + nodemon으로 실행
```

### 로그 확인
Winston 로거를 통한 구조화된 로깅:
```typescript
import { logger } from './utils/logger.util';

logger.info('Server started');
logger.error('Error fetching auctions:', error);
logger.debug('User data:', userData);
```

### 환경 변수
```env
# 필수
PORT=4000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

# 선택
NODE_ENV=development
LOG_LEVEL=info
```

### API 테스트
```bash
# 헬스 체크
curl http://localhost:4000/api/health

# 추천 경매 조회
curl http://localhost:4000/api/auctions/featured

# 입찰 내역 조회 (인증 필요)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/bids/my-bids/USER_ID

# 알림 목록 조회 (인증 필요)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/notifications

# 알림 읽음 처리 (인증 필요)
curl -X PATCH \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/notifications/NOTIFICATION_ID/read
```

### 디버깅
```bash
# 상세 로그 출력
LOG_LEVEL=debug npm run dev

# 특정 모듈만 디버깅
DEBUG=express:* npm run dev
```

## 📚 관련 문서

- [Express.js 공식 문서](https://expressjs.com/)
- [Supabase 공식 문서](https://supabase.com/docs)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)

## 👤 작성자

DonsNote - [GitHub](https://github.com/donsnote)

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.
