# **СПРОЩЕНИЙ ВОРКФЛОУ API-First (Крок за кроком)**

## **СТРУКТУРА DOMAIN:**
```
domain/client/
├── enums/           # OpenAPI → Domain enums
├── entity/          # JPA entities (незалежні від API)
├── repository/      # Spring Data JPA
├── exception/       # Domain exceptions
├── validation/      # Business validation
├── service/         # Business logic + транзакції
├── mapper/          # Entity ↔ DTO (MapStruct)
└── delegate/        # API implementation
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

### **Крок 2.1: Service (`/service/`)**
- [ ] Створити Service клас з @Service та @Transactional
- [ ] Injecting Repository та Validator через @RequiredArgsConstructor
- [ ] Реалізувати CRUD операції:
  - [ ] findById (readOnly = true)
  - [ ] findAll (readOnly = true)
  - [ ] create
  - [ ] update
  - [ ] delete
- [ ] Додати business logic та validation calls
- [ ] Обробити exceptions

---

## **ЕТАП 3: КООРДИНАЦІЯ**

### **Крок 3.1: Mapper (`/mapper/`)**
- [ ] Створити MapStruct interface з @Mapper(componentModel = "spring")
- [ ] Реалізувати mapping методи:
  - [ ] DTO → Entity (для create/update)
  - [ ] Entity → DTO (для response)
  - [ ] List mappings
- [ ] Додати @Mapping для ignore полів (id, timestamps)
- [ ] Обробити enum mappings якщо потрібно

### **Крок 3.2: Delegate (`/delegate/`)**
- [ ] Створити Delegate клас з @Component
- [ ] Implements згенерований ApiDelegate interface
- [ ] Injecting Service та Mapper через @RequiredArgsConstructor
- [ ] Реалізувати всі API методи:
  - [ ] Отримати DTO з request
  - [ ] Mapper: DTO → Entity
  - [ ] Викликати Service method
  - [ ] Mapper: Entity → Response DTO
  - [ ] Повернути ResponseEntity з правильним HTTP status

---

## **ПОРЯДОК ВИКОНАННЯ:**

1. **Спочатку Етап 1** (вся база)
2. **Потім Етап 2** (бізнес-логіка)
3. **Нарешті Етап 3** (API координація)

## **КЛЮЧОВІ ПРАВИЛА:**

✅ **OpenAPI як Single Source of Truth**
✅ **Entity незалежні від API**
✅ **Тільки одна відповідальність на клас**
✅ **Ніякого дублювання коду**
✅ **Mapper тільки для конвертації**
✅ **Delegate тільки для координації**
✅ **Service для всієї бізнес-логіки**

## **ЧЕКЛІСТ ЗАВЕРШЕННЯ:**

- [ ] Всі enum створені з OpenAPI
- [ ] Entity з JPA анотаціями
- [ ] Repository з custom методами
- [ ] Exception класи створені
- [ ] Validation логіка реалізована
- [ ] Service з транзакціями
- [ ] Mapper з MapStruct
- [ ] Delegate реалізує API
