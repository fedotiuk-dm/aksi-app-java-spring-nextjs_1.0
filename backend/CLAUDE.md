# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Always answer in Ukrainian, comments in programed files write in English.

Don't create non-existent functionality, it should be implemented, not highlighted by the linter as not implemented in our IDE.

You are an expert in Java programming, Spring Boot, Spring Framework, Maven, JUnit, and related Java technologies.

## Architecture Documentation

The project has comprehensive architecture documentation in the `/architecture/` folder:
- **DOMAIN_ARCHITECTURE.md** - 13 domains with Auth/User separation
- **PROJECT_STRUCTURE.md** - Module organization
- **API_CONTRACTS.md** - REST API specifications
- **OPENAPI_FIRST_APPROACH.md** - OpenAPI code generation
- **COOKIE_BASED_AUTH.md** - Session-based authentication
- **NEXT_STEPS.md** - Implementation roadmap

## Key Architectural Decisions

1. **OpenAPI-First**: Generate DTOs and controllers from OpenAPI specs
2. **Cookie-Based Auth**: Use httpOnly cookies instead of JWT headers
3. **Domain-Driven Design**: 13 separate domains with clear boundaries
4. **Modular Structure**: Start with monolith, evolve to modules

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

## Naming Conflicts Resolution

When DTOs generated from OpenAPI schemas have the same name as JPA entities:

### Option 1: Use modelNameMappings in OpenAPI Generator (Preferred)
- Configure `modelNameMappings` in pom.xml to map OpenAPI models to different class names
- Example:
  ```xml
  <modelNameMappings>
      <modelNameMapping>PriceModifier=PriceModifierDto</modelNameMapping>
      <modelNameMapping>Discount=DiscountDto</modelNameMapping>
  </modelNameMappings>
  ```
- This keeps entity names unchanged and adds Dto suffix to generated classes
- Update mappers to use the new DTO class names

### Option 2: Rename entities (Alternative)
- Add "Entity" suffix to the JPA entity class (e.g., PriceModifier → PriceModifierEntity)
- Keep DTO names clean and matching the OpenAPI schema
- This approach maintains API contract stability while avoiding naming conflicts