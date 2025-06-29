'use client';

import { Calculate } from '@mui/icons-material';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
} from '@mui/material';
import React from 'react';

export interface CalculationStep {
  description: string;
  amount: number;
  total: number;
}

export interface PriceCalculationData {
  basePrice: number;
  modifiersTotal: number;
  servicesTotal: number;
  finalPrice: number;
  steps: CalculationStep[];
}

interface PriceCalculationResultProps {
  calculation: PriceCalculationData | null;
  isCalculating?: boolean;
  sticky?: boolean;
  title?: string;
  showIcon?: boolean;
  showDetails?: boolean;
}

/**
 * Компонент для відображення результатів розрахунку ціни
 */
export const PriceCalculationResult: React.FC<PriceCalculationResultProps> = ({
  calculation,
  isCalculating = false,
  sticky = false,
  title = 'Детальний розрахунок',
  showIcon = true,
  showDetails = true,
}) => {
  if (!calculation && !isCalculating) {
    return null;
  }

  return (
    <Grid size={{ xs: 12, lg: 4 }}>
      <Card
        variant="outlined"
        sx={{
          position: sticky ? 'sticky' : 'relative',
          top: sticky ? 20 : 0,
          minHeight: isCalculating ? 200 : 'auto',
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            {showIcon && <Calculate color="primary" />}
            {title}
          </Typography>

          {isCalculating ? (
            <Typography component="div" sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Розрахунок ціни...
              </Typography>
              <LinearProgress />
            </Typography>
          ) : calculation ? (
            <>
              {showDetails && calculation.steps.length > 0 && (
                <List dense>
                  {calculation.steps.map((step, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={step.description}
                        secondary={
                          <Typography
                            component="span"
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              component="span"
                              variant="body2"
                              color={step.amount >= 0 ? 'success.main' : 'error.main'}
                            >
                              {step.amount >= 0 ? '+' : ''}
                              {step.amount.toFixed(2)} грн
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ fontWeight: 'medium' }}
                            >
                              = {step.total.toFixed(2)} грн
                            </Typography>
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography
                component="div"
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="h6" color="primary">
                  Підсумок:
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {calculation.finalPrice.toFixed(2)} грн
                </Typography>
              </Typography>

              {showDetails && (
                <>
                  {calculation.modifiersTotal !== 0 && (
                    <Typography
                      component="div"
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Модифікатори: {calculation.modifiersTotal >= 0 ? '+' : ''}
                      {calculation.modifiersTotal.toFixed(2)} грн
                    </Typography>
                  )}

                  {calculation.servicesTotal > 0 && (
                    <Typography
                      component="div"
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Додаткові послуги: +{calculation.servicesTotal.toFixed(2)} грн
                    </Typography>
                  )}
                </>
              )}
            </>
          ) : null}
        </CardContent>
      </Card>
    </Grid>
  );
};
