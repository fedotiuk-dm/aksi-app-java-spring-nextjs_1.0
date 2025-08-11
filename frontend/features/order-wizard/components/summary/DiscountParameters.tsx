import React from 'react';
import { Grid, TextField } from '@mui/material';
import { FormSection, SelectorField } from '@shared/ui/molecules';
import { useDiscountParametersOperations } from '@features/order-wizard/hooks';

export const DiscountParameters: React.FC = () => {
  const {
    discountOptions,
    selectedDiscount,
    customPercentage,
    handleDiscountChange,
    handlePercentageChange,
    handlePercentageBlur,
    showPercentageInput,
    isLoading
  } = useDiscountParametersOperations();

  const handleSelectorChange = async (event: any) => {
    await handleDiscountChange(event.target.value);
  };

  return (
    <FormSection title="Параметри знижки">
      <Grid container spacing={2}>
        <Grid size={12}>
          <SelectorField
            label="Тип знижки"
            options={discountOptions}
            value={selectedDiscount}
            onChange={handleSelectorChange}
            placeholder="Виберіть тип знижки"
            loading={isLoading}
          />
        </Grid>
        
        {showPercentageInput && (
          <Grid size={12}>
            <TextField
              label="Відсоток знижки"
              type="number"
              fullWidth
              value={customPercentage}
              onChange={handlePercentageChange}
              onBlur={handlePercentageBlur}
              slotProps={{ 
                htmlInput: {
                  min: 0, 
                  max: 100,
                  step: 1
                }
              }}
              helperText="Введіть відсоток знижки (0-100%)"
            />
          </Grid>
        )}
      </Grid>
    </FormSection>
  );
};