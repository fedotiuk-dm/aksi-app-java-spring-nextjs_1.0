import { redirect } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Home() {
  // Використовуємо серверний редирект замість клієнтського
  redirect('/dashboard');

  // Цей код нижче насправді ніколи не виконається через редирект,
  // але залишаємо його для типу даних повернення функції
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h5" sx={{ mt: 3 }}>
        Завантаження...
      </Typography>
    </Box>
  );
}
