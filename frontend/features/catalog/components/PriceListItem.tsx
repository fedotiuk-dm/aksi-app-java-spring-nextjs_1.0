'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Stack,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Schedule,
  Speed,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { formatPrice } from '@/shared/lib/utils/format';
import { 
  type PriceListItemInfo,
  PriceListItemInfoUnitOfMeasure,
  useDeletePriceListItem,
} from '@/shared/api/generated/serviceItem';
import { usePriceListStore } from '@/features/catalog';

const UNIT_LABELS: Record<PriceListItemInfoUnitOfMeasure, string> = {
  [PriceListItemInfoUnitOfMeasure.PIECE]: 'шт',
  [PriceListItemInfoUnitOfMeasure.KILOGRAM]: 'кг',
  [PriceListItemInfoUnitOfMeasure.PAIR]: 'пара',
  [PriceListItemInfoUnitOfMeasure.SQUARE_METER]: 'м²',
};

interface PriceListItemProps {
  item: PriceListItemInfo;
  onRefetch: () => void;
}

export const PriceListItem: React.FC<PriceListItemProps> = ({ item, onRefetch }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { setSelectedItem, setFormOpen } = usePriceListStore();
  
  const deleteMutation = useDeletePriceListItem();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setSelectedItem(item);
    setFormOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm(`Видалити послугу "${item.nameUa || item.name}"?`)) {
      try {
        await deleteMutation.mutateAsync({ priceListItemId: item.id });
        onRefetch();
      } catch (error) {
        console.error('Помилка видалення послуги:', error);
      }
    }
    handleMenuClose();
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              №{item.catalogNumber}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {item.nameUa || item.name}
            </Typography>
            {item.nameUa && item.name !== item.nameUa && (
              <Typography variant="body2" color="text.secondary">
                {item.name}
              </Typography>
            )}
            {item.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {item.description}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={1}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Базова ціна
                </Typography>
                <Typography variant="h6">
                  {formatPrice(item.basePrice)} / {UNIT_LABELS[item.unitOfMeasure]}
                </Typography>
              </Box>
              
              {(item.priceBlack || item.priceColor) && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Фарбування
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    {item.priceBlack && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Чорне:
                        </Typography>
                        <Typography variant="body1">
                          {formatPrice(item.priceBlack)}
                        </Typography>
                      </Box>
                    )}
                    {item.priceColor && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Кольорове:
                        </Typography>
                        <Typography variant="body1">
                          {formatPrice(item.priceColor)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={1}>
              {item.processingTimeDays && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    <Schedule fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Термін виконання
                  </Typography>
                  <Typography variant="body1">
                    {item.processingTimeDays} {item.processingTimeDays === 1 ? 'день' : 'днів'}
                  </Typography>
                </Box>
              )}
              
              {item.expressAvailable && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    <Speed fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Експрес
                  </Typography>
                  <Typography variant="body1">
                    {item.expressTimeHours} год / {formatPrice(item.expressPrice || 0)}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Chip
                icon={item.active ? <CheckCircle /> : <Cancel />}
                label={item.active ? 'Активна' : 'Неактивна'}
                color={item.active ? 'success' : 'default'}
                size="small"
              />
              
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Редагувати
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Видалити
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};