import React, { useState } from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbar
} from '@mui/x-data-grid';
import { Box, Typography, Paper } from '@mui/material';
import { PriceListItem } from '../types';

interface PriceListTableProps {
  categoryName: string;
  items: PriceListItem[];
}

const PriceListTable: React.FC<PriceListTableProps> = ({ categoryName, items }) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Форматування ціни у гривнях
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return '';
    return `${value.toFixed(2)} ₴`;
  };

  const columns: GridColDef[] = [
    { 
      field: 'catalogNumber',
      headerName: '№',
      width: 70,
      align: 'center',
      headerAlign: 'center',
    },
    { 
      field: 'name',
      headerName: 'Назва послуги',
      flex: 3,
      minWidth: 250,
    },
    { 
      field: 'unitOfMeasure',
      headerName: 'Од. виміру',
      width: 100,
    },
    { 
      field: 'basePrice',
      headerName: 'Базова ціна',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: ({ value }: { value: number | null }) => formatCurrency(value),
    },
    { 
      field: 'priceBlack',
      headerName: 'Ціна (чорний)',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: ({ value }: { value: number | null }) => formatCurrency(value),
    },
    { 
      field: 'priceColor',
      headerName: 'Ціна (кольоровий)',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: ({ value }: { value: number | null }) => formatCurrency(value),
    },
  ];

  // Підготовка рядків даних
  const rows = items.map((item) => ({
    id: item.id,
    catalogNumber: item.catalogNumber,
    name: item.name,
    unitOfMeasure: item.unitOfMeasure,
    basePrice: item.basePrice,
    priceBlack: item.priceBlack,
    priceColor: item.priceColor,
  }));

  return (
    <Paper elevation={2} sx={{ p: 2, my: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {categoryName}
      </Typography>
      <Box sx={{ height: 'auto', width: '100%', mb: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
          getRowHeight={() => 'auto'}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 300 },
            },
          }}
          sx={{
            '& .MuiDataGrid-cellContent': {
              py: 1.5, // Збільшуємо висоту вмісту клітинок
            },
          }}
          localeText={{
            noRowsLabel: 'Немає даних',
            toolbarFilters: 'Фільтри',
            toolbarFiltersLabel: 'Показати фільтри',
            toolbarDensity: 'Розмір таблиці',
            toolbarDensityLabel: 'Розмір',
            toolbarDensityCompact: 'Компактний',
            toolbarDensityStandard: 'Стандартний',
            toolbarDensityComfortable: 'Комфортний',
            toolbarExport: 'Експорт',
            toolbarExportLabel: 'Експорт',
            toolbarExportCSV: 'Завантажити як CSV',
            toolbarExportPrint: 'Друк',
            toolbarQuickFilterPlaceholder: 'Пошук...',
          }}
        />
      </Box>
    </Paper>
  );
};

export default PriceListTable;
