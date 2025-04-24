/**
 * Головний екран менеджера предметів замовлення (Етап 2.0)
 * Відповідає за відображення списку предметів та перехід до етапу додавання/редагування
 */
import { FC, useState } from 'react';
import { useOrderWizardMachine } from '@/features/order-wizard/hooks/state';

// MUI компоненти
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

// Компоненти етапу
import { ItemsTable } from './ItemsTable';
import { ItemSummary } from './ItemSummary';

// Пропси для компонента
interface ItemManagerProps {
  onNext: () => void;
  onBack: () => void;
}

/**
 * Головний компонент для управління предметами замовлення
 */
export const ItemManager: FC<ItemManagerProps> = ({ onNext, onBack }) => {
  // Отримуємо дані з машини станів
  const { actions, items, client, orderData } = useOrderWizardMachine();
  
  // Локальний стан для відстеження завантаження
  const [isLoading] = useState(false);
  
  // Обробник додавання нового предмета
  const handleAddItem = () => {
    console.log('Додавання нового предмета');
    actions.addItem();
    // Тут відбудеться перехід до підвізарду предметів через XState
  };
  
  // Обробник редагування існуючого предмета
  const handleEditItem = (itemId: string) => {
    console.log(`Редагування предмета з ID: ${itemId}`);
    actions.editItem(itemId);
    // Тут відбудеться перехід до підвізарду предметів через XState
  };
  
  // Обробник видалення предмета
  const handleDeleteItem = (itemId: string) => {
    console.log(`Видалення предмета з ID: ${itemId}`);
    actions.deleteItem(itemId);
  };
  
  // Перехід до наступного етапу
  const handleNext = () => {
    console.log('Перехід до етапу параметрів замовлення');
    onNext();
  };
  
  // Повернення до попереднього етапу
  const handleBack = () => {
    console.log('Повернення до етапу базової інформації');
    onBack();
  };
  
  // Обчислюємо, чи можна перейти до наступного етапу
  const canProceed = items.length > 0;
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Менеджер предметів замовлення
        </Typography>
        
        {client && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1 }}>
            <Typography variant="subtitle1">
              Клієнт: {client.firstName} {client.lastName}
            </Typography>
            <Typography variant="body2">
              Телефон: {client.phone}
              {client.email && ` | Email: ${client.email}`}
            </Typography>
          </Box>
        )}
        
        {orderData && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText', borderRadius: 1 }}>
            <Typography variant="subtitle1">
              Замовлення №{orderData.receiptNumber}
            </Typography>
            <Typography variant="body2">
              Пункт прийому: {orderData.receptionPointId}
              {orderData.uniqueTag && ` | Мітка: ${orderData.uniqueTag}`}
            </Typography>
          </Box>
        )}
        
        {/* Таблиця предметів */}
        <ItemsTable 
          items={items} 
          onEditItem={handleEditItem} 
          onDeleteItem={handleDeleteItem}
          isLoading={isLoading}
        />
        
        {/* Кнопка додавання предмета */}
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddItem}
          >
            Додати предмет
          </Button>
        </Box>
        
        {/* Підсумок предметів */}
        {items.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <ItemSummary items={items} />
          </Box>
        )}
      </Paper>
      
      {/* Кнопки навігації */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button 
          onClick={handleBack} 
          startIcon={<ArrowBackIcon />}
        >
          Назад
        </Button>
        
        <Button 
          onClick={handleNext} 
          variant="contained" 
          color="primary" 
          endIcon={<ArrowForwardIcon />}
          disabled={!canProceed}
        >
          Перейти до параметрів замовлення
        </Button>
      </Box>
      
      {/* Повідомлення, якщо немає предметів */}
      {items.length === 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
          <Typography variant="body2" color="warning.contrastText">
            Для продовження необхідно додати хоча б один предмет до замовлення.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
