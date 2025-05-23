'use client';

import { ArrowBack, ArrowForward, Refresh, Close } from '@mui/icons-material';
import { Stack } from '@mui/material';
import React from 'react';

import { ActionButton } from '../action-buttons';

interface StepNavigationProps {
  onNext?: () => void | Promise<void>;
  onBack?: () => void | Promise<void>;
  onReset?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  nextLabel?: string;
  backLabel?: string;
  resetLabel?: string;
  cancelLabel?: string;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  hideBackButton?: boolean;
  hideNextButton?: boolean;
  className?: string;
  buttonSize?: 'small' | 'medium' | 'large';
  nextLoading?: boolean;
  backLoading?: boolean;
  resetLoading?: boolean;
  cancelLoading?: boolean;
  nextLoadingText?: string;
  backLoadingText?: string;
  showIcons?: boolean;
  additionalActions?: React.ReactNode;
}

/**
 * Універсальний компонент навігації для кроків візарда
 * Використовується на кожному кроці для переходу між кроками
 *
 * Особливості:
 * - Підтримка async операцій з loading станами
 * - Іконки для кращої UX
 * - Консистентний стиль з іншими shared компонентами
 */
export const StepNavigation: React.FC<StepNavigationProps> = ({
  onNext,
  onBack,
  onReset,
  onCancel,
  nextLabel = 'Далі',
  backLabel = 'Назад',
  resetLabel = 'Почати спочатку',
  cancelLabel = 'Скасувати',
  isNextDisabled = false,
  isBackDisabled = false,
  hideBackButton = false,
  hideNextButton = false,
  className,
  buttonSize = 'medium',
  nextLoading = false,
  backLoading = false,
  resetLoading = false,
  cancelLoading = false,
  nextLoadingText = 'Обробка...',
  backLoadingText = 'Повернення...',
  showIcons = true,
  additionalActions,
}) => {
  return (
    <Stack direction="row" spacing={2} className={className}>
      {onCancel && (
        <ActionButton
          variant="text"
          color="error"
          onClick={onCancel}
          size={buttonSize}
          loading={cancelLoading}
          startIcon={showIcons ? <Close /> : undefined}
        >
          {cancelLabel}
        </ActionButton>
      )}

      {onReset && (
        <ActionButton
          variant="text"
          onClick={onReset}
          size={buttonSize}
          loading={resetLoading}
          startIcon={showIcons ? <Refresh /> : undefined}
        >
          {resetLabel}
        </ActionButton>
      )}

      <div style={{ flexGrow: 1 }} />

      {additionalActions}

      {!hideBackButton && onBack && (
        <ActionButton
          variant="outlined"
          onClick={onBack}
          disabled={isBackDisabled}
          size={buttonSize}
          loading={backLoading}
          loadingText={backLoadingText}
          startIcon={showIcons ? <ArrowBack /> : undefined}
        >
          {backLabel}
        </ActionButton>
      )}

      {!hideNextButton && onNext && (
        <ActionButton
          variant="contained"
          onClick={onNext}
          disabled={isNextDisabled}
          size={buttonSize}
          loading={nextLoading}
          loadingText={nextLoadingText}
          endIcon={showIcons ? <ArrowForward /> : undefined}
        >
          {nextLabel}
        </ActionButton>
      )}
    </Stack>
  );
};
