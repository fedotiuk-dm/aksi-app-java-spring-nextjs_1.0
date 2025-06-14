'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { CheckCircle, Palette, Search, Add, Close } from '@mui/icons-material';

interface Color {
  id: string;
  name: string;
  hexCode?: string;
  description?: string;
}

interface ColorSelectionStepProps {
  colors: Color[];
  selectedColorId: string | null;
  onColorSelect: (colorId: string, colorName: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading?: boolean;
  showColorDetails?: boolean;
  onToggleColorDetails?: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ColorSelectionStep: React.FC<ColorSelectionStepProps> = ({
  colors,
  selectedColorId,
  onColorSelect,
  searchTerm,
  onSearchChange,
  loading = false,
  showColorDetails = false,
  onToggleColorDetails,
  onNext,
  onPrevious,
}) => {
  // ========== ЛОКАЛЬНИЙ СТАН ==========
  const [showCustomColorDialog, setShowCustomColorDialog] = useState(false);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorValue, setCustomColorValue] = useState('#000000');

  // ========== ОБРОБНИКИ ПОДІЙ ==========
  const handleCustomColorAdd = () => {
    if (!customColorName.trim()) {
      alert('Введіть назву кольору');
      return;
    }

    onColorSelect(`custom_${Date.now()}`, customColorName.trim());
    setShowCustomColorDialog(false);
    setCustomColorName('');
    setCustomColorValue('#000000');
  };

  // ========== ФІЛЬТРАЦІЯ ==========
  const filteredColors = colors.filter((color) =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== ЗАВАНТАЖЕННЯ ==========
  if (loading && colors.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Завантаження кольорів...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Оберіть колір предмета
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Виберіть колір з доступного списку або додайте власний колір
      </Typography>

      {/* Налаштування та пошук */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              placeholder="Пошук кольорів..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {onToggleColorDetails && (
              <FormControlLabel
                control={<Switch checked={showColorDetails} onChange={onToggleColorDetails} />}
                label="Показати деталі"
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Кнопка додавання власного кольору */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setShowCustomColorDialog(true)}
          disabled={loading}
        >
          Додати власний колір
        </Button>
      </Box>

      {/* Повідомлення про відсутність кольорів */}
      {colors.length === 0 && (
        <Alert severity="info">Немає доступних кольорів. Спробуйте пізніше.</Alert>
      )}

      {/* Сітка кольорів */}
      {filteredColors.length === 0 && searchTerm && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Не знайдено кольорів за запитом &ldquo;{searchTerm}&rdquo;
        </Alert>
      )}

      <Grid container spacing={2}>
        {filteredColors.map((color) => (
          <Grid key={color.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              variant={selectedColorId === color.id ? 'outlined' : 'elevation'}
              sx={{
                cursor: 'pointer',
                border: selectedColorId === color.id ? 2 : 0,
                borderColor: selectedColorId === color.id ? 'primary.main' : 'transparent',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              <CardActionArea
                onClick={() => onColorSelect(color.id, color.name)}
                disabled={loading}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Palette color="primary" />
                    {selectedColorId === color.id && <CheckCircle color="primary" />}
                  </Box>

                  {/* Візуальний показ кольору (якщо є hexCode) */}
                  {color.hexCode && (
                    <Box
                      sx={{
                        width: '100%',
                        height: 60,
                        backgroundColor: color.hexCode,
                        border: color.hexCode === '#FFFFFF' ? '1px solid #E0E0E0' : 'none',
                        borderRadius: 1,
                        mb: 2,
                      }}
                    />
                  )}

                  <Typography variant="h6" gutterBottom>
                    {color.name}
                  </Typography>

                  {color.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {color.description}
                    </Typography>
                  )}

                  {showColorDetails && color.hexCode && (
                    <Typography variant="body2" color="text.secondary">
                      Код: {color.hexCode}
                    </Typography>
                  )}

                  {selectedColorId === color.id && (
                    <Chip label="Обрано" color="primary" size="small" sx={{ mt: 1 }} />
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Повідомлення про успішний вибір */}
      {selectedColorId && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Колір обрано. Натисніть &ldquo;Далі&rdquo; для продовження.
        </Alert>
      )}

      {/* Діалог додавання власного кольору */}
      <Dialog
        open={showCustomColorDialog}
        onClose={() => setShowCustomColorDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography>Додати власний колір</Typography>
            <Button
              onClick={() => setShowCustomColorDialog(false)}
              size="small"
              startIcon={<Close />}
            >
              Закрити
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Назва кольору"
                placeholder="Наприклад: Темно-зелений"
                value={customColorName}
                onChange={(e) => setCustomColorName(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="color"
                label="Код кольору"
                value={customColorValue}
                onChange={(e) => setCustomColorValue(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              {/* Попередній перегляд */}
              <Typography variant="body2" sx={{ mb: 1 }}>
                Попередній перегляд:
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 60,
                  backgroundColor: customColorValue,
                  border: '1px solid #E0E0E0',
                  borderRadius: 1,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowCustomColorDialog(false)}>Скасувати</Button>
          <Button
            onClick={handleCustomColorAdd}
            variant="contained"
            disabled={!customColorName.trim() || loading}
          >
            Додати колір
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
