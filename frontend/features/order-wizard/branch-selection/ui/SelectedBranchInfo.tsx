'use client';

import { LocationOn, Phone } from '@mui/icons-material';
import React from 'react';

import { Branch } from '@/domain/branch';
import { EntityInfoAlert } from '@/shared/ui';

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
    <EntityInfoAlert
      title={branch.name}
      subtitle="Обрано приймальний пункт"
      severity="success"
      items={infoItems}
      tags={tags}
      onClear={onClear}
    />
  );
};
