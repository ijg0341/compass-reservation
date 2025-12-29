import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {
  Box,
  Typography,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { moveApi } from '../../lib/api';

interface LocationState {
  date: string;
  time: string;
  evline: string;
}

export default function MoveConfirmPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as LocationState | null;

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/move/${uuid}`);
    }
  }, [isAuthenticated, navigate, uuid]);

  // 예약 정보 없으면 에러
  if (!state || !state.date || !state.time || !state.evline) {
    return (
      <Box>
        <Alert severity="error">
          예약 정보를 찾을 수 없습니다. 다시 시도해주세요.
        </Alert>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate(`/move/${uuid}/calendar`)}
        >
          날짜 선택으로 돌아가기
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
          onClick={() => navigate(`/move/${uuid}`)}
        >
          로그인 페이지로 이동
        </Button>
      </Box>
    );
  }

  const { date, time, evline } = state;

  const handleSubmit = async () => {
    if (!uuid) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await moveApi.createReservation(uuid, {
        reservation_evline: evline,
        reservation_date: date,
        reservation_time: time,
      });

      if (response.code === 0 && response.data) {
        setIsSubmitted(true);
      } else {
        setError(response.message || '예약에 실패했습니다.');
      }
    } catch (err: unknown) {
      console.error('Reservation failed:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || '예약에 실패했습니다.');
      } else {
        setError('예약에 실패했습니다. 네트워크 상태를 확인해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToList = () => {
    navigate(`/move/${uuid}/list`);
  };

  // 예약 완료 화면
  if (isSubmitted) {
    return (
      <Box>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
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
                동/호
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.dong} {user.ho}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                계약자
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user.contractor_name}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="body2" color="text.secondary">
                예약일
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {dayjs(date).locale('ko').format('YYYY년 M월 D일 (ddd)')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                시간대
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {time}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                엘리베이터 라인
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {evline} 라인
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
          onClick={handleGoToList}
          sx={{ mt: 3 }}
        >
          확인
        </Button>
      </Box>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <Box>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            예약 실패
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {error}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => navigate(`/move/${uuid}/calendar`)}
          >
            다시 선택하기
          </Button>
          <Button variant="contained" fullWidth size="large" onClick={handleSubmit}>
            다시 시도
          </Button>
        </Box>
      </Box>
    );
  }

  // 예약 확인 화면
  return (
    <Box>
      <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom align="center">
        예약 확인
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
        아래 정보를 확인하고 예약을 완료해주세요.
      </Typography>

      <Box
        sx={{
          bgcolor: '#F5F5F5',
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          예약자 정보
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              동/호
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {user.dong} {user.ho}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              계약자
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {user.contractor_name}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: '#F5F5F5',
          borderRadius: 2,
          p: 3,
          mt: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          예약 정보
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              예약일
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {dayjs(date).locale('ko').format('YYYY년 M월 D일 (ddd)')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              시간대
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {time}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              엘리베이터 라인
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {evline} 라인
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          onClick={() => navigate(`/move/${uuid}/calendar`)}
          disabled={isSubmitting}
        >
          이전
        </Button>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : '예약하기'}
        </Button>
      </Box>
    </Box>
  );
}
