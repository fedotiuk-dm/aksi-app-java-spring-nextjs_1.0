import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Alert,
} from '@mui/material';
import { useItemBasicInfoForm } from '@/features/order-wizard/hooks/useItemBasicInfoForm';
import { StepContainer } from '@/features/order-wizard/ui/shared/step-container';
import { StepNavigation } from '@/features/order-wizard/ui/shared/step-navigation';
import { CategorySelect, ItemNameSelect, QuantityInput, UnitOfMeasureSelect } from './components';

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
    selectedItemName,
  } = useItemBasicInfoForm();

  // Перевіряємо, чи є дані для подальшого вибору
  const categorySelected = !!form.watch('categoryId');
  const itemNameSelected = !!form.watch('itemNameId');

  return (
    <StepContainer
      title="Основна інформація про предмет"
      subtitle="Виберіть категорію, найменування виробу та кількість"
    >
      {loading.categories || loading.itemNames || loading.unitsOfMeasure ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            my: 4,
            gap: 2,
          }}
        >
          <CircularProgress color="primary" />
          <Typography variant="body2" color="text.secondary">
            Завантаження даних...
          </Typography>
        </Box>
      ) : (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxWidth: 'md',
            mx: 'auto',
          }}
        >
          <Card variant="outlined" sx={{ backgroundColor: 'background.paper' }}>
            <CardHeader
              title="Категорія та найменування"
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ pb: 1 }}
            />
            <Divider />
            <CardContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                  disabled={!categorySelected}
                  onChange={handleItemNameChange}
                />
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ backgroundColor: 'background.paper' }}>
            <CardHeader title="Кількість" titleTypographyProps={{ variant: 'h6' }} sx={{ pb: 1 }} />
            <Divider />
            <CardContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <QuantityInput control={form.control} errors={form.formState.errors} />

                <UnitOfMeasureSelect
                  unitsOfMeasure={unitsOfMeasure}
                  control={form.control}
                  errors={form.formState.errors}
                  disabled={!itemNameSelected}
                  onChange={handleUnitChange}
                  selectedItemUnitOfMeasure={selectedItemName?.unitOfMeasure}
                />
              </Box>

              {!isItemSupported && itemNameSelected && form.watch('measurementUnit') && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Обрана одиниця виміру не підтримується для цього найменування.
                </Alert>
              )}
            </CardContent>
          </Card>

          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <StepNavigation
              onNext={form.handleSubmit(handleSaveItem)}
              nextLabel="Зберегти та продовжити"
              isNextDisabled={!hasChanges || !isItemSupported}
              hideBackButton
            />
          </Box>
        </Box>
      )}
    </StepContainer>
  );
};
