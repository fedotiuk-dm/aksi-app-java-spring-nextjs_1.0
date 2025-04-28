import { Box, Typography, Paper } from '@mui/material';
import { useItemDefectsForm } from '@/features/order-wizard/hooks/useItemDefectsForm';
import { StepContainer } from '@/features/order-wizard/ui/components/step-container';
import { StepNavigation } from '@/features/order-wizard/ui/components/step-navigation';
import { 
  StainsSelect,
  DefectsSelect,
  DefectsNotesInput
} from './components';

/**
 * Третій підетап Менеджера предметів - Забруднення, дефекти та ризики
 */
export const DefectsStainsSubstep = () => {
  const {
    control,
    isValid,
    stainsFields,
    defectsFields,
    handleAddStain,
    handleRemoveStain,
    handleAddDefect,
    handleRemoveDefect,
    handleSaveDefects,
    handleBack,
    handleSubmit
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
          gap: 3 
        }}
        onSubmit={handleSubmit(handleSaveDefects)}
      >
        {(
          <>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Плями на предметі
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <StainsSelect 
                  control={control}
                  stains={stainsFields}
                  onAddStain={handleAddStain}
                  onRemoveStain={handleRemoveStain}
                />
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Дефекти та ризики
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DefectsSelect 
                  control={control}
                  defects={defectsFields}
                  onAddDefect={handleAddDefect}
                  onRemoveDefect={handleRemoveDefect}
                />
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Примітки щодо дефектів
              </Typography>
              <DefectsNotesInput 
                control={control}
              />
            </Paper>

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
