'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  FormHelperText,
  Grid,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Checkbox,
  InputAdornment
} from '@mui/material';
import { OrderService } from '../../types/order-wizard.types';
import { ServiceCategory, PriceListItem } from '@/features/pricelist/types';

interface ServiceItemFormProps {
  categories: ServiceCategory[];
  onSubmit: (serviceData: OrderService) => void;
  onCancel: () => void;
  initialData?: OrderService;
}

export function ServiceItemForm({ 
  categories, 
  onSubmit, 
  onCancel,
  initialData
}: ServiceItemFormProps) {
  // Стан для вибраної категорії та послуги
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  
  // Стан для даних форми
  const [quantity, setQuantity] = useState<number>(1);
  const [material, setMaterial] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Додаткові параметри
  const [heavilySoiled, setHeavilySoiled] = useState<boolean>(false);
  const [manualCleaning, setManualCleaning] = useState<boolean>(false);
  const [childSized, setChildSized] = useState<boolean>(false);
  
  // Стан для валідації
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Допоміжні змінні
  const [items, setItems] = useState<PriceListItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PriceListItem | null>(null);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  // Ініціалізація форми при наявності початкових даних
  useEffect(() => {
    if (initialData) {
      // Заповнюємо форму наявними даними
      const categoryId = initialData.serviceCategoryId;
      const itemId = initialData.priceListItemId;
      
      if (categoryId) {
        setSelectedCategoryId(categoryId);
        
        // Знаходимо категорію
        const category = categories.find(cat => cat.id === categoryId);
        if (category && category.items) {
          setItems(category.items);
          
          // Знаходимо елемент прайс-листа
          if (itemId) {
            setSelectedItemId(itemId);
            const item = category.items.find(item => item.id === itemId);
            if (item) {
              setSelectedItem(item);
              setUnitPrice(item.basePrice);
            }
          }
        }
      }
      
      // Заповнюємо решту полів
      setQuantity(initialData.quantity);
      setMaterial(initialData.params.material as string || '');
      setColor(initialData.params.color as string || '');
      setNotes(initialData.notes || '');
      setHeavilySoiled(initialData.params.heavilySoiled as boolean || false);
      setManualCleaning(initialData.params.manualCleaning as boolean || false);
      setChildSized(initialData.params.childSized as boolean || false);
      
      // Встановлюємо ціни
      setUnitPrice(initialData.unitPrice);
      setTotalPrice(initialData.totalPrice);
    }
  }, [initialData, categories]);
  
  // Обробка зміни категорії
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedItemId('');
    setSelectedItem(null);
    setUnitPrice(0);
    
    // Знаходимо елементи вибраної категорії
    const category = categories.find(cat => cat.id === categoryId);
    if (category && category.items) {
      setItems(category.items);
    } else {
      setItems([]);
    }
    
    // Очищаємо помилку категорії
    if (errors.categoryId) {
      setErrors(prev => ({ ...prev, categoryId: '' }));
    }
  };
  
  // Обробка зміни елемента прайс-листа
  const handleItemChange = (itemId: string) => {
    setSelectedItemId(itemId);
    
    // Знаходимо вибраний елемент
    const item = items.find(item => item.id === itemId);
    if (item) {
      setSelectedItem(item);
      setUnitPrice(item.basePrice);
      
      // Перераховуємо загальну ціну
      updatePrice(item.basePrice, quantity);
    } else {
      setSelectedItem(null);
      setUnitPrice(0);
      setTotalPrice(0);
    }
    
    // Очищаємо помилку елемента
    if (errors.itemId) {
      setErrors(prev => ({ ...prev, itemId: '' }));
    }
  };
  
  // Обробка зміни кількості
  const handleQuantityChange = (value: string) => {
    const newQuantity = parseFloat(value) || 0;
    setQuantity(newQuantity);
    
    // Перераховуємо загальну ціну
    updatePrice(unitPrice, newQuantity);
    
    // Очищаємо помилку кількості
    if (errors.quantity) {
      setErrors(prev => ({ ...prev, quantity: '' }));
    }
  };
  
  // Оновлення ціни з урахуванням параметрів
  const updatePrice = (basePrice: number, qty: number) => {
    let finalUnitPrice = basePrice;
    
    // Застосовуємо модифікатори ціни
    if (heavilySoiled) finalUnitPrice *= 1.3; // +30%
    if (manualCleaning) finalUnitPrice *= 1.5; // +50%
    if (childSized) finalUnitPrice *= 0.7; // -30%
    
    // Розраховуємо загальну ціну
    const total = finalUnitPrice * qty;
    
    setUnitPrice(finalUnitPrice);
    setTotalPrice(total);
  };
  
  // Валідація форми
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedCategoryId) {
      newErrors.categoryId = 'Виберіть категорію послуги';
    }
    
    if (!selectedItemId) {
      newErrors.itemId = 'Виберіть послугу';
    }
    
    if (!quantity || quantity <= 0) {
      newErrors.quantity = 'Вкажіть коректну кількість';
    }
    
    if (!material) {
      newErrors.material = 'Вкажіть матеріал';
    }
    
    if (!color) {
      newErrors.color = 'Вкажіть колір';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Обробка відправки форми
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    // Створюємо об'єкт даних послуги
    const serviceData: OrderService = {
      serviceCategoryId: selectedCategoryId,
      priceListItemId: selectedItemId,
      name: selectedItem?.name || '',
      quantity,
      unitPrice,
      totalPrice,
      params: {
        material,
        color,
        heavilySoiled,
        manualCleaning,
        childSized
      },
      notes
    };
    
    // Відправляємо дані
    onSubmit(serviceData);
  };
  
  // Форматування ціни
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Редагування послуги' : 'Додавання нової послуги'}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={6}>
          <FormControl fullWidth error={!!errors.categoryId} sx={{ mb: 2 }}>
            <InputLabel id="category-select-label">Категорія послуги</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              label="Категорія послуги"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
          </FormControl>
          
          <FormControl fullWidth error={!!errors.itemId} sx={{ mb: 2 }}>
            <InputLabel id="item-select-label">Послуга</InputLabel>
            <Select
              labelId="item-select-label"
              value={selectedItemId}
              onChange={(e) => handleItemChange(e.target.value)}
              label="Послуга"
              disabled={!selectedCategoryId}
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name} - {formatPrice(item.basePrice)}
                </MenuItem>
              ))}
            </Select>
            {errors.itemId && <FormHelperText>{errors.itemId}</FormHelperText>}
          </FormControl>
          
          <TextField
            label="Кількість"
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            error={!!errors.quantity}
            helperText={errors.quantity}
            InputProps={{
              inputProps: { min: 0.1, step: 0.1 },
              endAdornment: selectedItem && (
                <InputAdornment position="end">
                  {selectedItem.unitOfMeasure === 'kg' ? 'кг' : 'шт'}
                </InputAdornment>
              )
            }}
          />
        </Grid>
        
        <Grid size={6}>
          <TextField
            label="Матеріал"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            error={!!errors.material}
            helperText={errors.material}
          />
          
          <TextField
            label="Колір"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            error={!!errors.color}
            helperText={errors.color}
          />
          
          <TextField
            label="Примітки"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
        </Grid>
        
        <Grid size={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Додаткові параметри
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={4}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={heavilySoiled} 
                        onChange={(e) => {
                          setHeavilySoiled(e.target.checked);
                          updatePrice(selectedItem?.basePrice || 0, quantity);
                        }}
                      />
                    }
                    label="Сильні забруднення (+30%)"
                  />
                </Grid>
                
                <Grid size={4}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={manualCleaning} 
                        onChange={(e) => {
                          setManualCleaning(e.target.checked);
                          updatePrice(selectedItem?.basePrice || 0, quantity);
                        }}
                      />
                    }
                    label="Ручне чищення (+50%)"
                  />
                </Grid>
                
                <Grid size={4}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={childSized} 
                        onChange={(e) => {
                          setChildSized(e.target.checked);
                          updatePrice(selectedItem?.basePrice || 0, quantity);
                        }}
                      />
                    }
                    label="Дитячий розмір (-30%)"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={12}>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1">
                Ціна за одиницю: {formatPrice(unitPrice)}
              </Typography>
              <Typography variant="h6">
                Загальна вартість: {formatPrice(totalPrice)}
              </Typography>
            </Box>
            
            <Box>
              <Button 
                variant="outlined" 
                onClick={onCancel}
                sx={{ mr: 1 }}
              >
                Скасувати
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
              >
                {initialData ? 'Зберегти зміни' : 'Додати послугу'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
