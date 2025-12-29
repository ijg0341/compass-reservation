import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { Menu, Close } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  mobileWrapperStyles,
  mobileContainerStyles,
  mobileHeaderStyles,
  mobileContentStyles,
} from '@/styles/mobileStyles';
import { useAuthStore } from '@/stores/authStore';
import { moveApi } from '@/lib/api';

export default function MoveLayout() {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    if (uuid) {
      try {
        await moveApi.logout(uuid);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
    logout();
    navigate('/');
    setDrawerOpen(false);
  };

  const menuItems = [
    { label: '로그아웃', path: '/', action: handleLogout },
    { label: '이사예약하기', path: `/move/${uuid}/calendar` },
    { label: '나의예약', path: `/move/${uuid}/list` },
  ];

  return (
    <Box sx={mobileWrapperStyles}>
      {/* 모바일 래퍼 */}
      <Box sx={mobileContainerStyles}>
        {/* 헤더 */}
        <Box sx={mobileHeaderStyles}>
          <Box sx={{ px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                입주이사 예약
              </Typography>
              {isAuthenticated && user && (
                <Typography variant="body2" color="text.secondary">
                  {user.dong} {user.ho} {user.contractor_name}
                </Typography>
              )}
            </Box>
            {isAuthenticated && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <Menu />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* 드로어 메뉴 */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 280 }}>
            <Box
              sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <img src="/compass-logo.png" alt="Compass" style={{ height: 24 }} />
              <IconButton onClick={() => setDrawerOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            <Divider />
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        navigate(item.path);
                        setDrawerOpen(false);
                      }
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* 콘텐츠 */}
        <Box sx={mobileContentStyles}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
