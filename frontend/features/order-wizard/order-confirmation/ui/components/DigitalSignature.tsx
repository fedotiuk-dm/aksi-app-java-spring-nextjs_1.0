'use client';

import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import React, { useRef, useCallback, useEffect, useState } from 'react';

interface DigitalSignatureProps {
  signatureData: string | null;
  onSignatureChange: (data: string | null) => void;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент цифрового підпису клієнта
 *
 * FSD принципи:
 * - Тільки UI логіка для роботи з canvas підписом
 * - Отримує стан та обробники через пропси
 * - Використовує HTML5 Canvas API для малювання підпису
 *
 * Згідно з документацією Order Wizard:
 * 4.2. Юридичні аспекти
 * - Цифровий підпис клієнта (вікно для підпису на сенсорному екрані)
 * - Кнопка "Очистити" для повторного підпису
 * - Кнопка "Зберегти підпис"
 */
export const DigitalSignature: React.FC<DigitalSignatureProps> = ({
  signatureData,
  onSignatureChange,
  disabled = false,
  required = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!signatureData);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

  // Константи для canvas
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 200;
  const STROKE_COLOR = '#000000';
  const STROKE_WIDTH = 2;

  /**
   * Ініціалізація canvas при монтуванні
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Налаштовуємо контекст
    context.strokeStyle = STROKE_COLOR;
    context.lineWidth = STROKE_WIDTH;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    setCanvasContext(context);

    // Відновлюємо підпис якщо є
    if (signatureData) {
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.drawImage(img, 0, 0);
        setHasSignature(true);
      };
      img.src = signatureData;
    }
  }, [signatureData]);

  /**
   * Отримання координат з події (підтримка touch та mouse)
   */
  const getCoordinates = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      if ('touches' in event) {
        // Touch event
        const touch = event.touches[0] || event.changedTouches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      } else {
        // Mouse event
        return {
          x: (event.clientX - rect.left) * scaleX,
          y: (event.clientY - rect.top) * scaleY,
        };
      }
    },
    []
  );

  /**
   * Початок малювання
   */
  const handleDrawStart = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (disabled || !canvasContext) return;

      event.preventDefault();
      setIsDrawing(true);

      const { x, y } = getCoordinates(event);
      canvasContext.beginPath();
      canvasContext.moveTo(x, y);
    },
    [disabled, canvasContext, getCoordinates]
  );

  /**
   * Процес малювання
   */
  const handleDraw = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing || disabled || !canvasContext) return;

      event.preventDefault();

      const { x, y } = getCoordinates(event);
      canvasContext.lineTo(x, y);
      canvasContext.stroke();

      setHasSignature(true);
    },
    [isDrawing, disabled, canvasContext, getCoordinates]
  );

  /**
   * Завершення малювання
   */
  const handleDrawEnd = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing || disabled) return;

      event.preventDefault();
      setIsDrawing(false);

      // Зберігаємо підпис як base64
      const canvas = canvasRef.current;
      if (canvas && hasSignature) {
        const dataURL = canvas.toDataURL('image/png');
        onSignatureChange(dataURL);
      }
    },
    [isDrawing, disabled, hasSignature, onSignatureChange]
  );

  /**
   * Очищення підпису
   */
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasContext || disabled) return;

    canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setHasSignature(false);
    onSignatureChange(null);
  }, [canvasContext, disabled, onSignatureChange]);

  /**
   * Збереження підпису
   */
  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const dataURL = canvas.toDataURL('image/png');
    onSignatureChange(dataURL);
  }, [hasSignature, onSignatureChange]);

  return (
    <Grid size={{ xs: 12 }}>
      <Card
        variant="outlined"
        sx={{ bgcolor: required && !signatureData ? 'warning.light' : 'background.paper' }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Цифровий підпис клієнта
            {required && (
              <Typography component="span" color="error.main">
                {' '}
                *
              </Typography>
            )}
          </Typography>

          {required && !signatureData && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Для завершення замовлення необхідно отримати підпис клієнта
            </Alert>
          )}

          {/* Canvas для підпису */}
          <Box
            sx={{
              border: 2,
              borderColor: disabled ? 'grey.300' : 'grey.500',
              borderRadius: 1,
              bgcolor: disabled ? 'grey.100' : 'white',
              mb: 2,
              overflow: 'hidden',
              cursor: disabled ? 'not-allowed' : 'crosshair',
            }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                touchAction: 'none',
              }}
              onMouseDown={handleDrawStart}
              onMouseMove={handleDraw}
              onMouseUp={handleDrawEnd}
              onMouseLeave={handleDrawEnd}
              onTouchStart={handleDrawStart}
              onTouchMove={handleDraw}
              onTouchEnd={handleDrawEnd}
            />
          </Box>

          {/* Підказка */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {disabled
              ? 'Підпис заблоковано'
              : 'Намалюйте підпис мишею або пальцем на сенсорному екрані'}
          </Typography>

          {/* Кнопки керування */}
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Box>
              {hasSignature && (
                <Typography variant="body2" color="success.main">
                  ✓ Підпис збережено
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Очистити підпис">
                <IconButton
                  onClick={handleClear}
                  disabled={disabled || !hasSignature}
                  color="error"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="outlined"
                onClick={handleSave}
                disabled={disabled || !hasSignature}
                startIcon={<EditIcon />}
                size="small"
              >
                Зберегти підпис
              </Button>
            </Stack>
          </Stack>

          {/* Валідація */}
          {required && !signatureData && (
            <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
              Обов&apos;язкове поле: підпис клієнта необхідний для завершення замовлення
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DigitalSignature;
