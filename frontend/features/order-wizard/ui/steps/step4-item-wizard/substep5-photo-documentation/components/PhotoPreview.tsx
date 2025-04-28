import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  CircularProgress,
  Dialog,
  DialogContent,
  Paper,
  styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { ItemPhoto } from '@/features/order-wizard/model/types/types';

interface PhotoPreviewProps {
  photo: ItemPhoto;
  onDelete: () => void;
  isLoading?: boolean;
}

// Стилізований контейнер для попереднього перегляду фото
const PreviewContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingBottom: '100%', // Співвідношення сторін 1:1
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  '&:hover .photo-actions': {
    opacity: 1,
  },
}));

// Стилізоване зображення, яке покриває весь контейнер
const StyledImage = styled('img')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

// Стилізований шар з діями для фото
const ActionOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  opacity: 0,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.short,
  }),
}));

/**
 * Компонент для відображення попереднього перегляду фото
 */
export const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photo,
  onDelete,
  isLoading = false
}) => {
  const [openFullscreen, setOpenFullscreen] = useState(false);

  const handleOpenFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFullscreen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <>
      <PreviewContainer elevation={1}>
        {/* Мініатюра фото */}
        <StyledImage 
          src={photo.thumbnailUrl || photo.url} 
          alt="Фото предмета" 
          loading="lazy"
        />
        
        {/* Шар з кнопками дій */}
        <ActionOverlay className="photo-actions">
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <IconButton 
                color="inherit"
                onClick={handleOpenFullscreen}
                size="small"
                sx={{ mx: 0.5 }}
              >
                <ZoomInIcon />
              </IconButton>
              <IconButton 
                color="error"
                onClick={handleDelete}
                size="small"
                sx={{ mx: 0.5 }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </ActionOverlay>
      </PreviewContainer>

      {/* Модальне вікно для повноекранного перегляду */}
      <Dialog 
        open={openFullscreen} 
        onClose={() => setOpenFullscreen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 1, textAlign: 'center' }}>
          <img 
            src={photo.url} 
            alt="Фото предмета" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '80vh', 
              objectFit: 'contain' 
            }} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
