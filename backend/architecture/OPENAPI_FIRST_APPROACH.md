# OpenAPI-First підхід до розробки

## Концепція

OpenAPI-First означає, що ми спочатку проектуємо API через OpenAPI специфікацію, а потім генеруємо код на її основі. Це забезпечує:

- Єдине джерело правди для API
- Автоматичну генерацію DTO та контролерів
- Синхронізацію frontend/backend через спільну специфікацію
- Автоматичну документацію

## Структура проекту з OpenAPI

```
JavaSpringDryCleaning/
├── api-specs/                     # OpenAPI специфікації
│   ├── common/                    # Спільні компоненти
│   │   ├── schemas/              
│   │   │   ├── error.yaml        # Стандартні помилки
│   │   │   ├── pagination.yaml  # Пагінація
│   │   │   └── money.yaml       # Money тип
│   │   └── parameters/
│   │       └── common.yaml      # Спільні параметри
│   │
│   ├── auth-api.yaml            # Auth API специфікація
│   ├── user-api.yaml            # User API специфікація
│   ├── customer-api.yaml        # Customer API специфікація
│   ├── order-api.yaml           # Order API специфікація
│   ├── pricing-api.yaml         # Pricing API специфікація
│   └── main-api.yaml            # Головний файл з $ref
│
├── dry-cleaning-api/            # Згенерований код
│   ├── pom.xml
│   └── target/generated-sources/
│       └── openapi/
│           ├── model/          # DTO класи
│           └── api/            # Інтерфейси контролерів
```

## Приклад OpenAPI специфікації

### customer-api.yaml
```yaml
openapi: 3.0.3
info:
  title: Customer API
  version: 1.0.0
  description: API для управління клієнтами хімчистки

paths:
  /api/v1/customers:
    post:
      operationId: createCustomer
      summary: Створити нового клієнта
      tags:
        - customers
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateCustomerRequest'
      responses:
        '201':
          description: Клієнт створений
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CustomerResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
    
    get:
      operationId: searchCustomers
      summary: Пошук клієнтів
      tags:
        - customers
      parameters:
        - name: query
          in: query
          description: Пошуковий запит
          schema:
            type: string
        - name: phone
          in: query
          description: Телефон для пошуку
          schema:
            type: string
        - $ref: '#/components/parameters/PageNumber'
        - $ref: '#/components/parameters/PageSize'
      responses:
        '200':
          description: Список клієнтів
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CustomerListResponse'

  /api/v1/customers/{customerId}:
    get:
      operationId: getCustomerById
      summary: Отримати клієнта за ID
      tags:
        - customers
      parameters:
        - name: customerId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Деталі клієнта
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CustomerDetailsResponse'
        '404':
          $ref: '#/components/responses/NotFound'

components:
  schemas:
    CreateCustomerRequest:
      type: object
      required:
        - firstName
        - lastName
        - phone
      properties:
        firstName:
          type: string
          minLength: 2
          maxLength: 50
          description: Ім'я клієнта
        lastName:
          type: string
          minLength: 2
          maxLength: 50
          description: Прізвище клієнта
        phone:
          type: string
          pattern: '^\+380\d{9}$'
          description: Телефон у форматі +380XXXXXXXXX
        email:
          type: string
          format: email
          description: Email адреса
        address:
          $ref: '#/components/schemas/Address'
        communicationPreferences:
          type: array
          items:
            $ref: '#/components/schemas/CommunicationChannel'
        source:
          $ref: '#/components/schemas/CustomerSource'
    
    CustomerResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        firstName:
          type: string
        lastName:
          type: string
        phone:
          type: string
        email:
          type: string
        createdAt:
          type: string
          format: date-time
    
    Address:
      type: object
      properties:
        street:
          type: string
        building:
          type: string
        apartment:
          type: string
        city:
          type: string
        postalCode:
          type: string
    
    CommunicationChannel:
      type: string
      enum:
        - PHONE
        - SMS
        - VIBER
        - EMAIL
    
    CustomerSource:
      type: string
      enum:
        - INSTAGRAM
        - GOOGLE
        - RECOMMENDATION
        - OTHER
```

## Maven конфігурація для генерації

