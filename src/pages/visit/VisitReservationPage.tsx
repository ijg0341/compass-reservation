import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import {
  buildings,
  unitsByBuilding,
  reservationDates,
  getTimeSlotsByDate,
  reservationNotices,
  type TimeSlot,
} from '@/lib/mockData';

const reservationSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다.')
    .max(50, '이름은 최대 50자까지 입력 가능합니다.'),
  phone1: z.string().regex(/^010$/, '010을 입력해주세요.'),
  phone2: z.string().regex(/^\d{4}$/, '4자리 숫자를 입력해주세요.'),
  phone3: z.string().regex(/^\d{4}$/, '4자리 숫자를 입력해주세요.'),
  buildingId: z.string().min(1, '동을 선택해주세요.'),
  unitId: z.string().min(1, '호수를 선택해주세요.'),
  dateId: z.string().min(1, '날짜를 선택해주세요.'),
  timeSlotId: z.string().min(1, '시간대를 선택해주세요.'),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

export default function VisitReservationPage() {
  const navigate = useNavigate();
  const [selectedDateTab, setSelectedDateTab] = useState(0);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [availableUnits, setAvailableUnits] = useState<
    { id: string; name: string }[]
  >([]);

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
      buildingId: '',
      unitId: '',
      dateId: reservationDates[0]?.id || '',
      timeSlotId: '',
    },
  });

  const selectedBuildingId = watch('buildingId');
  const selectedTimeSlotId = watch('timeSlotId');

  useEffect(() => {
    if (selectedBuildingId && unitsByBuilding[selectedBuildingId]) {
      setAvailableUnits(unitsByBuilding[selectedBuildingId]);
      setValue('unitId', '');
    } else {
      setAvailableUnits([]);
    }
  }, [selectedBuildingId, setValue]);

  useEffect(() => {
    const dateId = reservationDates[selectedDateTab]?.id;
    if (dateId) {
      setTimeSlots(getTimeSlotsByDate(dateId));
      setValue('dateId', dateId);
      setValue('timeSlotId', '');
    }
  }, [selectedDateTab, setValue]);

  const handleDateTabChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedDateTab(newValue);
  };

  const onSubmit = async (data: ReservationFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const phoneNumber = `${data.phone1}-${data.phone2}-${data.phone3}`;
    const selectedDate = reservationDates.find((d) => d.id === data.dateId);
    const selectedTime = timeSlots.find((t) => t.id === data.timeSlotId);
    const selectedBuilding = buildings.find((b) => b.id === data.buildingId);
    const selectedUnit = availableUnits.find((u) => u.id === data.unitId);

    // 예약완료 페이지로 이동
    navigate('/visit/complete', {
      state: {
        name: data.name,
        phone: phoneNumber,
        building: selectedBuilding?.name || '',
        unit: selectedUnit?.name || '',
        date: selectedDate?.label || '',
        time: selectedTime?.time || '',
      },
    });
  };

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
              방문예약 신청
            </Typography>
            <Typography variant="body2" color="text.secondary">
              창원동읍 한양 립스 더퍼스트
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
                  name="buildingId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.buildingId}>
                      <InputLabel>동 선택</InputLabel>
                      <Select {...field} label="동 선택">
                        {buildings.map((building) => (
                          <MenuItem key={building.id} value={building.id}>
                            {building.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.buildingId && (
                        <FormHelperText>{errors.buildingId.message}</FormHelperText>
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
                      disabled={!selectedBuildingId}
                    >
                      <InputLabel>호 선택</InputLabel>
                      <Select {...field} label="호 선택">
                        {availableUnits.map((unit) => (
                          <MenuItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </MenuItem>
                        ))}
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

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                  value={selectedDateTab}
                  onChange={handleDateTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                >
                  {reservationDates.map((date) => (
                    <Tab key={date.id} label={date.label} />
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
                              key={slot.id}
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
                                  checked={selectedTimeSlotId === slot.id}
                                  onChange={() => field.onChange(slot.id)}
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
                                  {slot.time}
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
                                  {slot.available}/{slot.total}
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
