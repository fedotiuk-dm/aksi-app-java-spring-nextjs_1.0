'use client';

/**
 * @fileoverview Login form component using Orval API hooks
 * Clean login form with proper theming and accessibility
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
import { Visibility, VisibilityOff, AccountCircle, Lock } from '@mui/icons-material';
import { useAuthLoginOperations } from '@/features/auth';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, handleSubmit, isLoading } = useAuthLoginOperations();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 5,
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
        }}
      >
        <Box component="form" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }}
          >
            Sign In
          </Typography>

          {errors.root && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.root.message}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoComplete="username"
            autoFocus
            error={!!errors.username}
            helperText={errors.username?.message}
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                fontSize: '1rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: '1rem',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
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
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                fontSize: '1rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: '1rem',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
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
            control={<Checkbox {...register('rememberMe')} color="primary" size="small" />}
            label="Remember me for 30 days"
            sx={{
              mt: 1,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
                color: 'text.secondary',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 4,
              mb: 3,
              py: 1.75,
              borderRadius: 2,
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '1rem',
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ fontSize: '0.875rem', mt: 2 }}
          >
            © {new Date().getFullYear()} AKSI Dry Cleaning System
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
