import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuthStore } from '../../stores/authStore';
import type { MoveUser } from '../../types/move';

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
  apartment: z.string().min(1, '아파트를 선택해주세요.'),
  dong: z.string().min(1, '동을 선택해주세요.'),
  ho: z.string().min(1, '호수를 선택해주세요.'),
  username: z.string().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type AgreementFormData = z.infer<typeof agreementSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

const apartments = ['래미안 아파트', '자이 아파트', '힐스테이트'];
const dongs = ['101동', '102동', '103동', '104동', '105동'];
const hos = [
  '101호',
  '102호',
  '201호',
  '202호',
  '301호',
  '302호',
  '401호',
  '402호',
];

const steps = ['약관동의', '나의집 찾기 & 로그인'];

export default function MoveLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [activeStep, setActiveStep] = useState(0);
  const [loginError, setLoginError] = useState<string | null>(null);

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
      apartment: '',
      dong: '',
      ho: '',
      username: '',
      password: '',
    },
  });

  const handleAgreementSubmit = agreementForm.handleSubmit(() => {
    setActiveStep(1);
  });

  const handleLoginSubmit = loginForm.handleSubmit((data) => {
    setLoginError(null);

    if (data.username === 'user' && data.password === 'password') {
      const user: MoveUser = {
        id: '1',
        username: data.username,
        apartmentName: data.apartment,
        dong: data.dong,
        ho: data.ho,
        contractorName: '홍길동',
      };

      login(user);
      navigate('/move/calendar');
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
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

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        입주이사 예약
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            약관동의
          </Typography>
          <Divider sx={{ mb: 3 }} />

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

          <Accordion
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider' }}
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
          {agreementForm.formState.errors.termsOfService && (
            <Typography color="error" variant="caption" sx={{ ml: 2 }}>
              {agreementForm.formState.errors.termsOfService.message}
            </Typography>
          )}

          <Accordion
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider' }}
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
          {agreementForm.formState.errors.privacyPolicy && (
            <Typography color="error" variant="caption" sx={{ ml: 2 }}>
              {agreementForm.formState.errors.privacyPolicy.message}
            </Typography>
          )}

          <Accordion
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider' }}
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
          {agreementForm.formState.errors.moveRules && (
            <Typography color="error" variant="caption" sx={{ ml: 2 }}>
              {agreementForm.formState.errors.moveRules.message}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleAgreementSubmit}
            sx={{ mt: 3 }}
          >
            다음
          </Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            나의집 찾기
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="apartment"
              control={loginForm.control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel>아파트</InputLabel>
                  <Select {...field} label="아파트">
                    {apartments.map((apt) => (
                      <MenuItem key={apt} value={apt}>
                        {apt}
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
              name="dong"
              control={loginForm.control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel>동</InputLabel>
                  <Select {...field} label="동">
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
              name="ho"
              control={loginForm.control}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={!!fieldState.error}>
                  <InputLabel>호</InputLabel>
                  <Select {...field} label="호">
                    {hos.map((h) => (
                      <MenuItem key={h} value={h}>
                        {h}
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

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            로그인
          </Typography>
          <Divider sx={{ mb: 3 }} />

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
            테스트 계정: user / password
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => setActiveStep(0)}
            >
              이전
            </Button>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleLoginSubmit}
            >
              로그인
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
