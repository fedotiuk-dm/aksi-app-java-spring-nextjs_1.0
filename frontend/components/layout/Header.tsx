'use client';

/**
 * @fileoverview Main application header with navigation and user menu
 */

import { useState } from 'react';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  LocalLaundryService as LaundryIcon,
  AttachMoney as PriceIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Inventory as CatalogIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Store as StoreIcon,
  VideogameAsset as GameIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthLogoutOperations, useAuthOperations, ROLE_DISPLAY_NAMES } from '@/features/auth';
import { useSafeMUIHydration } from '@/shared/lib/hooks';
import { useThemeMode } from '@/lib/theme-provider';
const APP_NAME = 'AKSI Dry Cleaning';
const APP_BAR_BG_COLOR = 'primary.main';
const PRIMARY_CONTRAST_TEXT = 'primary.contrastText';

const navigationItems = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Customers', path: '/customers', icon: <PeopleIcon /> },
  { name: 'Orders', path: '/orders', icon: <ReceiptIcon /> },
  { name: 'Branches', path: '/branches', icon: <StoreIcon /> },
  { name: 'Catalog', path: '/catalog', icon: <CatalogIcon /> },
  { name: 'Create Order', path: '/order-wizard', icon: <LaundryIcon /> },
  { name: 'Game Boosting Calculator', path: '/game-boosting-calculator', icon: <GameIcon /> },
  { name: 'Admin Panel', path: '/game-boosting-admin', icon: <SettingsIcon /> },
  { name: 'Price List', path: '/price-list', icon: <PriceIcon /> },
  { name: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoading } = useAuthLogoutOperations();
  const { user } = useAuthOperations();
  const { muiProps } = useSafeMUIHydration();
  const { mode, toggleTheme } = useThemeMode();

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        sx={{
          bgcolor: APP_BAR_BG_COLOR,
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        {...muiProps}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            {APP_NAME}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleUserMenuOpen}
              size="small"
              aria-controls="user-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.firstName ? user.firstName[0].toUpperCase() : <PersonIcon />}
              </Avatar>
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              disableScrollLock={true}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    width: 200,
                  },
                  ...muiProps,
                },
              }}
            >
              {user && (
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{user.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.roles?.[0] &&
                      ROLE_DISPLAY_NAMES[user.roles[0] as keyof typeof ROLE_DISPLAY_NAMES]}
                  </Typography>
                </Box>
              )}
              <Divider />
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleUserMenuClose();
                  router.push('/settings');
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleUserMenuClose();
                  toggleTheme();
                }}
              >
                <ListItemIcon>
                  {mode === 'light' ? (
                    <DarkModeIcon fontSize="small" />
                  ) : (
                    <LightModeIcon fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText>{mode === 'light' ? 'Dark Theme' : 'Light Theme'}</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleUserMenuClose();
                  void logout();
                }}
                disabled={isLoading}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{isLoading ? 'Logging out...' : 'Logout'}</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        disableScrollLock={true}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <Box
            sx={{
              p: 3,
              bgcolor: APP_BAR_BG_COLOR,
              color: 'white',
              background: `linear-gradient(135deg, ${APP_BAR_BG_COLOR} 0%, rgba(0,0,0,0.1) 100%)`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {APP_NAME}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
              Navigation
            </Typography>
          </Box>
          <Divider />
          <List>
            {navigationItems.map((item) => (
              <Link
                href={item.path}
                key={item.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItemButton
                  selected={pathname === item.path}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: PRIMARY_CONTRAST_TEXT,
                      '& .MuiListItemIcon-root': {
                        color: PRIMARY_CONTRAST_TEXT,
                      },
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: pathname === item.path ? PRIMARY_CONTRAST_TEXT : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
