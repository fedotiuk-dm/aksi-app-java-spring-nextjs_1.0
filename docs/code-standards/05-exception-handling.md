# Обробка винятків

Цей документ описує стандарти обробки винятків у проекті "Хімчистка AKSI".

## Загальні принципи

1. **Централізована обробка винятків** через глобальний обробник помилок
2. **Уніфікований формат** повідомлень про помилки для всіх API
3. **Інформативні повідомлення** з детальною інформацією про причину помилки
4. **Логування помилок** з унікальними ідентифікаторами для відстеження
5. **Локалізовані повідомлення** для кінцевих користувачів

## Глобальний обробник винятків

В Spring Boot використовується клас `GlobalExceptionHandler` для централізованої обробки всіх винятків:

```java
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class GlobalExceptionHandler {

    // Методи обробки різних типів винятків
}
```

## Структура доменних винятків

### 1. Базовий клас винятків

```java
public abstract class BaseException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;
    
    protected BaseException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
    
    public HttpStatus getStatus() {
        return status;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}
```

### 2. Специфічні для домену винятки

Для кожного домену потрібно створювати власні класи винятків:

```java
public class ClientNotFoundException extends BaseException {
    public ClientNotFoundException(UUID id) {
        super(
            String.format("Клієнт з ID %s не знайдений", id),
            HttpStatus.NOT_FOUND,
            "CLIENT_NOT_FOUND"
        );
    }
}
```

## Стандартний формат відповідей про помилки

```json
{
    "errorId": "550e8400-e29b-41d4-a716-446655440000",
    "status": 404,
    "message": "Клієнт з ID 123e4567-e89b-12d3-a456-426614174000 не знайдений",
    "errorCode": "CLIENT_NOT_FOUND",
    "errors": null,
    "timestamp": "2023-05-15T14:30:00Z",
    "path": "/api/clients/123e4567-e89b-12d3-a456-426614174000"
}
```

При помилках валідації:

```json
{
    "errorId": "550e8400-e29b-41d4-a716-446655440000",
    "status": 400,
    "message": "Помилка валідації",
    "errorCode": "VALIDATION_ERROR",
    "errors": [
        {
            "field": "firstName",
            "message": "Ім'я не може бути порожнім"
        },
        {
            "field": "email",
            "message": "Некоректний формат email"
        }
    ],
    "timestamp": "2023-05-15T14:30:00Z",
    "path": "/api/clients"
}
```

## Типи винятків та їх обробка

### 1. Стандартні винятки Spring

| Виняток | HTTP Status | Опис |
|---------|-------------|------|
| `MethodArgumentNotValidException` | 400 | Помилка валідації даних запиту |
| `HttpMessageNotReadableException` | 400 | Некоректний формат JSON |
| `MethodArgumentTypeMismatchException` | 400 | Неправильний тип аргументу |
| `NoHandlerFoundException` | 404 | Ендпоінт не знайдено |
| `HttpRequestMethodNotSupportedException` | 405 | Метод HTTP не підтримується |
| `AuthenticationException` | 401 | Помилка автентифікації |
| `AccessDeniedException` | 403 | Недостатньо прав |

### 2. Бізнес-винятки проекту

| Виняток | HTTP Status | Опис |
|---------|-------------|------|
| `EntityNotFoundException` | 404 | Сутність не знайдена |
| `DuplicateEntityException` | 409 | Спроба створити дублікат сутності |
| `InvalidOperationException` | 400 | Недопустима операція |
| `BusinessValidationException` | 422 | Порушення бізнес-правил |
| `OptimisticLockException` | 409 | Конфлікт версій сутності |

## Логування винятків

Кожен виняток повинен бути належним чином залогований:

```java
@ExceptionHandler(ClientNotFoundException.class)
public ResponseEntity<ErrorResponse> handleClientNotFoundException(
    ClientNotFoundException ex, 
    HttpServletRequest request
) {
    String errorId = UUID.randomUUID().toString();
    
    // Логування з контекстом
    log.error("Error ID: {}, Client not found: {}", errorId, ex.getMessage(), ex);
    
    ErrorResponse errorResponse = buildErrorResponse(
        HttpStatus.NOT_FOUND, 
        ex.getMessage(),
        ex,
        errorId,
        request.getRequestURI(),
        "CLIENT_NOT_FOUND",
        null
    );
    
    return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(errorResponse);
}
```

## Ієрархія винятків

```
BaseException
│
├── EntityNotFoundException
│   ├── ClientNotFoundException
│   ├── OrderNotFoundException
│   ├── PriceListItemNotFoundException
│   └── ...
│
├── ValidationException
│   ├── BusinessValidationException
│   └── ...
│
├── SecurityException
│   ├── UnauthorizedException
│   └── ForbiddenOperationException
│
└── SystemException
    ├── IntegrationException
    └── ConfigurationException
```

## Обробка винятків на фронтенді

### 1. Типи помилок на фронтенді

```typescript
// types/errors.ts
export interface ApiError {
  errorId: string;
  status: number;
  message: string;
  errorCode?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
  path: string;
}

export class ApiErrorWrapper extends Error {
  public readonly errorId: string;
  public readonly status: number;
  public readonly errorCode?: string;
  public readonly errors?: Array<{field: string; message: string}>;
  
  constructor(apiError: ApiError) {
    super(apiError.message);
    this.errorId = apiError.errorId;
    this.status = apiError.status;
    this.errorCode = apiError.errorCode;
    this.errors = apiError.errors;
  }
  
  public hasValidationErrors(): boolean {
    return !!this.errors && this.errors.length > 0;
  }
  
  public getFieldError(field: string): string | undefined {
    return this.errors?.find(error => error.field === field)?.message;
  }
}
```

### 2. Хук для обробки помилок API

```typescript
// hooks/useApiError.ts
import { useToast } from '@/components/ui/toast';
import { ApiErrorWrapper } from '@/types/errors';

export const useApiError = () => {
  const toast = useToast();
  
  const handleApiError = (error: unknown) => {
    // Визначення типу помилки
    if (error instanceof ApiErrorWrapper) {
      // Відображення повідомлення про помилку
      toast.error(error.message, {
        id: error.errorId,
        description: error.status === 400 ? 'Перевірте правильність введених даних' : undefined
      });
      
      // Повернення об'єкта помилки для використання в формах
      return error;
    }
    
    // Невідома помилка
    console.error('Unexpected error:', error);
    toast.error('Виникла непередбачена помилка. Спробуйте пізніше.');
    return null;
  };
  
  return { handleApiError };
};
```

## Рекомендовані практики

### 1. Коли створювати власні винятки

- Для кожного типу помилки, що потребує спеціальної обробки
- Коли потрібен специфічний код помилки для клієнта
- Коли стандартні винятки не відображають суть проблеми

### 2. Коли використовувати перевірені винятки

- **Ніколи** не використовуйте перевірені винятки (checked exceptions) в бізнес-логіці
- Використовуйте непервірені винятки (unchecked exceptions), що наслідуються від `RuntimeException`

### 3. Захист від витоку інформації

- Не розкривайте внутрішню інформацію про систему у повідомленнях помилок
- Не включайте дані SQL-запитів або стеки викликів у відповідях API
- Для внутрішніх помилок системи використовуйте загальні повідомлення та логуйте деталі

### 4. Консистентність повідомлень

- Використовуйте єдиний стиль для всіх повідомлень про помилки
- Дотримуйтеся шаблону: "Що сталося" + "Чому це сталося" + "Як це виправити"
- Уникайте технічних деталей у повідомленнях для користувачів
