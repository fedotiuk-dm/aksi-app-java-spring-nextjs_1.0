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
  Switch,
} from '@mui/material';
import { CheckCircle, Texture, Search } from '@mui/icons-material';

interface Material {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isNatural?: boolean;
}

interface MaterialSelectionStepProps {
  materials: Material[];
  selectedMaterialId: string | null;
  onMaterialSelect: (materialId: string, materialName: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading?: boolean;
  showMaterialDetails?: boolean;
  onToggleMaterialDetails?: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const MaterialSelectionStep: React.FC<MaterialSelectionStepProps> = ({
  materials,
  selectedMaterialId,
  onMaterialSelect,
  searchTerm,
  onSearchChange,
  loading = false,
  showMaterialDetails = false,
  onToggleMaterialDetails,
  onNext,
  onPrevious,
}) => {
  // ========== ФІЛЬТРАЦІЯ ==========
  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== ЗАВАНТАЖЕННЯ ==========
  if (loading && materials.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Завантаження матеріалів...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Оберіть матеріал предмета
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Виберіть матеріал з якого виготовлено предмет для правильного підбору методу чистки
      </Typography>

      {/* Налаштування та пошук */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              placeholder="Пошук матеріалів..."
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
            {onToggleMaterialDetails && (
              <FormControlLabel
                control={
                  <Switch checked={showMaterialDetails} onChange={onToggleMaterialDetails} />
                }
                label="Показати деталі"
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Кількість знайдених матеріалів */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
        Знайдено матеріалів: {filteredMaterials.length}
      </Typography>

      {/* Повідомлення про відсутність матеріалів */}
      {materials.length === 0 && (
        <Alert severity="warning">Немає доступних матеріалів. Спробуйте пізніше.</Alert>
      )}

      {/* Сітка матеріалів */}
      {filteredMaterials.length === 0 && searchTerm && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Не знайдено матеріалів за запитом &ldquo;{searchTerm}&rdquo;
        </Alert>
      )}

      <Grid container spacing={2}>
        {filteredMaterials.map((material) => (
          <Grid key={material.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant={selectedMaterialId === material.id ? 'outlined' : 'elevation'}
              sx={{
                cursor: 'pointer',
                border: selectedMaterialId === material.id ? 2 : 0,
                borderColor: selectedMaterialId === material.id ? 'primary.main' : 'transparent',
                height: '100%',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              <CardActionArea
                onClick={() => onMaterialSelect(material.id, material.name)}
                disabled={loading}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Texture color="primary" />
                    {selectedMaterialId === material.id && <CheckCircle color="primary" />}
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {material.name}
                  </Typography>

                  {material.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {material.description}
                    </Typography>
                  )}

                  {showMaterialDetails && (
                    <Box sx={{ mt: 2 }}>
                      {material.category && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          Категорія: {material.category}
                        </Typography>
                      )}
                      {material.isNatural !== undefined && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          Тип: {material.isNatural ? 'Натуральний' : 'Синтетичний'}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {selectedMaterialId === material.id && (
                    <Chip label="Обрано" color="primary" size="small" sx={{ mt: 1 }} />
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Повідомлення про успішний вибір */}
      {selectedMaterialId && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Матеріал обрано:{' '}
            <strong>{filteredMaterials.find((m) => m.id === selectedMaterialId)?.name}</strong>
          </Typography>
          <Typography variant="body2">Натисніть &ldquo;Далі&rdquo; для вибору кольору.</Typography>
        </Alert>
      )}

      {/* Інформаційне повідомлення */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Важливо:</strong> Правильний вибір матеріалу впливає на метод чистки та вартість
          послуг. Якщо ви не впевнені в матеріалі, зверніться до консультанта.
        </Typography>
      </Alert>
    </Box>
  );
};
