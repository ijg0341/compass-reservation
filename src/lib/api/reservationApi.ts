/**
 * 방문예약 API 서비스
 */
import { api } from './client';
import type {
  AvailableSlotsResponse,
  DongsResponse,
  DongHosResponse,
  CreateVisitScheduleResponse,
  AvailableSlotsData,
  DongData,
  DongHoData,
  CreateVisitScheduleRequest,
  VisitScheduleData,
} from '@/types/api';

/**
 * 예약 가능 일정 조회
 * @param projectId 프로젝트 ID
 * @returns 예약 가능한 날짜 및 시간 슬롯 목록 (visit_info_id 포함)
 */
export async function getAvailableSlots(projectId: number): Promise<AvailableSlotsData> {
  const response = await api.get<AvailableSlotsResponse>(
    `/reservations/available-slots`,
    { params: { project_id: projectId } }
  );
  return response.data;
}

/**
 * 동 목록 조회
 * @param visitInfoId 방문 정보 ID
 * @returns 동 목록
 */
export async function getDongs(visitInfoId: number): Promise<DongData[]> {
  const response = await api.get<DongsResponse>(
    `/reservations/dongs`,
    { params: { visit_info_id: visitInfoId } }
  );
  return response.data.list;
}

/**
 * 호 목록 조회
 * @param visitInfoId 방문 정보 ID
 * @param dongId 동 ID (선택)
 * @returns 호 목록
 */
export async function getDongHos(visitInfoId: number, dongId?: number): Promise<DongHoData[]> {
  const params: Record<string, number> = { visit_info_id: visitInfoId };
  if (dongId) {
    params.dong_id = dongId;
  }
  const response = await api.get<DongHosResponse>(
    `/reservations/dong-hos`,
    { params }
  );
  return response.data.list;
}

/**
 * 방문일정 등록
 * @param data 예약 정보
 * @returns 생성된 예약 정보
 */
export async function createVisitSchedule(data: CreateVisitScheduleRequest): Promise<VisitScheduleData> {
  const response = await api.post<CreateVisitScheduleResponse>(
    `/reservations/visit-schedules`,
    data
  );
  return response.data;
}
