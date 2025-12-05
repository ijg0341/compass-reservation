/**
 * 사전방문 예약 페이지 (/visit/:id/:hash)
 * URL의 ID와 hash를 검증하여 접근을 제어
 * 모든 API는 previsit_id 기준으로 동작
 */
import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  FormHelperText,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import {
  getPrevisit,
  getPrevisitAvailableSlots,
  getPrevisitDongs,
  getPrevisitDonghos,
  createPrevisitReservation,
} from '@/lib/api/previsitApi';
import { validatePrevisitHash } from '@/lib/utils/hash';
import type {
  PrevisitData,
  PrevisitAvailableDate,
  PrevisitAvailableTimeSlot,
  PrevisitDonghoData,
} from '@/types/api';

// 예약 안내 문구
const reservationNotices = [
  '예약 중복은 불가능합니다.',
  '1세대당 1회만 예약 가능합니다.',
  '예약 후 변경 및 취소는 고객센터로 문의해 주세요.',
];

const reservationSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다.')
    .max(50, '이름은 최대 50자까지 입력 가능합니다.'),
  phone1: z.string().regex(/^010$/, '010을 입력해주세요.'),
  phone2: z.string().regex(/^\d{4}$/, '4자리 숫자를 입력해주세요.'),
  phone3: z.string().regex(/^\d{4}$/, '4자리 숫자를 입력해주세요.'),
  building: z.string().min(1, '동을 선택해주세요.'),
  unitId: z.string().min(1, '호수를 선택해주세요.'),
  dateId: z.string().min(1, '날짜를 선택해주세요.'),
  timeSlotId: z.string().min(1, '시간대를 선택해주세요.'),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

