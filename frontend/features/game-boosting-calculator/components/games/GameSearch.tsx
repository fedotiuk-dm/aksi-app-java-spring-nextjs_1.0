'use client';

/**
 * Game Search Component
 * Search and select games using Orval API
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Box, Typography, Chip } from '@mui/material';
import { useGameBoostingStore } from '../../store/game-boosting-store';
import { useGamesListGames } from '@api/game';
import type { Game } from '@api/game';

export const GameSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedGameId, setSelectedGame } = useGameBoostingStore();

  // Orval API hook
  const {
    data: gamesResponse,
    isLoading,
    error,
  } = useGamesListGames({
    page: 0,
    size: 50,
    search: searchTerm || undefined,
    active: true,
  });

  const games = gamesResponse?.data || [];

  const handleGameSelect = (game: Game | null) => {
    if (game) {
      setSelectedGame(game.id, game);
    } else {
      setSelectedGame(null);
    }
  };

  const getOptionLabel = (game: Game) => {
    if (!game) return '';
    return `${game.name} (${game.category})`;
  };

  const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, game: Game) => (
    <Box component="li" {...props}>
      <Box>
        <Typography variant="body1" fontWeight="medium">
          {game.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {game.category}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip label={game.category} size="small" variant="outlined" color="primary" />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Autocomplete
        value={games.find((game) => game.id === selectedGameId) || null}
        onChange={(_, game) => handleGameSelect(game)}
        options={games}
        getOptionLabel={getOptionLabel}
        renderOption={renderOption}
        loading={isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Game"
            placeholder="Enter game name..."
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
        noOptionsText={searchTerm ? 'No games found' : 'Start typing game name'}
        fullWidth
      />

      {error ? (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Error loading games: {String(error)}
        </Typography>
      ) : null}
    </Box>
  );
};
