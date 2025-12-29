/**
 * 이사예약 API 서비스
 * Base URL: /customer/move/{uuid}
 * 인증: Cookie 기반 세션
 */
import axios, { type AxiosInstance } from 'axios';
import type {
  CustomerMoveInfoResponse,
  CustomerMoveLoginRequest,
  CustomerMoveLoginResponse,
  CustomerMoveAvailableSlotsResponse,
  CustomerMoveReservationRequest,
  CustomerMoveReservationResponse,
  CustomerMoveMyReservationResponse,
  CustomerMoveCancelRequest,
  CustomerMoveCancelResponse,
  CustomerDongsResponse,
  CustomerDonghosResponse,
} from '../../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * 이사예약 전용 API 클라이언트
 * Cookie 기반 세션 인증을 위해 withCredentials: true 설정
 */
const moveApiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie 기반 인증
});

/**
 * 이사예약 API 서비스
 */
export const moveApi = {
  /**
   * 이사예약 정보 조회
   * GET /customer/move/{uuid}
   */
  getMoveInfo: async (moveUuid: string): Promise<CustomerMoveInfoResponse> => {
    const response = await moveApiClient.get<CustomerMoveInfoResponse>(
      `/customer/move/${moveUuid}`
    );
    return response.data;
  },

  /**
   * 동 목록 조회
   * GET /customer/project/{projectUuid}/dongs
   */
  getDongs: async (projectUuid: string): Promise<CustomerDongsResponse> => {
    const response = await moveApiClient.get<CustomerDongsResponse>(
      `/customer/project/${projectUuid}/dongs`
    );
    return response.data;
  },

  /**
   * 동호 목록 조회
   * GET /customer/project/{projectUuid}/donghos?dong={dong}
   */
  getDonghos: async (
    projectUuid: string,
    dong?: string
  ): Promise<CustomerDonghosResponse> => {
    const params = dong ? { dong } : {};
    const response = await moveApiClient.get<CustomerDonghosResponse>(
      `/customer/project/${projectUuid}/donghos`,
      { params }
    );
    return response.data;
  },

  /**
   * 이사예약 로그인
   * POST /customer/move/{uuid}/login
   */
  login: async (
    moveUuid: string,
    data: CustomerMoveLoginRequest
  ): Promise<CustomerMoveLoginResponse> => {
    const response = await moveApiClient.post<CustomerMoveLoginResponse>(
      `/customer/move/${moveUuid}/login`,
      data
    );
    return response.data;
  },

  /**
   * 이사예약 로그아웃
   * POST /customer/move/{uuid}/logout
   */
  logout: async (moveUuid: string): Promise<void> => {
    await moveApiClient.post(`/customer/move/${moveUuid}/logout`);
  },

  /**
   * 예약 가능 시간대 조회
   * GET /customer/move/{uuid}/available-slots
   */
  getAvailableSlots: async (
    moveUuid: string
  ): Promise<CustomerMoveAvailableSlotsResponse> => {
    const response = await moveApiClient.get<CustomerMoveAvailableSlotsResponse>(
      `/customer/move/${moveUuid}/available-slots`
    );
    return response.data;
  },

  /**
   * 이사예약 등록
   * POST /customer/move/{uuid}/reservations
   */
  createReservation: async (
    moveUuid: string,
    data: CustomerMoveReservationRequest
  ): Promise<CustomerMoveReservationResponse> => {
    const response = await moveApiClient.post<CustomerMoveReservationResponse>(
      `/customer/move/${moveUuid}/reservations`,
      data
    );
    return response.data;
  },

  /**
   * 내 이사예약 조회
   * GET /customer/move/{uuid}/my-reservation
   */
  getMyReservation: async (
    moveUuid: string
  ): Promise<CustomerMoveMyReservationResponse> => {
    const response = await moveApiClient.get<CustomerMoveMyReservationResponse>(
      `/customer/move/${moveUuid}/my-reservation`
    );
    return response.data;
  },

  /**
   * 이사예약 취소
   * DELETE /customer/move/{uuid}/reservations/{id}
   */
  cancelReservation: async (
    moveUuid: string,
    reservationId: number,
    data?: CustomerMoveCancelRequest
  ): Promise<CustomerMoveCancelResponse> => {
    const response = await moveApiClient.delete<CustomerMoveCancelResponse>(
      `/customer/move/${moveUuid}/reservations/${reservationId}`,
      { data }
    );
    return response.data;
  },
};

export default moveApi;
