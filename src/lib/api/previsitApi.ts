/**
 * 사전방문 API 서비스
 * 모든 API는 previsit_id 기준으로 동작
 */
import { api } from './client';
import type {
  PrevisitResponse,
  PrevisitData,
  PrevisitAvailableSlotsResponse,
  PrevisitAvailableSlotsData,
  PrevisitDongsResponse,
  PrevisitDonghosResponse,
  PrevisitDonghoData,
  CreatePrevisitReservationRequest,
  CreatePrevisitReservationResponse,
  PrevisitReservationResultData,
} from '@/types/api';

/**
 * 사전방문 정보 조회
 * @param id 사전방문 ID
 * @returns 사전방문 정보
 */
export async function getPrevisit(id: number): Promise<PrevisitData> {
  const response = await api.get<PrevisitResponse>(`/previsit/${id}`);
  return response.data;
}

/**
 * 예약 가능 일자/시간 조회 (previsit_id 기준)
 * @param previsitId 사전방문 ID
 * @returns 예약 가능한 날짜 및 시간 슬롯 목록
 */
export async function getPrevisitAvailableSlots(previsitId: number): Promise<PrevisitAvailableSlotsData> {
  const response = await api.get<PrevisitAvailableSlotsResponse>(
    '/previsit-reservations/available-slots',
    { params: { previsit_id: previsitId } }
  );
  return response.data;
}

/**
 * 동 목록 조회 (previsit_id 기준)
 * @param previsitId 사전방문 ID
 * @returns 동 목록
 */
export async function getPrevisitDongs(previsitId: number): Promise<string[]> {
  const response = await api.get<PrevisitDongsResponse>(
    '/previsit-reservations/dongs',
    { params: { previsit_id: previsitId } }
  );
  return response.data.list.map((item) => item.dong);
}

/**
 * 동호 목록 조회 (previsit_id + dong 기준)
 * @param previsitId 사전방문 ID
 * @param dong 동 이름
 * @returns 동호 목록
 */
export async function getPrevisitDonghos(previsitId: number, dong: string): Promise<PrevisitDonghoData[]> {
  const response = await api.get<PrevisitDonghosResponse>(
    '/previsit-reservations/donghos',
    { params: { previsit_id: previsitId, dong } }
  );
  return response.data.list;
}

/**
 * 사전방문 예약 등록
 * @param data 예약 정보
 * @returns 생성된 예약 ID
 */
export async function createPrevisitReservation(
  data: CreatePrevisitReservationRequest
): Promise<PrevisitReservationResultData> {
  const response = await api.post<CreatePrevisitReservationResponse>(
    '/previsit-reservations',
    data
  );
  return response.data;
}
