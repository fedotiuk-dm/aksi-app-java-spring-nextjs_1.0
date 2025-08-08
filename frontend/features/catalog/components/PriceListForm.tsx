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
  FormControlLabel,
  Switch,
  InputAdornment,
  Typography,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePriceListStore } from '@/features/catalog';
import {
  useCreatePriceListItem,
  useUpdatePriceListItem,
  PriceListItemInfoCategoryCode,
  PriceListItemInfoUnitOfMeasure,
  type CreatePriceListItemRequest,
  type UpdatePriceListItemRequest,
} from '@/shared/api/generated/priceList';

const CATEGORY_LABELS: Record<PriceListItemInfoCategoryCode, string> = {
  [PriceListItemInfoCategoryCode.CLOTHING]: 'Одяг',
  [PriceListItemInfoCategoryCode.LAUNDRY]: 'Прання',
  [PriceListItemInfoCategoryCode.IRONING]: 'Прасування',
  [PriceListItemInfoCategoryCode.LEATHER]: 'Шкіра',
  [PriceListItemInfoCategoryCode.PADDING]: 'Пухові вироби',
  [PriceListItemInfoCategoryCode.FUR]: 'Хутро',
  [PriceListItemInfoCategoryCode.DYEING]: 'Фарбування',
  [PriceListItemInfoCategoryCode.ADDITIONAL_SERVICES]: 'Додаткові послуги',
};

const UNIT_LABELS: Record<PriceListItemInfoUnitOfMeasure, string> = {
  [PriceListItemInfoUnitOfMeasure.PIECE]: 'Штука',
  [PriceListItemInfoUnitOfMeasure.KILOGRAM]: 'Кілограм',
  [PriceListItemInfoUnitOfMeasure.PAIR]: 'Пара',
  [PriceListItemInfoUnitOfMeasure.SQUARE_METER]: 'Квадратний метр',
};

