/**
 * @fileoverview Users table component
 */

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Skeleton,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { UserSummary } from '@/shared/api/generated/user';
import { ROLE_DISPLAY_NAMES } from '@/features/auth';
import { USERS_PAGE_SIZES } from '../../constants/users.constants';

interface UsersTableProps {
  users: UserSummary[];
  totalElements: number;
  page: number;
  rowsPerPage: number;
  isLoading: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditUser: (userId: string) => void;
  onChangePassword: (userId: string) => void;
  onChangeRoles: (userId: string) => void;
  onToggleStatus: (userId: string, isActive: boolean) => void;
  onManageBranches: (userId: string) => void;
}

export const UsersTable = ({
  users,
  totalElements,
  page,
  rowsPerPage,
  isLoading,
  onPageChange,
  onRowsPerPageChange,
  onEditUser,
  onChangePassword,
  onChangeRoles,
  onToggleStatus,
  onManageBranches,
}: UsersTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: UserSummary) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Користувач</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ролі</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Остання активність</TableCell>
              <TableCell align="center">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6}>
                    <Skeleton variant="text" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Користувачів не знайдено
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {user.roles.map((role) => (
                        <Chip
                          key={role}
                          label={ROLE_DISPLAY_NAMES[role] || role}
                          size="small"
                          color={role === 'ADMIN' ? 'error' : role === 'MANAGER' ? 'warning' : 'default'}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={user.active ? <CheckCircleIcon /> : <CancelIcon />}
                      label={user.active ? 'Активний' : 'Неактивний'}
                      color={user.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {formatDate(user.lastLoginAt)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, user)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={USERS_PAGE_SIZES}
        labelRowsPerPage="Рядків на сторінці:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} з ${count !== -1 ? count : `більше ніж ${to}`}`
        }
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction(() => onEditUser(selectedUser!.id))}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Редагувати
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onChangeRoles(selectedUser!.id))}>
          <SecurityIcon sx={{ mr: 1 }} fontSize="small" />
          Змінити ролі
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onChangePassword(selectedUser!.id))}>
          <LockIcon sx={{ mr: 1 }} fontSize="small" />
          Змінити пароль
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onManageBranches(selectedUser!.id))}>
          <BusinessIcon sx={{ mr: 1 }} fontSize="small" />
          Керувати філіями
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onToggleStatus(selectedUser!.id, selectedUser!.active))}>
          {selectedUser?.active ? (
            <>
              <CancelIcon sx={{ mr: 1 }} fontSize="small" />
              Деактивувати
            </>
          ) : (
            <>
              <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" />
              Активувати
            </>
          )}
        </MenuItem>
      </Menu>
    </>
  );
};