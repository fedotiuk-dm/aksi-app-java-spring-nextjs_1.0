# OpenAPI Structure

## Files Organization

### Domain-First Architecture

Проект використовує **Domain-First** підхід з окремими API файлами для кожного домену.

### Core Files

- `common.yaml` - Shared components (schemas, parameters, responses, security schemes)
- `.redocly.yaml` - Redocly configuration for linting and validation

### Domain APIs Structure

```
domain-name/
├── domain-name-api.yaml    # Main API file for the domain
├── paths/
│   └── domain-name-paths.yaml   # All paths for the domain
└── schemas/
    └── domain-name-schemas.yaml # All schemas for the domain
```

### Current Domains

- `auth/` - Authentication and authorization
- `branch/` - Branch/office management
- `cart/` - Shopping cart management
- `customer/` - Customer management
- `file/` - File upload/download
- `games/` - Game services management
- `order/` - Order management
- `price-list/` - Price list management
- `pricing/` - Pricing calculations
- `receipt/` - Receipt generation
- `user/` - User management

## Domain API Structure

Each domain API file follows this pattern:

```yaml
# domain-name-api.yaml
openapi: 3.0.4
info:
  title: Domain Name API
  version: 1.0.0

# Import paths and schemas
paths:
  $ref: "./paths/domain-name-paths.yaml"

components:
  # Import domain-specific schemas
  schemas:
    $ref: "./schemas/domain-name-schemas.yaml"

  # Import common components
  parameters:
    PageNumber:
      $ref: "../common.yaml#/components/parameters/PageNumber"

  responses:
    BadRequest:
      $ref: "../common.yaml#/components/responses/BadRequest"

  securitySchemes:
    cookieAuth:
      $ref: "../common.yaml#/components/securitySchemes/cookieAuth"
```

## Maven Integration

### Current Configuration

Проект використовує **окремі executions** для кожного домену:

```xml
<!-- Auth Domain -->
<execution>
    <id>generate-auth-api</id>
    <configuration>
        <inputSpec>${project.basedir}/src/main/resources/openapi/auth/auth-api.yaml</inputSpec>
        <apiPackage>com.aksi.api.auth</apiPackage>
        <modelPackage>com.aksi.api.auth.dto</modelPackage>
    </configuration>
</execution>

<!-- Games Domain -->
<execution>
    <id>generate-games-api</id>
    <configuration>
        <inputSpec>${project.basedir}/src/main/resources/openapi/games/games-api.yaml</inputSpec>
        <apiPackage>com.aksi.api.games</apiPackage>
        <modelPackage>com.aksi.api.games.dto</modelPackage>
    </configuration>
</execution>

<!-- ... other domains -->
```

### Generated Package Structure

```
com.aksi.api.auth/          # Auth API interfaces
com.aksi.api.auth.dto/      # Auth DTOs
com.aksi.api.games/         # Games API interfaces
com.aksi.api.games.dto/     # Games DTOs
com.aksi.api.order/         # Order API interfaces
com.aksi.api.order.dto/     # Order DTOs
# ... etc
```

## Redocly Integration

### Linting and Validation

```bash
# Check all APIs for issues
npx @redocly/cli lint

# Lint specific domain
npx @redocly/cli lint auth/auth-api.yaml

# Generate documentation
npx @redocly/cli build-docs
```

### Configuration (.redocly.yaml)

```yaml
apis:
  auth: auth/auth-api.yaml
  games: games/games-api.yaml
  order: order/order-api.yaml
  # ... all domains

lint:
  rules:
    operation-description: error
    operation-summary: error
    no-ambiguous-paths: error
    operation-tag-defined: error
```

## Development Workflow

### 1. Create New Domain

```bash
mkdir new-domain
cd new-domain

# Create main API file
touch new-domain-api.yaml

# Create subdirectories
mkdir paths schemas
touch paths/new-domain-paths.yaml
touch schemas/new-domain-schemas.yaml
```

### 2. Add to Maven

```xml
<execution>
    <id>generate-new-domain-api</id>
    <configuration>
        <inputSpec>${project.basedir}/src/main/resources/openapi/new-domain/new-domain-api.yaml</inputSpec>
        <apiPackage>com.aksi.api.newdomain</apiPackage>
        <modelPackage>com.aksi.api.newdomain.dto</modelPackage>
    </configuration>
</execution>
```

### 3. Add to Redocly

```yaml
# .redocly.yaml
apis:
  new-domain: new-domain/new-domain-api.yaml
```

### 4. Generate and Test

```bash
# Generate Java code
mvn clean compile

# Lint API
npx @redocly/cli lint new-domain/new-domain-api.yaml
```

## Automatic Dependency Updates

### Available Commands

```bash
# Check for updates
make check-updates

# Safe updates (minor versions only)
make update-all-safe

# Update only dependencies
make update-dependencies

# Update only plugins
make update-plugins

# Revert if something goes wrong
make revert-updates
```

### Maven Versions Plugin

Автоматично оновлює залежності через `versions-maven-plugin`:

- ✅ **Безпечні оновлення**: тільки minor та incremental версії
- ✅ **Backup створення**: автоматичні резервні копії
- ✅ **Properties підтримка**: оновлює централізовані версії

## Key Benefits

✅ **Domain Separation**: Кожен домен має власний API
✅ **Package Organization**: Domain-specific Java packages
✅ **Common Components**: Shared schemas в одному місці
✅ **Automated Updates**: Автоматичне оновлення залежностей
✅ **Quality Control**: Redocly linting та validation
✅ **Hot Reload**: Підтримка hot reload під час розробки

## Technical Details

- **OpenAPI 3.0.4** specification compliance
- **Maven 3.6.3+** required (enforced by maven-enforcer-plugin)
- **Java 21** target version
- **Spring Boot 3.5+** compatibility
- **Domain-driven design** principles
- **API-First** development approach

## Best Practices

1. **Use domain-specific APIs** for focused development
2. **Update common.yaml** only for truly shared components
3. **Run linting** before committing changes
4. **Test generation** after API modifications
5. **Use make commands** for dependency updates
6. **Follow naming conventions** for consistency
