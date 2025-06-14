'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Category as CategoryIcon, Search as SearchIcon } from '@mui/icons-material';
import React from 'react';

interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  estimatedDuration?: string;
}

interface ServiceCategorySelectionStepProps {
  categories: ServiceCategory[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading?: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export const ServiceCategorySelectionStep: React.FC<ServiceCategorySelectionStepProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  searchTerm,
  onSearchChange,
  loading = false,
}) => {
  // ========== ФІЛЬТРАЦІЯ ==========
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== RENDER ==========
  if (loading && categories.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Завантаження категорій...
        </Typography>
      </Box>
    );
  }

  if (categories.length === 0) {
    return <Alert severity="warning">Немає доступних категорій послуг. Спробуйте пізніше.</Alert>;
  }

  return (
    <Box>
      {/* Заголовок */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <CategoryIcon sx={{ mr: 1 }} />
        Оберіть категорію послуги
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Виберіть тип послуги, який відповідає предмету, що ви здаєте в хімчистку.
      </Typography>

      {/* Пошук */}
      <TextField
        fullWidth
        placeholder="Пошук категорій..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Кількість знайдених категорій */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
        Знайдено категорій: {filteredCategories.length}
      </Typography>

      {/* Список категорій */}
      {filteredCategories.length === 0 ? (
        <Alert severity="info">
          {searchTerm
            ? `Не знайдено категорій за запитом "${searchTerm}"`
            : 'Немає доступних категорій'}
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              variant={selectedCategoryId === category.id ? 'outlined' : 'elevation'}
              sx={{
                height: '100%',
                border: selectedCategoryId === category.id ? 2 : 0,
                borderColor: selectedCategoryId === category.id ? 'primary.main' : 'transparent',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardActionArea
                onClick={() => onCategorySelect(category.id)}
                disabled={loading}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" component="h3">
                      {category.name}
                    </Typography>
                    {selectedCategoryId === category.id && (
                      <Chip label="Обрано" color="primary" size="small" />
                    )}
                  </Box>

                  {category.description && (
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  )}

                  {category.estimatedDuration && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Термін виконання: {category.estimatedDuration}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}

      {/* Поточний вибір */}
      {selectedCategoryId && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Обрано категорію:{' '}
            <strong>{filteredCategories.find((c) => c.id === selectedCategoryId)?.name}</strong>
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
