'use client';

import { Receipt } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { FC } from 'react';

import { InfoCard } from '../molecules/InfoCard';
import { InfoField } from '../molecules/InfoField';

interface OrderReceiptInfoProps {
  receiptNumber: string;
  tagNumber?: string;
  compact?: boolean;
}

/**
 * Компонент для відображення основної інформації про квитанцію
 */
export const OrderReceiptInfo: FC<OrderReceiptInfoProps> = ({
  receiptNumber,
  tagNumber,
  compact = false,
}) => {
  return (
    <InfoCard
      title="Інформація про квитанцію"
      icon={<Receipt />}
      status="success"
      compact={compact}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: tagNumber ? 6 : 12 }}>
          <InfoField
            label="Номер квитанції"
            value={receiptNumber}
            important={true}
            vertical={true}
            copyable={true}
          />
        </Grid>

        {tagNumber && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoField
              label="Унікальна мітка"
              value={tagNumber}
              important={true}
              vertical={true}
              copyable={true}
            />
          </Grid>
        )}
      </Grid>
    </InfoCard>
  );
};
