export { apiClient, api } from './client';
export { getAvailableSlots, getDongs, getDongHos, createVisitSchedule } from './reservationApi';

// Customer API (신규)
export {
  getCustomerPrevisit,
  getCustomerDongs,
  getCustomerDonghos,
  createCustomerPrevisitReservation,
  getCustomerAvailableSlots,
} from './previsitApi';

// 레거시 API (하위 호환성)
export {
  getPrevisit,
  getPrevisitAvailableSlots,
  getPrevisitDongs,
  getPrevisitDonghos,
  createPrevisitReservation,
} from './previsitApi';

// 이사예약 API
export { moveApi } from './moveApi';
