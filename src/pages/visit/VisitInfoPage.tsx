import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from '@mui/icons-material';

export default function VisitInfoPage() {
  const navigate = useNavigate();

  // HTML 에디터에서 삽입될 콘텐츠 (어드민에서 관리)
  const [htmlContent] = useState<string>(`
<div>
  <h3>장소</h3>
  <p>1층 입주자라운지</p>
  <p style="color: #757575; font-size: 14px;">경상남도 창원시 의창구 동읍 용잠리 374번지 일원</p>

  <hr />

  <h3>필요 서류</h3>
  <h4 style="color: #E63C2E;">계약자 방문시</h4>
  <ul>
    <li>본인 신분증</li>
    <li>공급(분양)계약서(원본)</li>
  </ul>

  <h4 style="color: #757575;">대리인 방문시</h4>
  <ul>
    <li>계약자 신분증</li>
    <li>공급(분양)계약서(원본)</li>
    <li>위임장</li>
    <li>가족관계증명서류</li>
  </ul>

  <hr />

  <h3>문의</h3>
  <p>02-6951-2230</p>
  <p style="color: #757575; font-size: 14px;">10:00 ~ 16:00 / 토, 일, 공휴일 제외</p>
</div>
  `);

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      {/* 모바일 래퍼 - 중앙 정렬 및 양쪽 테두리 */}
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
        {/* Hero 섹션 - 삼각형 하단 (편지지 모양) */}
        <Box
          sx={{
            height: 360,
            backgroundImage: 'url(/apartment-building.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            color: 'white',
            px: 3,
            pt: 6,
            textAlign: 'center',
            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
          }}
        >
          {/* 오버레이 그라디언트 */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%)',
            }}
          />

          {/* 아파트 로고 (컴패스 로고 대신) */}
          <img
            src="/apartment-logo.svg"
            alt="Apartment Logo"
            style={{ height: 60, marginBottom: 16, position: 'relative', zIndex: 1 }}
          />

          <Typography variant="h5" fontWeight={700} sx={{ position: 'relative', zIndex: 1, mb: 1 }}>
            창원동읍 한양 립스 더퍼스트
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontStyle: 'italic',
              position: 'relative',
              zIndex: 1,
              opacity: 0.95,
              fontWeight: 400,
            }}
          >
            입주자 여러분을 초대합니다
          </Typography>

          <Box
            sx={{
              mt: 3,
              px: 3,
              py: 1.5,
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: 2,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              2024년 11월 01일(금) ~ 03일(일)
            </Typography>
            <Typography variant="body2">10:00 ~ 16:00</Typography>
          </Box>
        </Box>

        {/* HTML 에디터 콘텐츠 영역 */}
        <Box
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          sx={{
            p: 3,
            textAlign: 'center',
            '& h3': {
              fontSize: '1.1rem',
              fontWeight: 600,
              mb: 1,
              mt: 0,
              fontFamily: 'inherit',
            },
            '& h4': {
              fontSize: '0.9rem',
              fontWeight: 600,
              mb: 1,
              mt: 2,
            },
            '& p': {
              m: 0,
              mb: 0.5,
              fontFamily: 'inherit',
            },
            '& ul': {
              m: 0,
              pl: 0,
              mb: 1,
              listStyle: 'none',
            },
            '& li': {
              mb: 0.5,
            },
            '& hr': {
              border: 'none',
              borderTop: '1px solid #E0E0E0',
              my: 2,
            },
          }}
        />

        {/* CTA 버튼 */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            endIcon={<ChevronRight />}
            onClick={() => navigate('/visit/app-download')}
            sx={{
              py: 1.5,
              fontSize: '1rem',
            }}
          >
            다음 단계로
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
