import React from 'react';
import {
  TextField,
  InputAdornment,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface TagNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * Компонент для вводу номера бирки замовлення
 */
export const TagNumberInput: React.FC<TagNumberInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  return (
    <Box>
      <TextField
        fullWidth
        label="Номер бирки"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        helperText={error || ''}
        placeholder="Введіть номер бирки"
        variant="outlined"
        sx={{
          '& .MuiInputLabel-root': {
            fontSize: isTablet ? '1.1rem' : 'inherit',
            backgroundColor: theme.palette.background.paper,
            px: 1,
          },
          '& .MuiInputBase-root': {
            fontSize: isTablet ? '1.1rem' : 'inherit',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocalOfferIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ mt: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <InfoOutlinedIcon color="info" fontSize="small" sx={{ mt: 0.3 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: isTablet ? '0.95rem' : 'inherit' }}
        >
          Введіть номер бирки, який закріплений на речі клієнта
        </Typography>
      </Box>
    </Box>
  );
};
