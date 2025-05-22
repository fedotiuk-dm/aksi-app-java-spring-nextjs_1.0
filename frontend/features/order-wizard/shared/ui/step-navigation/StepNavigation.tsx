'use client';

import { Button, Stack } from '@mui/material';
import React from 'react';

interface StepNavigationProps {
  onNext?: () => void;
  onBack?: () => void;
  onReset?: () => void;
  onCancel?: () => void;
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
}

/**
 * Компонент навігації для кроків візарда
 * Використовується на кожному кроці для переходу між кроками
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
}) => {
  return (
    <Stack direction="row" spacing={2} className={className}>
      {onCancel && (
        <Button
          variant="text"
          color="error"
          onClick={onCancel}
          size={buttonSize}
        >
          {cancelLabel}
        </Button>
      )}

      {onReset && (
        <Button variant="text" onClick={onReset} size={buttonSize}>
          {resetLabel}
        </Button>
      )}

      <div style={{ flexGrow: 1 }} />

      {!hideBackButton && onBack && (
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={isBackDisabled}
          size={buttonSize}
        >
          {backLabel}
        </Button>
      )}

      {!hideNextButton && onNext && (
        <Button
          variant="contained"
          onClick={onNext}
          disabled={isNextDisabled}
          size={buttonSize}
        >
          {nextLabel}
        </Button>
      )}
    </Stack>
  );
};
