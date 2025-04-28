import React, { useRef } from 'react';
import { 
  Box, 
  Button,
  Typography, 
  styled,
  Paper
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

interface PhotoUploaderProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  uploadType: 'camera' | 'gallery';
  onClick?: () => void;
}

// Прихований інпут для файлів
const HiddenInput = styled('input')({
  display: 'none',
});

/**
 * Компонент для завантаження фотографій з галереї або камери
 */
export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onFileSelected,
  disabled = false,
  uploadType,
  onClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (uploadType === 'gallery') {
      fileInputRef.current?.click();
    } else if (onClick) {
      onClick();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
    // Очистка значення, щоб можна було вибрати той самий файл повторно
    event.target.value = '';
  };

  const isCamera = uploadType === 'camera';
  const icon = isCamera ? <CameraAltIcon fontSize="large" /> : <PhotoLibraryIcon fontSize="large" />;
  const label = isCamera ? 'Зробити фото' : 'Вибрати з галереї';
  const helperText = isCamera 
    ? 'Зробіть фото з камери вашого пристрою' 
    : 'Виберіть файл з галереї вашого пристрою';

  return (
    <Paper
      variant="outlined"
      component={Button}
      onClick={handleClick}
      disabled={disabled}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        height: 160,
        textAlign: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: 'divider',
        bgcolor: disabled ? 'action.disabledBackground' : 'background.paper',
        '&:hover': {
          borderColor: disabled ? 'divider' : 'primary.main',
          bgcolor: disabled ? 'action.disabledBackground' : 'action.hover',
        },
      }}
    >
      <Box color={disabled ? 'action.disabled' : 'primary.main'} sx={{ mb: 1 }}>
        {icon}
      </Box>
      <Typography variant="subtitle1" color={disabled ? 'text.disabled' : 'text.primary'}>
        {label}
      </Typography>
      <Typography variant="body2" color={disabled ? 'text.disabled' : 'text.secondary'}>
        {helperText}
      </Typography>

      {/* Прихований інпут для завантаження файлів */}
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </Paper>
  );
};
