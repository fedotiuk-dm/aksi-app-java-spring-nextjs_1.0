/**
 * @fileoverview Main users management component
 */

import { Paper, Alert } from '@mui/material';
import { UsersTable } from './UsersTable';
import { UsersFilters } from './UsersFilters';
import { useUsersTable, useUserActions, useCreateUserForm } from '../../hooks';

export const UsersManagement = () => {
  const {
    users,
    totalElements,
    isLoading,
    error,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    search,
    roleFilter,
    statusFilter,
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    refetch,
  } = useUsersTable();

  const {
    openDialog,
    toggleUserStatus,
  } = useUserActions();

  const { handleOpen: handleOpenCreateDialog } = useCreateUserForm();

  if (error) {
    return (
      <Alert severity="error">
        Помилка завантаження користувачів
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <UsersFilters
        search={search}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={handleSearch}
        onRoleChange={handleRoleFilter}
        onStatusChange={handleStatusFilter}
        onRefresh={refetch}
        onCreateUser={handleOpenCreateDialog}
      />

      <UsersTable
        users={users}
        totalElements={totalElements}
        page={page}
        rowsPerPage={rowsPerPage}
        isLoading={isLoading}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onEditUser={(userId) => openDialog('edit', userId)}
        onChangePassword={(userId) => openDialog('changePassword', userId)}
        onChangeRoles={(userId) => openDialog('changeRoles', userId)}
        onToggleStatus={toggleUserStatus}
        onManageBranches={(userId) => {
          // TODO: Implement branches management
          console.log('Manage branches for user:', userId);
        }}
      />
    </Paper>
  );
};