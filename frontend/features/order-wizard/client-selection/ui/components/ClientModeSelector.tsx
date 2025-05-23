'use client';

import { PersonAdd, Search } from '@mui/icons-material';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';

import { ClientMode } from '@/domain/client';

interface ClientModeSelectorProps {
  currentMode: ClientMode;
  onSwitchToCreate: () => void;
  onSwitchToSearch: () => void;
  hasSelectedClient: boolean;
  className?: string;
  buttonSize?: 'small' | 'medium' | 'large';
  createLabel?: string;
  searchLabel?: string;
  createDescription?: string;
  searchDescription?: string;
}

/**
 * Компонент для вибору режиму роботи з клієнтами
 *
 * FSD принципи:
 * - Тільки UI логіка
 * - Отримує дані через props
 * - Викликає callbacks для дій
 * - Уніфікований стиль згідно зі shared компонентами
 */
export const ClientModeSelector: React.FC<ClientModeSelectorProps> = ({
  currentMode,
  onSwitchToCreate,
  onSwitchToSearch,
  hasSelectedClient,
  className,
  buttonSize = 'medium',
  createLabel = 'Створити нового клієнта',
  searchLabel = 'Знайти існуючого',
  createDescription = 'Додати нового клієнта до бази даних',
  searchDescription = 'Пошук клієнта в базі даних',
}) => {
  if (hasSelectedClient) {
    return null; // Приховуємо селектор коли клієнт вже вибраний
  }

  return (
    <Grid container spacing={2} sx={{ mb: 3 }} className={className}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card
          variant={currentMode === ClientMode.CREATE ? 'outlined' : 'elevation'}
          sx={{
            cursor: 'pointer',
            backgroundColor:
              currentMode === ClientMode.CREATE ? 'action.selected' : 'background.paper',
            '&:hover': { backgroundColor: 'action.hover' },
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={onSwitchToCreate}
        >
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {createLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {createDescription}
            </Typography>
            <Button
              variant={currentMode === ClientMode.CREATE ? 'contained' : 'outlined'}
              startIcon={<PersonAdd />}
              size={buttonSize}
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToCreate();
              }}
            >
              Створити
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Card
          variant={currentMode === ClientMode.SELECT ? 'outlined' : 'elevation'}
          sx={{
            cursor: 'pointer',
            backgroundColor:
              currentMode === ClientMode.SELECT ? 'action.selected' : 'background.paper',
            '&:hover': { backgroundColor: 'action.hover' },
            transition: 'all 0.2s ease-in-out',
          }}
          onClick={onSwitchToSearch}
        >
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Search sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {searchLabel}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {searchDescription}
            </Typography>
            <Button
              variant={currentMode === ClientMode.SELECT ? 'contained' : 'outlined'}
              startIcon={<Search />}
              size={buttonSize}
              onClick={(e) => {
                e.stopPropagation();
                onSwitchToSearch();
              }}
            >
              Пошук
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
