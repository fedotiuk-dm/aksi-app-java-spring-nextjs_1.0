import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ModifierImpact {
  modifierId: string;
  name: string;
  value: number;
  impact: number;
}

interface PriceBreakdownProps {
  basePrice: number;
  modifiersImpact: ModifierImpact[];
  totalPrice: number;
}

/**
 * Компонент для відображення детального розрахунку ціни
 */
export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  basePrice,
  modifiersImpact,
  totalPrice,
}) => {
  // Функція для форматування ціни в гривнях
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Функція для форматування відсотка
  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  // Групуємо модифікатори на знижки та надбавки
  const discounts = modifiersImpact.filter((mod) => mod.impact < 0);
  const additions = modifiersImpact.filter((mod) => mod.impact > 0);

  return (
    <Box>
      {/* Базова ціна */}
      <ListItem sx={{ py: 1 }}>
        <ListItemText 
          primary="Базова ціна"
        />
        <Typography variant="body1" fontWeight="bold">
          {formatPrice(basePrice)}
        </Typography>
      </ListItem>
      
      <Divider />
      
      {/* Надбавки */}
      {additions.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Додаткові послуги та надбавки:
          </Typography>
          <List disablePadding>
            {additions.map((mod) => (
              <ListItem key={mod.modifierId} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <AddIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={mod.name}
                  secondary={mod.value ? `${formatPercent(mod.value)}` : undefined}
                />
                <Chip 
                  label={formatPrice(mod.impact)} 
                  size="small" 
                  color="error"
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
      
      {/* Знижки */}
      {discounts.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Знижки:
          </Typography>
          <List disablePadding>
            {discounts.map((mod) => (
              <ListItem key={mod.modifierId} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 24 }}>
                  <RemoveIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={mod.name}
                  secondary={mod.value ? `${formatPercent(mod.value)}` : undefined}
                />
                <Chip 
                  label={formatPrice(Math.abs(mod.impact))} 
                  size="small" 
                  color="success"
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {/* Підсумкова ціна */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
        <Typography variant="h6">Підсумкова ціна:</Typography>
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          {formatPrice(totalPrice)}
        </Typography>
      </Box>
    </Box>
  );
};
