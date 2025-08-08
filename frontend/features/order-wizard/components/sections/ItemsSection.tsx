'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Collapse,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useOrderWizardStore } from '@/features/order-wizard';
import {
  useGetCart,
  useRemoveCartItem,
  useCalculateCart,
} from '@/shared/api/generated/cart';
import { ItemForm } from '../forms/ItemForm';
import { Calculator } from '../calculator/Calculator';

export const ItemsSection: React.FC = () => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(true);

  const {
    selectedCustomer,
    isItemFormOpen,
    setItemFormOpen,
    editingItemId,
    setEditingItemId,
  } = useOrderWizardStore();

  // Get cart data
  const { data: cartData, isLoading: isLoadingCart, refetch: refetchCart } = useGetCart({
    query: {
      enabled: !!selectedCustomer,
    },
  });
  
  // Remove cart item mutation
  const removeItemMutation = useRemoveCartItem();
  
  // Calculate cart mutation
  const calculateCartMutation = useCalculateCart();

  const handleAddItem = () => {
    if (!selectedCustomer) {
      alert('Спочатку оберіть клієнта');
      return;
    }
    setEditingItemId(null);
    setItemFormOpen(true);
  };

  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
    setItemFormOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await removeItemMutation.mutateAsync({ itemId });
      await refetchCart();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCalculateCart = async () => {
    try {
      await calculateCartMutation.mutateAsync();
      await refetchCart();
    } catch (error) {
      console.error('Error calculating cart:', error);
    }
  };

  const items = cartData?.items || [];

  if (selectedCustomer && isLoadingCart) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Предмети та розрахунки
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleCalculateCart}
            disabled={calculateCartMutation.isPending || items.length === 0}
          >
            {calculateCartMutation.isPending ? 'Розрахунок...' : 'Перерахувати'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddItem}
            disabled={!selectedCustomer}
          >
            Додати предмет
          </Button>
        </Box>
      </Box>
      
      {!selectedCustomer && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Оберіть клієнта для додавання предметів
        </Alert>
      )}

      {/* Items Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Найменування</TableCell>
              <TableCell>Категорія</TableCell>
              <TableCell align="center">К-сть</TableCell>
              <TableCell>Матеріал</TableCell>
              <TableCell>Колір</TableCell>
              <TableCell align="right">Сума</TableCell>
              <TableCell align="center">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Немає доданих предметів
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.priceListItem?.name || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.priceListItem?.categoryCode || '-'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell>{item.characteristics?.material || '-'}</TableCell>
                  <TableCell>{item.characteristics?.color || '-'}</TableCell>
                  <TableCell align="right">
                    {((item.pricing?.total || 0) / 100).toFixed(2)} ₴
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditItem(item.id)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={removeItemMutation.isPending}
                    >
                      {removeItemMutation.isPending ? 
                        <CircularProgress size={16} /> : 
                        <Delete fontSize="small" />
                      }
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Item Form */}
      <Collapse in={isItemFormOpen}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <ItemForm
            onCloseAction={() => {
              setItemFormOpen(false);
              setEditingItemId(null);
            }}
            itemId={editingItemId}
          />
        </Paper>
      </Collapse>

      {/* Calculator */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: isCalculatorOpen ? 2 : 0,
            cursor: 'pointer',
          }}
          onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
        >
          <Typography variant="subtitle1">
            Калькулятор
          </Typography>
          <IconButton size="small">
            {isCalculatorOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        
        <Collapse in={isCalculatorOpen}>
          <Calculator />
        </Collapse>
      </Paper>
    </Box>
  );
};