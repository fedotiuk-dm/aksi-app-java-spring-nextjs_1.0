'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Button,
  Grid
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { useListPriceListItems } from '@/shared/api/generated/priceList';
import { usePriceListStore } from '@/features/catalog';
import { PriceListItem } from './PriceListItem';
import { PriceListForm } from './PriceListForm';
import { 
  PriceListItemInfoCategoryCode,
} from '@/shared/api/generated/priceList';

const CATEGORY_LABELS: Record<PriceListItemInfoCategoryCode, string> = {
  [PriceListItemInfoCategoryCode.CLOTHING]: 'Одяг',
  [PriceListItemInfoCategoryCode.LAUNDRY]: 'Прання',
  [PriceListItemInfoCategoryCode.IRONING]: 'Прасування',
  [PriceListItemInfoCategoryCode.LEATHER]: 'Шкіра',
  [PriceListItemInfoCategoryCode.PADDING]: 'Пухові вироби',
  [PriceListItemInfoCategoryCode.FUR]: 'Хутро',
  [PriceListItemInfoCategoryCode.DYEING]: 'Фарбування',
  [PriceListItemInfoCategoryCode.ADDITIONAL_SERVICES]: 'Додаткові послуги',
};

export const PriceList: React.FC = () => {
  const {
    selectedCategory,
    searchQuery,
    activeOnly,
    setSelectedCategory,
    setSearchQuery,
    setActiveOnly,
    setFormOpen,
    getListParams,
  } = usePriceListStore();

  const { data, isLoading, error, refetch } = useListPriceListItems(getListParams());

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: PriceListItemInfoCategoryCode | 'all') => {
    setSelectedCategory(newValue === 'all' ? null : newValue);
  };

  const handleAddNew = () => {
    setFormOpen(true);
  };

  const filteredItems = React.useMemo(() => {
    if (!data?.priceListItems) return [];
    
    return data.priceListItems.filter(item => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.nameUa?.toLowerCase().includes(query) ||
          item.catalogNumber.toString().includes(query)
        );
      }
      return true;
    });
  }, [data?.priceListItems, searchQuery]);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Помилка завантаження прайс-листа: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Прайс-лист
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Управління послугами та цінами
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedCategory || 'all'} 
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Всі категорії" value="all" />
            {Object.entries(CATEGORY_LABELS).map(([code, label]) => (
              <Tab 
                key={code} 
                label={label} 
                value={code as PriceListItemInfoCategoryCode}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Пошук за назвою або номером..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={activeOnly}
                    onChange={(e) => setActiveOnly(e.target.checked)}
                  />
                }
                label="Тільки активні"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 5 }} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddNew}
              >
                Додати послугу
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Не знайдено жодної послуги
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredItems.map((item) => (
            <PriceListItem 
              key={item.id} 
              item={item} 
              onRefetch={refetch}
            />
          ))}
        </Box>
      )}

      <PriceListForm onSuccess={refetch} />
    </Container>
  );
};