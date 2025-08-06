'use client';

import React, { useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Print, Close } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { Receipt } from './Receipt';

interface ReceiptPreviewProps {
  open: boolean;
  onClose: () => void;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ open, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Квитанція',
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Попередній перегляд квитанції
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box ref={printRef} sx={{ backgroundColor: 'white' }}>
          <Receipt isPreview />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={() => handlePrint()}
        >
          Друкувати
        </Button>
      </DialogActions>
    </Dialog>
  );
};