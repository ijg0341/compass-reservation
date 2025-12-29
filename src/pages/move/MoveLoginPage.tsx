import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuthStore, type MoveAuthUser } from '../../stores/authStore';
import { moveApi } from '../../lib/api';
import type { CustomerDonghoData, CustomerMoveInfoData } from '../../types';

const agreementSchema = z.object({
  termsOfService: z.boolean().refine((val) => val === true, {
    message: '서비스 이용약관에 동의해주세요.',
  }),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: '개인정보 처리방침에 동의해주세요.',
  }),
  moveRules: z.boolean().refine((val) => val === true, {
    message: '이사 규정에 동의해주세요.',
  }),
});

const loginSchema = z.object({
  dong: z.string().min(1, '동을 선택해주세요.'),
  donghoId: z.number().min(1, '호수를 선택해주세요.'),
  username: z.string().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type AgreementFormData = z.infer<typeof agreementSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

const steps = ['약관동의', '나의집 찾기 & 로그인'];

export default function MoveLoginPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [activeStep, setActiveStep] = useState(0);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // API 데이터
  const [moveInfo, setMoveInfo] = useState<CustomerMoveInfoData | null>(null);
  const [donghos, setDonghos] = useState<CustomerDonghoData[]>([]);
  const [dongsLoading, setDongsLoading] = useState(false);

  const agreementForm = useForm<AgreementFormData>({
    resolver: zodResolver(agreementSchema),
    defaultValues: {
      termsOfService: false,
      privacyPolicy: false,
      moveRules: false,
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      dong: '',
      donghoId: 0,
      username: '',
      password: '',
    },
  });

  const selectedDong = loginForm.watch('dong');

  // 이사예약 정보 및 동호 목록 조회
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!uuid) return;

      try {
        setIsInitializing(true);
        // 이사예약 정보 조회
        const infoResponse = await moveApi.getMoveInfo(uuid);
        if (infoResponse.code === 0 && infoResponse.data) {
          setMoveInfo(infoResponse.data);

          // 동호 목록 조회 (project_id 기반)
          // 주의: 현재 API는 project UUID가 필요하지만, moveInfo에는 project_id만 있음
          // 임시로 uuid를 사용하거나 별도 처리 필요
        }
      } catch (error) {
        console.error('Failed to fetch move info:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchInitialData();
  }, [uuid]);

  // 동호 목록 조회 (약관 동의 후)
  useEffect(() => {
    const fetchDonghos = async () => {
      if (!moveInfo?.project_uuid || activeStep !== 1) return;

      try {
        setDongsLoading(true);
        // 전체 동호 목록 조회 (project_uuid 사용)
        const donghosResponse = await moveApi.getDonghos(moveInfo.project_uuid);
        if (donghosResponse.code === 0 && donghosResponse.data?.list) {
          setDonghos(donghosResponse.data.list);
        }
      } catch (error) {
        console.error('Failed to fetch donghos:', error);
      } finally {
        setDongsLoading(false);
      }
    };

    fetchDonghos();
  }, [moveInfo?.project_uuid, activeStep]);

  // 동 목록 (중복 제거)
  const dongs = useMemo(() => {
    const uniqueDongs = [...new Set(donghos.map((d) => d.dong))];
    return uniqueDongs.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, [donghos]);

  // 선택된 동의 호 목록
  const hoList = useMemo(() => {
    if (!selectedDong) return [];
    return donghos
      .filter((d) => d.dong === selectedDong)
      .sort((a, b) => {
        const numA = parseInt(a.ho.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.ho.replace(/\D/g, '')) || 0;
        return numA - numB;
      });
  }, [donghos, selectedDong]);

  const handleAgreementSubmit = agreementForm.handleSubmit(() => {
    setActiveStep(1);
  });

  const handleLoginSubmit = loginForm.handleSubmit(async (data) => {
    if (!uuid) return;

    setLoginError(null);
    setIsLoading(true);

    try {
      const response = await moveApi.login(uuid, {
        dongho_id: data.donghoId,
        user_id: data.username,
        password: data.password,
      });

      if (response.code === 0 && response.data) {
        const userData: MoveAuthUser = {
          ...response.data,
          moveUuid: uuid,
        };
        login(userData);
        navigate(`/move/${uuid}/calendar`);
      } else {
        setLoginError(response.message || '로그인에 실패했습니다.');
      }
    } catch (error: unknown) {
      console.error('Login failed:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setLoginError(
          axiosError.response?.data?.message ||
            '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
        );
      } else {
        setLoginError('로그인에 실패했습니다. 네트워크 상태를 확인해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  });

  const handleAgreeAll = (checked: boolean) => {
    agreementForm.setValue('termsOfService', checked);
    agreementForm.setValue('privacyPolicy', checked);
    agreementForm.setValue('moveRules', checked);
  };

  const allAgreed =
    agreementForm.watch('termsOfService') &&
    agreementForm.watch('privacyPolicy') &&
    agreementForm.watch('moveRules');

  // 동 변경 시 호 초기화
  const handleDongChange = (dong: string) => {
    loginForm.setValue('dong', dong);
    loginForm.setValue('donghoId', 0);
  };

  if (isInitializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!moveInfo) {
    return (
      <Box>
        <Alert severity="error">
          이사예약 정보를 불러올 수 없습니다. URL을 확인해주세요.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            약관동의
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <FormControlLabel
            control={
              <Checkbox
                checked={allAgreed}
                onChange={(e) => handleAgreeAll(e.target.checked)}
              />
            }
            label={
              <Typography variant="subtitle1" fontWeight="bold">
                전체 동의
              </Typography>
            }
            sx={{ mb: 2 }}
          />

          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Accordion
              elevation={0}
              sx={{
                '&:before': { display: 'none' },
                borderRadius: 0,
                boxShadow: 'none',
                '&:not(:last-child)': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Controller
                  name="termsOfService"
                  control={agreementForm.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label="서비스 이용약관 (필수)"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                />
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  본 서비스 이용약관은 이사예약 서비스 이용에 관한 제반 사항을
                  규정합니다. 이용자는 본 약관에 동의함으로써 서비스를 이용할 수
                  있습니다. 서비스 이용 중 발생하는 모든 책임은 이용자에게
                  있습니다.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              elevation={0}
              sx={{
                '&:before': { display: 'none' },
                borderRadius: 0,
                boxShadow: 'none',
                '&:not(:last-child)': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Controller
                  name="privacyPolicy"
                  control={agreementForm.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label="개인정보 처리방침 (필수)"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                />
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  수집하는 개인정보 항목: 이름, 아파트 정보, 연락처 등. 수집 목적:
                  이사예약 서비스 제공 및 관리. 보유 기간: 서비스 이용 종료 후 1년
                  까지.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              elevation={0}
              sx={{
                '&:before': { display: 'none' },
                borderRadius: 0,
                boxShadow: 'none',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Controller
                  name="moveRules"
                  control={agreementForm.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                      label="이사 규정 (필수)"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                />
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  이사 시간은 예약된 시간대 내에서만 진행되어야 합니다. 소음 발생
                  시 이웃에 대한 배려를 부탁드립니다. 공용 구역 사용 시 관리사무소
                  규정을 준수해주세요.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
          {agreementForm.formState.errors.termsOfService && (
            <Typography color="error" variant="caption" sx={{ ml: 2, display: 'block' }}>
              {agreementForm.formState.errors.termsOfService.message}
            </Typography>
          )}
          {agreementForm.formState.errors.privacyPolicy && (
            <Typography color="error" variant="caption" sx={{ ml: 2, display: 'block' }}>
              {agreementForm.formState.errors.privacyPolicy.message}
            </Typography>
          )}
          {agreementForm.formState.errors.moveRules && (
            <Typography color="error" variant="caption" sx={{ ml: 2, display: 'block' }}>
              {agreementForm.formState.errors.moveRules.message}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleAgreementSubmit}
            sx={{ mt: 3, py: 1.5 }}
          >
            다음
          </Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            나의집 찾기
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {dongsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Controller
                name="dong"
                control={loginForm.control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>동</InputLabel>
                    <Select
                      {...field}
                      label="동"
                      onChange={(e) => handleDongChange(e.target.value)}
                    >
                      {dongs.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography color="error" variant="caption">
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="donghoId"
                control={loginForm.control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} disabled={!selectedDong}>
                    <InputLabel>호</InputLabel>
                    <Select
                      {...field}
                      label="호"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      {hoList.map((h) => (
                        <MenuItem key={h.id} value={h.id}>
                          {h.ho}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography color="error" variant="caption">
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          )}

          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
            로그인
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="username"
              control={loginForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="아이디"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={loginForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="비밀번호"
                  type="password"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            미리 안내된 아이디와 비밀번호를 입력해주세요
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => setActiveStep(0)}
              sx={{ py: 1.5 }}
            >
              이전
            </Button>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleLoginSubmit}
              disabled={isLoading}
              sx={{ py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : '로그인'}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
