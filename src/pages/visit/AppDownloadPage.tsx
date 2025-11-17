import { Box, Typography, Button, Container, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Apple, Android } from '@mui/icons-material';

export default function AppDownloadPage() {
  const navigate = useNavigate();

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
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            APP 설치 안내
          </Typography>

          {/* 앱 아이콘 박스 - 컴패스 로고 유지 */}
          <Box
            sx={{
              width: 140,
              height: 140,
              mx: 'auto',
              mb: 3,
              background: 'linear-gradient(135deg, #FF4433 0%, #E63C2E 50%, #C42E20 100%)',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <img
              src="/compass-logo.png"
              alt="Compass"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </Box>

          {/* 플랫폼 아이콘 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, my: 4 }}>
            <Button
              variant="contained"
              onClick={() => {/* iOS 다운로드 로직 */}}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#000000',
                borderRadius: '50px',
                px: 2,
                py: 1,
                '&:hover': {
                  bgcolor: '#333333',
                },
              }}
            >
              <Apple sx={{ fontSize: 24, color: '#FFFFFF' }} />
              <Typography variant="body2" color="#FFFFFF" fontWeight={700}>
                iOS
              </Typography>
            </Button>
            <Button
              variant="contained"
              onClick={() => {/* Android 다운로드 로직 */}}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#000000',
                borderRadius: '50px',
                px: 2,
                py: 1,
                '&:hover': {
                  bgcolor: '#333333',
                },
              }}
            >
              <Android sx={{ fontSize: 24, color: '#FFFFFF' }} />
              <Typography variant="body2" color="#FFFFFF" fontWeight={700}>
                Android
              </Typography>
            </Button>
          </Box>

          {/* 안내 사항 */}
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              아이폰은 입주자라운지에서 별도 설치 안내해드리겠습니다.
            </Typography>

            <Typography variant="body1" textAlign="center">
              로고 클릭시 점검용 APP이 설치되며,
              <br />
              <strong>APP 미설치 시 점검이 불가 합니다.</strong>
            </Typography>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              설치 시 보안 관련 메시지가 나올 경우
              <br />
              [무시하고 설치하기]를 선택하시면 됩니다.
            </Typography>

            <Alert severity="warning">
              설치 후 ID는 행사 당일 계약자 확인 후 부여해 드립니다.
            </Alert>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              ※ APP 설치 및 방문예약 문의
              <br />
              02-6951-2260 (10:00 ~ 16:00 / 토, 일, 공휴일 제외)
            </Typography>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            size="large"
            endIcon={<ChevronRight />}
            onClick={() => navigate('/visit/reservation')}
            sx={{ py: 1.5, fontSize: '1rem' }}
          >
            방문예약 하기
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
