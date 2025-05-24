'use client';

import {
  Box,
  Paper,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { useWizardOrderId, useWizard } from '@/domain/wizard';

interface OrderDebugInfoProps {
  show?: boolean;
  title?: string;
}

/**
 * Компонент для відображення діагностичної інформації про замовлення
 * Корисний для розробки та дебагінгу
 */
export const OrderDebugInfo: React.FC<OrderDebugInfoProps> = ({
  show = process.env.NODE_ENV === 'development',
  title = 'Діагностика замовлення',
}) => {
  const wizard = useWizard();
  const {
    orderId,
    customerId,
    branchId,
    hasOrderId,
    hasCustomerId,
    hasBranchId,
    isTemporary,
    isReadyForItems,
  } = useWizardOrderId();

  if (!show) return null;

  return (
    <Accordion sx={{ mb: 2, bgcolor: 'grey.50' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2" color="text.secondary">
          🔍 {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Wizard стан */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Wizard стан
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip label={`Крок: ${wizard.currentStep}`} size="small" color="primary" />
              <Chip
                label={
                  wizard.isItemWizardActive ? 'Item Wizard: Активний' : 'Item Wizard: Неактивний'
                }
                size="small"
                color={wizard.isItemWizardActive ? 'success' : 'default'}
              />
            </Box>
          </Paper>

          {/* Ідентифікатори */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ідентифікатори
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Order ID:</Typography>
                <Chip
                  label={orderId || 'відсутній'}
                  size="small"
                  color={hasOrderId ? (isTemporary ? 'warning' : 'success') : 'error'}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Customer ID:</Typography>
                <Chip
                  label={customerId || 'відсутній'}
                  size="small"
                  color={hasCustomerId ? 'success' : 'error'}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Branch ID:</Typography>
                <Chip
                  label={branchId || 'відсутній'}
                  size="small"
                  color={hasBranchId ? 'success' : 'error'}
                />
              </Box>
            </Box>
          </Paper>

          {/* Статус готовності */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Статус готовності
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={isReadyForItems ? 'Готовий для предметів' : 'Не готовий для предметів'}
                size="small"
                color={isReadyForItems ? 'success' : 'warning'}
              />
              {isTemporary && <Chip label="Тимчасовий ID" size="small" color="warning" />}
            </Box>
          </Paper>

          {/* Wizard context */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Wizard Context (JSON)
            </Typography>
            <Box
              sx={{
                bgcolor: 'grey.100',
                p: 1,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontFamily: 'monospace',
              }}
            >
              <pre>{JSON.stringify(wizard.context, null, 2)}</pre>
            </Box>
          </Paper>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
