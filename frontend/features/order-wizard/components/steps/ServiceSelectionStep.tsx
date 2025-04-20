'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useOrderWizardStore } from '../../store/orderWizardStore';
import { OrderService } from '../../types/order-wizard.types';
import { ServiceCategory } from '@/features/pricelist/types';
import { priceListApi } from '@/features/pricelist/api/priceListApi';
import { ServiceItemForm } from '@/features/order-wizard/components/forms/ServiceItemForm';

interface ServiceSelectionStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function ServiceSelectionStep({ onNext, onPrevious }: ServiceSelectionStepProps) {
  // Стан для категорій послуг
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Локальний стан для форми додавання послуги
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  
  // Отримання даних зі стору візарда
  const { services, client, addService, updateService, removeService, updatePrices } = useOrderWizardStore();
  
  // Завантаження категорій послуг при монтуванні компонента
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await priceListApi.getCategories();
        setCategories(data);
      } catch (err) {
        setError('Помилка при завантаженні категорій послуг');
        console.error('Помилка при завантаженні категорій послуг:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Обробники подій
  const handleAddService = () => {
    setEditingServiceIndex(null);
    setShowServiceForm(true);
  };
  
  const handleEditService = (index: number) => {
    setEditingServiceIndex(index);
    setShowServiceForm(true);
  };
  
  const handleRemoveService = (index: number) => {
    removeService(index);
  };
  
  const handleServiceFormSubmit = (service: OrderService) => {
    if (editingServiceIndex !== null) {
      updateService(editingServiceIndex, service);
    } else {
      addService(service);
    }
    
    // Оновлюємо ціни
    updatePrices();
    
    // Закриваємо форму
    setShowServiceForm(false);
    setEditingServiceIndex(null);
  };
  
  const handleServiceFormCancel = () => {
    setShowServiceForm(false);
    setEditingServiceIndex(null);
  };
  
  // Функція для форматування ціни
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2
    }).format(price);
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
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Вибір послуг для клієнта: {client?.firstName} {client?.lastName}
      </Typography>
      
      {showServiceForm ? (
        // Форма для додавання/редагування послуги
        <ServiceItemForm 
          categories={categories}
          onSubmit={handleServiceFormSubmit}
          onCancel={handleServiceFormCancel}
          initialData={editingServiceIndex !== null ? services[editingServiceIndex] : undefined}
        />
      ) : (
        // Список вибраних послуг та кнопка додавання
        <Box>
          <Grid container spacing={3}>
            <Grid size={12}>
              {services.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Ще не додано жодної послуги. Натисніть &quot;Додати послугу&quot;, щоб почати.
                </Alert>
              ) : (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Вибрані послуги
                    </Typography>
                    <List>
                      {services.map((service, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText 
                              primary={service.name}
                              secondary={
                                <Box>
                                  <Typography variant="body2">
                                    Кількість: {service.quantity} × {formatPrice(service.unitPrice)} = {formatPrice(service.totalPrice)}
                                  </Typography>
                                  {service.notes && (
                                    <Typography variant="body2" color="text.secondary">
                                      Примітки: {service.notes}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton 
                                edge="end" 
                                aria-label="edit"
                                onClick={() => handleEditService(index)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                aria-label="delete"
                                onClick={() => handleRemoveService(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < services.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
              
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={handleAddService}
                sx={{ mb: 3 }}
              >
                Додати послугу
              </Button>
            </Grid>
            
            {categories.length > 0 && !showServiceForm && (
              <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                  Каталог послуг
                </Typography>
                
                {categories.map((category) => (
                  <Accordion key={category.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{category.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {category.items?.map((item) => (
                          <ListItem key={item.id} onClick={() => {
                            // Заготовка для швидкого додавання послуги
                            // Буде реалізовано у Service Item Form
                          }}>
                            <ListItemText 
                              primary={item.name}
                              secondary={formatPrice(item.basePrice)}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>
            )}
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" onClick={onPrevious}>
              Назад
            </Button>
            <Button 
              variant="contained" 
              onClick={onNext}
              disabled={services.length === 0}
            >
              Далі
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
