# Специфікація компонента OrderWizard

## Загальний опис

OrderWizard - це компонент фронтенду, який реалізує покрокове заповнення даних для створення нового замовлення в хімчистці. Компонент побудований за принципами Feature-Sliced Design (FSD) та використовує архітектуру, що базується на бізнес-процесах.

## Технології

- Next.js 15.3.0 з App Router
- React 19.0.0
- TypeScript 5.x
- Material UI 7.0.x
- React Hook Form 7.55.0 для управління формами
- Zustand 5.0.x для управління станом
- React Query 5.72.x для взаємодії з API
- Zod 3.24.x для валідації форм

## Архітектура OrderWizard

OrderWizard складається з таких основних частин:

1. **Контейнер (Container)** - координація всіх кроків
2. **Кроки (Steps)** - логічно відокремлені екрани процесу
3. **Компоненти (Components)** - повторно використовувані компоненти для кожного кроку
4. **Модель (Model)** - бізнес-логіка та управління даними

```
features/
└── order-wizard/
    ├── model/
    │   ├── types.ts               # Типи даних замовлення
    │   ├── store.ts               # Zustand store для збереження стану
    │   ├── constants.ts           # Константи (етапи, статуси, тощо)
    │   └── helpers.ts             # Допоміжні функції
    ├── api/
    │   └── wizardApi.ts           # Методи для взаємодії з бекендом
    ├── hooks/
    │   ├── useWizardNavigation.ts # Хук для управління навігацією між кроками
    │   ├── useOrderData.ts        # Хук для управління даними замовлення
    │   ├── useClients.ts          # Хук для роботи з клієнтами
    │   ├── usePriceList.ts        # Хук для роботи з прайс-листом
    │   └── useCategories.ts       # Хук для роботи з категоріями послуг
    └── ui/
        ├── OrderWizard.tsx            # Головний контейнер
        ├── OrderWizardHeader.tsx      # Шапка візарда з прогресом
        ├── OrderWizardFooter.tsx      # Підвал з навігаційними кнопками
        ├── client-step/               # Крок 1: Вибір клієнта
        │   ├── ClientStep.tsx         # Головний компонент кроку
        │   ├── ClientSearch.tsx       # Пошук клієнта
        │   └── ClientCreate.tsx       # Форма створення нового клієнта
        ├── items-manager/             # Крок 2: Управління елементами замовлення
        │   ├── ItemsManagerStep.tsx   # Головний компонент кроку
        │   ├── ItemsTable.tsx         # Таблиця елементів замовлення
        │   ├── AddItemButton.tsx      # Кнопка додавання елемента
        │   └── ItemSummary.tsx        # Компонент підсумку замовлення
        ├── item-wizard/               # Крок 2.1: Додавання окремого елемента
        │   ├── ItemWizard.tsx         # Головний компонент підвізарда
        │   ├── CategorySelect.tsx     # Вибір категорії
        │   ├── PriceItemSelect.tsx    # Вибір позиції прайс-листа
        │   ├── ItemDetailsStep.tsx    # Деталі елемента
        │   ├── ItemPropertiesStep.tsx # Властивості елемента
        │   ├── MarkingsStep.tsx       # Позначки та дефекти
        │   └── PhotoStep.tsx          # Завантаження фото
        ├── order-params/              # Крок 3: Параметри замовлення
        │   ├── OrderParamsStep.tsx    # Головний компонент кроку
        │   ├── DeliveryParams.tsx     # Параметри видачі
        │   ├── PaymentSection.tsx     # Секція оплати
        │   └── NotesSection.tsx       # Секція додаткових нотаток
        └── confirmation/              # Крок 4: Підтвердження замовлення
            ├── ConfirmationStep.tsx   # Головний компонент кроку
            ├── OrderSummary.tsx       # Підсумок замовлення
            ├── ClientSummary.tsx      # Підсумок по клієнту
            └── ReceiptPreview.tsx     # Попередній перегляд квитанції
```

## Модель даних

Основна модель даних, що використовується в OrderWizard:

