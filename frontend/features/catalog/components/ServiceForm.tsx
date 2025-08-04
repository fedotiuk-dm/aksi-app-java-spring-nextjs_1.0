'use client';

/**
 * @fileoverview Форма створення/редагування послуги
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
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import { ChromePicker } from 'react-color';
import { useState } from 'react';
import {
  useCreateServiceForm,
  useUpdateServiceForm,
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_NAMES,
  PROCESSING_TIMES,
  PROCESSING_TIME_NAMES,
  CATALOG_MESSAGES,
} from '@/features/catalog';
import type { ServiceInfo } from '@/shared/api/generated/serviceItem';

interface ServiceFormProps {
  service?: ServiceInfo;
  onSuccess?: (service: ServiceInfo) => void;
  onCancel?: () => void;
}

const CreateServiceFormContent = ({ onSuccess, onCancel }: { onSuccess?: (service: ServiceInfo) => void; onCancel?: () => void }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { form, onSubmit, isLoading } = useCreateServiceForm();
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = form;
  
  const watchedColor = watch('color') as string;
  const watchedAllowedProcessingTimes = (watch('allowedProcessingTimes') || []) as (keyof typeof PROCESSING_TIMES)[];
  
  const handleColorChange = (color: any) => {
    setValue('color', color.hex);
  };

  const handleProcessingTimeToggle = (time: string) => {
    const current = (getValues('allowedProcessingTimes') || []) as string[];
    const updated = current.includes(time)
      ? current.filter((t: string) => t !== time)
      : [...current, time as keyof typeof PROCESSING_TIMES];
    setValue('allowedProcessingTimes', updated as any);
  };

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

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <TextField
        {...register('code')}
        fullWidth
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.CODE}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.CODE_PLACEHOLDER}
        error={!!errors.code}
        helperText={errors.code?.message}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        {...register('name')}
        fullWidth
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.NAME}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.NAME_PLACEHOLDER}
        error={!!errors.name}
        helperText={errors.name?.message}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        {...register('description')}
        fullWidth
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.DESCRIPTION}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.DESCRIPTION_PLACEHOLDER}
        multiline
        rows={3}
        error={!!errors.description}
        helperText={errors.description?.message}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.category}>
        <InputLabel required>{CATALOG_MESSAGES.SERVICE_FORM.FIELDS.CATEGORY}</InputLabel>
        <Select
          {...register('category')}
          label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.CATEGORY}
          defaultValue=""
        >
          {Object.entries(SERVICE_CATEGORIES).map(([, value]) => (
            <MenuItem key={value} value={value}>
              {SERVICE_CATEGORY_NAMES[value]}
            </MenuItem>
          ))}
        </Select>
        {errors.category && (
          <FormHelperText>{errors.category.message}</FormHelperText>
        )}
      </FormControl>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        {CATALOG_MESSAGES.SERVICE_FORM.SECTION_DISPLAY}
      </Typography>

      <TextField
        {...register('icon')}
        fullWidth
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.ICON}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.ICON_PLACEHOLDER}
        error={!!errors.icon}
        helperText={errors.icon?.message || CATALOG_MESSAGES.SERVICE_FORM.FIELDS.ICON_HELPER}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {CATALOG_MESSAGES.SERVICE_FORM.FIELDS.COLOR}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            {...register('color')}
            label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.HEX_COLOR}
            placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.HEX_PLACEHOLDER}
            error={!!errors.color}
            helperText={errors.color?.message}
            sx={{ flexGrow: 1 }}
          />
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: watchedColor || '#000000',
              border: '1px solid #ccc',
              borderRadius: 1,
              cursor: 'pointer',
            }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
        </Box>
        {showColorPicker && (
          <Box sx={{ mt: 2 }}>
            <ChromePicker
              color={watchedColor || '#000000'}
              onChange={handleColorChange}
            />
          </Box>
        )}
      </Box>

      <TextField
        {...register('sortOrder', { valueAsNumber: true })}
        fullWidth
        type="number"
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.SORT_ORDER}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.SORT_PLACEHOLDER}
        error={!!errors.sortOrder}
        helperText={errors.sortOrder?.message}
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        {CATALOG_MESSAGES.SERVICE_FORM.SECTION_PROCESSING}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {CATALOG_MESSAGES.SERVICE_FORM.FIELDS.PROCESSING_TIMES}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(PROCESSING_TIMES).map(([, value]) => (
            <Chip
              key={value}
              label={PROCESSING_TIME_NAMES[value]}
              onClick={() => handleProcessingTimeToggle(value)}
              color={watchedAllowedProcessingTimes.includes(value) ? 'primary' : 'default'}
              variant={watchedAllowedProcessingTimes.includes(value) ? 'filled' : 'outlined'}
              clickable
            />
          ))}
        </Box>
      </Box>

      <FormControlLabel
        control={
          <Checkbox {...register('requiresSpecialHandling')} />
        }
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.SPECIAL_HANDLING}
        sx={{ mb: 2 }}
      />

      <TextField
        {...register('tags')}
        fullWidth
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.TAGS}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.TAGS_PLACEHOLDER}
        error={!!errors.tags}
        helperText={errors.tags?.message || CATALOG_MESSAGES.SERVICE_FORM.FIELDS.TAGS_HELPER}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
          >
            {CATALOG_MESSAGES.SERVICE_FORM.BUTTONS.CANCEL}
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading 
            ? CATALOG_MESSAGES.SERVICE_FORM.BUTTONS.CREATING
            : CATALOG_MESSAGES.SERVICE_FORM.BUTTONS.CREATE
          }
        </Button>
      </Box>

      {form.formState.errors.root && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {form.formState.errors.root.message}
        </Alert>
      )}
    </Box>
  );
};

const UpdateServiceFormContent = ({ service, onSuccess, onCancel }: { service: ServiceInfo; onSuccess?: (service: ServiceInfo) => void; onCancel?: () => void }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { form, onSubmit, isLoading } = useUpdateServiceForm(service);
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = form;
  
  const watchedColor = watch('color') as string;
  const watchedAllowedProcessingTimes = (watch('allowedProcessingTimes') || []) as (keyof typeof PROCESSING_TIMES)[];
  
  const handleColorChange = (color: any) => {
    setValue('color', color.hex);
  };

  const handleProcessingTimeToggle = (time: string) => {
    const current = (getValues('allowedProcessingTimes') || []) as string[];
    const updated = current.includes(time)
      ? current.filter((t: string) => t !== time)
      : [...current, time as keyof typeof PROCESSING_TIMES];
    setValue('allowedProcessingTimes', updated as any);
  };

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

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <TextField
        {...register('name')}
        fullWidth
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.NAME}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.NAME_PLACEHOLDER}
        error={!!errors.name}
        helperText={errors.name?.message}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        {...register('description')}
        fullWidth
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.DESCRIPTION}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.DESCRIPTION_PLACEHOLDER}
        multiline
        rows={3}
        error={!!errors.description}
        helperText={errors.description?.message}
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        {CATALOG_MESSAGES.SERVICE_FORM.SECTION_DISPLAY}
      </Typography>

      <TextField
        {...register('icon')}
        fullWidth
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.ICON}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.ICON_PLACEHOLDER}
        error={!!errors.icon}
        helperText={errors.icon?.message || CATALOG_MESSAGES.SERVICE_FORM.FIELDS.ICON_HELPER}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {CATALOG_MESSAGES.SERVICE_FORM.FIELDS.COLOR}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            {...register('color')}
            label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.HEX_COLOR}
            placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.HEX_PLACEHOLDER}
            error={!!errors.color}
            helperText={errors.color?.message}
            sx={{ flexGrow: 1 }}
          />
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: watchedColor || '#000000',
              border: '1px solid #ccc',
              borderRadius: 1,
              cursor: 'pointer',
            }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
        </Box>
        {showColorPicker && (
          <Box sx={{ mt: 2 }}>
            <ChromePicker
              color={watchedColor || '#000000'}
              onChange={handleColorChange}
            />
          </Box>
        )}
      </Box>

      <TextField
        {...register('sortOrder', { valueAsNumber: true })}
        fullWidth
        type="number"
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.SORT_ORDER}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.SORT_PLACEHOLDER}
        error={!!errors.sortOrder}
        helperText={errors.sortOrder?.message}
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        {CATALOG_MESSAGES.SERVICE_FORM.SECTION_PROCESSING}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {CATALOG_MESSAGES.SERVICE_FORM.FIELDS.PROCESSING_TIMES}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(PROCESSING_TIMES).map(([, value]) => (
            <Chip
              key={value}
              label={PROCESSING_TIME_NAMES[value]}
              onClick={() => handleProcessingTimeToggle(value)}
              color={watchedAllowedProcessingTimes.includes(value) ? 'primary' : 'default'}
              variant={watchedAllowedProcessingTimes.includes(value) ? 'filled' : 'outlined'}
              clickable
            />
          ))}
        </Box>
      </Box>

      <FormControlLabel
        control={
          <Checkbox {...register('requiresSpecialHandling')} />
        }
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.SPECIAL_HANDLING}
        sx={{ mb: 2 }}
      />

      <TextField
        {...register('tags')}
        fullWidth
        label={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.TAGS}
        placeholder={CATALOG_MESSAGES.SERVICE_FORM.FIELDS.TAGS_PLACEHOLDER}
        error={!!errors.tags}
        helperText={errors.tags?.message || CATALOG_MESSAGES.SERVICE_FORM.FIELDS.TAGS_HELPER}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
          >
            {CATALOG_MESSAGES.SERVICE_FORM.BUTTONS.CANCEL}
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={20} />}
        >
          {isLoading 
            ? CATALOG_MESSAGES.SERVICE_FORM.BUTTONS.UPDATING
            : CATALOG_MESSAGES.SERVICE_FORM.BUTTONS.UPDATE
          }
        </Button>
      </Box>

      {form.formState.errors.root && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {form.formState.errors.root.message}
        </Alert>
      )}
    </Box>
  );
};

export const ServiceForm = ({ service, onSuccess, onCancel }: ServiceFormProps) => {
  const isEdit = !!service;

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEdit ? CATALOG_MESSAGES.SERVICE_FORM.TITLE_EDIT : CATALOG_MESSAGES.SERVICE_FORM.TITLE_CREATE}
      </Typography>

      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
        {CATALOG_MESSAGES.SERVICE_FORM.SECTION_BASIC}
      </Typography>

      {service ? (
        <UpdateServiceFormContent service={service} onSuccess={onSuccess} onCancel={onCancel} />
      ) : (
        <CreateServiceFormContent onSuccess={onSuccess} onCancel={onCancel} />
      )}
    </Paper>
  );
};
