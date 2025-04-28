import { Box, Typography, CircularProgress } from '@mui/material';
import { useItemBasicInfoForm } from '@/features/order-wizard/hooks/useItemBasicInfoForm';
import { StepContainer } from '@/features/order-wizard/ui/components/step-container';
import { StepNavigation } from '@/features/order-wizard/ui/components/step-navigation';
import { 
  CategorySelect,
  ItemNameSelect, 
  QuantityInput, 
  UnitOfMeasureSelect 
} from './components';

/**
 * Перший підетап Менеджера предметів - Введення основної інформації
 */
export const BasicInfoSubstep = () => {
  const {
    form,
    categories,
    itemNames,
    unitsOfMeasure,
    isItemSupported,
    loading,
    handleCategoryChange,
    handleItemNameChange,
    handleUnitChange,
    handleSaveItem,
    hasChanges,
  } = useItemBasicInfoForm();

  return (
    <StepContainer
      title="Основна інформація про предмет"
      subtitle="Виберіть категорію, найменування виробу та кількість"
    >
      <Box 
        component="form" 
        noValidate 
        autoComplete="off"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          maxWidth: 'md',
          mx: 'auto'
        }}
      >
        {loading.categories || loading.itemNames || loading.unitsOfMeasure ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <CategorySelect 
              categories={categories}
              control={form.control}
              errors={form.formState.errors}
              onChange={handleCategoryChange}
            />

            <ItemNameSelect 
              itemNames={itemNames}
              control={form.control}
              errors={form.formState.errors}
              disabled={!form.watch('categoryId')}
              onChange={handleItemNameChange}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <QuantityInput 
                control={form.control}
                errors={form.formState.errors}
              />

              <UnitOfMeasureSelect 
                unitsOfMeasure={unitsOfMeasure}
                control={form.control}
                errors={form.formState.errors}
                disabled={!form.watch('itemNameId')}
                onChange={handleUnitChange}
              />
            </Box>

            {!isItemSupported && form.watch('itemNameId') && form.watch('measurementUnit') && (
              <Typography color="error" variant="body2">
                Обрана одиниця виміру не підтримується для цього найменування.
              </Typography>
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <StepNavigation 
                onNext={form.handleSubmit(handleSaveItem)}
                nextLabel="Зберегти та продовжити"
                isNextDisabled={!hasChanges || !isItemSupported}
                hideBackButton
              />
            </Box>
          </>
        )}
      </Box>
    </StepContainer>
  );
};
