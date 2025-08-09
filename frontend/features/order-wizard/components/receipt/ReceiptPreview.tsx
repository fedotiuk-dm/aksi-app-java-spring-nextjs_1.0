'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Print, Close, Email, Download } from '@mui/icons-material';
import { useGenerateOrderReceipt, useEmailOrderReceipt } from '@/shared/api/generated/receipt';
import { Receipt } from './Receipt';

interface ReceiptPreviewProps {
  open: boolean;
  onCloseAction: () => void;
  orderId?: string;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ open, onCloseAction, orderId }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Get PDF receipt from backend if orderId exists
  const { data: receiptPdf, isLoading: isLoadingPdf } = useGenerateOrderReceipt(
    orderId || '',
    {},
    {
      query: {
        enabled: !!orderId && open,
      },
    }
  );

  // Email receipt mutation
  const emailReceiptMutation = useEmailOrderReceipt();

  // Create object URL for PDF blob
  useEffect(() => {
    if (receiptPdf) {
      const url = URL.createObjectURL(receiptPdf);
      setPdfUrl(url);

      // Cleanup
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [receiptPdf]);

  const handlePrint = () => {
    if (pdfUrl) {
      // Create iframe for printing PDF
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.print();
        // Remove iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    }
  };

  const handleDownload = () => {
    if (pdfUrl && orderId) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `receipt-${orderId}.pdf`;
      link.click();
    }
  };

  const handleEmailReceipt = async () => {
    if (!orderId) return;

    setIsEmailSending(true);
    try {
      // Note: API inconsistency - emailOrderReceipt expects number while generateOrderReceipt expects string
      // Converting string orderId to number for emailOrderReceipt
      const orderIdNumber = parseInt(orderId, 10);
      if (isNaN(orderIdNumber)) {
        console.error('Invalid order ID:', orderId);
        return;
      }

      await emailReceiptMutation.mutateAsync({
        orderId: orderIdNumber.toString(),
        data: {
          // Will use customer's email by default
        },
      });
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCloseAction}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: '90vh',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {orderId ? 'Квитанція замовлення' : 'Попередній перегляд квитанції'}
        <IconButton onClick={onCloseAction}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {isLoadingPdf && orderId && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        )}

        {emailSent && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Квитанція успішно відправлена на email клієнта
          </Alert>
        )}

        {/* Show PDF if available, otherwise show HTML receipt */}
        {pdfUrl && orderId ? (
          <iframe
            src={pdfUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Receipt PDF"
          />
        ) : (
          <Box sx={{ backgroundColor: 'white' }}>
            <Receipt isPreview orderId={orderId} />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onCloseAction}>Закрити</Button>

        {orderId && (
          <>
            <Button
              startIcon={isEmailSending ? <CircularProgress size={16} /> : <Email />}
              onClick={handleEmailReceipt}
              disabled={isEmailSending || !orderId}
            >
              Відправити на Email
            </Button>

            <Button
              startIcon={<Download />}
              onClick={handleDownload}
              disabled={!pdfUrl}
            >
              Завантажити PDF
            </Button>
          </>
        )}

        <Button
          variant="contained"
          startIcon={<Print />}
          onClick={handlePrint}
          disabled={!pdfUrl && !orderId}
        >
          Друкувати
        </Button>
      </DialogActions>
    </Dialog>
  );
};
