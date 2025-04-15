'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, LoginDto } from '../types';
import { z } from 'zod';
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data as LoginDto);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error ? error.message : 'Помилка автентифікації'}
        </Alert>
      )}

      <TextField
        {...register('username')}
        id="username"
        label="Логін"
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.username}
        helperText={errors.username?.message}
        InputProps={{
          sx: { borderRadius: 1 },
        }}
      />

      <TextField
        {...register('password')}
        id="password"
        label="Пароль"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
        InputProps={{
          sx: { borderRadius: 1 },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={toggleShowPassword}
                edge="end"
                aria-label={showPassword ? 'сховати пароль' : 'показати пароль'}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={isLoading}
        sx={{
          mt: 3,
          mb: 2,
          py: 1.5,
          boxShadow: 2,
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
            Вхід...
          </Box>
        ) : (
          'Увійти'
        )}
      </Button>
    </form>
  );
}
