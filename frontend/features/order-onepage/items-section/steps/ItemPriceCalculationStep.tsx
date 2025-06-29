'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Stack,
  Button,
  Typography,
  Alert,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack, ArrowForward, ExpandMore, Calculate } from '@mui/icons-material';
import { useOrderOnepageStore } from '../../store/order-onepage.store';
import {
  useSubstep4CalculatePrice,
  useSubstep4AddModifier,
  useSubstep4RemoveModifier,
  useSubstep4ConfirmCalculation,
} from '@/shared/api/generated/substep4';

interface ItemPriceCalculationStepProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

// Загальні модифікатори
const generalModifiers = [
  {
    value: 'children_discount',
    label: 'Дитячі речі (до 30 розміру)',
    type: 'discount',
    percent: -30,
  },
  { value: 'manual_cleaning', label: 'Ручна чистка', type: 'surcharge', percent: 20 },
  { value: 'very_dirty', label: 'Дуже забруднені речі', type: 'surcharge', percent: 50 },
  { value: 'urgent_48h', label: 'Термінова чистка (48 год)', type: 'surcharge', percent: 50 },
  { value: 'urgent_24h', label: 'Термінова чистка (24 год)', type: 'surcharge', percent: 100 },
];

// Модифікатори для текстилю
const textileModifiers = [
  { value: 'fur_elements', label: 'Хутряні коміри та манжети', type: 'surcharge', percent: 30 },
  { value: 'water_repellent', label: 'Водовідштовхуюче покриття', type: 'surcharge', percent: 30 },
  { value: 'silk_atlas', label: 'Натуральний шовк/атлас', type: 'surcharge', percent: 50 },
  {
    value: 'combined_materials',
    label: 'Комбіновані вироби (шкіра+текстиль)',
    type: 'surcharge',
    percent: 100,
  },
  { value: 'large_toys', label: "Великі м'які іграшки (ручна)", type: 'surcharge', percent: 100 },
  { value: 'dark_light_colors', label: 'Чорні/світлі тони', type: 'surcharge', percent: 20 },
  { value: 'wedding_dress', label: 'Весільна сукня зі шлейфом', type: 'surcharge', percent: 30 },
];

// Модифікатори для шкіри
const leatherModifiers = [
  {
    value: 'leather_ironing',
    label: 'Прасування шкіряних виробів',
    type: 'percentage',
    percent: 70,
  },
  {
    value: 'leather_water_repellent',
    label: 'Водовідштовхуюче покриття',
    type: 'surcharge',
    percent: 30,
  },
  {
    value: 'dyeing_after_our',
    label: 'Фарбування (після нашої чистки)',
    type: 'surcharge',
    percent: 50,
  },
  {
    value: 'dyeing_after_other',
    label: 'Фарбування (після чистки деінде)',
    type: 'surcharge',
    percent: 100,
  },
  { value: 'leather_inserts', label: 'Вставки (інші матеріали)', type: 'surcharge', percent: 30 },
  { value: 'pearl_coating', label: 'Перламутрове покриття', type: 'surcharge', percent: 30 },
  { value: 'artificial_fur', label: 'Штучне хутро на дублянках', type: 'discount', percent: -20 },
  { value: 'manual_leather', label: 'Ручна чистка шкіри', type: 'surcharge', percent: 30 },
];

