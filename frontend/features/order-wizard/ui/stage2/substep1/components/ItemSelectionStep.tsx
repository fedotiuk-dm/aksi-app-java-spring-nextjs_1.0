'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  ShoppingBag as ItemIcon,
  Search as SearchIcon,
  Euro as PriceIcon,
} from '@mui/icons-material';
import React from 'react';

interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
}

interface PriceListItem {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  unit: string;
  code?: string;
}

interface ItemSelectionStepProps {
  items: PriceListItem[];
  selectedItemId: string | null;
  selectedCategory: ServiceCategory | undefined;
  onItemSelect: (itemId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  loading?: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export const ItemSelectionStep: React.FC<ItemSelectionStepProps> = ({
  items,
  selectedItemId,
  selectedCategory,
  onItemSelect,
  searchTerm,
  onSearchChange,
  loading = false,
}) => {
  // ========== ФІЛЬТРАЦІЯ ==========
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ========== RENDER ==========
  return (
    <Box>
      {/* Заголовок */}
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <ItemIcon sx={{ mr: 1 }} />
        Вибір предмета з прайсу
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Оберіть предмет для обробки з прайс-листа категорії &quot;{selectedCategory?.name}&quot;.
      </Typography>

      {/* Пошук */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Пошук предметів..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Завантаження */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Список предметів */}
      {!loading && filteredItems.length === 0 ? (
        <Alert severity="info">
          {searchTerm
            ? `Не знайдено предметів за запитом "${searchTerm}"`
            : 'Немає доступних предметів для цієї категорії'}
        </Alert>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 2,
          }}
        >
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              variant={selectedItemId === item.id ? 'outlined' : 'elevation'}
              sx={{
                height: '100%',
                border: selectedItemId === item.id ? 2 : 0,
                borderColor: selectedItemId === item.id ? 'primary.main' : 'transparent',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardActionArea
                onClick={() => onItemSelect(item.id)}
                disabled={loading}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" component="h3">
                      {item.name}
                    </Typography>
                    {selectedItemId === item.id && (
                      <Chip label="Обрано" color="primary" size="small" />
                    )}
                  </Box>

                  {item.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  {/* Ціна та одиниця виміру */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <PriceIcon sx={{ fontSize: 18, mr: 0.5, color: 'success.main' }} />
                      <Typography variant="body1" fontWeight="bold" color="success.main">
                        {item.basePrice} грн
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      за {item.unit}
                    </Typography>
                  </Box>

                  {/* Код предмета */}
                  {item.code && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Код: {item.code}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}

      {/* Підказка */}
      {!loading && selectedItemId && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Предмет обрано! Натисніть &quot;Наступний крок&quot; для введення кількості.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