export default function PrevisitReservationPage() {
  const navigate = useNavigate();
  const { id, hash } = useParams<{ id: string; hash: string }>();

  // 사전방문 정보 상태
  const [previsit, setPrevisit] = useState<PrevisitData | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // API 데이터 상태
  const [availableDates, setAvailableDates] = useState<PrevisitAvailableDate[]>([]);
  const [maxLimit, setMaxLimit] = useState<number>(0);
  const [buildings, setBuildings] = useState<string[]>([]); // 동 목록 (문자열 배열)
  const [units, setUnits] = useState<PrevisitDonghoData[]>([]); // 호 목록
  const [timeSlots, setTimeSlots] = useState<PrevisitAvailableTimeSlot[]>([]);

  // UI 상태
  const [selectedDateTab, setSelectedDateTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnitsLoading, setIsUnitsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: '',
      phone1: '010',
      phone2: '',
      phone3: '',
      building: '',
      unitId: '',
      dateId: '',
      timeSlotId: '',
    },
  });

  const selectedBuilding = watch('building');
  const selectedTimeSlotId = watch('timeSlotId');

  // URL 파라미터 검증 및 사전방문 정보 로드
  useEffect(() => {
    async function validateAndLoad() {
      if (!id || !hash) {
        setValidationError('잘못된 접근입니다.');
        setIsValidating(false);
        return;
      }

      const previsitId = parseInt(id, 10);
      if (isNaN(previsitId)) {
        setValidationError('잘못된 접근입니다.');
        setIsValidating(false);
        return;
      }

      try {
        // 1. 사전방문 정보 조회
        const previsitData = await getPrevisit(previsitId);

        // 2. 해시 검증
        const isValid = validatePrevisitHash(previsitId, previsitData.name, hash);
        if (!isValid) {
          setValidationError('잘못된 접근입니다. URL을 확인해주세요.');
          setIsValidating(false);
          return;
        }

        // 3. 날짜 유효성 검사
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(previsitData.date_end);
        endDate.setHours(23, 59, 59, 999);

        if (today > endDate) {
          setValidationError('예약 기간이 종료되었습니다.');
          setIsValidating(false);
          return;
        }

        setPrevisit(previsitData);
        setIsValidating(false);
      } catch (err) {
        console.error('사전방문 정보 조회 실패:', err);
        setValidationError('사전방문 정보를 찾을 수 없습니다.');
        setIsValidating(false);
      }
    }

    validateAndLoad();
  }, [id, hash]);

  // 사전방문 정보 로드 후 예약 가능 일정 조회 (previsit_id 기준)
  useEffect(() => {
    async function fetchInitialData() {
      if (!previsit) return;

      setIsLoading(true);
      setError(null);

      try {
        // 1. 예약 가능 일정 조회 (previsit_id 사용)
        const slotsData = await getPrevisitAvailableSlots(previsit.id);

        // 2. 동 목록 조회 (previsit_id 사용)
        const dongsData = await getPrevisitDongs(previsit.id);

        setAvailableDates(slotsData.dates);
        setMaxLimit(slotsData.max_limit);
        setBuildings(dongsData);

        // 첫 번째 날짜의 시간 슬롯 설정
        if (slotsData.dates.length > 0) {
          setTimeSlots(slotsData.dates[0].times);
          setValue('dateId', slotsData.dates[0].date);
        }
      } catch (err) {
        console.error('초기 데이터 로드 실패:', err);
        setError('데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, [previsit, setValue]);

  // 동 선택 시 호 목록 조회 (previsit_id + dong 기준)
  useEffect(() => {
    async function fetchUnits() {
      if (!selectedBuilding || !previsit) {
        setUnits([]);
        return;
      }

      setIsUnitsLoading(true);
      try {
        const unitsData = await getPrevisitDonghos(previsit.id, selectedBuilding);
        setUnits(unitsData);
        setValue('unitId', '');
      } catch (err) {
        console.error('호 목록 조회 실패:', err);
        setUnits([]);
      } finally {
        setIsUnitsLoading(false);
      }
    }

    fetchUnits();
  }, [selectedBuilding, previsit, setValue]);

  // 날짜 탭 변경 시 시간 슬롯 업데이트
  const handleDateTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setSelectedDateTab(newValue);

      if (availableDates[newValue]) {
        setTimeSlots(availableDates[newValue].times);
        setValue('dateId', availableDates[newValue].date);
        setValue('timeSlotId', '');
      }
    },
    [availableDates, setValue]
  );

  // 날짜 포맷팅 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = dayNames[date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  const onSubmit = async (data: ReservationFormData) => {
    if (!previsit) {
      setError('사전방문 정보를 찾을 수 없습니다.');
      return;
    }

    const phoneNumber = `${data.phone1}-${data.phone2}-${data.phone3}`;
    const selectedDate = availableDates.find((d) => d.date === data.dateId);
    const selectedTime = timeSlots.find((t) => t.time === data.timeSlotId);
    const selectedUnit = units.find((u) => String(u.id) === data.unitId);

    try {
      // 사전방문 예약 API 호출 (previsit_id 사용)
      await createPrevisitReservation({
        previsit_id: previsit.id,
        dongho_id: Number(data.unitId),
        reservation_date: data.dateId,
        reservation_time: data.timeSlotId,
        writer_name: data.name,
        writer_phone: phoneNumber,
      });

      // 예약완료 페이지로 이동
      navigate('/visit/complete', {
        state: {
          name: data.name,
          phone: phoneNumber,
          building: data.building,
          unit: selectedUnit?.ho || '',
          date: selectedDate ? formatDate(selectedDate.date) : '',
          time: selectedTime?.time?.substring(0, 5) || data.timeSlotId,
          previsitName: previsit.name,
        },
      });
    } catch (err) {
      console.error('예약 등록 실패:', err);
      setError('예약에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 검증 중 상태
  if (isValidating) {
    return (
      <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
        <Box
          sx={{
            maxWidth: 480,
            mx: 'auto',
            minHeight: '100vh',
            bgcolor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // 검증 실패 상태
  if (validationError) {
    return (
      <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
        <Box
          sx={{
            maxWidth: 480,
            mx: 'auto',
            minHeight: '100vh',
            bgcolor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            {validationError}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            홈으로 돌아가기
          </Button>
        </Box>
      </Box>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
        <Box
          sx={{
            maxWidth: 480,
            mx: 'auto',
            minHeight: '100vh',
            bgcolor: '#FFFFFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
        <Box
          sx={{
            maxWidth: 480,
            mx: 'auto',
            minHeight: '100vh',
            bgcolor: '#FFFFFF',
            p: 3,
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Box>
      </Box>
    );
  }

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
        {/* 헤더 - 사전방문 행사명 표시 */}
        <Box sx={{ py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ px: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              방문예약 신청
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {previsit?.name || '사전방문'}
            </Typography>
          </Box>
        </Box>

        {/* 폼 컨텐츠 */}
        <Box sx={{ px: 2, py: 3 }}>
          <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 4 }}>
            <Typography variant="body2" fontWeight="bold">
              {reservationNotices.map((notice, index) => (
                <Box key={index} component="span" display="block">
                  {notice}
                </Box>
              ))}
            </Typography>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                신청자 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="신청자 이름"
                    placeholder="홍길동"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                연락처
              </Typography>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Controller
                  name="phone1"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      placeholder="010"
                      error={!!errors.phone1}
                      inputProps={{ maxLength: 3 }}
                      sx={{ width: '80px' }}
                    />
                  )}
                />
                <Typography variant="h6" sx={{ lineHeight: '40px' }}>
                  -
                </Typography>
                <Controller
                  name="phone2"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      placeholder="0000"
                      error={!!errors.phone2}
                      inputProps={{ maxLength: 4 }}
                      sx={{ width: '100px' }}
                    />
                  )}
                />
                <Typography variant="h6" sx={{ lineHeight: '40px' }}>
                  -
                </Typography>
                <Controller
                  name="phone3"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      placeholder="0000"
                      error={!!errors.phone3}
                      inputProps={{ maxLength: 4 }}
                      sx={{ width: '100px' }}
                    />
                  )}
                />
              </Stack>
              {(errors.phone1 || errors.phone2 || errors.phone3) && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {errors.phone1?.message ||
                    errors.phone2?.message ||
                    errors.phone3?.message}
                </FormHelperText>
              )}
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                세대 정보
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" spacing={2}>
                <Controller
                  name="building"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.building}>
                      <InputLabel>동 선택</InputLabel>
                      <Select {...field} label="동 선택">
                        {buildings.map((dong) => (
                          <MenuItem key={dong} value={dong}>
                            {dong}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.building && (
                        <FormHelperText>{errors.building.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                <Controller
                  name="unitId"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      error={!!errors.unitId}
                      disabled={!selectedBuilding || isUnitsLoading}
                    >
                      <InputLabel>호 선택</InputLabel>
                      <Select {...field} label="호 선택">
                        {isUnitsLoading ? (
                          <MenuItem disabled>로딩 중...</MenuItem>
                        ) : (
                          units.map((unit) => (
                            <MenuItem key={unit.id} value={String(unit.id)}>
                              {unit.ho}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {errors.unitId && (
                        <FormHelperText>{errors.unitId.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Stack>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                예약 일시
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {availableDates.length > 0 ? (
                <>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs
                      value={selectedDateTab}
                      onChange={handleDateTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                    >
                      {availableDates.map((date) => (
                        <Tab key={date.date} label={formatDate(date.date)} />
                      ))}
                    </Tabs>
                  </Box>

                  <Controller
                    name="timeSlotId"
                    control={control}
                    render={({ field }) => (
                      <>
                        <TableContainer
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                          }}
                        >
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell align="center" width="60px">
                                  선택
                                </TableCell>
                                <TableCell align="center">시간</TableCell>
                                <TableCell align="center">예약 현황</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {timeSlots.map((slot) => (
                                <TableRow
                                  key={slot.time}
                                  sx={{
                                    backgroundColor:
                                      slot.available === 0
                                        ? 'action.disabledBackground'
                                        : 'inherit',
                                    '&:hover': {
                                      backgroundColor:
                                        slot.available > 0
                                          ? 'action.hover'
                                          : 'action.disabledBackground',
                                    },
                                  }}
                                >
                                  <TableCell align="center">
                                    <Radio
                                      checked={selectedTimeSlotId === slot.time}
                                      onChange={() => field.onChange(slot.time)}
                                      disabled={slot.available === 0}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                      color={
                                        slot.available === 0
                                          ? 'text.disabled'
                                          : 'text.primary'
                                      }
                                    >
                                      {slot.time.substring(0, 5)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      variant="body2"
                                      color={
                                        slot.available === 0
                                          ? 'error'
                                          : slot.available <= 3
                                            ? 'warning.main'
                                            : 'success.main'
                                      }
                                      fontWeight="bold"
                                    >
                                      {slot.available}/{maxLimit}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {errors.timeSlotId && (
                          <FormHelperText error sx={{ mt: 1 }}>
                            {errors.timeSlotId.message}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                </>
              ) : (
                <Alert severity="info">예약 가능한 일정이 없습니다.</Alert>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? '예약 중...' : '예약하기'}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
