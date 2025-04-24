/**
 * Форма створення нового клієнта
 */
import { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateClientFormValues, createClientFormSchema } from '@/features/order-wizard/model/schema/client.schema';
import { useCreateClient } from '@/features/order-wizard/api';
import { formValuesToClientCreateRequest, clientResponseToClientDTO } from '@/features/order-wizard/model/adapters/client.adapters';
import { ClientCreateRequest } from '@/lib/api';
import { ClientDTO } from '@/lib/api';

// MUI компоненти
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface ClientCreateFormProps {
  onClientCreated: (client: ClientDTO) => void;
  onSwitchToSearch: () => void;
}

export const ClientCreateForm: FC<ClientCreateFormProps> = ({ onClientCreated, onSwitchToSearch }) => {
  // React Hook Form з Zod валідацією
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(createClientFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      contactMethods: {
        phone: true,
        sms: false,
        viber: false,
      },
      informationSource: undefined,
      otherSourceInfo: '',
    }
  }) as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any;
    handleSubmit: (onSubmit: (data: CreateClientFormValues) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    watch: (name: string) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formState: { errors: any }
  };
  
  // Відстеження значення поля джерела інформації
  const informationSource = watch('informationSource');
  
  // Мутація для створення клієнта
  const { mutate: createClient, isPending } = useCreateClient();
  
  // Обробник відправки форми
  const onSubmit = (data: CreateClientFormValues) => {
    // Перетворення даних форми у формат для API запиту
    const clientData = formValuesToClientCreateRequest(data);
    
    // Відправка запиту на створення клієнта
    createClient(
      clientData as ClientCreateRequest, 
      {
        onSuccess: (response) => {
          // Конвертація відповіді в ClientDTO
          const clientDTO = clientResponseToClientDTO(response);
          
          // Виклик колбеку для передачі створеного клієнта
          onClientCreated(clientDTO);
        },
        onError: (error) => {
          console.error('Помилка створення клієнта:', error);
        }
      }
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Створення нового клієнта
      </Typography>
      
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Обов'язкові поля */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Прізвище"
                    variant="outlined"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    disabled={isPending}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Ім'я"
                    variant="outlined"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    disabled={isPending}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Телефон"
                    variant="outlined"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    placeholder="+380991234567"
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </Grid>
            
            {/* Опціональні поля */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Адреса"
                    variant="outlined"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </Grid>
            
            {/* Способи зв'язку */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Способи зв&apos;язку</FormLabel>
                <FormGroup>
                  <Controller
                    name="contactMethods.phone"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox checked={field.value} onChange={field.onChange} />}
                        label="Номер телефону"
                      />
                    )}
                  />
                  
                  <Controller
                    name="contactMethods.sms"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox checked={field.value} onChange={field.onChange} />}
                        label="SMS"
                      />
                    )}
                  />
                  
                  <Controller
                    name="contactMethods.viber"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox checked={field.value} onChange={field.onChange} />}
                        label="Viber"
                      />
                    )}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            
            {/* Джерело інформації */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Джерело інформації</FormLabel>
                <Controller
                  name="informationSource"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <FormControlLabel value="instagram" control={<Radio />} label="Instagram" />
                      <FormControlLabel value="google" control={<Radio />} label="Google" />
                      <FormControlLabel value="recommendation" control={<Radio />} label="Рекомендації" />
                      <FormControlLabel value="other" control={<Radio />} label="Інше" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
              
              {informationSource === 'other' && (
                <Controller
                  name="otherSourceInfo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Вкажіть джерело"
                      variant="outlined"
                      error={!!errors.otherSourceInfo}
                      helperText={errors.otherSourceInfo?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              )}
            </Grid>
            
            {/* Кнопки */}
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />}
                onClick={onSwitchToSearch}
              >
                Повернутись до пошуку
              </Button>
              
              <Button 
                type="submit"
                variant="contained" 
                color="primary"
                startIcon={<PersonAddIcon />}
                disabled={isPending}
              >
                {isPending ? <CircularProgress size={24} /> : 'Створити клієнта'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
