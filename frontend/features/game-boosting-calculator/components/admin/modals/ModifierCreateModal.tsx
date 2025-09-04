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

    switch (formData.operation) {
      case 'MULTIPLY':
        return 'Multiplier value (e.g., 150 = 1.5x multiplier)';
      case 'ADD':
        return 'Fixed amount to add (in cents, e.g., 500 = $5.00)';
      case 'SUBTRACT':
        return 'Fixed amount to subtract (in cents, e.g., 200 = -$2.00)';
      case 'DIVIDE':
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
                  <MenuItem value="TIMING">Timing</MenuItem>
                  <MenuItem value="SUPPORT">Support</MenuItem>
                  <MenuItem value="MODE">Mode</MenuItem>
                  <MenuItem value="QUALITY">Quality</MenuItem>
                  <MenuItem value="EXTRA">Extra</MenuItem>
                  <MenuItem value="PROMOTIONAL">Promotional</MenuItem>
                  <MenuItem value="SEASONAL">Seasonal</MenuItem>
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
                  <MenuItem value="ADD">Add Fixed Amount</MenuItem>
                  <MenuItem value="SUBTRACT">Subtract Fixed Amount</MenuItem>
                  <MenuItem value="MULTIPLY">Multiply</MenuItem>
                  <MenuItem value="DIVIDE">Divide</MenuItem>
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
