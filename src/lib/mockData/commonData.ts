import type { Apartment, Building, Unit } from '../../types';

/** Mock 아파트 데이터 */
export const mockApartments: Apartment[] = [
  {
    id: 'apt-001',
    name: '창원동읍 한양 립스 더퍼스트',
    address: '경상남도 창원시 의창구 동읍',
    totalBuildings: 10,
  },
  {
    id: 'apt-002',
    name: '서울숲 아이파크',
    address: '서울특별시 성동구 성수동',
    totalBuildings: 8,
  },
  {
    id: 'apt-003',
    name: '판교 알파리움',
    address: '경기도 성남시 분당구 판교동',
    totalBuildings: 12,
  },
];

/** Mock 동(건물) 데이터 */
export const mockBuildings: Building[] = [
  // 창원동읍 한양 립스 더퍼스트
  { id: 'bld-001', apartmentId: 'apt-001', name: '101동', number: '101', totalUnits: 120 },
  { id: 'bld-002', apartmentId: 'apt-001', name: '102동', number: '102', totalUnits: 120 },
  { id: 'bld-003', apartmentId: 'apt-001', name: '103동', number: '103', totalUnits: 100 },
  { id: 'bld-004', apartmentId: 'apt-001', name: '104동', number: '104', totalUnits: 100 },
  { id: 'bld-005', apartmentId: 'apt-001', name: '105동', number: '105', totalUnits: 80 },
  // 서울숲 아이파크
  { id: 'bld-006', apartmentId: 'apt-002', name: '201동', number: '201', totalUnits: 150 },
  { id: 'bld-007', apartmentId: 'apt-002', name: '202동', number: '202', totalUnits: 150 },
  { id: 'bld-008', apartmentId: 'apt-002', name: '203동', number: '203', totalUnits: 130 },
  // 판교 알파리움
  { id: 'bld-009', apartmentId: 'apt-003', name: '301동', number: '301', totalUnits: 200 },
  { id: 'bld-010', apartmentId: 'apt-003', name: '302동', number: '302', totalUnits: 200 },
];

/** Mock 호수(세대) 데이터 */
export const mockUnits: Unit[] = [
  // 101동
  { id: 'unit-001', buildingId: 'bld-001', number: '101', floor: 1 },
  { id: 'unit-002', buildingId: 'bld-001', number: '102', floor: 1 },
  { id: 'unit-003', buildingId: 'bld-001', number: '201', floor: 2 },
  { id: 'unit-004', buildingId: 'bld-001', number: '202', floor: 2 },
  { id: 'unit-005', buildingId: 'bld-001', number: '301', floor: 3 },
  { id: 'unit-006', buildingId: 'bld-001', number: '302', floor: 3 },
  { id: 'unit-007', buildingId: 'bld-001', number: '401', floor: 4 },
  { id: 'unit-008', buildingId: 'bld-001', number: '402', floor: 4 },
  { id: 'unit-009', buildingId: 'bld-001', number: '501', floor: 5 },
  { id: 'unit-010', buildingId: 'bld-001', number: '502', floor: 5 },
  // 102동
  { id: 'unit-011', buildingId: 'bld-002', number: '101', floor: 1 },
  { id: 'unit-012', buildingId: 'bld-002', number: '102', floor: 1 },
  { id: 'unit-013', buildingId: 'bld-002', number: '201', floor: 2 },
  { id: 'unit-014', buildingId: 'bld-002', number: '202', floor: 2 },
  { id: 'unit-015', buildingId: 'bld-002', number: '301', floor: 3 },
  // 103동
  { id: 'unit-016', buildingId: 'bld-003', number: '101', floor: 1 },
  { id: 'unit-017', buildingId: 'bld-003', number: '102', floor: 1 },
  { id: 'unit-018', buildingId: 'bld-003', number: '201', floor: 2 },
  { id: 'unit-019', buildingId: 'bld-003', number: '202', floor: 2 },
  { id: 'unit-020', buildingId: 'bld-003', number: '301', floor: 3 },
];

/**
 * 아파트 ID로 해당 동 목록 조회
 */
export function getBuildingsByApartment(apartmentId: string): Building[] {
  return mockBuildings.filter((building) => building.apartmentId === apartmentId);
}

/**
 * 동 ID로 해당 호수 목록 조회
 */
export function getUnitsByBuilding(buildingId: string): Unit[] {
  return mockUnits.filter((unit) => unit.buildingId === buildingId);
}
