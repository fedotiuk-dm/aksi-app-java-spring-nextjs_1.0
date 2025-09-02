'use client';

/**
 * Game Management Component
 * CRUD operations for games
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Power as PowerIcon,
  PowerOff as PowerOffIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useGameManagement } from './useGameManagement.hook';

import { GameCreateModal } from '../modals/GameCreateModal';
import { GameEditModal } from '../modals/GameEditModal';
import { GameDeleteModal } from '../modals/GameDeleteModal';

export const GameManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | ''>('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Use custom hook for all game management logic
  const {
    games,
    isLoading,
    error,
    handleCreateGame,
    handleUpdateGame,
    handleDeleteGame,
    handleActivateGame,
    handleDeactivateGame,
    refreshGames,
    createGameCategories,
    updateGameCategories,
    allGameCategories,
  } = useGameManagement();

  // Filter and sort games
  const filteredAndSortedGames = games
    .filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || game.category === categoryFilter;
      const matchesStatus = statusFilter === '' || game.active === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || '').getTime();
          bValue = new Date(b.createdAt || '').getTime();
          break;
        case 'code':
          aValue = a.code || '';
          bValue = b.code || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1">
            Game Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredAndSortedGames.length} of {games.length} games
            {games.filter((g) => g.active).length > 0 && (
              <> • {games.filter((g) => g.active).length} active</>
            )}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshGames}
            disabled={isLoading}
            size="small"
          >
            Refresh
          </Button>
          <GameCreateModal categories={createGameCategories} onCreate={handleCreateGame}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Game
            </Button>
          </GameCreateModal>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {allGameCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter === '' ? '' : statusFilter.toString()}
              label="Status"
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setStatusFilter('');
                } else if (value === 'true') {
                  setStatusFilter(true);
                } else if (value === 'false') {
                  setStatusFilter(false);
                }
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="createdAt">Created Date</MenuItem>
              <MenuItem value="code">Code</MenuItem>
            </Select>
          </FormControl>

          <IconButton
            size="small"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            color="primary"
            sx={{ ml: -1 }}
          >
            {sortOrder === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </IconButton>
        </Box>
      </Paper>

      {/* Games Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Name
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSortBy('name');
                      setSortOrder(sortBy === 'name' && sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <SortIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>Code</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Category
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSortBy('category');
                      setSortOrder(sortBy === 'category' && sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <SortIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Boosters</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Created
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSortBy('createdAt');
                      setSortOrder(sortBy === 'createdAt' && sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    <SortIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>Loading games...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredAndSortedGames.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No games found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedGames.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {game.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={game.code} size="small" variant="outlined" color="info" />
                  </TableCell>
                  <TableCell>
                    <Chip label={game.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={game.active ? 'Active' : 'Inactive'}
                        color={game.active ? 'success' : 'default'}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={async () => {
                          try {
                            if (game.active) {
                              await handleDeactivateGame(game.id);
                            } else {
                              await handleActivateGame(game.id);
                            }
                            // Refresh list after status change
                            setTimeout(() => refreshGames(), 500);
                          } catch (error) {
                            console.error('Failed to toggle game status:', error);
                          }
                        }}
                        color={game.active ? 'warning' : 'success'}
                        title={game.active ? 'Deactivate Game' : 'Activate Game'}
                        disabled={isLoading}
                      >
                        {game.active ? <PowerOffIcon /> : <PowerIcon />}
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>{/* TODO: Add booster count when API provides it */}0</TableCell>
                  <TableCell>
                    {game.createdAt ? new Date(game.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <GameEditModal
                      game={game}
                      categories={updateGameCategories}
                      onUpdate={handleUpdateGame}
                    >
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </GameEditModal>

                    <GameDeleteModal game={game} onDelete={handleDeleteGame}>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </GameDeleteModal>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading games: {String(error)}
          <br />
          <strong>Tip:</strong> Make sure the backend is running and the database is accessible.
        </Alert>
      )}

      {!error && games.length === 0 && !isLoading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No games found. Click &quot;Add Game&quot; to create your first game.
        </Alert>
      )}
    </Box>
  );
};
