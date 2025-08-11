# OpenAPI-First Development Approach

## Concept

OpenAPI-First means that we first design the API through OpenAPI specification, and then generate code based on it. This ensures:

- Single source of truth for API
- Automatic generation of DTOs and controllers
- Frontend/backend synchronization through shared specification
- Automatic documentation

## Project Structure with OpenAPI

```
JavaSpringDryCleaning/
├── api-specs/                     # OpenAPI specifications
│   ├── common/                    # Shared components
│   │   ├── schemas/              
│   │   │   ├── error.yaml        # Standard errors
│   │   │   ├── pagination.yaml  # Pagination
│   │   │   └── money.yaml       # Money type
│   │   └── parameters/
│   │       └── common.yaml      # Common parameters
│   │
│   ├── auth-api.yaml            # Auth API specification
│   ├── user-api.yaml            # User API specification
│   ├── customer-api.yaml        # Customer API specification
│   ├── order-api.yaml           # Order API specification
│   ├── pricing-api.yaml         # Pricing API specification
│   └── main-api.yaml            # Main file with $ref
│
├── dry-cleaning-api/            # Generated code
│   ├── pom.xml
│   └── target/generated-sources/
│       └── openapi/
│           ├── model/          # DTO classes
│           └── api/            # Controller interfaces
```

## OpenAPI Specification Example

### customer-api.yaml
```yaml
openapi: 3.0.3
info:
  title: Customer API
  version: 1.0.0
  description: API for dry cleaning customer management

paths:
  /api/v1/customers:
    post:
      operationId: createCustomer
      summary: Create new customer
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
          description: Customer created
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
      summary: Search customers
      tags:
        - customers
      parameters:
        - name: query
          in: query
          description: Search query
          schema:
            type: string
        - name: phone
          in: query
          description: Phone number for search
          schema:
            type: string
        - $ref: '#/components/parameters/PageNumber'
        - $ref: '#/components/parameters/PageSize'
      responses:
        '200':
          description: List of customers
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CustomerListResponse'

  /api/v1/customers/{customerId}:
    get:
      operationId: getCustomerById
      summary: Get customer by ID
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
          description: Customer details
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
          description: Customer first name
        lastName:
          type: string
          minLength: 2
          maxLength: 50
          description: Customer last name
        phone:
          type: string
          pattern: '^\+380\d{9}$'
          description: Phone in format +380XXXXXXXXX
        email:
          type: string
          format: email
          description: Email address
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

## Maven Configuration for Generation

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

## Implementation of Generated Interfaces

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

## Cookie-based Authentication Specification

### auth-api.yaml
```yaml
paths:
  /api/v1/auth/login:
    post:
      operationId: login
      summary: System login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Successful login
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
      summary: System logout
      security:
        - cookieAuth: []
      responses:
        '200':
          description: Successful logout
          headers:
            Set-Cookie:
              description: Clear session cookie
              schema:
                type: string
                example: SESSION=; Path=/; Max-Age=0
  
  /api/v1/auth/refresh:
    post:
      operationId: refreshToken
      summary: Refresh session
      security:
        - cookieAuth: []
      responses:
        '200':
          description: Session refreshed
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

## OpenAPI-First Advantages

### 1. Contract as Code
- API specification is versioned in Git
- Code review for API changes
- Contract change history

### 2. Automatic Generation
- DTOs with validation
- Controller interfaces
- Client SDKs
- Documentation (Swagger UI)

### 3. Type Safety
- Strong typing
- Compile-time checks
- No discrepancies between documentation and code

### 4. Parallel Development
- Frontend can start development immediately after specification creation
- Mock server based on specification
- Contract testing

## Additional Tools

### 1. Redocly CLI
```bash
# Specification validation
redocly lint api-specs/main-api.yaml

# File bundling
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
# Run mock server
prism mock api-specs/main-api.yaml

# Frontend can work with mock API
curl http://localhost:4010/api/v1/customers
```

## Best Practices

### 1. Modularity
- Separate files for each domain
- Shared components in common/
- Using $ref for reusability

### 2. Versioning
- Semantic versioning for API
- Backward compatibility
- Deprecation strategy

### 3. Validation
- Bean Validation annotations
- Custom validators
- Request/Response validation

### 4. Security
- Security schemes in specification
- CORS configuration
- Rate limiting headers

## CI/CD Integration

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

This approach ensures reliable and scalable API development with minimal effort for documentation and client code maintenance.