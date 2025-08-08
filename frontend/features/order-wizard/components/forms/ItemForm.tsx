'use client';

import React, { useState, useEffect } from 'react';
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
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PhotoCamera,
  Save,
  Close,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useListPriceListItems } from '@/shared/api/generated/priceList';
import { useOrderWizardStore } from '@/features/order-wizard';
import {
  useAddCartItem,
  useUpdateCartItem,
  useGetCart,
  type AddCartItemRequest,
  type UpdateCartItemRequest,
  type ItemStain,
  type ItemDefect,
  ItemCharacteristicsFillerCondition,
  ItemCharacteristicsWearLevel,
} from '@/shared/api/generated/cart';
import { useUploadFile } from '@/shared/api/generated/file';
import type {
  PriceListItemInfo,
  PriceListItemInfoCategoryCode,
} from '@/shared/api/generated/priceList';
import { 
  CATEGORY_LABELS, 
  MATERIALS_BY_CATEGORY, 
  COMMON_COLORS, 
  FILLER_OPTIONS,
  itemFormSchema,
  type ItemFormData,
} from '@/features/order-wizard/constants';
import { ServiceSelector } from './item-form/ServiceSelector';
import { StainsSelector } from './item-form/StainsSelector';
import { DefectsSelector } from './item-form/DefectsSelector';
import { ModifiersSelector } from './item-form/ModifiersSelector';

interface ItemFormProps {
  onCloseAction: () => void;
  itemId?: string | null;
}

