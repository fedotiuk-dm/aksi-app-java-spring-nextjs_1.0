'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import React from 'react';

interface CalculationStep {
  description: string;
  amount: number;
  total: number;
}

interface PriceCalculationData {
  basePrice: number;
  modifiersTotal: number;
  servicesTotal: number;
  finalPrice: number;
  steps: CalculationStep[];
}

interface PriceCalculationResultProps {
  calculation: PriceCalculationData;
  sticky?: boolean;
}

/**
 * Компонент для відображення детального розрахунку ціни
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення розрахунку
 * - Отримує готові дані через пропси
 * - Не містить бізнес-логіки розрахунків
 */
export const PriceCalculationResult: React.FC<PriceCalculationResultProps> = ({
  calculation,
  sticky = false,
}) => {
  return (
    <Grid size={{ xs: 12, lg: 4 }}>
      <Card variant="outlined" sx={{ position: sticky ? 'sticky' : 'relative', top: 20 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Детальний розрахунок
          </Typography>

          <List dense>
            {calculation.steps.map((step, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemText
                  primary={step.description}
                  secondary={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="body2"
                        color={step.amount >= 0 ? 'success.main' : 'error.main'}
                      >
                        {step.amount >= 0 ? '+' : ''}
                        {step.amount.toFixed(2)} грн
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        = {step.total.toFixed(2)} грн
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="primary">
              Підсумок:
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              {calculation.finalPrice.toFixed(2)} грн
            </Typography>
          </Box>

          {calculation.modifiersTotal !== 0 && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Модифікатори: {calculation.modifiersTotal >= 0 ? '+' : ''}
              {calculation.modifiersTotal.toFixed(2)} грн
            </Typography>
          )}

          {calculation.servicesTotal > 0 && (
            <Typography variant="caption" color="text.secondary" display="block">
              Додаткові послуги: +{calculation.servicesTotal.toFixed(2)} грн
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PriceCalculationResult;
