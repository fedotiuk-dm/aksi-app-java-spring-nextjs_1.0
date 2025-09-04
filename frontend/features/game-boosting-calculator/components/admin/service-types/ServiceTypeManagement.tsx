'use client';

/**
 * Service Type Management Component
 * CRUD operations for service types
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
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useServiceTypeManagement } from './useServiceTypeManagement.hook';

import { ServiceTypeCreateModal } from '../modals/ServiceTypeCreateModal';
import { ServiceTypeEditModal } from '../modals/ServiceTypeEditModal';
import { ServiceTypeDeleteModal } from '../modals/ServiceTypeDeleteModal';

export const ServiceTypeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | ''>('');

  const {
    serviceTypes,
    isLoading,
    error,
    games,
    handleCreateServiceType,
    handleUpdateServiceType,
    handleDeleteServiceType,
    handleToggleActive,
    refreshServiceTypes,
  } = useServiceTypeManagement();

  const filteredServiceTypes = serviceTypes.filter((serviceType) => {
    const matchesSearch =
      serviceType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceType.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = !gameFilter || serviceType.gameId === gameFilter;
    const matchesActive = activeFilter === '' || serviceType.active === activeFilter;
    return matchesSearch && matchesGame && matchesActive;
  });

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1">
            Service Type Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {serviceTypes.length} types • {serviceTypes.filter((t) => t.active).length}{' '}
            active
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshServiceTypes}
            disabled={isLoading}
            size="small"
          >
            Refresh
          </Button>
          <ServiceTypeCreateModal games={games} onCreate={handleCreateServiceType}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Service Type
            </Button>
          </ServiceTypeCreateModal>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search service types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Game</InputLabel>
            <Select value={gameFilter} label="Game" onChange={(e) => setGameFilter(e.target.value)}>
              <MenuItem value="">All Games</MenuItem>
              {games.map((game) => (
                <MenuItem key={game.id} value={game.id}>
                  {game.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={activeFilter === '' ? '' : activeFilter.toString()}
              label="Status"
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setActiveFilter('');
                } else if (value === 'true') {
                  setActiveFilter(true);
                } else if (value === 'false') {
                  setActiveFilter(false);
                }
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Service Types Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Game</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Base Price</TableCell>
              <TableCell>Sort Order</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography>Loading service types...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredServiceTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography>No service types found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredServiceTypes.map((serviceType) => (
                <TableRow key={serviceType.id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {serviceType.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={serviceType.code} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {games.find((g) => g.id === serviceType.gameId)?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={serviceType.active}
                          onChange={() => handleToggleActive(serviceType.id, !serviceType.active)}
                          size="small"
                        />
                      }
                      label={serviceType.active ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>${serviceType.baseMultiplier}</TableCell>
                  <TableCell>
                    <Chip
                      label={serviceType.sortOrder ?? 0}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
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
                      {serviceType.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {serviceType.createdAt
                      ? new Date(serviceType.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <ServiceTypeEditModal
                      serviceType={serviceType}
                      games={games}
                      onUpdate={handleUpdateServiceType}
                    >
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </ServiceTypeEditModal>

                    <ServiceTypeDeleteModal
                      serviceType={serviceType}
                      onDelete={handleDeleteServiceType}
                    >
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ServiceTypeDeleteModal>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading service types: {String(error)}
        </Alert>
      )}
    </Box>
  );
};
