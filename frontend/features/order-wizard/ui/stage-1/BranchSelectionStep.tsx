'use client';

import { Business, Receipt, QrCode } from '@mui/icons-material';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Grid,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';

import { useBranchSelection, useOrderInitialization } from '@/domain/wizard';

/**
 * Компонент вибору філії та базової інформації замовлення (1.2 крок)
 * Включає вибір пункту прийому, номер квитанції та унікальну мітку
 */
export const BranchSelectionStep = () => {
  const { branches, selectedBranch, selectBranch, isLoadingBranches, branchesError } =
    useBranchSelection();

  const { state, generateReceiptNumber, setUniqueTag, isCreatingOrder, creationError } =
    useOrderInitialization();

  const handleBranchChange = (event: any) => {
    const branchId = event.target.value;
    const branch = branches.find((b) => b.id === branchId);
    if (branch) {
      selectBranch(branchId);
    }
  };

  const handleUniqueTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tag = event.target.value;
    try {
      setUniqueTag(tag);
    } catch (error) {
      // Помилка валідації буде показана в UI
    }
  };

  if (isLoadingBranches) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Заголовок */}
      <Typography variant="h5" component="h2" gutterBottom>
        Базова інформація замовлення
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Оберіть пункт прийому замовлення та вкажіть базову інформацію
      </Typography>

      <Grid container spacing={3}>
        {/* Вибір філії */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Business color="primary" />
              <Typography variant="h6">Пункт прийому замовлення</Typography>
            </Box>

            <FormControl fullWidth error={!!branchesError}>
              <InputLabel>Оберіть філію *</InputLabel>
              <Select
                value={selectedBranch?.id || ''}
                label="Оберіть філію *"
                onChange={handleBranchChange}
                disabled={isLoadingBranches}
              >
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    <Box>
                      <Typography variant="body1">{branch.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {branch.address}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Відображення вибраної філії */}
            {selectedBranch && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary.contrastText">
                  Вибрана філія:
                </Typography>
                <Typography variant="body1" color="primary.contrastText">
                  {selectedBranch.name}
                </Typography>
                <Typography variant="body2" color="primary.contrastText">
                  {selectedBranch.address}
                </Typography>
                {selectedBranch.phone && (
                  <Typography variant="body2" color="primary.contrastText">
                    Телефон: {selectedBranch.phone}
                  </Typography>
                )}
                <Chip
                  label={selectedBranch.active ? 'Активна' : 'Неактивна'}
                  size="small"
                  color={selectedBranch.active ? 'success' : 'warning'}
                  sx={{ mt: 1 }}
                />
              </Box>
            )}

            {branchesError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {branchesError}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Інформація про замовлення */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Receipt color="primary" />
              <Typography variant="h6">Інформація про замовлення</Typography>
            </Box>

            {/* Номер квитанції */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Номер квитанції"
                value={state.receiptNumber || ''}
                disabled
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: <Receipt sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Номер генерується автоматично при створенні замовлення
              </Typography>
              {isCreatingOrder && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption">Генерація номера...</Typography>
                </Box>
              )}
            </Box>

            {/* Унікальна мітка */}
            <Box>
              <TextField
                fullWidth
                label="Унікальна мітка"
                value={state.uniqueTag || ''}
                onChange={handleUniqueTagChange}
                placeholder="Введіть або відскануйте мітку"
                InputProps={{
                  startAdornment: <QrCode sx={{ mr: 1, color: 'action.active' }} />,
                }}
                helperText="Унікальна мітка для ідентифікації замовлення (необов'язково)"
              />
            </Box>

            {creationError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {creationError}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Додаткова інформація */}
        <Grid size={{ xs: 12 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Важливо:</strong> Після вибору філії та заповнення базової інформації ви
              зможете перейти до додавання предметів до замовлення. Номер квитанції буде згенеровано
              автоматично при збереженні замовлення.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};
