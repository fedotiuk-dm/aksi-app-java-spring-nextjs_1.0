'use client';

/**
 * Price Configuration Create Modal
 * Modal for creating new price configurations
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
import type {
  Game,
  ServiceType,
  DifficultyLevel,
  CreatePriceConfigurationRequest,
  CreatePriceConfigurationRequestCalculationType,
} from '@api/game';
import { CreatePriceConfigurationRequestCalculationType as CalculationTypes } from '@api/game';
import { getCalculationTypeOptions } from '../../admin/shared/utils/calculationTypeUtils';
import { PriceDisplay } from '@/shared/ui/atoms/PriceDisplay';

interface PriceConfigurationCreateModalProps {
  children: React.ReactNode;
  games: Game[];
  serviceTypes: ServiceType[];
  difficultyLevels: DifficultyLevel[];
  onCreate: (priceConfigurationData: CreatePriceConfigurationRequest) => Promise<void>;
}

export const PriceConfigurationCreateModal: React.FC<PriceConfigurationCreateModalProps> = ({
  children,
  games,
  serviceTypes,
  difficultyLevels,
  onCreate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{
    gameId: string;
    serviceTypeId: string;
    difficultyLevelId: string;
    basePrice: number;
    pricePerLevel: number;
    calculationType: CreatePriceConfigurationRequestCalculationType;
    sortOrder: number;
    active: boolean;
    description: string;
  }>({
    gameId: '',
    serviceTypeId: '',
    difficultyLevelId: '',
    basePrice: 1000, // $10.00 in cents
    pricePerLevel: 0,
    calculationType: CalculationTypes.LINEAR,
    sortOrder: 0,
    active: true,
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        gameId: '',
        serviceTypeId: '',
        difficultyLevelId: '',
        basePrice: 1000,
        pricePerLevel: 0,
        calculationType: CalculationTypes.LINEAR,
        sortOrder: 0,
        active: true,
        description: '',
      });
    }
  }, [open]);

  // Filter dependent dropdowns based on selected game
  const availableServiceTypes = serviceTypes.filter(
    (st) => !formData.gameId || st.gameId === formData.gameId
  );

  const availableDifficultyLevels = difficultyLevels.filter(
    (dl) => !formData.gameId || dl.gameId === formData.gameId
  );

  // Note: Backend allows creating inactive price configurations even if active ones exist

  // Reset dependent fields when game changes
  const handleGameChange = (gameId: string) => {
    setFormData((prev) => ({
      ...prev,
      gameId,
      serviceTypeId: '',
      difficultyLevelId: '',
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      gameId: '',
      serviceTypeId: '',
      difficultyLevelId: '',
      basePrice: 1000,
      pricePerLevel: 0,
      calculationType: CalculationTypes.LINEAR,
      sortOrder: 0,
      active: true,
      description: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.gameId || !formData.serviceTypeId || !formData.difficultyLevelId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        gameId: formData.gameId,
        serviceTypeId: formData.serviceTypeId,
        difficultyLevelId: formData.difficultyLevelId,
        basePrice: formData.basePrice,
        pricePerLevel: formData.pricePerLevel,
        currency: 'USD', // Fixed to USD only
        calculationType: formData.calculationType,
        // calculationFormula not provided - let backend use default
        sortOrder: formData.sortOrder,
        active: formData.active,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create price configuration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected entities for display
  const selectedServiceType = serviceTypes.find((st) => st.id === formData.serviceTypeId);
  const selectedDifficultyLevel = difficultyLevels.find(
    (dl) => dl.id === formData.difficultyLevelId
  );

  // Calculate final price preview
  const baseMultiplier = selectedServiceType?.baseMultiplier || 100;
  const levelValue = selectedDifficultyLevel?.levelValue || 1;
  const finalPrice = (baseMultiplier / 100) * levelValue;

  // Get dynamic calculation type options from Orval API
  const calculationTypeOptions = getCalculationTypeOptions();

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {children}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Price Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Game</InputLabel>
              <Select
                value={formData.gameId}
                label="Game"
                onChange={(e) => handleGameChange(e.target.value)}
                autoFocus
              >
                {games.map((game) => (
                  <MenuItem key={game.id} value={game.id}>
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!formData.gameId}>
              <InputLabel>Service Type</InputLabel>
              <Select
                value={formData.serviceTypeId}
                label="Service Type"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, serviceTypeId: e.target.value }))
                }
              >
                {availableServiceTypes.map((serviceType) => (
                  <MenuItem key={serviceType.id} value={serviceType.id}>
                    {serviceType.name} - {serviceType.baseMultiplier / 100}x
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required disabled={!formData.gameId}>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={formData.difficultyLevelId}
                label="Difficulty Level"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, difficultyLevelId: e.target.value }))
                }
              >
                {availableDifficultyLevels.map((difficultyLevel) => (
                  <MenuItem key={difficultyLevel.id} value={difficultyLevel.id}>
                    {difficultyLevel.name} - Level {difficultyLevel.levelValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Base Price (cents)"
              type="number"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  basePrice: parseInt(e.target.value) || 0,
                }))
              }
              fullWidth
              required
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              helperText={`$${(formData.basePrice / 100).toFixed(2)}`}
            />

            <TextField
              label="Price per Level (cents)"
              type="number"
              value={formData.pricePerLevel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pricePerLevel: parseInt(e.target.value) || 0,
                }))
              }
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              helperText={`$${(formData.pricePerLevel / 100).toFixed(2)} per level`}
            />

            <FormControl fullWidth>
              <InputLabel>Calculation Type</InputLabel>
              <Select
                value={formData.calculationType}
                label="Calculation Type"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    calculationType: e.target
                      .value as CreatePriceConfigurationRequestCalculationType,
                  }))
                }
              >
                {calculationTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} title={option.description}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Sort Order"
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sortOrder: parseInt(e.target.value) || 0,
                }))
              }
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              helperText="Lower numbers appear first in the list"
            />

            {/* Price Preview */}
            {selectedServiceType && selectedDifficultyLevel && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Price Preview:
                </Typography>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2">
                    Calculated Price:{' '}
                    <PriceDisplay amount={finalPrice} currency="USD" inline={true} />
                  </Typography>
                  <Typography variant="body2">
                    Base Multiplier: {(baseMultiplier / 100).toFixed(1)}x
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  Final Price: <PriceDisplay amount={finalPrice} currency="USD" inline={true} />
                </Typography>
              </Box>
            )}

            <TextField
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              placeholder="Optional description for this price configuration..."
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                />
              }
              label="Active"
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              💡 You can create multiple inactive configurations for the same combination, but only
              one can be active.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.gameId ||
              !formData.serviceTypeId ||
              !formData.difficultyLevelId ||
              isSubmitting
            }
          >
            {isSubmitting ? 'Creating...' : 'Create Price Configuration'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
