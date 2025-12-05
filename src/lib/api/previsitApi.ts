/**
 * 사전방문 Customer API 서비스
 * API 스펙: 2025-12-05 (UUID 기반)
 * Base URL: /customer/project/{projectId}/previsit/{uuid}
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
  GeneratedDateSlot,
  GeneratedTimeSlot,
} from '@/types/api';

/**
 * 사전방문 행사 정보 조회 (UUID로 조회)
 * GET /customer/project/{projectId}/previsit/{uuid}
 *
 * @param uuid 사전방문 행사 UUID
 * @param projectId 프로젝트 ID (optional, 백엔드에서 검증하지 않음)
 */
export async function getCustomerPrevisit(uuid: string, projectId: number = 0): Promise<CustomerPrevisitData> {
  const response = await api.get<CustomerPrevisitResponse>(
    `/customer/project/${projectId}/previsit/${uuid}`
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
 * POST /customer/project/{projectId}/previsit/{uuid}/reservations
 */
export async function createCustomerPrevisitReservation(
  projectId: number,
  uuid: string,
  data: CustomerPrevisitReservationRequest
): Promise<CustomerPrevisitReservationResultData> {
  const response = await api.post<CustomerPrevisitReservationResponse>(
    `/customer/project/${projectId}/previsit/${uuid}/reservations`,
    data
  );
  return response.data;
}

/**
 * 시간 슬롯 생성 유틸리티
 * previsit 정보를 기반으로 프론트엔드에서 시간 슬롯 생성
 * (available-slots API가 Customer API에 없으므로 프론트엔드에서 계산)
 */
export function generateTimeSlots(previsit: CustomerPrevisitData): GeneratedDateSlot[] {
  const dates: GeneratedDateSlot[] = [];

  // 날짜 범위 생성
  const dateBegin = new Date(previsit.date_begin);
  const dateEnd = new Date(previsit.date_end);
  const timeUnit = previsit.time_unit || 60;
  const maxLimit = previsit.max_limit || 0;

  // 시간 파싱 (HH:mm:ss 또는 HH:mm 형식)
  const parseTime = (timeStr: string): { hours: number; minutes: number } => {
    const parts = timeStr.split(':');
    return {
      hours: parseInt(parts[0], 10),
      minutes: parseInt(parts[1], 10),
    };
  };

  const timeFirst = parseTime(previsit.time_first);
  const timeLast = parseTime(previsit.time_last);

  // 날짜별 시간 슬롯 생성
  const currentDate = new Date(dateBegin);
  while (currentDate <= dateEnd) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const times: GeneratedTimeSlot[] = [];

    // 시간 슬롯 생성
    let currentMinutes = timeFirst.hours * 60 + timeFirst.minutes;
    const lastMinutes = timeLast.hours * 60 + timeLast.minutes;

    while (currentMinutes <= lastMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

      times.push({
        time: timeStr,
        available: maxLimit, // 실제 예약 현황을 알 수 없으므로 max_limit 표시
      });

      currentMinutes += timeUnit;
    }

    dates.push({
      date: dateStr,
      times,
    });

    // 다음 날짜로
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

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
 * @deprecated generateTimeSlots 사용
 */
export async function getPrevisitAvailableSlots(_previsitId: number): Promise<GeneratedDateSlot[]> {
  // 레거시 API는 더 이상 지원되지 않음
  // previsit 정보를 가져와서 시간 슬롯 생성
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
