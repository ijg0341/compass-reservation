/**
 * API 공통 타입 및 방문예약 API 타입 정의
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
// 예약 가능 일정 조회 API
// GET /reservations/available-slots?project_id={id}&visit_info_id={id}
// ============================================================================

export interface AvailableSlotsParams {
  project_id: number;
  visit_info_id: number;
}

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

// ============================================================================
// 동 목록 조회 API
// GET /reservations/dongs?visit_info_id={id}
// ============================================================================

export interface DongsParams {
  visit_info_id: number;
}

export interface DongData {
  id: string;
  name: string;
  number: string;
}

export interface DongsListData {
  list: DongData[];
}

export type DongsResponse = ApiResponse<DongsListData>;

// ============================================================================
// 호 목록 조회 API
// GET /reservations/dong-hos?visit_info_id={id}&dong_id={dongId}
// ============================================================================

export interface DongHosParams {
  visit_info_id: number;
  dong_id?: number;
}

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

// ============================================================================
// 방문일정 등록 API
// POST /reservations/visit-schedules
// ============================================================================

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
// 사전방문 조회 API
// GET /previsit/{id}
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

// ============================================================================
// 사전방문 예약 API (previsit_id 기준)
// GET /previsit-reservations/available-slots?previsit_id={id}
// ============================================================================

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

// ============================================================================
// 사전방문 동/호 조회 API
// GET /previsit-reservations/dongs?previsit_id={id}
// GET /previsit-reservations/donghos?previsit_id={id}&dong={dong}
// ============================================================================

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

// ============================================================================
// 사전방문 예약 등록 API
// POST /previsit-reservations
// ============================================================================

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
