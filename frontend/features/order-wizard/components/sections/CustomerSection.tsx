'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search,
  PersonAdd,
  Edit,
  QrCodeScanner,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
// import { useDebounce } from '@/shared/hooks/use-debounce';
import { useListBranches } from '@/shared/api/generated/branch';
import { useOrderWizardStore } from '@/features/order-wizard';
import { generateOrderNumber, generateUniqueLabel } from '../../utils/order-number';
import type { CustomerInfo } from '@/shared/api/generated/customer';
import type { BranchInfo } from '@/shared/api/generated/branch';

interface NewCustomerForm {
  firstName: string;
  lastName: string;
  phonePrimary: string;
  email?: string;
  address?: string;
  contactPreferences: string[];
  infoSource?: string;
}

export const CustomerSection: React.FC = () => {
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCustomerForm, setNewCustomerForm] = useState<NewCustomerForm>({
    firstName: '',
    lastName: '',
    phonePrimary: '',
    email: '',
    address: '',
    contactPreferences: [],
    infoSource: '',
  });

  const {
    customer,
    setCustomer,
    orderNumber,
    setOrderNumber,
    uniqueLabel,
    setUniqueLabel,
    branchId,
    setBranchId,
  } = useOrderWizardStore();

  // Search customers - placeholder until API is connected
  const searchResults: CustomerInfo[] = []; // Will be populated by search API
  const isSearching = false;

  // Get branches
  const { data: branchesData } = useListBranches();

  // Initialize order number on mount
  React.useEffect(() => {
    if (!orderNumber) {
      setOrderNumber(generateOrderNumber());
    }
  }, [orderNumber, setOrderNumber]);

  // Generate unique label when branch is selected
  React.useEffect(() => {
    if (branchId && !uniqueLabel) {
      setUniqueLabel(generateUniqueLabel(branchId));
    }
  }, [branchId, uniqueLabel, setUniqueLabel]);

  const handleCustomerSelect = (customer: CustomerInfo | null) => {
    setCustomer(customer);
    if (customer) {
      setIsNewCustomerOpen(false);
      setSearchQuery('');
    }
  };

  const handleBranchChange = (event: SelectChangeEvent) => {
    setBranchId(event.target.value);
  };

  const handleSaveNewCustomer = () => {
    const tempCustomer: CustomerInfo = {
      id: `temp-${Date.now()}`,
      firstName: newCustomerForm.firstName,
      lastName: newCustomerForm.lastName,
      phonePrimary: newCustomerForm.phonePrimary,
      email: newCustomerForm.email,
      address: newCustomerForm.address,
      contactPreferences: newCustomerForm.contactPreferences as any,
      infoSource: newCustomerForm.infoSource as any,
      active: true,
      createdAt: new Date().toISOString(),
    };
    
    setCustomer(tempCustomer);
    setIsNewCustomerOpen(false);
    
    // Reset form
    setNewCustomerForm({
      firstName: '',
      lastName: '',
      phonePrimary: '',
      email: '',
      address: '',
      contactPreferences: [],
      infoSource: '',
    });
  };

  const handleContactPreferenceToggle = (preference: string) => {
    setNewCustomerForm(prev => ({
      ...prev,
      contactPreferences: prev.contactPreferences.includes(preference)
        ? prev.contactPreferences.filter(p => p !== preference)
        : [...prev.contactPreferences, preference],
    }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Клієнт та інформація замовлення
      </Typography>

      {/* Customer Search */}
      <Box sx={{ mb: 2 }}>
        <Autocomplete
          options={searchResults}
          getOptionLabel={(option) => 
            `${option.lastName} ${option.firstName} - ${option.phonePrimary}`
          }
          loading={isSearching}
          value={customer}
          onChange={(_, value) => handleCustomerSelect(value)}
          inputValue={searchQuery}
          onInputChange={(_, value) => setSearchQuery(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Пошук клієнта"
              placeholder="Прізвище, ім'я, телефон..."
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }
              }}
            />
          )}
        />
      </Box>

      {/* Selected Customer Info */}
      {customer && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2">
              {customer.lastName} {customer.firstName}
            </Typography>
            <IconButton size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {customer.phonePrimary}
          </Typography>
          {customer.email && (
            <Typography variant="body2" color="text.secondary">
              {customer.email}
            </Typography>
          )}
        </Box>
      )}

      {/* New Customer Toggle */}
      <Button
        startIcon={isNewCustomerOpen ? <ExpandLess /> : <ExpandMore />}
        endIcon={<PersonAdd />}
        onClick={() => setIsNewCustomerOpen(!isNewCustomerOpen)}
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      >
        Новий клієнт
      </Button>

      {/* New Customer Form */}
      <Collapse in={isNewCustomerOpen}>
        <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Новий клієнт
          </Typography>
          
          <TextField
            label="Прізвище"
            required
            fullWidth
            value={newCustomerForm.lastName}
            onChange={(e) => setNewCustomerForm(prev => ({ ...prev, lastName: e.target.value }))}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Ім'я"
            required
            fullWidth
            value={newCustomerForm.firstName}
            onChange={(e) => setNewCustomerForm(prev => ({ ...prev, firstName: e.target.value }))}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Телефон"
            required
            fullWidth
            value={newCustomerForm.phonePrimary}
            onChange={(e) => setNewCustomerForm(prev => ({ ...prev, phonePrimary: e.target.value }))}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={newCustomerForm.email}
            onChange={(e) => setNewCustomerForm(prev => ({ ...prev, email: e.target.value }))}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Адреса"
            fullWidth
            multiline
            rows={2}
            value={newCustomerForm.address}
            onChange={(e) => setNewCustomerForm(prev => ({ ...prev, address: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Способи зв'язку</FormLabel>
            <FormGroup>
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={newCustomerForm.contactPreferences.includes('PHONE')}
                    onChange={() => handleContactPreferenceToggle('PHONE')}
                  />
                } 
                label="Номер телефону" 
              />
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={newCustomerForm.contactPreferences.includes('SMS')}
                    onChange={() => handleContactPreferenceToggle('SMS')}
                  />
                } 
                label="SMS" 
              />
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={newCustomerForm.contactPreferences.includes('VIBER')}
                    onChange={() => handleContactPreferenceToggle('VIBER')}
                  />
                } 
                label="Viber" 
              />
            </FormGroup>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Джерело інформації</FormLabel>
            <Select 
              value={newCustomerForm.infoSource || ''}
              onChange={(e) => setNewCustomerForm(prev => ({ ...prev, infoSource: e.target.value }))}
            >
              <MenuItem value="">Не вказано</MenuItem>
              <MenuItem value="INSTAGRAM">Інстаграм</MenuItem>
              <MenuItem value="GOOGLE">Google</MenuItem>
              <MenuItem value="RECOMMENDATION">Рекомендації</MenuItem>
              <MenuItem value="OTHER">Інше</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={handleSaveNewCustomer}
              disabled={!newCustomerForm.firstName || !newCustomerForm.lastName || !newCustomerForm.phonePrimary}
            >
              Зберегти
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => {
                setIsNewCustomerOpen(false);
                setNewCustomerForm({
                  firstName: '',
                  lastName: '',
                  phonePrimary: '',
                  email: '',
                  address: '',
                  contactPreferences: [],
                  infoSource: '',
                });
              }}
            >
              Скасувати
            </Button>
          </Box>
        </Box>
      </Collapse>

      <Divider sx={{ my: 3 }} />

      {/* Order Basic Info */}
      <Typography variant="subtitle1" gutterBottom>
        Інформація замовлення
      </Typography>

      <TextField
        label="Номер квитанції"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        fullWidth
        disabled
        sx={{ mb: 2 }}
        helperText="Генерується автоматично"
      />

      <TextField
        label="Унікальна мітка"
        value={uniqueLabel}
        onChange={(e) => setUniqueLabel(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <QrCodeScanner />
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Пункт прийому</FormLabel>
        <Select
          value={branchId}
          onChange={handleBranchChange}
        >
          {branchesData?.branches?.map((branch: BranchInfo) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Дата створення"
        value={new Date().toLocaleString('uk-UA')}
        fullWidth
        disabled
      />
    </Box>
  );
};