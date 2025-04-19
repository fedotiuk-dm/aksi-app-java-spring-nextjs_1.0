import React, { useState } from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbar,
  GridActionsCellItem,
  GridRowParams,
  GridRenderCellParams
} from '@mui/x-data-grid';
import { Box, Typography, Paper, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { PriceListItem } from '../types';
import PriceListItemForm from './PriceListItemForm';

interface PriceListTableProps {
  categoryName: string;
  items: PriceListItem[];
  onUpdateItem?: (itemId: string, item: Partial<PriceListItem>) => Promise<void>;
}

const PriceListTable: React.FC<PriceListTableProps> = ({ categoryName, items, onUpdateItem }) => {
  const [editingItem, setEditingItem] = useState<PriceListItem | null>(null);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Форматування ціни у гривнях
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return '';
    return `${value.toFixed(2)} ₴`;
  };
  
  // Безпечний форматтер для ціни - гарантуємо, що це буде число
  const safePriceFormatter = (params: { value?: number | null | string }) => {
    if (params == null) return '';
    
    let numberValue: number | null = null;
    if (typeof params.value === 'number') {
      numberValue = params.value;
    } else if (typeof params.value === 'string') {
      try {
        numberValue = parseFloat(params.value);
      } catch (error) {
        console.error('Error parsing string to number:', error);
      }
    }
    
    if (numberValue === null || isNaN(numberValue)) return '';
    
    return formatCurrency(numberValue);
  };

  const handleEditItem = (item: PriceListItem) => {
    setEditingItem(item);
    setIsItemFormOpen(true);
  };
  
  const handleSaveItem = async (itemData: Partial<PriceListItem>) => {
    if (onUpdateItem && editingItem) {
      await onUpdateItem(editingItem.id, itemData);
      setIsItemFormOpen(false);
      setEditingItem(null);
    }
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
      valueFormatter: safePriceFormatter,
    },
    { 
      field: 'priceBlack',
      headerName: 'Ціна (чорний)',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: safePriceFormatter,
    },
    { 
      field: 'priceColor',
      headerName: 'Ціна (кольоровий)',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: safePriceFormatter,
    },
    { 
      field: 'active',
      headerName: 'Статус',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<PriceListItem>) => {
        // Отримуємо значення активності напряму з value, бо ми вже передали його у рядках
        const isItemActive = Boolean(params.value);
        
        return (
          <Chip 
            label={isItemActive ? 'Активний' : 'Неактивний'}
            color={isItemActive ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    // Додаємо колонку з кнопкою редагування, якщо є функція onUpdateItem
    ...(onUpdateItem ? [
      { 
        field: 'actions',
        type: 'actions' as const,
        headerName: 'Дії',
        width: 80,
        getActions: (params: GridRowParams<PriceListItem>) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Редагувати"
            onClick={() => handleEditItem(params.row)}
            showInMenu={false}
          />
        ]
      }
    ] : [])
  ];

  // Підготовка рядків даних
  const rows = items.map((item) => {
    // Дебугування: виводимо повний об'єкт в консоль
    console.log('PriceListItem from backend:', JSON.stringify(item, null, 2));
    
    // Застосовуємо всі можливі назви полів для сумісності
    // З бази даних ми отримуємо 'active', але в деяких компонентах використовується 'isActive'
    return {
      id: item.id,
      catalogNumber: item.catalogNumber,
      name: item.name,
      unitOfMeasure: item.unitOfMeasure,
      basePrice: parseFloat(String(item.basePrice || 0)),  // Гарантуємо числове значення
      priceBlack: item.priceBlack ? parseFloat(String(item.priceBlack)) : null,
      priceColor: item.priceColor ? parseFloat(String(item.priceColor)) : null,
      // Завжди встановлюємо поле active для DataGrid, незалежно від того, яке поле прийшло з API
      active: item.active === true || item.isActive === true,
    };
  });

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
      
      {/* Форма редагування елемента прайс-листа */}
      {isItemFormOpen && editingItem && (
        <PriceListItemForm
          open={isItemFormOpen}
          onClose={() => {
            setIsItemFormOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          item={editingItem}
          title="Редагувати позицію прайс-листа"
          categories={[]} // Потрібно передати всі категорії
          currentCategoryId={editingItem.categoryId}
          />
      )}
    </Paper>
  );
};

export default PriceListTable;
