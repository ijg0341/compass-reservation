/**
 * 방문 예약 관련 타입 정의
 */

/** 방문 예약 폼 데이터 */
export interface VisitReservationForm {
  name: string;
  phone: string;
  building: string;
  unit: string;
  date: string;
  time: string;
}

/** 시간 슬롯 정보 */
export interface TimeSlot {
  time: string;
  available: number;
  total: number;
  isAvailable: boolean;
}

/** 예약 가능 날짜 정보 */
export interface ReservationDate {
  date: string;
  dayOfWeek: string;
  label: string;
  timeSlots: TimeSlot[];
}

/** 예약 상태 */
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

/** 방문 예약 정보 */
export interface VisitReservation {
  id: string;
  name: string;
  phone: string;
  building: string;
  unit: string;
  date: string;
  time: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

/** 방문 안내 콘텐츠 */
export interface VisitInfoContent {
  apartmentName: string;
  welcomeMessage: string;
  eventPeriod: string;
  location: string;
  requiredDocuments: string[];
  contactNumber: string;
  additionalInfo?: string;
}