```typescript
// Замовлення
interface Order {
  id?: string; // UUID
  number?: string;
  clientId: string; // UUID
  userId?: string; // UUID
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  prepaidAmount: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt?: Date;
  completedAt?: Date;
  estimatedReleaseDate?: Date;
}

// Клієнт
interface Client {
  id?: string; // UUID
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  birthdate?: Date;
  gender?: Gender;
  status: ClientStatus;
  loyaltyLevel: LoyaltyLevel;
  tags?: string[];
  source: ClientSource;
  allowSMS: boolean;
  allowEmail: boolean;
  allowCalls: boolean;
}

// Елемент замовлення
interface OrderItem {
  id?: string; // UUID
  orderId?: string; // UUID
  priceListItemId?: string; // UUID
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  itemType?: string;
  fabric?: string;
  color?: string;
  description?: string;
  markings?: string;
  specialNotes?: string;
  photos?: Photo[];
}

// Фото
interface Photo {
  id?: string; // UUID
  url: string;
  description?: string;
  orderItemId: string; // UUID
}

// Категорія сервісу
interface ServiceCategory {
  id: string; // UUID
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
}

// Позиція прайс-листа
interface PriceListItem {
  id: string; // UUID
  categoryId: string; // UUID
  jsonId?: string;
  catalogNumber: number;
  name: string;
  unitOfMeasure: string;
  basePrice: number;
  priceBlack?: number;
  priceColor?: number;
  active: boolean;
}

// Платіж
interface Payment {
  id?: string; // UUID
  orderId: string; // UUID
  clientId: string; // UUID
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt?: Date;
}

// Історія замовлення
interface OrderHistory {
  id?: string; // UUID
  orderId: string; // UUID
  status: OrderStatus;
  comment?: string;
  createdAt?: Date;
  createdBy: string; // UUID користувача
}

// Користувач
interface User {
  id: string; // UUID
  name: string;
  email: string;
  role: UserRole;
  position?: string;
}

// Типи статусів замовлення
enum OrderStatus {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
}

// Статус клієнта
enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

// Рівень лояльності
enum LoyaltyLevel {
  STANDARD = 'STANDARD',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

// Стать
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// Джерело клієнта
enum ClientSource {
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  GOOGLE = 'GOOGLE',
  ADVERTISEMENT = 'ADVERTISEMENT',
  OTHER = 'OTHER',
}

// Метод оплати
enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  ONLINE = 'ONLINE',
  TRANSFER = 'TRANSFER',
}

// Статус платежу
enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Роль користувача
enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}
```

## Навігація між кроками

OrderWizard використовує механізм навігації, заснований на станах:

```typescript
// Стан навігації
interface WizardNavigation {
  currentStep: WizardStep;
  steps: WizardStep[];
  goToStep: (step: WizardStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  progress: number;
}

// Типи кроків
enum WizardStep {
  CLIENT = 'CLIENT',
  ITEMS = 'ITEMS',
  ITEM_WIZARD = 'ITEM_WIZARD',
  ORDER_PARAMS = 'ORDER_PARAMS',
  CONFIRMATION = 'CONFIRMATION',
}
```

## Процес взаємодії

1. **Крок 1: Вибір клієнта**

   - Пошук існуючого клієнта за повним ім'ям, телефоном або email
   - Створення нового клієнта з базовими та додатковими полями
   - Вибір рівня лояльності клієнта та тегів
   - Валідація даних клієнта перед продовженням

2. **Крок 2: Управління елементами замовлення**

   - Відображення доданих елементів у таблиці
   - Додавання нових елементів через ItemWizard
   - Редагування або видалення існуючих елементів
   - Автоматичний розрахунок загальної суми та кількості
   - Відображення проміжного підсумку замовлення

3. **Крок 2.1: Додавання/редагування елемента (ItemWizard)**

   - Вибір категорії послуг з відсортованого списку
   - Вибір позиції прайс-листа з певної категорії
   - Встановлення кількості та ручне коригування ціни за потреби
   - Вказання типу виробу, тканини, кольору та інших характеристик
   - Опис особливостей речі, маркуваннь та спеціальних зауважень
   - Завантаження фотографій елемента з описом

4. **Крок 3: Параметри замовлення**

   - Встановлення очікуваної дати видачі
   - Вказання методу оплати (готівка, карта, онлайн тощо)
   - Запис суми передоплати, якщо вона була здійснена
   - Додаткові нотатки до замовлення

