'use client';

import { Box, Typography, Container, Paper } from '@mui/material';
import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'white',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '8px',
                background: 'linear-gradient(90deg, #1C6EA4 0%, #4D9FD3 100%)',
              }}
            />

            <Box sx={{ p: 4, width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                {/* Логотип (замініть шлях на фактичний шлях до вашого логотипу) */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: '#1C6EA4',
                    color: 'white',
                    fontSize: 24,
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                >
                  AKSI
                </Box>
              </Box>

              <Typography
                variant="h4"
                component="h1"
                align="center"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  color: '#1C6EA4',
                }}
              >
                Вхід в систему
              </Typography>

              <LoginForm />

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 3, color: 'text.secondary' }}
              >
                © {new Date().getFullYear()} АКСИ - Система управління
                хімчисткою
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
