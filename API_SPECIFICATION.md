# Compass Reservation API 명세서
## 1. 방문예약 API

### 1.1 방문 안내 정보 조회
방문예약 페이지에 표시할 아파트 안내 정보를 조회합니다.
- **Endpoint**: `GET /api/[apt-id]/visit/info`
- **인증**: 불필요
- **Query Parameters**: 없음
- **필요데이터**: 제목, 내용, 배경이미지

---

### 1.2 예약 가능 날짜 조회

방문예약 가능한 날짜 목록과 각 날짜별 시간대를 조회합니다.
- **Endpoint**: `GET /api/[apt-id]/visit/available-dates`
- **인증**: 불필요
- **필요데이터**: 예약가능날짜, 예약가능시간
- **예상 데이터 예시**: {
  "2025-12-13": ["09:00", "09:30", "10:00", ...]
  ...
}

---

### 1.3 방문예약 생성

새로운 방문예약을 생성합니다.

- **Endpoint**: `POST /api/[apt-id]/visit/reservations`
- **인증**: 불필요
**Request Body**:
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "buildingId": "101",
  "unitId": "301",
  "dateId": "1",
  "timeSlotId": "2"
}
```

**Request Body Parameters**:
- `name` (required, string): 예약자 이름 (2-50자)
- `phone` (required, string): 연락처 (형식: 010-XXXX-XXXX)
- `building` (required, string): 동
- `unit` (required, string): 호수
- `date` (required, string): 날짜
- `time` (required, string): 시간대


---

## 2. 이사예약 API

### 2.1 이사예약 로그인/인증
세대 정보와 계정 정보로 이사예약 시스템에 로그인합니다.

- **Endpoint**: `POST /api/[apt-id]/move/auth/login`
- **인증**: 불필요
- **Request Body**:
```json
{
  "apartment": "창원동읍 한양 립스 더퍼스트",
  "dong": "101동",
  "ho": "301호",
  "username": "hong123",
  "password": "password123!"
}
```

**Request Body Parameters**:
- `apartment` (required, string): 아파트명
- `dong` (required, string): 동
- `ho` (required, string): 호수
- `username` (required, string): 사용자 ID
- `password` (required, string): 비밀번호

---

### 2.2 토큰 갱신
Refresh Token으로 새로운 Access Token을 발급받습니다.

- **Endpoint**: `POST /api/move/auth/refresh`
- **인증**: 불필요

---

### 2.3 이사예약 가능 날짜 조회 (달력)

특정 연월의 이사예약 가능 날짜를 달력 형식으로 조회합니다.

**Endpoint**: `GET /api/[apt-id]/move/calendar`

**인증**: 필요 (Bearer Token)

**Query Parameters**:
- `year` (required): 연도 (YYYY)
- `month` (required): 월 (1-12)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "year": 2024,
    "month": 12,
    "calendar": [
      {
        "date": "2024-12-01",
        "dayOfWeek": "일",
        "isAvailable": false,
        "isHoliday": true,
        "isPast": false,
        "reason": "공휴일",
        "timeSlots": []
      },
      {
        "date": "2024-12-02",
        "dayOfWeek": "월",
        "isAvailable": true,
        "isHoliday": false,
        "isPast": false,
        "timeSlots": [
          {
            "id": "2024-12-02-slot-morning",
            "timeRange": "09:00~12:00",
            "label": "오전 (09:00~12:00)",
            "available": 2,
            "total": 3,
            "isAvailable": true
          },
          {
            "id": "2024-12-02-slot-afternoon",
            "timeRange": "12:00~15:00",
            "label": "오후1 (12:00~15:00)",
            "available": 0,
            "total": 3,
            "isAvailable": false
          },
          {
            "id": "2024-12-02-slot-evening",
            "timeRange": "15:00~18:00",
            "label": "오후2 (15:00~18:00)",
            "available": 3,
            "total": 3,
            "isAvailable": true
          }
        ]
      }
    ]
  }
}
```

---

### 2.4 특정 날짜의 이사 시간대 조회

특정 날짜의 이사 가능 시간대를 조회합니다.

**Endpoint**: `GET /api/[apt-id]/move/timeslots`

**인증**: 필요 (Bearer Token)