const formSchema = z.object({
  categoryCode: z.enum(
    Object.values(PriceListItemInfoCategoryCode) as [
      PriceListItemInfoCategoryCode,
      ...PriceListItemInfoCategoryCode[],
    ]
  ),
  catalogNumber: z.number().min(1),
  name: z.string().min(1, "Назва обов'язкова"),
  nameUa: z.string().optional(),
  unitOfMeasure: z.enum(
    Object.values(PriceListItemInfoUnitOfMeasure) as [
      PriceListItemInfoUnitOfMeasure,
      ...PriceListItemInfoUnitOfMeasure[],
    ]
  ),
  basePrice: z.number().min(0),
  priceBlack: z.number().min(0).optional().nullable(),
  priceColor: z.number().min(0).optional().nullable(),
  active: z.boolean(),
  processingTimeDays: z.number().min(1).optional().nullable(),
  expressAvailable: z.boolean(),
  expressTimeHours: z.number().min(1).optional().nullable(),
  expressPrice: z.number().min(0).optional().nullable(),
  sortOrder: z.number().optional().nullable(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PriceListFormProps {
  onSuccessAction: () => void;
}

export const PriceListForm: React.FC<PriceListFormProps> = ({ onSuccessAction }) => {
  const { isFormOpen, selectedItem, setFormOpen, setSelectedItem } = usePriceListStore();

  const createMutation = useCreatePriceListItem();
  const updateMutation = useUpdatePriceListItem();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      active: true,
      expressAvailable: false,
      basePrice: 0,
      nameUa: '',
      name: '',
      description: '',
      priceBlack: undefined,
      priceColor: undefined,
      processingTimeDays: undefined,
      expressTimeHours: undefined,
      expressPrice: undefined,
      sortOrder: undefined,
    },
  });

  React.useEffect(() => {
    if (selectedItem) {
      reset({
        categoryCode: selectedItem.categoryCode,
        catalogNumber: selectedItem.catalogNumber,
        name: selectedItem.name,
        nameUa: selectedItem.nameUa || '',
        unitOfMeasure: selectedItem.unitOfMeasure,
        basePrice: selectedItem.basePrice / 100,
        priceBlack: selectedItem.priceBlack ? selectedItem.priceBlack / 100 : undefined,
        priceColor: selectedItem.priceColor ? selectedItem.priceColor / 100 : undefined,
        active: selectedItem.active,
        processingTimeDays: selectedItem.processingTimeDays || undefined,
        expressAvailable: selectedItem.expressAvailable || false,
        expressTimeHours: selectedItem.expressTimeHours || undefined,
        expressPrice: selectedItem.expressPrice ? selectedItem.expressPrice / 100 : undefined,
        sortOrder: selectedItem.sortOrder || undefined,
        description: selectedItem.description || '',
      });
    } else {
      reset({
        active: true,
        expressAvailable: false,
        basePrice: 0,
        nameUa: '',
        name: '',
        description: '',
        priceBlack: undefined,
        priceColor: undefined,
        processingTimeDays: undefined,
        expressTimeHours: undefined,
        expressPrice: undefined,
        sortOrder: undefined,
      });
    }
  }, [selectedItem, reset]);

  const expressAvailable = watch('expressAvailable');

  const handleClose = () => {
    setFormOpen(false);
    setSelectedItem(null);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      const priceInKopiykas = (price: number | null | undefined) =>
        price !== null && price !== undefined ? Math.round(price * 100) : undefined;

      // Підготовка даних з конвертацією цін в копійки
      const preparedData = {
        ...data,
        basePrice: Math.round(data.basePrice * 100),
        priceBlack: priceInKopiykas(data.priceBlack),
        priceColor: priceInKopiykas(data.priceColor),
        expressPrice: priceInKopiykas(data.expressPrice),
        processingTimeDays: data.processingTimeDays || undefined,
        expressTimeHours: data.expressTimeHours || undefined,
        sortOrder: data.sortOrder || undefined,
      };

      if (selectedItem) {
        // При оновленні не передаємо незмінні поля (categoryCode, catalogNumber, unitOfMeasure)
        const updateData: UpdatePriceListItemRequest = {
          name: preparedData.name,
          nameUa: preparedData.nameUa,
          description: preparedData.description,
          basePrice: preparedData.basePrice,
          priceBlack: preparedData.priceBlack,
          priceColor: preparedData.priceColor,
          active: preparedData.active,
          processingTimeDays: preparedData.processingTimeDays,
          expressAvailable: preparedData.expressAvailable,
          expressTimeHours: preparedData.expressTimeHours,
          expressPrice: preparedData.expressPrice,
          sortOrder: preparedData.sortOrder,
        };
        await updateMutation.mutateAsync({
          priceListItemId: selectedItem.id,
          data: updateData,
        });
      } else {
        await createMutation.mutateAsync({
          data: preparedData as CreatePriceListItemRequest,
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
        <DialogTitle>{selectedItem ? 'Редагувати послугу' : 'Додати послугу'}</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="subtitle2" gutterBottom>
                Основна інформація
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="categoryCode"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.categoryCode} disabled={!!selectedItem}>
                    <InputLabel>Категорія</InputLabel>
                    <Select {...field} label="Категорія">
                      {Object.entries(CATEGORY_LABELS).map(([code, label]) => (
                        <MenuItem key={code} value={code}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="catalogNumber"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Номер в каталозі"
                    type="number"
                    disabled={!!selectedItem}
                    error={!!errors.catalogNumber}
                    helperText={errors.catalogNumber?.message}
                    onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="nameUa"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Назва українською"
                    error={!!errors.nameUa}
                    helperText={errors.nameUa?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Назва англійською"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Опис"
                    multiline
                    rows={2}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Ціни та одиниці виміру
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="unitOfMeasure"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.unitOfMeasure} disabled={!!selectedItem}>
                    <InputLabel>Одиниця виміру</InputLabel>
                    <Select {...field} label="Одиниця виміру">
                      {Object.entries(UNIT_LABELS).map(([code, label]) => (
                        <MenuItem key={code} value={code}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="basePrice"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Базова ціна"
                    type="number"
                    error={!!errors.basePrice}
                    helperText={errors.basePrice?.message}
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">₴</InputAdornment>,
                      },
                    }}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="priceBlack"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value || ''}
                    fullWidth
                    label="Ціна фарбування (чорне)"
                    type="number"
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">₴</InputAdornment>,
                      },
                    }}
                    onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="priceColor"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value || ''}
                    fullWidth
                    label="Ціна фарбування (кольорове)"
                    type="number"
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">₴</InputAdornment>,
                      },
                    }}
                    onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Терміни та експрес
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="processingTimeDays"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value || ''}
                    fullWidth
                    label="Термін виконання"
                    type="number"
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">днів</InputAdornment>,
                      },
                    }}
                    onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="expressAvailable"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Доступна експрес-послуга"
                  />
                )}
              />
            </Grid>

            {expressAvailable && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="expressTimeHours"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <TextField
                        {...field}
                        value={value || ''}
                        fullWidth
                        label="Термін експрес-послуги"
                        type="number"
                        slotProps={{
                          input: {
                            endAdornment: <InputAdornment position="end">годин</InputAdornment>,
                          },
                        }}
                        onChange={(e) =>
                          onChange(e.target.value ? parseInt(e.target.value, 10) : null)
                        }
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="expressPrice"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <TextField
                        {...field}
                        value={value || ''}
                        fullWidth
                        label="Ціна експрес-послуги"
                        type="number"
                        slotProps={{
                          input: {
                            endAdornment: <InputAdornment position="end">₴</InputAdornment>,
                          },
                        }}
                        onChange={(e) =>
                          onChange(e.target.value ? parseFloat(e.target.value) : null)
                        }
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Додаткові параметри
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="sortOrder"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value || ''}
                    fullWidth
                    label="Порядок сортування"
                    type="number"
                    onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Активна послуга"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Скасувати</Button>
          <Button type="submit" variant="contained">
            {selectedItem ? 'Зберегти' : 'Додати'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
