'use client';

/**
 * Booster Management Component
 * CRUD operations for boosters
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
  Avatar,
  Rating,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useBoosterManagement } from '@game-boosting-calculator/hooks';

import { BoosterCreateModal } from '../modals/BoosterCreateModal';
import { BoosterEditModal } from '../modals/BoosterEditModal';
import { BoosterDeleteModal } from '../modals/BoosterDeleteModal';

export const BoosterManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Use custom hook for all booster management logic
  const {
    boosters,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    handleCreateBooster,
    handleUpdateBooster,
    handleDeleteBooster,
    refreshBoosters,
  } = useBoosterManagement();

  // Filter boosters based on search and status
  const filteredBoosters = boosters.filter((booster) => {
    // Search filter
    const matchesSearch =
      booster.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booster.discordUsername.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = booster.active === true;
    } else if (statusFilter === 'inactive') {
      matchesStatus = booster.active === false;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1">
            Booster Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {boosters.length} boosters • {boosters.filter((b) => b.active).length} active
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshBoosters}
            disabled={isLoading}
            size="small"
          >
            Refresh
          </Button>
          <BoosterCreateModal onCreate={handleCreateBooster}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Booster
            </Button>
          </BoosterCreateModal>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search boosters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as '' | 'active' | 'inactive')}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Boosters Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booster</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Success Rate</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>Loading boosters...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredBoosters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>No boosters found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBoosters.map((booster) => (
                <TableRow key={booster.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                        {booster.displayName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {booster.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{booster.discordUsername}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={(booster.rating || 0) / 100}
                        readOnly
                        size="small"
                        precision={0.1}
                      />
                      <Typography variant="body2">
                        {((booster.rating || 0) / 100).toFixed(1)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{booster.totalOrders}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{(booster.successRate || 0) / 100}%</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booster.active ? 'Active' : 'Inactive'}
                      color={booster.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {booster.createdAt ? new Date(booster.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <BoosterEditModal booster={booster} onUpdate={handleUpdateBooster}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                    </BoosterEditModal>

                    <BoosterDeleteModal booster={booster} onDelete={handleDeleteBooster}>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </BoosterDeleteModal>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading boosters: {String(error)}
        </Alert>
      )}
    </Box>
  );
};
