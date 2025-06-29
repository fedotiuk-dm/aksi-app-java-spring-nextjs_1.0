'use client';

import { Box, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

interface InfoFieldProps {
  label: string;
  value: ReactNode;
  important?: boolean;
  vertical?: boolean;
  copyable?: boolean;
}

// Винесена функція для копіювання
const copyToClipboard = async (value: ReactNode) => {
  if (typeof value === 'string') {
    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      console.warn('Failed to copy to clipboard:', error);
    }
  }
};

// Винесена функція для стилів
const getTextStyles = (important: boolean, copyable: boolean) => ({
  fontWeight: important ? 600 : 400,
  cursor: copyable ? 'pointer' : 'default',
  '&:hover': copyable ? { bgcolor: 'action.hover', borderRadius: 1, px: 1 } : {},
});

const getLabelStyles = (important: boolean) => ({
  fontWeight: important ? 600 : 500,
  minWidth: 'fit-content',
});

// Вертикальний layout компонент
const VerticalLayout: FC<InfoFieldProps> = ({
  label,
  value,
  important = false,
  copyable = false,
}) => (
  <Box>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ ...getLabelStyles(important), mb: 0.5 }}
    >
      {label}
    </Typography>
    <Typography
      variant="body1"
      sx={getTextStyles(important, copyable)}
      onClick={copyable ? () => copyToClipboard(value) : undefined}
      title={copyable ? 'Натисніть для копіювання' : undefined}
    >
      {value}
    </Typography>
  </Box>
);

// Горизонтальний layout компонент
const HorizontalLayout: FC<InfoFieldProps> = ({
  label,
  value,
  important = false,
  copyable = false,
}) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
    <Typography variant="body2" color="text.secondary" sx={getLabelStyles(important)}>
      {label}:
    </Typography>
    <Typography
      variant="body1"
      sx={{ ...getTextStyles(important, copyable), textAlign: 'right', wordBreak: 'break-word' }}
      onClick={copyable ? () => copyToClipboard(value) : undefined}
      title={copyable ? 'Натисніть для копіювання' : undefined}
    >
      {value}
    </Typography>
  </Box>
);

/**
 * Компонент для відображення поля з інформацією
 * label: value
 */
export const InfoField: FC<InfoFieldProps> = (props) => {
  return props.vertical ? <VerticalLayout {...props} /> : <HorizontalLayout {...props} />;
};
