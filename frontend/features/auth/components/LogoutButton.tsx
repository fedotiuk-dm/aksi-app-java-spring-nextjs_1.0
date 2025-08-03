'use client';

/**
 * @fileoverview Кнопка виходу з системи
 */

import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import type { ButtonProps, IconButtonProps } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '@/features/auth';

interface LogoutButtonProps {
  variant?: 'button' | 'icon';
  showConfirmation?: boolean;
  buttonProps?: ButtonProps;
  iconButtonProps?: IconButtonProps;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'button',
  showConfirmation = true,
  buttonProps,
  iconButtonProps,
}) => {
  const [open, setOpen] = useState(false);
  const { logout, isLoading } = useAuth();

  const handleClick = async () => {
    if (showConfirmation) {
      setOpen(true);
    } else {
      await handleLogout();
    }
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (variant === 'icon') {
    return (
      <>
        <IconButton
          onClick={handleClick}
          color="inherit"
          disabled={isLoading}
          {...iconButtonProps}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <LogoutIcon />
          )}
        </IconButton>

        {showConfirmation && (
          <LogoutConfirmDialog
            open={open}
            onClose={handleClose}
            onConfirm={handleLogout}
            isLoading={isLoading}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={isLoading ? <CircularProgress size={20} /> : <LogoutIcon />}
        disabled={isLoading}
        {...buttonProps}
      >
        {isLoading ? 'Вихід...' : 'Вийти'}
      </Button>

      {showConfirmation && (
        <LogoutConfirmDialog
          open={open}
          onClose={handleClose}
          onConfirm={handleLogout}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

interface LogoutConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle id="logout-dialog-title">
        Вийти з системи?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          Ви впевнені, що хочете вийти з системи? Вам доведеться знову ввести логін та пароль для входу.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Скасувати
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading ? 'Вихід...' : 'Вийти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};