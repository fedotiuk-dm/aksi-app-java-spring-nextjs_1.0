'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Texture,
  Palette,
  Layers,
  TrendingDown,
  Info,
  Warning,
} from '@mui/icons-material';

interface Material {
  id: string;
  name: string;
  description?: string;
}

interface Color {
  id: string;
  name: string;
  hexCode?: string;
}

interface Filler {
  id: string;
  name: string;
  description?: string;
}

interface WearLevel {
  id: string;
  name: string;
  percentage: number;
  description?: string;
}

interface CharacteristicsValidationStepProps {
  selectedMaterial: Material | null;
  selectedColor: Color | null;
  selectedFiller: Filler | null;
  selectedWearLevel: WearLevel | null;
  hasDamagedFiller?: boolean;
  loading?: boolean;
  validationErrors?: string[];
  validationWarnings?: string[];
  onNext: () => void;
  onPrevious: () => void;
}

export const CharacteristicsValidationStep: React.FC<CharacteristicsValidationStepProps> = ({
  selectedMaterial,
  selectedColor,
  selectedFiller,
  selectedWearLevel,
  hasDamagedFiller = false,
  loading = false,
  validationErrors = [],
  validationWarnings = [],
  onNext,
  onPrevious,
}) => {
  // ========== ЗАВАНТАЖЕННЯ ==========
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Перевірка характеристик...
        </Typography>
      </Box>
    );
  }

  // ========== ПЕРЕВІРКА ВАЛІДНОСТІ ==========
  const isValid = selectedMaterial && selectedColor && selectedFiller && selectedWearLevel;
  const hasErrors = validationErrors.length > 0;
  const hasWarnings = validationWarnings.length > 0;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Перевірка характеристик предмета
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Перевірте правильність всіх вибраних характеристик перед продовженням
      </Typography>

      {/* Помилки валідації */}
      {hasErrors && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Знайдено помилки:</strong>
          </Typography>
          {validationErrors.map((error, index) => (
            <Typography key={index} variant="body2" component="div">
              • {error}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Попередження */}
      {hasWarnings && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Зверніть увагу:</strong>
          </Typography>
          {validationWarnings.map((warning, index) => (
            <Typography key={index} variant="body2" component="div">
              • {warning}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Основна інформація */}
      <Grid container spacing={3}>
        {/* Матеріал */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Texture color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Матеріал</Typography>
                {selectedMaterial && <CheckCircle color="success" sx={{ ml: 'auto' }} />}
              </Box>

              {selectedMaterial ? (
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>{selectedMaterial.name}</strong>
                  </Typography>
                  {selectedMaterial.description && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedMaterial.description}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Alert severity="error">Матеріал не обрано</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Колір */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Palette color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Колір</Typography>
                {selectedColor && <CheckCircle color="success" sx={{ ml: 'auto' }} />}
              </Box>

              {selectedColor ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    {selectedColor.hexCode && (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: selectedColor.hexCode,
                          border: '1px solid #E0E0E0',
                          borderRadius: 1,
                          mr: 1,
                        }}
                      />
                    )}
                    <Typography variant="body1">
                      <strong>{selectedColor.name}</strong>
                    </Typography>
                  </Box>
                  {selectedColor.hexCode && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedColor.hexCode}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Alert severity="error">Колір не обрано</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Наповнювач */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Layers color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Наповнювач</Typography>
                {selectedFiller && <CheckCircle color="success" sx={{ ml: 'auto' }} />}
              </Box>

              {selectedFiller ? (
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>{selectedFiller.name}</strong>
                  </Typography>
                  {selectedFiller.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {selectedFiller.description}
                    </Typography>
                  )}
                  {hasDamagedFiller && (
                    <Chip label="Збитий наповнювач" color="warning" size="small" />
                  )}
                </Box>
              ) : (
                <Alert severity="error">Наповнювач не обрано</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Ступінь зносу */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingDown color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Ступінь зносу</Typography>
                {selectedWearLevel && <CheckCircle color="success" sx={{ ml: 'auto' }} />}
              </Box>

              {selectedWearLevel ? (
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>{selectedWearLevel.name}</strong>
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    {selectedWearLevel.percentage}%
                  </Typography>
                  {selectedWearLevel.description && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedWearLevel.description}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Alert severity="error">Ступінь зносу не обрано</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Підсумок */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Підсумок характеристик
          </Typography>

          <List dense>
            <ListItem>
              <ListItemIcon>
                <Texture color={selectedMaterial ? 'success' : 'error'} />
              </ListItemIcon>
              <ListItemText
                primary="Матеріал"
                secondary={selectedMaterial ? selectedMaterial.name : 'Не обрано'}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Palette color={selectedColor ? 'success' : 'error'} />
              </ListItemIcon>
              <ListItemText
                primary="Колір"
                secondary={selectedColor ? selectedColor.name : 'Не обрано'}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Layers color={selectedFiller ? 'success' : 'error'} />
              </ListItemIcon>
              <ListItemText
                primary="Наповнювач"
                secondary={selectedFiller ? selectedFiller.name : 'Не обрано'}
              />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <TrendingDown color={selectedWearLevel ? 'success' : 'error'} />
              </ListItemIcon>
              <ListItemText
                primary="Ступінь зносу"
                secondary={
                  selectedWearLevel
                    ? `${selectedWearLevel.name} (${selectedWearLevel.percentage}%)`
                    : 'Не обрано'
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Статус валідації */}
      {isValid && !hasErrors ? (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Box display="flex" alignItems="center">
            <CheckCircle sx={{ mr: 1 }} />
            <Typography variant="body2">
              Всі характеристики заповнено правильно. Можна продовжувати до наступного підетапу.
            </Typography>
          </Box>
        </Alert>
      ) : (
        <Alert severity="error" sx={{ mt: 3 }}>
          <Box display="flex" alignItems="center">
            <Warning sx={{ mr: 1 }} />
            <Typography variant="body2">
              Для продовження потрібно заповнити всі обов&apos;язкові характеристики.
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Інформаційне повідомлення */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Box display="flex" alignItems="center">
          <Info sx={{ mr: 1 }} />
          <Typography variant="body2">
            Ці характеристики будуть використані для розрахунку вартості та вибору оптимального
            методу чистки.
          </Typography>
        </Box>
      </Alert>
    </Box>
  );
};
