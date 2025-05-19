# Робота з датами (dayjs + MUI)

## Налаштування dayjs

```typescript
// shared/utils/date.config.ts
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Розширення dayjs
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// Встановлення локалі
dayjs.locale('uk');

// Експорт налаштованого dayjs
export { dayjs };
```

## Утиліти для роботи з датами

```typescript
// shared/utils/date.utils.ts
import { dayjs } from './date.config';

// Форматування дати
export const formatDate = (date: string | Date) => {
  return dayjs(date).format('LL');
};

// Форматування дати та часу
export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format('LLL');
};

// Форматування часу
export const formatTime = (date: string | Date) => {
  return dayjs(date).format('LT');
};

// Перевірка чи дата в минулому
export const isPastDate = (date: string | Date) => {
  return dayjs(date).isBefore(dayjs());
};

// Перевірка чи дата в майбутньому
export const isFutureDate = (date: string | Date) => {
  return dayjs(date).isAfter(dayjs());
};

// Додавання днів до дати
export const addDays = (date: string | Date, days: number) => {
  return dayjs(date).add(days, 'day');
};

// Віднімання днів від дати
export const subtractDays = (date: string | Date, days: number) => {
  return dayjs(date).subtract(days, 'day');
};

// Отримання початку дня
export const startOfDay = (date: string | Date) => {
  return dayjs(date).startOf('day');
};

// Отримання кінця дня
export const endOfDay = (date: string | Date) => {
  return dayjs(date).endOf('day');
};
```

## Інтеграція з MUI DatePicker

```typescript
// shared/components/DatePicker.tsx
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { dayjs } from '@/shared/utils/date.config';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  disabled,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
      <MuiDatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        disabled={disabled}
        format="DD.MM.YYYY"
      />
    </LocalizationProvider>
  );
};
```

## Використання в компонентах

```typescript
// ui/steps/step4-price-calculation/components/PriceCalculation.tsx
import { DatePicker } from '@/shared/components/DatePicker';
import { formatDate, isPastDate } from '@/shared/utils/date.utils';

export const PriceCalculation = () => {
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    if (date && isPastDate(date)) {
      // Показуємо помилку
      return;
    }
    setDeliveryDate(date);
  };

  return (
    <div>
      <DatePicker
        label="Дата доставки"
        value={deliveryDate}
        onChange={handleDateChange}
        minDate={new Date()} // Мінімальна дата - сьогодні
      />
      {deliveryDate && (
        <Typography>Обрана дата: {formatDate(deliveryDate)}</Typography>
      )}
    </div>
  );
};
```

## Валідація дат з Zod

```typescript
// api/orders/types/order.schema.ts
import { z } from 'zod';
import { isFutureDate } from '@/shared/utils/date.utils';

export const orderSchema = z.object({
  // ... інші поля
  deliveryDate: z
    .date()
    .refine(
      (date) => isFutureDate(date),
      'Дата доставки має бути в майбутньому'
    ),
});
```

## Форматування дат в таблицях

```typescript
// ui/components/DataTable.tsx
import { formatDateTime } from '@/shared/utils/date.utils';

export const DataTable = ({ data }) => {
  const columns = [
    // ... інші колонки
    {
      field: 'createdAt',
      headerName: 'Дата створення',
      valueFormatter: (params) => formatDateTime(params.value),
    },
    {
      field: 'deliveryDate',
      headerName: 'Дата доставки',
      valueFormatter: (params) => formatDate(params.value),
    },
  ];

  return (
    <DataGrid
      rows={data}
      columns={columns}
      // ... інші пропси
    />
  );
};
```

## Рекомендації

1. **Локалізація**

   - Використовуйте українську локаль для dayjs
   - Налаштуйте формати дат відповідно до локалі
   - Використовуйте локалізовані компоненти MUI

2. **Валідація**

   - Перевіряйте коректність дат
   - Валідуйте діапазони дат
   - Обробляйте помилки валідації

3. **Форматування**

   - Використовуйте консистентні формати
   - Створюйте перевикористовувані утиліти
   - Дотримуйтесь стандартів локалізації

4. **Оптимізація**

   - Мемоізуйте форматовані дати
   - Використовуйте кешування для часто використовуваних дат
   - Оптимізуйте рендеринг таблиць з датами

5. **Тестування**
   - Тестуйте різні формати дат
   - Перевіряйте валідацію
   - Тестуйте локалізацію
