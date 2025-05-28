/**
 * Підетап 2.5: Стан кроку "Фотодокументація"
 */

import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Підетап 2.5: Стан кроку "Фотодокументація"
 */
export interface ItemPhotoDocumentationStepState extends WizardStepState {
  photos: Array<{
    id: string;
    file: File;
    preview: string;
    uploaded: boolean;
    uploading: boolean;
    error?: string;
  }>;
  isCapturingPhoto: boolean;
  isCameraAvailable: boolean;
  maxPhotos: number; // 5
  maxFileSize: number; // 5MB
  uploadProgress: number;
  compressionSettings: {
    quality: number;
    maxWidth: number;
    maxHeight: number;
  };
}
