# 🙏 기도노트

> 막막한 기도를, 구체적인 간구로

현재 상황을 입력하면 AI가 구체적인 기도 제목과 붙들 말씀을 제안하고, 노션에 자동으로 저장해주는 서비스입니다.

## 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js (카카오 / 네이버 소셜 로그인)
- **DB**: PostgreSQL + Prisma
- **AI**: Google Gemini 1.5 Flash
- **노션 연동**: Notion OAuth + API
- **배포**: Vercel

---

## 로컬 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
cp .env.example .env
```

`.env` 파일을 열고 아래 값들을 채워주세요:

#### KAKAO_CLIENT_ID / KAKAO_CLIENT_SECRET
1. [Kakao Developers](https://developers.kakao.com) 접속 → 내 애플리케이션 → 앱 추가
2. 플랫폼 → Web → 사이트 도메인 등록
3. 카카오 로그인 활성화 → Redirect URI 추가:
   - 로컬: `http://localhost:3000/api/auth/callback/kakao`
   - 운영: `https://your-domain.vercel.app/api/auth/callback/kakao`
4. 동의항목: `profile_nickname`, `profile_image`, `account_email` 설정
5. REST API 키 → `KAKAO_CLIENT_ID`
6. 보안 → Client Secret 생성 → `KAKAO_CLIENT_SECRET`

#### NAVER_CLIENT_ID / NAVER_CLIENT_SECRET
1. [Naver Developers](https://developers.naver.com) 접속 → Application → 애플리케이션 등록
2. 사용 API: **네아로(네이버 아이디로 로그인)** 선택
3. 서비스 URL, Callback URL 등록:
   - 로컬: `http://localhost:3000/api/auth/callback/naver`
   - 운영: `https://your-domain.vercel.app/api/auth/callback/naver`
4. Client ID, Secret 복사

### 3. DB 마이그레이션
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. 개발 서버 실행
```bash
npm run dev
```

---

## Vercel 배포

### 1. GitHub에 Push 후 Vercel 연결

### 2. Vercel 환경변수 설정
Vercel 대시보드 → Settings → Environment Variables에서 `.env`의 모든 값 추가
- `NEXTAUTH_URL`은 실제 도메인으로 변경: `https://your-domain.vercel.app`
- Notion Redirect URI도 실제 도메인으로 업데이트

### 3. Vercel Postgres 연결
Vercel 대시보드 → Storage → Create Database → Postgres

```bash
npx prisma migrate deploy
```

---

## 서비스 흐름

```
회원가입/로그인
    ↓
상황 입력 + 기도 유형 선택 (간구/감사/회개/중보)
    ↓
Gemini AI → 기도 제목 3-5개 + 말씀 구절 2-3개 생성
    ↓
노션 OAuth 연결 (최초 1회)
    ↓
저장할 노션 페이지 선택
    ↓
노션에 자동 저장 (기도 내용 + 말씀 + 빈 응답 칸)
    ↓
사용자가 직접 '기도하면서 느낀 변화', '기도 응답' 채워가기
```

---

## 노션 저장 구조

저장되는 노션 페이지:
```
🙏 기도 기록 - 2025년 1월 15일

📌 기도 내용
  현재 상황: [입력한 상황]
  
  구체적으로 구하는 것
  • 지혜와 분별력: ...
  • 평안한 마음: ...

📌 붙드는 말씀
  빌립보서 4:6-7
  "아무것도 염려하지 말고..."
  ✦ 이 말씀을 붙드는 이유...

📌 기도하면서 느낀 변화
  • 마음의 변화: [사용자 기록]

📌 기도 응답
  • 어떻게 응답되었는가: [사용자 기록]
  • 하나님이 가르쳐주신 것: [사용자 기록]
```
