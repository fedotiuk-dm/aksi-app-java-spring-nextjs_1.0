'use client';

import React from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  IconButton,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface ClientSearchFormProps {
  // Швидкий пошук
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onQuickSearch: () => void;

  // Розширений пошук
  showAdvancedSearch: boolean;
  onToggleAdvancedSearch: () => void;
  firstName: string;
  onFirstNameChange: (value: string) => void;
  lastName: string;
  onLastNameChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  address: string;
  onAddressChange: (value: string) => void;
  onAdvancedSearch: () => void;

  // Стан
  isSearching: boolean;
  onClearSearch: () => void;
}

export const ClientSearchForm: React.FC<ClientSearchFormProps> = ({
  searchTerm,
  onSearchTermChange,
  onQuickSearch,
  showAdvancedSearch,
  onToggleAdvancedSearch,
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
  address,
  onAddressChange,
  onAdvancedSearch,
  isSearching,
  onClearSearch,
}) => {
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch();
  };

  const handleAdvancedSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdvancedSearch();
  };

  return (
    <Box>
      {/* Швидкий пошук */}
      <form onSubmit={handleQuickSearchSubmit}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <TextField
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            label="Пошук клієнта"
            placeholder="Введіть прізвище, ім'я, телефон або email"
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={onClearSearch}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSearching || !searchTerm}
            sx={{ minWidth: 120 }}
          >
            {isSearching ? <CircularProgress size={20} /> : 'Пошук'}
          </Button>
        </Stack>
      </form>

      {/* Розширений пошук */}
      <Box sx={{ mt: 2 }}>
        <Button
          startIcon={showAdvancedSearch ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={onToggleAdvancedSearch}
          size="small"
        >
          Розширений пошук
        </Button>

        <Collapse in={showAdvancedSearch}>
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <form onSubmit={handleAdvancedSearchSubmit}>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    value={firstName}
                    onChange={(e) => onFirstNameChange(e.target.value)}
                    label="Ім'я"
                    size="small"
                  />
                  <TextField
                    value={lastName}
                    onChange={(e) => onLastNameChange(e.target.value)}
                    label="Прізвище"
                    size="small"
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    label="Телефон"
                    size="small"
                  />
                  <TextField
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    label="Email"
                    size="small"
                  />
                </Stack>

                <TextField
                  value={address}
                  onChange={(e) => onAddressChange(e.target.value)}
                  label="Адреса"
                  size="small"
                />

                <Button
                  type="submit"
                  variant="outlined"
                  disabled={isSearching}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {isSearching ? <CircularProgress size={20} /> : 'Розширений пошук'}
                </Button>
              </Stack>
            </form>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};