export const ItemForm: React.FC<ItemFormProps> = ({ onCloseAction, itemId }) => {
  const [selectedCategory, setSelectedCategory] = useState<PriceListItemInfoCategoryCode | ''>('');
  const [customColor, setCustomColor] = useState('');
  const [selectedStains, setSelectedStains] = useState<ItemStain[]>([]);
  const [selectedDefects, setSelectedDefects] = useState<ItemDefect[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  
  // Get selected customer from store
  const { selectedCustomer } = useOrderWizardStore();
  
  // Get cart data to find existing item for editing
  const { data: cartData, refetch: refetchCart } = useGetCart({
    query: {
      enabled: !!selectedCustomer,
    },
  });
  
  // Mutations
  const addItemMutation = useAddCartItem();
  const updateItemMutation = useUpdateCartItem();
  const uploadFileMutation = useUploadFile();
  
  // Find existing item data for editing
  const existingItem = itemId 
    ? cartData?.items?.find(item => item.id === itemId)
    : null;
  
  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      priceListItemId: '',
      quantity: 1,
      characteristics: {},
      modifierCodes: [],
    },
  });
  
  const watchedPriceListItemId = watch('priceListItemId');
  const watchedCharacteristics = watch('characteristics');

  // Get price list items for selected category
  const { data: priceListData, isLoading: isLoadingPriceList } = useListPriceListItems(
    selectedCategory ? { categoryCode: selectedCategory as any } : {},
    {
      query: {
        enabled: !!selectedCategory,
      },
    }
  );
  
  // Load existing item data when editing
  useEffect(() => {
    if (!itemId || !existingItem) return; // Only for editing mode
    
    const item = existingItem;
    const categoryCode = item.priceListItem?.categoryCode as PriceListItemInfoCategoryCode;
    
    setSelectedCategory(categoryCode || '');
    
    reset({
      priceListItemId: item.priceListItemId || '',
      quantity: item.quantity || 1,
      characteristics: item.characteristics || {},
      modifierCodes: item.pricing?.modifierDetails?.map(m => m.code) || [],
    });
    
    // TODO: Load stains and defects from item when backend supports it
    // setSelectedStains(item.stains || []);
    // setSelectedDefects(item.defects || []);
  }, [existingItem, itemId, reset]);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const category = event.target.value as PriceListItemInfoCategoryCode;
    setSelectedCategory(category);
    setValue('priceListItemId', ''); // Clear selected service when category changes
  };

  const handleServiceSelect = (service: PriceListItemInfo) => {
    setValue('priceListItemId', service.id);
  };

  // Note: Handlers removed - now handled directly in child components

  const handleSave = handleSubmit(async (data: ItemFormData) => {
    try {
      if (itemId) {
        // Update existing item
        const updateRequest: UpdateCartItemRequest = {
          quantity: data.quantity,
          characteristics: data.characteristics,
          modifierCodes: data.modifierCodes,
        };
        
        await updateItemMutation.mutateAsync({
          itemId,
          data: updateRequest,
        });
      } else {
        // Add new item  
        const addRequest: AddCartItemRequest = {
          priceListItemId: data.priceListItemId,
          quantity: data.quantity,
          characteristics: data.characteristics,
          modifierCodes: data.modifierCodes,
        };
        
        await addItemMutation.mutateAsync({ data: addRequest });
      }
      
      await refetchCart();
      onCloseAction();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  });

  const handleCancel = () => {
    reset();
    setSelectedStains([]);
    setSelectedDefects([]);
    setUploadedPhotos([]);
    onCloseAction();
  };

  // Get available materials for selected category
  const availableMaterials = selectedCategory ? MATERIALS_BY_CATEGORY[selectedCategory] || [] : [];
  
  const isPending = addItemMutation.isPending || updateItemMutation.isPending;
  const watchedModifierCodes = watch('modifierCodes') || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {itemId ? 'Редагувати предмет' : 'Додати предмет'}
        </Typography>
        <IconButton onClick={onCloseAction} disabled={isPending}>
          <Close />
        </IconButton>
      </Box>
      
      {isPending && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {itemId ? 'Оновлення предмета...' : 'Додавання предмета...'}
        </Alert>
      )}

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
        {selectedCategory && (
          <Grid size={12}>
            <Typography variant="subtitle2" gutterBottom>
              Найменування виробу
            </Typography>
            <ServiceSelector
              services={priceListData?.priceListItems || []}
              selectedServiceId={watchedPriceListItemId}
              onServiceSelectAction={handleServiceSelect}
              isLoading={isLoadingPriceList}
              disabled={isPending}
            />
            {errors.priceListItemId && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.priceListItemId.message}
              </Typography>
            )}
          </Grid>
        )}

        {/* Quantity */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Кількість"
                type="number"
                fullWidth
                required
                disabled={isPending}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
                slotProps={{
                  htmlInput: { min: 1 },
                  input: {
                    endAdornment: <InputAdornment position="end">шт</InputAdornment>,
                  },
                }}
              />
            )}
          />
        </Grid>

        {/* Material */}
        {availableMaterials.length > 0 && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="characteristics.material"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <FormLabel>Матеріал</FormLabel>
                  <Select
                    {...field}
                    value={field.value || ''}
                    disabled={isPending}
                  >
                    <MenuItem value="">Не вказано</MenuItem>
                    {availableMaterials.map((material) => (
                      <MenuItem key={material} value={material}>
                        {material}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        )}

        {/* Color */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="characteristics.color"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <FormLabel>Колір</FormLabel>
                <Select
                  {...field}
                  value={field.value || ''}
                  disabled={isPending}
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
            )}
          />
        </Grid>

        {/* Custom Color */}
        {watchedCharacteristics?.color === 'custom' && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Власний колір"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onBlur={() => setValue('characteristics.color', customColor)}
              fullWidth
              disabled={isPending}
            />
          </Grid>
        )}

        {/* Filler */}
        {(selectedCategory === 'PADDING' || selectedCategory === 'CLOTHING') && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="characteristics.filler"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <FormLabel>Наповнювач</FormLabel>
                    <Select
                      {...field}
                      value={field.value || ''}
                      disabled={isPending}
                    >
                      <MenuItem value="">Не вказано</MenuItem>
                      {FILLER_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="characteristics.fillerCondition"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value === ItemCharacteristicsFillerCondition.COMPRESSED}
                        onChange={(e) => field.onChange(
                          e.target.checked ? ItemCharacteristicsFillerCondition.COMPRESSED : undefined
                        )}
                        disabled={isPending}
                      />
                    }
                    label="Збитий наповнювач"
                  />
                )}
              />
            </Grid>
          </>
        )}

        {/* Wear Level */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="characteristics.wearLevel"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <FormLabel>Ступінь зносу</FormLabel>
                <Select
                  {...field}
                  value={field.value || ''}
                  disabled={isPending}
                >
                  <MenuItem value="">Не вказано</MenuItem>
                  <MenuItem value={ItemCharacteristicsWearLevel.NUMBER_10}>10%</MenuItem>
                  <MenuItem value={ItemCharacteristicsWearLevel.NUMBER_30}>30%</MenuItem>
                  <MenuItem value={ItemCharacteristicsWearLevel.NUMBER_50}>50%</MenuItem>
                  <MenuItem value={ItemCharacteristicsWearLevel.NUMBER_75}>75%</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Stains */}
        <Grid size={12}>
          <StainsSelector
            selectedStains={selectedStains}
            onChangeAction={setSelectedStains}
            disabled={isPending}
          />
        </Grid>

        {/* Defects */}
        <Grid size={12}>
          <DefectsSelector
            selectedDefects={selectedDefects}
            onChangeAction={setSelectedDefects}
            disabled={isPending}
          />
        </Grid>

        {/* Notes about defects */}
        <Grid size={12}>
          <TextField
            label="Примітки"
            multiline
            rows={2}
            fullWidth
            disabled={isPending}
            placeholder="Додаткові примітки про предмет, дефекти тощо"
          />
        </Grid>

        {/* Modifiers */}
        <Grid size={12}>
          <ModifiersSelector
            selectedCategory={selectedCategory}
            selectedModifiers={watchedModifierCodes}
            onChangeAction={(modifiers) => setValue('modifierCodes', modifiers)}
            disabled={isPending}
          />
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
                startIcon={isUploadingPhotos ? <CircularProgress size={16} /> : <PhotoCamera />}
                component="label"
                disabled={isPending || isUploadingPhotos || uploadedPhotos.length >= 5}
              >
                {isUploadingPhotos ? 'Завантаження...' : 'Додати фото'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  disabled={isPending || isUploadingPhotos || uploadedPhotos.length >= 5}
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    
                    setIsUploadingPhotos(true);
                    
                    try {
                      const uploadPromises = Array.from(files).map(async (file) => {
                        const result = await uploadFileMutation.mutateAsync({
                          data: { file },
                          params: {
                            directory: 'orders/items/photos',
                            filename: `item-${Date.now()}-${file.name.split('.')[0]}`
                          }
                        });
                        return result.fileUrl;
                      });
                      
                      const uploadedUrls = await Promise.all(uploadPromises);
                      setUploadedPhotos(prev => [...prev, ...uploadedUrls]);
                    } catch (error) {
                      console.error('Error uploading photos:', error);
                      // TODO: Show error notification
                    } finally {
                      setIsUploadingPhotos(false);
                    }
                  }}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Макс. 5 фото, до 5MB кожне. Завантажено: {uploadedPhotos.length}/5
              </Typography>
            </Box>
            
            {/* Display uploaded photos */}
            {uploadedPhotos.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {uploadedPhotos.map((photoUrl, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <img
                      src={photoUrl}
                      alt={`Photo ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        backgroundColor: 'background.paper',
                        '&:hover': { backgroundColor: 'background.paper' },
                      }}
                      onClick={() => {
                        setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Action Buttons */}
        <Grid size={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isPending}
            >
              Скасувати
            </Button>
            <Button
              variant="contained"
              startIcon={isPending ? <CircularProgress size={16} /> : <Save />}
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending 
                ? (itemId ? 'Збереження...' : 'Додавання...')
                : (itemId ? 'Зберегти зміни' : 'Додати предмет')
              }
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};