/**
 * Mock data for visit reservation system
 */

// Apartment information
export const apartmentInfo = {
  name: '래미안 힐스테이트',
  welcomeMessage: '입주민 여러분을 환영합니다',
  eventPeriod: '2024년 12월 1일 ~ 2024년 12월 31일',
  eventTime: '평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00 제외)',
  location: '서울특별시 강남구 테헤란로 123',
  address: '래미안 힐스테이트 커뮤니티센터 1층',
  requiredDocuments: {
    contractor: [
      '신분증 (주민등록증, 운전면허증, 여권 중 택1)',
      '분양계약서 사본',
      '인감도장',
    ],
    representative: [
      '신분증 (주민등록증, 운전면허증, 여권 중 택1)',
      '위임장 (인감날인)',
      '인감증명서 (3개월 이내 발급)',
      '계약자 신분증 사본',
    ],
  },
  contactInfo: {
    phone: '02-1234-5678',
    email: 'support@compass.co.kr',
    operatingHours: '평일 09:00 ~ 18:00',
  },
};

// App download information
export const appDownloadInfo = {
  title: 'Compass 앱 설치 안내',
  iphoneGuide: '아이폰 사용자는 입주자라운지에서 직접 설치해 주세요.',
  appLogo: '/compass-logo.png',
  warnings: [
    '앱 미설치 시 사전점검이 불가능합니다.',
    '설치 시 보안 경고 메시지가 표시될 수 있으나, 무시하고 진행해 주세요.',
    '행사 당일 고유 ID가 부여됩니다.',
  ],
  contactInfo: {
    phone: '02-1234-5678',
    email: 'support@compass.co.kr',
  },
};

// Building and unit data
export const buildings = [
  { id: '101', name: '101동' },
  { id: '102', name: '102동' },
  { id: '103', name: '103동' },
  { id: '104', name: '104동' },
  { id: '105', name: '105동' },
];

export const unitsByBuilding: Record<string, { id: string; name: string }[]> = {
  '101': [
    { id: '101', name: '101호' },
    { id: '102', name: '102호' },
    { id: '103', name: '103호' },
    { id: '201', name: '201호' },
    { id: '202', name: '202호' },
    { id: '203', name: '203호' },
    { id: '301', name: '301호' },
    { id: '302', name: '302호' },
    { id: '303', name: '303호' },
  ],
  '102': [
    { id: '101', name: '101호' },
    { id: '102', name: '102호' },
    { id: '201', name: '201호' },
    { id: '202', name: '202호' },
    { id: '301', name: '301호' },
    { id: '302', name: '302호' },
  ],
  '103': [
    { id: '101', name: '101호' },
    { id: '102', name: '102호' },
    { id: '103', name: '103호' },
    { id: '104', name: '104호' },
    { id: '201', name: '201호' },
    { id: '202', name: '202호' },
    { id: '203', name: '203호' },
    { id: '204', name: '204호' },
  ],
  '104': [
    { id: '101', name: '101호' },
    { id: '102', name: '102호' },
    { id: '201', name: '201호' },
    { id: '202', name: '202호' },
  ],
  '105': [
    { id: '101', name: '101호' },
    { id: '102', name: '102호' },
    { id: '103', name: '103호' },
    { id: '201', name: '201호' },
    { id: '202', name: '202호' },
    { id: '203', name: '203호' },
  ],
};

// Reservation dates
export const reservationDates = [
  { id: '1', date: '2024-12-01', label: '12월 1일 (일)' },
  { id: '2', date: '2024-12-02', label: '12월 2일 (월)' },
  { id: '3', date: '2024-12-03', label: '12월 3일 (화)' },
  { id: '4', date: '2024-12-04', label: '12월 4일 (수)' },
  { id: '5', date: '2024-12-05', label: '12월 5일 (목)' },
];

// Time slots with availability
export interface TimeSlot {
  id: string;
  time: string;
  available: number;
  total: number;
}

export const getTimeSlotsByDate = (dateId: string): TimeSlot[] => {
  // Simulate different availability based on date
  const baseSlots = [
    { id: '1', time: '09:00', available: 5, total: 10 },
    { id: '2', time: '10:00', available: 3, total: 10 },
    { id: '3', time: '11:00', available: 8, total: 10 },
    { id: '4', time: '13:00', available: 2, total: 10 },
    { id: '5', time: '14:00', available: 6, total: 10 },
    { id: '6', time: '15:00', available: 0, total: 10 },
    { id: '7', time: '16:00', available: 4, total: 10 },
    { id: '8', time: '17:00', available: 7, total: 10 },
  ];

  // Adjust availability based on date for variety
  const dateOffset = parseInt(dateId, 10);
  return baseSlots.map((slot) => ({
    ...slot,
    available: Math.max(
      0,
      Math.min(slot.total, slot.available + ((dateOffset * 2) % 5) - 2)
    ),
  }));
};

// Reservation notices
export const reservationNotices = [
  '예약 중복은 불가능합니다.',
  '1세대당 1회만 예약 가능합니다.',
  '예약 후 변경 및 취소는 고객센터로 문의해 주세요.',
];
