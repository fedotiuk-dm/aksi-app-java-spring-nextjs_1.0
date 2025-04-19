'use client';

import { Box, Container, Paper, Typography, Button, Stack } from '@mui/material';
import PriceListCategories from './PriceListCategories';
import { usePriceList } from '../hooks/usePriceList';
import { ServiceCategory, PriceListItem } from '../types';

/**
 * Компонент відображення прайс-листа з категоріями послуг
 */
export function PriceList() {
  const { 
    categories, 
    loading, 
    error, 
    createCategory, 
    updateCategory, 
    createPriceListItem, 
    updatePriceListItem 
  } = usePriceList();

  // Функції-обгортки для адаптації типів між API та компонентами
  const handleCreateCategory = async (categoryData: Partial<ServiceCategory>) => {
    await createCategory(categoryData);
  };

  const handleUpdateCategory = async (categoryId: string, categoryData: Partial<ServiceCategory>) => {
    await updateCategory(categoryId, categoryData);
  };

  const handleCreateItem = async (categoryId: string, itemData: Partial<PriceListItem>) => {
    await createPriceListItem(categoryId, itemData);
  };

  const handleUpdateItem = async (itemId: string, itemData: Partial<PriceListItem>) => {
    await updatePriceListItem(itemId, itemData);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Прайс-лист
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              const categoriesElement = document.getElementById('price-list-categories');
              if (categoriesElement) {
                categoriesElement.scrollIntoView({ behavior: 'smooth' });
                // Якщо немає категорій, то імітуємо натискання на кнопку "Додати категорію"
                if (!categories || categories.length === 0) {
                  const addCategoryButton = document.querySelector('[title="Створити нову категорію послуг"]');
                  if (addCategoryButton instanceof HTMLElement) {
                    addCategoryButton.click();
                  }
                }
              }
            }}
          >
            Створити прайс-лист
          </Button>
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Актуальні ціни на послуги нашої хімчистки
        </Typography>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3 }} id="price-list-categories">
        <PriceListCategories
          categories={categories}
          loading={loading}
          error={error}
          onCreateCategory={handleCreateCategory}
          onUpdateCategory={handleUpdateCategory}
          onCreateItem={handleCreateItem}
          onUpdateItem={handleUpdateItem}
        />
      </Paper>
    </Container>
  );
}
