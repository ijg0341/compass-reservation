/**
 * 이사 예약 관련 타입 정의
 */

/** 이사 예약 로그인 폼 */
export interface MoveLoginForm {
  apartment: string;
  building: string;
  unit: string;
  userId: string;
  password: string;
  agreeToTerms: boolean;
}

/** 인증된 이사 예약 사용자 */
export interface MoveUser {
  id: string;
  apartment: string;
  building: string;
  unit: string;
  ownerName: string;
  phone: string;
  isAuthenticated: boolean;
}

/** 이사 시간대 타입 */
export type MoveTimeSlotType = '09:00~12:00' | '12:00~15:00' | '15:00~18:00';

/** 이사 시간 슬롯 정보 */
export interface MoveTimeSlot {
  id: string;
  timeRange: MoveTimeSlotType;
  label: string;
  available: number;
  total: number;
  isAvailable: boolean;
}

/** 이사 달력 날짜 정보 */
export interface MoveCalendarDay {
  date: string;
  dayOfWeek: string;
  isAvailable: boolean;
  isHoliday: boolean;
  isPast: boolean;
  timeSlots: MoveTimeSlot[];
}

/** 이사 예약 상태 */
export type MoveReservationStatus = 'active' | 'cancelled';

/** 이사 예약 정보 */
export interface MoveReservation {
  id: string;
  userId: string;
  apartment: string;
  building: string;
  unit: string;
  date: string;
  timeSlot: MoveTimeSlotType;
  ownerName: string;
  phone: string;
  vehicleType?: string;
  specialRequests?: string;
  status: MoveReservationStatus;
  createdAt: string;
  updatedAt: string;
}
