import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Box,
  Typography,
  Chip
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { PriceDisplay, QuantityIndicator } from '@shared/ui/atoms';
import { useItemOperations } from '@features/order-wizard/hooks';
import type { CalculatedItemPrice, ItemModifier } from '@api/cart';

export const ItemsTable: React.FC = () => {
  const { 
    formattedItems, 
    startEditingItem, 
    deleteItem, 
    isLoading,
    calculation
  } = useItemOperations();

  if (isLoading) {
    return <Typography>Завантаження...</Typography>;
  }

  if (formattedItems.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
        Додайте предмети до замовлення
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Предмет</TableCell>
            <TableCell>Кількість</TableCell>
            <TableCell align="right">Ціна</TableCell>
            <TableCell width={100}>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formattedItems.map((item) => {
            // Find calculated price for this item
            const calculatedItem = calculation?.items?.find((calc: CalculatedItemPrice) => calc.priceListItemId === item.priceListItemId);
            const displayPrice = calculatedItem?.total || item.display.totalPrice;
            
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {item.display.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.display.category}
                    </Typography>
                    
                    {/* Характеристики */}
                    {(item.characteristics?.color || item.characteristics?.material) && (
                      <Box sx={{ mt: 0.5 }}>
                        {item.characteristics.color && (
                          <Chip 
                            label={item.characteristics.color} 
                            size="small" 
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem', height: '20px' }}
                          />
                        )}
                        {item.characteristics.material && (
                          <Chip 
                            label={item.characteristics.material} 
                            size="small" 
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem', height: '20px' }}
                          />
                        )}
                      </Box>
                    )}
                    
                    {/* Модифікатори */}
                    {item.modifiers && item.modifiers.length > 0 && (
                      <Box sx={{ mt: 0.5 }}>
                        {item.modifiers.map((modifier: ItemModifier) => (
                          <Chip 
                            key={modifier.code}
                            label={modifier.name}
                            size="small" 
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem', height: '20px' }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <QuantityIndicator quantity={item.quantity} />
                </TableCell>
                <TableCell align="right">
                  <PriceDisplay amount={displayPrice} />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => startEditingItem(item.id)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};