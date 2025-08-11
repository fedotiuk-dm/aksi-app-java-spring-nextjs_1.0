# JavaSpringDryCleaning Project Structure

## Overall Structure

```
JavaSpringDryCleaning/
├── architecture/               # Architecture documentation
│   ├── DOMAIN_ARCHITECTURE.md
│   ├── PROJECT_STRUCTURE.md
│   └── API_CONTRACTS.md
│
├── dry-cleaning-parent/       # Parent POM for all modules
│   └── pom.xml
│
├── dry-cleaning-common/       # Common components
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/common/
│       ├── domain/           # Common domain models
│       │   ├── Money.java
│       │   ├── Address.java
│       │   ├── PhoneNumber.java
│       │   └── Email.java
│       ├── exception/        # Common exceptions
│       ├── util/            # Utilities
│       └── validation/      # Validators
│
├── dry-cleaning-auth/        # Auth domain
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/auth/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── config/
│
├── dry-cleaning-customer/    # Customer domain
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/customer/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── mapper/
│
├── dry-cleaning-branch/      # Branch domain
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/branch/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       └── dto/
│
├── dry-cleaning-serviceCatalog/     # Service domain (includes service and item catalog)
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/serviceCatalog/
│       ├── controller/
│       ├── serviceCatalog/
│       │   ├── ServiceCatalogService.java
│       │   ├── ItemService.java
│       │   └── ServiceItemService.java
│       ├── repository/
│       ├── domain/
│       │   ├── Service.java
│       │   ├── Item.java
│       │   ├── ServiceItem.java
│       │   ├── ServiceCategoryType.java
│       │   └── UnitOfMeasure.java
│       ├── dto/
│       └── loader/            # CSV loading
│
├── dry-cleaning-pricing/     # Pricing domain
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/pricing/
│       ├── controller/
│       ├── serviceCatalog/
│       │   ├── PriceCalculator.java
│       │   └── ModifierService.java
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── rules/          # Business rules
│
├── dry-cleaning-order/       # Order domain (includes cart and item characteristics)
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/order/
│       ├── controller/
│       │   ├── CartController.java
│       │   └── OrderController.java
│       ├── serviceCatalog/
│       │   ├── CartService.java
│       │   ├── CartCalculationService.java
│       │   ├── OrderService.java
│       │   └── OrderItemService.java
│       ├── repository/
│       │   ├── CartRepository.java
│       │   └── OrderRepository.java
│       ├── domain/
│       │   ├── cart/
│       │   │   ├── OrderCart.java
│       │   │   ├── CartItem.java
│       │   │   ├── CartItemPricing.java
│       │   │   └── CartPricing.java
│       │   ├── order/
│       │   │   ├── Order.java
│       │   │   ├── OrderItem.java
│       │   │   ├── OrderItemCharacteristics.java
│       │   │   ├── OrderItemPhoto.java
│       │   │   ├── OrderItemDefect.java
│       │   │   └── OrderItemStain.java
│       ├── dto/
│       │   ├── cart/
│       │   └── order/
│       ├── saga/           # Order saga
│       ├── event/          # Domain events
│       └── storage/        # Photo handling
│
├── dry-cleaning-payment/     # Payment domain
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/payment/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── gateway/        # Payment gateways
│
├── dry-cleaning-receipt/     # Receipt domain
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/receipt/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       ├── template/       # Receipt templates
│       └── generator/      # PDF/Print generators
│
├── dry-cleaning-notification/  # Notification domain
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/notification/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── channel/        # SMS, Viber, Email
│
├── dry-cleaning-config/      # Configuration domain
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/config/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       └── dto/
│
├── dry-cleaning-reporting/   # Reporting domain
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/reporting/
│       ├── controller/
│       ├── serviceCatalog/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       └── export/         # Excel, PDF export
│
├── dry-cleaning-api-gateway/ # API Gateway
│   ├── pom.xml
│   └── src/main/java/org/example/dryclean/gateway/
│       ├── controller/     # Aggregate controllers
│       ├── serviceCatalog/       # Orchestration
│       ├── security/      # Security config
│       └── config/
│
├── dry-cleaning-web/         # Frontend (if needed)
│   ├── package.json
│   ├── src/
│   └── public/
│
├── docker/                   # Docker configuration
│   ├── docker-compose.yml
│   └── Dockerfile
│
├── scripts/                  # Helper scripts
│   ├── build.sh
│   └── deploy.sh
│
├── docs/                     # Documentation
│   ├── api/
│   ├── user-guide/
│   └── deployment/
│
└── CLAUDE.md                # Development instructions
```

## Module Structure

### Typical Domain Structure:

```
dry-cleaning-{domain}/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/org/example/dryclean/{domain}/
    │   │   ├── controller/          # REST controllers
    │   │   │   └── {Domain}Controller.java
    │   │   ├── serviceCatalog/            # Business logic
    │   │   │   ├── {Domain}Service.java
    │   │   │   └── impl/
    │   │   │       └── {Domain}ServiceImpl.java
    │   │   ├── repository/         # Data access
    │   │   │   └── {Domain}Repository.java
    │   │   ├── domain/            # Domain entities
    │   │   │   └── {Entity}.java
    │   │   ├── dto/               # Data Transfer Objects
    │   │   │   ├── request/
    │   │   │   └── response/
    │   │   ├── mapper/            # Entity <-> DTO mappers
    │   │   │   └── {Domain}Mapper.java
    │   │   ├── exception/         # Domain exceptions
    │   │   ├── event/            # Domain events
    │   │   └── config/           # Domain configuration
    │   └── resources/
    │       ├── application.yml
    │       └── db/migration/     # Flyway migrations
    └── test/
        └── java/org/example/dryclean/{domain}/
            ├── unit/            # Unit tests
            ├── integration/     # Integration tests
            └── fixtures/        # Test data
```

## Code Organization Recommendations

### 1. Domain Layer (domain/)
- Pure Java classes without framework-specific annotations
- Business logic and rules
- Value objects and entities

### 2. Service Layer (serviceCatalog/)
- Spring Service annotations
- Transactional logic
- Orchestration between repositories

### 3. Controller Layer (controller/)
- REST endpoints
- Input data validation
- DTO <-> Domain mapping

### 4. Repository Layer (repository/)
- Spring Data JPA interfaces
- Custom query methods
- Specifications for complex queries

### 5. DTO Layer (dto/)
- Request/Response objects
- Validation annotations
- API documentation annotations

## Migration from Current Structure

### Step 1: Create parent POM
```bash
mkdir dry-cleaning-parent
# Create parent pom.xml with common dependencies
```

### Step 2: Create common module
```bash
mkdir dry-cleaning-common
# Move shared classes
```

### Step 3: Create domain modules
```bash
# For each domain
mkdir dry-cleaning-{domain}
# Create folder structure
# Create pom.xml
```

### Step 4: Refactor existing code
- Split Main.java into corresponding domains
- Create necessary classes in each domain

## Advantages of This Structure

1. **Modularity** - each domain is independent
2. **Scalability** - easy to add new domains
3. **Testing** - isolated domain testing
4. **Deployment** - ability to deploy modules separately
5. **Team Collaboration** - different teams can work on different domains

## Alternative Approach (Monolithic Structure)

If you want to start with a simpler structure:

```
src/main/java/org/example/dryclean/
├── auth/
├── customer/
├── branch/
├── serviceCatalog/         # Service and item catalog
├── pricing/
├── order/          # Orders with characteristics
├── payment/
├── receipt/
├── notification/
├── config/
├── reporting/
└── common/
```

This will allow you to start faster, and then migrate to modular architecture if needed.