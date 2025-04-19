import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  CircularProgress,
  MenuItem,
  InputAdornment,
  Typography
} from '@mui/material';
import { PriceListItem, ServiceCategory } from '../types';

interface PriceListItemFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: Partial<PriceListItem>) => Promise<void>;
  item?: PriceListItem;
  title: string;
  categories: ServiceCategory[];
  currentCategoryId?: string;
}

const PriceListItemForm: React.FC<PriceListItemFormProps> = ({
  open,
  onClose,
  onSave,
  item,
  title,
  categories,
  currentCategoryId
}) => {
  const [formData, setFormData] = useState<Partial<PriceListItem>>({
    name: '',
    unitOfMeasure: 'шт',
    basePrice: 0,
    priceBlack: null,
    priceColor: null,
    categoryId: currentCategoryId || '',
    catalogNumber: 1,
    active: true, // поле active з бекенду
    isActive: true  // залишаємо для сумісності
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        unitOfMeasure: item.unitOfMeasure || 'шт',
        basePrice: item.basePrice || 0,
        priceBlack: item.priceBlack || null,
        priceColor: item.priceColor || null,
        categoryId: item.categoryId || currentCategoryId || '',
        catalogNumber: item.catalogNumber || 1,
        // Використовуємо active, якщо воно доступне, або isActive як запасний варіант
        active: item.active !== undefined ? item.active : (item.isActive !== undefined ? item.isActive : true),
        isActive: item.isActive !== undefined ? item.isActive : (item.active !== undefined ? item.active : true)
      });
    } else {
      setFormData({
        name: '',
        unitOfMeasure: 'шт',
        basePrice: 0,
        priceBlack: null,
        priceColor: null,
        categoryId: currentCategoryId || '',
        catalogNumber: 1,
        active: true,   // поле active для бекенду
        isActive: true  // залишаємо для сумісності
      });
    }
    setErrors({});
  }, [item, open, currentCategoryId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    
    // Для цінових полів перетворюємо в числа
    if (['basePrice', 'priceBlack', 'priceColor'].includes(name)) {
      const numValue = value === '' ? (name === 'basePrice' ? 0 : null) : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Очищаємо помилки при редагуванні поля
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Валідація форми перед відправкою
   */
  const validateFormData = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Назва послуги обов\'язкова';
    }
    
    if (!formData.unitOfMeasure) {
      newErrors.unitOfMeasure = 'Одиниця виміру обов\'язкова';
    }
    
    if (!formData.catalogNumber || formData.catalogNumber <= 0) {
      newErrors.catalogNumber = 'Каталожний номер повинен бути додатним числом';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Категорія обов\'язково повинна бути вибрана';
    }
    
    if (formData.basePrice === undefined || formData.basePrice < 0) {
      newErrors.basePrice = 'Базова ціна не може бути від\'ємною';
    }
    
    if (formData.priceBlack !== null && formData.priceBlack !== undefined && formData.priceBlack < 0) {
      newErrors.priceBlack = 'Ціна за чорний колір не може бути від\'ємною';
    }
    
    if (formData.priceColor !== null && formData.priceColor !== undefined && formData.priceColor < 0) {
      newErrors.priceColor = 'Ціна за кольоровий не може бути від\'ємною';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFormData()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Дебуг відправки даних
      console.log('PriceListItemForm - saving item data:', formData);
      
      // Перевіряємо конвертацію типів даних, щоб уникнути проблем з JSON
      const preparedData = {
        ...formData,
        // Гарантуємо, що ціни будуть числовими
        basePrice: parseFloat(String(formData.basePrice || 0)),
        priceBlack: formData.priceBlack !== null ? parseFloat(String(formData.priceBlack)) : null,
        priceColor: formData.priceColor !== null ? parseFloat(String(formData.priceColor)) : null,
        // Обов'язково додаємо поле active для сервера
        active: Boolean(formData.active)
      };
      
      console.log('PriceListItemForm - prepared data to save:', preparedData);
      
      await onSave(preparedData);
      onClose();
    } catch (error) {
      console.error('Помилка при зберіганні елемента прайс-листа:', error);
    } finally {
      setLoading(false);
    }
  };

  // Одиниці виміру для послуг
  const unitOptions = ['шт', 'кг', 'м²', 'пара', 'компл.'];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {title}
        {loading && <CircularProgress size={24} style={{ marginLeft: 15 }} />}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              margin="dense"
              label="Каталожний №"
              name="catalogNumber"
              type="number"
              fullWidth
              value={formData.catalogNumber || ''}
              onChange={handleInputChange}
              error={!!errors.catalogNumber}
              helperText={errors.catalogNumber}
              inputProps={{ min: 1 }}
              sx={{ flex: 0.3 }}
            />
            <TextField
              id="category"
              select
              fullWidth
              margin="dense"
              label="Категорія"
              name="categoryId"
              value={formData.categoryId || ''}
              onChange={handleInputChange}
              error={!!errors.categoryId}
              helperText={errors.categoryId || 'Оберіть категорію послуги'}
              sx={{ flex: 1 }}
              disabled={!!currentCategoryId}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ mb: 2, mt: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle2" gutterBottom>
              Ідентифікатори
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1 }}>
              {item ? `ID: ${item.id}` : 'Нова позиція прайс-листа'}
            </Typography>
          </Box>

          <TextField
            name="name"
            label="Назва послуги"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="unitOfMeasure"
              label="Од. виміру"
              fullWidth
              margin="normal"
              value={formData.unitOfMeasure}
              onChange={handleInputChange}
              error={!!errors.unitOfMeasure}
              helperText={errors.unitOfMeasure || ''}
              required
              select
            >
              {unitOptions.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="basePrice"
              label="Базова ціна"
              type="number"
              fullWidth
              margin="normal"
              value={formData.basePrice}
              onChange={handleInputChange}
              error={!!errors.basePrice}
              helperText={errors.basePrice || ''}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">₴</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />

            <TextField
              name="priceBlack"
              label="Ціна (чорний)"
              type="number"
              fullWidth
              margin="normal"
              value={formData.priceBlack === null ? '' : formData.priceBlack}
              onChange={handleInputChange}
              error={!!errors.priceBlack}
              helperText={errors.priceBlack || ''}
              InputProps={{
                startAdornment: <InputAdornment position="start">₴</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />

            <TextField
              name="priceColor"
              label="Ціна (кольоровий)"
              type="number"
              fullWidth
              margin="normal"
              value={formData.priceColor === null ? '' : formData.priceColor}
              onChange={handleInputChange}
              error={!!errors.priceColor}
              helperText={errors.priceColor || ''}
              InputProps={{
                startAdornment: <InputAdornment position="start">₴</InputAdornment>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ p: 2, borderRadius: 1, bgcolor: formData.isActive ? 'success.light' : 'action.disabledBackground' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2">
                    {formData.active ? 'Активна позиція' : 'Неактивна позиція'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.active 
                      ? 'Цю позицію прайс-листа буде показано клієнтам' 
                      : 'Цю позицію прайс-листа будуть бачити тільки адміністратори'}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      name="active"
                      checked={formData.active || false}
                      onChange={(e) => {
                        // При зміні active оновлюємо також isActive для синхронізації
                        const { checked } = e.target;
                        setFormData(prev => ({ ...prev, active: checked, isActive: checked }));
                      }}
                      color="primary"
                    />
                  }
                  label=""
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            {item && (
              <Typography variant="caption" color="text.secondary">
                Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
              </Typography>
            )}
          </Box>
          <Box>
            <Button onClick={onClose} sx={{ mr: 1 }}>Скасувати</Button>
            <Button 
              onClick={() => handleSubmit()}
              variant="contained" 
              disabled={loading}
              color="primary"
            >
              Зберегти
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default PriceListItemForm;
