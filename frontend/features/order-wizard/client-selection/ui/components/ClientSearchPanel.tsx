'use client';

import { Person, Edit, Phone, Email, Delete, ArrowBack } from '@mui/icons-material';
import { Avatar, IconButton, Box, Button } from '@mui/material';
import React from 'react';

import { SearchInput, DataList } from '@/shared/ui';

interface DataListItem {
  id: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  avatar?: React.ReactNode;
  actions?: React.ReactNode;
}

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
  onDeleteClient?: (client: Client) => void;
  onBack?: () => void;
  className?: string;
  maxHeight?: number;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
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
  onDeleteClient,
  onBack,
  className,
  maxHeight = 400,
  showEditButton = true,
  showDeleteButton = true,
}) => {
  // Перетворюємо клієнтів у формат для DataList
  const listItems = results
    .filter((client) => client.id) // Фільтруємо клієнтів без id
    .map((client) => ({
      id: client.id as string, // Після filter ми знаємо що id існує
      primary: (
        <span>
          {client.firstName} {client.lastName}
        </span>
      ),
      secondary: (
        <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone sx={{ fontSize: 14 }} />
            <span style={{ fontSize: '0.75rem' }}>{client.phone}</span>
          </span>
          {client.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Email sx={{ fontSize: 14 }} />
              <span style={{ fontSize: '0.75rem' }}>{client.email}</span>
            </span>
          )}
          {client.address && (
            <span style={{ fontSize: '0.75rem', color: 'text.secondary' }}>{client.address}</span>
          )}
        </span>
      ),
      avatar: (
        <Avatar>
          <Person />
        </Avatar>
      ),
      actions:
        (showEditButton && onEditClient) || (showDeleteButton && onDeleteClient) ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {showEditButton && onEditClient && (
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
            )}
            {showDeleteButton && onDeleteClient && (
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    confirm(
                      `Ви впевнені, що хочете видалити клієнта ${client.firstName} ${client.lastName}?`
                    )
                  ) {
                    onDeleteClient(client);
                  }
                }}
                title="Видалити клієнта"
              >
                <Delete />
              </IconButton>
            )}
          </Box>
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
