import React from 'react';
import { TextField, Grid } from '@mui/material';
import { SelectorField, FormSection } from '@shared/ui/molecules';
import { useCharacteristicsOperations, type CharacteristicsFormProps } from '@features/order-wizard/hooks';

export const CharacteristicsForm: React.FC<CharacteristicsFormProps> = ({ characteristics, onChange }) => {
  const { 
    characteristics: currentCharacteristics,
    colorOptions,
    handleMaterialInputChange,
    handleColorSelectorChange
  } = useCharacteristicsOperations({ 
    characteristics, 
    onChange 
  });

  return (
    <FormSection title="Характеристики предмета">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Матеріал"
            fullWidth
            placeholder="Наприклад: бавовна, шовк, вовна..."
            value={currentCharacteristics.material || ''}
            onChange={handleMaterialInputChange}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <SelectorField
            label="Тип кольору"
            options={colorOptions}
            placeholder="Виберіть тип кольору"
            value={currentCharacteristics.color || ''}
            onChange={handleColorSelectorChange}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};