**Query Parameters**:
- `date` (required): 조회할 날짜 (YYYY-MM-DD)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "date": "2024-12-02",
    "dayOfWeek": "월",
    "isAvailable": true,
    "timeSlots": [
      {
        "id": "slot-morning",
        "timeRange": "09:00~12:00",
        "label": "오전 (09:00~12:00)",
        "available": 2,
        "total": 3,
        "isAvailable": true
      },
      {
        "id": "slot-afternoon",
        "timeRange": "12:00~15:00",
        "label": "오후1 (12:00~15:00)",
        "available": 0,
        "total": 3,
        "isAvailable": false
      },
      {
        "id": "slot-evening",
        "timeRange": "15:00~18:00",
        "label": "오후2 (15:00~18:00)",
        "available": 3,
        "total": 3,
        "isAvailable": true
      }
    ]
  }
}
```

---

### 2.5 이사예약 생성

새로운 이사예약을 생성합니다.

**Endpoint**: `POST /api/[apt-id]/move/reservations`

**인증**: 필요 (Bearer Token)

**Request Body**:
```json
{
  "date": "2024-12-15",
  "timeSlot": "09:00~12:00",
  "vehicleType": "5톤 트럭",
  "specialRequests": "피아노 운반 필요"
}
```

**Request Body Parameters**:
- `date` (required, string): 이사 날짜 (YYYY-MM-DD)
- `timeSlot` (required, string): 시간대 (09:00~12:00 | 12:00~15:00 | 15:00~18:00)
- `vehicleType` (optional, string): 차량 종류
- `specialRequests` (optional, string): 특별 요청사항

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "reservationId": "MOVE-20241215-001",
    "userId": "user-001",
    "apartment": "창원동읍 한양 립스 더퍼스트",
    "building": "101동",
    "unit": "301호",
    "ownerName": "홍길동",
    "phone": "010-1234-5678",
    "date": "2024-12-15",
    "timeSlot": "09:00~12:00",
    "vehicleType": "5톤 트럭",
    "specialRequests": "피아노 운반 필요",
    "status": "active",
    "createdAt": "2024-11-24T10:30:00Z"
  },
  "message": "이사예약이 완료되었습니다."
}
```

---

### 2.6 이사예약 목록 조회

로그인한 사용자의 이사예약 목록을 조회합니다.

**Endpoint**: `GET /api/[apt-id]/move/reservations`

**인증**: 필요 (Bearer Token)


**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "MOVE-20241215-001",
        "userId": "user-001",
        "apartmentName": "창원동읍 한양 립스 더퍼스트",
        "contractorName": "홍길동",
        "dong": "101동",
        "ho": "301호",
        "date": "2024-12-15",
        "timeSlot": "09:00~12:00",
        "vehicleType": "5톤 트럭",
        "specialRequests": "피아노 운반 필요",
        "status": "active",
        "createdAt": "2024-11-24T10:30:00Z"
      },
      {
        "id": "MOVE-20241210-001",
        "userId": "user-001",
        "apartmentName": "창원동읍 한양 립스 더퍼스트",
        "contractorName": "홍길동",
        "dong": "101동",
        "ho": "301호",
        "date": "2024-12-10",
        "timeSlot": "15:00~18:00",
        "status": "cancelled",
        "createdAt": "2024-11-20T09:00:00Z",
        "updatedAt": "2024-11-22T11:20:00Z"
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "pageSize": 20,
      "totalPages": 1
    }
  }
}
```

---

### 2.7 이사예약 취소

이사예약을 취소합니다.

**Endpoint**: `DELETE /api/[apt-id]/move/reservations/{reservationId}`

**인증**: 필요 (Bearer Token)

**Path Parameters**:
- `reservationId` (required): 예약번호

**Request Body**:
```json
{
  "reason": "일정 변경으로 인한 취소"
}
```

**Request Body Parameters**:
- `reason` (optional, string): 취소 사유

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "reservationId": "MOVE-20241215-001",
    "status": "cancelled",
    "cancelledAt": "2024-11-24T11:00:00Z"
  },
  "message": "예약이 취소되었습니다."
}
```
---

### 2.8 세대 정보 조회

로그인한 사용자의 세대 정보를 조회합니다.

**Endpoint**: `GET /api/[apt-id]/move/user/info`

**인증**: 필요 (Bearer Token)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "user-001",
    "username": "hong123",
    "apartmentName": "창원동읍 한양 립스 더퍼스트",
    "dong": "101동",
    "ho": "301호",
    "contractorName": "홍길동",
    "phone": "010-1234-5678",
    "isAuthenticated": true
  }
}
```

---

## 3. 공통 마스터 데이터 API

### 3.1 동 목록 조회

특정 아파트의 동 목록을 조회합니다.

**Endpoint**: `GET /api/[apt-id]/common/buildings`

**인증**: 불필요

**Query Parameters**:
- `apartmentId` (required): 아파트 ID

---

### 3.2 호수 목록 조회

특정 동의 호수 목록을 조회합니다.

**Endpoint**: `GET /api/[apt-id]/common/units`

**인증**: 불필요

**Query Parameters**:
- `buildingId` (required): 동 ID

---
