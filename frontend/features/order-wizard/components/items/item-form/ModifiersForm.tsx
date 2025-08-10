import React from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { FormSection } from '@shared/ui/molecules';
import { useModifiersOperations } from '@features/order-wizard/hooks';

export const ModifiersForm: React.FC = () => {
  const { 
    modifiers, 
    handleModifierChange, 
    isLoading 
  } = useModifiersOperations();

  if (isLoading) {
    return <FormSection title="Модифікатори">Завантаження...</FormSection>;
  }

  return (
    <FormSection title="Модифікатори">
      <FormGroup>
        {modifiers.map((modifier) => (
          <FormControlLabel
            key={modifier.code}
            control={
              <Checkbox 
                checked={modifier.isSelected}
                onChange={(e) => handleModifierChange(modifier.code, e.target.checked)}
              />
            }
            label={`${modifier.name} (${modifier.displayValue})`}
          />
        ))}
      </FormGroup>
    </FormSection>
  );
};