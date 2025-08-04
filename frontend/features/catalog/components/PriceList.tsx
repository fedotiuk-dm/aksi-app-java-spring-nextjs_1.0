'use client';

/**
 * @fileoverview Прайс-лист (офіційний, read-only)
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Category,
  Numbers,
  ViewList,
  ViewModule,
} from '@mui/icons-material';
import { useState } from 'react';
import { 
  PRICE_LIST_CATEGORY_NAMES,
  UNIT_NAMES,
  formatPrice,
  useCatalogStore,
  CATALOG_DEFAULTS,
  CATALOG_MESSAGES
} from '@/features/catalog';
import { useListPriceListItems } from '@/shared/api/generated/serviceItem';
import type { PriceListItemInfo } from '@/shared/api/generated/serviceItem';

type ViewMode = 'cards' | 'table';

export const PriceList = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const { filters } = useCatalogStore();
  
  const { 
    data: priceListData, 
    isLoading, 
    error 
  } = useListPriceListItems({
    active: filters.activeOnly ?? CATALOG_DEFAULTS.FILTERS.ACTIVE_ONLY,
    categoryCode: filters.priceListCategory,
    offset: CATALOG_DEFAULTS.PAGINATION.OFFSET,
    limit: CATALOG_DEFAULTS.PAGINATION.LIMIT,
  });

  const priceListItems = priceListData?.priceListItems || [];
  
  // Group items by category
  const grouped = priceListItems.reduce((acc, item) => {
    if (!acc[item.categoryCode]) {
      acc[item.categoryCode] = [];
    }
    acc[item.categoryCode].push(item);
    return acc;
  }, {} as Record<string, PriceListItemInfo[]>);

  if (isLoading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={200} height={36} />
        </Box>
        {viewMode === 'cards' ? (
          <Grid container spacing={2}>
            {Array.from({ length: CATALOG_DEFAULTS.PAGINATION.SKELETON_ITEMS }).map((_, index) => (
              <Grid size={{ xs: CATALOG_DEFAULTS.GRID.BREAKPOINTS.XS, sm: CATALOG_DEFAULTS.GRID.BREAKPOINTS.SM, md: CATALOG_DEFAULTS.GRID.BREAKPOINTS.MD }} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={32} />
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Skeleton variant="rectangular" width="100%" height={400} />
        )}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {CATALOG_MESSAGES.PRICE_LIST.LOADING_ERROR}: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {CATALOG_MESSAGES.PRICE_LIST.TITLE} ({priceListItems.length})
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          aria-label={CATALOG_MESSAGES.PRICE_LIST.VIEW_MODE_LABEL}
        >
          <ToggleButton value="cards" aria-label={CATALOG_MESSAGES.PRICE_LIST.CARDS_VIEW}>
            <ViewModule />
          </ToggleButton>
          <ToggleButton value="table" aria-label={CATALOG_MESSAGES.PRICE_LIST.TABLE_VIEW}>
            <ViewList />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {priceListItems.length === 0 ? (
        <Alert severity="info">
          {CATALOG_MESSAGES.PRICE_LIST.NO_ITEMS}
        </Alert>
      ) : viewMode === 'cards' ? (
        <PriceListCards items={priceListItems} grouped={grouped} />
      ) : (
        <PriceListTable items={priceListItems} />
      )}
    </Box>
  );
};

interface PriceListCardsProps {
  items: PriceListItemInfo[];
  grouped: Record<string, PriceListItemInfo[]>;
}

const PriceListCards = ({ items, grouped }: PriceListCardsProps) => {
  const groupedEntries = Object.entries(grouped);

  if (groupedEntries.length === 0) {
    return (
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid size={{ xs: CATALOG_DEFAULTS.GRID.BREAKPOINTS.XS, sm: CATALOG_DEFAULTS.GRID.BREAKPOINTS.SM, md: CATALOG_DEFAULTS.GRID.BREAKPOINTS.MD }} key={item.id}>
            <PriceListCard item={item} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      {groupedEntries.map(([categoryCode, categoryItems]) => (
        <Box key={categoryCode} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {PRICE_LIST_CATEGORY_NAMES[categoryCode as keyof typeof PRICE_LIST_CATEGORY_NAMES] || categoryCode}
            <Chip label={categoryItems.length} size="small" sx={{ ml: 1 }} />
          </Typography>
          <Grid container spacing={2}>
            {categoryItems.map((item) => (
              <Grid size={{ xs: CATALOG_DEFAULTS.GRID.BREAKPOINTS.XS, sm: CATALOG_DEFAULTS.GRID.BREAKPOINTS.SM, md: CATALOG_DEFAULTS.GRID.BREAKPOINTS.MD }} key={item.id}>
                <PriceListCard item={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

interface PriceListCardProps {
  item: PriceListItemInfo;
}

const PriceListCard = ({ item }: PriceListCardProps) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
            {item.name}
          </Typography>
          <Chip
            icon={<Numbers />}
            label={`№${item.catalogNumber}`}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            icon={<Category />}
            label={PRICE_LIST_CATEGORY_NAMES[item.categoryCode] || item.categoryCode}
            size="small"
            variant="outlined"
          />
          <Chip
            label={UNIT_NAMES[item.unitOfMeasure]}
            size="small"
            variant="filled"
            color="primary"
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
            {formatPrice(item.basePrice)}
          </Typography>
          
          {item.priceBlack !== undefined && item.priceBlack !== item.basePrice && (
            <Typography variant="body2" color="text.secondary">
              {CATALOG_MESSAGES.PRICE_LIST.BLACK_DYEING}: {formatPrice(item.priceBlack)}
            </Typography>
          )}
        </Box>

        {!item.active && (
          <Chip
            label={CATALOG_MESSAGES.PRICE_LIST.INACTIVE}
            size="small"
            color="error"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );
};

interface PriceListTableProps {
  items: PriceListItemInfo[];
}

const PriceListTable = ({ items }: PriceListTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: CATALOG_DEFAULTS.TABLE.MIN_WIDTH }} aria-label={CATALOG_MESSAGES.PRICE_LIST.TITLE}>
        <TableHead>
          <TableRow>
            <TableCell>{CATALOG_MESSAGES.PRICE_LIST.TABLE_HEADERS.NUMBER}</TableCell>
            <TableCell>{CATALOG_MESSAGES.PRICE_LIST.TABLE_HEADERS.NAME}</TableCell>
            <TableCell>{CATALOG_MESSAGES.PRICE_LIST.TABLE_HEADERS.CATEGORY}</TableCell>
            <TableCell>{CATALOG_MESSAGES.PRICE_LIST.TABLE_HEADERS.UNIT}</TableCell>
            <TableCell align="right">{CATALOG_MESSAGES.PRICE_LIST.TABLE_HEADERS.BASE_PRICE}</TableCell>
            <TableCell align="right">{CATALOG_MESSAGES.PRICE_LIST.TABLE_HEADERS.BLACK_PRICE}</TableCell>
            <TableCell align="center">{CATALOG_MESSAGES.PRICE_LIST.TABLE_HEADERS.STATUS}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.catalogNumber}
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {PRICE_LIST_CATEGORY_NAMES[item.categoryCode] || item.categoryCode}
              </TableCell>
              <TableCell>{UNIT_NAMES[item.unitOfMeasure]}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="primary" fontWeight="medium">
                  {formatPrice(item.basePrice)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {item.priceBlack !== undefined && item.priceBlack !== item.basePrice ? (
                  formatPrice(item.priceBlack)
                ) : (
                  CATALOG_MESSAGES.PRICE_LIST.EMPTY_VALUE
                )}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={item.active ? CATALOG_MESSAGES.PRICE_LIST.ACTIVE : CATALOG_MESSAGES.PRICE_LIST.INACTIVE}
                  size="small"
                  color={item.active ? 'success' : 'error'}
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};