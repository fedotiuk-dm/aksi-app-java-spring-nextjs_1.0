'use client';

/**
 * @fileoverview Список товарів каталогу
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Category,
  Numbers,
} from '@mui/icons-material';
import { useListItems } from '@/shared/api/generated/serviceItem';
import { 
  ITEM_CATEGORY_NAMES, 
  useCatalogStore,
  CATALOG_DEFAULTS,
  CATALOG_MESSAGES
} from '@/features/catalog';
import type { ItemInfo } from '@/shared/api/generated/serviceItem';

interface ItemListProps {
  onEdit?: (item: ItemInfo) => void;
  onDelete?: (itemId: string) => void;
  onAdd?: () => void;
}

export const ItemList = ({ onEdit, onDelete, onAdd }: ItemListProps) => {
  const { filters } = useCatalogStore();
  
  const { 
    data: itemsData, 
    isLoading, 
    error 
  } = useListItems({
    active: filters.activeOnly,
    category: filters.itemCategory,
  });

  if (isLoading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
        <Grid container spacing={2}>
          {Array.from({ length: CATALOG_DEFAULTS.PAGINATION.SKELETON_ITEMS }).map((_, index) => (
            <Grid size={{ xs: CATALOG_DEFAULTS.GRID.BREAKPOINTS.XS, sm: CATALOG_DEFAULTS.GRID.BREAKPOINTS.SM, md: CATALOG_DEFAULTS.GRID.BREAKPOINTS.MD }} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1 }} />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Skeleton variant="rectangular" width={80} height={24} />
                    <Skeleton variant="rectangular" width={60} height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {CATALOG_MESSAGES.ITEM_LIST.LOADING_ERROR}: {error.message}
      </Alert>
    );
  }

  const items = itemsData?.items || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {CATALOG_MESSAGES.ITEM_LIST.TITLE} ({items.length})
        </Typography>
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAdd}
          >
            {CATALOG_MESSAGES.ITEM_LIST.ADD_BUTTON}
          </Button>
        )}
      </Box>

      {items.length === 0 ? (
        <Alert severity="info">
          {CATALOG_MESSAGES.ITEM_LIST.NO_ITEMS}. {onAdd && CATALOG_MESSAGES.ITEM_LIST.CREATE_FIRST}.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid size={{ xs: CATALOG_DEFAULTS.GRID.BREAKPOINTS.XS, sm: CATALOG_DEFAULTS.GRID.BREAKPOINTS.SM, md: CATALOG_DEFAULTS.GRID.BREAKPOINTS.MD }} key={item.id}>
              <ItemCard
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

interface ItemCardProps {
  item: ItemInfo;
  onEdit?: (item: ItemInfo) => void;
  onDelete?: (itemId: string) => void;
}

const ItemCard = ({ item, onEdit, onDelete }: ItemCardProps) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
            {item.name}
          </Typography>
          <Box>
            {onEdit && (
              <IconButton
                size="small"
                onClick={() => onEdit(item)}
                aria-label={`${CATALOG_MESSAGES.ITEM_LIST.EDIT_ARIA} ${item.name}`}
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(item.id)}
                aria-label={`${CATALOG_MESSAGES.ITEM_LIST.DELETE_ARIA} ${item.name}`}
                color="error"
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {CATALOG_MESSAGES.ITEM_LIST.CODE_LABEL}: {item.code}
        </Typography>

        {item.pluralName && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {CATALOG_MESSAGES.ITEM_LIST.PLURAL_LABEL}: {item.pluralName}
          </Typography>
        )}

        {item.description && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {item.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            icon={<Category />}
            label={ITEM_CATEGORY_NAMES[item.category]}
            size="small"
            variant="outlined"
          />
          {item.catalogNumber && (
            <Chip
              icon={<Numbers />}
              label={`№${item.catalogNumber}`}
              size="small"
              variant="outlined"
            />
          )}
          {!item.active && (
            <Chip
              label={CATALOG_MESSAGES.ITEM_LIST.INACTIVE}
              size="small"
              color="error"
              variant="outlined"
            />
          )}
        </Box>

        {item.serviceCategoryCode && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            {CATALOG_MESSAGES.ITEM_LIST.SERVICE_CATEGORY_LABEL}: {item.serviceCategoryCode}
          </Typography>
        )}

        {item.tags && item.tags.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {CATALOG_MESSAGES.ITEM_LIST.TAGS_LABEL}:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {item.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};