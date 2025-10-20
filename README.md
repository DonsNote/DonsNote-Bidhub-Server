# BidHub Server

BidHub의 백엔드 API 서버입니다. Express.js와 TypeScript로 구축되었으며, Supabase(PostgreSQL)를 데이터베이스로 사용합니다.

## 🛠 기술 스택

### 핵심 기술
- **Node.js**: v18+ (런타임 환경)
- **TypeScript**: v5.7.3 (타입 안정성)
- **Express.js**: v5.0.1 (웹 프레임워크)
- **Supabase**: PostgreSQL 기반 BaaS

### 주요 라이브러리
- **cors**: v2.8.5 (CORS 처리)
- **dotenv**: v16.4.7 (환경 변수 관리)
- **@supabase/supabase-js**: v2.47.10 (Supabase 클라이언트)

### 개발 도구
- **tsx**: v4.19.2 (TypeScript 실행)
- **nodemon**: v3.1.9 (개발 서버 자동 재시작)
- **@types/node**: v22.10.5
- **@types/express**: v5.0.0
- **@types/cors**: v2.8.17

## 📁 프로젝트 구조

```
Bidhub-Server/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase 클라이언트 설정
│   ├── controllers/
│   │   ├── auction.controller.ts # 경매 관련 비즈니스 로직
│   │   ├── bid.controller.ts     # 입찰 관련 비즈니스 로직
│   │   └── trade.controller.ts   # 트레이드 오퍼 관련 로직
│   ├── routes/
│   │   ├── auction.routes.ts     # 경매 API 라우트
│   │   ├── bid.routes.ts         # 입찰 API 라우트
│   │   └── trade.routes.ts       # 트레이드 오퍼 API 라우트
│   ├── types/
│   │   └── express.d.ts          # Express 타입 확장
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

### 헬스 체크

#### `GET /api/health`
서버 상태 확인

**Response:**
```json
{
  "status": "ok",
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

### MVC (Model-View-Controller)

```
Request → Routes → Controllers → Supabase → Response
```

1. **Routes** (`src/routes/`): HTTP 엔드포인트 정의 및 라우팅
2. **Controllers** (`src/controllers/`): 비즈니스 로직 처리
3. **Config** (`src/config/`): Supabase 클라이언트 설정
4. **Model**: Supabase에서 직접 관리

### 에러 처리

모든 컨트롤러에서 일관된 에러 처리:

```typescript
try {
  // 비즈니스 로직
} catch (error) {
  console.error('Error:', error);
  return res.status(500).json({ error: 'Internal server error' });
}
```

### CORS 설정

모든 origin에서의 요청 허용 (개발 환경):

```typescript
app.use(cors());
```

## 📝 주요 기능

### 1. 실시간 입찰 처리
- 동시 입찰 처리
- 현재가 자동 업데이트
- 입찰 상태 관리 (active, outbid, won)

### 2. 입찰 히스토리 그룹화
- 입찰자별 최신 입찰만 표시
- 중복 제거 로직
- 시간순 정렬

### 3. 트레이드 오퍼
- 경매 아이템과 물물교환 제안
- 추정 가치 표시
- 상태 관리 (pending, accepted, rejected)

### 4. 데이터 변환
Supabase의 snake_case를 프론트엔드의 camelCase로 변환:

```typescript
const transformedData = items.map(item => ({
  id: item.id,
  currentBid: item.current_price,
  startingBid: item.starting_price,
  // ...
}));
```

## 🔒 보안 고려사항

- 환경 변수로 민감 정보 관리
- Supabase Row Level Security (RLS) 활용
- 입력 검증 (userId, itemId 등)
- CORS 설정 (프로덕션에서는 특정 도메인만 허용 필요)

## 🧪 개발 팁

### TypeScript 컴파일 없이 실행
```bash
npm run dev  # tsx로 직접 실행
```

### 로그 확인
모든 에러는 console.error로 출력됩니다:
```typescript
console.error('Error fetching auctions:', error);
```

### API 테스트
```bash
# 헬스 체크
curl http://localhost:4000/api/health

# 추천 경매 조회
curl http://localhost:4000/api/auctions/featured

# 입찰 내역 조회
curl http://localhost:4000/api/bids/my-bids/USER_ID
```

## 📚 관련 문서

- [Express.js 공식 문서](https://expressjs.com/)
- [Supabase 공식 문서](https://supabase.com/docs)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)

## 👤 작성자

DonsNote - [GitHub](https://github.com/donsnote)

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.
