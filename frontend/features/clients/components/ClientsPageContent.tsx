'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Container,
  Grid,
  InputAdornment,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import ClientList from '@/features/clients/components/ClientList';
import { useFilteredClients } from '@/features/clients/hooks/useFilteredClients';
import {
  ClientStatus,
  LoyaltyLevel,
  ClientSource,
} from '@/features/clients/types';
import { SelectChangeEvent } from '@mui/material/Select';

export default function ClientsPageContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const {
    filteredClients,
    isLoading,
    error,
    totalClients,
    setFilters,
    filters,
  } = useFilteredClients();

  // Оновлення фільтрів при зміні вкладки
  useEffect(() => {
    let statusFilter;
    let daysAgo;
    let loyaltyLevel;

    switch (activeTab) {
      case 0: // Всі клієнти
        statusFilter = undefined;
        break;
      case 1: // Активні
        statusFilter = ClientStatus.ACTIVE;
        break;
      case 2: // Неактивні
        statusFilter = ClientStatus.INACTIVE;
        break;
      case 3: // VIP
        loyaltyLevel = LoyaltyLevel.VIP;
        break;
      case 4: // Нові (за останні 30 днів)
        daysAgo = 30;
        break;
    }

    setFilters({ ...filters, status: statusFilter, daysAgo, loyaltyLevel });
  }, [activeTab, filters, setFilters]);

  // Оновлення фільтрів при зміні пошукового запиту
  useEffect(() => {
    setFilters({ ...filters, search: searchQuery });
  }, [searchQuery, filters, setFilters]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    const value =
      event.target.value === 'ALL'
        ? undefined
        : (event.target.value as ClientStatus);
    setFilters({ ...filters, status: value });
  };

  const handleLoyaltyFilterChange = (event: SelectChangeEvent) => {
    const value =
      event.target.value === 'ALL'
        ? undefined
        : (event.target.value as LoyaltyLevel);
    setFilters({ ...filters, loyaltyLevel: value });
  };

  const handleSourceFilterChange = (event: SelectChangeEvent) => {
    const value =
      event.target.value === 'ALL'
        ? undefined
        : (event.target.value as ClientSource);
    setFilters({ ...filters, source: value });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setActiveTab(0);
  };

  // Додаємо функцію для примусового оновлення даних
  const handleRefresh = () => {
    // Очищаємо кеш запиту через useQueryClient - імітуємо перезавантаження даних
    window.location.reload();
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Клієнти
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Управління клієнтами, перегляд історії замовлень та аналітика
            </Typography>
          </Grid>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
            }}
          >
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              size="large"
              sx={{ mt: { xs: 2, md: 0 } }}
              onClick={() => router.push('/clients/new')}
            >
              Новий клієнт
            </Button>
          </Grid>
        </Grid>

        {/* Блок відображення помилки */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
              >
                Оновити
              </Button>
            }
          >
            <Typography variant="body1">
              Помилка завантаження даних клієнтів
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {error.message || 'Невідома помилка'}
            </Typography>
          </Alert>
        )}

        {/* Індикатор завантаження */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!error && (
          <>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Пошук за ім'ям, телефоном або email"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        onClick={toggleFilterDrawer}
                        sx={{ minWidth: '120px' }}
                      >
                        Фільтри
                      </Button>

                      {filters.status && (
                        <Chip
                          label={`Статус: ${
                            filters.status === ClientStatus.ACTIVE
                              ? 'Активний'
                              : filters.status === ClientStatus.INACTIVE
                              ? 'Неактивний'
                              : 'Заблокований'
                          }`}
                          onDelete={() =>
                            setFilters({ ...filters, status: undefined })
                          }
                        />
                      )}

                      {filters.loyaltyLevel && (
                        <Chip
                          label={`Лояльність: ${
                            filters.loyaltyLevel === LoyaltyLevel.VIP
                              ? 'VIP'
                              : filters.loyaltyLevel === LoyaltyLevel.PLATINUM
                              ? 'Платиновий'
                              : filters.loyaltyLevel === LoyaltyLevel.GOLD
                              ? 'Золотий'
                              : filters.loyaltyLevel === LoyaltyLevel.SILVER
                              ? 'Срібний'
                              : 'Стандарт'
                          }`}
                          onDelete={() =>
                            setFilters({
                              ...filters,
                              loyaltyLevel: undefined,
                            })
                          }
                        />
                      )}

                      {filters.source && (
                        <Chip
                          label={`Джерело: ${filters.source}`}
                          onDelete={() =>
                            setFilters({ ...filters, source: undefined })
                          }
                        />
                      )}
                    </Box>

                    {(filters.status ||
                      filters.loyaltyLevel ||
                      filters.source) && (
                      <Button size="small" onClick={clearFilters}>
                        Очистити всі
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Paper sx={{ mb: 4 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="клієнтські фільтри"
                sx={{ px: 2 }}
              >
                <Tab label="Всі клієнти" />
                <Tab label="Активні" />
                <Tab label="Неактивні" />
                <Tab label="VIP" />
                <Tab label="Нові" />
              </Tabs>
              <Divider />
              <Box sx={{ p: { xs: 1, md: 2 } }}>
                <ClientList clients={filteredClients} isLoading={isLoading} />
              </Box>
            </Paper>
          </>
        )}
      </Box>

      {/* Панель розширених фільтрів */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={toggleFilterDrawer}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6">Розширені фільтри</Typography>
            <IconButton onClick={toggleFilterDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Статус клієнта</InputLabel>
                <Select
                  value={filters.status || 'ALL'}
                  label="Статус клієнта"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="ALL">Всі статуси</MenuItem>
                  <MenuItem value={ClientStatus.ACTIVE}>Активні</MenuItem>
                  <MenuItem value={ClientStatus.INACTIVE}>Неактивні</MenuItem>
                  <MenuItem value={ClientStatus.BLOCKED}>Заблоковані</MenuItem>
                </Select>
              </FormControl>
            </ListItem>

            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Рівень лояльності</InputLabel>
                <Select
                  value={filters.loyaltyLevel || 'ALL'}
                  label="Рівень лояльності"
                  onChange={handleLoyaltyFilterChange}
                >
                  <MenuItem value="ALL">Всі рівні</MenuItem>
                  <MenuItem value={LoyaltyLevel.STANDARD}>Стандарт</MenuItem>
                  <MenuItem value={LoyaltyLevel.SILVER}>Срібний</MenuItem>
                  <MenuItem value={LoyaltyLevel.GOLD}>Золотий</MenuItem>
                  <MenuItem value={LoyaltyLevel.PLATINUM}>Платиновий</MenuItem>
                  <MenuItem value={LoyaltyLevel.VIP}>VIP</MenuItem>
                </Select>
              </FormControl>
            </ListItem>

            <ListItem>
              <FormControl fullWidth>
                <InputLabel>Джерело</InputLabel>
                <Select
                  value={filters.source || 'ALL'}
                  label="Джерело"
                  onChange={handleSourceFilterChange}
                >
                  <MenuItem value="ALL">Всі джерела</MenuItem>
                  <MenuItem value={ClientSource.REFERRAL}>
                    За рекомендацією
                  </MenuItem>
                  <MenuItem value={ClientSource.SOCIAL_MEDIA}>
                    Соціальні мережі
                  </MenuItem>
                  <MenuItem value={ClientSource.GOOGLE}>Google</MenuItem>
                  <MenuItem value={ClientSource.ADVERTISEMENT}>
                    Реклама
                  </MenuItem>
                  <MenuItem value={ClientSource.RETURNING}>
                    Повторний клієнт
                  </MenuItem>
                  <MenuItem value={ClientSource.WALK_IN}>
                    Випадковий прохід
                  </MenuItem>
                  <MenuItem value={ClientSource.OTHER}>Інше</MenuItem>
                </Select>
              </FormControl>
            </ListItem>

            <ListItem>
              <ListItemText
                primary={`Знайдено клієнтів: ${filteredClients.length} з ${totalClients}`}
                secondary="Застосовуйте фільтри для уточнення результатів"
              />
            </ListItem>

            <ListItem>
              <Button fullWidth variant="outlined" onClick={clearFilters}>
                Скинути всі фільтри
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Container>
  );
}
