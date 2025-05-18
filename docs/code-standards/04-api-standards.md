# Стандарти API

Цей документ описує стандарти API для проекту "Хімчистка AKSI" - як для бекенду (Spring Boot), так і для фронтенду (Next.js).

## Загальні принципи REST API

### 1. URL структура

- **Базовий URL**: `/api` (визначений у Spring Boot як контекстний шлях)
- **Ресурси**: у множині іменників, в нижньому регістрі, через дефіс (kebab-case)
- **Ідентифікатори**: як частина шляху URL

Приклади:
```
/api/clients                   # Колекція клієнтів
/api/clients/{id}              # Конкретний клієнт
/api/clients/{id}/orders       # Замовлення певного клієнта
/api/price-list                # Прайс-лист
```

### 2. HTTP методи

- **GET**: Отримання даних (без змін стану)
- **POST**: Створення ресурсу або запуск операції
- **PUT**: Повне оновлення ресурсу
- **PATCH**: Часткове оновлення ресурсу
- **DELETE**: Видалення ресурсу

### 3. Коди відповідей

- **200 OK**: Успішний запит, що повертає дані
- **201 Created**: Успішне створення ресурсу
- **204 No Content**: Успішний запит без повернення даних (PUT, DELETE)
- **400 Bad Request**: Невалідні дані запиту
- **401 Unauthorized**: Відсутні або некоректні авторизаційні дані
- **403 Forbidden**: Недостатньо прав для виконання операції
- **404 Not Found**: Ресурс не знайдено
- **409 Conflict**: Конфлікт з поточним станом ресурсу
- **422 Unprocessable Entity**: Помилки валідації
- **500 Internal Server Error**: Внутрішня помилка сервера

## Особливості API контролерів Spring Boot

### 1. Особливості використання контекстного шляху

**ВАЖЛИВО**: Spring Boot налаштований з `server.servlet.context-path: /api`

- У контролерах **НЕ** додавайте `/api` до шляхів
- **Правильно**: `@RequestMapping("/clients")` → доступно як `/api/clients`
- **НЕПРАВИЛЬНО**: `@RequestMapping("/api/clients")` → буде доступно як `/api/api/clients`

### 2. Структура контролерів

```java
@RestController
@RequestMapping("/resource-name")  // kebab-case, без префіксу /api
@RequiredArgsConstructor
@Tag(name = "Назва ресурсу", description = "Опис API ресурсу")
public class ResourceNameController {

    private final ResourceNameService service;
    
    // Методи контролера
}
```

### 3. Стандарти документації API

Використовуйте анотації Swagger/OpenAPI для документації:

```java
@Operation(summary = "Короткий опис операції", description = "Детальний опис операції")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Успішно"),
    @ApiResponse(responseCode = "400", description = "Невалідний запит"),
    @ApiResponse(responseCode = "404", description = "Ресурс не знайдено")
})
@GetMapping("/{id}")
public ResponseEntity<ResourceResponse> getById(
    @Parameter(description = "ID ресурсу") 
    @PathVariable("id") final UUID id
) {
    // Реалізація
}
```

### 4. Стандартний формат відповіді API

#### Для успішних відповідей

```json
{
    "id": "uuid-value",
    "name": "Resource Name",
    "created": "2023-05-15T14:30:00Z",
    "properties": {
        // Свойства ресурсу
    }
}
```

#### Для колекцій з пагінацією

```json
{
    "content": [
        // Масив об'єктів
    ],
    "pageable": {
        "pageNumber": 0,
        "pageSize": 20,
        "sort": {
            "sorted": true,
            "direction": "ASC"
        }
    },
    "totalElements": 100,
    "totalPages": 5
}
```

#### Для помилок

```json
{
    "errorId": "uuid-error-reference",
    "status": 400,
    "message": "Коротке повідомлення про помилку",
    "errors": [
        {
            "field": "name",
            "message": "Ім'я не може бути порожнім"
        }
    ],
    "timestamp": "2023-05-15T14:30:00Z",
    "path": "/api/resource-name"
}
```

## Комунікація між Next.js і Spring Boot

### 1. URL-константи для комунікації

**ВАЖЛИВО**: Проект працює ВИКЛЮЧНО в Docker-середовищі!

У Next.js використовуйте константи для формування URL:

```typescript
// Для API запитів з Next.js до Spring Boot
const SERVER_API_URL = 'http://backend:8080';  // Docker-ім'я сервісу, НЕ localhost

// Приклад використання
const url = `${SERVER_API_URL}/api/clients`;  // ВАЖЛИВО: /api як частина URL!
```

### 2. Взаємодія фронтенду з бекендом

#### Пряме використання згенерованих клієнтів OpenAPI

```typescript
// Правильний імпорт (через індексний файл)
import { ClientsService, ClientDTO } from '@/lib/api';

// НЕПРАВИЛЬНИЙ імпорт (безпосередньо з згенерованих файлів)
import { ClientsService } from '@/lib/api/generated/services/ClientsService';
```

#### API хуки згідно з FSD (Feature-Sliced Design)

```
features/clients/api/useClients.ts
```

### 3. Проксі-конфігурація Next.js

**Важливо**: Використовуйте rewrites() для проксіювання API-запитів через Next.js:

```javascript
// next.config.mjs
export default {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8080/api/:path*',
      },
    ];
  },
};
```

## Формати даних та типи

### 1. Дати та час

- Використовуйте ISO 8601 для формату дат у API
- Приклад: `2023-05-15T14:30:00Z`
- На фронтенді використовуйте Day.js для обробки дат

### 2. UUID

- Використовуйте UUID для ідентифікаторів ресурсів
- Формат: рядок в нижньому регістрі, наприклад: `"550e8400-e29b-41d4-a716-446655440000"`

### 3. Грошові значення

- Використовуйте `BigDecimal` на бекенді
- Передавайте як рядок у форматі: `"123.45"`

## Валідація

### 1. Бекенд (Jakarta Validation)

```java
public class ClientRequest {
    @NotBlank(message = "Ім'я є обов'язковим")
    @Size(min = 2, max = 50, message = "Ім'я повинно містити від 2 до 50 символів")
    private String firstName;
    
    // Інші поля
}
```

### 2. Фронтенд (Zod)

```typescript
const clientSchema = z.object({
  firstName: z.string().min(2, "Ім'я повинно містити мінімум 2 символи").max(50),
  // Інші поля
});
```

## Автентифікація

### 1. JWT автентифікація

- Токени доступу надсилаються у заголовку: `Authorization: Bearer {token}`
- Токени оновлення передаються через HttpOnly cookies
- Термін дії токена доступу: 15-60 хвилин
- Термін дії токена оновлення: 7-30 днів

### 2. Маршрутизація та захист

- На фронтенді використовується Next.js middleware для автентифікації
- На бекенді використовується Spring Security та JwtAuthenticationFilter

## Додаткові вимоги

### 1. Бізнес-логіка виключно на бекенді

- Всі складні обрахунки, розрахунки цін та бізнес-логіка **ПОВИННІ** бути реалізовані на бекенді (Java Spring)
- Frontend (Next.js) використовує API-ендпоінти для доступу до цієї логіки, а не реалізує її самостійно

### 2. Заборона мокових даних

- Використовуйте реальні дані з бекенду
- Не створюйте статичні дані на фронтенді
- При розробці нового функціоналу спочатку реалізуйте відповідний API на бекенді

### 3. CORS налаштування

Бекенд має бути налаштований для дозволу CORS-запитів:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList("http://frontend:3000"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```
