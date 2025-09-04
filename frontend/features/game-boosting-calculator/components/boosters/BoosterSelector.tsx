'use client';

/**
 * Booster Selector Component
 * Search and select boosters using Orval API
 */

import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Avatar,
  Rating,
} from '@mui/material';
import { useGameBoostingStore } from '@game-boosting-calculator/store';
import { useGamesListBoosters } from '@api/game';
import type { Booster } from '@api/game';

export const BoosterSelector = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedGameId, selectedBoosterId, setSelectedBooster } = useGameBoostingStore();

  // Orval API hook - only fetch boosters if game is selected
  const {
    data: boostersResponse,
    isLoading,
    error,
  } = useGamesListBoosters(
    {
      page: 0,
      size: 50,
      search: searchTerm || undefined,
      active: true,
    },
    {
      query: {
        enabled: true,
      },
    }
  );

  const boosters = boostersResponse?.data || [];

  const handleBoosterSelect = (booster: Booster | null) => {
    if (booster) {
      setSelectedBooster(booster.id, booster);
    } else {
      setSelectedBooster(null);
    }
  };

  const getOptionLabel = (booster: Booster) => {
    if (!booster) return '';
    return booster.displayName;
  };

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement> & { key?: React.Key },
    booster: Booster
  ) => {
    const { key, ...otherProps } = props;
    return (
      <Box component="li" key={key} {...otherProps}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
            {booster.displayName?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {booster.displayName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Rating value={(booster.rating || 0) / 100} readOnly size="small" precision={0.1} />
              <Typography variant="body2" color="text.secondary">
                ({((booster.rating || 0) / 100).toFixed(1)})
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {booster.totalOrders} orders completed
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  if (!selectedGameId) {
    return (
      <Typography variant="body1" color="text.secondary">
        Please select a game first to see available boosters.
      </Typography>
    );
  }

  return (
    <Box>
      <Autocomplete
        value={boosters.find((booster) => booster.id === selectedBoosterId) || null}
        onChange={(_, booster) => handleBoosterSelect(booster)}
        options={boosters}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        loading={isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Booster"
            placeholder="Enter booster name..."
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        noOptionsText={
          searchTerm ? 'No boosters found' : 'Start typing booster name or select from the list'
        }
        fullWidth
      />

      {error ? (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="error">
            Error loading boosters: {String(error)}
          </Typography>
        </Box>
      ) : null}

      {!isLoading && boosters.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No active boosters available for this game.
        </Typography>
      )}
    </Box>
  );
};
