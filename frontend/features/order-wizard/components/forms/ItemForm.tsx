'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  PhotoCamera,
  Save,
  Close,
} from '@mui/icons-material';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useListPriceListItems } from '@/shared/api/generated/priceList';
import type {
  PriceListItemInfo,
  PriceListItemInfoCategoryCode,
} from '@/shared/api/generated/priceList';
import type {
  ItemStainType,
  ItemDefectType,
} from '@/shared/api/generated/cart';

interface ItemFormProps {
  onCloseAction: () => void;
  itemId?: string | null;
}

// Category labels
const CATEGORY_LABELS: Record<PriceListItemInfoCategoryCode, string> = {
  CLOTHING: 'Чистка одягу та текстилю',
  LAUNDRY: 'Прання білизни',
  IRONING: 'Прасування',
  LEATHER: 'Чистка та відновлення шкіряних виробів',
  PADDING: 'Дублянки',
  FUR: 'Вироби із натурального хутра',
  DYEING: 'Фарбування текстильних виробів',
  ADDITIONAL_SERVICES: 'Додаткові послуги',
};

// Materials by category
const MATERIALS_BY_CATEGORY: Record<string, string[]> = {
  CLOTHING: ['Бавовна', 'Шерсть', 'Шовк', 'Синтетика'],
  LEATHER: ['Гладка шкіра', 'Нубук', 'Спілок', 'Замша'],
  PADDING: ['Натуральна шкіра', 'Штучна шкіра'],
  FUR: ['Натуральне хутро', 'Штучне хутро'],
};

// Common colors
const COMMON_COLORS = [
  'Чорний', 'Білий', 'Сірий', 'Коричневий', 'Бежевий',
  'Червоний', 'Синій', 'Зелений', 'Жовтий', 'Помаранчевий',
];

// Stains
const STAINS = [
  'Жир', 'Кров', 'Білок', 'Вино', 'Кава',
  'Трава', 'Чорнило', 'Косметика',
];

// Defects and risks
const DEFECTS = [
  'Потертості', 'Порване', 'Відсутність фурнітури',
  'Пошкодження фурнітури', 'Ризики зміни кольору',
  'Ризики деформації', 'Без гарантій',
];

// Modifiers
const GENERAL_MODIFIERS = [
  { code: 'CHILD', label: 'Дитячі речі (до 30 розміру)', value: '-30%' },
  { code: 'MANUAL', label: 'Ручна чистка', value: '+20%' },
  { code: 'DIRTY', label: 'Дуже забруднені речі', value: '+20-100%' },
  { code: 'URGENT', label: 'Термінова чистка', value: '+50-100%' },
];

const TEXTILE_MODIFIERS = [
  { code: 'FUR_COLLAR', label: 'З хутряними комірами та манжетами', value: '+30%' },
  { code: 'WATERPROOF', label: 'Водовідштовхуюче покриття', value: '+30%' },
  { code: 'SILK', label: 'Натуральний шовк, атлас, шифон', value: '+50%' },
  { code: 'COMBINED', label: 'Комбіновані вироби (шкіра+текстиль)', value: '+100%' },
  { code: 'TOYS', label: 'Великі м\'які іграшки', value: '+100%' },
  { code: 'BUTTONS', label: 'Пришивання гудзиків', value: 'фікс.' },
  { code: 'BW_COLOR', label: 'Чорний та світлі тони', value: '+20%' },
  { code: 'WEDDING', label: 'Весільна сукня зі шлейфом', value: '+30%' },
];

const LEATHER_MODIFIERS = [
  { code: 'IRON', label: 'Прасування шкіряних виробів', value: '70%' },
  { code: 'WATERPROOF', label: 'Водовідштовхуюче покриття', value: '+30%' },
  { code: 'DYE_AFTER', label: 'Фарбування (після нашої чистки)', value: '+50%' },
  { code: 'DYE_BEFORE', label: 'Фарбування (після чистки деінде)', value: '100%' },
  { code: 'INSERTS', label: 'Шкіряні вироби із вставками', value: '+30%' },
  { code: 'PEARL', label: 'Перламутрове покриття', value: '+30%' },
  { code: 'PADDING_FUR', label: 'Дублянки на штучному хутрі', value: '-20%' },
  { code: 'MANUAL', label: 'Ручна чистка виробів зі шкіри', value: '+30%' },
];

