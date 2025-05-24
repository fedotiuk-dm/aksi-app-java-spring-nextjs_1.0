'use client';

import { LocationOn, Phone, Close, CheckCircle } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import React from 'react';

import { Branch } from '@/domain/branch';

interface SelectedBranchInfoProps {
  branch: Branch;
  onClear: () => void;
}

export const SelectedBranchInfo: React.FC<SelectedBranchInfoProps> = ({ branch, onClear }) => {
  const infoItems = [
    {
      icon: <LocationOn fontSize="small" color="action" />,
      value: branch.address,
      important: true,
    },
    ...(branch.phone
      ? [
          {
            icon: <Phone fontSize="small" color="action" />,
            value: branch.phone,
          },
        ]
      : []),
    ...(branch.code
      ? [
          {
            label: 'Код',
            value: branch.code,
          },
        ]
      : []),
  ];

  const tags = [
    {
      label: branch.active ? 'Активна' : 'Неактивна',
      color: branch.active ? ('success' as const) : ('error' as const),
    },
  ];

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: '#F0F8FF', // Light baby blue
        borderColor: '#87CEEB', // Sky blue border
        borderWidth: 2,
        boxShadow: '0 2px 8px rgba(135, 206, 235, 0.15)',
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <CheckCircle sx={{ color: '#1976d2', fontSize: 24 }} />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: '#1565c0',
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                {branch.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#424242',
                  fontWeight: 500,
                }}
              >
                Обрано приймальний пункт
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Очистити вибір">
            <IconButton
              size="small"
              onClick={onClear}
              sx={{
                color: '#666',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  color: '#1976d2',
                },
              }}
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Інформаційні поля */}
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {infoItems.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {item.icon && (
                <Box sx={{ color: '#1976d2', fontSize: 20, display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </Box>
              )}
              <Box>
                {item.label && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      lineHeight: 1,
                      color: '#666',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {item.label}:
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: item.important ? 600 : 500,
                    color: item.important ? '#1565c0' : '#424242',
                    fontSize: item.important ? '0.9rem' : '0.875rem',
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Теги */}
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag.label}
                color={tag.color || 'primary'}
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor:
                    tag.color === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                  borderColor: tag.color === 'success' ? '#4caf50' : '#1976d2',
                  color: tag.color === 'success' ? '#2e7d32' : '#1565c0',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
