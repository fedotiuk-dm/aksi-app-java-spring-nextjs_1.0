'use client';

import { Info } from '@mui/icons-material';
import { Alert, Box, Typography } from '@mui/material';
import { FC } from 'react';

interface AutoFieldsInfoProps {
  fields: string[];
  variant?: 'info' | 'success' | 'warning';
}

/**
 * Компонент для відображення інформації про автоматично заповнювані поля
 */
export const AutoFieldsInfo: FC<AutoFieldsInfoProps> = ({ fields, variant = 'info' }) => {
  return (
    <Alert
      severity={variant}
      icon={<Info />}
      sx={{
        borderRadius: 2,
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Автоматично будуть згенеровані:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2 }}>
          {fields.map((field, index) => (
            <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
              {field}
            </Typography>
          ))}
        </Box>
      </Box>
    </Alert>
  );
};
