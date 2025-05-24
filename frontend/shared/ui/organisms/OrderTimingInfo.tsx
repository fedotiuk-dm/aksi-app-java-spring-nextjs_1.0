'use client';

import { AccessTime } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { FC } from 'react';

import { InfoCard } from '../molecules/InfoCard';
import { InfoField } from '../molecules/InfoField';

interface OrderTimingInfoProps {
  createdDate?: Date | string;
  expectedCompletionDate?: Date | string;
  compact?: boolean;
}

/**
 * Компонент для відображення інформації про дати та терміни
 */
export const OrderTimingInfo: FC<OrderTimingInfoProps> = ({
  createdDate,
  expectedCompletionDate,
  compact = false,
}) => {
  const formatDate = (date?: Date | string): string => {
    if (!date) return 'Не вказано';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleString('uk-UA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Невірний формат дати';
    }
  };

  const formatDateShort = (date?: Date | string): string => {
    if (!date) return 'Не вказано';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('uk-UA');
    } catch {
      return 'Невірний формат дати';
    }
  };

  return (
    <InfoCard title="Терміни виконання" icon={<AccessTime />} status="info" compact={compact}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <InfoField
            label="Дата створення"
            value={createdDate ? formatDate(createdDate) : 'Тільки що створено'}
            vertical={true}
          />
        </Grid>

        {expectedCompletionDate && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoField
              label="Очікувана дата готовності"
              value={formatDateShort(expectedCompletionDate)}
              important={true}
              vertical={true}
            />
          </Grid>
        )}
      </Grid>
    </InfoCard>
  );
};
