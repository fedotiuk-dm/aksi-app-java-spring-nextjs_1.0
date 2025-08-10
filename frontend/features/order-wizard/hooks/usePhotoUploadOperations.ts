import React, { useState } from 'react';
import { useUploadFile } from '@api/file';

type UploadedPhoto = {
  name: string;
  url?: string;
};

export const usePhotoUploadOperations = () => {
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const uploadMutation = useUploadFile();

  const uploadPhotos = async (files: File[]) => {
    for (const file of files) {
      try {
        const response = await uploadMutation.mutateAsync({
          data: { file },
          params: { directory: 'order-items' }
        });
        
        setUploadedPhotos(prev => [...prev, {
          name: file.name,
          url: response.fileUrl
        }]);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const deletePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const resetPhotos = () => {
    setUploadedPhotos([]);
  };

  // Handle file input change event
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    await uploadPhotos(Array.from(files));
  };

  const isUploading = uploadMutation.isPending;
  const uploadError = uploadMutation.error;

  return {
    // Data
    uploadedPhotos,
    
    // Operations
    uploadPhotos,
    deletePhoto,
    resetPhotos,
    
    // Event Handlers (ready to use in UI)
    handleFileUpload,
    
    // State
    isUploading,
    uploadError
  };
};