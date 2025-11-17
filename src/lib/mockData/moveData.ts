import type { MoveTimeSlot, MoveCalendarDay, MoveReservation, MoveTimeSlotType } from '../../types';

/** 이사 시간대 슬롯 */
export const moveTimeSlots: MoveTimeSlot[] = [
  {
    id: 'slot-morning',
    timeRange: '09:00~12:00',
    label: '오전 (09:00~12:00)',
    available: 2,
    total: 3,
    isAvailable: true,
  },
  {
    id: 'slot-afternoon',
    timeRange: '12:00~15:00',
    label: '오후1 (12:00~15:00)',
    available: 1,
    total: 3,
    isAvailable: true,
  },
  {
    id: 'slot-evening',
    timeRange: '15:00~18:00',
    label: '오후2 (15:00~18:00)',
    available: 3,
    total: 3,
    isAvailable: true,
  },
];

/**
 * 특정 연/월의 이사 달력 데이터 생성
 */
export function generateMoveCalendar(year: number, month: number): MoveCalendarDay[] {
  const calendar: MoveCalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(year, month, 0).getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 공휴일 목록 (예시)
  const holidays = [
    `${year}-${String(month).padStart(2, '0')}-01`, // 신정
    `${year}-${String(month).padStart(2, '0')}-25`, // 성탄절
  ];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = dayNames[date.getDay()];
    const isPast = date < today;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = holidays.includes(dateString);
    const isAvailable = !isPast && !isWeekend && !isHoliday;

    // 각 날짜별 시간대 슬롯 생성
    const dayTimeSlots: MoveTimeSlot[] = moveTimeSlots.map((slot) => {
      if (!isAvailable) {
        return {
          ...slot,
          available: 0,
          isAvailable: false,
        };
      }

      // 랜덤하게 예약 가능 인원 생성
      const reserved = Math.floor(Math.random() * (slot.total + 1));
      const available = slot.total - reserved;

      return {
        ...slot,
        id: `${dateString}-${slot.id}`,
        available,
        isAvailable: available > 0,
      };
    });

    calendar.push({
      date: dateString,
      dayOfWeek,
      isAvailable,
      isHoliday,
      isPast,
      timeSlots: dayTimeSlots,
    });
  }

  return calendar;
}

/** Mock 이사 예약 데이터 */
export const mockMoveReservations: MoveReservation[] = [
  {
    id: 'move-001',
    userId: 'user-001',
    apartment: '창원동읍 한양 립스 더퍼스트',
    building: '101동',
    unit: '301',
    date: '2024-12-15',
    timeSlot: '09:00~12:00',
    ownerName: '김철수',
    phone: '010-1234-5678',
    vehicleType: '5톤 트럭',
    specialRequests: '피아노 운반 필요',
    status: 'active',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'move-002',
    userId: 'user-002',
    apartment: '창원동읍 한양 립스 더퍼스트',
    building: '102동',
    unit: '201',
    date: '2024-12-16',
    timeSlot: '12:00~15:00',
    ownerName: '이영희',
    phone: '010-2345-6789',
    vehicleType: '2.5톤 트럭',
    status: 'active',
    createdAt: '2024-12-02T14:30:00Z',
    updatedAt: '2024-12-02T14:30:00Z',
  },
  {
    id: 'move-003',
    userId: 'user-003',
    apartment: '창원동읍 한양 립스 더퍼스트',
    building: '103동',
    unit: '101',
    date: '2024-12-10',
    timeSlot: '15:00~18:00',
    ownerName: '박민수',
    phone: '010-3456-7890',
    status: 'cancelled',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-05T11:20:00Z',
  },
  {
    id: 'move-004',
    userId: 'user-004',
    apartment: '창원동읍 한양 립스 더퍼스트',
    building: '104동',
    unit: '502',
    date: '2024-12-20',
    timeSlot: '09:00~12:00',
    ownerName: '정수진',
    phone: '010-4567-8901',
    vehicleType: '1톤 트럭',
    specialRequests: '엘리베이터 전용 사용 요청',
    status: 'active',
    createdAt: '2024-12-03T16:45:00Z',
    updatedAt: '2024-12-03T16:45:00Z',
  },
];

/**
 * 사용자 ID로 이사 예약 조회
 */
export function getMoveReservationsByUser(userId: string): MoveReservation[] {
  return mockMoveReservations.filter((reservation) => reservation.userId === userId);
}

/**
 * 특정 날짜의 이사 예약 조회
 */
export function getMoveReservationsByDate(date: string): MoveReservation[] {
  return mockMoveReservations.filter(
    (reservation) => reservation.date === date && reservation.status === 'active'
  );
}

/**
 * 특정 날짜와 시간대의 예약 가능 여부 확인
 */
export function checkMoveSlotAvailability(
  date: string,
  timeSlot: MoveTimeSlotType
): { available: number; total: number } {
  const reservations = mockMoveReservations.filter(
    (r) => r.date === date && r.timeSlot === timeSlot && r.status === 'active'
  );

  const slotInfo = moveTimeSlots.find((slot) => slot.timeRange === timeSlot);
  const total = slotInfo?.total || 3;
  const available = total - reservations.length;

  return { available: Math.max(0, available), total };
}
