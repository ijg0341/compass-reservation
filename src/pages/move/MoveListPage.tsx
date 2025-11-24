import { useState } from 'react';
import dayjs from 'dayjs';
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
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { MoveReservation } from '../../types/move';

const mockMoveReservations: MoveReservation[] = [
  {
    id: '1',
    userId: '1',
    apartmentName: '래미안 아파트',
    contractorName: '홍길동',
    dong: '101동',
    ho: '101호',
    date: '2024-08-10',
    timeSlot: '09:00~12:00',
    status: 'active',
    createdAt: '2024-08-01T10:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    apartmentName: '래미안 아파트',
    contractorName: '홍길동',
    dong: '101동',
    ho: '101호',
    date: '2024-07-20',
    timeSlot: '12:00~15:00',
    status: 'cancelled',
    createdAt: '2024-07-15T14:30:00Z',
  },
  {
    id: '3',
    userId: '1',
    apartmentName: '래미안 아파트',
    contractorName: '홍길동',
    dong: '101동',
    ho: '101호',
    date: '2024-08-25',
    timeSlot: '15:00~18:00',
    status: 'active',
    createdAt: '2024-08-02T09:15:00Z',
  },
];

export default function MoveListPage() {
  const [reservations, setReservations] =
    useState<MoveReservation[]>(mockMoveReservations);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  const handleCancelClick = (id: string) => {
    setSelectedReservationId(id);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (!selectedReservationId) return;

    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === selectedReservationId
          ? { ...reservation, status: 'cancelled' as const }
          : reservation
      )
    );

    setCancelDialogOpen(false);
    setSelectedReservationId(null);
  };

  const getStatusChip = (status: 'active' | 'cancelled') => {
    if (status === 'active') {
      return <Chip label="예약됨" color="success" size="small" />;
    }
    return <Chip label="취소됨" color="default" size="small" />;
  };

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

      {reservations.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Alert severity="info">예약 내역이 없습니다.</Alert>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {reservations.map((reservation) => (
            <Box
              key={reservation.id}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor:
                  reservation.status === 'cancelled'
                    ? 'grey.50'
                    : 'background.paper',
                opacity: reservation.status === 'cancelled' ? 0.8 : 1,
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
                  {reservation.apartmentName}
                </Typography>
                {getStatusChip(reservation.status)}
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {reservation.contractorName} | {reservation.dong}{' '}
                {reservation.ho}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon fontSize="small" color="action" />
                <Typography variant="body1">
                  {dayjs(reservation.date).format('YYYY년 M월 D일 (ddd)')}
                </Typography>
              </Box>

              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}
              >
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography variant="body1">{reservation.timeSlot}</Typography>
              </Box>

              {reservation.status === 'active' && (
                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleCancelClick(reservation.id)}
                >
                  예약 취소
                </Button>
              )}

              {reservation.status === 'cancelled' && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2, textAlign: 'center' }}
                >
                  취소된 예약입니다.
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>예약 취소</DialogTitle>
        <DialogContent>
          <Typography>정말로 이 예약을 취소하시겠습니까?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            취소된 예약은 복구할 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            variant="outlined"
            size="large"
          >
            아니오
          </Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            size="large"
          >
            예약 취소
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
