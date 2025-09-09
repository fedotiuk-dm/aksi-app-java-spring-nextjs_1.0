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
  Paper,
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useGameBoostingStore } from '@game-boosting-calculator/store';
import { useModifiersPanel } from './useModifiersPanel.hook';
import type { GameModifierInfo } from '@api/game';

// Import shared modifier utilities
import {
  getModifierDisplayValue,
  calculateTotalModifierEffect,
  getModifierTypeIcon,
  getModifierTypeCleanLabel,
} from '../../admin/shared/utils/modifierTypeUtils';

// Use shared utility for consistent type labels
const getModifierCategoryName = (type: string) => {
  return `${getModifierTypeIcon(type)} ${getModifierTypeCleanLabel(type)} Modifiers`;
};

export const ModifiersPanel = () => {
  const { setSelectedModifiers } = useGameBoostingStore();

  // Use our custom hook for all modifier logic
  const { modifiers, isLoading, error, selectedModifiers } = useModifiersPanel();

  const handleModifierChange = (modifierCode: string, checked: boolean) => {
    const newModifiers = checked
      ? [...selectedModifiers, modifierCode]
      : selectedModifiers.filter((code: string) => code !== modifierCode);

    setSelectedModifiers(newModifiers);
  };

  const getModifierDisplayName = (modifier: GameModifierInfo) => {
    return modifier.name;
  };

  const getModifierDescription = (modifier: GameModifierInfo) => {
    return modifier.description || `${modifier.operation} by ${modifier.value}`;
  };

  const getModifierIcon = (modifier: GameModifierInfo) => {
    if (modifier.icon) return modifier.icon;

    // Dynamic icon mapping - no hardcoded values
    const iconMap: Record<string, string> = {
      TIMING: '⏱️',
      SUPPORT: '🎯',
      MODE: '🎮',
      QUALITY: '⭐',
      EXTRA: '✨',
      PROMOTIONAL: '🏷️',
      SEASONAL: '🎄',
    };

    return iconMap[modifier.type || ''] || '⚙️';
  };

  const getSelectedModifiersInfo = () => {
    return modifiers.filter((modifier) => selectedModifiers.includes(modifier.code));
  };

  const calculateTotalModifier = () => {
    const selectedMods = getSelectedModifiersInfo();

    // Use shared utility for calculations with base price = 100 for percentage calculation
    const { finalPrice } = calculateTotalModifierEffect(
      selectedMods.map((mod) => ({ operation: mod.operation, value: mod.value })),
      100 // Use 100 as base for percentage calculation (100 = 1.00x)
    );

    // Return as multiplier (finalPrice is in cents, so divide by 100)
    return finalPrice / 100;
  };

  const getModifierDisplayValueFormatted = (modifier: GameModifierInfo) => {
    // Use shared utility for consistent display formatting
    return getModifierDisplayValue(modifier.operation, modifier.value);
  };

  // Group modifiers by type for better organization
  const modifiersByType = modifiers.reduce(
    (acc: Record<string, GameModifierInfo[]>, modifier: GameModifierInfo) => {
      const type = modifier.type || 'OTHER';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(modifier);
      return acc;
    },
    {} as Record<string, GameModifierInfo[]>
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
      {Object.entries(modifiersByType).map(
        ([type, typeModifiers]: [string, GameModifierInfo[]]) => (
          <Paper key={type} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {getModifierCategoryName(type)}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {typeModifiers.map((modifier: GameModifierInfo) => (
                <Box key={modifier.code} sx={{ minWidth: '200px', flex: '1 1 auto' }}>
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
                          {getModifierIcon(modifier)} {getModifierDisplayName(modifier)} (
                          {modifier.code})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getModifierDescription(modifier)}
                        </Typography>
                        <Chip
                          label={getModifierDisplayValueFormatted(modifier)}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        )
      )}

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
                  label={`${modifier.name} (${getModifierDisplayValueFormatted(modifier)})`}
                  size="small"
                  color="primary"
                  onDelete={() => handleModifierChange(modifier.code, false)}
                />
              ))}
            </Box>

            <Typography variant="body2" color="text.secondary">
              Total modifier effect: <strong>{calculateTotalModifier().toFixed(2)}x</strong>
              {calculateTotalModifier() !== 1 && (
                <span>
                  {' '}
                  ({calculateTotalModifier() > 1 ? '+' : ''}
                  {((calculateTotalModifier() - 1) * 100).toFixed(1)}%)
                </span>
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              Debug: Selected modifiers: {selectedModifiers.join(', ')} | Total multiplier:{' '}
              {calculateTotalModifier().toFixed(4)}
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
