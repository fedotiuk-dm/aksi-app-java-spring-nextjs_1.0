# Domain Architecture of Dry Cleaning Management System

## Architecture Overview

The system is built on Domain-Driven Design (DDD) principles with clear separation into distinct domains. Each domain encapsulates its business logic and is responsible for a specific area of the system.

## Domain Structure

### 1. Auth Domain
**Responsibility**: Authentication and session management

**Core Components**:
- Cookie-based authentication (httpOnly, secure)
- Session management
- CSRF protection
- Refresh token mechanism

**Key Entities**:
- `Session` - active session
- `RefreshToken` - refresh token
- `AuthenticationAttempt` - login attempt

### 2. User Domain
**Responsibility**: Management of system users (operators)

**Core Components**:
- Operator profile management
- Role model (operator, manager, administrator)
- Branch assignment
- Activity history

**Key Entities**:
- `User` - system user (operator)
- `Role` - user role
- `Permission` - permissions
- `UserBranch` - branch assignment

### 3. Customer Domain
**Responsibility**: Management of dry cleaning customer information

**Core Components**:
- New customer registration
- Search and management of existing customers
- Contact data management
- Customer interaction history

**Key Entities**:
- `Customer` - customer
- `ContactInfo` - contact information
- `CommunicationPreference` - communication settings
- `CustomerSource` - customer acquisition source

### 4. Branch Domain
**Responsibility**: Management of order pickup points

**Core Components**:
- Branch information
- Working hours
- Branch contact information
- Operator assignment to branches

**Key Entities**:
- `Branch` - branch/pickup point
- `WorkSchedule` - working hours
- `BranchOperator` - operator assignment

### 5. Catalog Domain
**Responsibility**: Service price list management

**Core Components** (simplified on 2025-08-04):
- Unified service price list
- CSV price list import and management
- Extended fields for processing (execution time, express service)
- UI fields (sorting, description, Ukrainian name)
- Units of measurement (pieces, kilograms, square meters)

**Key Entities**:
- `PriceListItem` - unified price list element with all necessary fields:
  - Basic fields: category, name, prices (regular/delicate)
  - Time fields: processingTimeDays, expressAvailable, expressTimeHours
  - Additional fields: expressPrice, sortOrder, description, nameUa
  - Unit of measurement

**Architecture Simplification**:
- Removed: ServiceCatalog, ItemCatalog, ServiceItem
- One table instead of four
- Direct CRUD without complex synchronization

### 6. Pricing Domain
**Responsibility**: Cost calculation with all modifiers

