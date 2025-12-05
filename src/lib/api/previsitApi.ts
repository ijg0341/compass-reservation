/**
 * 사전방문 Customer API 서비스
 * API 스펙: 2025-12-05 (UUID 기반)
 * Base URL: /customer/previsit/{uuid}
 */
import { api } from './client';
import type {
  CustomerPrevisitResponse,
  CustomerPrevisitData,
  CustomerDongsResponse,
  CustomerDonghosResponse,
  CustomerDonghoData,
  CustomerPrevisitReservationRequest,
  CustomerPrevisitReservationResponse,
  CustomerPrevisitReservationResultData,
  CustomerAvailableSlotsResponse,
  AvailableSlotsData,
  AvailableDateSlot,
  AvailableTimeSlot,
} from '@/types/api';

/**
 * 사전방문 행사 정보 조회 (UUID로 조회)
 * GET /customer/previsit/{uuid}
 *
 * @param uuid 사전방문 행사 UUID
 */
export async function getCustomerPrevisit(uuid: string): Promise<CustomerPrevisitData> {
  const response = await api.get<CustomerPrevisitResponse>(
    `/customer/previsit/${uuid}`
  );
  return response.data;
}

/**
 * 동 목록 조회
 * GET /customer/project/{projectId}/dongs
 */
export async function getCustomerDongs(projectId: number): Promise<string[]> {
  const response = await api.get<CustomerDongsResponse>(
    `/customer/project/${projectId}/dongs`
  );
  return response.data.list.map((item) => item.dong);
}

/**
 * 동호 목록 조회
 * GET /customer/project/{projectId}/donghos?dong={dong}
 */
export async function getCustomerDonghos(projectId: number, dong?: string): Promise<CustomerDonghoData[]> {
  const params: Record<string, string> = {};
  if (dong) {
    params.dong = dong;
  }
  const response = await api.get<CustomerDonghosResponse>(
    `/customer/project/${projectId}/donghos`,
    { params }
  );
  return response.data.list;
}

/**
 * 사전방문 예약 등록
 * POST /customer/previsit/{uuid}/reservations
 */
export async function createCustomerPrevisitReservation(
  uuid: string,
  data: CustomerPrevisitReservationRequest
): Promise<CustomerPrevisitReservationResultData> {
  const response = await api.post<CustomerPrevisitReservationResponse>(
    `/customer/previsit/${uuid}/reservations`,
    data
  );
  return response.data;
}

/**
 * 예약 가능 일정 조회
 * GET /customer/previsit/{uuid}/available-slots
 */
export async function getCustomerAvailableSlots(uuid: string): Promise<AvailableSlotsData> {
  const response = await api.get<CustomerAvailableSlotsResponse>(
    `/customer/previsit/${uuid}/available-slots`
  );
  return response.data;
}

// 타입 재export (하위 호환성)
export type { AvailableDateSlot, AvailableTimeSlot };

// ============================================================================
// 레거시 API 함수 (하위 호환성 - 추후 제거 예정)
// ============================================================================

import type {
  PrevisitResponse,
  PrevisitData,
} from '@/types/api';

/**
 * @deprecated getCustomerPrevisit 사용
 */
export async function getPrevisit(id: number): Promise<PrevisitData> {
  const response = await api.get<PrevisitResponse>(`/previsit/${id}`);
  return response.data;
}

/**
 * @deprecated getCustomerDongs 사용
 */
export async function getPrevisitDongs(previsitId: number): Promise<string[]> {
  // 레거시 API 호출 시도, 실패하면 빈 배열
  try {
    const response = await api.get<{ code: number; data: { list: { dong: string }[] } }>(
      '/previsit-reservations/dongs',
      { params: { previsit_id: previsitId } }
    );
    return response.data.list.map((item) => item.dong);
  } catch {
    return [];
  }
}

/**
 * @deprecated getCustomerDonghos 사용
 */
export async function getPrevisitDonghos(previsitId: number, dong: string): Promise<CustomerDonghoData[]> {
  try {
    const response = await api.get<{ code: number; data: { list: CustomerDonghoData[] } }>(
      '/previsit-reservations/donghos',
      { params: { previsit_id: previsitId, dong } }
    );
    return response.data.list;
  } catch {
    return [];
  }
}

/**
 * @deprecated getCustomerAvailableSlots 사용
 */
export async function getPrevisitAvailableSlots(_previsitId: number): Promise<AvailableDateSlot[]> {
  // 레거시 API는 더 이상 지원되지 않음
  return [];
}

/**
 * @deprecated createCustomerPrevisitReservation 사용
 */
export async function createPrevisitReservation(
  data: { previsit_id: number; dongho_id: number; reservation_date: string; reservation_time: string; writer_name: string; writer_phone: string; memo?: string }
): Promise<{ id: number }> {
  try {
    const response = await api.post<{ code: number; data: { id: number } }>(
      '/previsit-reservations',
      data
    );
    return response.data;
  } catch {
    throw new Error('예약 등록에 실패했습니다.');
  }
}
