'use client';

/**
 * @fileoverview Форма створення/редагування комбінації послуга-товар
 */

import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Alert,
  CircularProgress,
  FormHelperText,
  Paper,
  Divider,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import {
  useCreateServiceItemForm,
  useUpdateServiceItemForm,
  PROCESSING_TIMES,
  PROCESSING_TIME_NAMES,
  CATALOG_MESSAGES,
  formatPrice,
} from '@/features/catalog';
import { useListServices, useListItems } from '@/shared/api/generated/serviceItem';
import type { ServiceItemInfo, ServiceInfo, ItemInfo } from '@/shared/api/generated/serviceItem';

interface ServiceItemFormProps {
  serviceItem?: ServiceItemInfo;
  preselectedServiceId?: string;
  preselectedItemId?: string;
  onSuccess?: (serviceItem: ServiceItemInfo) => void;
  onCancel?: () => void;
}

export const ServiceItemForm = ({ 
  serviceItem, 
  preselectedServiceId,
  preselectedItemId,
  onSuccess, 
  onCancel 
}: ServiceItemFormProps) => {
  const isEdit = !!serviceItem;
  
  const createForm = useCreateServiceItemForm();
  const updateForm = useUpdateServiceItemForm(serviceItem);
  
  const { form, onSubmit, isLoading } = isEdit ? updateForm : createForm;
  
  // Avoid union types by using conditional rendering
  if (isEdit && serviceItem) {
    return <UpdateServiceItemFormContent 
      serviceItem={serviceItem} 
      onSuccess={onSuccess} 
      onCancel={onCancel} 
    />;
  }
  
  return <CreateServiceItemFormContent 
    preselectedServiceId={preselectedServiceId}
    preselectedItemId={preselectedItemId}
    onSuccess={onSuccess} 
    onCancel={onCancel} 
  />;
};

interface CreateServiceItemFormContentProps {
  preselectedServiceId?: string;
  preselectedItemId?: string;
  onSuccess?: (serviceItem: ServiceItemInfo) => void;
  onCancel?: () => void;
}

