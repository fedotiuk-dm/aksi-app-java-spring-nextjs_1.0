'use client';

import { Clear, Edit, CheckCircle } from '@mui/icons-material';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Stack,
  Paper,
} from '@mui/material';
import React, { useRef, useCallback, useEffect, useState } from 'react';

interface DigitalSignaturePadProps {
  signatureData: string | null;
  onSignatureChange: (data: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  title?: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  showPreview?: boolean;
}

/**
 * Компонент цифрового підпису з Canvas API
 */
export const DigitalSignaturePad: React.FC<DigitalSignaturePadProps> = ({
  signatureData,
  onSignatureChange,
  disabled = false,
  required = false,
  title = 'Цифровий підпис клієнта',
  width = 400,
  height = 200,
  strokeColor = '#000000',
  strokeWidth = 2,
  showPreview = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!signatureData);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

  /**
   * Ініціалізація canvas при монтуванні
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Налаштовуємо контекст
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    setCanvasContext(context);

    // Відновлюємо підпис якщо є
    if (signatureData) {
      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, width, height);
        context.drawImage(img, 0, 0);
        setHasSignature(true);
      };
      img.src = signatureData;
    }
  }, [signatureData, strokeColor, strokeWidth, width, height]);

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

    canvasContext.clearRect(0, 0, width, height);
    setHasSignature(false);
    onSignatureChange(null);
  }, [canvasContext, disabled, width, height, onSignatureChange]);

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
        sx={{
          bgcolor: required && !signatureData ? 'warning.light' : 'background.paper',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Edit color="primary" />
            {title}
            {required && (
              <Typography component="span" color="error.main">
                *
              </Typography>
            )}
            {signatureData && <CheckCircle color="success" fontSize="small" />}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Canvas для підпису */}
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                display: 'inline-block',
                width: 'fit-content',
                bgcolor: 'background.default',
                cursor: disabled ? 'not-allowed' : 'crosshair',
              }}
            >
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onMouseDown={handleDrawStart}
                onMouseMove={handleDraw}
                onMouseUp={handleDrawEnd}
                onMouseLeave={handleDrawEnd}
                onTouchStart={handleDrawStart}
                onTouchMove={handleDraw}
                onTouchEnd={handleDrawEnd}
                style={{
                  border: '1px dashed #ccc',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                }}
              />
            </Paper>

            {/* Інструкції */}
            <Typography variant="body2" color="text.secondary">
              {disabled
                ? 'Підпис заблокований'
                : 'Намалюйте підпис у полі вище за допомогою миші або дотику'}
            </Typography>

            {/* Кнопки управління */}
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClear}
                disabled={disabled || !hasSignature}
                size="small"
              >
                Очистити
              </Button>

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={disabled || !hasSignature}
                size="small"
              >
                Зберегти підпис
              </Button>

              {signatureData && (
                <Typography
                  variant="caption"
                  color="success.main"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <CheckCircle fontSize="small" />
                  Підпис збережено
                </Typography>
              )}
            </Stack>

            {/* Попередній перегляд */}
            {showPreview && signatureData && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Збережений підпис:
                </Typography>
                <Paper variant="outlined" sx={{ p: 1, width: 'fit-content' }}>
                  <img
                    src={signatureData}
                    alt="Цифровий підпис"
                    style={{
                      maxWidth: width / 2,
                      maxHeight: height / 2,
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  />
                </Paper>
              </Box>
            )}

            {/* Попередження */}
            {required && !signatureData && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Цифровий підпис обов&apos;язковий для завершення оформлення замовлення
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};