export const ItemForm: React.FC<ItemFormProps> = ({ onCloseAction, itemId }) => {
  const {
    itemForm,
    updateItemForm,
    resetItemForm,
  } = useOrderWizardStore();

  const [selectedCategory, setSelectedCategory] = useState<PriceListItemInfoCategoryCode | ''>('');
  const [customColor, setCustomColor] = useState('');

  // Get price list items for selected category
  const { data: priceListData } = useListPriceListItems(
    selectedCategory ? { categoryCode: selectedCategory as any } : {},
    {
      query: {
        enabled: !!selectedCategory,
      },
    }
  );

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const category = event.target.value as PriceListItemInfoCategoryCode;
    setSelectedCategory(category);
    updateItemForm({
      serviceCategory: category,
      selectedService: null,
      priceListItemId: '',
    });
  };

  const handleServiceSelect = (service: PriceListItemInfo) => {
    updateItemForm({
      selectedService: service,
      priceListItemId: service.id,
    });
  };

  const handleStainToggle = (stain: string) => {
    const currentStains = itemForm.stains;
    const stainIndex = currentStains.findIndex(s => s.type === stain);
    
    if (stainIndex >= 0) {
      updateItemForm({
        stains: currentStains.filter((_, index) => index !== stainIndex),
      });
    } else {
      updateItemForm({
        stains: [...currentStains, { type: stain as ItemStainType, description: stain }],
      });
    }
  };

  const handleDefectToggle = (defect: string) => {
    const currentDefects = itemForm.defects;
    const defectIndex = currentDefects.findIndex(d => d.type === defect);
    
    if (defectIndex >= 0) {
      updateItemForm({
        defects: currentDefects.filter((_, index) => index !== defectIndex),
      });
    } else {
      updateItemForm({
        defects: [...currentDefects, { type: defect as ItemDefectType, description: defect }],
      });
    }
  };

  const handleModifierToggle = (modifierCode: string) => {
    const currentModifiers = itemForm.modifierCodes;
    const index = currentModifiers.indexOf(modifierCode);
    
    if (index >= 0) {
      updateItemForm({
        modifierCodes: currentModifiers.filter(code => code !== modifierCode),
      });
    } else {
      updateItemForm({
        modifierCodes: [...currentModifiers, modifierCode],
      });
    }
  };

  const handleSave = async () => {
    const {
      addItemToCartAPI,
      updateCartItemAPI,
      resetItemForm
    } = useOrderWizardStore.getState();
    
    try {
      if (itemId) {
        // Update existing item
        await updateCartItemAPI(itemId, itemForm);
      } else {
        // Add new item
        await addItemToCartAPI(itemForm);
      }
      
      resetItemForm();
      onCloseAction();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleCancel = () => {
    resetItemForm();
    onCloseAction();
  };

  // Get available materials for selected category
  const availableMaterials = selectedCategory ? MATERIALS_BY_CATEGORY[selectedCategory] || [] : [];

  // Get available modifiers based on category
  const availableModifiers = [
    ...GENERAL_MODIFIERS,
    ...(selectedCategory === 'CLOTHING' || selectedCategory === 'LAUNDRY' ? TEXTILE_MODIFIERS : []),
    ...(selectedCategory === 'LEATHER' || selectedCategory === 'PADDING' ? LEATHER_MODIFIERS : []),
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {itemId ? 'Редагувати предмет' : 'Додати предмет'}
        </Typography>
        <IconButton onClick={onCloseAction}>
          <Close />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {/* Category Selection */}
        <Grid size={12}>
          <FormControl fullWidth required>
            <FormLabel>Категорія послуги</FormLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <MenuItem value="">Виберіть категорію</MenuItem>
              {Object.entries(CATEGORY_LABELS).map(([code, label]) => (
                <MenuItem key={code} value={code}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Service Selection */}
        {selectedCategory && priceListData?.priceListItems && (
          <Grid size={12}>
            <Typography variant="subtitle2" gutterBottom>
              Найменування виробу
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {priceListData.priceListItems.map((item) => (
                <Chip
                  key={item.id}
                  label={`${item.nameUa || item.name} - ${(item.basePrice / 100).toFixed(2)}₴`}
                  onClick={() => handleServiceSelect(item)}
                  color={itemForm.priceListItemId === item.id ? 'primary' : 'default'}
                  variant={itemForm.priceListItemId === item.id ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>
        )}

        {/* Quantity */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Кількість"
            type="number"
            value={itemForm.quantity}
            onChange={(e) => updateItemForm({ quantity: Number(e.target.value) })}
            fullWidth
            required
            slotProps={{
              htmlInput: { min: 1 },
              input: {
                endAdornment: <InputAdornment position="end">шт</InputAdornment>,
              },
            }}
          />
        </Grid>

        {/* Material */}
        {availableMaterials.length > 0 && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <FormLabel>Матеріал</FormLabel>
              <Select
                value={itemForm.characteristics?.material || ''}
                onChange={(e) => updateItemForm({
                  characteristics: { ...itemForm.characteristics, material: e.target.value },
                })}
              >
                <MenuItem value="">Не вказано</MenuItem>
                {availableMaterials.map((material) => (
                  <MenuItem key={material} value={material}>
                    {material}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Color */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel>Колір</FormLabel>
            <Select
              value={itemForm.characteristics?.color || ''}
              onChange={(e) => updateItemForm({
                characteristics: { ...itemForm.characteristics, color: e.target.value },
              })}
            >
              <MenuItem value="">Не вказано</MenuItem>
              {COMMON_COLORS.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
              <MenuItem value="custom">Інший...</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Custom Color */}
        {itemForm.characteristics?.color === 'custom' && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Власний колір"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onBlur={() => updateItemForm({
                characteristics: { ...itemForm.characteristics, color: customColor },
              })}
              fullWidth
            />
          </Grid>
        )}

        {/* Filler */}
        {(selectedCategory === 'PADDING' || selectedCategory === 'CLOTHING') && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Наповнювач</FormLabel>
                <Select
                  value={itemForm.characteristics?.filler || ''}
                  onChange={(e) => updateItemForm({
                    characteristics: { ...itemForm.characteristics, filler: e.target.value },
                  })}
                >
                  <MenuItem value="">Не вказано</MenuItem>
                  <MenuItem value="Пух">Пух</MenuItem>
                  <MenuItem value="Синтепон">Синтепон</MenuItem>
                  <MenuItem value="Інше">Інше</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={itemForm.characteristics?.fillerCondition === 'COMPRESSED'}
                    onChange={(e) => updateItemForm({
                      characteristics: {
                        ...itemForm.characteristics,
                        fillerCondition: e.target.checked ? 'COMPRESSED' : undefined,
                      },
                    })}
                  />
                }
                label="Збитий наповнювач"
              />
            </Grid>
          </>
        )}

        {/* Wear Level */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormLabel>Ступінь зносу</FormLabel>
            <Select
              value={itemForm.characteristics?.wearLevel || ''}
              onChange={(e) => updateItemForm({
                characteristics: { ...itemForm.characteristics, wearLevel: e.target.value },
              })}
            >
              <MenuItem value="">Не вказано</MenuItem>
              <MenuItem value="10">10%</MenuItem>
              <MenuItem value="30">30%</MenuItem>
              <MenuItem value="50">50%</MenuItem>
              <MenuItem value="75">75%</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Stains */}
        <Grid size={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Плями</FormLabel>
            <FormGroup row>
              {STAINS.map((stain) => (
                <FormControlLabel
                  key={stain}
                  control={
                    <Checkbox
                      checked={itemForm.stains.some(s => s.type === stain)}
                      onChange={() => handleStainToggle(stain)}
                    />
                  }
                  label={stain}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        {/* Defects and Risks */}
        <Grid size={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Дефекти та ризики</FormLabel>
            <FormGroup row>
              {DEFECTS.map((defect) => (
                <FormControlLabel
                  key={defect}
                  control={
                    <Checkbox
                      checked={itemForm.defects.some(d => d.type === defect)}
                      onChange={() => handleDefectToggle(defect)}
                    />
                  }
                  label={defect}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        {/* Notes about defects */}
        <Grid size={12}>
          <TextField
            label="Примітки щодо дефектів"
            multiline
            rows={2}
            value={itemForm.notes || ''}
            onChange={(e) => updateItemForm({ notes: e.target.value })}
            fullWidth
          />
        </Grid>

        {/* Modifiers */}
        <Grid size={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Модифікатори</FormLabel>
            <FormGroup>
              {availableModifiers.map((modifier) => (
                <FormControlLabel
                  key={modifier.code}
                  control={
                    <Checkbox
                      checked={itemForm.modifierCodes.includes(modifier.code)}
                      onChange={() => handleModifierToggle(modifier.code)}
                    />
                  }
                  label={`${modifier.label} ${modifier.value}`}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        {/* Photos */}
        <Grid size={12}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Фотодокументація
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<PhotoCamera />}
                component="label"
              >
                Додати фото
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    // Will implement photo upload
                    console.log('Photos:', e.target.files);
                  }}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Макс. 5 фото, до 5MB кожне
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Action Buttons */}
        <Grid size={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
            >
              Скасувати
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={!itemForm.priceListItemId || !itemForm.quantity}
            >
              {itemId ? 'Зберегти зміни' : 'Додати предмет'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};