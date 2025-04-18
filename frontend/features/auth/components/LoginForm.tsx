'use client';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useLogin } from '../hooks/useLogin';
import { LoginRequest } from '../types/authTypes';

// Схема валідації для форми логіну
const loginSchema = z.object({
  username: z.string().min(1, "Логін є обов'язковим"),
  password: z.string().min(1, "Пароль є обов'язковим"),
});

interface LoginFormProps {
  redirectTo?: string;
}

export const LoginForm = ({ redirectTo = '/dashboard' }: LoginFormProps) => {
  const { login, isLoading, error, clearError } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    await login(data, redirectTo);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        p: 4,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Вхід у систему
      </Typography>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Логін"
              autoComplete="username"
              autoFocus
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={isLoading}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              required
              fullWidth
              id="password"
              label="Пароль"
              type="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
            />
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: 'common.white' }} />
          ) : (
            'Увійти'
          )}
        </Button>
      </Box>
    </Paper>
  );
};
