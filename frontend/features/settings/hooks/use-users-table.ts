/**
 * @fileoverview Hook for users table with pagination and filtering
 */

import React, { useState } from 'react';
import { useListUsers, ListUsersRole } from '@/shared/api/generated/user';

export const useUsersTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<ListUsersRole | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);

  const { data, isLoading, error, refetch } = useListUsers({
    page,
    size: rowsPerPage,
    search: search || undefined,
    role: roleFilter,
    active: statusFilter,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role as ListUsersRole || undefined);
    setPage(0);
  };

  const handleStatusFilter = (status: boolean | undefined) => {
    setStatusFilter(status);
    setPage(0);
  };

  return {
    // Data
    users: data?.data || [],
    totalElements: data?.totalElements || 0,
    isLoading,
    error,
    
    // Pagination
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    
    // Filters
    search,
    roleFilter: roleFilter || '',
    statusFilter,
    handleSearch,
    handleRoleFilter,
    handleStatusFilter,
    
    // Actions
    refetch,
  };
};