### pom.xml
```xml
<plugin>
    <groupId>org.openapitools</groupId>
    <artifactId>openapi-generator-maven-plugin</artifactId>
    <version>7.14.0</version>
    <executions>
        <execution>
            <goals>
                <goal>generate</goal>
            </goals>
            <configuration>
                <inputSpec>${project.basedir}/api-specs/main-api.yaml</inputSpec>
                <generatorName>spring</generatorName>
                <apiPackage>org.example.dryclean.api</apiPackage>
                <modelPackage>org.example.dryclean.api.model</modelPackage>
                <supportingFilesToGenerate>
                    ApiUtil.java
                </supportingFilesToGenerate>
                <configOptions>
                    <delegatePattern>true</delegatePattern>
                    <dateLibrary>java8-localdatetime</dateLibrary>
                    <interfaceOnly>true</interfaceOnly>
                    <useBeanValidation>true</useBeanValidation>
                    <performBeanValidation>true</performBeanValidation>
                    <useOptional>false</useOptional>
                    <useSpringBoot3>true</useSpringBoot3>
                </configOptions>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## Імплементація згенерованих інтерфейсів

### CustomerController.java
```java
@RestController
@RequiredArgsConstructor
public class CustomerController implements CustomersApi {
    
    private final CustomerService customerService;
    private final CustomerMapper mapper;
    
    @Override
    public ResponseEntity<CustomerResponse> createCustomer(
            CreateCustomerRequest request) {
        
        Customer customer = mapper.toEntity(request);
        Customer saved = customerService.create(customer);
        CustomerResponse response = mapper.toResponse(saved);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }
    
    @Override
    public ResponseEntity<CustomerListResponse> searchCustomers(
            String query, 
            String phone, 
            Integer pageNumber, 
            Integer pageSize) {
        
        Page<Customer> customers = customerService.search(
            query, phone, pageNumber, pageSize);
        
        CustomerListResponse response = mapper.toListResponse(customers);
        return ResponseEntity.ok(response);
    }
}
```

## Cookie-based Authentication специфікація

### auth-api.yaml
```yaml
paths:
  /api/v1/auth/login:
    post:
      operationId: login
      summary: Вхід в систему
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Успішний вхід
          headers:
            Set-Cookie:
              description: Session cookie
              schema:
                type: string
                example: SESSION=abc123; Path=/; HttpOnly; Secure; SameSite=Strict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'
  
  /api/v1/auth/logout:
    post:
      operationId: logout
      summary: Вихід з системи
      security:
        - cookieAuth: []
      responses:
        '200':
          description: Успішний вихід
          headers:
            Set-Cookie:
              description: Clear session cookie
              schema:
                type: string
                example: SESSION=; Path=/; Max-Age=0
  
  /api/v1/auth/refresh:
    post:
      operationId: refreshToken
      summary: Оновити сесію
      security:
        - cookieAuth: []
      responses:
        '200':
          description: Сесія оновлена
          headers:
            Set-Cookie:
              description: New session cookie
              schema:
                type: string

components:
  securitySchemes:
    cookieAuth:
      type: apiKey
      in: cookie
      name: SESSION
```

## Переваги OpenAPI-First

### 1. Контракт як код
- API специфікація версіонується в Git
- Code review для змін API
- Історія змін контракту

### 2. Автоматична генерація
- DTO з валідацією
- Інтерфейси контролерів
- Клієнтські SDK
- Документація (Swagger UI)

### 3. Type Safety
- Строга типізація
- Compile-time перевірки
- Відсутність розбіжностей між документацією та кодом

### 4. Parallel Development
- Frontend може почати розробку одразу після створення специфікації
- Mock server на основі специфікації
- Contract testing

## Додаткові інструменти

### 1. Redocly CLI
```bash
# Валідація специфікації
redocly lint api-specs/main-api.yaml

# Об'єднання файлів
redocly bundle api-specs/main-api.yaml -o dist/api.yaml
```

### 2. Spectral
```yaml
# .spectral.yml
extends: ["spectral:oas"]
rules:
  operation-operationId: error
  operation-tags: error
  operation-description: warn
```

### 3. Mock Server (Prism)
```bash
# Запуск mock server
prism mock api-specs/main-api.yaml

# Frontend може працювати з mock API
curl http://localhost:4010/api/v1/customers
```

## Best Practices

### 1. Модульність
- Окремі файли для кожного домену
- Спільні компоненти в common/
- Використання $ref для reusability

### 2. Версіонування
- Semantic versioning для API
- Backward compatibility
- Deprecation strategy

### 3. Валідація
- Bean Validation annotations
- Custom validators
- Request/Response validation

### 4. Security
- Security schemes в специфікації
- CORS configuration
- Rate limiting headers

## Інтеграція з CI/CD

```yaml
# .github/workflows/api.yml
name: API Validation
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate OpenAPI
        run: |
          npx @redocly/cli lint api-specs/main-api.yaml
      - name: Generate code
        run: |
          mvn clean generate-sources
      - name: Check for uncommitted changes
        run: |
          git diff --exit-code
```

Такий підхід забезпечує надійну та масштабовану розробку API з мінімальними зусиллями на підтримку документації та клієнтського коду.