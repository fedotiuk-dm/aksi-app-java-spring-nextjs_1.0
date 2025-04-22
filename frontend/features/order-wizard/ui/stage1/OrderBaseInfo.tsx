import React from 'react';
import { 
  TextField, 
  Typography, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  Alert, 
  CircularProgress, 
  Paper 
} from '@mui/material';
import { useOrderBaseInfo } from '../../hooks/useOrderBaseInfo';
import { ReceptionPointDTO } from '@/lib/api';
import dayjs from 'dayjs';

interface OrderBaseInfoProps {
  onChange?: (isValid: boolean) => void;
}

export const OrderBaseInfo: React.FC<OrderBaseInfoProps> = ({ onChange }) => {
  const { 
    formValues, 
    receptionPoints, 
    isLoading, 
    isError, 
    handleUniqueTagChange, 
    handleReceptionPointChange, 
    isFormValid 
  } = useOrderBaseInfo();

  // Ефект для відправки валідності форми наверх
  React.useEffect(() => {
    if (onChange) {
      onChange(isFormValid());
    }
  }, [formValues, onChange, isFormValid]);

  if (isLoading) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Alert severity="error">
          Помилка завантаження інформації для замовлення. Будь ласка, оновіть сторінку або спробуйте пізніше.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Базова інформація замовлення
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Номер квитанції"
            fullWidth
            disabled
            value={formValues.receiptNumber}
            margin="normal"
            helperText="Генерується автоматично"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Унікальна мітка"
            fullWidth
            required
            value={formValues.uniqueTag}
            onChange={(e) => handleUniqueTagChange(e.target.value)}
            margin="normal"
            error={!formValues.uniqueTag.trim()}
            helperText={!formValues.uniqueTag.trim() ? "Унікальна мітка обов'язкова" : "Введіть унікальний ідентифікатор або сканкод"}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth margin="normal" required error={!formValues.receptionPointId}>
            <InputLabel id="reception-point-label">Пункт прийому</InputLabel>
            <Select
              labelId="reception-point-label"
              value={formValues.receptionPointId || ''}
              onChange={(e) => handleReceptionPointChange(e.target.value)}
              label="Пункт прийому"
            >
              {receptionPoints.map((point: ReceptionPointDTO) => (
                <MenuItem key={point.id} value={point.id}>
                  {point.name}
                </MenuItem>
              ))}
            </Select>
            {!formValues.receptionPointId && (
              <FormHelperText>Виберіть пункт прийому замовлення</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Дата створення"
            fullWidth
            disabled
            value={dayjs(formValues.createdAt).format('DD.MM.YYYY')}
            margin="normal"
            helperText="Встановлюється автоматично"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
