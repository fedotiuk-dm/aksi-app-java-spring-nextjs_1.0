import React from 'react';
import { Box, Button, Chip, Stack } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { FormSection } from '@shared/ui/molecules';
import { usePhotoUploadOperations } from '@features/order-wizard/hooks';

export const PhotoUpload: React.FC = () => {
  const { 
    uploadedPhotos, 
    deletePhoto, 
    isUploading,
    handleFileUpload
  } = usePhotoUploadOperations();

  return (
    <FormSection title="Фото предмета">
      
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PhotoCamera />}
          component="label"
          fullWidth
          disabled={isUploading}
        >
          {isUploading ? 'Завантаження...' : 'Додати фото'}
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            onChange={handleFileUpload}
          />
        </Button>
      </Box>

      {uploadedPhotos.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {uploadedPhotos.map((photo, index) => (
            <Chip
              key={index}
              label={photo.name}
              onDelete={() => deletePhoto(index)}
              deleteIcon={<Delete />}
              variant="outlined"
            />
          ))}
        </Stack>
      )}
    </FormSection>
  );
};