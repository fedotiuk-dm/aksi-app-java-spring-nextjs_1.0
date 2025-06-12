'use client';

import { LocationOn as LocationIcon, Store as StoreIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import { FC, useEffect } from 'react';

import { useBasicOrderInfo } from '@/domains/wizard/stage1/basic-order-info';

interface BranchSelectionPanelProps {
  onBranchSelected?: (branchId: string) => void;
}

export const BranchSelectionPanel: FC<BranchSelectionPanelProps> = ({ onBranchSelected }) => {
  const { ui, loading, actions } = useBasicOrderInfo();

  // Автоматично завантажуємо філії при встановленні sessionId
  useEffect(() => {
    if (ui.sessionId && (!ui.availableBranches || ui.availableBranches.length === 0)) {
      console.log('🔄 Завантажуємо філії для sessionId:', ui.sessionId);
      actions.refreshBranchesData();
    }
  }, [ui.sessionId, ui.availableBranches, actions]);

  const handleBranchChange = async (branchId: string) => {
    try {
      console.log('🏢 Вибираємо філію:', branchId);
      await actions.selectBranchForOrder(branchId);
      console.log('✅ Філія вибрана успішно');
      onBranchSelected?.(branchId);
    } catch (error) {
      console.error('❌ Помилка вибору філії:', error);
    }
  };

  const selectedBranch = ui.selectedBranch;
  const availableBranches = ui.availableBranches || [];

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <StoreIcon />
          Вибір пункту прийому замовлення
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Оберіть філію, де буде прийнято замовлення. Це вплине на номер квитанції та контактну
            інформацію.
          </Typography>
        </Alert>

        {/* Завантаження філій */}
        {loading.isLoadingBranches && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Завантаження списку філій...
            </Typography>
          </Box>
        )}

        {/* Селектор філій */}
        <FormControl fullWidth sx={{ mb: 2 }} disabled={!ui.sessionId || loading.isLoadingBranches}>
          <InputLabel id="branch-select-label">Філія</InputLabel>
          <Select
            labelId="branch-select-label"
            value={selectedBranch?.id || ''}
            label="Філія"
            onChange={(e) => handleBranchChange(e.target.value)}
          >
            <MenuItem value="">
              <em>Оберіть філію</em>
            </MenuItem>
            {availableBranches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {branch.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {branch.address}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Детальна інформація про обрану філію */}
        {selectedBranch && (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <LocationIcon color="primary" />
                Обрана філія
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={selectedBranch.name}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              </Box>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Адреса:</strong> {selectedBranch.address}
              </Typography>

              {selectedBranch.phone && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Телефон:</strong> {selectedBranch.phone}
                </Typography>
              )}

              {selectedBranch.workingHours && (
                <Typography variant="body2" color="textSecondary">
                  <strong>Режим роботи:</strong> {selectedBranch.workingHours}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Попередження якщо філія не обрана */}
        {!selectedBranch && availableBranches.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Будь ласка, оберіть філію для продовження оформлення замовлення.
          </Alert>
        )}

        {/* Повідомлення про відсутність філій */}
        {availableBranches.length === 0 && !loading.isLoadingBranches && ui.sessionId && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Немає доступних філій. Зверніться до адміністратора.
          </Alert>
        )}

        {/* Debug інформація */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" component="div">
              Debug: SessionId: {ui.sessionId || 'null'}, Branches: {availableBranches.length},
              Loading: {loading.isLoadingBranches ? 'true' : 'false'}, Selected:{' '}
              {selectedBranch?.id || 'null'} ({selectedBranch?.name || 'none'})
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
