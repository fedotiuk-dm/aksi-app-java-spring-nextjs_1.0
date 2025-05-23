'use client';

import { Person, Edit, Phone, Email } from '@mui/icons-material';
import { Avatar, IconButton, Box, Typography } from '@mui/material';
import React from 'react';

import { SearchInput, DataList, DataListItem } from '@/features/order-wizard/shared/ui';

import type { Client } from '@/domain/client';

interface ClientSearchPanelProps {
  searchTerm: string;
  results: Client[];
  isLoading: boolean;
  error: string | null;
  onSearchTermChange: (term: string) => void;
  onSearch: (term: string) => void;
  onSelectClient: (client: Client) => void;
  onEditClient?: (client: Client) => void;
  className?: string;
  maxHeight?: number;
  showEditButton?: boolean;
}

/**
 * Компонент панелі пошуку клієнтів
 * Використовує shared компоненти для консистентного стилю
 */
export const ClientSearchPanel: React.FC<ClientSearchPanelProps> = ({
  searchTerm,
  results,
  isLoading,
  error,
  onSearchTermChange,
  onSearch,
  onSelectClient,
  onEditClient,
  className,
  maxHeight = 400,
  showEditButton = true,
}) => {
  // Перетворюємо клієнтів у формат для DataList
  const listItems = results
    .filter((client) => client.id) // Фільтруємо клієнтів без id
    .map((client) => ({
      id: client.id as string, // Після filter ми знаємо що id існує
      primary: (
        <Box>
          <Typography variant="body1" component="span">
            {client.firstName} {client.lastName}
          </Typography>
        </Box>
      ),
      secondary: (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone sx={{ fontSize: 14 }} />
            <Typography variant="caption">{client.phone}</Typography>
          </Box>
          {client.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ fontSize: 14 }} />
              <Typography variant="caption">{client.email}</Typography>
            </Box>
          )}
          {client.address && (
            <Typography variant="caption" color="text.secondary">
              {client.address}
            </Typography>
          )}
        </Box>
      ),
      avatar: (
        <Avatar>
          <Person />
        </Avatar>
      ),
      actions:
        showEditButton && onEditClient ? (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEditClient(client);
            }}
            title="Редагувати клієнта"
          >
            <Edit />
          </IconButton>
        ) : undefined,
    }));

  const handleItemClick = (item: DataListItem) => {
    const client = results.find((c) => c.id === item.id);
    if (client) {
      onSelectClient(client);
    }
  };

  return (
    <Box className={className}>
      <Box sx={{ mb: 2 }}>
        <SearchInput
          value={searchTerm}
          onChange={onSearchTermChange}
          onSearch={onSearch}
          placeholder="Введіть прізвище, телефон або email..."
          label="Пошук клієнта"
          loading={isLoading}
          autoFocus
        />
      </Box>

      <DataList
        items={listItems}
        onItemClick={handleItemClick}
        loading={isLoading}
        error={error}
        emptyMessage={
          searchTerm.trim()
            ? 'За вашим запитом клієнтів не знайдено'
            : 'Введіть текст для пошуку клієнтів'
        }
        title={results.length > 0 ? `Знайдено клієнтів: ${results.length}` : undefined}
        maxHeight={maxHeight}
        variant="outlined"
        dense={false}
        dividers={true}
        selectable={true}
      />
    </Box>
  );
};
