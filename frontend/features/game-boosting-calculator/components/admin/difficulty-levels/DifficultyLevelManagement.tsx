'use client';

/**
 * Difficulty Level Management Component
 * CRUD operations for difficulty levels
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
import { useDifficultyLevelManagement } from './useDifficultyLevelManagement.hook';

import { DifficultyLevelCreateModal } from '../modals/DifficultyLevelCreateModal';
import { DifficultyLevelEditModal } from '../modals/DifficultyLevelEditModal';
import { DifficultyLevelDeleteModal } from '../modals/DifficultyLevelDeleteModal';

export const DifficultyLevelManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | ''>('');

  const {
    difficultyLevels,
    isLoading,
    error,
    games,
    handleCreateDifficultyLevel,
    handleUpdateDifficultyLevel,
    handleDeleteDifficultyLevel,
    handleToggleActive,
    refreshDifficultyLevels,
  } = useDifficultyLevelManagement();

  const filteredDifficultyLevels = difficultyLevels.filter((level) => {
    const matchesSearch =
      level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = !gameFilter || level.gameId === gameFilter;
    const matchesActive = activeFilter === '' || level.active === activeFilter;
    return matchesSearch && matchesGame && matchesActive;
  });

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1">
            Difficulty Level Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {difficultyLevels.length} levels •{' '}
            {difficultyLevels.filter((l) => l.active).length} active
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshDifficultyLevels}
            disabled={isLoading}
            size="small"
          >
            Refresh
          </Button>
          <DifficultyLevelCreateModal games={games} onCreate={handleCreateDifficultyLevel}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Difficulty Level
            </Button>
          </DifficultyLevelCreateModal>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search difficulty levels..."
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

      {/* Difficulty Levels Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Game</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Multiplier</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>Loading difficulty levels...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredDifficultyLevels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No difficulty levels found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDifficultyLevels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {level.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={level.code} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{games.find((g) => g.id === level.gameId)?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={level.active}
                          onChange={() => handleToggleActive(level.id, !level.active)}
                          size="small"
                        />
                      }
                      label={level.active ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>{level.levelValue}</TableCell>
                  <TableCell>
                    {level.createdAt ? new Date(level.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <DifficultyLevelEditModal
                      difficultyLevel={level}
                      games={games}
                      onUpdate={handleUpdateDifficultyLevel}
                    >
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </DifficultyLevelEditModal>

                    <DifficultyLevelDeleteModal
                      difficultyLevel={level}
                      onDelete={handleDeleteDifficultyLevel}
                    >
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </DifficultyLevelDeleteModal>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading difficulty levels: {String(error)}
        </Alert>
      )}
    </Box>
  );
};
