import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Box,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PriceListTable from './PriceListTable';
import { ServiceCategory } from '../types';

interface PriceListCategoriesProps {
  categories: ServiceCategory[];
  loading: boolean;
  error: string | null;
}

const PriceListCategories: React.FC<PriceListCategoriesProps> = ({ 
  categories, 
  loading, 
  error 
}) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (
    _event: React.SyntheticEvent, 
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
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

  if (!categories || categories.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Прайс-лист порожній або ще не завантажений
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Прайс-лист послуг
      </Typography>
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
            <Typography variant="h6">{category.name}</Typography>
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
            <PriceListTable 
              categoryName={category.name} 
              items={category.items} 
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default PriceListCategories;
