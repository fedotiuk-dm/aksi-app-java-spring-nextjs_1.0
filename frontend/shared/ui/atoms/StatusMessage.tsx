'use client';

import { Alert } from '@mui/material';
import { AlertProps } from '@mui/material/Alert';
import React from 'react';

interface StatusMessageProps extends Omit<AlertProps, 'children'> {
  message: string;
  show?: boolean;
}

/**
 * Універсальний компонент для відображення статусних повідомлень
 */
export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  show = true,
  severity = 'info',
  sx,
  ...props
}) => {
  if (!show || !message) {
    return null;
  }

  return (
    <Alert severity={severity} sx={{ mt: 2, ...sx }} {...props}>
      {message}
    </Alert>
  );
};
