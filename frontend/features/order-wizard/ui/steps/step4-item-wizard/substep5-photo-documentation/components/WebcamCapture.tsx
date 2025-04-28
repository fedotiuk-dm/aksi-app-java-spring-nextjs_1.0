import React, { useRef, useState, useCallback } from 'react';
import { Box, Button, Paper, Typography, Stack } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';

interface WebcamCaptureProps {
  onCapture: (file: File | null) => void;
  onCancel: () => void;
}

/**
 * Компонент для зйомки фото з веб-камери
 */
export const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  onCancel,
}) => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Ініціалізація камери
  const initCamera = useCallback(async () => {
    try {
      // Запит на доступ до камери
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          setIsCapturing(true);
        };
      }
    } catch (error) {
      console.error('Помилка доступу до камери:', error);
      setErrorMessage('Не вдалося отримати доступ до камери. Перевірте дозволи у браузері.');
    }
  }, []);

  // Очищення ресурсів камери
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  // Ініціалізація камери при монтуванні компонента
  React.useEffect(() => {
    initCamera();
    
    // Очищення при розмонтуванні
    return () => {
      stopCamera();
    };
  }, [initCamera, stopCamera]);

  // Зйомка фото
  const handleCapture = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Встановлюємо розміри canvas відповідно до відео
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Малюємо поточний кадр з відео на canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Отримуємо URL даних зображення
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      
      // Зупиняємо камеру
      stopCamera();
    }
  };

  // Зйомка знову
  const handleRetake = () => {
    setCapturedImage(null);
    initCamera();
  };

  // Підтвердження обраного фото
  const handleConfirm = () => {
    if (capturedImage) {
      // Конвертація Data URL у File об'єкт
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
        })
        .catch(error => {
          console.error('Помилка при конвертації зображення:', error);
          onCapture(null);
        });
    } else {
      onCapture(null);
    }
  };

  // Відображення помилки
  if (errorMessage) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {errorMessage}
        </Typography>
        <Button variant="outlined" onClick={onCancel} startIcon={<CloseIcon />}>
          Скасувати
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ position: 'relative', width: '100%', mb: 2 }}>
        {/* Відео з камери */}
        {!capturedImage && (
          <Box
            component="video"
            ref={videoRef}
            autoPlay
            playsInline
            muted
            sx={{
              width: '100%',
              maxHeight: '70vh',
              borderRadius: 1,
              display: isCapturing ? 'block' : 'none',
            }}
          />
        )}

        {/* Попередній перегляд знятого фото */}
        {capturedImage && (
          <Box
            component="img"
            src={capturedImage}
            alt="Зняте фото"
            sx={{
              width: '100%',
              maxHeight: '70vh',
              borderRadius: 1,
              objectFit: 'contain',
            }}
          />
        )}

        {/* Прихований canvas для захоплення фото */}
        <Box
          component="canvas"
          ref={canvasRef}
          sx={{ display: 'none' }}
        />
      </Box>

      {/* Кнопки керування */}
      <Stack direction="row" spacing={2} justifyContent="center">
        {!isCameraReady && !capturedImage && (
          <Typography>Ініціалізація камери...</Typography>
        )}

        {isCameraReady && !capturedImage && (
          <>
            <Button 
              variant="outlined" 
              onClick={onCancel}
              startIcon={<CloseIcon />}
            >
              Скасувати
            </Button>
            <Button 
              variant="contained" 
              onClick={handleCapture}
              startIcon={<CameraAltIcon />}
            >
              Зробити фото
            </Button>
          </>
        )}

        {capturedImage && (
          <>
            <Button 
              variant="outlined" 
              onClick={handleRetake}
              startIcon={<ReplayIcon />}
            >
              Зняти знову
            </Button>
            <Button 
              variant="contained" 
              onClick={handleConfirm}
              color="primary"
            >
              Використати фото
            </Button>
          </>
        )}
      </Stack>
    </Paper>
  );
};
