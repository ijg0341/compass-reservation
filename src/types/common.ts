/**
 * 공통 타입 정의
 */

/** API 응답 기본 구조 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/** 페이지네이션 응답 구조 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 셀렉트 옵션 */
export interface SelectOption {
  value: string;
  label: string;
}

/** 아파트 정보 */
export interface Apartment {
  id: string;
  name: string;
  address: string;
  totalBuildings: number;
}

/** 동(건물) 정보 */
export interface Building {
  id: string;
  apartmentId: string;
  name: string;
  number: string;
  totalUnits: number;
}

/** 호수(세대) 정보 */
export interface Unit {
  id: string;
  buildingId: string;
  number: string;
  floor: number;
}
