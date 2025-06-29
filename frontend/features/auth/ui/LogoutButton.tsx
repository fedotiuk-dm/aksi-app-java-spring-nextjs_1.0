'use client';

import { Button, CircularProgress } from '@mui/material';
import React from 'react';

import { useLogout } from '../hooks/useLogout';

interface LogoutButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
  redirectTo?: string;
  className?: string;
}

/**
 * Компонент кнопки виходу з системи
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  redirectTo = '/',
  className,
}) => {
  const { logout, isLoading } = useLogout();

  const handleLogout = async () => {
    await logout(redirectTo);
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? <CircularProgress size={24} /> : 'Вийти'}
    </Button>
  );
};
