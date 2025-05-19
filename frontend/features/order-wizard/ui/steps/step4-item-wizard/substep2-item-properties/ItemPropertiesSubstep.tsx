import { Box, Typography, CircularProgress, Paper, Alert } from '@mui/material';
import { useItemPropertiesForm } from '@/features/order-wizard/hooks/useItemPropertiesForm';
import { StepContainer } from '@/features/order-wizard/ui/shared/step-container';
import { StepNavigation } from '@/features/order-wizard/ui/shared/step-navigation';
import {
  MaterialSelect,
  ColorSelect,
  FillerSelect,
  WearDegreeSelect,
  NotesInput,
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
    loading,
    currentItem,
  } = formData;

  // Отримуємо control та isValid зі значення form
  const {
    control,
    formState: { isValid },
  } = form;

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
          gap: 3,
        }}
        // onSubmit перенесено до кнопки в StepNavigation
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              my: 4,
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Завантаження даних...
            </Typography>
          </Box>
        ) : (
          <>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Матеріал та колір
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Вкажіть матеріал та колір предмета. Це важливо для визначення методу обробки.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <MaterialSelect control={control} materials={availableMaterials} />

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
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Наповнювач
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Якщо предмет має наповнювач (пух, синтепон тощо), вкажіть його тип та стан.
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
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Ступінь зносу
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Оцініть ступінь зносу предмета. Це допоможе встановити правильні очікування щодо
                результату.
              </Typography>
              <WearDegreeSelect control={control} onWearDegreeChange={handleWearDegreeChange} />
            </Paper>

            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Додаткові примітки
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                За необхідності, додайте будь-які особливості предмета, які варто враховувати.
              </Typography>
              <NotesInput control={control} />
            </Paper>

            {currentItem && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Ви редагуєте предмет &quot;{currentItem.name}&quot;. Ці характеристики впливатимуть
                на розрахунок ціни на наступному кроці.
              </Alert>
            )}

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
