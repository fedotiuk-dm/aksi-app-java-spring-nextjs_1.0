import React from 'react';
import { Grid, TextField } from '@mui/material';
import { FormSection, SelectorField } from '@shared/ui/molecules';
import { useExecutionParametersOperations } from '@features/order-wizard/hooks';

export const ExecutionParameters: React.FC = () => {
  const {
    urgencyOptions,
    selectedUrgency,
    expectedDate,
    handleUrgencyChange,
    handleDateChange,
    minDate,
    isLoading
  } = useExecutionParametersOperations();

  const handleSelectorChange = async (event: any) => {
    await handleUrgencyChange(event.target.value);
  };

  return (
    <FormSection title="Параметри виконання">
      <Grid container spacing={2}>
        <Grid size={12}>
          <SelectorField
            label="Терміновість"
            options={urgencyOptions}
            value={selectedUrgency}
            onChange={handleSelectorChange}
            placeholder="Виберіть тип терміновості"
            loading={isLoading}
          />
        </Grid>
        
        <Grid size={12}>
          <TextField
            label="Очікувана дата завершення"
            type="date"
            fullWidth
            value={expectedDate}
            onChange={handleDateChange}
            slotProps={{
              htmlInput: { min: minDate },
              inputLabel: { shrink: true }
            }}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};