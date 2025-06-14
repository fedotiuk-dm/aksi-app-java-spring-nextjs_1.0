'use client';

import { Box, Typography, Alert } from '@mui/material';
import React, { useEffect } from 'react';

// Доменна логіка
import { useStage2Workflow } from '@/domains/wizard/stage2/workflow';
import { STAGE2_SUBSTEPS } from '@/domains/wizard/stage2/workflow/constants';

// Основний компонент управління предметами
import { ItemManagerStep } from './ItemManagerStep';

// Підвізард компоненти
import { Substep1Container } from './substep1/Substep1Container';
import { Substep2Container } from './substep2/Substep2Container';

interface Stage2ContainerProps {
  sessionId: string;
  onStageCompleted: () => void;
  onGoBack: () => void;
}

export const Stage2Container: React.FC<Stage2ContainerProps> = ({
  sessionId,
  onStageCompleted,
  onGoBack,
}) => {
  // ========== ДОМЕННА ЛОГІКА ==========
  const workflow = useStage2Workflow();

  // ========== ІНІЦІАЛІЗАЦІЯ ==========
  const initializeStage2 = React.useCallback(async () => {
    if (sessionId && !workflow.ui.sessionId) {
      console.log('🔄 Ініціалізація Stage2 Workflow з sessionId:', sessionId);
      workflow.ui.setSessionId(sessionId);

      try {
        await workflow.mutations.initializeManager.mutateAsync({ orderId: sessionId });
        console.log('✅ Stage2 ініціалізовано');
        // Встановлюємо початковий стан - показуємо менеджер предметів
        workflow.ui.setShowItemWizard(false);
        workflow.ui.setIsWizardActive(false);
      } catch (error) {
        console.error('❌ Помилка ініціалізації Stage2:', error);
      }
    }
  }, [sessionId, workflow.mutations.initializeManager, workflow.ui]);

  useEffect(() => {
    initializeStage2();
  }, [initializeStage2]);

  // ========== ОБРОБНИКИ НАВІГАЦІЇ ==========
  const handleStartItemWizard = () => {
    console.log('🔄 Запуск підвізарда додавання предмета');
    workflow.ui.setShowItemWizard(true);
    workflow.ui.setIsWizardActive(true);
    workflow.ui.setCurrentSubstep(STAGE2_SUBSTEPS.SUBSTEP1);
  };

  const handleCloseItemWizard = () => {
    console.log('🔄 Закриття підвізарда, повернення до менеджера предметів');
    workflow.ui.setShowItemWizard(false);
    workflow.ui.setIsWizardActive(false);
    // Скидаємо підетап на початковий
    workflow.ui.setCurrentSubstep(STAGE2_SUBSTEPS.SUBSTEP1);
  };

  const handleItemWizardCompleted = () => {
    console.log('✅ Підвізард завершено, предмет додано, повернення до менеджера');
    // Закриваємо підвізард і повертаємося до менеджера предметів
    handleCloseItemWizard();
  };

  const handleSubstepCompleted = async (substep: string) => {
    console.log(`✅ ${substep} завершено`);

    if (workflow.computed.isLastSubstep) {
      // Останній підетап - завершуємо підвізард
      handleItemWizardCompleted();
    } else {
      // Переходимо до наступного підетапу
      workflow.ui.goToNextSubstep();
    }
  };

  const handleGoToPrevious = () => {
    if (workflow.computed.isFirstSubstep) {
      // Якщо це перший підетап - закриваємо підвізард
      handleCloseItemWizard();
    } else {
      workflow.ui.goToPreviousSubstep();
    }
  };

  const handleCompleteStage = async () => {
    try {
      console.log('🔄 Завершення Stage2...');
      await workflow.mutations.completeStage.mutateAsync({ sessionId });
      console.log('✅ Stage2 завершено');
      onStageCompleted();
    } catch (error) {
      console.error('❌ Помилка завершення Stage2:', error);
    }
  };

  // ========== РЕНДЕР КОНТЕНТУ ==========
  const renderContent = () => {
    // Якщо активний підвізард - показуємо підетапи
    if (workflow.ui.showItemWizard && workflow.ui.isWizardActive) {
      const currentSubstep = workflow.ui.currentSubstep;

      switch (currentSubstep) {
        case STAGE2_SUBSTEPS.SUBSTEP1:
          return (
            <Substep1Container
              sessionId={sessionId}
              onNext={() => workflow.ui.goToNextSubstep()}
              onPrevious={handleGoToPrevious}
              onComplete={() => handleSubstepCompleted('substep1')}
            />
          );

        case STAGE2_SUBSTEPS.SUBSTEP2:
          return (
            <Substep2Container
              sessionId={sessionId}
              onNext={() => workflow.ui.goToNextSubstep()}
              onPrevious={() => workflow.ui.goToPreviousSubstep()}
              onComplete={() => handleSubstepCompleted('substep2')}
            />
          );

        case STAGE2_SUBSTEPS.SUBSTEP3:
          return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5">Підетап 3 (В розробці)</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Забруднення та дефекти
              </Typography>
            </Box>
          );

        case STAGE2_SUBSTEPS.SUBSTEP4:
          return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5">Підетап 4 (В розробці)</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Розрахунок ціни
              </Typography>
            </Box>
          );

        case STAGE2_SUBSTEPS.SUBSTEP5:
          return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5">Підетап 5 (В розробці)</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Фото документація
              </Typography>
            </Box>
          );

        default:
          return <Alert severity="error">Невідомий підетап: {currentSubstep}</Alert>;
      }
    }

    // Інакше показуємо основний менеджер предметів
    return (
      <ItemManagerStep
        sessionId={sessionId}
        onCompleteStage={handleCompleteStage}
        onAddItem={handleStartItemWizard}
      />
    );
  };

  // ========== RENDER ==========
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Заголовок */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {workflow.ui.showItemWizard && workflow.ui.isWizardActive
          ? `Етап 2: Додавання предмета - ${workflow.ui.currentSubstep}`
          : 'Етап 2: Управління предметами'}
      </Typography>

      {workflow.ui.showItemWizard && workflow.ui.isWizardActive && (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Підетап {workflow.ui.currentSubstep} • Прогрес:{' '}
          {workflow.computed.substepProgressPercentage}%
        </Typography>
      )}

      {/* Індикатор завантаження */}
      {workflow.loading.isAnyLoading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Завантаження...
        </Alert>
      )}

      {/* Поточний контент */}
      {renderContent()}
    </Box>
  );
};
