# Next Implementation Steps

## Prepared Architecture Documents

✅ **DOMAIN_ARCHITECTURE.md** - 13 domains with Auth/User separation
✅ **PROJECT_STRUCTURE.md** - project structure
✅ **DOMAIN_INTERACTIONS.md** - domain interactions
✅ **API_CONTRACTS.md** - API contracts
✅ **OPENAPI_FIRST_APPROACH.md** - OpenAPI generation
✅ **COOKIE_BASED_AUTH.md** - cookie authentication

## Recommended Sequence

### Phase 1: OpenAPI and Infrastructure (3-5 days)

1. **Create OpenAPI specifications**
   - Basic schemas (error, pagination)
   - Auth API (login/logout)
   - User API (CRUD operations)
   - Customer API

2. **Set up project**
   - Maven with OpenAPI generator plugin
   - Spring Boot 3.x
   - Docker compose for DB and Redis

3. **Generate base code**
   - DTOs from OpenAPI specs
   - API interfaces
   - Validation annotations

### Phase 2: Auth and User (1 week)

1. **Cookie-based Authentication**
   - Session management in Redis
   - CSRF protection
   - Security filters

2. **User Management**
   - Roles (OPERATOR, MANAGER, ADMIN)
   - Branch binding
   - CRUD operations

3. **Testing**
   - Integration tests with Testcontainers
   - Security testing

### Phase 3: Core MVP (2 weeks)

1. **Customer Domain**
   - Customer search
   - Order history
   - Communication settings

2. **Price List Domain** (simplified catalog)
   - Single price list instead of separate tables
   - CRUD for price list item management
   - All necessary fields in one table

3. **Order Domain with Cart Functionality**
   - **Cart**:
     - Temporary item storage before order creation
     - Interactive real-time price calculation
     - Global parameters application (urgency, discounts)
     - TTL mechanism (auto-deletion after 1 hour)
   - **Order**:
     - Order creation from ready cart
     - Item characteristics fixation (material, color, defects)
     - Item photography
     - Statuses

4. **Pricing Domain**
   - Calculator based on ServiceItem and characteristics
   - Modifiers and rules
   - API for calculations
   - Integration with Cart for real-time calculations

5. **Receipt Domain**
   - PDF generation
   - QR codes
   - Templates

### Phase 4: Extended Features (as needed)

- **Payment** - payment integration
- **Notification** - SMS/Viber
- **Branch** - branch management
- **Reporting** - reporting

## Startup Structure

### Monolithic Architecture
```
src/main/java/org/example/dryclean/
├── auth/          # Authentication
├── user/          # User management  
├── customer/      # Customers
├── catalog/       # Price list (single catalog)
├── order/         # Orders (includes cart and characteristics)
│   ├── cart/      # Cart functionality
│   ├── order/     # Order management
│   └── storage/   # Photo storage
├── pricing/       # Price calculation
├── receipt/       # Receipts
└── common/        # Shared components
```

### OpenAPI Structure
```
api-specs/
├── common/        # Shared schemas
├── auth-api.yaml
├── user-api.yaml
├── customer-api.yaml
├── price-list-api.yaml  # Single price list
├── cart-api.yaml       # Cart
├── order-api.yaml      # Orders
├── pricing-api.yaml
└── main-api.yaml      # Aggregates all APIs
```

## Key Technologies

- **Backend**: Spring Boot 3.x, Java 21
- **API**: OpenAPI 3.0, code generation
- **Auth**: Cookie-based, Spring Security
- **Database**: PostgreSQL, Flyway migrations
- **Sessions & Cache**: Redis (sessions and cart with TTL)
- **Testing**: JUnit 5, Testcontainers
- **Deploy**: Docker, Docker Compose

## Development Workflow

1. **Design API First**
   - Write OpenAPI spec
   - Validate through Redocly
   - Review with team

2. **Generate Code**
   - Maven generate-sources
   - Implement generated interfaces
   - Add business logic

3. **Test Driven**
   - Integration tests
   - API contract tests
   - Security tests

4. **Deploy**
   - Docker containers
   - Environment configs
   - Health checks

## MVP Checklist

### Week 1
- [ ] OpenAPI specs for Auth, User, Customer
- [ ] Project setup and generation
- [ ] Cookie authentication
- [ ] User CRUD

### Week 2
- [ ] Customer management
- [ ] Price list management (CRUD)
- [ ] Cart implementation:
  - [ ] Cart REST API
  - [ ] Real-time price calculation
  - [ ] TTL mechanism with Redis
  - [ ] Urgency and discount handling
- [ ] Order creation flow (with characteristics):
  - [ ] Create order from cart
  - [ ] Item characteristics capture
  - [ ] Photo upload

### Week 3
- [ ] Pricing calculator
- [ ] Receipt generation
- [ ] Testing
- [ ] Documentation
- [ ] Docker setup

## Important Decisions

1. **OpenAPI-First** - all APIs are designed through specifications
2. **Cookie Auth** - safer than JWT in headers
3. **Modularity** - domains are maximally independent
4. **PostgreSQL + Redis** - main storage + sessions
5. **Docker** - everything runs in containers
6. **Cart-based Order Flow** - cart for interactive calculation before order creation

## Quick Start

```bash
# 1. Create OpenAPI specs
# 2. Generate code: mvn generate-sources
# 3. Run in Docker: docker-compose up
# 4. Develop with hot-reload
```

For detailed code examples and specifications, see the corresponding architecture documents.