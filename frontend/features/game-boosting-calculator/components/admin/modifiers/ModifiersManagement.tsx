'use client';

/**
 * Game Modifiers Management Component
 * CRUD operations for game modifiers using Game API
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { GameModifierInfo, GameModifierType, GameModifierOperation } from '@api/game';
import { useModifiersManagement } from './useModifiersManagement.hook';

import { ModifierCreateModal } from '../modals/ModifierCreateModal';
import { ModifierEditModal } from '../modals/ModifierEditModal';
import { ModifierDeleteModal } from '../modals/ModifierDeleteModal';

export const ModifiersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<GameModifierType | ''>('');
  const [operationFilter, setOperationFilter] = useState<GameModifierOperation | ''>('');
  const [activeFilter, setActiveFilter] = useState<boolean | ''>('');
  const [gameFilter, setGameFilter] = useState<string>('');

  const {
    modifiers,
    games,
    serviceTypes,
    isLoading,
    error,
    handleCreateModifier,
    handleUpdateModifier,
    handleDeleteModifier,
    handleToggleActive,
    isCreating,
    isUpdating,
    isDeleting,
  } = useModifiersManagement();

  // Debug logging
  console.log('🔍 ModifiersManagement - modifiers:', modifiers);
  console.log('🔍 ModifiersManagement - isLoading:', isLoading);
  console.log('🔍 ModifiersManagement - error:', error);

  const filteredModifiers = modifiers.filter((modifier) => {
    const matchesSearch =
      modifier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modifier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (modifier.description &&
        modifier.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !typeFilter || modifier.type === typeFilter;
    const matchesOperation = !operationFilter || modifier.operation === operationFilter;
    const matchesActive = activeFilter === '' || modifier.active === activeFilter;
    const matchesGame =
      !gameFilter ||
      (gameFilter === 'GENERAL' && (!modifier.gameCode || modifier.gameCode === '')) ||
      modifier.gameCode === gameFilter;
    return matchesSearch && matchesType && matchesOperation && matchesActive && matchesGame;
  });

  const getModifierDisplayValue = (modifier: GameModifierInfo) => {
    if (!modifier.operation) return `${modifier.value}`;

    switch (modifier.operation) {
      case 'MULTIPLY':
        return `${modifier.value / 100}x`;
      case 'ADD':
        return `+$${modifier.value / 100}`;
      case 'SUBTRACT':
        return `-$${modifier.value / 100}`;
      case 'DIVIDE':
        return `÷${modifier.value / 100}`;
      default:
        return `${modifier.value}`;
    }
  };

  const getModifierTypeColor = (type: GameModifierType) => {
    switch (type) {
      case 'TIMING':
        return 'primary';
      case 'SUPPORT':
        return 'secondary';
      case 'MODE':
        return 'info';
      case 'QUALITY':
        return 'success';
      case 'EXTRA':
        return 'warning';
      case 'PROMOTIONAL':
        return 'error';
      case 'SEASONAL':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Game Modifiers Management
        </Typography>
        <ModifierCreateModal
          games={games}
          serviceTypes={serviceTypes}
          onCreate={handleCreateModifier}
        >
          <Button
            variant="contained"
            startIcon={isCreating ? <CircularProgress size={20} /> : <AddIcon />}
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Add Modifier'}
          </Button>
        </ModifierCreateModal>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search modifiers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value as GameModifierType | '')}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="TIMING">Timing</MenuItem>
              <MenuItem value="SUPPORT">Support</MenuItem>
              <MenuItem value="MODE">Mode</MenuItem>
              <MenuItem value="QUALITY">Quality</MenuItem>
              <MenuItem value="EXTRA">Extra</MenuItem>
              <MenuItem value="PROMOTIONAL">Promotional</MenuItem>
              <MenuItem value="SEASONAL">Seasonal</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Operation</InputLabel>
            <Select
              value={operationFilter}
              label="Operation"
              onChange={(e) => setOperationFilter(e.target.value as GameModifierOperation | '')}
            >
              <MenuItem value="">All Operations</MenuItem>
              <MenuItem value="ADD">Add</MenuItem>
              <MenuItem value="SUBTRACT">Subtract</MenuItem>
              <MenuItem value="MULTIPLY">Multiply</MenuItem>
              <MenuItem value="DIVIDE">Divide</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={activeFilter}
              label="Status"
              onChange={(e) =>
                setActiveFilter(
                  e.target.value === ''
                    ? ''
                    : e.target.value === 'true'
                      ? true
                      : e.target.value === 'false'
                        ? false
                        : ''
                )
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Game</InputLabel>
            <Select value={gameFilter} label="Game" onChange={(e) => setGameFilter(e.target.value)}>
              <MenuItem value="">All Games</MenuItem>
              {games.map((game) => (
                <MenuItem key={game.code} value={game.code}>
                  {game.name}
                </MenuItem>
              ))}
              <MenuItem value="GENERAL">General (No Game)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Modifiers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Game</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Operation</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Sort Order</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}
                  >
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    <Typography>Loading modifiers...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : filteredModifiers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography sx={{ py: 3 }}>
                    {modifiers.length === 0
                      ? 'No modifiers found'
                      : 'No modifiers match your filters'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredModifiers.map((modifier) => (
                <TableRow key={modifier.code}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {modifier.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={modifier.code} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip label={modifier.gameCode} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={modifier.type}
                      size="small"
                      color={getModifierTypeColor(modifier.type)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={modifier.operation}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={modifier.active}
                          onChange={() => handleToggleActive(modifier.code, !modifier.active)}
                          size="small"
                          disabled={isUpdating}
                        />
                      }
                      label={modifier.active ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {getModifierDisplayValue(modifier)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {modifier.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>{modifier.sortOrder}</TableCell>
                  <TableCell align="right">
                    <ModifierEditModal
                      modifier={modifier}
                      games={games}
                      serviceTypes={serviceTypes}
                      onUpdate={handleUpdateModifier}
                    >
                      <IconButton size="small" color="primary" disabled={isUpdating}>
                        <EditIcon />
                      </IconButton>
                    </ModifierEditModal>

                    <ModifierDeleteModal modifier={modifier} onDelete={handleDeleteModifier}>
                      <IconButton size="small" color="error" disabled={isDeleting}>
                        <DeleteIcon />
                      </IconButton>
                    </ModifierDeleteModal>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading modifiers: {error.message}
        </Alert>
      )}
    </Box>
  );
};
