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
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateBranch,
  useUpdateBranch,
  CreateBranchRequest,
  createBranchBody,
} from '@/shared/api/generated/branch';
import { useBranchStore } from '@/features/branch';
import { toast } from 'sonner';

export const BranchForm: React.FC = () => {
  const { isFormOpen, editingBranch, closeForm } = useBranchStore();

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBranchRequest>({
    resolver: zodResolver(createBranchBody),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      workingHours: '',
      active: true,
    },
  });

  // Reset form when editing branch changes
  React.useEffect(() => {
    if (editingBranch) {
      reset({
        name: editingBranch.name,
        address: editingBranch.address || '',
        phone: editingBranch.phone || '',
        email: editingBranch.email || '',
        workingHours: editingBranch.workingHours || '',
        active: editingBranch.active,
      });
    } else {
      reset({
        name: '',
        address: '',
        phone: '',
        email: '',
        workingHours: '',
        active: true,
      });
    }
  }, [editingBranch, reset]);

  // Mutations
  const createMutation = useCreateBranch({
    mutation: {
      onSuccess: () => {
        toast.success('Філію створено');
        handleClose();
      },
      onError: (error) => {
        toast.error(`Помилка: ${error.message}`);
      },
    },
  });

  const updateMutation = useUpdateBranch({
    mutation: {
      onSuccess: () => {
        toast.success('Філію оновлено');
        handleClose();
      },
      onError: (error) => {
        toast.error(`Помилка: ${error.message}`);
      },
    },
  });

  const onSubmit = async (data: CreateBranchRequest) => {
    if (editingBranch) {
      // При оновленні просто передаємо data без конвертації
      // TypeScript дозволяє передати CreateRequest там де очікується UpdateRequest
      await updateMutation.mutateAsync({
        branchId: editingBranch.id,
        data: data,
      });
    } else {
      await createMutation.mutateAsync({
        data: data,
      });
    }
  };

  const handleClose = () => {
    reset();
    closeForm();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isFormOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {editingBranch ? 'Редагувати філію' : 'Нова філія'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Назва"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Адреса"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>


            <Grid size={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Телефон"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={6}>
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
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="workingHours"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Робочі години"
                    fullWidth
                    placeholder="Пн-Пт: 9:00-18:00, Сб: 10:00-16:00"
                    error={!!errors.workingHours}
                    helperText={errors.workingHours?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label="Активна"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} />}
          >
            {editingBranch ? 'Зберегти' : 'Створити'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};