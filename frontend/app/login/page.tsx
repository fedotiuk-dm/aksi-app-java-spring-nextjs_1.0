'use client';

import { Box, Container, Paper, Typography } from '@mui/material';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

/**
 * Сторінка авторизації
 * Використовує компонент LoginForm з features/auth/ui
 * Підтримує параметр callbackUrl для повернення після логіну
 */
// Компонент, що використовує useSearchParams
function LoginPageContent() {
  // Отримуємо параметри запиту з URL
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Перевіряємо, щоб callbackUrl не був API маршрутом
  const safeCallbackUrl = callbackUrl.startsWith('/api/')
    ? '/dashboard'
    : callbackUrl;

  // Захист від прямої відправки POST на /login через встановлення event listener
  useEffect(() => {
    const interceptFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      // Якщо форма намагається відправитися на /login, запобігаємо відправці
      if (form.action && form.action.includes('/login')) {
        e.preventDefault();
        console.warn(
          'Перехоплено спробу відправки форми на /login. Використовуйте API для автентифікації.'
        );
      }
    };

    // Додаємо глобальний перехоплювач для form submit
    document.addEventListener('submit', interceptFormSubmit as EventListener);

    return () => {
      document.removeEventListener(
        'submit',
        interceptFormSubmit as EventListener
      );
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 100px)',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <Typography variant="h4" component="h1" align="center">
              Хімчистка AKSI
            </Typography>
          </Box>

          <LoginForm redirectTo={safeCallbackUrl} />

          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} AKSI. Усі права захищено.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

// Головний компонент сторінки з Suspense
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 'calc(100vh - 100px)',
            }}
          >
            <Typography>Завантаження...</Typography>
          </Box>
        </Container>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
