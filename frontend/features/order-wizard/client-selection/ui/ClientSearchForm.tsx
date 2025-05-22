'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import { useClientSearch } from '../hooks';
import { clientSearchSchema } from '../schemas';

/**
 * Компонент форми для пошуку клієнтів
 */
export const ClientSearchForm: React.FC = () => {
  // Хук для логіки пошуку клієнтів
  const {
    search,
    isLoading,
    searchClients
  } = useClientSearch();

  // Медіа-запити для адаптивного дизайну
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // Типи та форма з валідацією
  type ClientSearchFormType = {
    query: string;
    pageNumber?: number;
    pageSize?: number;
  };

  const form = useForm<ClientSearchFormType>({
    resolver: zodResolver(clientSearchSchema),
    defaultValues: {
      query: search.query,
      pageNumber: search.pageNumber,
      pageSize: search.pageSize
    }
  });

  // Обробник очищення пошуку
  const handleClearSearch = () => {
    form.setValue('query', '');
    form.handleSubmit(() => {
      // В хуку useClientSearch параметри беруться з форми
      searchClients();
    })();
  };

  // Обробник зміни запиту
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('query', value, { shouldValidate: true });

    // Автоматичний пошук після вводу
    if (value.length >= 2 || value.length === 0) {
      // В хуку useClientSearch параметри беруться з форми
      searchClients();
    }
  };

  return (
    <Box>
      <Typography
        variant={isTablet ? 'h6' : 'subtitle1'}
        fontWeight={isTablet ? 600 : 500}
        color="primary.dark"
        gutterBottom
      >
        Пошук клієнтів
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        Знайдіть клієнта за прізвищем, телефоном або email
      </Typography>

      <Controller
        name="query"
        control={form.control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            fullWidth
            label="Пошук клієнта"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            onChange={handleQueryChange}
            disabled={isLoading}
            size={isTablet ? 'medium' : 'small'}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: isTablet ? '1.1rem' : '1rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: isTablet ? '1.1rem' : '1rem',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" fontSize={isTablet ? 'medium' : 'small'} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading ? (
                    <CircularProgress size={isTablet ? 24 : 20} />
                  ) : field.value ? (
                    <IconButton
                      aria-label="Очистити пошук"
                      onClick={handleClearSearch}
                      edge="end"
                      size={isTablet ? 'medium' : 'small'}
                    >
                      <ClearIcon />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              ),
            }}
            placeholder="Прізвище, телефон або email"
          />
        )}
      />
    </Box>
  );
};

export default ClientSearchForm;
