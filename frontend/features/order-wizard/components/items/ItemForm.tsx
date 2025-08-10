import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { CollapsibleForm } from '@shared/ui/molecules';
import { ServiceCategorySelector } from './item-form/ServiceCategorySelector';
import { ItemNameSelector } from './item-form/ItemNameSelector';
import { CharacteristicsForm } from './item-form/CharacteristicsForm';
import { DefectsStainsForm } from './item-form/DefectsStainsForm';
import { ModifiersForm } from './item-form/ModifiersForm';
import { PhotoUpload } from './item-form/PhotoUpload';
import { useItemFormModalOperations } from '@features/order-wizard/hooks';
import { StatusAlert } from '@shared/ui/atoms';

export const ItemForm: React.FC = () => {
  const {
    isOpen,
    isEditing,
    handleToggle,
    handleSubmit,
    handleCancel,
    isLoading,
    canSubmit,
    error
  } = useItemFormModalOperations();

  return (
    <CollapsibleForm
      isOpen={isOpen}
      onToggle={handleToggle}
      toggleButtonText={isEditing ? "Редагувати предмет" : "Новий предмет"}
      disabled={false}
    >
      {error && (
        <StatusAlert 
          severity="error" 
          message="Помилка при збереженні предмета"
          sx={{ mb: 2 }}
        />
      )}
      
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ServiceCategorySelector />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ItemNameSelector />
        </Grid>
        
        <Grid size={12}>
          <CharacteristicsForm />
        </Grid>
        
        <Grid size={12}>
          <DefectsStainsForm />
        </Grid>
        
        <Grid size={12}>
          <ModifiersForm />
        </Grid>
        
        <Grid size={12}>
          <PhotoUpload />
        </Grid>
        
        <Grid size={12}>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Add />}
              onClick={handleSubmit}
              disabled={!canSubmit || isLoading}
            >
              {isEditing ? 'Зберегти зміни' : 'Додати предмет'}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleToggle}
              disabled={isLoading}
            >
              Скасувати
            </Button>
          </Box>
        </Grid>
      </Grid>
    </CollapsibleForm>
  );
};