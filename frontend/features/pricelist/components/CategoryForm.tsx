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
  CircularProgress
} from '@mui/material';
import { ServiceCategory } from '../types';

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (category: Partial<ServiceCategory>) => Promise<void>;
  category?: ServiceCategory;
  title: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  onSave,
  category,
  title
}) => {
  const [formData, setFormData] = useState<Partial<ServiceCategory>>({
    name: '',
    code: '',
    description: '',
    isActive: true // Змінили active на isActive для сумісності з бекендом
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        code: category.code || '',
        description: category.description || '',
        isActive: category.isActive !== undefined ? category.isActive : true // Змінили active на isActive
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        isActive: true // Змінили active на isActive
      });
    }
    setErrors({});
  }, [category, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'isActive' ? checked : value; // Змінили active на isActive
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Назва категорії є обов\'язковою';
    }
    
    if (!formData.code?.trim()) {
      newErrors.code = 'Код категорії є обов\'язковим';
    } else if (!/^[a-z0-9_]+$/.test(formData.code)) {
      newErrors.code = 'Код має містити лише малі літери, цифри та знак підкреслення';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Помилка при збереженні категорії:', error);
      // Можна додати обробку помилок від сервера тут
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            name="name"
            label="Назва категорії"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <TextField
            name="code"
            label="Код категорії"
            fullWidth
            margin="normal"
            value={formData.code}
            onChange={handleInputChange}
            error={!!errors.code}
            helperText={errors.code || 'Унікальний код без пробілів (напр: odiah, khimchistka_vzuttya)'}
            required
          />
          <TextField
            name="description"
            label="Опис категорії"
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
          <FormControlLabel
            control={
              <Switch
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
            }
            label="Активна категорія"
            sx={{ mt: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Скасувати
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryForm;
