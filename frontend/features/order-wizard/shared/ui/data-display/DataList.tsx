'use client';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import React, { ReactNode } from 'react';

export interface DataListItem {
  id: string;
  primary: ReactNode;
  secondary?: ReactNode;
  avatar?: ReactNode;
  actions?: ReactNode;
  disabled?: boolean;
  selected?: boolean;
}

interface DataListProps {
  items: DataListItem[];
  onItemClick?: (item: DataListItem) => void;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  title?: string;
  maxHeight?: number;
  className?: string;
  variant?: 'outlined' | 'elevation';
  dense?: boolean;
  dividers?: boolean;
  selectable?: boolean;
}

/**
 * Універсальний компонент для відображення списків даних
 * Забезпечує консистентне відображення списків в різних частинах Order Wizard
 *
 * Використовується для:
 * - Списків клієнтів при пошуку
 * - Списків предметів у замовленні
 * - Результатів пошуку
 * - Історії дій
 */
export const DataList: React.FC<DataListProps> = ({
  items,
  onItemClick,
  loading = false,
  error = null,
  emptyMessage = 'Немає даних для відображення',
  title,
  maxHeight,
  className,
  variant = 'outlined',
  dense = false,
  dividers = true,
  selectable = true,
}) => {
  const containerProps = {
    ...(maxHeight && {
      sx: {
        maxHeight,
        overflow: 'auto',
      },
    }),
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      );
    }

    if (items.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">{emptyMessage}</Typography>
        </Box>
      );
    }

    return (
      <List dense={dense} {...containerProps}>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          const showDivider = dividers && !isLastItem;

          return (
            <>
              <ListItem key={item.id} disablePadding>
                {onItemClick && selectable ? (
                  <ListItemButton
                    onClick={() => onItemClick(item)}
                    disabled={item.disabled}
                    selected={item.selected}
                  >
                    {item.avatar && <ListItemAvatar>{item.avatar}</ListItemAvatar>}
                    <ListItemText
                      primary={item.primary}
                      secondary={item.secondary}
                      primaryTypographyProps={{
                        variant: dense ? 'body2' : 'body1',
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                      }}
                    />
                    {item.actions && (
                      <ListItemSecondaryAction>{item.actions}</ListItemSecondaryAction>
                    )}
                  </ListItemButton>
                ) : (
                  <>
                    {item.avatar && <ListItemAvatar>{item.avatar}</ListItemAvatar>}
                    <ListItemText
                      primary={item.primary}
                      secondary={item.secondary}
                      primaryTypographyProps={{
                        variant: dense ? 'body2' : 'body1',
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                      }}
                    />
                    {item.actions && (
                      <ListItemSecondaryAction>{item.actions}</ListItemSecondaryAction>
                    )}
                  </>
                )}
              </ListItem>
              {showDivider && <Divider />}
            </>
          );
        })}
      </List>
    );
  };

  return (
    <Paper variant={variant} className={className}>
      {title && (
        <>
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Divider />
        </>
      )}
      {renderContent()}
    </Paper>
  );
};
