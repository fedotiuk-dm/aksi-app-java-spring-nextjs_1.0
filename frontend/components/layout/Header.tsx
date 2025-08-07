'use client';

// Зовнішні залежності
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
import React, { useState } from 'react';

// MUI компоненти

// MUI іконки

// Внутрішні залежності
import { useLogout, useAuth, ROLE_DISPLAY_NAMES } from '@/features/auth';
import { useSafeMUIHydration } from '@/shared/lib/hooks';
import { useThemeMode } from '@/lib/theme-provider';

// Константи
const APP_NAME = 'AKSI Хімчистка';
const APP_BAR_BG_COLOR = 'primary.main';

const navigationItems = [
  { name: 'Головна', path: '/', icon: <HomeIcon /> },
  { name: 'Клієнти', path: '/customers', icon: <PeopleIcon /> },
  { name: 'Замовлення', path: '/orders', icon: <ReceiptIcon /> },
  { name: 'Філії', path: '/branches', icon: <StoreIcon /> },
  { name: 'Каталог', path: '/catalog', icon: <CatalogIcon /> },
  { name: 'Створити замовлення', path: '/order-wizard', icon: <LaundryIcon /> },
  { name: 'Прайс-лист', path: '/price-list', icon: <PriceIcon /> },
  { name: 'Налаштування', path: '/settings', icon: <SettingsIcon /> },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLoading } = useLogout();
  const { user } = useAuth();
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
      <AppBar position="static" elevation={0} sx={{ bgcolor: APP_BAR_BG_COLOR }} {...muiProps}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
                    {user.roles?.[0] && ROLE_DISPLAY_NAMES[user.roles[0] as keyof typeof ROLE_DISPLAY_NAMES]}
                  </Typography>
                </Box>
              )}
              <Divider />
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Профіль</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                handleUserMenuClose();
                router.push('/settings');
              }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Налаштування</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                handleUserMenuClose();
                toggleTheme();
              }}>
                <ListItemIcon>
                  {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{mode === 'light' ? 'Темна тема' : 'Світла тема'}</ListItemText>
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
                <ListItemText>{isLoading ? 'Виходимо...' : 'Вийти'}</ListItemText>
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
          <Box sx={{ p: 2, bgcolor: APP_BAR_BG_COLOR, color: 'white' }}>
            <Typography variant="h6">{APP_NAME}</Typography>
            <Typography variant="body2">Панель управління</Typography>
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
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: pathname === item.path ? 'primary.contrastText' : 'inherit',
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
