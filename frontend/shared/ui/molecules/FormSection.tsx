import React from 'react';
import { Box, FormLabel } from '@mui/material';

type Props = {
  title: string;
  children: React.ReactNode;
};

export const FormSection: React.FC<Props> = ({ title, children }) => {
  return (
    <Box>
      <FormLabel component="legend" sx={{ mb: 2, display: 'block' }}>
        {title}
      </FormLabel>
      {children}
    </Box>
  );
};