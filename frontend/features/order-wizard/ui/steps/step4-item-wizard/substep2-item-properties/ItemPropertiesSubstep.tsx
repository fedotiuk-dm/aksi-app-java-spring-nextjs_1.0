import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { useItemPropertiesForm } from '@/features/order-wizard/hooks/useItemPropertiesForm';
import { StepContainer } from '@/features/order-wizard/ui/components/step-container';
import { StepNavigation } from '@/features/order-wizard/ui/components/step-navigation';
import { 
  MaterialSelect,
  ColorSelect,
  FillerSelect,
  WearDegreeSelect,
  NotesInput
} from './components';

/**
 * Другий підетап Менеджера предметів - Характеристики предмета
 */
export const ItemPropertiesSubstep = () => {
  // Використовуємо типізацію з as для уникнення помилок TypeScript
  const formData = useItemPropertiesForm();
  
  // Деструктуризація даних та функцій з хука
  const {
    form,
    availableMaterials,
    watchColorType,
    watchHasFiller,
    watchFillerType,
    isFillerApplicable,
    handleColorTypeChange,
    handleCustomColorChange,
    handleFillerToggle,
    handleFillerTypeChange,
    handleCustomFillerChange,
    handleFillerLumpyToggle,
    handleWearDegreeChange,
    handleSaveAndNext,
    handleBack,
    loading
  } = formData;

  // Отримуємо control та isValid зі значення form
  const { control, formState: { isValid } } = form;

  return (
    <StepContainer
      title="Характеристики предмета"
      subtitle="Вкажіть матеріал, колір та інші особливості предмета"
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
        // onSubmit перенесено до кнопки в StepNavigation
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Матеріал та колір
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <MaterialSelect 
                  control={control} 
                  materials={availableMaterials} 
                />
                
                <ColorSelect 
                  control={control}
                  selectedColorType={watchColorType}
                  onColorTypeChange={handleColorTypeChange}
                  onCustomColorChange={handleCustomColorChange}
                />
                <ColorSelect 
                  control={control}
                  selectedColorType={watchColorType}
                  onColorTypeChange={handleColorTypeChange}
                  onCustomColorChange={handleCustomColorChange}
                />
              </Box>
            </Paper>

            {isFillerApplicable && (
              <Paper elevation={0} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Наповнювач
                </Typography>
                <FillerSelect 
                  control={control}
                  hasFiller={watchHasFiller}
                  selectedFillerType={watchFillerType}
                  onFillerToggle={handleFillerToggle}
                  onFillerTypeChange={handleFillerTypeChange}
                  onCustomFillerChange={handleCustomFillerChange}
                  onFillerLumpyToggle={handleFillerLumpyToggle}
                />
              </Paper>
            )}

            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ступінь зносу
              </Typography>
              <WearDegreeSelect 
                control={control}
                onWearDegreeChange={handleWearDegreeChange}
              />
            </Paper>

            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Додаткові примітки
              </Typography>
              <NotesInput control={control} />
            </Paper>

            <StepNavigation 
              onBack={handleBack}
              onNext={handleSaveAndNext}
              isNextDisabled={!isValid}
              nextLabel="Зберегти і продовжити"
            />
            {!isValid && (
              <Typography variant="caption" color="error">
                Будь ласка, заповніть всі обов&apos;язкові поля
              </Typography>
            )}
          </>
        )}
      </Box>
    </StepContainer>
  );
};
