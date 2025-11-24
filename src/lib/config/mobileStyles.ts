import type { SxProps, Theme } from '@mui/material';

/**
 * 모바일 예약 페이지 공통 스타일 상수
 * 방문예약과 이사예약 페이지에서 통일된 디자인을 위해 사용
 */

/**
 * 모바일 래퍼 (외부 그레이 배경)
 * 전체 페이지의 배경색과 최소 높이를 설정
 */
export const MOBILE_WRAPPER: SxProps<Theme> = {
  bgcolor: '#F5F5F5',
  minHeight: '100vh',
};

/**
 * 모바일 카드 (480px 고정, 양쪽 보더)
 * 중앙 정렬된 카드형 레이아웃으로 모바일 뷰를 구현
 */
export const MOBILE_CARD: SxProps<Theme> = {
  maxWidth: 480,
  mx: 'auto',
  borderLeft: '1px solid #E0E0E0',
  borderRight: '1px solid #E0E0E0',
  minHeight: '100vh',
  bgcolor: '#FFFFFF',
};

/**
 * 모바일 헤더 (텍스트만)
 * 상단 헤더 영역의 패딩과 하단 구분선
 */
export const MOBILE_HEADER: SxProps<Theme> = {
  py: 3,
  borderBottom: '1px solid',
  borderColor: 'divider',
  px: 2,
};

/**
 * 모바일 컨텐츠 영역
 * 메인 컨텐츠 영역의 패딩
 */
export const MOBILE_CONTENT: SxProps<Theme> = {
  px: 2,
  py: 3,
};

/**
 * 정보 박스 (배경색)
 * 정보를 강조하기 위한 회색 배경 박스
 */
export const INFO_BOX: SxProps<Theme> = {
  bgcolor: '#F5F5F5',
  borderRadius: 2,
  p: 3,
};
