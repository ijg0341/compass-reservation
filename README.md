# Compass Reservation

아파트 커뮤니티를 위한 방문예약 및 이사예약 시스템입니다.

## 주요 기능

### 방문예약 (비회원)
- 방문 안내 정보 확인
- 예약 가능 일정 조회
- 동/호수 선택
- 방문 예약 신청

### 사전방문 예약 (UUID 기반)
- 고유 링크를 통한 사전방문 예약
- 앱 다운로드 안내

### 이사예약 (로그인 기반)
- 약관 동의 프로세스
- 세대 로그인 (동/호수 + 아이디/비밀번호)
- 달력 형식 이사일정 선택
- 예약 목록 조회 및 취소

## 예약 프로세스

**방문예약**
```
안내 확인 → 예약 폼 작성 → 완료
```

**이사예약**
```
약관 동의 → 로그인 → 달력 선택 → 예약 확인 → 목록/취소
```

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **프레임워크** | React 19, React Router 6 |
| **언어** | TypeScript 5.9 |
| **상태관리** | Zustand, React Query |
| **UI** | Material-UI 7, Emotion |
| **폼 관리** | React Hook Form, Zod |
| **애니메이션** | Framer Motion |
| **HTTP** | Axios |
| **빌드** | Vite 7 |

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

기본 포트: http://localhost:5173

### 프로덕션 빌드

```bash
npm run build
```

### 린트 검사

```bash
npm run lint
```

## 환경 변수

`.env` 파일을 생성하여 환경 변수를 설정합니다.

```env
VITE_API_BASE_URL=https://api.compass1998.com
```

## 프로젝트 구조

```
src/
├── pages/
│   ├── HomePage.tsx              # 메인 (선택 화면)
│   ├── visit/                    # 방문예약
│   │   ├── VisitInfoPage.tsx         # 방문 안내
│   │   ├── VisitReservationPage.tsx  # 예약 폼
│   │   ├── VisitCompletePage.tsx     # 예약 완료
│   │   ├── PrevisitInfoPage.tsx      # 사전방문 안내
│   │   ├── PrevisitReservationPage.tsx # 사전방문 예약
│   │   └── AppDownloadPage.tsx       # 앱 다운로드
│   └── move/                     # 이사예약
│       ├── MoveLoginPage.tsx         # 로그인
│       ├── MoveCalendarPage.tsx      # 달력 선택
│       ├── MoveConfirmPage.tsx       # 예약 확인
│       └── MoveListPage.tsx          # 예약 목록
├── components/
│   ├── layout/
│   │   ├── Layout.tsx                # 기본 레이아웃
│   │   └── MoveLayout.tsx            # 이사예약 레이아웃
│   └── common/
├── stores/
│   └── authStore.ts              # Zustand 인증 상태
├── lib/
│   ├── api/
│   │   ├── client.ts                 # Axios 클라이언트
│   │   ├── reservationApi.ts         # 방문예약 API
│   │   ├── previsitApi.ts            # 사전방문 API
│   │   └── moveApi.ts                # 이사예약 API
│   ├── config/
│   │   └── theme.ts                  # MUI 테마
│   └── mockData/
├── types/
│   ├── api.ts                        # API 타입
│   ├── visitReservation.ts           # 방문예약 타입
│   └── moveReservation.ts            # 이사예약 타입
└── app/
    ├── router.tsx                    # 라우팅 설정
    └── providers.tsx                 # 전역 프로바이더
```

## 라우팅

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | HomePage | 메인 페이지 |
| `/visit` | VisitInfoPage | 방문 안내 |
| `/visit/reservation` | VisitReservationPage | 방문예약 폼 |
| `/visit/complete` | VisitCompletePage | 예약 완료 |
| `/visit/{uuid}` | PrevisitInfoPage | 사전방문 안내 |
| `/visit/{uuid}/reservation` | PrevisitReservationPage | 사전방문 예약 |
| `/visit/{uuid}/app-download` | AppDownloadPage | 앱 다운로드 |
| `/move/{uuid}` | MoveLoginPage | 이사예약 로그인 |
| `/move/{uuid}/calendar` | MoveCalendarPage | 이사일정 선택 |
| `/move/{uuid}/confirm` | MoveConfirmPage | 예약 확인 |
| `/move/{uuid}/list` | MoveListPage | 예약 목록 |

## API 엔드포인트

### 방문예약 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/reservations/available-slots` | 예약 가능 일정 |
| GET | `/reservations/dongs` | 동 목록 |
| GET | `/reservations/dong-hos` | 호 목록 |
| POST | `/reservations/visit-schedules` | 방문예약 생성 |

### 이사예약 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/customer/move/{uuid}` | 이사예약 정보 |
| GET | `/customer/project/{uuid}/dongs` | 동 목록 |
| GET | `/customer/project/{uuid}/donghos` | 호 목록 |
| POST | `/customer/move/{uuid}/login` | 로그인 |
| GET | `/customer/move/{uuid}/available-slots` | 예약 가능 시간 |
| POST | `/customer/move/{uuid}/reservations` | 이사예약 생성 |
| GET | `/customer/move/{uuid}/my-reservation` | 내 예약 조회 |
| DELETE | `/customer/move/{uuid}/reservations/{id}` | 예약 취소 |

## UI/UX

- **모바일 퍼스트**: 최대 너비 480px
- **터치 친화적**: 최소 버튼 크기 44x44px
- **반응형**: MUI 컴포넌트 기반
