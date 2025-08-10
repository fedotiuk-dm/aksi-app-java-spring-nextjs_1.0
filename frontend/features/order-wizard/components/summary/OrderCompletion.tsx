import React from 'react';
import { Box, Button, Typography, Checkbox, FormControlLabel, Paper } from '@mui/material';
import { CheckCircle, Print, Clear, Save, Visibility } from '@mui/icons-material';
import { FormSection } from '@shared/ui/molecules';
import { StatusAlert } from '@shared/ui/atoms';
import { useOrderCompletionOperations, useSignatureCanvas, useReceiptPreview } from '@features/order-wizard/hooks';

export const OrderCompletion: React.FC = () => {
  const {
    agreementAccepted,
    handleAgreementChange,
    handleCreateOrder,
    canCreateOrder,
    isCreatingOrder,
    downloadReceipt,
    receiptData,
    isLoadingReceipt,
    orderCreated,
    orderId,
    error
  } = useOrderCompletionOperations();
  
  const {
    canvasRef,
    isDrawing,
    hasDrawnContent,
    hasSignature,
    startDrawing,
    draw,
    stopDrawing,
    startDrawingTouch,
    drawTouch,
    stopDrawingTouch,
    clearSignature,
    saveSignature
  } = useSignatureCanvas();
  
  const {
    handleReceiptPreview,
    canPreview,
    isGeneratingPreview
  } = useReceiptPreview();

  if (orderCreated && orderId) {
    return (
      <FormSection title="Замовлення створено">
        <StatusAlert 
          severity="success"
          message={`Замовлення #${orderId} успішно створено!`}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Visibility />}
            onClick={handleReceiptPreview}
            disabled={isLoadingReceipt}
          >
            {isLoadingReceipt ? 'Завантаження...' : 'Переглянути квитанцію'}
          </Button>
          
          {receiptData && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<Print />}
              onClick={downloadReceipt}
            >
              Завантажити та друкувати
            </Button>
          )}
        </Box>
      </FormSection>
    );
  }

  return (
    <FormSection title="Завершення замовлення">
      {error && (
        <StatusAlert 
          severity="error"
          message="Помилка створення замовлення"
          sx={{ mb: 2 }}
        />
      )}
      
      {/* Agreement checkbox */}
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={agreementAccepted}
              onChange={(e) => handleAgreementChange(e.target.checked)}
            />
          }
          label="Я погоджуюсь з умовами надання послуг"
        />
      </Box>

      {/* Digital signature canvas */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Цифровий підпис клієнта
        </Typography>
        
        <Paper 
          elevation={1} 
          sx={{ 
            p: 1, 
            border: '1px solid', 
            borderColor: isDrawing ? 'primary.main' : 'divider',
            borderRadius: 1,
            transition: 'border-color 0.2s ease'
          }}
        >
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            style={{
              width: '100%',
              height: '150px',
              cursor: 'crosshair',
              border: '1px dashed #ccc',
              borderRadius: '4px'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawingTouch}
            onTouchMove={drawTouch}
            onTouchEnd={stopDrawingTouch}
          />
          
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
              size="small"
              startIcon={<Clear />}
              onClick={clearSignature}
            >
              Очистити
            </Button>
            
            <Button
              size="small"
              startIcon={<Save />}
              onClick={saveSignature}
              disabled={!hasDrawnContent}
            >
              Зберегти підпис
            </Button>
          </Box>
          
          {hasSignature && (
            <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
              ✓ Підпис збережено
            </Typography>
          )}
        </Paper>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
        {/* Preview button */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Visibility />}
          onClick={handleReceiptPreview}
          disabled={!canPreview || isGeneratingPreview}
        >
          {isGeneratingPreview ? 'Генерація...' : 'Попередній перегляд квитанції'}
        </Button>
        
        
        {/* Create order button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<CheckCircle />}
          onClick={handleCreateOrder}
          disabled={!canCreateOrder || isCreatingOrder}
          sx={{ 
            py: 1.5,
            fontWeight: 'bold'
          }}
        >
          {isCreatingOrder ? 'СТВОРЕННЯ...' : 'СТВОРИТИ ЗАМОВЛЕННЯ'}
        </Button>
      </Box>
      
      {!canCreateOrder && (
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ mt: 1, display: 'block', textAlign: 'center' }}
        >
          Заповніть всі обов'язкові поля
        </Typography>
      )}
    </FormSection>
  );
};