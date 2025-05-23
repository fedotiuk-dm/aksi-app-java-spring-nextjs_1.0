'use client';

import { Grid, Card, CardContent, Typography, Box, Stack, Chip } from '@mui/material';
import React from 'react';

interface StainData {
  id: string;
  name: string;
  risk: string;
}

interface DefectData {
  id: string;
  name: string;
  category: string;
}

interface DefectsStainsSummaryProps {
  selectedStains: string[];
  selectedDefects: string[];
  customStain: string;
  stainTypes: StainData[];
  defectTypes: DefectData[];
  getStainRiskColor: (risk: string) => 'error' | 'warning' | 'success' | 'default';
  getDefectCategoryColor: (
    category: string
  ) => 'error' | 'warning' | 'info' | 'secondary' | 'default';
  show: boolean;
}

/**
 * Компонент для відображення підсумку виявлених проблем
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення підсумку
 * - Отримує готові дані через пропси
 * - Не містить бізнес-логіки форматування
 */
export const DefectsStainsSummary: React.FC<DefectsStainsSummaryProps> = ({
  selectedStains,
  selectedDefects,
  customStain,
  stainTypes,
  defectTypes,
  getStainRiskColor,
  getDefectCategoryColor,
  show,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined" sx={{ bgcolor: 'warning.50' }}>
        <CardContent>
          <Typography variant="subtitle2" color="warning.main" gutterBottom>
            Виявлені проблеми
          </Typography>

          {selectedStains.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Плями:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                {selectedStains.map((stainId) => {
                  const stain = stainTypes.find((s) => s.id === stainId);
                  return (
                    <Chip
                      key={stainId}
                      label={stain?.name || (stainId === 'other' ? customStain : stainId)}
                      size="small"
                      color={stain ? getStainRiskColor(stain.risk) : 'default'}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

          {selectedDefects.length > 0 && (
            <Box>
              <Typography variant="caption" display="block" gutterBottom>
                Дефекти та ризики:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                {selectedDefects.map((defectId) => {
                  const defect = defectTypes.find((d) => d.id === defectId);
                  return (
                    <Chip
                      key={defectId}
                      label={defect?.name || defectId}
                      size="small"
                      color={defect ? getDefectCategoryColor(defect.category) : 'default'}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DefectsStainsSummary;
