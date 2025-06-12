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
import { FC } from 'react';

import { useBasicOrderInfo } from '@/domains/wizard/stage1/basic-order-info';

interface BranchSelectionSectionProps {
  onBranchSelected?: (branchId: string) => void;
}

export const BranchSelectionSection: FC<BranchSelectionSectionProps> = ({ onBranchSelected }) => {
  const { ui, loading, actions } = useBasicOrderInfo();

  const handleBranchChange = (branchId: string) => {
    actions.selectBranchForOrder(branchId);
    onBranchSelected?.(branchId);
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

        {/* Стан сесії */}
        {!ui.sessionId && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Для вибору філії потрібно ініціалізувати Order Wizard
          </Alert>
        )}

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
        {availableBranches.length === 0 && !loading.isLoadingBranches && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Немає доступних філій. Зверніться до адміністратора.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
