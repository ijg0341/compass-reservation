# VisitReservationPage API 연동 계획서

## 1. 개요

- **대상 화면**: `/visit/reservation` (VisitReservationPage)
- **API Base URL**: `http://api.compass1998.com/`

---

## 2. 연동 API 목록

### 2.1 예약 가능 일정 조회
```
GET /reservations/available-slots?project_id={id}
```
- **인증**: 불필요
- **호출 시점**: 페이지 로드
- **용도**: 예약 가능한 날짜 및 시간 슬롯 조회

### 2.2 동 목록 조회
```
GET /reservations/dongs?visit_info_id={id}
```
- **인증**: 불필요
- **호출 시점**: 페이지 로드
- **용도**: 동 선택 드롭다운 데이터

### 2.3 호 목록 조회
```
GET /reservations/dong-hos?visit_info_id={id}&dong_id={dongId}
```
- **인증**: 불필요
- **호출 시점**: 동 선택 시
- **용도**: 호 선택 드롭다운 데이터

### 2.4 방문일정 등록
```
POST /reservations/visit-schedules
Authorization: Bearer {token}
```
- **인증**: 필요 (api.http 기준)
- **호출 시점**: 폼 제출
- **요청 Body**:
```json
{
  "visit_info_id": 2,
  "visit_date": "2025-11-28",
  "visit_time": "11:00",
  "dong_ho_id": 1,
  "contractor_name": "홍길동",
  "contractor_phone": "010-1234-5678",
  "contractor_birth": "1980-01-01",
  "resident_name": "김철수",
  "resident_phone": "010-9876-5432",
  "resident_birth": "1985-05-15",
  "move_in_scheduled_date": "2024-12-15",
  "login_id": "visitor001",
  "login_pw": "visit123"
}
```

---

## 3. 현재 폼 vs API 필드 비교

| 현재 폼 | API 필드 | 상태 |
|---------|----------|------|
| name | contractor_name | O 매핑 |
| phone | contractor_phone | O 매핑 |
| buildingId | - | dong_ho_id로 변환 |
| unitId | dong_ho_id | O 매핑 |
| dateId | visit_date | O 변환 필요 |
| timeSlotId | visit_time | O 변환 필요 |
| - | visit_info_id | **추가 필요** |
| - | contractor_birth | **추가 필요** |
| - | resident_name | **추가 필요** |
| - | resident_phone | **추가 필요** |
| - | resident_birth | **추가 필요** |
| - | move_in_scheduled_date | **추가 필요** |
| - | login_id | **추가 필요** |
| - | login_pw | **추가 필요** |

---

## 4. 확인 필요 사항

1. **visit_info_id / project_id**: 어디서 가져오나? (URL 파라미터? 고정값?)
2. **POST 인증**: 실제로 토큰 필요한지? (비회원 예약이면 불필요할 수도)
3. **login_id / login_pw**: 사용자가 직접 입력? 자동 생성?
4. **API 응답 형식**: 실제 응답 구조 확인 필요

---

## 5. 작업 목록

- [ ] `.env`에 API URL 설정
- [ ] API 타입 정의 (`src/types/api.ts`)
- [ ] API 서비스 함수 생성 (`src/lib/api/reservationApi.ts`)
- [ ] 예약 가능 일정 API 연동
- [ ] 동 목록 API 연동
- [ ] 호 목록 API 연동 (동 선택 시)
- [ ] 폼 필드 추가 (계약자/입주자 정보)
- [ ] 방문일정 등록 API 연동
- [ ] 에러 핸들링
- [ ] Mock 데이터 제거

