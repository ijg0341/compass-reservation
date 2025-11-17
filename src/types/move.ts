/**
 * 이사예약 관련 타입 정의
 */

/** 사용자 정보 */
export interface MoveUser {
  id: string;
  username: string;
  apartmentName: string;
  dong: string;
  ho: string;
  contractorName: string;
}

/** 이사예약 정보 */
export interface MoveReservation {
  id: string;
  userId: string;
  apartmentName: string;
  contractorName: string;
  dong: string;
  ho: string;
  date: string;
  timeSlot: string;
  status: 'active' | 'cancelled';
  createdAt: string;
}

/** 시간대 옵션 */
export type TimeSlot = '09:00~12:00' | '12:00~15:00' | '15:00~18:00';

/** 예약 불가 날짜 */
export interface UnavailableDate {
  date: string;
  reason?: string;
}
