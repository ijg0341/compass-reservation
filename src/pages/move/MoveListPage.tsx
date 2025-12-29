import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  CircularProgress,
  TextField,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ElevatorIcon from '@mui/icons-material/Elevator';
import { useAuthStore } from '../../stores/authStore';
import { moveApi } from '../../lib/api';
import type { CustomerMoveMyReservationData } from '../../types';

export default function MoveListPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [reservationData, setReservationData] = useState<CustomerMoveMyReservationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/move/${uuid}`);
    }
  }, [isAuthenticated, navigate, uuid]);

  // 내 예약 조회
  useEffect(() => {
    const fetchMyReservation = async () => {
      if (!uuid) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await moveApi.getMyReservation(uuid);
        if (response.code === 0) {
          setReservationData(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch reservation:', err);
        setError('예약 정보를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyReservation();
  }, [uuid]);

  const activeReservation = reservationData?.active_reservation;

  const handleCancelClick = () => {
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!uuid || !activeReservation) return;

    setIsCancelling(true);

    try {
      const response = await moveApi.cancelReservation(uuid, activeReservation.id, {
        reason: cancelReason || undefined,
      });

      if (response.code === 0) {
        setIsCancelled(true);
        setCancelDialogOpen(false);
        setReservationData(null);
      }
    } catch (err: unknown) {
      console.error('Cancel failed:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || '예약 취소에 실패했습니다.');
      } else {
        setError('예약 취소에 실패했습니다.');
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const handleNewReservation = () => {
    navigate(`/move/${uuid}/calendar`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ px: 2, py: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate(`/move/${uuid}`)}
        >
          다시 로그인하기
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h5"
        component="h1"
        fontWeight={700}
        gutterBottom
        align="center"
      >
        입주이사 예약 리스트
      </Typography>

      {isCancelled && (
        <Alert severity="success" sx={{ mb: 2 }}>
          예약이 성공적으로 취소되었습니다.
        </Alert>
      )}

      {!activeReservation ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            예약 내역이 없습니다.
          </Alert>
          <Button variant="contained" size="large" onClick={handleNewReservation}>
            이사예약 하기
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2,
              }}
            >
              <Typography variant="h6" component="h2">
                {reservationData?.dong} {reservationData?.ho}
              </Typography>
              <Chip label="예약됨" color="success" size="small" />
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.contractor_name}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" color="action" />
              <Typography variant="body1">
                {dayjs(activeReservation.reservation_date).locale('ko').format('YYYY년 M월 D일 (ddd)')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body1">{activeReservation.reservation_time}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <ElevatorIcon fontSize="small" color="action" />
              <Typography variant="body1">{activeReservation.reservation_evline} 라인</Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              예약일시: {dayjs(activeReservation.created_at).format('YYYY.MM.DD HH:mm')}
            </Typography>

            <Button
              variant="outlined"
              color="error"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleCancelClick}
            >
              예약 취소
            </Button>
          </Box>
        </Box>
      )}

      {/* 취소 다이얼로그 */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>예약 취소</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>정말로 이 예약을 취소하시겠습니까?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            취소된 예약은 복구할 수 없습니다.
          </Typography>
          <TextField
            label="취소 사유 (선택)"
            fullWidth
            multiline
            rows={2}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="취소 사유를 입력해주세요"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            variant="outlined"
            size="large"
            disabled={isCancelling}
          >
            아니오
          </Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            size="large"
            disabled={isCancelling}
          >
            {isCancelling ? <CircularProgress size={24} /> : '예약 취소'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
