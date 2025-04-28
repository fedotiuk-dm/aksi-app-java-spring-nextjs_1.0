import { Box, Typography, Skeleton } from '@mui/material';

interface BasePriceDisplayProps {
  basePrice: number | undefined;
  isLoading?: boolean;
}

/**
 * Компонент для відображення базової ціни
 */
export const BasePriceDisplay: React.FC<BasePriceDisplayProps> = ({ basePrice, isLoading = false }) => {
  // Обробка випадку, коли ціна відсутня або завантажується
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="text" width={150} height={60} />
        <Typography variant="body2" color="text.secondary">
          Завантаження базової ціни...
        </Typography>
      </Box>
    );
  }

  if (basePrice === undefined || basePrice === null) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h5" fontWeight="bold" color="warning.main">
          Ціна не знайдена в прайсі
        </Typography>
        <Typography variant="body2" color="text.secondary">
          У системі відсутня базова ціна для вибраної комбінації категорії та найменування.
        </Typography>
        <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            Що можна зробити:
          </Typography>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>
              <Typography variant="body2">
                Перевірте, чи правильно вибрана категорія та назва предмета
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Зверніться до адміністратора, щоб додати ціну в прайс-лист
              </Typography>
            </li>
          </ul>
        </Box>
      </Box>
    );
  }

  // Форматування ціни як гривні
  const formattedPrice = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2,
  }).format(basePrice);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="h4" fontWeight="bold" color="primary.main">
        {formattedPrice}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Базова вартість відповідно до прайсу для вибраної категорії та найменування.
      </Typography>
    </Box>
  );
};
