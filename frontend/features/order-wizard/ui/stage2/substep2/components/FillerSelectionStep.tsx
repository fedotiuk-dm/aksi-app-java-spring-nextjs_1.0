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
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Switch,
} from '@mui/material';
import { CheckCircle, Layers, Search } from '@mui/icons-material';

interface Filler {
  id: string;
  name: string;
  description?: string;
  isForDamagedItems?: boolean;
}

interface FillerSelectionStepProps {
  fillers: Filler[];
  selectedFillerId: string | null;
  onFillerSelect: (fillerId: string, fillerName: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading?: boolean;
  hasDamagedFiller?: boolean;
  onToggleDamagedFiller?: (checked: boolean) => void;
  showFillerDetails?: boolean;
  onToggleFillerDetails?: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const FillerSelectionStep: React.FC<FillerSelectionStepProps> = ({
  fillers,
  selectedFillerId,
  onFillerSelect,
  searchTerm,
  onSearchChange,
  loading = false,
  hasDamagedFiller = false,
  onToggleDamagedFiller,
  showFillerDetails = false,
  onToggleFillerDetails,
  onNext,
  onPrevious,
}) => {
  // ========== ФІЛЬТРАЦІЯ ==========
  const filteredFillers = fillers.filter((filler) =>
    filler.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== ЗАВАНТАЖЕННЯ ==========
  if (loading && fillers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Завантаження наповнювачів...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Оберіть тип наповнювача
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Виберіть тип наповнювача предмета (якщо застосовується)
      </Typography>

      {/* Налаштування та пошук */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Пошук наповнювачів..."
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
          <Grid size={{ xs: 12, md: 3 }}>
            {onToggleDamagedFiller && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasDamagedFiller}
                    onChange={(e) => onToggleDamagedFiller(e.target.checked)}
                  />
                }
                label="Збитий наповнювач"
              />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            {onToggleFillerDetails && (
              <FormControlLabel
                control={<Switch checked={showFillerDetails} onChange={onToggleFillerDetails} />}
                label="Показати деталі"
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Повідомлення про збитий наповнювач */}
      {hasDamagedFiller && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Увага:</strong> Відмічено збитий наповнювач. Це може вплинути на якість чистки
            та вартість послуг.
          </Typography>
        </Alert>
      )}

      {/* Повідомлення про відсутність наповнювачів */}
      {fillers.length === 0 && (
        <Alert severity="info">Немає доступних наповнювачів для цього типу предмета.</Alert>
      )}

      {/* Опція "Без наповнювача" */}
      {fillers.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant={selectedFillerId === 'none' ? 'outlined' : 'elevation'}
              sx={{
                cursor: 'pointer',
                border: selectedFillerId === 'none' ? 2 : 0,
                borderColor: selectedFillerId === 'none' ? 'primary.main' : 'transparent',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              <CardActionArea
                onClick={() => onFillerSelect('none', 'Без наповнювача')}
                disabled={loading}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Layers color="action" />
                    {selectedFillerId === 'none' && <CheckCircle color="primary" />}
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Без наповнювача
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Предмет не має наповнювача
                  </Typography>

                  {selectedFillerId === 'none' && (
                    <Chip label="Обрано" color="primary" size="small" sx={{ mt: 1 }} />
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Сітка наповнювачів */}
      {filteredFillers.length === 0 && searchTerm && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Не знайдено наповнювачів за запитом &ldquo;{searchTerm}&rdquo;
        </Alert>
      )}

      <Grid container spacing={2}>
        {filteredFillers.map((filler) => (
          <Grid key={filler.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant={selectedFillerId === filler.id ? 'outlined' : 'elevation'}
              sx={{
                cursor: 'pointer',
                border: selectedFillerId === filler.id ? 2 : 0,
                borderColor: selectedFillerId === filler.id ? 'primary.main' : 'transparent',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              <CardActionArea
                onClick={() => onFillerSelect(filler.id, filler.name)}
                disabled={loading}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Layers color="primary" />
                    {selectedFillerId === filler.id && <CheckCircle color="primary" />}
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {filler.name}
                  </Typography>

                  {filler.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {filler.description}
                    </Typography>
                  )}

                  {showFillerDetails && filler.isForDamagedItems && (
                    <Typography variant="caption" color="text.secondary">
                      Підходить для пошкоджених предметів
                    </Typography>
                  )}

                  {selectedFillerId === filler.id && (
                    <Chip label="Обрано" color="primary" size="small" sx={{ mt: 1 }} />
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Повідомлення про успішний вибір */}
      {selectedFillerId && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Наповнювач обрано:{' '}
            <strong>
              {selectedFillerId === 'none'
                ? 'Без наповнювача'
                : filteredFillers.find((f) => f.id === selectedFillerId)?.name}
            </strong>
          </Typography>
          <Typography variant="body2">Натисніть &ldquo;Далі&rdquo; для продовження.</Typography>
        </Alert>
      )}
    </Box>
  );
};
