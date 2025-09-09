'use client';

/**
 * Game Modifier Create Modal
 * Modal for creating new game modifiers
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
  Typography,
} from '@mui/material';
import {
  CreateGameModifierRequest,
  GameModifierType,
  GameModifierOperation,
  Game,
  ServiceType,
} from '@api/game';

// Import shared utilities
import {
  getModifierTypeOptions,
  getModifierOperationOptions,
  getModifierValueHelperText,
} from '../shared/utils/modifierTypeUtils';

// Get dynamic options from API types
const MODIFIER_TYPE_OPTIONS = getModifierTypeOptions();
const MODIFIER_OPERATION_OPTIONS = getModifierOperationOptions();

interface ModifierCreateModalProps {
  children: React.ReactNode;
  games: Game[]; // Game objects for selection
  serviceTypes: ServiceType[]; // Service type objects for selection
  onCreate: (modifierData: CreateGameModifierRequest) => Promise<void>;
}

export const ModifierCreateModal: React.FC<ModifierCreateModalProps> = ({
  children,
  games,
  serviceTypes,
  onCreate,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: '' as GameModifierType,
    operation: '' as GameModifierOperation,
    value: 0,
    gameCode: '',
    serviceTypeCodes: [] as string[],
    sortOrder: 0,
    icon: '',
    color: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      code: '',
      name: '',
      description: '',
      type: '' as GameModifierType,
      operation: '' as GameModifierOperation,
      value: 0,
      gameCode: '',
      serviceTypeCodes: [],
      sortOrder: 0,
      icon: '',
      color: '',
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.code.trim() ||
      !formData.name.trim() ||
      !formData.type ||
      !formData.operation ||
      !formData.gameCode.trim() ||
      formData.value <= 0
    ) {
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
        gameCode: formData.gameCode.trim(),
        serviceTypeCodes:
          formData.serviceTypeCodes.length > 0 ? formData.serviceTypeCodes : undefined,
        sortOrder: formData.sortOrder || undefined,
        icon: formData.icon.trim() || undefined,
        color: formData.color.trim() || undefined,
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create modifier:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValueHelperText = () => {
    if (!formData.operation) return 'Value for the modifier';

    // Use shared utility for consistent helper text
    return getModifierValueHelperText(formData.operation);
  };

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'inline-block' }}>
        {children}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Game Modifier</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
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

              <FormControl fullWidth required>
                <InputLabel>Game</InputLabel>
                <Select
                  value={formData.gameCode}
                  label="Game"
                  onChange={(e) => setFormData((prev) => ({ ...prev, gameCode: e.target.value }))}
                >
                  {games.map((game) => (
                    <MenuItem key={game.id} value={game.code}>
                      {game.name} ({game.code})
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1 }}>
                  Select the game this modifier belongs to
                </Typography>
              </FormControl>
            </Box>

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
                      type: e.target.value as GameModifierType,
                    }))
                  }
                >
                  {MODIFIER_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
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
                      operation: e.target.value as GameModifierOperation,
                    }))
                  }
                >
                  {MODIFIER_OPERATION_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Service Types Selection */}
            <FormControl fullWidth>
              <InputLabel>Applicable Service Types (Optional)</InputLabel>
              <Select
                multiple
                value={formData.serviceTypeCodes}
                label="Applicable Service Types (Optional)"
                onChange={(e) => {
                  const value = e.target.value as string[];
                  setFormData((prev) => ({ ...prev, serviceTypeCodes: value }));
                }}
                renderValue={(selected) => {
                  if (selected.length === 0) return 'All service types';
                  return serviceTypes
                    .filter((service) => selected.includes(service.code))
                    .map((service) => service.name)
                    .join(', ');
                }}
              >
                {serviceTypes.map((service) => (
                  <MenuItem key={service.id} value={service.code}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {service.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {service.code}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1 }}>
                Leave empty to apply to all service types, or select specific ones
              </Typography>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
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
            </Box>

            <TextField
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              placeholder="Brief description of the modifier..."
            />

            {/* Additional Optional Fields */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Icon (Optional)"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                fullWidth
                placeholder="e.g., star, clock, trophy"
                helperText="Icon identifier for UI display"
              />

              <TextField
                label="Color (Optional)"
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                fullWidth
                placeholder="e.g., #FF5733, blue, success.main"
                helperText="Color code for UI styling"
              />
            </Box>
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
              !formData.operation ||
              !formData.gameCode.trim() ||
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
