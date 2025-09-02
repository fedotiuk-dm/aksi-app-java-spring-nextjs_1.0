'use client';

/**
 * Modifiers Management Component
 * CRUD operations for price modifiers
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { PriceModifier } from '@api/pricing';
import { useModifiersManagement } from './useModifiersManagement.hook';

import { ModifierCreateModal } from '../modals/ModifierCreateModal';
import { ModifierEditModal } from '../modals/ModifierEditModal';
import { ModifierDeleteModal } from '../modals/ModifierDeleteModal';

export const ModifiersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [operationFilter, setOperationFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | ''>('');

  const {
    modifiers,
    isLoading,
    error,
    handleCreateModifier,
    handleUpdateModifier,
    handleDeleteModifier,
    handleToggleActive,
  } = useModifiersManagement();

  const filteredModifiers = modifiers.filter((modifier) => {
    const matchesSearch =
      modifier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modifier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (modifier.description &&
        modifier.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !typeFilter || modifier.type === typeFilter;
    const matchesOperation = !operationFilter || modifier.operation === operationFilter;
    const matchesActive = activeFilter === '' || modifier.active === activeFilter;
    return matchesSearch && matchesType && matchesOperation && matchesActive;
  });

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

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Modifiers Management
        </Typography>
        <ModifierCreateModal onCreate={handleCreateModifier}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Modifier
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
            <Select value={typeFilter} label="Type" onChange={(e) => setTypeFilter(e.target.value)}>
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="TIMING">Timing</MenuItem>
              <MenuItem value="SUPPORT">Support</MenuItem>
              <MenuItem value="MODE">Mode</MenuItem>
              <MenuItem value="MEDIA">Media</MenuItem>
              <MenuItem value="TEAM">Team</MenuItem>
              <MenuItem value="QUALITY">Quality</MenuItem>
              <MenuItem value="URGENCY">Urgency</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Operation</InputLabel>
            <Select
              value={operationFilter}
              label="Operation"
              onChange={(e) => setOperationFilter(e.target.value)}
            >
              <MenuItem value="">All Operations</MenuItem>
              <MenuItem value="ADD">Add</MenuItem>
              <MenuItem value="MULTIPLY">Multiply</MenuItem>
              <MenuItem value="PERCENTAGE">Percentage</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={activeFilter}
              label="Status"
              onChange={(e) =>
                setActiveFilter(e.target.value === '' ? '' : e.target.value === 'true')
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
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
                <TableCell colSpan={9} align="center">
                  <Typography>Loading modifiers...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredModifiers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography>No modifiers found</Typography>
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
                    <Chip label={modifier.type} size="small" color="primary" variant="outlined" />
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
                    <ModifierEditModal modifier={modifier} onUpdate={handleUpdateModifier}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </ModifierEditModal>

                    <ModifierDeleteModal modifier={modifier} onDelete={handleDeleteModifier}>
                      <IconButton size="small" color="error">
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
          Error loading modifiers: {String(error)}
        </Alert>
      )}
    </Box>
  );
};
