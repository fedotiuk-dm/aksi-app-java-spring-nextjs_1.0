import React from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { PriceListItemDTO } from '@/features/order-wizard/api/stages/stage2';
import { ItemBasicInfoFormValues } from '@/features/order-wizard/model/schema/item-basic-info.schema';
import {
  formatCurrency,
  translateUnitOfMeasure,
} from '@/features/order-wizard/api/helpers/formatters';

interface ItemNameSelectProps {
  itemNames: PriceListItemDTO[];
  control: Control<ItemBasicInfoFormValues>;
  errors: FieldErrors<ItemBasicInfoFormValues>;
  disabled?: boolean;
  onChange: (itemId: string) => void;
}

export const ItemNameSelect = ({
  itemNames,
  control,
  errors,
  disabled = false,
  onChange,
}: ItemNameSelectProps) => {
  // Виводимо список всіх товарів для дебагу
  console.log('Отримані дані з API (всі товари):', itemNames);

  // Якщо є товари, перевіряємо наявність всіх цінових полів у першого товару
  if (itemNames.length > 0) {
    const firstItem = itemNames[0];
    console.log('Деталі першого товару:', {
      id: firstItem.id,
      name: firstItem.name,
      basePrice: firstItem.basePrice,
      priceBlack: firstItem.priceBlack,
      priceColor: firstItem.priceColor,
      типБазовоїЦіни: typeof firstItem.basePrice,
      типЧорноїЦіни: typeof firstItem.priceBlack,
      типКольоровоїЦіни: typeof firstItem.priceColor,
    });
  }

  // Сортування товарів за номером каталогу та назвою
  const sortedItems = [...itemNames].sort((a, b) => {
    // Спочатку сортуємо за номером каталогу, якщо він є
    if (a.catalogNumber && b.catalogNumber) {
      return a.catalogNumber - b.catalogNumber;
    } else if (a.catalogNumber) {
      return -1; // a має номер, b - немає
    } else if (b.catalogNumber) {
      return 1; // b має номер, a - немає
    }

    // Якщо номери каталогу відсутні або однакові, сортуємо за назвою
    return (a.name || '').localeCompare(b.name || '');
  });

  return (
    <Controller
      name="itemNameId"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors.itemNameId} disabled={disabled}>
          <InputLabel id="item-name-select-label">
            Найменування виробу
          </InputLabel>
          <Select
            labelId="item-name-select-label"
            id="item-name-select"
            label="Найменування виробу"
            {...field}
            onChange={(e) => {
              field.onChange(e);
              onChange(e.target.value as string);
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 400,
                },
              },
            }}
            renderValue={(selected) => {
              const item = itemNames.find((item) => item.id === selected);
              if (!item) return null;

              // Додаткова перевірка наявності цінових даних
              console.log('Вибраний товар (детально):', {
                id: item.id,
                name: item.name,
                basePrice: item.basePrice,
                priceBlack: item.priceBlack,
                priceColor: item.priceColor,
                catalogNumber: item.catalogNumber,
                unitOfMeasure: item.unitOfMeasure,
              });

              // Конвертуємо значення цін у числовий формат
              const basePriceNum = Number(item.basePrice || 0);
              const priceBlackNum =
                item.priceBlack !== null && item.priceBlack !== undefined
                  ? Number(item.priceBlack)
                  : null;
              const priceColorNum =
                item.priceColor !== null && item.priceColor !== undefined
                  ? Number(item.priceColor)
                  : null;

              console.log('Конвертовані числові ціни:', {
                basePriceNum,
                priceBlackNum,
                priceColorNum,
                hasBlackPrice: priceBlackNum !== null && priceBlackNum > 0,
                hasColorPrice: priceColorNum !== null && priceColorNum > 0,
              });

              return (
                <Box sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body1">
                      {item.catalogNumber && `№${item.catalogNumber} - `}
                      {item.name}
                      {item.unitOfMeasure &&
                        ` (${translateUnitOfMeasure(item.unitOfMeasure)})`}
                    </Typography>
                  </Box>

                  {/* Всі ціни */}
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    {/* Базова ціна */}
                    <Grid size={{ xs: 'auto' }}>
                      <Chip
                        label={`Базова: ${formatCurrency(basePriceNum)}`}
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Grid>

                    {/* Чорний колір */}
                    {priceBlackNum !== null && priceBlackNum > 0 && (
                      <Grid size={{ xs: 'auto' }}>
                        <Chip
                          label={`Чорний: ${formatCurrency(priceBlackNum)}`}
                          variant="outlined"
                          sx={{ bgcolor: 'grey.200', fontWeight: 'bold' }}
                        />
                      </Grid>
                    )}

                    {/* Кольоровий */}
                    {priceColorNum !== null && priceColorNum > 0 && (
                      <Grid size={{ xs: 'auto' }}>
                        <Chip
                          label={`Кольоровий: ${formatCurrency(priceColorNum)}`}
                          variant="outlined"
                          sx={{
                            bgcolor: 'amber.50',
                            fontWeight: 'bold',
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>
              );
            }}
          >
            {sortedItems.length === 0 ? (
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  Спочатку виберіть категорію
                </Typography>
              </MenuItem>
            ) : (
              sortedItems.map((item) => (
                <MenuItem key={item.id} value={item.id} sx={{ pt: 2, pb: 2 }}>
                  <Box sx={{ width: '100%' }}>
                    {/* Назва та номер каталогу */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {item.catalogNumber && (
                            <Typography
                              component="span"
                              sx={{ color: 'text.secondary', mr: 1 }}
                            >
                              №{item.catalogNumber}
                            </Typography>
                          )}
                          {item.name}
                        </Typography>
                        {item.unitOfMeasure && (
                          <Typography variant="body2" color="text.secondary">
                            Одиниця виміру:{' '}
                            {translateUnitOfMeasure(item.unitOfMeasure)}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Ціни у великому форматі */}
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      {/* Базова ціна */}
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Chip
                          label={`Базова: ${formatCurrency(
                            Number(item.basePrice || 0)
                          )}`}
                          color="primary"
                          sx={{
                            fontWeight: 'bold',
                            width: '100%',
                            height: 'auto',
                            py: 1,
                          }}
                        />
                      </Grid>

                      {/* Чорний колір */}
                      {item.priceBlack !== undefined &&
                        item.priceBlack !== null &&
                        Number(item.priceBlack) > 0 && (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Chip
                              label={`Чорний: ${formatCurrency(
                                Number(item.priceBlack)
                              )}`}
                              variant="outlined"
                              sx={{
                                bgcolor: 'grey.200',
                                fontWeight: 'bold',
                                width: '100%',
                                height: 'auto',
                                py: 1,
                              }}
                            />
                          </Grid>
                        )}

                      {/* Кольоровий */}
                      {item.priceColor !== undefined &&
                        item.priceColor !== null &&
                        Number(item.priceColor) > 0 && (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Chip
                              label={`Кольоровий: ${formatCurrency(
                                Number(item.priceColor)
                              )}`}
                              variant="outlined"
                              sx={{
                                bgcolor: 'amber.50',
                                fontWeight: 'bold',
                                width: '100%',
                                height: 'auto',
                                py: 1,
                              }}
                            />
                          </Grid>
                        )}
                    </Grid>
                  </Box>
                </MenuItem>
              ))
            )}
          </Select>
          {errors.itemNameId && (
            <FormHelperText>{errors.itemNameId.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
