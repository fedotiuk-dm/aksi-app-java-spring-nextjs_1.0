'use client';

/**
 * @fileoverview Фільтри для каталогу
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Divider,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
} from '@mui/icons-material';
import React, { useState } from 'react';
import {
  useCatalogStore,
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_NAMES,
  ITEM_CATEGORIES,
  ITEM_CATEGORY_NAMES,
  PRICE_LIST_CATEGORIES,
  PRICE_LIST_CATEGORY_NAMES,
} from '@/features/catalog';

type FilterMode = 'services' | 'items' | 'priceList' | 'serviceItems';

interface CatalogFiltersProps {
  mode: FilterMode;
  onSearch?: (query: string) => void;
}

export const CatalogFilters = ({ mode, onSearch }: CatalogFiltersProps) => {
  const { filters, setFilters, resetFilters } = useCatalogStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
    setFilters({ [key]: value });
  };

  const handleReset = () => {
    resetFilters();
    setSearchQuery('');
    onSearch?.('');
  };

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (!filters.activeOnly) count++;
    if (filters.serviceCategory) count++;
    if (filters.itemCategory) count++;
    if (filters.priceListCategory) count++;
    if (searchQuery) count++;
    return count;
  };

  const renderCategoryFilter = () => {
    switch (mode) {
      case 'services':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>Категорія послуг</InputLabel>
            <Select
              value={filters.serviceCategory || ''}
              label="Категорія послуг"
              onChange={(e) => handleFilterChange('serviceCategory', e.target.value || undefined)}
            >
              <MenuItem value="">Всі категорії</MenuItem>
              {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {SERVICE_CATEGORY_NAMES[value]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'items':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>Категорія товарів</InputLabel>
            <Select
              value={filters.itemCategory || ''}
              label="Категорія товарів"
              onChange={(e) => handleFilterChange('itemCategory', e.target.value || undefined)}
            >
              <MenuItem value="">Всі категорії</MenuItem>
              {Object.entries(ITEM_CATEGORIES).map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {ITEM_CATEGORY_NAMES[value]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'priceList':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>Категорія прайс-листа</InputLabel>
            <Select
              value={filters.priceListCategory || ''}
              label="Категорія прайс-листа"
              onChange={(e) => handleFilterChange('priceListCategory', e.target.value || undefined)}
            >
              <MenuItem value="">Всі категорії</MenuItem>
              {Object.entries(PRICE_LIST_CATEGORIES).map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {PRICE_LIST_CATEGORY_NAMES[value]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      default:
        return null;
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'services': return 'Фільтри послуг';
      case 'items': return 'Фільтри товарів';
      case 'priceList': return 'Фільтри прайс-листа';
      case 'serviceItems': return 'Фільтри комбінацій';
      default: return 'Фільтри';
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} />
            {getModeTitle()}
            {getActiveFiltersCount() > 0 && (
              <Chip 
                label={getActiveFiltersCount()} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }} 
              />
            )}
          </Typography>
          
          <Button
            startIcon={<Clear />}
            onClick={handleReset}
            size="small"
            disabled={getActiveFiltersCount() === 0}
          >
            Очистити
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
          {/* Пошук */}
          {onSearch && (
            <Box sx={{ minWidth: 250, flexGrow: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Пошук"
                placeholder={`Шукати ${mode === 'services' ? 'послуги' : mode === 'items' ? 'товари' : 'елементи'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={handleSearch}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        Шукати
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {/* Категорія */}
          <Box sx={{ minWidth: 200 }}>
            {renderCategoryFilter()}
          </Box>

          {/* Статус активності */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.activeOnly}
                  onChange={(e) => handleFilterChange('activeOnly', e.target.checked)}
                  size="small"
                />
              }
              label="Тільки активні"
            />
          </Box>
        </Box>

        {/* Активні фільтри */}
        {getActiveFiltersCount() > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Активні фільтри:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {!filters.activeOnly && (
                  <Chip
                    label="Включаючи неактивні"
                    size="small"
                    variant="outlined"
                    onDelete={() => handleFilterChange('activeOnly', true)}
                  />
                )}
                {filters.serviceCategory && (
                  <Chip
                    label={`Категорія: ${SERVICE_CATEGORY_NAMES[filters.serviceCategory]}`}
                    size="small"
                    variant="outlined"
                    onDelete={() => handleFilterChange('serviceCategory', undefined)}
                  />
                )}
                {filters.itemCategory && (
                  <Chip
                    label={`Категорія: ${ITEM_CATEGORY_NAMES[filters.itemCategory]}`}
                    size="small"
                    variant="outlined"
                    onDelete={() => handleFilterChange('itemCategory', undefined)}
                  />
                )}
                {filters.priceListCategory && (
                  <Chip
                    label={`Категорія: ${PRICE_LIST_CATEGORY_NAMES[filters.priceListCategory]}`}
                    size="small"
                    variant="outlined"
                    onDelete={() => handleFilterChange('priceListCategory', undefined)}
                  />
                )}
                {searchQuery && (
                  <Chip
                    label={`Пошук: "${searchQuery}"`}
                    size="small"
                    variant="outlined"
                    onDelete={() => {
                      setSearchQuery('');
                      onSearch?.('');
                    }}
                  />
                )}
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};