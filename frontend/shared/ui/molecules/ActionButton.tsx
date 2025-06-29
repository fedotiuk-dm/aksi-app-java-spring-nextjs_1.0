'use client';

import { Button, CircularProgress } from '@mui/material';
import React, { ReactNode } from 'react';

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  loadingText?: string;
}

/**
 * Універсальний компонент кнопки дії
 * Забезпечує консистентний стиль та поведінку для всіх кнопок в проекті
 *
 * FSD принципи:
 * - Універсальний molecule для кнопок дій
 * - Підтримує async операції з автоматичним loading станом
 * - Не містить domain-специфічної логіки
 *
 * Особливості:
 * - Автоматичне відображення loading стану
 * - Підтримка async onClick
 * - Консистентні розміри та кольори
 * - Доступність через disabled стан
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  fullWidth = false,
  className,
  type = 'button',
  loadingText,
}) => {
  const [internalLoading, setInternalLoading] = React.useState(false);

  const handleClick = async () => {
    if (!onClick || loading || internalLoading || disabled) return;

    try {
      setInternalLoading(true);
      await onClick();
    } catch (error) {
      console.error('ActionButton error:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  const isLoading = loading || internalLoading;
  const displayText = isLoading && loadingText ? loadingText : children;
  const displayStartIcon = isLoading ? <CircularProgress size={16} /> : startIcon;

  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || isLoading}
      onClick={handleClick}
      startIcon={displayStartIcon}
      endIcon={!isLoading ? endIcon : undefined}
      fullWidth={fullWidth}
      className={className}
    >
      {displayText}
    </Button>
  );
};
