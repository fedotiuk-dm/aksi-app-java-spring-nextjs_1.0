# Тестування

## Структура тестів

```
features/order-wizard/
├── __tests__/
│   ├── api/
│   │   ├── clients/
│   │   │   ├── hooks/
│   │   │   │   ├── use-client-list.test.ts
│   │   │   │   ├── use-client-search.test.ts
│   │   │   │   └── use-client-form.test.ts
│   │   │   ├── store/
│   │   │   │   └── client.store.test.ts
│   │   │   └── utils/
│   │   │       └── client.mappers.test.ts
│   │   └── orders/
│   │       └── ...
│   ├── ui/
│   │   ├── steps/
│   │   │   ├── step1-client-selection/
│   │   │   │   └── ClientSelection.test.tsx
│   │   │   └── ...
│   │   └── shared/
│   │       └── components/
│   └── shared/
│       ├── hooks/
│       │   └── useDebounce.test.ts
│       └── utils/
│           └── date.utils.test.ts
```

## Тестування хуків

```typescript
// __tests__/api/clients/hooks/use-client-list.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useClientList } from '@/features/order-wizard/api/clients/hooks/use-client-list';
import { ClientsService } from '@/lib/api';

// Мок API сервісу
jest.mock('@/lib/api', () => ({
  ClientsService: {
    getAllClients: jest.fn(),
  },
}));

describe('useClientList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('повинен завантажити список клієнтів', async () => {
    const mockClients = [
      { id: '1', firstName: 'John', lastName: 'Doe' },
      { id: '2', firstName: 'Jane', lastName: 'Smith' },
    ];

    (ClientsService.getAllClients as jest.Mock).mockResolvedValue(mockClients);

    const { result, waitForNextUpdate } = renderHook(() => useClientList());

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.clients).toEqual(mockClients);
    expect(ClientsService.getAllClients).toHaveBeenCalledTimes(1);
  });

  it('повинен обробити помилку завантаження', async () => {
    const error = new Error('Failed to fetch clients');
    (ClientsService.getAllClients as jest.Mock).mockRejectedValue(error);

    const { result, waitForNextUpdate } = renderHook(() => useClientList());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
  });
});
```

## Тестування сторів

```typescript
// __tests__/api/clients/store/client.store.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useClientStore } from '@/features/order-wizard/api/clients/store/client.store';

describe('clientStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useClientStore());
    act(() => {
      result.current.clearSearchHistory();
    });
  });

  it('повинен оновити вибраного клієнта', () => {
    const { result } = renderHook(() => useClientStore());
    const client = { id: '1', firstName: 'John', lastName: 'Doe' };

    act(() => {
      result.current.setSelectedClient(client);
    });

    expect(result.current.selectedClient).toEqual(client);
  });

  it('повинен додати термін пошуку в історію', () => {
    const { result } = renderHook(() => useClientStore());
    const searchTerm = 'John';

    act(() => {
      result.current.addToSearchHistory(searchTerm);
    });

    expect(result.current.searchHistory).toContain(searchTerm);
  });
});
```

## Тестування компонентів

```typescript
// __tests__/ui/steps/step1-client-selection/ClientSelection.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClientSelection } from '@/features/order-wizard/ui/steps/step1-client-selection/ClientSelection';
import { useClientStore } from '@/features/order-wizard/api/clients/store/client.store';

// Мок сторів
jest.mock('@/features/order-wizard/api/clients/store/client.store');

describe('ClientSelection', () => {
  const mockSetSelectedClient = jest.fn();

  beforeEach(() => {
    (useClientStore as jest.Mock).mockReturnValue({
      selectedClient: null,
      setSelectedClient: mockSetSelectedClient,
    });
  });

  it('повинен відобразити форму пошуку', () => {
    render(<ClientSelection />);
    expect(screen.getByPlaceholderText('Пошук клієнтів')).toBeInTheDocument();
  });

  it('повинен оновити вибраного клієнта при виборі', async () => {
    render(<ClientSelection />);
    const client = { id: '1', firstName: 'John', lastName: 'Doe' };

    fireEvent.click(screen.getByText('John Doe'));

    await waitFor(() => {
      expect(mockSetSelectedClient).toHaveBeenCalledWith(client);
    });
  });
});
```

## Тестування утиліт

```typescript
// __tests__/shared/utils/date.utils.test.ts
import { formatDate, isPastDate, addDays } from '@/shared/utils/date.utils';

describe('date utils', () => {
  it('повинен відформатувати дату', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('1 січня 2024 р.');
  });

  it('повинен перевірити чи дата в минулому', () => {
    const pastDate = new Date('2023-01-01');
    const futureDate = new Date('2025-01-01');

    expect(isPastDate(pastDate)).toBe(true);
    expect(isPastDate(futureDate)).toBe(false);
  });

  it('повинен додати дні до дати', () => {
    const date = new Date('2024-01-01');
    const newDate = addDays(date, 5);
    expect(newDate.toISOString()).toBe('2024-01-06T00:00:00.000Z');
  });
});
```

## Тестування валідації

```typescript
// __tests__/api/clients/types/client.schema.test.ts
import { clientSchema } from '@/features/order-wizard/api/clients/types/client.schema';

describe('clientSchema', () => {
  it('повинен валідувати коректні дані', () => {
    const validClient = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+380501234567',
      email: 'john@example.com',
      communicationChannels: ['PHONE'],
    };

    const result = clientSchema.safeParse(validClient);
    expect(result.success).toBe(true);
  });

  it('повинен відхилити некоректні дані', () => {
    const invalidClient = {
      firstName: 'J', // Занадто коротке ім'я
      lastName: 'Doe',
      phone: '123', // Некоректний формат
      email: 'invalid-email',
      communicationChannels: ['INVALID'],
    };

    const result = clientSchema.safeParse(invalidClient);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors).toHaveLength(4);
    }
  });
});
```

## Рекомендації

1. **Організація тестів**

   - Дотримуйтесь структури проекту
   - Використовуйте описові назви тестів
   - Групуйте пов'язані тести

2. **Моки та стаби**

   - Мокайте зовнішні залежності
   - Використовуйте фікстури для тестових даних
   - Очищайте моки після кожного тесту

3. **Покриття тестами**

   - Тестуйте критичну бізнес-логіку
   - Перевіряйте граничні випадки
   - Тестуйте обробку помилок

4. **Інтеграційні тести**

   - Тестуйте взаємодію компонентів
   - Перевіряйте роботу з API
   - Тестуйте навігацію

5. **E2E тести**
   - Тестуйте критичні шляхи користувача
   - Перевіряйте інтеграцію з бекендом
   - Тестуйте різні сценарії використання

## Налаштування Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Налаштування тестового середовища

```typescript
// jest.setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Мок для window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```
