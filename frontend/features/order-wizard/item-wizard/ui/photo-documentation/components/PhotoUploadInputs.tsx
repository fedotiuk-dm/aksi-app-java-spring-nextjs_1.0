'use client';

import React from 'react';

interface PhotoUploadInputsProps {
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (files: FileList | null) => void;
}

/**
 * Компонент для прихованих input елементів завантаження фото
 *
 * FSD принципи:
 * - Тільки UI логіка для input елементів
 * - Отримує refs та обробник через пропси
 * - Не містить бізнес-логіки обробки файлів
 */
export const PhotoUploadInputs: React.FC<PhotoUploadInputsProps> = ({
  cameraInputRef,
  fileInputRef,
  onFileSelect,
}) => {
  return (
    <>
      {/* Прихований input для камери */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => onFileSelect(e.target.files)}
      />

      {/* Прихований input для галереї */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => onFileSelect(e.target.files)}
      />
    </>
  );
};

export default PhotoUploadInputs;
