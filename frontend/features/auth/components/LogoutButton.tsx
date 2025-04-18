'use client';

import { Button, CircularProgress } from '@mui/material';
import { useLogout } from '../hooks/useLogout';
import LogoutIcon from '@mui/icons-material/Logout';

interface LogoutButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  redirectTo?: string;
}

export const LogoutButton = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  redirectTo = '/login',
}: LogoutButtonProps) => {
  const { logout, isLoading } = useLogout();

  const handleLogout = async () => {
    await logout(redirectTo);
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      onClick={handleLogout}
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : <LogoutIcon />}
    >
      Вийти
    </Button>
  );
};
