'use client';

import {
  Calculate,
  AttachMoney,
  TrendingUp,
  LocalOffer,
  Info,
  CheckCircle,
  Warning,
  ExpandMore,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Paper,
  Alert,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import React, { useState, useCallback, useMemo } from 'react';

import { useItemWizard, PriceCalculator } from '@/domain/order';

import { StepContainer } from '../../../shared/ui/step-container';
import { StepNavigation } from '../../../shared/ui/step-navigation';

/**
 * Підкрок 2.4: Розрахунок ціни (калькулятор ціни)
 *
 * Згідно з документацією Order Wizard:
 * - Базова ціна (автоматично з прайсу)
 * - Коефіцієнти і модифікатори (динамічно відображаються відповідно до категорії)
 * - Інтерактивний розрахунок ціни з деталізацією
 */
export const PriceCalculatorStep: React.FC = () => {
  // Отримуємо функціональність Item Wizard з domain layer
  const { itemData, validation, canProceed, updatePriceModifiers, wizard } = useItemWizard();

  // Локальний стан для модифікаторів
  const [expandedSections, setExpandedSections] = useState<string[]>(['general']);
  const [isCalculating, setIsCalculating] = useState(false);

  // Загальні коефіцієнти (доступні для всіх категорій)
  const generalModifiers = [
    {
      id: 'childSized',
      label: 'Дитячі речі (до 30 розміру)',
      description: '30% знижка від вартості',
      value: -30,
      type: 'PERCENTAGE' as const,
      applicable: true,
    },
    {
      id: 'manualCleaning',
      label: 'Ручна чистка',
      description: '+20% до вартості',
      value: 20,
      type: 'PERCENTAGE' as const,
      applicable: true,
    },
    {
      id: 'heavilySoiled',
      label: 'Дуже забруднені речі',
      description: 'Додаткова надбавка (20-100%)',
      value: 0,
      type: 'PERCENTAGE' as const,
      applicable: true,
      customizable: true,
      min: 20,
      max: 100,
    },
  ];

  // Модифікатори для текстильних виробів
  const textileModifiers = [
    {
      id: 'furCollarsCuffs',
      label: 'Вироби з хутряними комірами та манжетами',
      description: '+30% до вартості чистки',
      value: 30,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'waterRepellent',
      label: 'Нанесення водовідштовхуючого покриття',
      description: '+30% до вартості',
      value: 30,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'silkChiffon',
      label: 'Натуральний шовк, атлас, шифон',
      description: '+50% до вартості',
      value: 50,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'combinedLeatherTextile',
      label: 'Комбіновані вироби (шкіра+текстиль)',
      description: '+100% до вартості чистки текстилю',
      value: 100,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'largeToys',
      label: "Великі м'які іграшки (ручна чистка)",
      description: '+100% до вартості чистки',
      value: 100,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'buttonSewing',
      label: 'Пришивання гудзиків',
      description: 'Фіксована вартість за одиницю',
      value: 25,
      type: 'FIXED_AMOUNT' as const,
    },
    {
      id: 'blackWhiteColors',
      label: 'Чорні та світлі тони',
      description: '+20% до вартості',
      value: 20,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'weddingDress',
      label: 'Весільна сукня зі шлейфом',
      description: '+30% до вартості',
      value: 30,
      type: 'PERCENTAGE' as const,
    },
  ];

  // Модифікатори для шкіряних виробів
  const leatherModifiers = [
    {
      id: 'leatherIroning',
      label: 'Прасування шкіряних виробів',
      description: '70% від вартості чистки',
      value: 70,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'leatherWaterRepellent',
      label: 'Водовідштовхуюче покриття',
      description: '+30% до вартості послуги',
      value: 30,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'dyeingAfterOur',
      label: 'Фарбування (після нашої чистки)',
      description: '+50% до вартості послуги',
      value: 50,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'dyeingAfterOther',
      label: 'Фарбування (після чистки деінде)',
      description: '100% вартість чистки',
      value: 100,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'leatherInserts',
      label: 'Вироби із вставками',
      description: '+30% до вартості (шкіра іншого кольору, текстиль, хутро)',
      value: 30,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'pearlCoating',
      label: 'Перламутрове покриття',
      description: '+30% до вартості послуги',
      value: 30,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'syntheticFur',
      label: 'Натуральні дублянки на штучному хутрі',
      description: '-20% від вартості',
      value: -20,
      type: 'PERCENTAGE' as const,
    },
    {
      id: 'leatherButtonSewing',
      label: 'Пришивання гудзиків',
      description: 'Фіксована вартість за одиницю',
      value: 25,
      type: 'FIXED_AMOUNT' as const,
    },
    {
      id: 'manualLeatherCleaning',
      label: 'Ручна чистка виробів зі шкіри',
      description: '+30% до вартості чистки',
      value: 30,
      type: 'PERCENTAGE' as const,
    },
  ];

  /**
   * Перевірка чи категорія підтримує певні модифікатори
   */
  const isTextileCategory = useMemo(() => {
    return ['CLEANING_TEXTILES', 'LAUNDRY', 'IRONING', 'TEXTILE_DYEING'].includes(
      itemData.category
    );
  }, [itemData.category]);

  const isLeatherCategory = useMemo(() => {
    return ['LEATHER_CLEANING', 'SHEEPSKIN_CLEANING'].includes(itemData.category);
  }, [itemData.category]);

  /**
   * Отримання списку застосованих модифікаторів
   */
  const getAppliedModifiers = useCallback((): string[] => {
    const applied: string[] = [];

    if (itemData.childSized) applied.push('CHILD_SIZED');
    if (itemData.manualCleaning) applied.push('MANUAL_CLEANING');
    if (itemData.heavilySoiled) applied.push('HEAVILY_SOILED');

    return applied;
  }, [itemData.childSized, itemData.manualCleaning, itemData.heavilySoiled]);

  /**
   * Розрахунок ціни в реальному часі
   */
  const priceCalculation = useMemo(() => {
    if (!itemData.name || !itemData.unitPrice) {
      return null;
    }

    setIsCalculating(true);

    try {
      // Створюємо тимчасовий OrderItem для розрахунку
      const tempOrderItem = {
        id: 'temp',
        orderId: 'temp',
        name: itemData.name,
        category: itemData.category,
        quantity: itemData.quantity,
        unitPrice: itemData.unitPrice,
        material: itemData.material,
        color: itemData.color,
        // Додаємо модифікатори з поточного стану
        modifiersApplied: getAppliedModifiers(),
      };

      const calculation = PriceCalculator.calculateItemWithModifiers(tempOrderItem as any);

      setTimeout(() => setIsCalculating(false), 300); // Симуляція розрахунку

      return calculation;
    } catch (error) {
      console.error('Error calculating price:', error);
      setIsCalculating(false);
      return null;
    }
  }, [itemData, getAppliedModifiers]);

  /**
   * Обробник зміни загальних модифікаторів
   */
  const handleGeneralModifierChange = (
    modifierId: string,
    checked: boolean,
    customValue?: number
  ) => {
    const updates: any = {};

    switch (modifierId) {
      case 'childSized':
        updates.childSized = checked;
        break;
      case 'manualCleaning':
        updates.manualCleaning = checked;
        break;
      case 'heavilySoiled':
        updates.heavilySoiled = checked;
        if (checked && customValue !== undefined) {
          updates.heavilySoiledPercentage = customValue;
        }
        break;
    }

    updatePriceModifiers(updates);
  };

  /**
   * Обробник розгортання секцій
   */
  const handleSectionToggle = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  /**
   * Обробник переходу до наступного підкроку
   */
  const handleNext = () => {
    if (canProceed) {
      const result = wizard.navigateForward();
      if (result.success) {
        console.log('Перехід до фотодокументації');
      } else {
        console.error('Помилка переходу:', result.errors);
      }
    }
  };

  /**
   * Обробник повернення до попереднього підкроку
   */
  const handleBack = () => {
    const result = wizard.navigateBack();
    if (result.success) {
      console.log('Повернення до дефектів');
    } else {
      console.error('Помилка повернення:', result.errors);
    }
  };

  return (
    <StepContainer
      title="Розрахунок ціни"
      subtitle="Налаштуйте модифікатори ціни та переглядайте детальний розрахунок вартості"
    >
      <Box sx={{ minHeight: '400px' }}>
        {/* Базова інформація та ціна */}
        <Card sx={{ mb: 3, bgcolor: 'primary.light' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney color="primary" />
              Базова інформація
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body1">
                  <strong>Предмет:</strong> {itemData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Категорія: {itemData.category}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="body1">
                  <strong>Кількість:</strong> {itemData.quantity} {itemData.unitOfMeasure}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography variant="h6" color="primary">
                  <strong>Базова ціна:</strong>{' '}
                  {(itemData.unitPrice * itemData.quantity).toFixed(2)} грн
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Загальні модифікатори */}
        <Accordion
          expanded={expandedSections.includes('general')}
          onChange={() => handleSectionToggle('general')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalOffer color="primary" />
              Загальні коефіцієнти
              <Chip label="Для всіх категорій" size="small" variant="outlined" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                {generalModifiers.map((modifier) => (
                  <Box key={modifier.id} sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={Boolean((itemData as any)[modifier.id])}
                          onChange={(e) =>
                            handleGeneralModifierChange(modifier.id, e.target.checked)
                          }
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1">{modifier.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {modifier.description}
                          </Typography>
                        </Box>
                      }
                    />

                    {/* Кастомне поле для відсотка забруднення */}
                    {modifier.id === 'heavilySoiled' && itemData.heavilySoiled && (
                      <TextField
                        size="small"
                        type="number"
                        label="Відсоток надбавки"
                        value={itemData.heavilySoiledPercentage || 20}
                        onChange={(e) =>
                          handleGeneralModifierChange(modifier.id, true, Number(e.target.value))
                        }
                        inputProps={{ min: 20, max: 100 }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ ml: 4, mt: 1, width: 150 }}
                      />
                    )}
                  </Box>
                ))}
              </FormGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Модифікатори для текстилю */}
        {isTextileCategory && (
          <Accordion
            expanded={expandedSections.includes('textile')}
            onChange={() => handleSectionToggle('textile')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="secondary" />
                Модифікатори для текстильних виробів
                <Chip label="Текстиль" size="small" color="secondary" variant="outlined" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" sx={{ mb: 2 }}>
                Доступно для категорій: чистка одягу, прання, прасування, фарбування
              </Alert>
              <FormControl component="fieldset" fullWidth>
                <FormGroup>
                  {textileModifiers.map((modifier) => (
                    <FormControlLabel
                      key={modifier.id}
                      control={<Checkbox />}
                      label={
                        <Box>
                          <Typography variant="body1">{modifier.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {modifier.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Модифікатори для шкіри */}
        {isLeatherCategory && (
          <Accordion
            expanded={expandedSections.includes('leather')}
            onChange={() => handleSectionToggle('leather')}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="warning" />
                Модифікатори для шкіряних виробів
                <Chip label="Шкіра" size="small" color="warning" variant="outlined" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Alert severity="info" sx={{ mb: 2 }}>
                Доступно для категорій: чистка шкіряних виробів, дублянки
              </Alert>
              <FormControl component="fieldset" fullWidth>
                <FormGroup>
                  {leatherModifiers.map((modifier) => (
                    <FormControlLabel
                      key={modifier.id}
                      control={<Checkbox />}
                      label={
                        <Box>
                          <Typography variant="body1">{modifier.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {modifier.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Детальний розрахунок ціни */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calculate color="primary" />
            Детальний розрахунок
            {isCalculating && <LinearProgress sx={{ ml: 2, flexGrow: 1, height: 4 }} />}
          </Typography>

          {priceCalculation ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Компонент</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Вплив</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Сума</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Базова ціна</TableCell>
                    <TableCell align="right">—</TableCell>
                    <TableCell align="right">{priceCalculation.basePrice.toFixed(2)} грн</TableCell>
                  </TableRow>

                  {priceCalculation.modifiers.map((modifier, index) => (
                    <TableRow key={index}>
                      <TableCell>{modifier.name}</TableCell>
                      <TableCell align="right">
                        {modifier.type === 'PERCENTAGE'
                          ? `${modifier.value > 0 ? '+' : ''}${modifier.value}%`
                          : `${modifier.value} грн`}
                      </TableCell>
                      <TableCell align="right">
                        {modifier.type === 'PERCENTAGE'
                          ? `${((priceCalculation.basePrice * modifier.value) / 100).toFixed(2)} грн`
                          : `${modifier.value.toFixed(2)} грн`}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow sx={{ bgcolor: 'primary.light' }}>
                    <TableCell>
                      <strong>Підсумкова ціна</strong>
                    </TableCell>
                    <TableCell align="right">—</TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" color="primary">
                        <strong>{priceCalculation.finalPrice.toFixed(2)} грн</strong>
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="warning">
              <Typography variant="body2">
                Заповніть базову інформацію про предмет для отримання розрахунку ціни
              </Typography>
            </Alert>
          )}
        </Paper>

        {/* Результат та валідація */}
        {priceCalculation && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle />
              <Typography variant="body1">
                <strong>Розрахунок завершено!</strong> Фінальна вартість:{' '}
                {priceCalculation.finalPrice.toFixed(2)} грн
              </Typography>
            </Box>
          </Alert>
        )}

        {validation.priceCalculator.errors &&
          Object.keys(validation.priceCalculator.errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Виправте помилки: {Object.values(validation.priceCalculator.errors).join(', ')}
              </Typography>
            </Alert>
          )}
      </Box>

      <StepNavigation
        onNext={canProceed ? handleNext : undefined}
        onBack={handleBack}
        nextLabel="Продовжити до фото"
        backLabel="Назад до дефектів"
        isNextDisabled={!canProceed}
        nextLoading={isCalculating}
      />
    </StepContainer>
  );
};

export default PriceCalculatorStep;
