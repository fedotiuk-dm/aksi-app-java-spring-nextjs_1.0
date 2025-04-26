'use client';

import React from 'react';
import { Button, Stack } from '@mui/material';

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
  className
}) => {
  return (
    <Stack direction="row" spacing={2} className={className}>
      {onCancel && (
        <Button 
          variant="text" 
          color="error"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      )}
      
      {onReset && (
        <Button 
          variant="text"
          onClick={onReset}
        >
          {resetLabel}
        </Button>
      )}
      
      <div style={{ flexGrow: 1 }} />
      
      {!hideBackButton && onBack && (
        <Button 
          variant="outlined" 
          onClick={onBack}
          disabled={isBackDisabled}
        >
          {backLabel}
        </Button>
      )}
      
      {!hideNextButton && onNext && (
        <Button 
          variant="contained" 
          onClick={onNext}
          disabled={isNextDisabled}
        >
          {nextLabel}
        </Button>
      )}
    </Stack>
  );
};
