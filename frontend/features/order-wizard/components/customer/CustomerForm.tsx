import React from 'react';
import { 
  Box, 
  Button,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem
} from '@mui/material';
import { CollapsibleForm } from '@shared/ui/molecules';
import { Controller } from 'react-hook-form';
import { 
  CreateCustomerRequestContactPreferencesItem,
  CreateCustomerRequestInfoSource
} from '@api/customer';
import { useCustomerForm } from '@/features/order-wizard/hooks/useCustomerForm';
import { useOrderWizardStore } from '@/features/order-wizard';

export const CustomerForm: React.FC = () => {
  const { isCustomerFormOpen, setCustomerFormOpen } = useOrderWizardStore();
  const {
    control,
    errors,
    watchedContactPreferences,
    handleCreateCustomer,
    handleCancel,
    isLoading
  } = useCustomerForm();

  return (
    <CollapsibleForm
      isOpen={isCustomerFormOpen}
      onToggle={() => setCustomerFormOpen(!isCustomerFormOpen)}
      toggleButtonText="Новий клієнт"
      disabled={isLoading}
    >
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Прізвище"
                required
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ім'я"
                required
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          <Controller
            name="phonePrimary"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Телефон"
                required
                fullWidth
                error={!!errors.phonePrimary}
                helperText={errors.phonePrimary?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Способи зв'язку</FormLabel>
            <FormGroup>
              {Object.values(CreateCustomerRequestContactPreferencesItem).map((value) => (
                <Controller
                  key={value}
                  name="contactPreferences"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={watchedContactPreferences.includes(value)}
                          onChange={(e) => {
                            const currentValues = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentValues, value]);
                            } else {
                              field.onChange(currentValues.filter(v => v !== value));
                            }
                          }}
                        />
                      }
                      label={value.charAt(0) + value.slice(1).toLowerCase()}
                    />
                  )}
                />
              ))}
            </FormGroup>
          </FormControl>

          <Controller
            name="infoSource"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>Джерело інформації</FormLabel>
                <Select {...field} value={field.value || ''}>
                  <MenuItem value="">Не вказано</MenuItem>
                  {Object.values(CreateCustomerRequestInfoSource).map((value) => (
                    <MenuItem key={value} value={value}>
                      {value.charAt(0) + value.slice(1).toLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCreateCustomer}
              disabled={isLoading}
            >
              {isLoading ? 'Створення...' : 'Зберегти'}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleCancel}
              disabled={isLoading}
            >
              Скасувати
            </Button>
          </Box>
    </CollapsibleForm>
  );
};