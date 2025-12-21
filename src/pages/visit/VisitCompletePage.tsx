import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';

interface ReservationData {
  name: string;
  phone: string;
  building: string;
  unit: string;
  date: string;
  time: string;
}

export default function VisitCompletePage() {
  const location = useLocation();
  const reservationData = location.state as ReservationData | null;

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      {/* 모바일 래퍼 */}
      <Box
        sx={{
          maxWidth: 480,
          mx: 'auto',
          borderLeft: '1px solid #E0E0E0',
          borderRight: '1px solid #E0E0E0',
          minHeight: '100vh',
          bgcolor: '#FFFFFF',
        }}
      >
        {/* 헤더 - 아파트 로고 */}
        <Box sx={{ py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ px: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              예약 완료
            </Typography>
            <Typography variant="body2" color="text.secondary">
              창원동읍 한양 립스 더퍼스트
            </Typography>
          </Box>
        </Box>

        {/* 완료 내용 */}
        <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />

          <Typography variant="h5" fontWeight={700} gutterBottom>
            예약이 완료되었습니다!
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            예약 내용을 확인해 주세요.
          </Typography>

          {/* 예약 정보 박스 */}
          <Box
            sx={{
              bgcolor: '#F5F5F5',
              borderRadius: 2,
              p: 3,
              mb: 4,
              textAlign: 'left',
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>신청자:</strong> {reservationData?.name || '-'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>연락처:</strong> {reservationData?.phone || '-'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>세대:</strong> {reservationData?.building || '-'}{' '}
              {reservationData?.unit || '-'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>예약 날짜:</strong> {reservationData?.date || '-'}
            </Typography>
            <Typography variant="body2">
              <strong>예약 시간:</strong> {reservationData?.time || '-'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
