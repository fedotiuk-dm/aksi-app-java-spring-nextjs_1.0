'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCustomerStore } from '@/features/customer';
import {
  useCreateCustomer,
  useUpdateCustomer,
  CreateCustomerRequestContactPreferencesItem,
  CreateCustomerRequestInfoSource,
  type CreateCustomerRequest,
  type UpdateCustomerRequest,
} from '@/shared/api/generated/customer';

const INFO_SOURCE_LABELS: Record<CreateCustomerRequestInfoSource, string> = {
  [CreateCustomerRequestInfoSource.INSTAGRAM]: 'Instagram',
  [CreateCustomerRequestInfoSource.GOOGLE]: 'Google',
  [CreateCustomerRequestInfoSource.RECOMMENDATION]: 'Рекомендація',
  [CreateCustomerRequestInfoSource.OTHER]: 'Інше',
};

const CONTACT_PREFERENCES_LABELS: Record<CreateCustomerRequestContactPreferencesItem, string> = {
  [CreateCustomerRequestContactPreferencesItem.PHONE]: 'Дзвінки',
  [CreateCustomerRequestContactPreferencesItem.SMS]: 'SMS',
  [CreateCustomerRequestContactPreferencesItem.VIBER]: 'Viber',
};

const formSchema = z.object({
  firstName: z.string().min(1, "Ім'я обов'язкове").max(100),
  lastName: z.string().min(1, "Прізвище обов'язкове").max(100),
  phonePrimary: z
    .string()
    .min(10, 'Телефон повинен містити мінімум 10 цифр')
    .max(20)
    .regex(/^\+?[0-9\s\-()]+$/, 'Невірний формат телефону'),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$|^$/, 'Невірний формат email')
    .optional(),
  contactPreferences: z
    .array(
      z.enum(
        Object.values(CreateCustomerRequestContactPreferencesItem) as [
          CreateCustomerRequestContactPreferencesItem,
          ...CreateCustomerRequestContactPreferencesItem[],
        ]
      )
    )
    .optional(),
  infoSource: z
    .enum(
      Object.values(CreateCustomerRequestInfoSource) as [
        CreateCustomerRequestInfoSource,
        ...CreateCustomerRequestInfoSource[],
      ]
    )
    .optional(),
  infoSourceOther: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
  discountCardNumber: z.string().max(20).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CustomerFormProps {
  onSuccessAction: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSuccessAction }) => {
  const { isFormOpen, selectedCustomer, setFormOpen, setSelectedCustomer } = useCustomerStore();

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phonePrimary: '',
      email: '',
      contactPreferences: [],
      infoSource: undefined,
      infoSourceOther: '',
      notes: '',
      discountCardNumber: '',
    },
  });

  React.useEffect(() => {
    if (selectedCustomer) {
      reset({
        firstName: selectedCustomer.firstName,
        lastName: selectedCustomer.lastName,
        phonePrimary: selectedCustomer.phonePrimary,
        email: selectedCustomer.email || '',
        contactPreferences: selectedCustomer.contactPreferences || [],
        infoSource: selectedCustomer.infoSource,
        infoSourceOther: selectedCustomer.infoSourceOther || '',
        notes: selectedCustomer.notes || '',
        discountCardNumber: selectedCustomer.discountCardNumber || '',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        phonePrimary: '',
        email: '',
        contactPreferences: [],
        infoSource: undefined,
        infoSourceOther: '',
        notes: '',
        discountCardNumber: '',
      });
    }
  }, [selectedCustomer, reset]);

  const infoSource = watch('infoSource');

  const handleClose = () => {
    // Ensure focus leaves dialog before it becomes aria-hidden
    const active = document.activeElement as HTMLElement | null;
    if (active) active.blur();
    setFormOpen(false);
    setSelectedCustomer(null);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Clean up data - remove empty strings and empty arrays
      const cleanedData = {
        ...data,
        email: data.email || undefined,
        infoSourceOther: data.infoSourceOther || undefined,
        notes: data.notes || undefined,
        discountCardNumber: data.discountCardNumber || undefined,
        contactPreferences: data.contactPreferences?.length ? data.contactPreferences : undefined,
      };

      if (selectedCustomer) {
        await updateMutation.mutateAsync({
          customerId: selectedCustomer.id,
          data: cleanedData as UpdateCustomerRequest,
        });
      } else {
        await createMutation.mutateAsync({
          data: cleanedData as CreateCustomerRequest,
        });
      }

      void onSuccessAction();
      handleClose();
    } catch (error) {
      console.error('Помилка збереження:', (error as Error)?.message || error);
    }
  };

  return (
    <Dialog open={isFormOpen} onClose={handleClose} maxWidth="md" fullWidth disableRestoreFocus>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{selectedCustomer ? 'Редагувати клієнта' : 'Додати клієнта'}</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="subtitle2" gutterBottom>
                Основна інформація
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Ім'я"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Прізвище"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="phonePrimary"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Основний телефон"
                    placeholder="+380501234567"
                    error={!!errors.phonePrimary}
                    helperText={errors.phonePrimary?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="discountCardNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Номер дисконтної картки"
                    error={!!errors.discountCardNumber}
                    helperText={errors.discountCardNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Спосіб зв&apos;язку
              </Typography>
            </Grid>

            <Grid size={12}>
              <Controller
                name="contactPreferences"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormGroup row>
                    {Object.entries(CONTACT_PREFERENCES_LABELS).map(([prefKey, label]) => (
                      <FormControlLabel
                        key={prefKey}
                        control={
                          <Checkbox
                            checked={
                              value?.includes(
                                prefKey as CreateCustomerRequestContactPreferencesItem
                              ) || false
                            }
                            onChange={(e) => {
                              const currentValue = value || [];
                              if (e.target.checked) {
                                onChange([
                                  ...currentValue,
                                  prefKey as CreateCustomerRequestContactPreferencesItem,
                                ]);
                              } else {
                                onChange(currentValue.filter((item) => item !== prefKey));
                              }
                            }}
                          />
                        }
                        label={label}
                      />
                    ))}
                  </FormGroup>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Джерело інформації
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="infoSource"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Джерело інформації</InputLabel>
                    <Select {...field} label="Джерело інформації" value={field.value || ''}>
                      <MenuItem value="">Не вказано</MenuItem>
                      {Object.entries(INFO_SOURCE_LABELS).map(([sourceKey, label]) => (
                        <MenuItem key={sourceKey} value={sourceKey}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {infoSource === CreateCustomerRequestInfoSource.OTHER && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="infoSourceOther"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Опишіть джерело"
                      error={!!errors.infoSourceOther}
                      helperText={errors.infoSourceOther?.message}
                    />
                  )}
                />
              </Grid>
            )}

            <Grid size={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Внутрішні примітки"
                    multiline
                    rows={3}
                    error={!!errors.notes}
                    helperText={errors.notes?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Скасувати</Button>
          <Button type="submit" variant="contained">
            {selectedCustomer ? 'Зберегти' : 'Додати'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
