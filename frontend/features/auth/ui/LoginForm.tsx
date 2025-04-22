'use client';

import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Alert, CircularProgress } from '@mui/material';
import { useLogin } from '../hooks/useLogin';
import type { LoginRequest } from '@/lib/api/generated/models/LoginRequest';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

/**
 * Компонент форми входу користувача у систему
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo = '/dashboard',
}) => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  const { login, isLoading, error } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData, redirectTo);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Помилка входу:', error);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Ім'я користувача"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
          />
        </Grid>
        
        <Grid size={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </Grid>
        
        <Grid size={12}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Увійти'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
