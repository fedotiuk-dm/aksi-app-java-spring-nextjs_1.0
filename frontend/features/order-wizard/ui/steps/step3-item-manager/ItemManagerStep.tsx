'use client';

import React from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import { StepContainer } from '@/features/order-wizard/ui/components/step-container';
import { WizardStep, ItemWizardSubStep } from '@/features/order-wizard/model/types';
import { ItemsTable, TotalAmount } from './components';

/**
 * Компонент для 2.0 кроку майстра замовлень - "Менеджер предметів"
 */
export const ItemManagerStep: React.FC = () => {
  // Використовуємо селектори для отримання даних про предмети
  const items = useOrderWizardStore((state) => state.items);
  const totalAmount = useOrderWizardStore((state) => state.totalAmount);
  const navigateToStep = useOrderWizardStore((state) => state.navigateToStep);
  const removeItem = useOrderWizardStore((state) => state.removeItem);
  const setCurrentItemIndex = useOrderWizardStore((state) => state.setCurrentItemIndex);

  // Обробники подій
  const handleAddItem = () => {
    // Додаємо логи для відлагодження
    console.log('handleAddItem clicked');
    console.log('Navigating to ITEM_WIZARD with substep BASIC_INFO');
    
    // Перехід до підвізарда для додавання предмета з першим підетапом
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.BASIC_INFO);
    
    // Перевіряємо стан після navigateToStep
    setTimeout(() => {
      console.log('Current state after navigation:', 
        useOrderWizardStore.getState().currentStep, 
        useOrderWizardStore.getState().currentSubStep
      );
    }, 0);
  };

  const handleEditItem = (id: number) => {
    // Встановлюємо поточний предмет та переходимо до підвізарда з першим підетапом
    setCurrentItemIndex(id);
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.BASIC_INFO);
  };

  const handleDeleteItem = (id: number) => {
    // Видаляємо предмет
    removeItem(id);
  };

  const handleContinue = () => {
    // Перехід до наступного етапу
    navigateToStep(WizardStep.ORDER_PARAMS);
  };

  return (
    <StepContainer title="2.0 Менеджер предметів">
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Додані предмети замовлення
        </Typography>
        
        <ItemsTable 
          items={items} 
          onEdit={handleEditItem} 
          onDelete={handleDeleteItem} 
        />
        
        <Grid container spacing={2}>
          <Grid size={6}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddItem}
              fullWidth
            >
              Додати предмет
            </Button>
          </Grid>
          <Grid size={6}>
            <TotalAmount amount={totalAmount} />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleContinue}
            disabled={items.length === 0}
          >
            Продовжити до наступного етапу
          </Button>
        </Box>
      </Box>
    </StepContainer>
  );
};
