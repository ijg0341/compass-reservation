import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Box,
} from '@mui/material';
import { ArrowBack, Menu as MenuIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleBack = () => {
    navigate(-1);
  };

  const handleMenu = () => {
    console.log('Menu clicked');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
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
          {!isHome ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
          ) : (
            <Box sx={{ width: 44 }} />
          )}
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <img
              src="/compass-logo.png"
              alt="Compass"
              style={{ height: 32, verticalAlign: 'middle' }}
            />
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          py: 3,
          px: 2,
        }}
      >
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
