import React from 'react';
import { Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';

type Props = {
  title: string;
  variant?: TypographyProps['variant'];
  sx?: TypographyProps['sx'];
};

export const SectionHeader: React.FC<Props> = ({ 
  title, 
  variant = 'h6', 
  sx 
}) => {
  return (
    <Typography variant={variant} sx={sx}>
      {title}
    </Typography>
  );
};