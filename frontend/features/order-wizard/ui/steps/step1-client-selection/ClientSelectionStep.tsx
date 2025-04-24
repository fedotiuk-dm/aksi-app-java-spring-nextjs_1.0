/**
 * Крок вибору клієнта
 */
import { FC, useState } from 'react';
import { ClientDTO } from '@/lib/api';
import { ClientSearchForm } from './ClientSearchForm';
import { ClientCreateForm } from './ClientCreateForm';
import { useOrderWizard } from '@/features/order-wizard/hooks/state';

// MUI компоненти
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

type FormMode = 'search' | 'create';

interface ClientSelectionStepProps {
  // Додаткові пропси можна додати в майбутньому
}

export const ClientSelectionStep: FC<ClientSelectionStepProps> = () => {
  const [formMode, setFormMode] = useState<FormMode>('search');
  const { actions } = useOrderWizard();

  // Обробник вибору клієнта
  const handleSelectClient = (client: ClientDTO) => {
    // Зберігаємо клієнта в контексті машини станів
    // Ця дія автоматично переведе до наступного стану завдяки налаштуванню в машині станів
    actions.selectClient(client);
    console.log('Клієнта вибрано:', client.id);
    
    // Не викликаємо onClientSelect(), щоб уникнути повторних подій
  };

  // Обробник створення клієнта
  const handleClientCreated = (client: ClientDTO) => {
    // Зберігаємо створеного клієнта в контексті машини станів
    // Ця дія автоматично переведе до наступного стану завдяки налаштуванню в машині станів
    actions.createClient(client);
    console.log('Клієнта створено:', client.id);
    
    // Не викликаємо onClientSelect(), щоб уникнути повторних подій
  };

  // Зміна режиму форми
  const switchToSearch = () => setFormMode('search');
  const switchToCreate = () => setFormMode('create');

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Вибір клієнта
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" color="text.secondary" paragraph>
          Оберіть існуючого клієнта або створіть нового для замовлення.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {formMode === 'search' ? (
          <ClientSearchForm 
            onSelectClient={handleSelectClient} 
            onSwitchToCreate={switchToCreate} 
          />
        ) : (
          <ClientCreateForm 
            onClientCreated={handleClientCreated} 
            onSwitchToSearch={switchToSearch} 
          />
        )}
      </Paper>
    </Box>
  );
};
