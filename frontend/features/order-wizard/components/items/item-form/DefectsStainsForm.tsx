import React from 'react';
import { TextField, Grid } from '@mui/material';
import { FormSection } from '@shared/ui/molecules';

export const DefectsStainsForm: React.FC = () => {
  return (
    <FormSection title="Дефекти та плями">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Опис дефектів"
            multiline
            rows={3}
            fullWidth
            placeholder="Опишіть видимі дефекти..."
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Опис плям"
            multiline
            rows={3}
            fullWidth
            placeholder="Опишіть плями та їх розташування..."
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};