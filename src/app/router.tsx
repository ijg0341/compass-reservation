import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

// 이사예약용 헤더 레이아웃
const MoveLayout = lazy(() => import('../components/layout/MoveLayout'));

// 페이지들
const HomePage = lazy(() => import('../pages/HomePage'));
const VisitInfoPage = lazy(() => import('../pages/visit/VisitInfoPage'));
const AppDownloadPage = lazy(() => import('../pages/visit/AppDownloadPage'));
const VisitReservationPage = lazy(() => import('../pages/visit/VisitReservationPage'));
const VisitCompletePage = lazy(() => import('../pages/visit/VisitCompletePage'));
// 사전방문 (UUID 기반)
const PrevisitInfoPage = lazy(() => import('../pages/visit/PrevisitInfoPage'));
const PrevisitAppDownloadPage = lazy(() => import('../pages/visit/PrevisitAppDownloadPage'));
const PrevisitReservationPage = lazy(() => import('../pages/visit/PrevisitReservationPage'));
const MoveLoginPage = lazy(() => import('../pages/move/MoveLoginPage'));
const MoveCalendarPage = lazy(() => import('../pages/move/MoveCalendarPage'));
const MoveConfirmPage = lazy(() => import('../pages/move/MoveConfirmPage'));
const MoveListPage = lazy(() => import('../pages/move/MoveListPage'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress color="primary" />
  </Box>
);

const router = createBrowserRouter([
  // 홈 (선택 화면)
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    ),
  },
  // 방문예약 (헤더 없음, 독립 페이지)
  {
    path: '/visit',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <VisitInfoPage />
      </Suspense>
    ),
  },
  {
    path: '/visit/app-download',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AppDownloadPage />
      </Suspense>
    ),
  },
  {
    path: '/visit/reservation',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <VisitReservationPage />
      </Suspense>
    ),
  },
  {
    path: '/visit/complete',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <VisitCompletePage />
      </Suspense>
    ),
  },
  // 사전방문 예약 (UUID 기반 URL)
  {
    path: '/visit/:uuid',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PrevisitInfoPage />
      </Suspense>
    ),
  },
  {
    path: '/visit/:uuid/app-download',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PrevisitAppDownloadPage />
      </Suspense>
    ),
  },
  {
    path: '/visit/:uuid/reservation',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PrevisitReservationPage />
      </Suspense>
    ),
  },
  // 이사예약 (UUID 기반 URL, 헤더 있는 레이아웃)
  {
    path: '/move/:uuid',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <MoveLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MoveLoginPage />
          </Suspense>
        ),
      },
      {
        path: 'calendar',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MoveCalendarPage />
          </Suspense>
        ),
      },
      {
        path: 'confirm',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MoveConfirmPage />
          </Suspense>
        ),
      },
      {
        path: 'list',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MoveListPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
