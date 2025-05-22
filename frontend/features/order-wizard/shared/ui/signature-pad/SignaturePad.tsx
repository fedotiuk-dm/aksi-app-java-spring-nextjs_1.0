'use client';

import { Box, Button, Paper, Typography, Stack } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
  onSignatureChange?: (signatureData: string | null) => void;
  className?: string;
  label?: string;
}

/**
 * Компонент для збору цифрового підпису клієнта
 * Використовується на етапі 4.2 для юридичного підтвердження
 */
export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureChange,
  className,
  label = 'Підпис клієнта',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Ініціалізуємо полотно
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#000000';

    // Очищаємо полотно
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    setIsDrawing(true);
    setHasSignature(true);

    let clientX, clientY;

    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let clientX, clientY;

    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;

      // Запобігаємо скролінгу сторінки під час малювання
      e.preventDefault();
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');

    if (onSignatureChange) {
      onSignatureChange(signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    setHasSignature(false);

    if (onSignatureChange) {
      onSignatureChange(null);
    }
  };

  return (
    <Box className={className}>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Будь ласка, поставте підпис у полі нижче за допомогою миші або сенсорного екрану
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 1,
          mb: 2,
          width: '100%',
          height: 200,
          backgroundColor: '#ffffff',
        }}
      >
        <canvas
          ref={canvasRef}
          width={550}
          height={180}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
        />
      </Paper>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" color="error" onClick={clearSignature} disabled={!hasSignature}>
          Очистити
        </Button>
      </Stack>
    </Box>
  );
};
