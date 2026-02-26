# 🙏 기도노트

> 기도 제목을 구체화하는 AI 서비스

막막하게 느껴지는 기도를, AI가 구체적인 기도 제목과 붙들 말씀으로 풀어드립니다.  
기도 기록은 노션에 자동으로 저장되어 응답까지 추적할 수 있습니다.

---

## 기획 배경

기도하고 싶지만 무슨 말을 해야 할지 몰라 막막했던 경험에서 시작했습니다.  
"지금 이 상황을 어떻게 기도로 표현해야 하지?"라는 질문에 AI가 함께 답해줍니다.

---

## 핵심 기능

| 기능 | 설명 |
|------|------|
| 🤖 AI 기도 제목 생성 | 현재 상황을 입력하면 Gemini가 3~5개의 구체적인 기도 제목 제안 |
| 📖 말씀 연결 | 상황에 맞는 성경 구절 2~3개를 개역개정으로 제시 |
| 📎 노션 자동 저장 | 기도 내용을 노션 페이지에 구조화하여 자동 저장 |
| 📝 기도 응답 기록 | 빈 칸에 직접 느낀 변화와 응답을 채워나가는 저널링 |
| 🔐 소셜 로그인 | 카카오 / 네이버 간편 로그인 |

---

## 서비스 흐름

```
1. 카카오 또는 네이버로 로그인
        ↓
2. 현재 상황 입력 + 기도 유형 선택 (간구 / 감사 / 회개 / 중보)
        ↓
3. AI가 구체적인 기도 제목 3~5개 + 말씀 구절 2~3개 생성
        ↓
4. 노션 연결 (최초 1회 OAuth 인증)
        ↓
5. 노션 페이지에 자동 저장
        ↓
6. 사용자가 직접 기도 후 느낀 변화 / 응답 기록
```

---

## 노션 저장 구조

```
🙏 기도 기록 - 2026년 2월 26일
├── 📌 기도 내용          [파란 배경]
│     현재 상황: ...
│     • 기도 제목 1
│     • 기도 제목 2
├── 📌 붙드는 말씀         [노란 배경]
│     빌립보서 4:6-7
│     "아무것도 염려하지 말고..."
├── 📌 기도하면서 느낀 변화 [초록 배경]
│     • 마음의 변화: (사용자 직접 입력)
└── 📌 기도 응답           [분홍 배경]
      • 어떻게 응답되었는가: (사용자 직접 입력)
      • 하나님이 가르쳐주신 것: (사용자 직접 입력)
```

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js (카카오 / 네이버 OAuth) |
| Database | PostgreSQL + Prisma ORM |
| AI | Google Gemini 1.5 Flash |
| 노션 연동 | Notion OAuth + API |
| 배포 | Vercel |

---

## 로컬 개발 환경 설정

### 1. 레포 클론

```bash
git clone https://github.com/zhengyin3216/pray-with-you.git
cd pray-with-you
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일에 아래 값을 채워주세요:

```env
DATABASE_URL="postgresql://..."

NEXTAUTH_SECRET="랜덤 32바이트 값"
NEXTAUTH_URL="http://localhost:3000"

KAKAO_CLIENT_ID="카카오 REST API 키"
KAKAO_CLIENT_SECRET="카카오 Client Secret"

NAVER_CLIENT_ID="네이버 Client ID"
NAVER_CLIENT_SECRET="네이버 Client Secret"

GEMINI_API_KEY="Google AI Studio API 키"

NOTION_CLIENT_ID="노션 OAuth Client ID"
NOTION_CLIENT_SECRET="노션 OAuth Client Secret"
NOTION_REDIRECT_URI="http://localhost:3000/api/notion/callback"
```

**NEXTAUTH_SECRET 생성 방법:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. DB 마이그레이션

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. 개발 서버 실행

```bash
npm run dev
```

→ http://localhost:3000 접속

---

## Vercel 배포

### 1. GitHub Push 후 Vercel에서 레포 연결

### 2. Vercel Storage에서 Postgres DB 생성

Vercel 대시보드 → Storage → Create Database → Neon (Postgres)  
→ 프로젝트에 연결하면 `DATABASE_URL` 자동 등록

### 3. 환경변수 등록

Vercel 대시보드 → Settings → Environment Variables  
`.env`의 모든 값을 입력 (단, `NEXTAUTH_URL`과 `NOTION_REDIRECT_URI`는 실제 도메인으로 변경)

```
NEXTAUTH_URL=https://pray-with-you.vercel.app
NOTION_REDIRECT_URI=https://pray-with-you.vercel.app/api/notion/callback
```

### 4. 배포 후 마이그레이션

```bash
npx prisma migrate deploy
```

### 5. OAuth Redirect URI 업데이트

- 카카오: `https://pray-with-you.vercel.app/api/auth/callback/kakao`
- 네이버: `https://pray-with-you.vercel.app/api/auth/callback/naver`
- 노션: `https://pray-with-you.vercel.app/api/notion/callback`

---

## 프로젝트 구조

```
pray-with-you/
├── app/
│   ├── page.tsx                      # 로그인 랜딩 페이지
│   ├── layout.tsx
│   ├── globals.css
│   ├── providers.tsx
│   ├── dashboard/
│   │   └── page.tsx                  # 메인 앱 (기도 생성 + 노션 저장)
│   ├── connect-notion/
│   │   └── page.tsx                  # 노션 페이지 선택
│   ├── privacy/page.tsx              # 개인정보 처리방침
│   ├── terms/page.tsx                # 이용약관
│   └── api/
│       ├── auth/[...nextauth]/       # NextAuth 핸들러
│       ├── generate/                 # Gemini AI 기도 생성
│       └── notion/
│           ├── auth/                 # 노션 OAuth 시작
│           ├── callback/             # 노션 OAuth 콜백
│           ├── pages/                # 노션 페이지 목록
│           └── save/                 # 노션 저장
├── lib/
│   ├── auth.ts                       # NextAuth 설정
│   ├── gemini.ts                     # Gemini AI 연동
│   ├── notion.ts                     # Notion API 연동
│   └── prisma.ts                     # Prisma 클라이언트
└── prisma/
    └── schema.prisma                 # DB 스키마
```

---

## 라이선스

MIT
