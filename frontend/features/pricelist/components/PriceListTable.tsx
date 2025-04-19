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
  const formatCurrency = (value: number | string | null) => {
    if (value === null || value === undefined) return '';
    
    let numValue: number;
    
    if (typeof value === 'string') {
      try {
        numValue = parseFloat(value);
      } catch (e) {
        console.error('Failed to parse price value:', value, e);
        return '';
      }
    } else if (typeof value === 'number') {
      numValue = value;
    } else {
      return '';
    }
    
    if (isNaN(numValue)) return '';
    
    return `${numValue.toFixed(2)} ₴`;
  };
  
  // Видалили невикористану функцію safePriceFormatter, оскільки ми використовуємо кастомний renderCell для всіх колонок з цінами

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
      renderCell: (params) => {
        // Дебуг параметрів комірки та вивід значення
        console.log('basePrice cell', params.row.basePrice, typeof params.row.basePrice);
        return <span>{formatCurrency(params.row.basePrice)}</span>;
      },
    },
    { 
      field: 'priceBlack',
      headerName: 'Ціна (чорний)',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        console.log('priceBlack cell', params.row.priceBlack, typeof params.row.priceBlack);
        return <span>{formatCurrency(params.row.priceBlack)}</span>;
      },
    },
    { 
      field: 'priceColor',
      headerName: 'Ціна (кольоровий)',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        console.log('priceColor cell', params.row.priceColor, typeof params.row.priceColor);
        return <span>{formatCurrency(params.row.priceColor)}</span>;
      },
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
  console.log('Original items:', items);
  
  const rows = items.map((item) => {
    // Детальне логування кожного елемента для діагностики
    console.log('Item before transform:', item);
    console.log('Price fields:', {
      basePrice: item.basePrice,
      basePrice_type: typeof item.basePrice,
      priceBlack: item.priceBlack,
      priceBlack_type: typeof item.priceBlack,
      priceColor: item.priceColor,
      priceColor_type: typeof item.priceColor
    });
    
    // Перетворюємо всі ціни на числа, обробляємо всі можливі випадки
    let basePrice = 0;
    if (item.basePrice !== undefined && item.basePrice !== null) {
      basePrice = typeof item.basePrice === 'string' ? parseFloat(item.basePrice) : Number(item.basePrice);
    }
    
    let priceBlack = null;
    if (item.priceBlack !== undefined && item.priceBlack !== null) {
      priceBlack = typeof item.priceBlack === 'string' ? parseFloat(item.priceBlack) : Number(item.priceBlack);
    }
    
    let priceColor = null;
    if (item.priceColor !== undefined && item.priceColor !== null) {
      priceColor = typeof item.priceColor === 'string' ? parseFloat(item.priceColor) : Number(item.priceColor);
    }
    
    const result = {
      id: item.id,
      catalogNumber: item.catalogNumber,
      name: item.name,
      unitOfMeasure: item.unitOfMeasure,
      basePrice: basePrice,
      priceBlack: priceBlack,
      priceColor: priceColor,
      active: item.active === true || item.isActive === true,
    };
    
    console.log('Transformed item:', result);
    return result;
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
