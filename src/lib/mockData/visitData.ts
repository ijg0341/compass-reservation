import type { VisitInfoContent, ReservationDate, TimeSlot } from '../../types';

/** 방문 안내 정보 */
export const mockVisitInfo: VisitInfoContent = {
  apartmentName: '창원동읍 한양 립스 더퍼스트',
  welcomeMessage:
    '창원동읍 한양 립스 더퍼스트에 오신 것을 환영합니다. 사전 방문 예약을 통해 보다 편리하게 모델하우스를 관람하실 수 있습니다.',
  eventPeriod: '2024년 12월 1일 ~ 2024년 12월 31일',
  location: '경상남도 창원시 의창구 동읍 용잠로 123 (모델하우스)',
  requiredDocuments: [
    '신분증 (주민등록증, 운전면허증 등)',
    '청약통장 사본 (해당 시)',
    '소득증빙서류 (필요 시)',
  ],
  contactNumber: '055-123-4567',
  additionalInfo:
    '주차공간이 한정되어 있으니 가급적 대중교통을 이용해 주시기 바랍니다. 예약 시간 10분 전까지 도착해 주세요.',
};

/**
 * 예약 가능 날짜 및 시간대 생성
 * @returns 3일간의 예약 가능 날짜 및 시간대
 */
export function generateReservationDates(): ReservationDate[] {
  const dates: ReservationDate[] = [];
  const today = new Date();

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const timeSlotTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = dayNames[date.getDay()];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const label = `${month}월 ${day}일 (${dayOfWeek})`;

    const timeSlots: TimeSlot[] = timeSlotTimes.map((time) => {
      // 랜덤하게 예약 가능 인원 생성
      const total = 10;
      const reserved = Math.floor(Math.random() * 11);
      const available = total - reserved;

      return {
        time,
        available,
        total,
        isAvailable: available > 0,
      };
    });

    dates.push({
      date: dateString,
      dayOfWeek,
      label,
      timeSlots,
    });
  }

  return dates;
}

/** 캐시된 예약 날짜 데이터 */
let cachedReservationDates: ReservationDate[] | null = null;

/**
 * 예약 날짜 데이터 조회 (캐시 사용)
 */
export function getReservationDates(): ReservationDate[] {
  if (!cachedReservationDates) {
    cachedReservationDates = generateReservationDates();
  }
  return cachedReservationDates;
}

/**
 * 예약 날짜 캐시 초기화
 */
export function resetReservationDatesCache(): void {
  cachedReservationDates = null;
}