5. **Крок 4: Підтвердження замовлення**
   - Перегляд повної інформації про клієнта та його контактних даних
   - Огляд усіх елементів замовлення, їх цін та загальної суми
   - Інформація про оплату та баланс замовлення
   - Генерація номеру замовлення та створення історії замовлення
   - Опція відправки SMS або email підтвердження клієнту
   - Попередній перегляд та опція друку квитанції

## Зберігання стану

Для зберігання стану між кроками використовується Zustand з персистентністю:

```typescript
interface OrderWizardState {
  // Дані клієнта
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;

  // Дані замовлення
  orderItems: OrderItem[];
  addOrderItem: (item: OrderItem) => void;
  updateOrderItem: (id: string, item: Partial<OrderItem>) => void;
  removeOrderItem: (id: string) => void;

  // Параметри замовлення
  estimatedReleaseDate: Date | null;
  setEstimatedReleaseDate: (date: Date | null) => void;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  prepaidAmount: number;
  setPrepaidAmount: (amount: number) => void;
  notes: string;
  setNotes: (notes: string) => void;

  // Загальні суми
  getTotalAmount: () => number;
  getRemainingAmount: () => number;

  // Фото
  itemPhotos: Record<string, Photo[]>;
  addItemPhoto: (itemId: string, photo: Photo) => void;
  removeItemPhoto: (itemId: string, photoId: string) => void;

  // Очищення даних
  resetWizard: () => void;
}
```

## Інтеграція з API

Для взаємодії з бекендом використовуються хуки React Query:

```typescript
// Пошук клієнтів
const useSearchClients = (query: string) => {
  return useQuery({
    queryKey: ['clients', 'search', query],
    queryFn: () => api.get(`/clients/search?query=${query}&size=10`),
    enabled: query.length >= 3,
  });
};

// Отримання категорій
const useServiceCategories = () => {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: () => api.get('/service-categories'),
  });
};

// Отримання прайс-листа за категорією
const usePriceListItems = (categoryId?: string) => {
  return useQuery({
    queryKey: ['price-list-items', categoryId],
    queryFn: () =>
      api.get(`/price-list-items?categoryId=${categoryId}&active=true`),
    enabled: !!categoryId,
  });
};

// Створення замовлення
const useCreateOrder = () => {
  return useMutation({
    mutationFn: (order: Order) => api.post('/orders', order),
    onSuccess: (data) => {
      // Обробка успіху
      toast.success(`Замовлення №${data.number} успішно створено`);
    },
  });
};
```

## Валідація форм

Для валідації форм використовується комбінація React Hook Form та Zod:

```typescript
// Схема валідації клієнта
const clientSchema = z.object({
  firstName: z.string().min(3, "Ім'я має містити щонайменше 3 символи"),
  lastName: z.string().min(3, "Прізвище має містити щонайменше 3 символи"),
  phone: z
    .string()
    .regex(/^\+380\d{9}$/, 'Телефон має бути у форматі +380XXXXXXXXX'),
  email: z.string().email('Невірний формат email').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  source: z
    .enum(['REFERRAL', 'SOCIAL_MEDIA', 'GOOGLE', 'ADVERTISEMENT', 'OTHER'])
    .default('OTHER'),
  allowSMS: z.boolean().default(true),
  allowEmail: z.boolean().default(true),
  allowCalls: z.boolean().default(true),
});

// Схема валідації елемента замовлення
const orderItemSchema = z.object({
  priceListItemId: z.string().uuid('Оберіть позицію з прайс-листа'),
  name: z.string().min(2, 'Назва має містити щонайменше 2 символи'),
  quantity: z.number().min(1, 'Кількість має бути більше 0'),
  unitPrice: z.number().min(1, 'Ціна має бути більше 0'),
  totalPrice: z.number().min(1, 'Загальна ціна має бути більше 0'),
  fabric: z.string().optional().or(z.literal('')),
  color: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  specialNotes: z.string().optional().or(z.literal('')),
});

// Схема валідації параметрів замовлення
const orderParamsSchema = z.object({
  estimatedReleaseDate: z.date().min(new Date(), 'Дата має бути в майбутньому'),
  paymentMethod: z.enum(['CASH', 'CARD', 'ONLINE', 'TRANSFER']),
  prepaidAmount: z.number().min(0, "Сума не може бути від'ємною"),
  notes: z.string().optional().or(z.literal('')),
});
```

