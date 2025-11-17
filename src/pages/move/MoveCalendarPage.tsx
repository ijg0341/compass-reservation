import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import type { TimeSlot } from '../../types/move';

const unavailableDates = [
  '2024-08-05',
  '2024-08-12',
  '2024-08-15',
  '2024-08-19',
  '2024-08-26',
];

const timeSlots: TimeSlot[] = ['09:00~12:00', '12:00~15:00', '15:00~18:00'];

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export default function MoveCalendarPage() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(dayjs('2024-08-01'));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showTimeSlotDialog, setShowTimeSlotDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();

    const days: (number | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const isUnavailable = (day: number): boolean => {
    const dateStr = currentMonth.date(day).format('YYYY-MM-DD');
    return unavailableDates.includes(dateStr);
  };

  const handleDateClick = (day: number) => {
    if (isUnavailable(day)) return;

    const dateStr = currentMonth.date(day).format('YYYY-MM-DD');
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setShowTimeSlotDialog(true);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleTimeSlotConfirm = () => {
    if (!selectedSlot) return;
    setShowTimeSlotDialog(false);
    setShowConfirmDialog(true);
  };

  const handleReservationConfirm = () => {
    setShowConfirmDialog(false);
    navigate('/move/confirm', {
      state: {
        date: selectedDate,
        slot: selectedSlot,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        이사 날짜 선택
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mx: 2 }}>
          {currentMonth.format('YYYY년 M월')}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Grid container spacing={0.5} sx={{ mb: 1 }}>
        {weekDays.map((day, index) => (
          <Grid
            key={day}
            size={12 / 7}
            sx={{
              textAlign: 'center',
              py: 1,
              color:
                index === 0
                  ? 'error.main'
                  : index === 6
                    ? 'primary.main'
                    : 'text.primary',
              fontWeight: 'bold',
            }}
          >
            {day}
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          p: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Grid container spacing={0.5}>
          {calendarDays.map((day, index) => (
            <Grid key={index} size={12 / 7}>
              <Box
                onClick={() => day && handleDateClick(day)}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  cursor: day && !isUnavailable(day) ? 'pointer' : 'default',
                  backgroundColor:
                    day &&
                    selectedDate === currentMonth.date(day).format('YYYY-MM-DD')
                      ? 'primary.light'
                      : 'transparent',
                  '&:hover': {
                    backgroundColor:
                      day && !isUnavailable(day)
                        ? 'action.hover'
                        : 'transparent',
                  },
                  position: 'relative',
                }}
              >
                {day && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isUnavailable(day)
                          ? 'text.disabled'
                          : 'text.primary',
                      }}
                    >
                      {day}
                    </Typography>
                    {isUnavailable(day) && (
                      <CloseIcon
                        sx={{
                          position: 'absolute',
                          fontSize: '1.2rem',
                          color: 'error.main',
                          opacity: 0.7,
                        }}
                      />
                    )}
                  </>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: 'block' }}
      >
        * X 표시된 날짜는 예약이 불가합니다.
      </Typography>

      <Dialog
        open={showTimeSlotDialog}
        onClose={() => setShowTimeSlotDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          시간대 선택
          <Typography variant="body2" color="text.secondary">
            {selectedDate && dayjs(selectedDate).format('YYYY년 M월 D일')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <RadioGroup
            value={selectedSlot || ''}
            onChange={(e) => handleSlotSelect(e.target.value as TimeSlot)}
          >
            {timeSlots.map((slot) => (
              <FormControlLabel
                key={slot}
                value={slot}
                control={<Radio />}
                label={slot}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTimeSlotDialog(false)}>취소</Button>
          <Button
            onClick={handleTimeSlotConfirm}
            variant="contained"
            disabled={!selectedSlot}
          >
            선택
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>예약 확인</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <Typography variant="body1" gutterBottom>
              <strong>예약일:</strong>{' '}
              {selectedDate && dayjs(selectedDate).format('YYYY년 M월 D일')}
            </Typography>
            <Typography variant="body1">
              <strong>시간대:</strong> {selectedSlot}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>취소</Button>
          <Button onClick={handleReservationConfirm} variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
