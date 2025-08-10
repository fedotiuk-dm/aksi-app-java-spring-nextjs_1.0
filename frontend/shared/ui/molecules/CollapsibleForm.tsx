import React from 'react';
import { Box, Button, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  toggleButtonText: string;
  toggleIcon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
};

export const CollapsibleForm: React.FC<Props> = ({
  isOpen,
  onToggle,
  toggleButtonText,
  toggleIcon,
  children,
  disabled = false,
}) => {
  return (
    <Box>
      <Button
        startIcon={isOpen ? <ExpandLess /> : <ExpandMore />}
        endIcon={toggleIcon}
        onClick={onToggle}
        variant="outlined"
        fullWidth
        disabled={disabled}
        sx={{ mb: 2 }}
      >
        {toggleButtonText}
      </Button>

      <Collapse in={isOpen}>
        <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};