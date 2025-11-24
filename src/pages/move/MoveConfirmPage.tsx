import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Box,
  Typography,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import type { TimeSlot } from '../../types/move';

interface LocationState {
  date: string;
  slot: TimeSlot;
}

export default function MoveConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const state = location.state as LocationState | null;

  if (!state || !state.date || !state.slot) {
    return (
      <Box>
        <Alert severity="error">
          예약 정보를 찾을 수 없습니다. 다시 시도해주세요.
        </Alert>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/move')}
        >
          처음으로 돌아가기
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Alert severity="error">
          로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.
        </Alert>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/move')}
        >
          로그인 페이지로 이동
        </Button>
      </Box>
    );
  }

  const { date, slot } = state;

  const handleConfirm = () => {
    navigate('/move/list');
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircle
          sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
        />
        <Typography variant="h5" component="h1" gutterBottom>
          입주이사 예약완료
        </Typography>
        <Typography variant="body1" color="text.secondary">
          예약이 성공적으로 완료되었습니다.
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: '#F5F5F5',
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          예약 정보
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              아파트명
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {user.apartmentName}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              계약자
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {user.contractorName}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              동/호
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {user.dong} {user.ho}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="body2" color="text.secondary">
              예약일
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {dayjs(date).format('YYYY년 M월 D일 (ddd)')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              시간대
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {slot}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        예약 변경 또는 취소는 예약 리스트에서 가능합니다.
      </Alert>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleConfirm}
        sx={{ mt: 3 }}
      >
        확인
      </Button>
    </Box>
  );
}
