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
    <Box sx={{ px: 2, py: 3 }}>
      <Typography
        variant="h5"
        component="h1"
        fontWeight="bold"
        gutterBottom
        align="center"
        sx={{ mb: 3 }}
      >
        이사 날짜 선택
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          bgcolor: '#FAFAFA',
          py: 1.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold" sx={{ mx: 3, minWidth: 140, textAlign: 'center' }}>
          {currentMonth.format('YYYY년 M월')}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Grid container spacing={1} sx={{ mb: 2 }}>
        {weekDays.map((day, index) => (
          <Grid
            key={day}
            size={12 / 7}
            sx={{
              textAlign: 'center',
              py: 1.5,
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
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          bgcolor: '#FAFAFA',
        }}
      >
        <Grid container spacing={1}>
          {calendarDays.map((day, index) => (
            <Grid key={index} size={12 / 7}>
              <Box
                onClick={() => day && handleDateClick(day)}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  cursor: day && !isUnavailable(day) ? 'pointer' : 'default',
                  backgroundColor:
                    day &&
                    selectedDate === currentMonth.date(day).format('YYYY-MM-DD')
                      ? 'primary.main'
                      : day && isUnavailable(day)
                        ? '#E0E0E0'
                        : '#FFFFFF',
                  border: '1px solid',
                  borderColor:
                    day &&
                    selectedDate === currentMonth.date(day).format('YYYY-MM-DD')
                      ? 'primary.main'
                      : 'divider',
                  '&:hover': {
                    backgroundColor:
                      day && !isUnavailable(day)
                        ? day &&
                          selectedDate ===
                            currentMonth.date(day).format('YYYY-MM-DD')
                          ? 'primary.dark'
                          : 'action.hover'
                        : '#E0E0E0',
                  },
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {day && (
                  <>
                    <Typography
                      variant="body2"
                      fontWeight={
                        selectedDate ===
                        currentMonth.date(day).format('YYYY-MM-DD')
                          ? 'bold'
                          : 'medium'
                      }
                      sx={{
                        color:
                          selectedDate ===
                          currentMonth.date(day).format('YYYY-MM-DD')
                            ? '#FFFFFF'
                            : isUnavailable(day)
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
                          opacity: 0.6,
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

      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: '#FFF9E6',
          borderRadius: 2,
          border: '1px solid #FFE082',
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight="medium">
          * X 표시된 날짜는 예약이 불가합니다.
        </Typography>
      </Box>

      <Dialog
        open={showTimeSlotDialog}
        onClose={() => setShowTimeSlotDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            시간대 선택
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {selectedDate && dayjs(selectedDate).format('YYYY년 M월 D일')}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <RadioGroup
            value={selectedSlot || ''}
            onChange={(e) => handleSlotSelect(e.target.value as TimeSlot)}
          >
            {timeSlots.map((slot) => (
              <FormControlLabel
                key={slot}
                value={slot}
                control={<Radio size="small" />}
                label={
                  <Typography variant="body2" fontWeight="medium">
                    {slot}
                  </Typography>
                }
                sx={{
                  mb: 1.5,
                  py: 1,
                  px: 1.5,
                  border: '1px solid',
                  borderColor: selectedSlot === slot ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  backgroundColor:
                    selectedSlot === slot ? 'primary.light' : 'transparent',
                  '&:hover': {
                    backgroundColor:
                      selectedSlot === slot ? 'primary.light' : 'action.hover',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setShowTimeSlotDialog(false)}
            size="large"
            sx={{ py: 1.5 }}
          >
            취소
          </Button>
          <Button
            onClick={handleTimeSlotConfirm}
            variant="contained"
            disabled={!selectedSlot}
            size="large"
            sx={{ py: 1.5, minWidth: 120 }}
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
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            예약 확인
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: '#F5F5F5',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                예약일
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {selectedDate && dayjs(selectedDate).format('YYYY년 M월 D일')}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                bgcolor: '#F5F5F5',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                시간대
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {selectedSlot}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setShowConfirmDialog(false)}
            size="large"
            sx={{ py: 1.5 }}
          >
            취소
          </Button>
          <Button
            onClick={handleReservationConfirm}
            variant="contained"
            size="large"
            sx={{ py: 1.5, minWidth: 120 }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
