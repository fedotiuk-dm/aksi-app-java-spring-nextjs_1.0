# Dry Cleaning Management System Architecture

## 📋 Documentation Overview

This folder contains complete architectural documentation for the dry cleaning management system. The documentation is organized as follows:

### Core Documents:
1. **[DOMAIN_ARCHITECTURE.md](DOMAIN_ARCHITECTURE.md)** - Description of 12 system domains with Auth and User separation
2. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Project structure and module organization
3. **[DOMAIN_INTERACTIONS.md](DOMAIN_INTERACTIONS.md)** - Interactions between domains
4. **[API_CONTRACTS.md](API_CONTRACTS.md)** - REST API contracts for all domains
5. **[OPENAPI_FIRST_APPROACH.md](OPENAPI_FIRST_APPROACH.md)** - OpenAPI-first approach for code generation
6. **[COOKIE_BASED_AUTH.md](COOKIE_BASED_AUTH.md)** - Cookie-based authentication
7. **[NEXT_STEPS.md](NEXT_STEPS.md)** - Project implementation plan

## 🎯 Key Architectural Decisions

### 1. Domain-Driven Design
- 12 independent domains with clear boundaries
- Each domain is responsible for its business logic area
- Minimal dependencies between domains

### 2. OpenAPI-First
- API designed through OpenAPI specification
- Automatic generation of DTOs and controllers
- Single source of truth for API contracts

### 3. Cookie-Based Authentication
- HttpOnly cookies for security
- Session management through Redis
- CSRF protection

### 4. Modular Architecture
- Ability to start with a monolith
- Evolution to modular monolith
- Option to migrate to microservices

## 🏗 Domain Structure

### Core Domains:
1. **Auth** - authentication and sessions
2. **User** - system user management
3. **Customer** - dry cleaning customers
4. **Order** - orders and their lifecycle
5. **Pricing** - cost calculation

### Supporting Domains:
6. **Branch** - branches and pickup points
7. **Service** - service and item catalog
8. **Payment** - payments
9. **Receipt** - receipts
10. **Notification** - notifications
11. **Configuration** - settings
12. **Reporting** - reporting

## 🚀 Quick Start

### Minimal MVP includes:
1. Auth + User - for system login
2. Customer - customer management
3. Order - order creation
4. Pricing - cost calculation
5. Receipt - receipt printing

### Recommended sequence:
1. Create OpenAPI specifications for MVP domains
2. Generate DTOs and API interfaces
3. Implement cookie-based auth
4. Implement core domains
5. Add other domains gradually

## 🛠 Technology Stack

### Backend:
- Java 21
- Spring Boot 3.x
- Spring Security (cookie-based)
- Spring Data JPA
- PostgreSQL
- Redis (sessions)
- OpenAPI Generator
- Liquibase (migrations)

### Integrations:
- SMS providers
- Viber API
- Payment systems
- PDF generation

## 📐 Architectural Approaches

### For Startup (Monolithic Architecture):
```
JavaSpringDryCleaning/
├── src/main/java/org/example/dryclean/
│   ├── auth/
│   ├── user/
│   ├── customer/
│   ├── order/
│   ├── pricing/
│   └── common/
└── api-specs/
    └── *.yaml
```

### For Scaling (Modular Monolith):
```
JavaSpringDryCleaning/
├── dry-cleaning-auth/
├── dry-cleaning-user/
├── dry-cleaning-customer/
├── dry-cleaning-order/
├── dry-cleaning-pricing/
└── dry-cleaning-common/
```

## 📝 Best Practices

1. **API Design**:
   - RESTful principles
   - Consistent naming
   - Proper HTTP status codes
   - Versioning through URL

2. **Security**:
   - HttpOnly cookies
   - CSRF protection
   - Rate limiting
   - Input validation

3. **Code Quality**:
   - OpenAPI-first for consistency
   - Bean Validation
   - Unit and Integration tests
   - CI/CD pipeline

4. **Performance**:
   - Caching where possible
   - Database indexing
   - Async processing
   - Connection pooling

## 🔄 Architecture Evolution

### Phase 1: Monolithic MVP
- All domains in one project
- Quick start
- Simple deployment

### Phase 2: Modular Monolith
- Separate Maven modules
- Clear contracts
- Preparation for separation

### Phase 3: Microservices (optional)
- Separate deployment units
- Independent scaling
- Technology diversity

## ❓ FAQ

**Q: Isn't the architecture too complex for startup?**
A: No, you can start with a simple monolith using only package structure. Modularity is added gradually.

**Q: Why Cookie-based auth instead of JWT?**
A: Cookies are more secure (HttpOnly), simpler in session management, don't require client-side storage.

**Q: How to generate code from OpenAPI?**
A: Use openapi-generator-maven-plugin, which automatically creates DTOs and API interfaces.

**Q: Which domains are critical for MVP?**
A: Auth, User, Customer, Order, Pricing, Receipt - minimal set for a functioning system.

---

To get started, check [NEXT_STEPS.md](NEXT_STEPS.md) with detailed implementation plan.