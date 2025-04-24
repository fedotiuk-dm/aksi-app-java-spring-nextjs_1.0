/**
 * Форма пошуку клієнта
 */
import { FC, useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchClientFormValues, searchClientSchema } from '@/features/order-wizard/model/schema/client.schema';
import { useSearchClients } from '@/features/order-wizard/api';
import { ClientDTO } from '@/lib/api';
import { formValuesToClientSearchRequest, pageResponseToClientDTOArray, clientDtoToUI } from '@/features/order-wizard/model/adapters/client.adapters';

// MUI компоненти
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

interface ClientSearchFormProps {
  onSelectClient: (client: ClientDTO) => void;
  onSwitchToCreate: () => void;
}

export const ClientSearchForm: FC<ClientSearchFormProps> = ({ onSelectClient, onSwitchToCreate }) => {
  // Стан результатів пошуку
  const [searchResults, setSearchResults] = useState<ClientDTO[]>([]);
  
  // React Hook Form з Zod валідацією
  const { control, handleSubmit, watch, formState: { errors } } = useForm<SearchClientFormValues>({
    resolver: zodResolver(searchClientSchema),
    defaultValues: {
      searchQuery: '',
    }
  });
  
  // Мутація для пошуку клієнтів
  const { mutate: searchClients, isPending } = useSearchClients();
  
  // Функція пошуку, яку можна викликати при введенні тексту та при відправці форми
  const performSearch = useCallback((data: SearchClientFormValues) => {
    // Якщо пошуковий запит порожній або менше 2 символів, не здійснюємо пошук
    if (!data.searchQuery || data.searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Конвертуємо дані форми у формат API через адаптер
    const searchRequest = formValuesToClientSearchRequest(data);
    
    searchClients(
      // Використовуємо коректний тип ClientSearchRequest з адаптера
      searchRequest,
      {
        onSuccess: (response) => {
          // Конвертуємо відповідь у масив ClientDTO
          const clients = pageResponseToClientDTOArray(response);
          setSearchResults(clients);
        },
        onError: (error) => {
          console.error('Помилка пошуку клієнтів:', error);
        }
      }
    );
  }, [searchClients]);
  
  // Обробник відправки форми
  const onSubmit = (data: SearchClientFormValues) => {
    performSearch(data);
  };
  
  // Функція debounce для зменшення кількості запитів при введенні
  useEffect(() => {
    // Відслідковуємо зміни поля searchQuery
    const subscription = watch((value, { name }) => {
      if (name === 'searchQuery' || name === undefined) {
        const searchQuery = value.searchQuery as string;
        
        // Встановлюємо таймер для відкладеного пошуку
        const timeoutId = setTimeout(() => {
          if (searchQuery && searchQuery.trim().length >= 2) {
            console.log('Автоматичний пошук:', searchQuery);
            performSearch({ searchQuery });
          }
        }, 500); // 500ms затримка перед запитом
        
        return () => clearTimeout(timeoutId);
      }
    });
    
    // Очищаємо підписку при розмонтуванні компонента
    return () => subscription.unsubscribe();
  }, [watch, performSearch]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Пошук клієнта
      </Typography>
      
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Controller
                name="searchQuery"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Введіть ім'я, прізвище або телефон"
                    variant="outlined"
                    error={!!errors.searchQuery}
                    helperText={errors.searchQuery?.message || 'Введіть мінімум 2 символи для пошуку'}
                    disabled={isPending}
                    placeholder="Прізвище, ім'я або +38097..."
                  />
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<SearchIcon />}
                disabled={isPending}
                sx={{ mb: 1 }}
              >
                {isPending ? <CircularProgress size={24} /> : 'Шукати'}
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={onSwitchToCreate}
                fullWidth
              >
                Новий клієнт
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {searchResults.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Результати пошуку:
          </Typography>
          
          <Paper elevation={1}>
            <List>
              {searchResults.map((client) => (
                <Box key={client.id}>
                  <ListItem disablePadding>
                    <ListItemButton 
                      onClick={() => {
                        // Прямий виклик обробника вибору клієнта
                        console.log('Вибрано клієнта:', client.id, clientDtoToUI(client).fullName);
                        // Затримка не повинна бути потрібна, але додаємо як запас надійності
                        onSelectClient(client);
                      }}
                      sx={{ 
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText'
                        } 
                      }}
                    >
                      <ListItemText
                        primary={clientDtoToUI(client).fullName} 
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {client.phone}
                            </Typography>
                            {client.email && ` — ${client.email}`}
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </Paper>
        </Box>
      ) : searchResults.length === 0 && !isPending ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Клієнтів не знайдено. Спробуйте змінити параметри пошуку або створіть нового клієнта.
        </Typography>
      ) : null}
    </Box>
  );
};
