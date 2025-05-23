'use client';

import { Info, Category, ShoppingCart, Euro } from '@mui/icons-material';
import { Grid, Paper } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';

import { SectionHeader, FormField, StatusMessage } from '../atoms';
import {
  ServiceCategorySelector,
  ItemSummaryCard,
  PriceDisplay,
  QuantityField,
} from '../molecules';

interface ServiceCategory {
  value: string;
  label: string;
  description: string;
  unitOfMeasure: string;
}

interface ItemBasicInfoData {
  category: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitOfMeasure: string;
  description: string;
}

interface ValidationErrors {
  category?: string;
  name?: string;
  quantity?: string;
  unitPrice?: string;
}

interface ItemBasicInfoFormProps {
  data: ItemBasicInfoData;
  categories: ServiceCategory[];
  itemNames: string[];
  validation: ValidationErrors;
  isLoadingItems?: boolean;
  onCategoryChange: (event: SelectChangeEvent<string>) => void;
  onItemNameChange: (event: React.SyntheticEvent, value: string | null) => void;
  onQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Форма для введення основної інформації про предмет
 */
export const ItemBasicInfoForm: React.FC<ItemBasicInfoFormProps> = ({
  data,
  categories,
  itemNames,
  validation,
  isLoadingItems = false,
  onCategoryChange,
  onItemNameChange,
  onQuantityChange,
  onPriceChange,
  onDescriptionChange,
}) => {
  const hasCategory = !!data.category;
  const hasItems = itemNames.length > 0;
  const isFormValid = !!(data.category && data.name && data.quantity > 0 && data.unitPrice > 0);
  const totalPrice = data.quantity * data.unitPrice;

  return (
    <>
      {/* Категорія послуги */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <SectionHeader icon={Category} title="Категорія послуги" />

        <ServiceCategorySelector
          categories={categories}
          value={data.category}
          onChange={onCategoryChange}
          error={validation.category}
        />
      </Paper>

      {/* Статусні повідомлення */}
      <StatusMessage
        message="Оберіть категорію послуги для продовження. Список доступних виробів оновиться автоматично."
        severity="info"
        show={!hasCategory}
      />

      <StatusMessage
        message="Для обраної категорії поки що немає доступних виробів у прайс-листі."
        severity="warning"
        show={hasCategory && !hasItems && !isLoadingItems}
      />

      {/* Найменування та характеристики */}
      {hasCategory && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <SectionHeader icon={ShoppingCart} title="Найменування та параметри" />

          <Grid container spacing={3}>
            {/* Найменування виробу */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField
                type="autocomplete"
                label="Найменування виробу"
                options={itemNames}
                value={data.name}
                onChange={onItemNameChange}
                freeSolo
                placeholder="Оберіть або введіть найменування"
                error={validation.name}
                helperText="Оберіть зі списку або введіть власне найменування"
                startIcon={<ShoppingCart />}
              />
            </Grid>

            {/* Кількість */}
            <QuantityField
              quantity={data.quantity}
              unitOfMeasure={data.unitOfMeasure}
              onQuantityChange={onQuantityChange}
              error={validation.quantity}
            />

            {/* Ціна за одиницю */}
            <Grid size={{ xs: 12, md: 3 }}>
              <FormField
                type="number"
                label="Ціна за одиницю"
                value={data.unitPrice}
                onChange={onPriceChange}
                error={validation.unitPrice}
                helperText="Базова ціна з прайсу"
                inputProps={{ min: 0, step: 0.01 }}
                startIcon={<Euro />}
                endIcon="грн"
              />
            </Grid>

            {/* Опис (додатково) */}
            <Grid size={{ xs: 12 }}>
              <FormField
                type="text"
                label="Додатковий опис (необов'язково)"
                placeholder="Додайте специфічні деталі про предмет..."
                value={data.description}
                onChange={onDescriptionChange}
                multiline
                rows={2}
                startIcon={<Info />}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Попередня вартість */}
      {data.name && data.unitPrice > 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <PriceDisplay
              basePrice={data.unitPrice}
              quantity={data.quantity}
              totalPrice={totalPrice}
              unitOfMeasure={data.unitOfMeasure}
            />
          </Grid>
        </Grid>
      )}

      {/* Підсумок */}
      {data.name && (
        <ItemSummaryCard
          data={{
            name: data.name,
            quantity: data.quantity,
            unitOfMeasure: data.unitOfMeasure,
            unitPrice: data.unitPrice,
          }}
        />
      )}

      {/* Успішне заповнення */}
      <StatusMessage
        message="Основну інформацію заповнено. Можете переходити до наступного кроку."
        severity="success"
        show={isFormValid}
      />
    </>
  );
};
