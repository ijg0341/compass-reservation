import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { ArrowBack, Menu, Close } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: 56 }}>
          <IconButton edge="start" onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <img
              src="/compass-logo.png"
              alt="Compass"
              style={{ height: 28, verticalAlign: 'middle' }}
            />
          </Box>
          <IconButton edge="end" onClick={() => setDrawerOpen(true)}>
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>

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

      <Container maxWidth="sm" sx={{ py: 3, px: 2 }}>
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
      </Container>
    </Box>
  );
}
