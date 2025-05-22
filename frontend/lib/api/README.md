# API Клієнти в проекті Aksi-app

## Правила імпортів

### 1. ЗАВЖДИ використовуйте імпорти з коренового шляху `@/lib/api`

```typescript
// ✅ ПРАВИЛЬНО
import { ClientsService, ClientDTO } from '@/lib/api';

// ❌ НЕПРАВИЛЬНО
import { ClientsService } from '@/lib/api/generated/services/ClientsService';
import { ClientDTO } from '@/lib/api/generated/models/ClientDTO';
```

### 2. Причини заборони прямих імпортів

- **Налаштування авторизації**: Файл `index.ts` виконує важливі налаштування для авторизації, CORS та cookies
- **Стабільність при оновленнях**: Внутрішня структура `/generated` може змінюватися при перегенерації API клієнтів
- **Порядок виконання коду**: Прямі імпорти можуть "пропустити" важливі глобальні налаштування

### 3. Структура імпортів відповідно до Feature-Sliced Design

- **В хуках API**: імпортуємо сервіси та типи безпосередньо з `@/lib/api`

  ```typescript
  // У файлі /features/clients/api/hooks/useClients.ts
  import { ClientsService, ClientDTO } from '@/lib/api';
  ```

- **В UI компонентах**: імпортуємо хуки з відповідних директорій features
  ```typescript
  // У файлі /features/clients/ui/ClientsList.tsx
  import { useSearchClients } from '@/features/clients/api';
  ```

## Технічні деталі

Файл `index.ts` в директорії `lib/api` виконує важливу роботу:

1. Встановлює базовий URL для всіх API запитів
2. Налаштовує передачу авторизаційних cookies та токенів
3. Створює спеціальний axios екземпляр з обробкою помилок
4. Встановлює спеціальну обробку для 401, 403 та інших помилок
5. Експортує всі генеровані OpenAPI клієнти та типи

## ESLint правило

В `.eslintrc.js` додане спеціальне правило:

```javascript
'no-restricted-imports': ['error', {
  patterns: ['*/lib/api/generated/*']
}]
```

Це правило забороняє прямі імпорти з директорії `/generated`.
