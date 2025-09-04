'use client';

/**
 * Price Configuration Edit Modal
 * Modal for editing existing price configurations
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  PriceConfiguration,
  Game,
  ServiceType,
  DifficultyLevel,
  UpdatePriceConfigurationRequest,
} from '@api/game';
import { PriceDisplay } from '@/shared/ui/atoms/PriceDisplay';

interface PriceConfigurationEditModalProps {
  children: React.ReactNode;
  priceConfiguration: PriceConfiguration;
  games: Game[];
  serviceTypes: ServiceType[];
  difficultyLevels: DifficultyLevel[];
  onUpdate: (
    priceConfigurationId: string,
    priceConfigurationData: UpdatePriceConfigurationRequest
  ) => Promise<void>;
}

export const PriceConfigurationEditModal: React.FC<PriceConfigurationEditModalProps> = ({
  children,
  priceConfiguration,
  games,
  serviceTypes,
  difficultyLevels,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    gameId: '',
    serviceTypeId: '',
    difficultyLevelId: '',
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (priceConfiguration) {
      setFormData({
        gameId: priceConfiguration.gameId,
        serviceTypeId: priceConfiguration.serviceTypeId,
        difficultyLevelId: priceConfiguration.difficultyLevelId,
        active: priceConfiguration.active,
      });
    }
  }, [priceConfiguration]);

  // Filter dependent dropdowns based on selected game
  const availableServiceTypes = serviceTypes.filter(
    (st) => !formData.gameId || st.gameId === formData.gameId
  );

  const availableDifficultyLevels = difficultyLevels.filter(
    (dl) => !formData.gameId || dl.gameId === formData.gameId
  );

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
  };

  const handleSubmit = async () => {
    if (!formData.gameId || !formData.serviceTypeId || !formData.difficultyLevelId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(priceConfiguration.id, {
        gameId: formData.gameId,
        serviceTypeId: formData.serviceTypeId,
        difficultyLevelId: formData.difficultyLevelId,
        basePrice: priceConfiguration.basePrice, // Keep existing basePrice
        active: formData.active,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to update price configuration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.gameId !== priceConfiguration.gameId ||
      formData.serviceTypeId !== priceConfiguration.serviceTypeId ||
      formData.difficultyLevelId !== priceConfiguration.difficultyLevelId ||
      formData.active !== priceConfiguration.active
    );
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

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {children}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Price Configuration</DialogTitle>
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

            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                />
              }
              label="Active"
            />
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
              !hasChanges() ||
              isSubmitting
            }
          >
            {isSubmitting ? 'Updating...' : 'Update Price Configuration'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
