'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import React from 'react';

import { useWizardNavigation, useWizardStore } from '@/domain/wizard';

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
  const wizardNavigation = useWizardNavigation();
  const wizardStore = useWizardStore();

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
              <Chip label={`Крок: ${wizardNavigation.currentStep}`} size="small" color="primary" />
              <Chip
                label={`Підкрок: ${wizardNavigation.currentSubStep || 'відсутній'}`}
                size="small"
                color="info"
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
                <Typography variant="body2">Selected Client ID:</Typography>
                <Chip
                  label={wizardStore.selectedClientId || 'відсутній'}
                  size="small"
                  color={wizardStore.selectedClientId ? 'success' : 'error'}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Is New Client:</Typography>
                <Chip
                  label={wizardStore.isNewClient ? 'Так' : 'Ні'}
                  size="small"
                  color={wizardStore.isNewClient ? 'warning' : 'default'}
                />
              </Box>
            </Box>
          </Paper>

          {/* Wizard context */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Wizard Store (JSON)
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
              <pre>
                {JSON.stringify(
                  {
                    selectedClientId: wizardStore.selectedClientId,
                    isNewClient: wizardStore.isNewClient,
                    currentStep: wizardNavigation.currentStep,
                    currentSubStep: wizardNavigation.currentSubStep,
                  },
                  null,
                  2
                )}
              </pre>
            </Box>
          </Paper>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
