# **СПРОЩЕНИЙ ВОРКФЛОУ API-First (Крок за кроком)**

## **СТРУКТУРА DOMAIN:**

```
domain/client/
├── enums/           # OpenAPI → Domain enums
├── entity/          # JPA entities (незалежні від API)
├── repository/      # Spring Data JPA
├── exception/       # Domain exceptions
├── validation/      # Business validation
├── service/         # Business logic + транзакції + DTO конвертація
└── mapper/          # Entity ↔ DTO (MapStruct)

api/client/          # Контролери (окремо від domain)
└── *ApiController.java  # HTTP запити/відповіді
```

---

## **ЕТАП 1: БАЗА (Foundation)**

### **Крок 1.1: Enums (`/enums/`)**

- [ ] Скопіювати всі enum з OpenAPI до domain
- [ ] Додати domain-specific методи якщо потрібно
- [ ] Використовувати ці enum в Entity та Service

### **Крок 1.2: Entity (`/entity/`)**

- [ ] Створити JPA entities на основі OpenAPI схем
- [ ] Додати JPA анотації (@Entity, @Table, @Id, тощо)
- [ ] Використати Lombok (@Data, @Builder, @NoArgsConstructor, @AllArgsConstructor)
- [ ] Додати audit поля (createdAt, updatedAt) з @CreationTimestamp, @UpdateTimestamp
- [ ] НЕ використовувати API DTO в Entity

### **Крок 1.3: Repository (`/repository/`)**

- [ ] Створити інтерфейси що extends JpaRepository<Entity, ID>
- [ ] Додати custom query методи (findByEmail, existsByEmail, тощо)
- [ ] Використати @Query для складних запитів

### **Крок 1.4: Exception (`/exception/`)**

- [ ] Створити domain-specific exceptions
- [ ] Зробити їх RuntimeException
- [ ] Додати конструктори з параметрами для зручності

### **Крок 1.5: Validation (`/validation/`)**

- [ ] Створити validator компоненти з @Component
- [ ] Реалізувати business rules validation
- [ ] Методи для validateForCreate, validateForUpdate

---

## **ЕТАП 2: БІЗНЕС-ЛОГІКА**

### **Крок 2.1: Mapper (`/mapper/`)**

- [ ] Створити MapStruct interface з @Mapper(componentModel = "spring")
- [ ] Реалізувати mapping методи:
  - [ ] DTO → Entity (для create/update)
  - [ ] Entity → DTO (для response)
  - [ ] List mappings
- [ ] Додати @Mapping для ignore полів (id, timestamps)
- [ ] Обробити enum mappings якщо потрібно

### **Крок 2.2: Service (`/service/`)**

- [ ] Створити Service клас з @Service та @Transactional
- [ ] Injecting Repository, Validator та Mapper через @RequiredArgsConstructor
- [ ] **API методи (для контролерів) - працюють з DTO:**
  - [ ] createClient(CreateClientRequest) → ClientResponse
  - [ ] getClientById(UUID) → ClientResponse
  - [ ] updateClient(UUID, UpdateClientRequest) → ClientResponse
  - [ ] deleteClient(UUID) → void
  - [ ] getClients(page, size, sort) → ClientPageResponse
  - [ ] searchClients(query, limit) → ClientSearchResponse
- [ ] **Entity методи (для внутрішньої логіки):**
  - [ ] create(Entity) → Entity
  - [ ] findById(ID) → Entity
  - [ ] update(Entity) → Entity
  - [ ] delete(ID) → void
- [ ] Додати business logic та validation calls
- [ ] Обробити exceptions

---

## **ЕТАП 3: HTTP ШЛАК**

### **Крок 3.1: Controllers (`src/main/java/com/aksi/api/`)**

- [ ] Створити Controller класи з @Controller
- [ ] Implements згенеровані Api interfaces (ClientsApi, ClientSearchApi, etc.)
- [ ] Injecting тільки Service через @RequiredArgsConstructor
- [ ] **ТІЛЬКИ HTTP логіка:**
  - [ ] Отримати DTO з request
  - [ ] Викликати Service API method з DTO
  - [ ] Повернути ResponseEntity з правильним HTTP status
- [ ] **НЕ ІМПОРТУВАТИ Entity або Mapper!**
- [ ] Додати логування (log.debug)

---

## **ПОРЯДОК ВИКОНАННЯ:**

1. **Спочатку Етап 1** (вся база)
2. **Потім Етап 2** (бізнес-логіка + маппінг)
3. **Нарешті Етап 3** (HTTP контролери)

## **КЛЮЧОВІ ПРАВИЛА:**

✅ **OpenAPI як Single Source of Truth**
✅ **Entity незалежні від API**
✅ **Controller → Service → Repository архітектура**
✅ **Контролери тільки HTTP логіка (без Entity/Mapper)**
✅ **Service робить DTO ↔ Entity конвертацію**
✅ **Mapper тільки для конвертації типів**
✅ **Ніякого дублювання коду**
✅ **Тільки одна відповідальність на клас**

## **РОЗДІЛЕННЯ ВІДПОВІДАЛЬНОСТЕЙ:**

### **Controller** - тільки HTTP логіка

### **Service** - бізнес-логіка + DTO конвертація

### **Mapper** - тільки конвертація типів

## **ЧЕКЛІСТ ЗАВЕРШЕННЯ:**

- [ ] Всі enum створені з OpenAPI
- [ ] Entity з JPA анотаціями
- [ ] Repository з custom методами
- [ ] Exception класи створені
- [ ] Validation логіка реалізована
- [ ] Mapper з MapStruct створений
- [ ] Service з транзакціями + API методи + Entity методи
- [ ] Controllers реалізують API (тільки HTTP логіка)
- [ ] **НЕ ВИКОРИСТОВУЄМО delegate шар!**

## **ПРИКЛАД ГОТОВОЇ СТРУКТУРИ:**

```
domain/client/
├── enums/
│   ├── ClientSourceType.java
│   └── CommunicationMethodType.java
├── entity/
│   ├── ClientEntity.java
│   └── Address.java
├── repository/
│   └── ClientRepository.java
├── exception/
│   ├── ClientNotFoundException.java
│   ├── ClientAlreadyExistsException.java
│   └── ClientValidationException.java
├── validation/
│   └── ClientValidator.java
├── service/
│   └── ClientService.java            # API + Entity методи
└── mapper/
    └── ClientMapper.java

api/client/
├── ClientsApiController.java         # CRUD операції
├── ClientSearchApiController.java    # Пошук
└── ClientContactsApiController.java  # Контакти
```
