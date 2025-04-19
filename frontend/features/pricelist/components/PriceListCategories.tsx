import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Box,
  Container,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PriceListTable from './PriceListTable';
import CategoryForm from './CategoryForm';
import PriceListItemForm from './PriceListItemForm';
import { ServiceCategory, PriceListItem } from '../types';

interface PriceListCategoriesProps {
  categories: ServiceCategory[];
  loading: boolean;
  error: string | null;
  onCreateCategory?: (category: Partial<ServiceCategory>) => Promise<void>;
  onUpdateCategory?: (categoryId: string, category: Partial<ServiceCategory>) => Promise<void>;
  onCreateItem?: (categoryId: string, item: Partial<PriceListItem>) => Promise<void>;
  onUpdateItem?: (itemId: string, item: Partial<PriceListItem>) => Promise<void>;
}

const PriceListCategories: React.FC<PriceListCategoriesProps> = ({ 
  categories, 
  loading, 
  error,
  onCreateCategory,
  onUpdateCategory,
  onCreateItem,
  onUpdateItem
}) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | undefined>(undefined);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string>('');

  const handleChange = (panel: string) => (
    _event: React.SyntheticEvent, 
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Функція для відкриття форми створення нової категорії
  const handleOpenNewCategoryForm = () => {
    setEditingCategory(undefined);
    setIsCategoryFormOpen(true);
  };

  // Функція для відкриття форми редагування категорії
  const handleEditCategory = (category: ServiceCategory) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  // Функція для збереження категорії
  const handleSaveCategory = async (categoryData: Partial<ServiceCategory>) => {
    try {
      if (editingCategory) {
        // Оновлюємо існуючу категорію
        if (onUpdateCategory) {
          await onUpdateCategory(editingCategory.id, categoryData);
        }
      } else {
        // Створюємо нову категорію
        if (onCreateCategory) {
          await onCreateCategory(categoryData);
        }
      }
      setIsCategoryFormOpen(false);
    } catch (error) {
      console.error('Помилка при збереженні категорії:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Помилка завантаження прайс-листа: {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4, position: 'relative' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Прайс-лист послуг
        </Typography>
        
        {onCreateCategory && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleOpenNewCategoryForm}
          >
            Додати категорію
          </Button>
        )}
      </Box>
      
      {/* Форма для створення/редагування категорії */}
      {isCategoryFormOpen && (
        <CategoryForm
          open={isCategoryFormOpen}
          onClose={() => setIsCategoryFormOpen(false)}
          onSave={handleSaveCategory}
          category={editingCategory}
          title={editingCategory ? 'Редагувати категорію' : 'Створити нову категорію'}
        />
      )}
      
      {/* Форма для створення нового елемента прайс-листа */}
      {isItemFormOpen && onCreateItem && (
        <PriceListItemForm
          open={isItemFormOpen}
          onClose={() => setIsItemFormOpen(false)}
          onSave={async (itemData) => {
            try {
              if (onCreateItem) {
                await onCreateItem(currentCategoryId, itemData);
              }
              setIsItemFormOpen(false);
            } catch (error) {
              console.error('Помилка при створенні позиції прайс-листа:', error);
            }
          }}
          title="Створити нову позицію прайс-листа"
          categories={categories}
          currentCategoryId={currentCategoryId}
        />
      )}
      
      {!categories || categories.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Прайс-лист порожній. Створіть вашу першу категорію послуг натиснувши кнопку &quot;Додати категорію&quot;.
        </Alert>
      ) : (
        <>
          <Box my={3}>
            <Typography variant="body1" color="text.secondary" paragraph>
              Повний прайс-лист послуг хімчистки. Ціни вказані у гривнях за одиницю виміру.
              Для отримання детальної інформації розгорніть відповідну категорію.
            </Typography>
          </Box>
          
          {categories.map((category) => (
            <Accordion 
              key={category.id}
              expanded={expanded === category.id}
              onChange={handleChange(category.id)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${category.id}-content`}
                id={`${category.id}-header`}
              >
                <Box display="flex" alignItems="center" width="100%" pr={2}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>{category.name}</Typography>
                  
                  {onUpdateCategory && (
                    <Tooltip title="Редагувати категорію">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={(e) => {
                          e.stopPropagation(); // Зупиняємо подію кліку, щоб не згортати/розгорнути акордеон
                          handleEditCategory(category);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {category.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph
                  >
                    {category.description}
                  </Typography>
                )}
                
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  {onCreateItem && (
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setCurrentCategoryId(category.id);
                        setIsItemFormOpen(true);
                      }}
                    >
                      Додати позицію
                    </Button>
                  )}
                </Box>
                
                <PriceListTable 
                  categoryName={category.name} 
                  items={category.items}
                  onUpdateItem={onUpdateItem}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}
    </Container>
  );
};

export default PriceListCategories;
