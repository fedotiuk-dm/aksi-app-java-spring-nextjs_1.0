'use client';

/**
 * Price Configuration Management Component
 * CRUD operations for price configurations with advanced filtering
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Switch,
  FormControlLabel,
  Collapse,
  Grid,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { usePriceConfigurationManagement } from './usePriceConfigurationManagement.hook';

import { PriceConfigurationCreateModal } from '../modals/PriceConfigurationCreateModal';
import { PriceConfigurationEditModal } from '../modals/PriceConfigurationEditModal';
import { PriceConfigurationDeleteModal } from '../modals/PriceConfigurationDeleteModal';
import { PriceDisplay } from '@/shared/ui/atoms/PriceDisplay';

export const PriceConfigurationManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [difficultyLevelFilter, setDifficultyLevelFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const {
    priceConfigurations,
    isLoading,
    error,
    games,
    serviceTypes,
    difficultyLevels,
    handleCreatePriceConfiguration,
    handleUpdatePriceConfiguration,
    handleDeletePriceConfiguration,
    handleToggleActive,
  } = usePriceConfigurationManagement();

  const filteredPriceConfigurations = priceConfigurations.filter((config) => {
    const matchesSearch =
      config.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.gameId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.serviceTypeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.difficultyLevelId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = !gameFilter || config.gameId === gameFilter;
    const matchesServiceType = !serviceTypeFilter || config.serviceTypeId === serviceTypeFilter;
    const matchesDifficultyLevel =
      !difficultyLevelFilter || config.difficultyLevelId === difficultyLevelFilter;
    const matchesActive = activeFilter === '' || config.active === activeFilter;
    return (
      matchesSearch && matchesGame && matchesServiceType && matchesDifficultyLevel && matchesActive
    );
  });

  const getAvailableServiceTypes = (gameId?: string) => {
    if (!gameId) return serviceTypes;
    return serviceTypes.filter((st) => st.gameId === gameId);
  };

  const getAvailableDifficultyLevels = (gameId?: string) => {
    if (!gameId) return difficultyLevels;
    return difficultyLevels.filter((dl) => dl.gameId === gameId);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Price Configuration Management
        </Typography>
        <PriceConfigurationCreateModal
          games={games}
          serviceTypes={serviceTypes}
          difficultyLevels={difficultyLevels}
          onCreate={handleCreatePriceConfiguration}
        >
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Price Config
          </Button>
        </PriceConfigurationCreateModal>
      </Box>

      {/* Search and Filters Toggle */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: showFilters ? 2 : 0 }}>
          <TextField
            placeholder="Search configurations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
            sx={{ minWidth: 250 }}
          />

          <Button
            variant="outlined"
            startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowFilters(!showFilters)}
            size="small"
          >
            Filters
          </Button>
        </Box>

        <Collapse in={showFilters}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3} container={false}>
              <FormControl size="small" fullWidth>
                <InputLabel>Game</InputLabel>
                <Select
                  value={gameFilter}
                  label="Game"
                  onChange={(e) => {
                    setGameFilter(e.target.value);
                    setServiceTypeFilter(''); // Reset dependent filters
                    setDifficultyLevelFilter('');
                  }}
                >
                  <MenuItem value="">All Games</MenuItem>
                  {games.map((game) => (
                    <MenuItem key={game.id} value={game.id}>
                      {game.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={serviceTypeFilter}
                  label="Service Type"
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                >
                  <MenuItem value="">All Service Types</MenuItem>
                  {getAvailableServiceTypes(gameFilter).map((serviceType) => (
                    <MenuItem key={serviceType.id} value={serviceType.id}>
                      {serviceType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={difficultyLevelFilter}
                  label="Difficulty Level"
                  onChange={(e) => setDifficultyLevelFilter(e.target.value)}
                >
                  <MenuItem value="">All Difficulty Levels</MenuItem>
                  {getAvailableDifficultyLevels(gameFilter).map((difficultyLevel) => (
                    <MenuItem key={difficultyLevel.id} value={difficultyLevel.id}>
                      {difficultyLevel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={activeFilter}
                  label="Status"
                  onChange={(e) =>
                    setActiveFilter(e.target.value === '' ? '' : e.target.value === 'true')
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {/* Price Configurations Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Game</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Difficulty Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Base Price</TableCell>
              <TableCell>Sort Order</TableCell>
              <TableCell>Calculation Type</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Final Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <Typography>Loading price configurations...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredPriceConfigurations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  <Typography>No price configurations found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPriceConfigurations.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      Game ID: {config.gameId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">Service Type ID: {config.serviceTypeId}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {config.serviceTypeId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Difficulty Level ID: {config.difficultyLevelId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {config.difficultyLevelId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={config.active}
                          onChange={() => handleToggleActive(config.id, !config.active)}
                          size="small"
                        />
                      }
                      label={config.active ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>
                    <PriceDisplay
                      amount={config.basePrice}
                      currency={(config.currency || 'USD') as 'USD' | 'UAH'}
                      variant="body2"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={config.sortOrder ?? 0}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={config.calculationType}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {config.currency || 'USD'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      <PriceDisplay
                        amount={config.basePrice}
                        currency={(config.currency || 'USD') as 'USD' | 'UAH'}
                        inline={true}
                      />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      No description available
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {config.createdAt ? new Date(config.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <PriceConfigurationEditModal
                      priceConfiguration={config}
                      games={games}
                      serviceTypes={serviceTypes}
                      difficultyLevels={difficultyLevels}
                      onUpdate={handleUpdatePriceConfiguration}
                    >
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </PriceConfigurationEditModal>

                    <PriceConfigurationDeleteModal
                      priceConfiguration={config}
                      onDelete={handleDeletePriceConfiguration}
                    >
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </PriceConfigurationDeleteModal>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading price configurations: {String(error)}
        </Alert>
      )}
    </Box>
  );
};