## Компонент створення нового клієнта

```tsx
const ClientCreate: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Client>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      status: 'ACTIVE',
      loyaltyLevel: 'STANDARD',
      source: 'OTHER',
      allowSMS: true,
      allowEmail: true,
      allowCalls: true,
    },
  });

  const createClient = useCreateClient();
  const { setSelectedClient } = useOrderWizardStore();

  const onSubmit = async (data: Client) => {
    try {
      const result = await createClient.mutateAsync(data);
      setSelectedClient(result);
      toast.success('Клієнта успішно створено');
    } catch (error) {
      toast.error('Помилка при створенні клієнта');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Повне ім'я"
        {...register('firstName')}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Телефон"
        {...register('phone')}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        fullWidth
        margin="normal"
        placeholder="+380501234567"
      />

      <TextField
        label="Email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Адреса"
        {...register('address')}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Джерело</InputLabel>
        <Select {...register('source')}>
          <MenuItem value="REFERRAL">За рекомендацією</MenuItem>
          <MenuItem value="SOCIAL_MEDIA">Соціальні мережі</MenuItem>
          <MenuItem value="GOOGLE">Google</MenuItem>
          <MenuItem value="ADVERTISEMENT">Реклама</MenuItem>
          <MenuItem value="OTHER">Інше</MenuItem>
        </Select>
      </FormControl>

      <FormGroup row>
        <FormControlLabel
          control={<Checkbox {...register('allowSMS')} defaultChecked />}
          label="Дозволити SMS"
        />
        <FormControlLabel
          control={<Checkbox {...register('allowEmail')} defaultChecked />}
          label="Дозволити Email"
        />
        <FormControlLabel
          control={<Checkbox {...register('allowCalls')} defaultChecked />}
          label="Дозволити дзвінки"
        />
      </FormGroup>

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Створити клієнта
      </Button>
    </form>
  );
};
```

## Фінальний крок OrderWizard

```tsx
const ConfirmationStep: React.FC = () => {
  const {
    selectedClient,
    orderItems,
    estimatedReleaseDate,
    paymentMethod,
    prepaidAmount,
    notes,
    getTotalAmount,
    getRemainingAmount,
    resetWizard,
  } = useOrderWizardStore();

  const createOrder = useCreateOrder();
  const navigate = useNavigate();

  const handleCreateOrder = async () => {
    if (!selectedClient) return;

    const orderData: Order = {
      clientId: selectedClient.id!,
      items: orderItems.map((item) => ({
        ...item,
        priceListItemId: item.priceListItemId || undefined,
      })),
      status: 'NEW',
      totalAmount: getTotalAmount(),
      prepaidAmount: prepaidAmount || 0,
      paymentMethod: paymentMethod || undefined,
      notes: notes || undefined,
      estimatedReleaseDate: estimatedReleaseDate || undefined,
    };

    try {
      const result = await createOrder.mutateAsync(orderData);
      toast.success(`Замовлення №${result.data.number} успішно створено`);
      resetWizard();
      navigate(`/orders/${result.data.id}`);
    } catch (error) {
      toast.error('Помилка при створенні замовлення');
      console.error(error);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Інформація про клієнта
        </Typography>
        <ClientSummary client={selectedClient!} />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Елементи замовлення
        </Typography>
        <OrderSummary
          items={orderItems}
          totalAmount={getTotalAmount()}
          prepaidAmount={prepaidAmount}
          remainingAmount={getRemainingAmount()}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Деталі замовлення
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Очікувана дата видачі:</strong>{' '}
              {estimatedReleaseDate
                ? format(estimatedReleaseDate, 'dd.MM.yyyy HH:mm')
                : 'Не вказано'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Спосіб оплати:</strong>{' '}
              {paymentMethod
                ? paymentMethodLabels[paymentMethod]
                : 'Не вказано'}
            </Typography>
          </Grid>
          {notes && (
            <Grid item xs={12}>
              <Typography>
                <strong>Примітки:</strong> {notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCreateOrder}
          disabled={createOrder.isPending}
        >
          {createOrder.isPending ? 'Створення...' : 'Створити замовлення'}
        </Button>
      </Box>
    </Box>
  );
};
```