**Core Components**:
- Price modifiers (urgency, contamination, children's items)
- Calculation rules
- Discounts and surcharges
- Cost calculator

**Key Entities**:
- `PriceModifier` - price modifier
- `ModifierRule` - modifier application rule
- `Discount` - discount
- `Surcharge` - surcharge
- `PriceCalculation` - price calculation

### 7. Order Domain
**Responsibility**: Order lifecycle management and item characteristics

**Core Components**:
- Shopping cart for temporary storage and price calculation
- Real-time interactive price calculator
- Order creation from cart
- Status management
- Item characteristics recording upon acceptance
- Item and defect photography
- Execution time calculation

**Key Entities**:

**Cart (temporary storage before order creation)**:
- `OrderCart` - cart for item storage and calculation
- `CartItem` - item in cart with characteristics
- `CartItemPricing` - detailed item price calculation
- `CartPricing` - overall cart calculation with discounts

**Order**:
- `Order` - order
- `OrderItem` - item in order with all characteristics
- `OrderItemCharacteristics` - material, color, filler of item
- `OrderItemPhoto` - item photo in order
- `OrderItemDefect` - defects and damages
- `OrderItemStain` - stains and contamination
- `OrderStatus` - order status
- `OrderTimeline` - order timeline
- `UniqueLabel` - unique label (QR-code)

### 8. Payment Domain
**Responsibility**: Payment processing and financial operations

**Core Components**:
- Payment registration
- Payment methods
- Prepayments and debts
- Financial reporting

**Key Entities**:
- `Payment` - payment
- `PaymentMethod` - payment method
- `Invoice` - invoice
- `PaymentTransaction` - transaction

### 9. Receipt Domain
**Responsibility**: Receipt generation and printing

**Core Components**:
- Receipt generation
- Receipt templates
- Digital signatures
- QR-codes for tracking

**Key Entities**:
- `Receipt` - receipt
- `ReceiptTemplate` - receipt template
- `DigitalSignature` - digital signature
- `ReceiptQRCode` - receipt QR-code

### 11. Notification Domain
**Responsibility**: Sending notifications to customers

**Core Components**:
- SMS notifications
- Viber messages
- Email distribution
- Message templates

**Key Entities**:
- `NotificationTemplate` - message template
- `NotificationLog` - sent message log
- `NotificationChannel` - communication channel

### 12. Configuration Domain
**Responsibility**: Centralized system settings management

**Core Components**:
- Global settings
- Modifier configuration
- Discount settings
- Business rules

**Key Entities**:
- `SystemConfiguration` - system settings
- `BusinessRule` - business rule
- `ConfigurationHistory` - change history

### 13. Reporting Domain
**Responsibility**: Report generation and analytics

**Core Components**:
- Financial reports
- Operational reports
- Customer analytics
- Service statistics

**Key Entities**:
- `Report` - report
- `ReportTemplate` - report template
- `Analytics` - analytical data

## Shared/Common Modules

### Common Domain Models
- `Money` - monetary amounts handling
- `DateRange` - time intervals
- `Address` - address
- `PhoneNumber` - phone number
- `Email` - email address

### Common Services
- `ValidationService` - data validation
- `AuditService` - change audit
- `FileStorageService` - file storage
- `QRCodeService` - QR-code generation

## Domain Relationships

### Order -> Customer
- Order is always linked to a customer
- Customer order history

### Order -> Catalog
- Each OrderItem is linked to a specific PriceListItem
- PriceListItem defines base price, execution time and all service parameters

### Order Characteristics
- Item characteristics (material, color, defects) are stored in OrderItem
- Photos are taken during order creation and linked to OrderItem

### Cart -> Catalog + Pricing
- Cart uses PriceListItem to get base prices and service parameters
- Cart calls Pricing for calculation with all modifiers
- Interactive recalculation on parameter changes

### Cart -> Order
- Order is created from ready cart
- All calculations and characteristics are transferred from Cart
- Cart is deleted after Order creation

### Order -> Pricing
- Cost calculation for each item
- Applying modifiers and discounts

### Order -> Payment
- Payment registration for order
- Debt control

### Order -> Receipt
- Receipt generation on order creation
- Receipt printing

### Order -> Branch
- Order is linked to branch
- Branch operator creates order

### Customer -> Notification
- Sending notifications according to customer settings
- Communication history

## Technical Recommendations

### 1. Modularity
- Each domain is a separate Spring Boot module
- Clearly defined APIs between modules
- Minimal dependencies between domains

### 2. Database
- Ability to use different DB schemas for domains
- Transactional integrity within domain boundaries
- Eventual consistency between domains

### 3. API Gateway
- Single entry point for frontend
- Data aggregation from different domains
- Authorization at gateway level

### 4. Event-Driven Architecture
- Domains communicate through events
- Event sourcing for critical operations
- Asynchronous processing where possible

### 5. Scalability
- Ability to scale domains independently
- Caching usage
- Database query optimization

## How Modules Communicate

### 1. Monolithic Architecture (recommended for startup)
Within a single Spring Boot application, modules are represented as separate packages:

```
- Modules = Spring components in different packages
- Communication through Spring dependency injection
- Shared database with logical schema separation
- Transactions through @Transactional
```

**Interaction example:**

```java

@Service
public record OrderService(CustomerService customerService, PricingService pricingService) {
  public Order createOrder(CreateOrderRequest request) {
    // Direct call through DI
    Customer customer = customerService.findById(request.getCustomerId());
    PriceCalculation price = pricingService.calculate(request.getItems());
    // ...
  }
}
```

### 2. Modular Monolith (next step)
Separate Maven modules within single deployment:

```
- Each domain = separate Maven module
- Clear interfaces between modules
- Ability for independent versioning
- Shared application context
```

**Dependency structure:**
```
dry-cleaning-order depends on:
  - dry-cleaning-customer-api (interfaces)
  - dry-cleaning-pricing-api (interfaces)
  - dry-cleaning-common
```

### 3. Microservices (when scaling is needed)
Fully independent services:

```
- Each domain = separate microservice
- REST or gRPC for synchronous communication
- Message broker for asynchronous events
- Separate databases
```

## Architecture Simplification

### What can be combined for simplicity:

1. **Catalog Domain is now simplified (2025-08-04):**
   - PriceListItem - single table with all price list data
   - Direct CRUD without complex synchronization
   - Removed: ServiceCatalog, ItemCatalog, ServiceItem

2. **Configuration can be distributed:**
   - Price configuration → Pricing domain
   - Notification configuration → Notification domain
   - System settings → application.yml

3. **Reporting can initially be part of Order:**
   - Simple reports through JPA queries
   - Separate domain - when complex analytics appears

### Minimal set for MVP:
1. **Auth** - authentication
2. **User** - system users
3. **Customer** - customers
4. **Order** - orders (includes item characteristics)
5. **Pricing** - calculations
6. **Receipt** - receipts

Other domains can be added gradually.