/**
 * API 공통 타입 및 방문예약 API 타입 정의
 * API 스펙: 2025-12-05 (Customer API 기준)
 */

/** API 공통 응답 래퍼 */
export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ============================================================================
// 기존 방문예약 API (레거시 - 추후 제거 예정)
// ============================================================================

export interface TimeSlotData {
  time: string;
  available: number;
}

export interface AvailableDateData {
  date: string;
  times: TimeSlotData[];
}

export interface AvailableSlotsData {
  visit_info_id: string;
  date_begin: string;
  date_end: string;
  time_first: string;
  time_last: string;
  time_unit: number;
  max_limit: number;
  dates: AvailableDateData[];
}

export type AvailableSlotsResponse = ApiResponse<AvailableSlotsData>;

export interface DongData {
  id: string;
  name: string;
  number: string;
}

export interface DongsListData {
  list: DongData[];
}

export type DongsResponse = ApiResponse<DongsListData>;

export interface DongHoData {
  id: string;
  dong_id: string;
  name: string;
  number: string;
  unit_type: string | null;
  line: string | null;
  dong_name: string;
  dong_number: string;
}

export interface DongHosListData {
  list: DongHoData[];
}

export type DongHosResponse = ApiResponse<DongHosListData>;

export interface CreateVisitScheduleRequest {
  visit_info_id: number;
  visit_date: string;
  visit_time: string;
  dong_ho_id: number;
  resident_name: string;
  resident_phone: string;
}

export interface VisitScheduleData {
  id: number;
  visit_date: string;
  visit_time: string;
  resident_name: string;
  resident_phone: string;
  dong_ho_id: number;
  status?: string;
  created_at?: string;
}

export type CreateVisitScheduleResponse = ApiResponse<VisitScheduleData>;

// ============================================================================
// Customer API - 사전방문 (2025-12-05 UUID 기반 스펙)
// Base URL: /customer/project/{projectId}/previsit/{uuid}
// ============================================================================

/**
 * 사전방문 행사 정보
 * GET /customer/project/{projectId}/previsit/{uuid}
 */
export interface CustomerPrevisitData {
  id: number;
  uuid: string;
  project_id: number;
  name: string;
  date_begin: string;
  date_end: string;
  max_limit: number | null;
  time_first: string;
  time_last: string;
  time_unit: number;
  image_file_id: number | null;
}

export type CustomerPrevisitResponse = ApiResponse<CustomerPrevisitData>;

/**
 * 동 목록
 * GET /customer/project/{projectId}/dongs
 */
export interface CustomerDongData {
  dong: string;
}

export interface CustomerDongListData {
  list: CustomerDongData[];
}

export type CustomerDongsResponse = ApiResponse<CustomerDongListData>;

/**
 * 동호 목록
 * GET /customer/project/{projectId}/donghos?dong={dong}
 */
export interface CustomerDonghoData {
  id: number;
  dong: string;
  ho: string;
  unit_type: string | null;
}

export interface CustomerDonghoListData {
  list: CustomerDonghoData[];
}

export type CustomerDonghosResponse = ApiResponse<CustomerDonghoListData>;

/**
 * 사전방문 예약 등록
 * POST /customer/project/{projectId}/previsit/{uuid}/reservations
 */
export interface CustomerPrevisitReservationRequest {
  dongho_id: number;
  reservation_date: string;
  reservation_time: string;
  writer_name: string;
  writer_phone: string;
  memo?: string;
}

export interface CustomerPrevisitReservationResultData {
  id: number;
}

export type CustomerPrevisitReservationResponse = ApiResponse<CustomerPrevisitReservationResultData>;

// ============================================================================
// 시간 슬롯 생성용 타입 (프론트엔드에서 계산)
// ============================================================================

export interface GeneratedTimeSlot {
  time: string;
  available: number;
}

export interface GeneratedDateSlot {
  date: string;
  times: GeneratedTimeSlot[];
}

// ============================================================================
// 레거시 타입 (하위 호환성)
// ============================================================================

export interface PrevisitData {
  id: number;
  project_id: number;
  name: string;
  date_begin: string;
  date_end: string;
  max_limit: number | null;
  time_first: string;
  time_last: string;
  time_unit: number;
  image_file_id: number | null;
}

export type PrevisitResponse = ApiResponse<PrevisitData>;

export interface PrevisitAvailableTimeSlot {
  time: string;
  available: number;
}

export interface PrevisitAvailableDate {
  date: string;
  times: PrevisitAvailableTimeSlot[];
}

export interface PrevisitAvailableSlotsData {
  previsit_id: number;
  date_begin: string;
  date_end: string;
  time_first: string;
  time_last: string;
  time_unit: number;
  max_limit: number;
  dates: PrevisitAvailableDate[];
}

export type PrevisitAvailableSlotsResponse = ApiResponse<PrevisitAvailableSlotsData>;

export interface PrevisitDongData {
  dong: string;
}

export interface PrevisitDongListData {
  list: PrevisitDongData[];
}

export type PrevisitDongsResponse = ApiResponse<PrevisitDongListData>;

export interface PrevisitDonghoData {
  id: number;
  dong: string;
  ho: string;
  unit_type: string | null;
  contractor_name?: string;
  contractor_phone?: string;
}

export interface PrevisitDonghoListData {
  list: PrevisitDonghoData[];
}

export type PrevisitDonghosResponse = ApiResponse<PrevisitDonghoListData>;

export interface CreatePrevisitReservationRequest {
  previsit_id: number;
  dongho_id: number;
  reservation_date: string;
  reservation_time: string;
  writer_name: string;
  writer_phone: string;
  memo?: string;
}

export interface PrevisitReservationResultData {
  id: number;
}

export type CreatePrevisitReservationResponse = ApiResponse<PrevisitReservationResultData>;
