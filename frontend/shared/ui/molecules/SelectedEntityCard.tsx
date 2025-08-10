import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';

type Props = {
  title: string;
  subtitle?: string;
  secondaryText?: string;
  onEdit?: () => void;
  sx?: Record<string, unknown>;
};

export const SelectedEntityCard: React.FC<Props> = ({
  title,
  subtitle,
  secondaryText,
  onEdit,
  sx,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: 1,
        borderColor: 'primary.main',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2">{title}</Typography>
        {onEdit && (
          <IconButton size="small" onClick={onEdit}>
            <Edit fontSize="small" />
          </IconButton>
        )}
      </Box>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      {secondaryText && (
        <Typography variant="body2" color="text.secondary">
          {secondaryText}
        </Typography>
      )}
    </Box>
  );
};