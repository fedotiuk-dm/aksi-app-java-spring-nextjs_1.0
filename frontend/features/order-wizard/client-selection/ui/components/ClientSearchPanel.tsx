'use client';

import { Person, Phone, Email, ArrowBack } from '@mui/icons-material';
import { Avatar, Box, Button, Typography } from '@mui/material';
import React from 'react';

import { SearchInput, DataList } from '@/shared/ui';

import type { ClientSearchResult } from '@/domain/wizard';

interface DataListItem {
  id: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  avatar?: React.ReactNode;
  actions?: React.ReactNode;
}

interface ClientSearchPanelProps {
  // Стан пошуку
  searchTerm: string;
  results: ClientSearchResult[];
  isSearching: boolean;
  hasResults: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  canLoadNext: boolean;
  canLoadPrevious: boolean;
  formattedResults: Array<{
    id: string;
    displayName: string;
    subtitle: string;
    phone: string;
    orderCount: number;
  }>;

  // Методи
  search: (query: string, page?: number) => void;
  searchNextPage: () => void;
  searchPreviousPage: () => void;
  clearSearch: () => void;

  // Обробники подій
  onSelectClient: (client: ClientSearchResult) => void;
  onBack?: () => void;

  // Опції
  className?: string;
  maxHeight?: number;
}

/**
 * Компонент панелі пошуку клієнтів (DDD архітектура)
 * Використовує дані з useClientSearch хука
 */
export const ClientSearchPanel: React.FC<ClientSearchPanelProps> = ({
  searchTerm,
  results,
  isSearching,
  hasResults,
  totalResults,
  currentPage,
  totalPages,
  canLoadNext,
  canLoadPrevious,
  formattedResults,
  search,
  searchNextPage,
  searchPreviousPage,
  clearSearch,
  onSelectClient,
  onBack,
  className,
  maxHeight = 400,
}) => {
  // Перетворюємо клієнтів у формат для DataList
  const listItems: DataListItem[] = results.map((client) => ({
    id: client.id,
    primary: (
      <Typography variant="body1" fontWeight="medium">
        {client.fullName || `${client.firstName} ${client.lastName}`}
      </Typography>
    ),
    secondary: (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption">{client.phone}</Typography>
        </Box>
        {client.email && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption">{client.email}</Typography>
          </Box>
        )}
        {client.address && (
          <Typography variant="caption" color="text.secondary">
            {client.address}
          </Typography>
        )}
        {client.orderCount !== undefined && (
          <Typography variant="caption" color="primary">
            Замовлень: {client.orderCount}
          </Typography>
        )}
      </Box>
    ),
    avatar: (
      <Avatar>
        <Person />
      </Avatar>
    ),
  }));

  const handleItemClick = (item: DataListItem) => {
    const client = results.find((c) => c.id === item.id);
    if (client) {
      onSelectClient(client);
    }
  };

  const handleSearchChange = (term: string) => {
    search(term, 0);
  };

  const handleSearchSubmit = (term: string) => {
    search(term, 0);
  };

  return (
    <Box className={className}>
      {onBack && (
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack} size="small">
            Назад до вибору
          </Button>
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
          placeholder="Введіть прізвище, телефон або email..."
          label="Пошук клієнта"
          loading={isSearching}
          autoFocus
        />
      </Box>

      {/* Інформація про результати */}
      {hasResults && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Знайдено клієнтів: {totalResults}
            {totalPages > 1 && ` (сторінка ${currentPage + 1} з ${totalPages})`}
          </Typography>
        </Box>
      )}

      <DataList
        items={listItems}
        onItemClick={handleItemClick}
        loading={isSearching}
        error={null}
        emptyMessage={
          searchTerm.trim()
            ? 'За вашим запитом клієнтів не знайдено'
            : 'Введіть текст для пошуку клієнтів'
        }
        maxHeight={maxHeight}
        variant="outlined"
        dense={false}
        dividers={true}
        selectable={true}
      />

      {/* Пагінація */}
      {hasResults && totalPages > 1 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={searchPreviousPage}
            disabled={!canLoadPrevious || isSearching}
          >
            Попередня
          </Button>

          <Typography variant="body2" color="text.secondary">
            {currentPage + 1} / {totalPages}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            onClick={searchNextPage}
            disabled={!canLoadNext || isSearching}
          >
            Наступна
          </Button>
        </Box>
      )}
    </Box>
  );
};
