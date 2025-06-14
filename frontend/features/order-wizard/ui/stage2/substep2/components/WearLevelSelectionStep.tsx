'use client';

import React from 'react';
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
  LinearProgress,
} from '@mui/material';
import { CheckCircle, TrendingDown, Info } from '@mui/icons-material';

interface WearLevel {
  id: string;
  name: string;
  percentage: number;
  description?: string;
  priceModifier?: number; // Коефіцієнт для зміни ціни
}

interface WearLevelSelectionStepProps {
  wearLevels: WearLevel[];
  selectedWearLevelId: string | null;
  onWearLevelSelect: (wearLevelId: string, wearLevelName: string) => void;
  loading?: boolean;
  showPriceModifiers?: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export const WearLevelSelectionStep: React.FC<WearLevelSelectionStepProps> = ({
  wearLevels,
  selectedWearLevelId,
  onWearLevelSelect,
  loading = false,
  showPriceModifiers = false,
  onNext,
  onPrevious,
}) => {
  // ========== ЗАВАНТАЖЕННЯ ==========
  if (loading && wearLevels.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Завантаження рівнів зносу...
        </Typography>
      </Box>
    );
  }

  // Сортування за відсотком
  const sortedWearLevels = [...wearLevels].sort((a, b) => a.percentage - b.percentage);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Оберіть ступінь зносу предмета
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Визначте поточний стан предмета для точного розрахунку вартості
      </Typography>

      {/* Інформаційне повідомлення */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center">
          <Info sx={{ mr: 1 }} />
          <Typography variant="body2">
            Ступінь зносу впливає на вибір методу чистки та може вплинути на вартість послуг.
            {showPriceModifiers && ' Коефіцієнти ціни показані для кожного рівня.'}
          </Typography>
        </Box>
      </Alert>

      {/* Повідомлення про відсутність рівнів зносу */}
      {wearLevels.length === 0 && (
        <Alert severity="warning">
          Немає доступних рівнів зносу. Зверніться до адміністратора.
        </Alert>
      )}

      {/* Сітка рівнів зносу */}
      <Grid container spacing={3}>
        {sortedWearLevels.map((wearLevel) => (
          <Grid key={wearLevel.id} size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <Card
              variant={selectedWearLevelId === wearLevel.id ? 'outlined' : 'elevation'}
              sx={{
                cursor: 'pointer',
                border: selectedWearLevelId === wearLevel.id ? 2 : 0,
                borderColor: selectedWearLevelId === wearLevel.id ? 'primary.main' : 'transparent',
                height: '100%',
                '&:hover': {
                  elevation: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <CardActionArea
                onClick={() => onWearLevelSelect(wearLevel.id, wearLevel.name)}
                disabled={loading}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <TrendingDown
                      color={
                        wearLevel.percentage <= 30
                          ? 'success'
                          : wearLevel.percentage <= 50
                            ? 'warning'
                            : 'error'
                      }
                    />
                    {selectedWearLevelId === wearLevel.id && <CheckCircle color="primary" />}
                  </Box>

                  {/* Назва та відсоток */}
                  <Typography variant="h6" gutterBottom>
                    {wearLevel.name}
                  </Typography>

                  <Typography variant="h4" color="primary" gutterBottom>
                    {wearLevel.percentage}%
                  </Typography>

                  {/* Візуальний індикатор зносу */}
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={wearLevel.percentage}
                      color={
                        wearLevel.percentage <= 30
                          ? 'success'
                          : wearLevel.percentage <= 50
                            ? 'warning'
                            : 'error'
                      }
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  {/* Опис */}
                  {wearLevel.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {wearLevel.description}
                    </Typography>
                  )}

                  {/* Коефіцієнт ціни */}
                  {showPriceModifiers && wearLevel.priceModifier && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Вплив на ціну:
                      </Typography>
                      <Typography
                        variant="body2"
                        color={wearLevel.priceModifier > 1 ? 'error' : 'success'}
                      >
                        {wearLevel.priceModifier > 1
                          ? `+${Math.round((wearLevel.priceModifier - 1) * 100)}%`
                          : wearLevel.priceModifier < 1
                            ? `-${Math.round((1 - wearLevel.priceModifier) * 100)}%`
                            : 'Без змін'}
                      </Typography>
                    </Box>
                  )}

                  {/* Індикатор вибору */}
                  {selectedWearLevelId === wearLevel.id && (
                    <Chip label="Обрано" color="primary" size="small" sx={{ mt: 1 }} />
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Повідомлення про успішний вибір */}
      {selectedWearLevelId && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Обрано ступінь зносу:{' '}
            <strong>
              {sortedWearLevels.find((w) => w.id === selectedWearLevelId)?.name}(
              {sortedWearLevels.find((w) => w.id === selectedWearLevelId)?.percentage}%)
            </strong>
          </Typography>
          <Typography variant="body2">
            Натисніть &ldquo;Далі&rdquo; для продовження до перевірки характеристик.
          </Typography>
        </Alert>
      )}

      {/* Додаткова інформація */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Довідка:</strong>
        </Typography>
        <Typography variant="body2" component="div">
          • <strong>10%</strong> - практично новий предмет
        </Typography>
        <Typography variant="body2" component="div">
          • <strong>30%</strong> - легкий знос, добрий стан
        </Typography>
        <Typography variant="body2" component="div">
          • <strong>50%</strong> - помітний знос
        </Typography>
        <Typography variant="body2" component="div">
          • <strong>75%</strong> - значний знос, потребує особливого догляду
        </Typography>
      </Alert>
    </Box>
  );
};