export const ItemPriceCalculationStep = ({
  data,
  onDataChange,
  onNext,
  onBack,
}: ItemPriceCalculationStepProps) => {
  const { sessionId } = useOrderOnepageStore();
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>(data.modifiers || []);
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);

  const calculatePrice = useSubstep4CalculatePrice();
  const addModifier = useSubstep4AddModifier();
  const removeModifier = useSubstep4RemoveModifier();
  const confirmCalculation = useSubstep4ConfirmCalculation();

  // Автоматичний перерахунок при зміні модифікаторів
  useEffect(() => {
    if (sessionId && data.categoryCode && (selectedModifiers.length > 0 || data.basePrice)) {
      handleCalculatePrice();
    }
  }, [selectedModifiers, sessionId, data.categoryCode]);

  const handleCalculatePrice = async () => {
    if (!sessionId) return;

    try {
      const result = await calculatePrice.mutateAsync({
        data: {
          calculationRequest: {
            categoryCode: data.categoryCode || 'CLOTHING',
            itemName: data.itemName || '',
            color: data.color || 'STANDARD',
            quantity: data.quantity || 1,
            modifierCodes: selectedModifiers,
          },
        },
      });

      setPriceBreakdown(result);
    } catch (error) {
      console.error('Помилка розрахунку ціни:', error);
    }
  };

  const handleModifierChange = async (modifierValue: string, checked: boolean) => {
    if (!sessionId) return;

    try {
      if (checked) {
        await addModifier.mutateAsync({
          sessionId,
          data: { modifierId: modifierValue },
        });
        setSelectedModifiers((prev) => [...prev, modifierValue]);
      } else {
        await removeModifier.mutateAsync({
          sessionId,
          modifierId: modifierValue,
        });
        setSelectedModifiers((prev) => prev.filter((m) => m !== modifierValue));
      }
    } catch (error) {
      console.error('Помилка зміни модифікатора:', error);
    }
  };

  const handleNext = async () => {
    if (!sessionId || !priceBreakdown) return;

    try {
      await confirmCalculation.mutateAsync({
        sessionId,
      });

      onDataChange({
        modifiers: selectedModifiers,
        priceBreakdown,
        finalPrice: priceBreakdown.finalPrice,
      });
      onNext();
    } catch (error) {
      console.error('Помилка підтвердження розрахунку:', error);
    }
  };

  const getModifiersByCategory = () => {
    const categoryCode = data.categoryCode;
    let availableModifiers = [...generalModifiers];

    // Текстильні категорії
    if (['CLOTHING', 'IRONING', 'PADDING', 'DYEING', 'LAUNDRY'].includes(categoryCode)) {
      availableModifiers = [...availableModifiers, ...textileModifiers];
    }
    // Шкіряні категорії
    else if (['LEATHER', 'FUR'].includes(categoryCode)) {
      availableModifiers = [...availableModifiers, ...leatherModifiers];
    }

    return availableModifiers;
  };

  const availableModifiers = getModifiersByCategory();
  const isLoading =
    calculatePrice.isPending ||
    addModifier.isPending ||
    removeModifier.isPending ||
    confirmCalculation.isPending;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Розрахунок ціни
      </Typography>

      <Stack spacing={3}>
        {/* Базова інформація */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Базова інформація
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label={`Категорія: ${data.categoryCode || 'Не вибрано'}`} color="secondary" />
            <Chip label={`Предмет: ${data.itemName || 'Не вибрано'}`} />
            <Chip label={`Кількість: ${data.quantity || 1} ${data.unit || 'шт'}`} />
            <Chip label={`Базова ціна: ${data.basePrice || 0} ₴`} color="primary" />
          </Stack>
        </Paper>

        {/* Модифікатори */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Модифікатори ціни
          </Typography>
          <FormGroup>
            {availableModifiers.map((modifier) => (
              <FormControlLabel
                key={modifier.value}
                control={
                  <Checkbox
                    checked={selectedModifiers.includes(modifier.value)}
                    onChange={(e) => handleModifierChange(modifier.value, e.target.checked)}
                    disabled={isLoading}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">{modifier.label}</Typography>
                    <Chip
                      size="small"
                      label={`${modifier.percent > 0 ? '+' : ''}${modifier.percent}%`}
                      color={modifier.type === 'discount' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </Paper>

        {/* Кнопка розрахунку */}
        <Button
          variant="outlined"
          startIcon={<Calculate />}
          onClick={handleCalculatePrice}
          disabled={isLoading}
          fullWidth
        >
          {calculatePrice.isPending ? 'Розрахунок...' : 'Перерахувати ціну'}
        </Button>

        {/* Деталізація розрахунку */}
        {priceBreakdown && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">
                Деталізація розрахунку - Підсумок: {priceBreakdown.finalPrice?.toFixed(2)} ₴
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Опис</TableCell>
                      <TableCell align="right">Сума</TableCell>
                      <TableCell align="right">Накопичувально</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Базова ціна</TableCell>
                      <TableCell align="right">{priceBreakdown.basePrice?.toFixed(2)} ₴</TableCell>
                      <TableCell align="right">{priceBreakdown.basePrice?.toFixed(2)} ₴</TableCell>
                    </TableRow>
                    {priceBreakdown.modifierDetails?.map((detail: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{detail.name}</TableCell>
                        <TableCell align="right">
                          {detail.amount > 0 ? '+' : ''}
                          {detail.amount?.toFixed(2)} ₴
                        </TableCell>
                        <TableCell align="right">{detail.runningTotal?.toFixed(2)} ₴</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                      <TableCell>
                        <strong>Загальна вартість</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{priceBreakdown.finalPrice?.toFixed(2)} ₴</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{priceBreakdown.finalPrice?.toFixed(2)} ₴</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Кнопки навігації */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button onClick={onBack} startIcon={<ArrowBack />} variant="outlined" sx={{ flex: 1 }}>
            Назад
          </Button>
          <Button
            onClick={handleNext}
            variant="contained"
            endIcon={<ArrowForward />}
            disabled={!priceBreakdown || isLoading}
            sx={{ flex: 1 }}
          >
            {confirmCalculation.isPending ? 'Збереження...' : 'Далі'}
          </Button>
        </Stack>

        {/* Помилки */}
        {(calculatePrice.error ||
          addModifier.error ||
          removeModifier.error ||
          confirmCalculation.error) && <Alert severity="error">Помилка розрахунку ціни</Alert>}
      </Stack>
    </Box>
  );
};
