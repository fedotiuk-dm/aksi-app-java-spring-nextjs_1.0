'use client';

import { Alert } from '@mui/material';
import React from 'react';

interface PhotoUploadMessagesProps {
  photoCount: number;
  maxPhotos: number;
  canAddMorePhotos: boolean;
}

/**
 * Компонент для відображення інформаційних повідомлень про завантаження фото
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення повідомлень
 * - Отримує стан через пропси
 * - Не містить бізнес-логіки валідації
 */
export const PhotoUploadMessages: React.FC<PhotoUploadMessagesProps> = ({
  photoCount,
  maxPhotos,
  canAddMorePhotos,
}) => {
  return (
    <>
      {/* Інформаційні повідомлення */}
      {photoCount === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Фотодокументація не є обов&apos;язковою, але рекомендується для фіксації стану предмета.
        </Alert>
      )}

      {!canAddMorePhotos && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Досягнуто максимальну кількість фото ({maxPhotos}). Для додавання нових фото, спочатку
          видаліть деякі з існуючих.
        </Alert>
      )}

      {photoCount > 0 && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Завантажено {photoCount} фото. Фотодокументація завершена!
        </Alert>
      )}
    </>
  );
};

export default PhotoUploadMessages;
