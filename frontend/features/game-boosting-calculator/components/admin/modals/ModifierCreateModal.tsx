'use client';

/**
 * Modifier Create Modal
 * Modal for creating new price modifiers
 */

import React, { useState } from 'react';
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
} from '@mui/material';
import { PricingModifierType, PricingOperationType, PriceModifier } from '@api/pricing';

interface ModifierCreateModalProps {
  children: React.ReactNode;
  onCreate: (
    modifierData: Omit<PriceModifier, 'id' | 'createdAt' | 'updatedAt' | 'active'>
  ) => Promise<void>;
}

export const ModifierCreateModal: React.FC<ModifierCreateModalProps> = ({ children, onCreate }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: '' as PricingModifierType,
    operation: GamePricingOperationType.ADD,
    value: 0,
    sortOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      code: '',
      name: '',
      description: '',
      type: '' as PricingModifierType,
      operation: GamePricingOperationType.ADD,
      value: 0,
      sortOrder: 0,
    });
  };

  const handleSubmit = async () => {
    if (!formData.code.trim() || !formData.name.trim() || !formData.type || formData.value <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        operation: formData.operation,
        value: formData.value,
        sortOrder: formData.sortOrder,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create modifier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValueHelperText = () => {
    switch (formData.operation) {
      case GamePricingOperationType.MULTIPLY:
        return 'Multiplier value (e.g., 150 = 1.5x multiplier)';
      case GamePricingOperationType.ADD:
        return 'Fixed amount to add (in cents, e.g., 500 = $5.00)';
      case GamePricingOperationType.SUBTRACT:
        return 'Fixed amount to subtract (in cents, e.g., 200 = -$2.00)';
      case GamePricingOperationType.DIVIDE:
        return 'Divider value (e.g., 200 = divide by 2)';
      default:
        return 'Value for the modifier operation';
    }
  };

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {children}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Price Modifier</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Modifier Code"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
              }
              fullWidth
              required
              autoFocus
              placeholder="EXPRESS_SERVICE, VIP_SUPPORT, etc."
              helperText="Use uppercase letters, numbers, underscores and hyphens only"
            />

            <TextField
              label="Modifier Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
              placeholder="Express Service, VIP Support, etc."
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value as PricingModifierType,
                    }))
                  }
                >
                  <MenuItem value="TIMING">Timing</MenuItem>
                  <MenuItem value="SUPPORT">Support</MenuItem>
                  <MenuItem value="MODE">Mode</MenuItem>
                  <MenuItem value="MEDIA">Media</MenuItem>
                  <MenuItem value="TEAM">Team</MenuItem>
                  <MenuItem value="QUALITY">Quality</MenuItem>
                  <MenuItem value="URGENCY">Urgency</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel>Operation</InputLabel>
                <Select
                  value={formData.operation}
                  label="Operation"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      operation: e.target.value as typeof GamePricingOperationType.ADD,
                    }))
                  }
                >
                  <MenuItem value={GamePricingOperationType.ADD}>Add Fixed Amount</MenuItem>
                  <MenuItem value={GamePricingOperationType.MULTIPLY}>Multiply</MenuItem>
                  <MenuItem value={GamePricingOperationType.SUBTRACT}>Subtract</MenuItem>
                  <MenuItem value={GamePricingOperationType.DIVIDE}>Divide</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Value"
              type="number"
              value={formData.value}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  value: parseInt(e.target.value) || 0,
                }))
              }
              fullWidth
              required
              inputProps={{ min: 1 }}
              helperText={getValueHelperText()}
            />

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
              inputProps={{ min: 0 }}
              helperText="Order for displaying modifiers (lower numbers appear first)"
            />

            <TextField
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              placeholder="Brief description of the modifier..."
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
              !formData.code.trim() ||
              !formData.name.trim() ||
              !formData.type ||
              formData.value <= 0 ||
              isSubmitting
            }
          >
            {isSubmitting ? 'Creating...' : 'Create Modifier'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
