'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Chip,
  TextField,
  Button,
  Collapse,
} from '@mui/material';
import {
  Remove,
  Add,
  Delete,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { formatPrice } from '@/shared/lib/utils/format';
import type { CartInfo, CartItemInfo } from '@/shared/api/generated/cart';
import { 
  useUpdateCartItem, 
  useRemoveCartItem 
} from '@/shared/api/generated/cart';

interface CartItemListProps {
  cart: CartInfo;
}

interface CartItemProps {
  item: CartItemInfo;
  onUpdate: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdate }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [quantity, setQuantity] = React.useState(item.quantity);
  
  const updateItemMutation = useUpdateCartItem();
  const removeItemMutation = useRemoveCartItem();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setQuantity(newQuantity);
    try {
      await updateItemMutation.mutateAsync({
        itemId: item.id,
        data: { quantity: newQuantity }
      });
      onUpdate();
    } catch (error) {
      setQuantity(item.quantity); // Revert on error
      console.error('Помилка оновлення кількості:', error);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Видалити послугу з корзини?')) {
      try {
        await removeItemMutation.mutateAsync({ itemId: item.id });
        onUpdate();
      } catch (error) {
        console.error('Помилка видалення з корзини:', error);
      }
    }
  };

  const getCharacteristicsText = () => {
    const chars = item.characteristics;
    const parts = [];
    
    if (chars.color) parts.push(`Колір: ${chars.color}`);
    if (chars.material) parts.push(`Матеріал: ${chars.material}`);
    // brand, size, damageSeverity не існують в ItemCharacteristics
    
    return parts.join(' • ');
  };

  return (
    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2}>
        {/* Main item info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {item.priceListItem.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {/* catalogNumber не існує в PriceListItemSummary */}
            </Typography>
            
            {/* Characteristics preview */}
            <Box sx={{ mt: 1 }}>
              {getCharacteristicsText() && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {getCharacteristicsText()}
                </Typography>
              )}
            </Box>
          </Box>
          
          <IconButton size="small" onClick={handleRemove} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Box>

        {/* Quantity and Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              size="small" 
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Remove fontSize="small" />
            </IconButton>
            
            <TextField
              value={quantity}
              onChange={(e) => {
                const newQty = parseInt(e.target.value) || 1;
                void handleQuantityChange(newQty);
              }}
              size="small"
              sx={{ width: 60 }}
              slotProps={{ 
                htmlInput: {
                  style: { textAlign: 'center' },
                  min: 1,
                  type: 'number' 
                }
              }}
            />
            
            <IconButton 
              size="small" 
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography variant="subtitle2" fontWeight="bold">
            {formatPrice(item.pricing.total)}
          </Typography>
        </Box>

        {/* Modifiers chips */}
        {item.modifiers && item.modifiers.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {item.modifiers.map((modifier, index) => (
              <Chip
                key={index}
                label={modifier.name}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        )}

        {/* Expand for details */}
        <Button
          size="small"
          startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{ alignSelf: 'flex-start' }}
        >
          {isExpanded ? 'Менше' : 'Детальніше'}
        </Button>

        {/* Expanded details */}
        <Collapse in={isExpanded}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Розрахунок ціни:
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">
                    Базова ціна ({quantity} x {formatPrice(item.priceListItem.basePrice)})
                  </Typography>
                  <Typography variant="caption">
                    {formatPrice(item.pricing.basePrice)}
                  </Typography>
                </Box>
                
                {item.pricing.modifiersTotalAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="primary">
                      Модифікатори
                    </Typography>
                    <Typography variant="caption" color="primary">
                      +{formatPrice(item.pricing.modifiersTotalAmount)}
                    </Typography>
                  </Box>
                )}
                
                {item.pricing.urgencyAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="warning.main">
                      Терміновість
                    </Typography>
                    <Typography variant="caption" color="warning.main">
                      +{formatPrice(item.pricing.urgencyAmount)}
                    </Typography>
                  </Box>
                )}
                
                {item.pricing.discountAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="success.main">
                      Знижка
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      -{formatPrice(item.pricing.discountAmount)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
        </Collapse>
      </Stack>
    </Box>
  );
};

export const CartItemList: React.FC<CartItemListProps> = ({ cart }) => {
  const handleItemUpdate = () => {
    // Trigger refetch через React Query
    // Це буде автоматично оновлено завдяки invalidation в mutations
  };

  return (
    <Box>
      {cart.items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdate={handleItemUpdate}
        />
      ))}
    </Box>
  );
};