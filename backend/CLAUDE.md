Always answer in Ukrainian, comments in programed files write in English.

Don't create non-existent functionality, it should be implemented, not highlighted by the linter as not implemented in our IDE.

---
description:
globs:
alwaysApply: true
---
You are an expert in Java programming, Spring Boot, Spring Framework, Maven, JUnit, and related Java technologies.

Code Style and Structure
- Write clean, efficient, and well-documented Java code with accurate Spring Boot examples.
- Use Spring Boot best practices and conventions throughout your code.
- Implement RESTful API design patterns when creating web services.
- Use descriptive method and variable names following camelCase convention.
- Structure Spring Boot applications: controllers, services, repositories, models, configurations.

Spring Boot Specifics
- Use Spring Boot starters for quick project setup and dependency management.
- Implement proper use of annotations (e.g., @SpringBootApplication, @RestController, @Service).
- Utilize Spring Boot's auto-configuration features effectively.
- Implement proper exception handling using @ControllerAdvice and @ExceptionHandler.

Naming Conventions
- Use PascalCase for class names (e.g., UserController, OrderService).
- Use camelCase for method and variable names (e.g., findUserById, isOrderValid).
- Use ALL_CAPS for constants (e.g., MAX_RETRY_ATTEMPTS, DEFAULT_PAGE_SIZE).

Java and Spring Boot Usage
- Use Java 17 or later features when applicable (e.g., records, sealed classes, pattern matching).
- Leverage Spring Boot 3.x features and best practices.
- Use Spring Data JPA for database operations when applicable.
- Implement proper validation using Bean Validation (e.g., @Valid, custom validators).

Configuration and Properties
- Use application.properties or application.yml for configuration.
- Implement environment-specific configurations using Spring Profiles.
- Use @ConfigurationProperties for type-safe configuration properties.

Dependency Injection and IoC
- Use constructor injection over field injection for better testability.
- Leverage Spring's IoC container for managing bean lifecycles.

Testing
- Write unit tests using JUnit 5 and Spring Boot Test.
- Use MockMvc for testing web layers.
- Implement integration tests using @SpringBootTest.
- Use @DataJpaTest for repository layer tests.

Performance and Scalability
- Implement caching strategies using Spring Cache abstraction.
- Use async processing with @Async for non-blocking operations.
- Implement proper database indexing and query optimization.

Security
- Implement Spring Security for authentication and authorization.
- Use proper password encoding (e.g., BCrypt).
- Implement CORS configuration when necessary.

Logging and Monitoring
- Use SLF4J with Logback for logging.
- Implement proper log levels (ERROR, WARN, INFO, DEBUG).
- Use Spring Boot Actuator for application monitoring and metrics.

API Documentation
- Use Springdoc OpenAPI (formerly Swagger) for API documentation.

Data Access and ORM
- Use Spring Data JPA for database operations.
- Implement proper entity relationships and cascading.
- Use database migrations with tools like Flyway or Liquibase.

Build and Deployment
- Use Maven for dependency management and build processes.
- Implement proper profiles for different environments (dev, test, prod).
- Use Docker for containerization if applicable.

Follow best practices for:
- RESTful API design (proper use of HTTP methods, status codes, etc.).
- Microservices architecture (if applicable).
- Asynchronous processing using Spring's @Async or reactive programming with Spring WebFlux.

Adhere to DDD SOLID principles and maintain high cohesion and low coupling in your Spring Boot application design.

# AKSI Dry Cleaning Order System - Project Overview

## Architecture & Technologies

**Main Architecture:** DDD (Domain-Driven Design) with clear domain separation

**Technology Stack:**
- **Backend:** Java 21, Spring Boot 3.5.3, Spring Security, Spring Data JPA
- **Database:** PostgreSQL with Liquibase migrations
- **API Documentation:** OpenAPI 3.0 with auto-generated controllers
- **Validation:** Jakarta Bean Validation
- **Mapping:** MapStruct
- **Authentication:** JWT (jjwt 0.12.6)
- **PDF Generation:** iText 5.5.13
- **QR Codes:** ZXing 3.5.3
- **Dynamic Formulas:** Apache Commons JEXL 3.5.0
- **Testing:** Spring Boot Test, TestContainers

## Domain Structure

### 1. Auth Domain (`com.aksi.domain.auth`)
- JWT authentication with refresh tokens
- User management and roles (UserEntity, RefreshTokenEntity)
- Authentication validation and error handling
- Services: AuthService, JwtTokenService

### 2. Client Domain (`com.aksi.domain.client`)
- Client management and contacts (ClientEntity, Address)
- Order statistics and VIP status calculation
- Communication methods (phone, email)
- Service: ClientService

### 3. Order Domain (`com.aksi.domain.order`)
- Order lifecycle with status control (OrderEntity, OrderStatus)
- Price calculations with modifiers (OrderCalculationEntity)
- Discounts and urgency charges (DiscountEntity, UrgencyType)
- Digital client signatures
- Entities: OrderEntity, OrderItemEntity, OrderItemModifierEntity

### 4. Item Domain (`com.aksi.domain.item`)
- Price list with service categories (PriceListItemEntity, ServiceCategoryEntity)
- Dynamic pricing with JEXL formulas (JexlCalculator)
- Price modifiers for different materials (PriceModifierEntity)
- Item photos support (ItemPhotoEntity)
- Services: ItemCalculationService, PriceListItemService

### 5. Branch Domain (`com.aksi.domain.branch`)
- Branch management (BranchEntity, ContactInfo, Coordinates)
- Working schedules and holidays (WorkingScheduleEntity, HolidayEntity)
- Receipt number generation (ReceiptNumberService)
- Branch statistics
- Services: BranchService, WorkingScheduleService

### 6. Document Domain (`com.aksi.domain.document`)
- PDF receipt generation (ReceiptPdfRenderer)
- QR code generation for tracking
- Digital signatures (DigitalSignatureEntity)
- Document management (DocumentEntity)
- Services: PdfService, QrCodeService

## Key Features

**OpenAPI First:** All API controllers are generated from OpenAPI specifications
**Multi-profile Build:** dev-fast, dev-no-api, full-build profiles for different development needs
**Code Quality:** Checkstyle, PMD, Spotless formatting
**Security:** JWT tokens, Spring Security, data validation
**Database Migrations:** Liquibase with detailed changelog files
**Flexible Pricing:** JEXL formulas and modifiers system
**Document Generation:** PDF receipts with QR codes
**Photo Support:** Item photos with validation

## Database Configuration
- **URL:** jdbc:postgresql://localhost:5432/aksi_cleaners_db_v5
- **User:** aksi_user
- **Password:** 1911
- **Port:** 8080 (API context: /api)

## Business Logic Highlights
- Order status transitions with validation
- VIP client calculation (10+ orders or 5000+ UAH spent)
- Urgency pricing (NORMAL, URGENT_48H +50%, URGENT_24H +100%)
- Color-specific pricing for items (base, black, color prices)
- JEXL formula-based price calculations
- Client signature validation for order completion

## API Structure
- Auth API: authentication, user info
- Client API: client management, search, contacts
- Order API: order management, calculations, completion
- Item API: price list, modifiers, categories, photos
- Branch API: branch management, schedules, statistics
- Document API: PDF generation, QR codes, signatures

System is production-ready for dry cleaning business operations.


