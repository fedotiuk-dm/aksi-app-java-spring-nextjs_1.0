/**
 * @fileoverview Users table filters component
 */

import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { ROLE_DISPLAY_NAMES } from '@/features/auth';
import { USER_STATUS_OPTIONS } from '../../constants/users.constants';

interface UsersFiltersProps {
  search: string;
  roleFilter: string;
  statusFilter: boolean | undefined;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: boolean | undefined) => void;
  onRefresh: () => void;
  onCreateUser: () => void;
}

export const UsersFilters = ({
  search,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onRefresh,
  onCreateUser,
}: UsersFiltersProps) => {
  const handleStatusChange = (value: string) => {
    if (value === '') {
      onStatusChange(undefined);
    } else {
      onStatusChange(value === 'true');
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <TextField
        placeholder="Пошук за ім'ям або username..."
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1, minWidth: 250 }}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Роль</InputLabel>
        <Select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          label="Роль"
        >
          <MenuItem value="">Всі ролі</MenuItem>
          {Object.entries(ROLE_DISPLAY_NAMES).map(([role, displayName]) => (
            <MenuItem key={role} value={role}>
              {displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Статус</InputLabel>
        <Select
          value={statusFilter === undefined ? '' : statusFilter.toString()}
          onChange={(e) => handleStatusChange(e.target.value)}
          label="Статус"
        >
          {USER_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <IconButton onClick={onRefresh} color="primary">
        <RefreshIcon />
      </IconButton>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateUser}
      >
        Додати користувача
      </Button>
    </Box>
  );
};