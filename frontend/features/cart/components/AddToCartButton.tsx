'use client';

import React from 'react';
import {
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
} from '@mui/material';
import {
  AddShoppingCart,
  Close,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { PriceListItemInfo } from '@/shared/api/generated/priceList';
import { useAddCartItem } from '@/shared/api/generated/cart';
import { useCartStore } from '@/features/cart';
import { formatPrice } from '@/shared/lib/utils/format';

interface AddToCartButtonProps {
  item: PriceListItemInfo;
  variant?: 'button' | 'icon';
  size?: 'small' | 'medium' | 'large';
}

// Енуми для характеристик речей
const COLORS = [
  'Білий', 'Чорний', 'Червоний', 'Синій', 'Зелений', 'Жовтий', 
  'Сірий', 'Коричневий', 'Рожевий', 'Фіолетовий', 'Помаранчевий', 'Інший'
];

const MATERIALS = [
  'Бавовна', 'Льон', 'Шовк', 'Вовна', 'Синтетика', 
  'Шкіра', 'Замша', 'Хутро', 'Джинс', 'Трикотаж', 'Інше'
];


const DAMAGE_LABELS = {
  NONE: 'Без пошкоджень',
  MINOR: 'Незначні пошкодження', 
  MODERATE: 'Помірні пошкодження',
  SEVERE: 'Значні пошкодження',
};

const formSchema = z.object({
  quantity: z.number().min(1, 'Мінімальна кількість 1'),
  color: z.string().optional(),
  material: z.string().optional(),
  brand: z.string().optional(),
  size: z.string().optional(),
  damageSeverity: z.enum(['NONE', 'MINOR', 'MODERATE', 'SEVERE']),
  damageDescription: z.string().optional(),
  notes: z.string().optional(),
});

type CartFormData = z.infer<typeof formSchema>;

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  item, 
  variant = 'button',
  size = 'medium' 
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { selectedCustomer, hasSelectedCustomer, openCart } = useCartStore();
  const addItemMutation = useAddCartItem();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CartFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      color: '',
      material: '',
      brand: '',
      size: '',
      damageSeverity: 'NONE',
      damageDescription: '',
      notes: '',
    },
  });

  const handleOpenModal = () => {
    if (!hasSelectedCustomer()) {
      alert('Спочатку оберіть клієнта в корзині');
      openCart();
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = async (data: CartFormData) => {
    if (!selectedCustomer) return;

    try {
      const characteristics = {
        color: data.color || undefined,
        material: data.material || undefined,
        brand: data.brand || undefined,
        size: data.size || undefined,
        damageSeverity: data.damageSeverity,
        damageDescription: data.damageDescription || undefined,
        notes: data.notes || undefined,
      };

      await addItemMutation.mutateAsync({
        data: {
          priceListItemId: item.id,
          quantity: data.quantity,
          characteristics,
          modifierCodes: [], // Поки порожньо, модифікатори можна додати пізніше
        }
      });

      handleCloseModal();
      openCart(); // Відкрити корзину після додавання
    } catch (error: any) {
      console.error('Помилка додавання до корзини:', error);
      // Можна показати toast або Alert
    }
  };

  const ButtonComponent = variant === 'icon' ? (
    <Tooltip title="Додати до корзини">
      <IconButton 
        size={size}
        onClick={handleOpenModal}
        color="primary"
      >
        <AddShoppingCart />
      </IconButton>
    </Tooltip>
  ) : (
    <Button
      variant="contained"
      size={size}
      startIcon={<AddShoppingCart />}
      onClick={handleOpenModal}
      fullWidth
    >
      До корзини
    </Button>
  );

  return (
    <>
      {ButtonComponent}

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                Додати до корзини
              </Typography>
              <IconButton onClick={handleCloseModal}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={3}>
              {/* Service Info */}
              <Alert severity="info">
                <Typography variant="subtitle2">
                  {item.nameUa || item.name}
                </Typography>
                <Typography variant="body2">
                  Базова ціна: {formatPrice(item.basePrice)}
                  {item.priceBlack && ` • Чорне: ${formatPrice(item.priceBlack)}`}
                  {item.priceColor && ` • Кольорове: ${formatPrice(item.priceColor)}`}
                </Typography>
              </Alert>

              <Grid container spacing={2}>
                {/* Quantity */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Кількість"
                        type="number"
                        error={!!errors.quantity}
                        helperText={errors.quantity?.message}
                        onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                        slotProps={{ htmlInput: { min: 1 } }}
                      />
                    )}
                  />
                </Grid>

                {/* Color */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="color"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Колір</InputLabel>
                        <Select {...field} label="Колір">
                          <MenuItem value="">Не вказано</MenuItem>
                          {COLORS.map((color) => (
                            <MenuItem key={color} value={color}>
                              {color}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Material */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="material"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Матеріал</InputLabel>
                        <Select {...field} label="Матеріал">
                          <MenuItem value="">Не вказано</MenuItem>
                          {MATERIALS.map((material) => (
                            <MenuItem key={material} value={material}>
                              {material}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Brand */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Бренд"
                      />
                    )}
                  />
                </Grid>

                {/* Size */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="size"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Розмір"
                      />
                    )}
                  />
                </Grid>

                {/* Damage Severity */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="damageSeverity"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Пошкодження</InputLabel>
                        <Select {...field} label="Пошкодження">
                          {Object.entries(DAMAGE_LABELS).map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                              {label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Damage Description */}
                <Grid size={12}>
                  <Controller
                    name="damageDescription"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Опис пошкоджень"
                        multiline
                        rows={2}
                      />
                    )}
                  />
                </Grid>

                {/* Notes */}
                <Grid size={12}>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Додаткові примітки"
                        multiline
                        rows={2}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseModal}>
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={addItemMutation.isPending}
            >
              Додати до корзини
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};