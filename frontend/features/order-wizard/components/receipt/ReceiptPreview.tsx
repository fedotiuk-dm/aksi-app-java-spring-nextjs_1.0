import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Close, PictureAsPdf } from '@mui/icons-material';
import { useGenerateOrderReceipt } from '@api/receipt';

interface ReceiptPreviewProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  open,
  onClose,
  orderId
}) => {
  const receiptQuery = useGenerateOrderReceipt(orderId, undefined, {
    query: {
      enabled: open && !!orderId
    }
  });

  const handleBlobAction = (action: 'preview' | 'download') => {
    if (!receiptQuery.data) return;
    
    const url = URL.createObjectURL(receiptQuery.data);
    
    if (action === 'preview') {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Квитанція #{orderId}
        <Button
          onClick={onClose}
          startIcon={<Close />}
          size="small"
        >
          Закрити
        </Button>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          {receiptQuery.error && (
            <Typography color="error" sx={{ mb: 2 }}>
              Помилка завантаження квитанції
            </Typography>
          )}
          
          {receiptQuery.isLoading && (
            <Box sx={{ mb: 2 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Завантаження квитанції...
              </Typography>
            </Box>
          )}
          
          {receiptQuery.data && (
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PictureAsPdf />}
                onClick={() => handleBlobAction('preview')}
              >
                Відкрити превю
              </Button>
              
              <Button
                variant="contained"
                size="large"
                onClick={() => handleBlobAction('download')}
              >
                Завантажити PDF
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
};