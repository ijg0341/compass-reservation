// 모바일 레이아웃 공통 스타일 상수

export const MOBILE_MAX_WIDTH = 480;
export const MOBILE_BG_COLOR = '#F5F5F5';
export const MOBILE_BORDER_COLOR = '#E0E0E0';
export const MOBILE_CONTENT_BG = '#FFFFFF';

export const mobileWrapperStyles = {
  bgcolor: MOBILE_BG_COLOR,
  minHeight: '100vh',
};

export const mobileContainerStyles = {
  maxWidth: MOBILE_MAX_WIDTH,
  mx: 'auto',
  borderLeft: `1px solid ${MOBILE_BORDER_COLOR}`,
  borderRight: `1px solid ${MOBILE_BORDER_COLOR}`,
  minHeight: '100vh',
  bgcolor: MOBILE_CONTENT_BG,
};

export const mobileHeaderStyles = {
  py: 3,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

export const mobileContentStyles = {
  px: 2,
  py: 3,
};
