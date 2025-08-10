import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { CheckCircle, Print } from '@mui/icons-material';
import { FormSection } from '@shared/ui/molecules';
import { StatusAlert } from '@shared/ui/atoms';
import { useOrderCompletionOperations } from '@features/order-wizard/hooks';

export const OrderCompletion: React.FC = () => {
  const {
    signature,
    handleSignatureChange,
    handleCreateOrder,
    canCreateOrder,
    isCreatingOrder,
    orderCreated,
    orderId,
    error
  } = useOrderCompletionOperations();

  if (orderCreated && orderId) {
    return (
      <FormSection title="Замовлення створено">
        <StatusAlert 
          severity="success"
          message={`Замовлення #${orderId} успішно створено!`}
          sx={{ mb: 2 }}
        />
        
        <Button
          variant="contained"
          fullWidth
          startIcon={<Print />}
          onClick={() => window.print()}
        >
          Друкувати квитанцію
        </Button>
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
      
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Підпис клієнта"
          fullWidth
          multiline
          rows={2}
          value={signature}
          onChange={handleSignatureChange}
          placeholder="Введіть ім'я та прізвище клієнта"
          helperText="Обов'язкове поле для створення замовлення"
        />
      </Box>

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
        {isCreatingOrder ? 'Створення...' : 'Створити замовлення'}
      </Button>
      
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