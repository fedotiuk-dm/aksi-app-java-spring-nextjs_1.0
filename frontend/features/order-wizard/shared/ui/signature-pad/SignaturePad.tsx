'use client';

import { Clear, Done } from '@mui/icons-material';
import { Box, Paper, Typography, Stack } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';

import { ActionButton } from '../action-buttons';

interface SignaturePadProps {
  onSignatureChange?: (signatureData: string | null) => void;
  className?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  buttonSize?: 'small' | 'medium' | 'large';
  showSaveButton?: boolean;
  saveLabel?: string;
  clearLabel?: string;
  disabled?: boolean;
}

/**
 * Універсальний компонент для збору цифрового підпису
 * Використовується на етапі 4.2 для юридичного підтвердження
 *
 * Особливості:
 * - Підтримка миші та сенсорного введення
 * - Настройка кольорів та розмірів
 * - Експорт у base64 формат
 * - Консистентний стиль з іншими shared компонентами
 */
export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureChange,
  className,
  title = 'Підпис клієнта',
  subtitle = 'Будь ласка, поставте підпис у полі нижче за допомогою миші або сенсорного екрану',
  width = 550,
  height = 180,
  strokeColor = '#000000',
  strokeWidth = 2,
  backgroundColor = '#ffffff',
  buttonSize = 'medium',
  showSaveButton = false,
  saveLabel = 'Зберегти підпис',
  clearLabel = 'Очистити',
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const initializeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      // Ініціалізуємо налаштування малювання
      context.lineWidth = strokeWidth;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = strokeColor;

      // Очищаємо та встановлюємо фон
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    initializeCanvas();
  }, [backgroundColor, strokeColor, strokeWidth]);

  const getEventCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (disabled) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    setIsDrawing(true);
    setHasSignature(true);

    const { x, y } = getEventCoordinates(e);
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    // Запобігаємо скролінгу на touch пристроях
    if ('touches' in e) {
      e.preventDefault();
    }

    const { x, y } = getEventCoordinates(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing || disabled) return;

    setIsDrawing(false);

    // Автоматично викликаємо callback якщо не показуємо кнопку збереження
    if (!showSaveButton) {
      handleSaveSignature();
    }
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const signatureData = canvas.toDataURL('image/png');
    onSignatureChange?.(signatureData);
  };

  const clearSignature = () => {
    if (disabled) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    setHasSignature(false);
    onSignatureChange?.(null);
  };

  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: 1,
          mb: 2,
          width: '100%',
          height: height + 20,
          backgroundColor: backgroundColor,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'crosshair',
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          style={{
            width: '100%',
            height: '100%',
            cursor: disabled ? 'not-allowed' : 'crosshair',
            pointerEvents: disabled ? 'none' : 'auto',
          }}
        />
      </Paper>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <ActionButton
          variant="outlined"
          color="error"
          onClick={clearSignature}
          disabled={!hasSignature || disabled}
          startIcon={<Clear />}
          size={buttonSize}
        >
          {clearLabel}
        </ActionButton>

        {showSaveButton && (
          <ActionButton
            variant="contained"
            onClick={handleSaveSignature}
            disabled={!hasSignature || disabled}
            startIcon={<Done />}
            size={buttonSize}
          >
            {saveLabel}
          </ActionButton>
        )}
      </Stack>
    </Box>
  );
};
