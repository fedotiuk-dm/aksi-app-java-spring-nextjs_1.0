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
} from '@mui/icons-material';
import { useGameManagement } from './useGameManagement.hook';

import { GameCreateModal } from '../modals/GameCreateModal';
import { GameEditModal } from '../modals/GameEditModal';
import { GameDeleteModal } from '../modals/GameDeleteModal';

export const GameManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Use custom hook for all game management logic
  const {
    games,
    isLoading,
    error,
    handleCreateGame,
    handleUpdateGame,
    handleDeleteGame,
    createGameCategories,
    updateGameCategories,
    allGameCategories,
  } = useGameManagement();

  // Filter games based on search and category
  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || game.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Game Management
        </Typography>
        <GameCreateModal categories={createGameCategories} onCreate={handleCreateGame}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Game
          </Button>
        </GameCreateModal>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
        </Box>
      </Paper>

      {/* Games Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Boosters</TableCell>
              <TableCell>Created</TableCell>
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
            ) : filteredGames.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>No games found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredGames.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {game.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={game.category} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={game.active ? 'Active' : 'Inactive'}
                      color={game.active ? 'success' : 'default'}
                      size="small"
                    />
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
        </Alert>
      )}
    </Box>
  );
};
