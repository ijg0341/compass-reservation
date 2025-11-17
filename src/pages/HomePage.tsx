import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CalendarMonth, LocalShipping } from '@mui/icons-material';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <img src="/compass-logo.png" alt="Compass" style={{ height: 48, marginBottom: 16 }} />
          <Typography variant="h5" fontWeight={700}>
            예약 서비스
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<CalendarMonth />}
            onClick={() => navigate('/visit')}
            sx={{
              py: 2.5,
              justifyContent: 'flex-start',
              px: 3,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'transparent' },
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                방문예약
              </Typography>
              <Typography variant="body2" color="text.secondary">
                사전 방문 예약 신청
              </Typography>
            </Box>
          </Button>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<LocalShipping />}
            onClick={() => navigate('/move')}
            sx={{
              py: 2.5,
              justifyContent: 'flex-start',
              px: 3,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'transparent' },
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                이사예약
              </Typography>
              <Typography variant="body2" color="text.secondary">
                입주 이사 일정 예약
              </Typography>
            </Box>
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
