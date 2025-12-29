import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { moveApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import type { MoveAvailableDateSlot, MoveAvailableTimeSlot } from '../../types';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export default function MoveCalendarPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedEvline, setSelectedEvline] = useState<string | null>(null);
  const [showTimeSlotDialog, setShowTimeSlotDialog] = useState(false);
  const [showEvlineDialog, setShowEvlineDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // API 데이터
  const [availableDates, setAvailableDates] = useState<MoveAvailableDateSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/move/${uuid}`);
    }
  }, [isAuthenticated, navigate, uuid]);

  // 예약 가능 시간대 조회
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!uuid) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await moveApi.getAvailableSlots(uuid);
        if (response.code === 0 && response.data?.dates) {
          setAvailableDates(response.data.dates);
        }
      } catch (err) {
        console.error('Failed to fetch available slots:', err);
        setError('예약 가능 일정을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [uuid]);

  // 날짜별 시간대 맵
  const dateTimeSlotsMap = useMemo(() => {
    const map = new Map<string, MoveAvailableTimeSlot[]>();
    availableDates.forEach((dateSlot) => {
      map.set(dateSlot.date, dateSlot.times);
    });
    return map;
  }, [availableDates]);

  // 선택된 날짜의 시간대 목록
  const selectedDateTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return dateTimeSlotsMap.get(selectedDate) || [];
  }, [selectedDate, dateTimeSlotsMap]);

  // 선택된 시간대의 EV라인 목록
  const selectedTimeEvlines = useMemo(() => {
    if (!selectedTime || !selectedDateTimeSlots.length) return [];
    const timeSlot = selectedDateTimeSlots.find((t) => t.time === selectedTime);
    return timeSlot?.available_lines || [];
  }, [selectedTime, selectedDateTimeSlots]);

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

  const isDateAvailable = (day: number): boolean => {
    const dateStr = currentMonth.date(day).format('YYYY-MM-DD');
    const timeSlots = dateTimeSlotsMap.get(dateStr);
    if (!timeSlots || timeSlots.length === 0) return false;

    // 하나라도 예약 가능한 시간대가 있으면 가능
    return timeSlots.some((slot) => slot.is_available);
  };

  const isPastDate = (day: number): boolean => {
    const date = currentMonth.date(day);
    return date.isBefore(dayjs(), 'day');
  };

  const handleDateClick = (day: number) => {
    if (!isDateAvailable(day) || isPastDate(day)) return;

    const dateStr = currentMonth.date(day).format('YYYY-MM-DD');
    setSelectedDate(dateStr);
    setSelectedTime(null);
    setSelectedEvline(null);
    setShowTimeSlotDialog(true);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleTimeSlotConfirm = () => {
    if (!selectedTime) return;
    setShowTimeSlotDialog(false);

    // EV라인이 하나면 바로 선택, 여러개면 선택 다이얼로그
    if (selectedTimeEvlines.length === 1) {
      setSelectedEvline(selectedTimeEvlines[0]);
      setShowConfirmDialog(true);
    } else if (selectedTimeEvlines.length > 1) {
      setShowEvlineDialog(true);
    }
  };

  const handleEvlineSelect = (evline: string) => {
    setSelectedEvline(evline);
  };

  const handleEvlineConfirm = () => {
    if (!selectedEvline) return;
    setShowEvlineDialog(false);
    setShowConfirmDialog(true);
  };

  const handleReservationConfirm = () => {
    setShowConfirmDialog(false);
    navigate(`/move/${uuid}/confirm`, {
      state: {
        date: selectedDate,
        time: selectedTime,
        evline: selectedEvline,
      },
    });
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
      </Box>
    );
  }

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
          {calendarDays.map((day, index) => {
            const isAvailable = day ? isDateAvailable(day) : false;
            const isPast = day ? isPastDate(day) : false;
            const isUnavailable = !isAvailable || isPast;
            const isSelected =
              day && selectedDate === currentMonth.date(day).format('YYYY-MM-DD');

            return (
              <Grid key={index} size={12 / 7}>
                <Box
                  onClick={() => day && handleDateClick(day)}
                  sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    cursor: day && !isUnavailable ? 'pointer' : 'default',
                    backgroundColor: isSelected
                      ? 'primary.main'
                      : day && isUnavailable
                        ? '#E0E0E0'
                        : '#FFFFFF',
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    '&:hover': {
                      backgroundColor:
                        day && !isUnavailable
                          ? isSelected
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
                        fontWeight={isSelected ? 'bold' : 'medium'}
                        sx={{
                          color: isSelected
                            ? '#FFFFFF'
                            : isUnavailable
                              ? 'text.disabled'
                              : 'text.primary',
                        }}
                      >
                        {day}
                      </Typography>
                      {isUnavailable && !isPast && (
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
            );
          })}
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

      {/* 시간대 선택 다이얼로그 */}
      <Dialog
        open={showTimeSlotDialog}
        onClose={() => setShowTimeSlotDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle component="div">
          <Typography variant="h6" component="span" fontWeight="bold" display="block">
            시간대 선택
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {selectedDate && dayjs(selectedDate).format('YYYY년 M월 D일')}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <RadioGroup
            value={selectedTime || ''}
            onChange={(e) => handleTimeSelect(e.target.value)}
          >
            {selectedDateTimeSlots.map((slot) => {
              const availableCount = slot.available_lines?.length || 0;

              return (
                <FormControlLabel
                  key={slot.time}
                  value={slot.time}
                  disabled={!slot.is_available}
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {slot.time}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {slot.is_available ? `${availableCount}개 라인 가능` : '예약 마감'}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mb: 1.5,
                    py: 1,
                    px: 1.5,
                    border: '1px solid',
                    borderColor: selectedTime === slot.time ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    opacity: slot.is_available ? 1 : 0.5,
                  }}
                />
              );
            })}
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowTimeSlotDialog(false)} size="large" sx={{ py: 1.5 }}>
            취소
          </Button>
          <Button
            onClick={handleTimeSlotConfirm}
            variant="contained"
            disabled={!selectedTime}
            size="large"
            sx={{ py: 1.5, minWidth: 120 }}
          >
            선택
          </Button>
        </DialogActions>
      </Dialog>

      {/* EV라인 선택 다이얼로그 */}
      <Dialog
        open={showEvlineDialog}
        onClose={() => setShowEvlineDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle component="div">
          <Typography variant="h6" component="span" fontWeight="bold" display="block">
            엘리베이터 라인 선택
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {selectedDate && dayjs(selectedDate).format('YYYY년 M월 D일')} {selectedTime}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <RadioGroup
            value={selectedEvline || ''}
            onChange={(e) => handleEvlineSelect(e.target.value)}
          >
            {selectedTimeEvlines.map((evlineName) => (
              <FormControlLabel
                key={evlineName}
                value={evlineName}
                control={<Radio size="small" />}
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {evlineName} 라인
                    </Typography>
                  </Box>
                }
                sx={{
                  mb: 1.5,
                  py: 1,
                  px: 1.5,
                  border: '1px solid',
                  borderColor:
                    selectedEvline === evlineName ? 'primary.main' : 'divider',
                  borderRadius: 2,
                }}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowEvlineDialog(false)} size="large" sx={{ py: 1.5 }}>
            취소
          </Button>
          <Button
            onClick={handleEvlineConfirm}
            variant="contained"
            disabled={!selectedEvline}
            size="large"
            sx={{ py: 1.5, minWidth: 120 }}
          >
            선택
          </Button>
        </DialogActions>
      </Dialog>

      {/* 최종 확인 다이얼로그 */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle component="div">
          <Typography variant="h6" component="span" fontWeight="bold" display="block">
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                예약일
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {selectedDate && dayjs(selectedDate).format('YYYY년 M월 D일')}
              </Typography>
            </Box>
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                시간대
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {selectedTime}
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                엘리베이터 라인
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {selectedEvline} 라인
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowConfirmDialog(false)} size="large" sx={{ py: 1.5 }}>
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
