'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

// Доменний хук для substep2
import {
  useSubstep2ItemCharacteristics,
  SUBSTEP2_UI_STEPS,
} from '@/domains/wizard/stage2/substep2';

// Компоненти кроків
import {
  MaterialSelectionStep,
  ColorSelectionStep,
  FillerSelectionStep,
  WearLevelSelectionStep,
  CharacteristicsValidationStep,
} from './components';

interface Substep2ContainerProps {
  sessionId: string | null;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

export const Substep2Container: React.FC<Substep2ContainerProps> = ({
  sessionId,
  onNext,
  onPrevious,
  onComplete,
}) => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const substep = useSubstep2ItemCharacteristics();

  // ========== ВСТАНОВЛЕННЯ SESSION ID ==========
  React.useEffect(() => {
    if (sessionId && sessionId !== substep.ui.sessionId) {
      console.log('🔄 Встановлюємо sessionId в substep2:', sessionId);
      substep.ui.initializeWorkflow(sessionId);
    }
  }, [sessionId, substep.ui]);

  // ========== ПОТОЧНИЙ КРОК ==========
  const currentStep = substep.ui.currentStep;

  // ========== КРОКИ SUBSTEP2 ==========
  const steps = [
    { key: SUBSTEP2_UI_STEPS.MATERIAL_SELECTION, label: 'Матеріал' },
    { key: SUBSTEP2_UI_STEPS.COLOR_SELECTION, label: 'Колір' },
    { key: SUBSTEP2_UI_STEPS.FILLER_SELECTION, label: 'Наповнювач' },
    { key: SUBSTEP2_UI_STEPS.WEAR_LEVEL_SELECTION, label: 'Ступінь зносу' },
    { key: SUBSTEP2_UI_STEPS.VALIDATION, label: 'Перевірка' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  // ========== ОБРОБНИКИ ПОДІЙ ==========
  const handleNext = () => {
    if (currentStep === SUBSTEP2_UI_STEPS.VALIDATION) {
      onComplete();
    } else {
      substep.ui.goToNextStep();
    }
  };

  const handlePrevious = () => {
    if (substep.computed.isFirstStep) {
      onPrevious();
    } else {
      substep.ui.goToPreviousStep();
    }
  };

  // ========== ОБРОБНИКИ КРОКІВ ==========
  const handleMaterialSelect = async (materialId: string, materialName: string) => {
    substep.ui.setSelectedMaterial(materialId);
    try {
      if (substep.ui.sessionId) {
        await substep.mutations.selectMaterial.mutateAsync({
          sessionId: substep.ui.sessionId,
          params: { materialId },
        });
      }
      substep.ui.goToNextStep();
    } catch (error) {
      console.error('Помилка вибору матеріалу:', error);
    }
  };

  const handleColorSelect = async (colorId: string, colorName: string) => {
    substep.ui.setSelectedColor(colorId);
    try {
      if (substep.ui.sessionId) {
        await substep.mutations.selectColor.mutateAsync({
          sessionId: substep.ui.sessionId,
          params: { color: colorName },
        });
      }
      substep.ui.goToNextStep();
    } catch (error) {
      console.error('Помилка вибору кольору:', error);
    }
  };

  const handleFillerSelect = async (fillerId: string, fillerName: string) => {
    substep.ui.setSelectedFiller(fillerId);
    try {
      if (substep.ui.sessionId) {
        await substep.mutations.selectFiller.mutateAsync({
          sessionId: substep.ui.sessionId,
          params: { fillerType: fillerName, isFillerDamaged: false },
        });
      }
      substep.ui.goToNextStep();
    } catch (error) {
      console.error('Помилка вибору наповнювача:', error);
    }
  };

  const handleWearLevelSelect = async (wearLevelId: string, wearLevelName: string) => {
    substep.ui.setSelectedWearLevel(wearLevelId);
    try {
      // Припускаємо що wearLevelName містить відсоток як число
      const wearPercentage = parseInt(wearLevelName.replace('%', ''));
      if (substep.ui.sessionId) {
        await substep.mutations.selectWearLevel.mutateAsync({
          sessionId: substep.ui.sessionId,
          params: { wearPercentage },
        });
      }
      substep.ui.goToNextStep();
    } catch (error) {
      console.error('Помилка вибору ступеня зносу:', error);
    }
  };

  const handleValidateAndComplete = async () => {
    try {
      if (substep.ui.sessionId) {
        await substep.mutations.validateCharacteristics.mutateAsync({
          sessionId: substep.ui.sessionId,
        });
        await substep.mutations.complete.mutateAsync({
          sessionId: substep.ui.sessionId,
        });
      }
      onComplete();
    } catch (error) {
      console.error('Помилка завершення підетапу:', error);
    }
  };

  // ========== РЕНДЕР ПОТОЧНОГО КРОКУ ==========
  const renderCurrentStep = () => {
    switch (currentStep) {
      case SUBSTEP2_UI_STEPS.MATERIAL_SELECTION:
        return (
          <MaterialSelectionStep
            materials={[]}
            selectedMaterialId={substep.ui.selectedMaterialId}
            onMaterialSelect={handleMaterialSelect}
            searchTerm={substep.ui.materialSearchTerm}
            onSearchChange={substep.ui.setMaterialSearchTerm}
            loading={substep.loading.isSelectingMaterial}
            showMaterialDetails={substep.ui.showMaterialDetails}
            onToggleMaterialDetails={() =>
              substep.ui.setShowMaterialDetails(!substep.ui.showMaterialDetails)
            }
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      case SUBSTEP2_UI_STEPS.COLOR_SELECTION:
        return (
          <ColorSelectionStep
            colors={[]}
            selectedColorId={substep.ui.selectedColorId}
            onColorSelect={handleColorSelect}
            searchTerm={substep.ui.colorSearchTerm}
            onSearchChange={substep.ui.setColorSearchTerm}
            loading={substep.loading.isSelectingColor}
            showColorDetails={substep.ui.showColorDetails}
            onToggleColorDetails={() =>
              substep.ui.setShowColorDetails(!substep.ui.showColorDetails)
            }
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      case SUBSTEP2_UI_STEPS.FILLER_SELECTION:
        return (
          <FillerSelectionStep
            fillers={[]}
            selectedFillerId={substep.ui.selectedFillerId}
            onFillerSelect={handleFillerSelect}
            searchTerm={substep.ui.fillerSearchTerm}
            onSearchChange={substep.ui.setFillerSearchTerm}
            loading={substep.loading.isSelectingFiller}
            showFillerDetails={substep.ui.showFillerDetails}
            onToggleFillerDetails={() =>
              substep.ui.setShowFillerDetails(!substep.ui.showFillerDetails)
            }
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      case SUBSTEP2_UI_STEPS.WEAR_LEVEL_SELECTION:
        return (
          <WearLevelSelectionStep
            wearLevels={[]}
            selectedWearLevelId={substep.ui.selectedWearLevelId}
            onWearLevelSelect={handleWearLevelSelect}
            loading={substep.loading.isSelectingWearLevel}
            showPriceModifiers={substep.ui.showWearLevelDetails}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );

      case SUBSTEP2_UI_STEPS.VALIDATION:
        return (
          <CharacteristicsValidationStep
            selectedMaterial={null}
            selectedColor={null}
            selectedFiller={null}
            selectedWearLevel={null}
            loading={substep.loading.isValidating || substep.loading.isCompleting}
            onNext={async () => {
              await handleValidateAndComplete();
              handleNext();
            }}
            onPrevious={handlePrevious}
          />
        );

      default:
        return (
          <MaterialSelectionStep
            materials={[]}
            selectedMaterialId={substep.ui.selectedMaterialId}
            onMaterialSelect={handleMaterialSelect}
            searchTerm={substep.ui.materialSearchTerm}
            onSearchChange={substep.ui.setMaterialSearchTerm}
            loading={substep.loading.isSelectingMaterial}
            showMaterialDetails={substep.ui.showMaterialDetails}
            onToggleMaterialDetails={() =>
              substep.ui.setShowMaterialDetails(!substep.ui.showMaterialDetails)
            }
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
    }
  };

  // ========== ЗАВАНТАЖЕННЯ ==========
  if (substep.loading.isInitializing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Завантаження характеристик предмета...
        </Typography>
      </Box>
    );
  }

  // ========== ПОМИЛКА ==========
  if (substep.queries.availableMaterials.error || substep.queries.currentCharacteristics.error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Помилка завантаження:{' '}
        {substep.queries.availableMaterials.error?.message ||
          substep.queries.currentCharacteristics.error?.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Заголовок */}
      <Typography variant="h4" gutterBottom align="center">
        Характеристики предмета
      </Typography>

      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Вкажіть матеріал, колір та інші характеристики предмета
      </Typography>

      {/* Прогрес */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={currentStepIndex} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.key}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Прогрес: {substep.computed.progressPercentage}%
        </Typography>
      </Paper>

      {/* Поточний крок */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        {renderCurrentStep()}
      </Paper>

      {/* Навігація */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handlePrevious}
          disabled={substep.loading.isAnyLoading}
        >
          {substep.computed.isFirstStep ? 'До попереднього підетапу' : 'Назад'}
        </Button>

        <Typography variant="body2" color="text.secondary">
          Крок {currentStepIndex + 1} з {steps.length}
        </Typography>

        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={handleNext}
          disabled={!substep.computed.canComplete || substep.loading.isAnyLoading}
        >
          {currentStep === SUBSTEP2_UI_STEPS.VALIDATION ? 'Завершити підетап' : 'Далі'}
        </Button>
      </Stack>
    </Box>
  );
};
