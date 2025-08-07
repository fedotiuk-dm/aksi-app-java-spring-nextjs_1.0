'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Stack,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Phone,
  Email,
  Person,
  CardMembership,
} from '@mui/icons-material';
import { 
  type CustomerInfo,
} from '@/shared/api/generated/customer';
import { useCustomerStore } from '@/features/customer';

interface CustomerItemProps {
  customer: CustomerInfo;
}

export const CustomerItem: React.FC<CustomerItemProps> = ({ customer }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { setSelectedCustomer, setFormOpen } = useCustomerStore();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setSelectedCustomer(customer);
    setFormOpen(true);
    handleMenuClose();
  };

  const formatPhone = (phone: string) => {
    // Simple phone formatting for Ukrainian numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('38')) {
      return `+38 (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10)}`;
    }
    return phone;
  };

  const getInfoSourceLabel = (source?: string) => {
    const labels: Record<string, string> = {
      INSTAGRAM: 'Instagram',
      GOOGLE: 'Google',
      RECOMMENDATION: 'Рекомендація',
      OTHER: 'Інше',
    };
    return source ? labels[source] || source : '';
  };

  const getContactPreferencesLabels = (preferences?: string[]) => {
    const labels: Record<string, string> = {
      PHONE: 'Дзвінки',
      SMS: 'SMS',
      VIBER: 'Viber',
    };
    return preferences?.map(p => labels[p] || p).join(', ') || '';
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person fontSize="small" color="action" />
                <Typography variant="h6">
                  {customer.firstName} {customer.lastName}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2">
                  {formatPhone(customer.phonePrimary)}
                </Typography>
              </Box>

              {customer.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {customer.email}
                  </Typography>
                </Box>
              )}

              {customer.discountCardNumber && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CardMembership fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Картка: {customer.discountCardNumber}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack spacing={1}>
              {customer.infoSource && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Джерело інформації:
                  </Typography>
                  <Typography variant="body2">
                    {getInfoSourceLabel(customer.infoSource)}
                    {customer.infoSourceOther && ` (${customer.infoSourceOther})`}
                  </Typography>
                </Box>
              )}

              {customer.contactPreferences && customer.contactPreferences.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Спосіб зв'язку:
                  </Typography>
                  <Typography variant="body2">
                    {getContactPreferencesLabels(customer.contactPreferences)}
                  </Typography>
                </Box>
              )}

              {customer.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Примітки:
                  </Typography>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {customer.notes}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={1}>
              {customer.createdAt && (
                <>
                  <Typography variant="caption" color="text.secondary">
                    Створено:
                  </Typography>
                  <Typography variant="body2">
                    {new Date(customer.createdAt).toLocaleDateString('uk-UA')}
                  </Typography>
                </>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        </Menu>
      </CardContent>
    </Card>
  );
};