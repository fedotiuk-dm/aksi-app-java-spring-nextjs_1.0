'use client';

/**
 * @fileoverview Форма логіну для HttpOnly cookies auth
 */

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Lock,
} from '@mui/icons-material';
import { useLoginForm } from '@/features/auth';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, onSubmit, isLoading } = useLoginForm();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Вхід в систему
        </Typography>

        {form.formState.errors.root && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {form.formState.errors.root.message}
          </Alert>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Ім'я користувача"
          autoComplete="username"
          autoFocus
          error={!!errors.username}
          helperText={errors.username?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            },
          }}
          {...register('username')}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...register('password')}
        />
        
        <FormControlLabel
          control={
            <Checkbox 
              {...register('rememberMe')}
              color="primary"
            />
          }
          label="Запам'ятати мене на 30 днів"
          sx={{ mt: 1 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Вхід...
            </>
          ) : (
            'Увійти'
          )}
        </Button>

        <Typography variant="body2" color="text.secondary" align="center">
          AKSI Dry Cleaning System
        </Typography>
      </Box>
    </Paper>
  );
};