/**
 * 사전방문 행사 정보 페이지 (/visit/:uuid)
 * UUID로 행사 정보를 가져와서 이미지 표시
 */
import { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from '@mui/icons-material';
import { getCustomerPrevisit } from '@/lib/api/previsitApi';
import type { CustomerPrevisitData } from '@/types/api';

export default function PrevisitInfoPage() {
  const navigate = useNavigate();
  const { uuid } = useParams<{ uuid: string }>();

  const [previsit, setPrevisit] = useState<CustomerPrevisitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrevisit() {
      if (!uuid) {
        setError('잘못된 접근입니다.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getCustomerPrevisit(uuid);

        // 날짜 유효성 검사
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(data.date_end);
        endDate.setHours(23, 59, 59, 999);

        if (today > endDate) {
          setError('예약 기간이 종료되었습니다.');
          setIsLoading(false);
          return;
        }

        setPrevisit(data);
      } catch (err) {
        console.error('사전방문 정보 조회 실패:', err);
        setError('사전방문 정보를 찾을 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPrevisit();
  }, [uuid]);

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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            홈으로 돌아가기
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      <Box
        sx={{
          maxWidth: 480,
          mx: 'auto',
          borderLeft: '1px solid #E0E0E0',
          borderRight: '1px solid #E0E0E0',
          minHeight: '100vh',
          bgcolor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 이미지 */}
        {previsit?.image_file_url ? (
          <Box
            component="img"
            src={previsit.image_file_url}
            alt={previsit.name}
            sx={{
              width: '100%',
              display: 'block',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 300,
              bgcolor: '#E0E0E0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'text.secondary',
            }}
          >
            {previsit?.name || '사전방문 안내'}
          </Box>
        )}

        {/* 하단 버튼 */}
        <Box sx={{ px: 3, pb: 3, pt: 3, mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            endIcon={<ChevronRight />}
            onClick={() => navigate(`/visit/${uuid}/app-download`)}
            sx={{
              py: 1.5,
              fontSize: '1rem',
            }}
          >
            방문예약 신청하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
