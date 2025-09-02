'use client';

/**
 * Modifiers Panel Component
 * Allows users to select various modifiers for price calculation
 * Uses API data instead of hardcoded values
 */

import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
  Paper,
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useGameBoostingStore } from '../../../store/game-boosting-store';
import { useListPriceModifiers } from '@api/pricing';
import type { PriceModifier } from '@api/pricing';

const MODIFIER_CATEGORIES = {
  TIMING: '⏱️ Timing',
  SUPPORT: '🎯 Support',
  MODE: '🎮 Mode',
  MEDIA: '📺 Media',
  TEAM: '👥 Team',
  QUALITY: '⭐ Quality',
  URGENCY: '🚀 Urgency',
};

export const ModifiersPanel = () => {
  const { selectedModifiers, setSelectedModifiers } = useGameBoostingStore();

  // Fetch modifiers from API
  const {
    data: modifiersResponse,
    isLoading,
    error,
  } = useListPriceModifiers(
    { active: true },
    {
      query: {
        select: (data) => data.data || [],
      },
    }
  );

  const modifiers = modifiersResponse || [];

  const handleModifierChange = (modifierCode: string, checked: boolean) => {
    if (checked) {
      setSelectedModifiers([...selectedModifiers, modifierCode]);
    } else {
      setSelectedModifiers(selectedModifiers.filter((code) => code !== modifierCode));
    }
  };

  const getSelectedModifiersInfo = () => {
    return modifiers.filter((modifier) => selectedModifiers.includes(modifier.code));
  };

  const calculateTotalModifier = () => {
    const selectedMods = getSelectedModifiersInfo();
    return selectedMods.reduce((total, mod) => {
      // Calculate multiplier based on operation type and value
      switch (mod.operation) {
        case 'MULTIPLY':
          return total * (mod.value / 100);
        case 'ADD':
          return total + mod.value / 100;
        case 'PERCENTAGE':
          return total * (1 + mod.value / 100);
        default:
          return total;
      }
    }, 1);
  };

  const getModifierDisplayValue = (modifier: PriceModifier) => {
    switch (modifier.operation) {
      case 'MULTIPLY':
        return `${modifier.value / 100}x`;
      case 'ADD':
        return `+$${modifier.value / 100}`;
      case 'PERCENTAGE':
        return `+${modifier.value}%`;
      default:
        return `${modifier.value}`;
    }
  };

  // Group modifiers by type for better organization
  const modifiersByType = modifiers.reduce(
    (acc, modifier) => {
      const type = modifier.type || 'OTHER';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(modifier);
      return acc;
    },
    {} as Record<string, PriceModifier[]>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load modifiers: {String(error)}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Category-based Modifiers */}
      {Object.entries(modifiersByType).map(([type, typeModifiers]) => (
        <Paper key={type} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {MODIFIER_CATEGORIES[type as keyof typeof MODIFIER_CATEGORIES] || `${type} Modifiers`}
          </Typography>

          <Grid container spacing={2}>
            {typeModifiers.map((modifier) => (
              <Grid item xs={12} sm={6} md={4} key={modifier.code}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedModifiers.includes(modifier.code)}
                      onChange={(e) => handleModifierChange(modifier.code, e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {modifier.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {modifier.description}
                      </Typography>
                      <Chip
                        label={getModifierDisplayValue(modifier)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}

      {/* Selected Modifiers Summary */}
      {selectedModifiers.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Modifiers ({selectedModifiers.length}):
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {getSelectedModifiersInfo().map((modifier) => (
                <Chip
                  key={modifier.code}
                  label={`${modifier.name} (${getModifierDisplayValue(modifier)})`}
                  size="small"
                  color="primary"
                  onDelete={() => handleModifierChange(modifier.code, false)}
                />
              ))}
            </Box>

            <Typography variant="body2" color="text.secondary">
              Total modifier multiplier: <strong>{calculateTotalModifier().toFixed(2)}x</strong>
            </Typography>
          </Paper>
        </>
      )}

      {/* Help Text */}
      {selectedModifiers.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
          Select modifiers to customize your boosting service. Each modifier affects the final
          price.
        </Typography>
      )}

      {/* No modifiers available */}
      {modifiers.length === 0 && !isLoading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No modifiers are currently available. Please check back later or contact administrator.
        </Alert>
      )}
    </Box>
  );
};
