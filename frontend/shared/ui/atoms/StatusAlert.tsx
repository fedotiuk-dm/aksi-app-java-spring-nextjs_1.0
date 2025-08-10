import React from 'react';
import { Alert } from '@mui/material';
import type { AlertProps } from '@mui/material/Alert';

type Props = {
  message: string;
  severity?: AlertProps['severity'];
  sx?: AlertProps['sx'];
};

export const StatusAlert: React.FC<Props> = ({
  message,
  severity = 'info',
  sx,
}) => {
  return (
    <Alert severity={severity} sx={sx}>
      {message}
    </Alert>
  );
};