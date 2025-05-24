'use client';

import { LocationOn } from '@mui/icons-material';
import { FC } from 'react';

import { InfoCard } from '../molecules/InfoCard';
import { InfoField } from '../molecules/InfoField';

interface BranchLocation {
  id?: string;
  name: string;
  address?: string;
  phone?: string;
  code?: string;
}

interface OrderLocationInfoProps {
  branchLocation: BranchLocation;
  compact?: boolean;
}

/**
 * Компонент для відображення інформації про місце прийому замовлення
 */
export const OrderLocationInfo: FC<OrderLocationInfoProps> = ({
  branchLocation,
  compact = false,
}) => {
  return (
    <InfoCard title="Пункт прийому" icon={<LocationOn />} status="info" compact={compact}>
      <InfoField label="Назва філії" value={branchLocation.name} important={true} vertical={true} />

      {branchLocation.address && (
        <InfoField label="Адреса" value={branchLocation.address} vertical={true} />
      )}

      {branchLocation.phone && (
        <InfoField label="Телефон" value={branchLocation.phone} vertical={true} copyable={true} />
      )}
    </InfoCard>
  );
};
