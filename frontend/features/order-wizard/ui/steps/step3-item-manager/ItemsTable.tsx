/**
 * Компонент таблиці предметів замовлення
 * Використовує MUI DataGrid для табличного представлення
 */
import { FC } from 'react';
import { OrderItemUI } from '@/features/order-wizard/model/types/wizard.types';

// MUI компоненти
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Пропси для компонента
interface ItemsTableProps {
  items: OrderItemUI[];
  onEditItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  isLoading?: boolean;
}

/**
 * Компонент таблиці предметів замовлення
 */
export const ItemsTable: FC<ItemsTableProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  isLoading = false,
}) => {
  // Визначаємо колонки для таблиці
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Найменування', flex: 2, minWidth: 150 },
    { field: 'category', headerName: 'Категорія', flex: 1, minWidth: 120 },
    { field: 'quantity', headerName: 'Кількість', flex: 0.5, minWidth: 80,
      renderCell: (params: GridRenderCellParams<OrderItemUI>) => (
        <Typography variant="body2">
          {params.row.quantity || 1} {params.row.unitOfMeasurement === 'KILOGRAM' ? 'кг' : 'шт'}
        </Typography>
      )
    },
    { field: 'material', headerName: 'Матеріал', flex: 1, minWidth: 100 },
    { field: 'color', headerName: 'Колір', flex: 1, minWidth: 100 },
    { field: 'finalPrice', headerName: 'Сума', flex: 0.8, minWidth: 80,
      renderCell: (params: GridRenderCellParams<OrderItemUI>) => (
        <Typography variant="body2" fontWeight="bold">
          {params.row.finalPrice?.toFixed(2) || '0.00'} грн
        </Typography>
      )
    },
    { field: 'actions', headerName: 'Дії', flex: 0.8, minWidth: 100, sortable: false,
      renderCell: (params: GridRenderCellParams<OrderItemUI>) => (
        <Box>
          <Tooltip title="Редагувати">
            <IconButton
              color="primary"
              onClick={() => onEditItem(params.row.id || params.row.localId || '')}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Видалити">
            <IconButton
              color="error"
              onClick={() => onDeleteItem(params.row.id || params.row.localId || '')}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
  ];

  // Готуємо рядки для DataGrid (додаємо унікальні ідентифікатори)
  const rows = items.map(item => ({
    ...item,
    // Унікальний ID для DataGrid - використовуємо або ID з сервера, або локальний ID
    id: item.id || item.localId,
  }));

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          border: '1px dashed #ccc',
          borderRadius: 1,
          p: 2
        }}>
          <Typography variant="body1" color="text.secondary">
            Ще не додано жодного предмета. Натисніть &quot;Додати предмет&quot; для початку.
          </Typography>
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
          getRowId={(row) => row.id || row.localId || Math.random().toString()}
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />
      )}
    </Box>
  );
};
