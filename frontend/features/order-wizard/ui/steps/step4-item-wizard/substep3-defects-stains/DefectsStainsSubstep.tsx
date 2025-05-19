import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useItemDefectsForm } from '@/features/order-wizard/hooks/useItemDefectsForm';
import { StepContainer } from '@/features/order-wizard/ui/shared/step-container';
import { StepNavigation } from '@/features/order-wizard/ui/shared/step-navigation';
import { StainsSelect, DefectsSelect, DefectsNotesInput } from './components';

/**
 * Третій підетап Менеджера предметів - Забруднення, дефекти та ризики
 */
export const DefectsStainsSubstep = () => {
  const {
    control,
    isValid,
    isLoading,
    stainsFields,
    defectsFields,
    handleAddStain,
    handleRemoveStain,
    handleAddDefect,
    handleRemoveDefect,
    handleSaveDefects,
    handleBack,
    handleSubmit,
  } = useItemDefectsForm();

  return (
    <StepContainer
      title="Забруднення, дефекти та ризики"
      subtitle="Вкажіть наявні плями, дефекти та потенційні ризики обробки"
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
        onSubmit={handleSubmit(handleSaveDefects)}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Завантажуємо дані...
            </Typography>
          </Box>
        ) : (
          <>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Плями на предметі
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Додайте всі видимі плями на предметі. Це допоможе краще обрати метод чистки та
                розрахувати вартість обробки.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <StainsSelect
                  control={control}
                  stains={stainsFields}
                  onAddStain={handleAddStain}
                  onRemoveStain={handleRemoveStain}
                  isLoading={isLoading}
                />
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Дефекти та ризики
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Вкажіть наявні дефекти та потенційні ризики, які може мати процес обробки. Це
                важливо для встановлення правильних очікувань.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DefectsSelect
                  control={control}
                  defects={defectsFields}
                  onAddDefect={handleAddDefect}
                  onRemoveDefect={handleRemoveDefect}
                  isLoading={isLoading}
                />
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Примітки щодо дефектів
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Додайте детальний опис розташування та характеру дефектів, щоб краще документувати
                стан предмета.
              </Typography>
              <DefectsNotesInput control={control} />
            </Paper>

            {stainsFields.length > 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Додано {stainsFields.length}{' '}
                {stainsFields.length === 1
                  ? 'плямy'
                  : stainsFields.length > 1 && stainsFields.length < 5
                    ? 'плями'
                    : 'плям'}{' '}
                та {defectsFields.length}{' '}
                {defectsFields.length === 1
                  ? 'дефект'
                  : defectsFields.length > 1 && defectsFields.length < 5
                    ? 'дефекти'
                    : 'дефектів'}
                . Ці дані будуть використані при розрахунку ціни.
              </Alert>
            )}

            <StepNavigation
              onBack={handleBack}
              isNextDisabled={!isValid}
              onNext={handleSubmit(handleSaveDefects)}
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