const CreateServiceItemFormContent = ({ 
  preselectedServiceId,
  preselectedItemId,
  onSuccess, 
  onCancel 
}: CreateServiceItemFormContentProps) => {
  const { form, onSubmit, isLoading } = useCreateServiceItemForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  // Load services and items for selection
  const { data: servicesData } = useListServices({ active: true });
  const { data: itemsData } = useListItems({ active: true });
  
  const services = servicesData?.services || [];
  const items = itemsData?.items || [];

  const watchedBasePrice = watch('basePrice') || 0;
  const watchedExpressMultiplier = watch('expressMultiplier') || 1;
  const watchedExpressAvailable = watch('expressAvailable');

  const handleFormSubmit = async (data: any) => {
    try {
      const result = await onSubmit(data);
      if (onSuccess && result) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const calculateExpressPrice = () => {
    return Math.round(watchedBasePrice * watchedExpressMultiplier);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {CATALOG_MESSAGES.SERVICE_ITEM_FORM.TITLE_CREATE}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* Вибір послуги та товару */}
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          {CATALOG_MESSAGES.SERVICE_ITEM_FORM.SECTION_SELECTION}
        </Typography>

        <Autocomplete
          options={services}
          getOptionLabel={(service: ServiceInfo) => `${service.name} (${service.code})`}
          renderInput={(params) => (
            <TextField
              {...params}
              label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.SERVICE}
              error={!!errors.serviceId}
              helperText={errors.serviceId?.message}
              required
            />
          )}
          onChange={(_, service) => setValue('serviceId', service?.id || '')}
          defaultValue={services.find(s => s.id === preselectedServiceId)}
          disabled={false}
          sx={{ mb: 2 }}
        />

        <Autocomplete
          options={items}
          getOptionLabel={(item: ItemInfo) => `${item.name} (${item.code})`}
          renderInput={(params) => (
            <TextField
              {...params}
              label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.ITEM}
              error={!!errors.itemId}
              helperText={errors.itemId?.message}
              required
            />
          )}
          onChange={(_, item) => setValue('itemId', item?.id || '')}
          defaultValue={items.find(i => i.id === preselectedItemId)}
          disabled={false}
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Ціноутворення */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {CATALOG_MESSAGES.SERVICE_ITEM_FORM.SECTION_PRICING}
        </Typography>

        <TextField
          {...register('basePrice', { valueAsNumber: true })}
          fullWidth
          type="number"
          label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.BASE_PRICE}
          placeholder="0"
          error={!!errors.basePrice}
          helperText={errors.basePrice?.message || CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.BASE_PRICE_HELPER}
          InputProps={{
            endAdornment: <InputAdornment position="end">коп.</InputAdornment>,
          }}
          sx={{ mb: 2 }}
          required
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.PRICE_EQUIVALENT}: {formatPrice(watchedBasePrice)}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Експрес обслуговування */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {CATALOG_MESSAGES.SERVICE_ITEM_FORM.SECTION_EXPRESS}
        </Typography>

        <FormControlLabel
          control={
            <Checkbox {...register('expressAvailable')} />
          }
          label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.EXPRESS_AVAILABLE}
          sx={{ mb: 2 }}
        />

        {watchedExpressAvailable && (
          <>
            <TextField
              {...register('expressMultiplier', { valueAsNumber: true })}
              fullWidth
              type="number"
              inputProps={{ step: 0.1 }}
              label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.EXPRESS_MULTIPLIER}
              placeholder="1.5"
              error={!!errors.expressMultiplier}
              helperText={errors.expressMultiplier?.message || CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.EXPRESS_MULTIPLIER_HELPER}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
              {CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.EXPRESS_PRICE}: {formatPrice(calculateExpressPrice())}
            </Typography>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Налаштування обробки */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {CATALOG_MESSAGES.SERVICE_ITEM_FORM.SECTION_PROCESSING}
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.processingTime}>
          <InputLabel>{CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.PROCESSING_TIME}</InputLabel>
          <Select
            {...register('processingTime')}
            label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.PROCESSING_TIME}
          >
            {Object.entries(PROCESSING_TIMES).map(([key, value]) => (
              <MenuItem key={value} value={value}>
                {PROCESSING_TIME_NAMES[value]}
              </MenuItem>
            ))}
          </Select>
          {errors.processingTime && (
            <FormHelperText>{errors.processingTime.message}</FormHelperText>
          )}
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            {...register('minQuantity', { valueAsNumber: true })}
            type="number"
            label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.MIN_QUANTITY}
            placeholder="1"
            error={!!errors.minQuantity}
            helperText={errors.minQuantity?.message}
            sx={{ flexGrow: 1 }}
          />

          <TextField
            {...register('maxQuantity', { valueAsNumber: true })}
            type="number"
            label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.MAX_QUANTITY}
            placeholder="100"
            error={!!errors.maxQuantity}
            helperText={errors.maxQuantity?.message}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        <TextField
          {...register('specialInstructions')}
          fullWidth
          label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.SPECIAL_INSTRUCTIONS}
          placeholder={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.SPECIAL_INSTRUCTIONS_PLACEHOLDER}
          multiline
          rows={3}
          error={!!errors.specialInstructions}
          helperText={errors.specialInstructions?.message}
          sx={{ mb: 2 }}
        />


        {/* Дії */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
            >
              {CATALOG_MESSAGES.SERVICE_ITEM_FORM.BUTTONS.CANCEL}
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading 
              ? CATALOG_MESSAGES.SERVICE_ITEM_FORM.BUTTONS.CREATING
              : CATALOG_MESSAGES.SERVICE_ITEM_FORM.BUTTONS.CREATE
            }
          </Button>
        </Box>

        {/* Повідомлення про помилки */}
        {form.formState.errors.root && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {form.formState.errors.root.message}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

interface UpdateServiceItemFormContentProps {
  serviceItem: ServiceItemInfo;
  onSuccess?: (serviceItem: ServiceItemInfo) => void;
  onCancel?: () => void;
}

const UpdateServiceItemFormContent = ({ 
  serviceItem, 
  onSuccess, 
  onCancel 
}: UpdateServiceItemFormContentProps) => {
  const { form, onSubmit, isLoading } = useUpdateServiceItemForm(serviceItem);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  // Load services and items for display
  const { data: servicesData } = useListServices({ active: true });
  const { data: itemsData } = useListItems({ active: true });
  
  const services = servicesData?.services || [];
  const items = itemsData?.items || [];

  const watchedBasePrice = watch('basePrice') || 0;
  const watchedExpressMultiplier = watch('expressMultiplier') || 1;
  const watchedExpressAvailable = watch('expressAvailable');

  const handleFormSubmit = async (data: any) => {
    try {
      const result = await onSubmit(data);
      if (onSuccess && result) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const calculateExpressPrice = () => {
    return Math.round(watchedBasePrice * watchedExpressMultiplier);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {CATALOG_MESSAGES.SERVICE_ITEM_FORM.TITLE_EDIT}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* Вибір послуги та товару - показуємо як readonly */}
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          {CATALOG_MESSAGES.SERVICE_ITEM_FORM.SECTION_SELECTION}
        </Typography>

        <TextField
          fullWidth
          label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.SERVICE}
          value={serviceItem.service?.name || ''}
          disabled
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.ITEM}
          value={serviceItem.item?.name || ''}
          disabled
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Ціноутворення */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {CATALOG_MESSAGES.SERVICE_ITEM_FORM.SECTION_PRICING}
        </Typography>

        <TextField
          {...register('basePrice', { valueAsNumber: true })}
          fullWidth
          type="number"
          label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.BASE_PRICE}
          placeholder="0"
          error={!!errors.basePrice}
          helperText={errors.basePrice?.message || CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.BASE_PRICE_HELPER}
          InputProps={{
            endAdornment: <InputAdornment position="end">коп.</InputAdornment>,
          }}
          sx={{ mb: 2 }}
          required
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.PRICE_EQUIVALENT}: {formatPrice(watchedBasePrice)}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Експрес обслуговування */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {CATALOG_MESSAGES.SERVICE_ITEM_FORM.SECTION_EXPRESS}
        </Typography>

        <FormControlLabel
          control={
            <Checkbox {...register('expressAvailable')} />
          }
          label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.EXPRESS_AVAILABLE}
          sx={{ mb: 2 }}
        />

        {watchedExpressAvailable && (
          <>
            <TextField
              {...register('expressMultiplier', { valueAsNumber: true })}
              fullWidth
              type="number"
              inputProps={{ step: 0.1 }}
              label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.EXPRESS_MULTIPLIER}
              placeholder="1.5"
              error={!!errors.expressMultiplier}
              helperText={errors.expressMultiplier?.message || CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.EXPRESS_MULTIPLIER_HELPER}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
              {CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.EXPRESS_PRICE}: {formatPrice(calculateExpressPrice())}
            </Typography>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Налаштування обробки */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {CATALOG_MESSAGES.SERVICE_ITEM_FORM.SECTION_PROCESSING}
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.processingTime}>
          <InputLabel>{CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.PROCESSING_TIME}</InputLabel>
          <Select
            {...register('processingTime')}
            label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.PROCESSING_TIME}
          >
            {Object.entries(PROCESSING_TIMES).map(([, value]) => (
              <MenuItem key={value} value={value}>
                {PROCESSING_TIME_NAMES[value]}
              </MenuItem>
            ))}
          </Select>
          {errors.processingTime && (
            <FormHelperText>{errors.processingTime.message}</FormHelperText>
          )}
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            {...register('minQuantity', { valueAsNumber: true })}
            type="number"
            label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.MIN_QUANTITY}
            placeholder="1"
            error={!!errors.minQuantity}
            helperText={errors.minQuantity?.message}
            sx={{ flexGrow: 1 }}
          />

          <TextField
            {...register('maxQuantity', { valueAsNumber: true })}
            type="number"
            label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.MAX_QUANTITY}
            placeholder="100"
            error={!!errors.maxQuantity}
            helperText={errors.maxQuantity?.message}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        <TextField
          {...register('specialInstructions')}
          fullWidth
          label={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.SPECIAL_INSTRUCTIONS}
          placeholder={CATALOG_MESSAGES.SERVICE_ITEM_FORM.FIELDS.SPECIAL_INSTRUCTIONS_PLACEHOLDER}
          multiline
          rows={3}
          error={!!errors.specialInstructions}
          helperText={errors.specialInstructions?.message}
          sx={{ mb: 3 }}
        />

        {/* Дії */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isLoading}
            >
              {CATALOG_MESSAGES.SERVICE_ITEM_FORM.BUTTONS.CANCEL}
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} />}
          >
            {isLoading 
              ? CATALOG_MESSAGES.SERVICE_ITEM_FORM.BUTTONS.UPDATING
              : CATALOG_MESSAGES.SERVICE_ITEM_FORM.BUTTONS.UPDATE
            }
          </Button>
        </Box>

        {/* Повідомлення про помилки */}
        {form.formState.errors.root && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {form.formState.errors.root.message}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};