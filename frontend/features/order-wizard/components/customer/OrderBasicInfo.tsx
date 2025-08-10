import React from 'react';
import { 
  Box,
  TextField, 
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material';
import { QrCodeScanner } from '@mui/icons-material';
import { useOrderBasicInfo } from '@/features/order-wizard/hooks/useOrderBasicInfo';

export const OrderBasicInfo: React.FC = () => {
  const {
    uniqueLabel,
    handleUniqueLabelChange,
    selectedBranchId,
    branches,
    handleBranchChange,
    getCurrentDateTime
  } = useOrderBasicInfo();

  return (
    <Box>
      <TextField
        label="Номер квитанції"
        value="Буде згенеровано при створенні замовлення"
        fullWidth
        disabled
        sx={{ mb: 2 }}
        helperText="Номер генерується автоматично бекендом"
      />

      <TextField
        label="Унікальна мітка"
        value={uniqueLabel}
        onChange={(e) => handleUniqueLabelChange(e.target.value)}
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
          },
        }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Пункт прийому</FormLabel>
        <Select value={selectedBranchId || ''} onChange={handleBranchChange}>
          <MenuItem value="">Виберіть філію</MenuItem>
          {branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Дата створення"
        value={getCurrentDateTime()}
        fullWidth
        disabled
      />
    </Box>
  );
};