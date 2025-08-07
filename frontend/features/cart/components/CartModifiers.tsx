'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from '@mui/material';
import {
  ExpandMore,
  Speed,
  Discount,
  DateRange,
  Save,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import type { CartInfo } from '@/shared/api/generated/cart';
import { useUpdateCartModifiers } from '@/shared/api/generated/cart';

interface CartModifiersProps {
  cart: CartInfo;
}

// Енуми для типів модифікаторів (згідно з API схемою)
const URGENCY_TYPES = {
  STANDARD: 'STANDARD',
  EXPRESS_24H: 'EXPRESS_24H', 
  EXPRESS_12H: 'EXPRESS_12H',
  EXPRESS_6H: 'EXPRESS_6H',
  ULTRA_EXPRESS_3H: 'ULTRA_EXPRESS_3H',
} as const;

const DISCOUNT_TYPES = {
  NONE: 'NONE',
  STUDENT_10: 'STUDENT_10',
  SENIOR_15: 'SENIOR_15', 
  LOYALTY_5: 'LOYALTY_5',
  LOYALTY_10: 'LOYALTY_10',
  LOYALTY_15: 'LOYALTY_15',
  VIP_20: 'VIP_20',
  OTHER: 'OTHER',
} as const;

const URGENCY_LABELS = {
  [URGENCY_TYPES.STANDARD]: 'Стандартно',
  [URGENCY_TYPES.EXPRESS_24H]: 'Експрес 24 години',
  [URGENCY_TYPES.EXPRESS_12H]: 'Експрес 12 годин',
  [URGENCY_TYPES.EXPRESS_6H]: 'Експрес 6 годин', 
  [URGENCY_TYPES.ULTRA_EXPRESS_3H]: 'Ультра експрес 3 години',
};

const DISCOUNT_LABELS = {
  [DISCOUNT_TYPES.NONE]: 'Без знижки',
  [DISCOUNT_TYPES.STUDENT_10]: 'Студентська 10%',
  [DISCOUNT_TYPES.SENIOR_15]: 'Пенсіонерська 15%',
  [DISCOUNT_TYPES.LOYALTY_5]: 'Клієнтська 5%',
  [DISCOUNT_TYPES.LOYALTY_10]: 'Клієнтська 10%', 
  [DISCOUNT_TYPES.LOYALTY_15]: 'Клієнтська 15%',
  [DISCOUNT_TYPES.VIP_20]: 'VIP 20%',
  [DISCOUNT_TYPES.OTHER]: 'Інша знижка',
};

export const CartModifiers: React.FC<CartModifiersProps> = ({ cart }) => {
  const updateModifiersMutation = useUpdateCartModifiers();
  
  const [urgencyType, setUrgencyType] = React.useState(
    cart.globalModifiers?.urgencyType || URGENCY_TYPES.STANDARD
  );
  const [discountType, setDiscountType] = React.useState(
    cart.globalModifiers?.discountType || DISCOUNT_TYPES.NONE
  );
  const [discountPercentage, setDiscountPercentage] = React.useState(
    cart.globalModifiers?.discountPercentage || 0
  );
  const [expectedCompletionDate, setExpectedCompletionDate] = React.useState<Dayjs | null>(
    cart.globalModifiers?.expectedCompletionDate 
      ? dayjs(cart.globalModifiers.expectedCompletionDate)
      : null
  );

  const handleSave = async () => {
    try {
      const data: any = {
        urgencyType,
        discountType,
        expectedCompletionDate: expectedCompletionDate?.toISOString(),
      };

      if (discountType === DISCOUNT_TYPES.OTHER) {
        data.discountPercentage = discountPercentage;
      }

      await updateModifiersMutation.mutateAsync({
        data,
      });
    } catch (error) {
      console.error('Помилка оновлення модифікаторів:', error);
    }
  };

  return (
    <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Speed fontSize="small" />
            <Typography variant="subtitle2">
              Терміновість та знижки
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* Urgency Type */}
            <FormControl fullWidth size="small">
              <InputLabel>Терміновість виконання</InputLabel>
              <Select
                value={urgencyType}
                onChange={(e) => setUrgencyType(e.target.value as any)}
                label="Терміновість виконання"
                startAdornment={<Speed fontSize="small" sx={{ mr: 1 }} />}
              >
                {Object.entries(URGENCY_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Expected Completion Date */}
            <DatePicker
              label="Очікувана дата готовності"
              value={expectedCompletionDate}
              onChange={(value) => setExpectedCompletionDate(value)}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  slotProps: {
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRange fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  },
                },
              }}
            />

            {/* Discount Type */}
            <FormControl fullWidth size="small">
              <InputLabel>Тип знижки</InputLabel>
              <Select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                label="Тип знижки"
                startAdornment={<Discount fontSize="small" sx={{ mr: 1 }} />}
              >
                {Object.entries(DISCOUNT_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Custom Discount Percentage */}
            {discountType === DISCOUNT_TYPES.OTHER && (
              <TextField
                label="Відсоток знижки"
                type="number"
                size="small"
                fullWidth
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  },
                  htmlInput: { min: 0, max: 100 },
                }}
              />
            )}

            {/* Save Button */}
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={updateModifiersMutation.isPending}
              fullWidth
            >
              Зберегти налаштування
            </Button>
          </Stack>
        </AccordionDetails>
    </Accordion>
  );
};