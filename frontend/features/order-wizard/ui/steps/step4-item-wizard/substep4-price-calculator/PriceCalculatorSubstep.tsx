import { Box, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import { useCallback } from 'react';
import { useItemPricingForm } from '@/features/order-wizard/hooks/useItemPricingForm';
import { StepContainer, StepNavigation } from '@/features/order-wizard/ui/components';
import { ModifierCategoryType } from '@/features/order-wizard/model/schema/item-pricing.schema';
import { 
  BasePriceDisplay,
  ModifiersList,
  PriceBreakdown
} from './components';

/**
 * Четвертий підетап Менеджера предметів - Знижки та надбавки (калькулятор ціни)
 */
export const PriceCalculatorSubstep = () => {
  const {
    control,
    errors,
    isValid,
    isLoading,
    basePrice,
    modifiersByCategory,
    priceCalculation,
    isModifierApplied,
    getModifierSelectedValue,
    handleModifierToggle,
    handleModifierValueChange,
    onSubmit,
    handleBack
  } = useItemPricingForm();
  
  // Адаптер для обробки перемикання модифікаторів
  const handleModifierToggleAdapter = useCallback(
    (modifierId: string, applied: boolean) => {
      // Знаходимо модифікатор за ідентифікатором
      const allModifiers = [
        ...(modifiersByCategory[ModifierCategoryType.GENERAL] || []),
        ...(modifiersByCategory[ModifierCategoryType.TEXTILE] || [])
      ];
      
      const modifier = allModifiers.find(mod => mod.id === modifierId);
      
      if (modifier) {
        handleModifierToggle(modifier, applied);
      }
    },
    [modifiersByCategory, handleModifierToggle]
  );

  return (
    <StepContainer
      title="Знижки та надбавки"
      subtitle="Калькулятор ціни для обраного предмета"
    >
      <Box 
        component="form" 
        noValidate 
        autoComplete="off"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3 
        }}
        onSubmit={onSubmit}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Базова ціна */}
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Базова ціна
              </Typography>
              <BasePriceDisplay basePrice={basePrice} isLoading={isLoading} />
            </Paper>

            {/* Загальні модифікатори */}
            {modifiersByCategory[ModifierCategoryType.GENERAL]?.length > 0 && (
              <ModifiersList
                title="Загальні коефіцієнти"
                description="Доступні для всіх категорій"
                modifiers={modifiersByCategory[ModifierCategoryType.GENERAL]}
                control={control}
                isModifierApplied={isModifierApplied}
                getModifierSelectedValue={getModifierSelectedValue}
                onModifierToggle={handleModifierToggleAdapter}
                onModifierValueChange={handleModifierValueChange}
              />
            )}

            {/* Модифікатори для текстилю */}
            {modifiersByCategory[ModifierCategoryType.TEXTILE]?.length > 0 && (
              <ModifiersList
                title="Модифікатори для текстильних виробів"
                description="Спеціальні коефіцієнти для текстильних категорій"
                modifiers={modifiersByCategory[ModifierCategoryType.TEXTILE]}
                control={control}
                isModifierApplied={isModifierApplied}
                getModifierSelectedValue={getModifierSelectedValue}
                onModifierToggle={handleModifierToggleAdapter}
                onModifierValueChange={handleModifierValueChange}
              />
            )}

            {/* Модифікатори для шкіри */}
            {modifiersByCategory[ModifierCategoryType.LEATHER]?.length > 0 && (
              <ModifiersList
                title="Модифікатори для шкіряних виробів"
                description="Спеціальні коефіцієнти для шкіряних категорій"
                modifiers={modifiersByCategory[ModifierCategoryType.LEATHER]}
                control={control}
                isModifierApplied={isModifierApplied}
                getModifierSelectedValue={getModifierSelectedValue}
                onModifierToggle={handleModifierToggleAdapter}
                onModifierValueChange={handleModifierValueChange}
              />
            )}

            {/* Розрахунок ціни */}
            {priceCalculation && (
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Розрахунок ціни
                </Typography>
                <PriceBreakdown 
                  basePrice={priceCalculation.basePrice}
                  modifiersImpact={priceCalculation.modifiersImpact}
                  totalPrice={priceCalculation.totalPrice}
                />
              </Paper>
            )}

            {errors && Object.keys(errors).length > 0 && (
              <Alert severity="error">
                Виникли помилки при заповненні форми. Будь ласка, перевірте введені дані.
              </Alert>
            )}
            
            {!isValid && (
              <Alert severity="warning">
                Будь ласка, заповніть всі обов&apos;язкові поля
              </Alert>
            )}

            <StepNavigation 
              onBack={handleBack}
              isNextDisabled={!isValid || isLoading}
              nextLabel="Зберегти і продовжити"
            />
          </>
        )}
      </Box>
    </StepContainer>
  );
};
