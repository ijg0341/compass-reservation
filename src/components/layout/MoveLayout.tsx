import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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

export default function MoveLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { label: '로그아웃', path: '/' },
    { label: '이사예약하기', path: '/move/calendar' },
    { label: '나의예약', path: '/move/list' },
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
              <Typography variant="body2" color="text.secondary">
                창원동읍 한양 립스 더퍼스트
              </Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <Menu />
            </IconButton>
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
                      navigate(item.path);
                      setDrawerOpen(false);
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
