import React from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useBranchLocations } from '@/features/order-wizard/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PlaceIcon from '@mui/icons-material/Place';

import { UUID } from 'node:crypto';

interface BranchLocationSelectProps {
  value: UUID | string | null;
  onChange: (value: UUID | string | null) => void;
  error?: string;
}

// Типи для філії згідно з API
interface BranchLocation {
  id?: string;
  name?: string;
  code?: string;
  phone?: string;
  address?: string; // Адреса приходить як рядок
  active?: boolean;
}

/**
 * Компонент для вибору філії (пункту прийому замовлення)
 */
export const BranchLocationSelect: React.FC<BranchLocationSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const { data: branchLocations, isLoading } = useBranchLocations();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // Мемоізуємо обробник зміни значення, щоб уникнути зайвих оновлень
  const handleChange = React.useCallback(
    (e: SelectChangeEvent) => {
      onChange(e.target.value as UUID);
    },
    [onChange]
  );

  // Знаходимо вибрану філію для відображення додаткової інформації
  const selectedBranch = React.useMemo(() => {
    if (!value || !branchLocations) return null;
    return branchLocations.find((location) => location.id === value) as
      | BranchLocation
      | undefined;
  }, [value, branchLocations]);

  return (
    <FormControl fullWidth error={!!error} variant="outlined">
      <InputLabel
        id="branch-location-select-label"
        sx={{
          fontSize: isTablet ? '1.1rem' : 'inherit',
          backgroundColor: theme.palette.background.paper,
          px: 1,
        }}
      >
        Пункт прийому замовлення
      </InputLabel>
      <Select
        labelId="branch-location-select-label"
        value={value || ''}
        onChange={handleChange}
        label="Пункт прийому замовлення"
        disabled={isLoading}
        displayEmpty
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            py: 1.5,
            fontSize: isTablet ? '1.1rem' : 'inherit',
          },
        }}
      >
        <MenuItem value="" disabled>
          <ListItemIcon>
            <LocationOnIcon color="action" />
          </ListItemIcon>
          <ListItemText
            primary="Оберіть пункт прийому"
            primaryTypographyProps={{ color: 'text.secondary' }}
          />
        </MenuItem>

        {isLoading ? (
          <MenuItem disabled value="loading">
            <Typography>Завантаження пунктів прийому...</Typography>
          </MenuItem>
        ) : branchLocations && branchLocations.length > 0 ? (
          branchLocations.map((location) => (
            <MenuItem
              key={location.id}
              value={location.id}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.lightest',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'primary.lighter',
                },
              }}
            >
              <ListItemIcon>
                <StorefrontIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={location.name}
                secondary={location.address || ''}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: isTablet ? '1.1rem' : 'inherit',
                }}
              />
              <Chip
                label={location.code}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ ml: 1 }}
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            <Typography color="error">
              Немає доступних пунктів прийому
            </Typography>
          </MenuItem>
        )}
      </Select>

      {error && (
        <FormHelperText
          error
          sx={{ fontSize: isTablet ? '0.95rem' : 'inherit' }}
        >
          {error}
        </FormHelperText>
      )}

      {selectedBranch && selectedBranch.address && !error && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <PlaceIcon color="primary" fontSize="small" sx={{ mt: 0.3 }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Адреса пункту: {selectedBranch.address}
            </Typography>
            {selectedBranch.phone && (
              <Typography variant="body2" color="text.secondary">
                Телефон: {selectedBranch.phone}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </FormControl>
  );
};
