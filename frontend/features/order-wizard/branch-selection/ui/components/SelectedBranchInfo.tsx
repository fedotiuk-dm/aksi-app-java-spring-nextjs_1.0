'use client';

import { Clear, LocationOn, Phone, CheckCircle } from '@mui/icons-material';
import { Alert, Box, Chip, IconButton, Stack, Typography, Tooltip } from '@mui/material';
import React from 'react';

import { Branch } from '@/domain/branch';

interface SelectedBranchInfoProps {
  branch: Branch;
  onClear: () => void;
}

/**
 * Компонент для відображення інформації про обрану філію
 * Показує детальну інформацію та дозволяє очистити вибір
 */
export const SelectedBranchInfo: React.FC<SelectedBranchInfoProps> = ({ branch, onClear }) => {
  return (
    <Alert
      severity="success"
      icon={<CheckCircle />}
      action={
        <Tooltip title="Очистити вибір">
          <IconButton aria-label="очистити" color="inherit" size="small" onClick={onClear}>
            <Clear fontSize="inherit" />
          </IconButton>
        </Tooltip>
      }
    >
      <Box>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Обрано приймальний пункт
        </Typography>

        <Stack spacing={1}>
          {/* Назва філії */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {branch.name}
            </Typography>
            <Chip
              label={branch.active ? 'Активна' : 'Неактивна'}
              color={branch.active ? 'success' : 'error'}
              size="small"
            />
          </Box>

          {/* Адреса */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {branch.address}
            </Typography>
          </Box>

          {/* Телефон */}
          {branch.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {branch.phone}
              </Typography>
            </Box>
          )}

          {/* Код філії */}
          {branch.code && (
            <Typography variant="caption" color="text.secondary">
              Код: {branch.code}
            </Typography>
          )}
        </Stack>
      </Box>
    </Alert>
  );
};
