# Game Boosting Calculator - Comprehensive Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Overview](#architecture-overview)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [API Integration](#api-integration)
6. [Admin Panel Guide](#admin-panel-guide)
7. [Calculator User Guide](#calculator-user-guide)
8. [Technical Specifications](#technical-specifications)
9. [Configuration Guide](#configuration-guide)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)
12. [API Reference](#api-reference)

---

## System Overview

The Game Boosting Calculator is a comprehensive web application designed for managing and calculating game boosting service prices. It consists of two main functional areas:

- **Admin Panel**: Complete administrative interface for managing games, boosters, pricing configurations, and system settings
- **Calculator Interface**: User-facing interface for customers to calculate boosting service costs with real-time pricing

### Key Features

- **Multi-game Support**: Support for various game categories (FPS, MOBA, RPG, etc.)
- **Dynamic Pricing**: Flexible pricing system with multiple calculation formulas
- **Modifier System**: Customizable service modifiers and add-ons
- **Real-time Calculation**: Instant price calculation with comprehensive validation
- **Admin Management**: Complete CRUD operations for all system entities
- **Type-safe Integration**: Full TypeScript integration with OpenAPI-generated types

---

## Architecture Overview

### Design Principles

The system follows **DDD (Domain-Driven Design) inside, FSD (Feature-Sliced Design) outside** principles:

- **Backend**: Pure DDD SOLID architecture with domain entities, services, and repositories
- **Frontend**: FSD architecture with feature modules and clean separation of concerns
- **Integration**: API-first approach with OpenAPI specifications as single source of truth

### Technology Stack

- **Backend**: Java 17, Spring Boot 3.x, JPA/Hibernate, PostgreSQL
- **Frontend**: Next.js 14, TypeScript, Material-UI, Zustand, React Query
- **API**: OpenAPI 3.0, Orval for type generation
- **Database**: PostgreSQL with JSON support for complex formulas

---

## Backend Architecture

### Domain Layer Structure

```
domain/game/
├── entities/           # JPA entities with business logic
├── repositories/       # Spring Data JPA repositories
├── services/          # Business logic services
├── specifications/    # JPA dynamic query specifications
├── formula/           # Calculation formula entities
├── mappers/           # Entity ↔ DTO mapping
├── exceptions/        # Domain-specific exceptions
└── validators/        # Business rule validators
```

### Core Entities

#### GameEntity

- **Purpose**: Central entity representing games
- **Key Fields**:
  - `code`: Unique game identifier
  - `name`: Display name
  - `category`: Game category (enum)
  - `active`: Availability status
  - `sortOrder`: Display priority
- **Relationships**:
  - One-to-many with DifficultyLevelEntity
  - One-to-many with PriceConfigurationEntity
  - One-to-many with BoosterEntity

#### PriceConfigurationEntity

- **Purpose**: Pricing rules and formulas for game services
- **Key Fields**:
  - `basePrice`: Base price in cents
  - `pricePerLevel`: Additional price per level
  - `calculationFormula`: JSON formula configuration
  - `active`: Configuration status
- **Relationships**:
  - Many-to-one with GameEntity
  - Many-to-one with DifficultyLevelEntity
  - Many-to-one with ServiceTypeEntity

#### CalculationFormulaEntity

- **Purpose**: Polymorphic formula system for price calculations
- **Supported Types**:
  - `LINEAR`: `basePrice + (levelDiff × pricePerLevel)`
  - `RANGE`: Different pricing for level ranges
  - `TIME_BASED`: Time-based pricing calculations
  - `FORMULA`: Custom mathematical formulas

### Service Layer

#### GameService

- **Purpose**: Main business logic service
- **Responsibilities**:
  - CRUD operations for games
  - Business rule validation
  - Entity ↔ DTO conversion
  - Transaction management

#### GameQueryService

- **Purpose**: Read operations with caching and optimization
- **Features**:
  - Paginated queries with filtering
  - Specification-based dynamic queries
  - Entity mapping and conversion

### Repository Layer

#### GameRepository

```java
@Repository
public interface GameRepository extends JpaRepository<GameEntity, UUID>, JpaSpecificationExecutor<GameEntity> {
    Optional<GameEntity> findByCode(String code);
    List<GameEntity> findByCategory(CategoryEnum category);
    List<GameEntity> findByActiveTrueOrderBySortOrderAsc();
    Page<GameEntity> findGamesWithSearchAndPagination(Boolean active, String search, Pageable pageable);
}
```

#### GameSpecification

- **Purpose**: Dynamic query composition
- **Methods**:
  - `hasActive(Boolean active)`: Filter by active status
  - `searchByNameOrCode(String search)`: Text search
  - `orderBySortOrder()`: Sorting specification
  - `filterGames(Boolean active, String search)`: Combined filtering

### Controller Layer

#### GamesController

- **Purpose**: REST API endpoint implementation
- **Implements**: OpenAPI-generated GamesApi interface
- **Endpoints**:
  - `GET /api/games`: List games with pagination
  - `POST /api/games`: Create new game
  - `GET /api/games/{id}`: Get game by ID
  - `PUT /api/games/{id}`: Update game
  - `DELETE /api/games/{id}`: Delete game
  - `GET /api/games/active`: Get all active games

---

## Frontend Architecture

### Feature Structure

```
features/game-boosting-calculator/
├── components/
│   ├── admin/          # Admin management components
│   ├── calculator/     # Calculator interface components
│   ├── games/          # Game selection components
│   ├── boosters/       # Booster selection components
│   └── summary/        # Summary display components
├── hooks/              # Custom React hooks
├── store/              # Zustand state management
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

### State Management

#### Zustand Store (game-boosting-store.ts)

```typescript
interface GameBoostingStore {
  // Selected entities
  selectedGameId: string | null;
  selectedGame: Game | null;
  selectedBoosterId: string | null;
  selectedBooster: Booster | null;

  // Calculator state
  basePrice: number;
  selectedModifiers: string[];
  startLevel: number;
  targetLevel: number;
  serviceTypeCode: string;
  difficultyLevelCode: string;
  calculatedPrice: number | null;
  isCalculating: boolean;

  // UI state
  currentStep:
    | "game-selection"
    | "booster-selection"
    | "calculator"
    | "summary";
  isGameSelectorOpen: boolean;
  isBoosterSelectorOpen: boolean;

  // Actions
  setSelectedGame: (gameId: string | null, game?: Game) => void;
  setSelectedBooster: (boosterId: string | null, booster?: Booster) => void;
  setBasePrice: (price: number) => void;
  setCalculatedPrice: (price: number | null) => void;
  setCurrentStep: (step: GameBoostingStore["currentStep"]) => void;
  resetCalculator: () => void;
}
```

### Custom Hooks

#### useGameCalculatorOperations

- **Purpose**: Main calculator operations hook
- **Features**:
  - Orval API integration
  - Price calculation logic
  - Validation and error handling
  - Loading state management

#### useAvailableGames

- **Purpose**: Fetch and manage available games
- **Returns**:
  - `games`: Array of available games
  - `isLoading`: Loading state
  - `error`: Error state
  - `defaultGame`: First available game

### Component Architecture

#### GameBoostingCalculator (Main Container)

- **Purpose**: Root component with stepper navigation
- **Features**:
  - 4-step wizard interface
  - State management integration
  - Step validation and navigation

#### CalculatorSection

- **Purpose**: Price calculation interface
- **Features**:
  - Dynamic form fields based on game configuration
  - Real-time validation
  - Modifier selection panel
  - Price calculation and display

---

## API Integration

### OpenAPI Specification

The system uses OpenAPI 3.0 as the single source of truth:

```
backend/src/main/resources/openapi/
├── game/
│   ├── game-api.yaml        # API endpoints
│   └── game-schemas.yaml    # Data schemas
├── common.yaml              # Shared schemas
└── aksi-bundled.yaml       # Complete specification
```

### Orval Integration

Frontend uses Orval for automatic type generation:

```typescript
// Generated types
export interface Game {
  id: string;
  code: string;
  name: string;
  category: Game.CategoryEnum;
  active: boolean;
  sortOrder: number;
}

// Generated hooks
export const useGamesListGames = (params, options) => { ... };
export const useCalculateWithFormula = () => { ... };
```

### API Endpoints

#### Game Management

- `GET /api/games` - List games with filtering and pagination
- `POST /api/games` - Create new game
- `GET /api/games/{id}` - Get game by ID
- `PUT /api/games/{id}` - Update game
- `DELETE /api/games/{id}` - Delete game
- `GET /api/games/active` - Get all active games

#### Calculation

- `POST /api/calculate` - Calculate price with formula
- `GET /api/games/{id}/difficulty-levels` - Get difficulty levels for game
- `GET /api/games/{id}/service-types` - Get service types for game
- `GET /api/modifiers` - Get available modifiers

---

## Admin Panel Guide

### Accessing Admin Panel

1. Navigate to Game Boosting Calculator section
2. Click "Admin Panel" or "Manage System" button
3. Authenticate with admin credentials if required

### Game Management

#### Adding New Games

1. **Navigate to Games Tab**

   - Click "Games" in the admin navigation

2. **Create Game Dialog**

   - Click "Add Game" button
   - Fill required fields:
     - **Code**: Unique identifier (e.g., "LOL", "WOW")
     - **Name**: Display name (e.g., "League of Legends")
     - **Category**: Select from dropdown (FPS, MOBA, RPG, etc.)
     - **Description**: Optional detailed description
     - **Sort Order**: Numeric value for display priority
     - **Active**: Toggle for availability

3. **Validation and Save**
   - System validates unique code
   - Category must be from predefined enum
   - Sort order affects display order in calculator

#### Managing Existing Games

- **Edit**: Click edit icon to modify any field
- **Activate/Deactivate**: Toggle active status to show/hide in calculator
- **Delete**: Remove game (warning: affects related configurations)
- **Bulk Operations**: Select multiple games for batch operations

### Difficulty Level Configuration

#### Creating Difficulty Levels

1. **Select Game Context**

   - Choose game from dropdown or select from list

2. **Add Difficulty Level**

   - Click "Add Difficulty Level"
   - Configure:
     - **Code**: Unique code (e.g., "BRONZE", "SILVER")
     - **Name**: Display name (e.g., "Bronze Division")
     - **Level Value**: Numeric representation (1-100)
     - **Sort Order**: Display priority

3. **Level Range Management**
   - Define valid level ranges for each difficulty
   - Configure level progression rules

#### Managing Difficulty Levels

- **Edit Properties**: Modify name, level value, sort order
- **Reorder**: Drag and drop or use sort order field
- **Delete**: Remove difficulty level (affects pricing)

### Price Configuration Management

#### Setting Up Pricing Rules

1. **Navigate to Price Configurations**

   - Click "Price Configurations" tab

2. **Create Configuration**

   - Select combination: Game + Difficulty Level + Service Type
   - Configure pricing:
     - **Base Price**: Starting price in dollars (converted to cents)
     - **Price Per Level**: Additional cost per level
     - **Currency**: Default USD
     - **Calculation Type**: Select formula type

3. **Formula Configuration**

   - **Linear**: Simple base + level multiplier
   - **Range**: Different rates for level ranges
   - **Time-based**: Hourly/daily pricing
   - **Custom Formula**: Mathematical expressions

4. **Formula Parameters**
   - Configure specific parameters based on formula type
   - Test calculations with sample values

#### Managing Price Configurations

- **Edit**: Modify pricing parameters
- **Activate/Deactivate**: Enable/disable pricing rules
- **Duplicate**: Copy configuration for similar setups
- **Test**: Verify calculations with test data

### Modifier Management

#### Creating Modifiers

1. **Access Modifiers Tab**

   - Navigate to "Modifiers" section

2. **Add New Modifier**

   - Click "Add Modifier"
   - Define:
     - **Code**: Unique identifier
     - **Name**: Display name
     - **Description**: Detailed explanation
     - **Type**: Percentage, Fixed Amount, Multiplier
     - **Value**: Modifier value
     - **Game Association**: Link to specific game
     - **Service Type**: Link to service category

3. **Modifier Rules**
   - Configure application conditions
   - Set stacking rules (if multiple modifiers)
   - Define compatibility with other modifiers

#### Managing Modifiers

- **Edit**: Update modifier properties and rules
- **Activate/Deactivate**: Control availability
- **Delete**: Remove modifier from system

### System Monitoring

#### Viewing System Statistics

1. **Dashboard Overview**

   - Total games, active configurations
   - Recent calculations, error rates
   - System performance metrics

2. **Audit Logs**
   - View configuration changes
   - Track calculation history
   - Monitor user activities

---

## Calculator User Guide

### Accessing Calculator

1. Navigate to main Game Boosting Calculator
2. Start with game selection step
3. Follow 4-step wizard process

### Step 1: Game Selection

#### Selecting a Game

1. **Search Interface**

   - Use search field to find games by name
   - Browse alphabetical or categorized list
   - View game details and categories

2. **Game Information**

   - **Name**: Official game title
   - **Category**: Game genre/type
   - **Status**: Active/available status
   - **Description**: Additional game information

3. **Selection Process**

   - Click on desired game
   - Selection is highlighted
   - System loads game-specific configurations
   - Cache invalidation occurs for related data

4. **Navigation**
   - "Next: Select Booster" button enabled after selection
   - Back button disabled (first step)

### Step 2: Booster Selection

#### Choosing a Booster

1. **Available Boosters**

   - System shows boosters for selected game
   - Each booster displays:
     - Display name and specialization
     - Associated service type
     - Availability status

2. **Booster Details**

   - **Specialization**: Specific boosting area
   - **Service Type**: Automatically configured
   - **Pricing**: Based on booster type

3. **Selection Impact**

   - Automatically sets service type
   - Loads booster-specific pricing
   - Pre-configures calculator settings

4. **Navigation**
   - "Next: Calculator" after selection
   - "Back" to return to game selection

### Step 3: Price Calculator

#### Configuration Setup

1. **Base Price Input**

   - Enter base service price in dollars
   - System converts to cents for backend
   - Required field with validation
   - Minimum value validation

2. **Service Type Configuration**

   - Automatically set from booster selection
   - Read-only field (cannot be changed)
   - Displays selected service type code

3. **Difficulty Level Configuration**

   - Automatically selected by system
   - Based on game and service type combination
   - Read-only field with current selection

4. **Level Configuration**
   - **Start Level**: Current player level
   - **Target Level**: Desired end level
   - Dynamic fields based on game requirements
   - Range validation (target > start)
   - Minimum/maximum level constraints

#### Modifier Selection

1. **Available Modifiers**

   - System loads modifiers for selected game/service
   - Displays modifier name, description, and impact
   - Shows modifier type and value

2. **Selection Process**

   - Check/uncheck desired modifiers
   - Real-time price updates (when supported)
   - Compatibility validation
   - Stacking rule enforcement

3. **Modifier Information**
   - **Type**: Percentage, Fixed, Multiplier
   - **Value**: Impact amount
   - **Description**: Detailed explanation
   - **Compatibility**: Which modifiers can be combined

#### Price Calculation

1. **Calculation Trigger**

   - Click "Calculate Price" button
   - System validates all required fields
   - Loading state during calculation

2. **Validation Checks**

   - Game selection required
   - Base price must be > 0
   - Service type and difficulty level required
   - Level ranges must be valid
   - Modifier compatibility verified

3. **Calculation Process**

   - System builds UniversalCalculationRequest
   - Sends to backend calculation service
   - Applies selected formula type
   - Processes modifiers and adjustments
   - Returns final price in cents

4. **Result Display**
   - Final price in dollars (converted from cents)
   - Breakdown of all components
   - Applied modifiers list
   - Debug information (calculation details)

#### Error Handling

1. **Validation Errors**

   - Clear error messages for each field
   - Specific guidance for corrections
   - Inline validation feedback

2. **API Errors**

   - Network error handling
   - Retry mechanisms
   - Graceful error messages

3. **Calculation Errors**
   - Formula validation errors
   - Configuration issues
   - Data consistency problems

### Step 4: Summary

#### Review Configuration

1. **Game and Booster Summary**

   - Selected game name and category
   - Chosen booster with specialization
   - Service type confirmation

2. **Price Breakdown**

   - Base price display
   - Level-based calculations
   - Applied modifiers with individual costs
   - Total final price

3. **Configuration Details**
   - Start and target levels
   - Selected difficulty level
   - All applied modifiers list

#### Final Actions

1. **Review Process**

   - Verify all selections are correct
   - Check price calculations
   - Confirm modifier selections

2. **Navigation Options**
   - "Back" to modify any step
   - "Complete" for order placement (future feature)
   - "Reset" to start over

---

## Technical Specifications

### Data Models

#### Game Entity Schema

```typescript
interface Game {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: "FPS" | "MOBA" | "RPG" | "STRATEGY" | "OTHER";
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

#### PriceConfiguration Schema

```typescript
interface PriceConfiguration {
  id: string;
  gameId: string;
  difficultyLevelId: string;
  serviceTypeId: string;
  basePrice: number; // in cents
  pricePerLevel: number; // in cents
  currency: string;
  calculationType: "LINEAR" | "RANGE" | "FORMULA" | "TIME_BASED";
  calculationFormula: CalculationFormulaEntity;
  active: boolean;
  sortOrder: number;
}
```

### Calculation Formulas

#### Linear Formula

```
Final Price = Base Price + (Level Difference × Price Per Level)
Example: $10.00 + (50 levels × $0.20) = $20.00
```

#### Range Formula

```
Price varies based on level ranges:
- Levels 1-10: $0.10 per level
- Levels 11-50: $0.20 per level
- Levels 51-100: $0.30 per level
```

#### Time-based Formula

```
Hourly rate × Hours + Base fee
Example: $5/hour × 10 hours + $15 base = $65.00
```

### API Response Formats

#### Paginated Response

```typescript
interface PaginatedResponse<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

#### Calculation Response

```typescript
interface CalculationResponse {
  finalPrice: number; // in cents
  breakdown: {
    basePrice: number;
    levelCost: number;
    modifierCosts: Array<{
      modifierId: string;
      name: string;
      cost: number;
    }>;
    totalModifiers: number;
  };
  appliedFormula: string;
  calculationTime: number; // milliseconds
}
```

---

## Configuration Guide

### Environment Variables

#### Backend Configuration

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/game_boosting
spring.datasource.username=game_user
spring.datasource.password=game_password

# OpenAPI
openapi.spec.location=classpath:openapi/
orval.config.path=frontend/orval.config.ts

# Cache
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379
```

#### Frontend Configuration

```typescript
// orval.config.ts
export default {
  input: {
    target: "./backend/src/main/resources/openapi/aksi-bundled.yaml",
  },
  output: {
    target: "./shared/api/generated",
    client: "react-query",
    mode: "tags-split",
  },
};
```

### Database Schema

#### Core Tables

- `games`: Game master data
- `difficulty_levels`: Game difficulty configurations
- `service_types`: Available service categories
- `price_configurations`: Pricing rules and formulas
- `boosters`: Booster profiles and specializations
- `game_modifiers`: Pricing modifiers and adjustments

#### Relationships

- Games → Difficulty Levels (1:many)
- Games → Price Configurations (1:many)
- Difficulty Levels → Price Configurations (1:many)
- Service Types → Price Configurations (1:many)

### Cache Configuration

#### Redis Cache Keys

- `games:active`: Active games list
- `game:{id}:config`: Game configuration data
- `modifiers:game:{id}`: Game-specific modifiers
- `calculation:{hash}`: Calculation results cache

---

## Troubleshooting

### Common Issues

#### Game Not Appearing in Calculator

**Symptoms**: Game doesn't show in selection dropdown

**Possible Causes**:

- Game marked as inactive
- Missing price configurations
- Cache synchronization issues

**Solutions**:

1. Check game active status in admin panel
2. Verify price configurations exist
3. Clear frontend cache or refresh page
4. Check backend logs for configuration errors

#### Price Calculation Errors

**Symptoms**: Calculation fails or returns incorrect price

**Possible Causes**:

- Invalid formula configuration
- Missing price configuration for game/service combination
- Modifier compatibility issues
- Level range validation errors

**Solutions**:

1. Verify price configuration exists for selected combination
2. Test formula with sample data in admin panel
3. Check modifier compatibility rules
4. Validate level ranges in difficulty configuration

#### Modifier Not Applying

**Symptoms**: Selected modifiers don't affect final price

**Possible Causes**:

- Modifier not associated with selected game/service
- Modifier marked as inactive
- Compatibility rules preventing application
- Formula not configured to handle modifiers

**Solutions**:

1. Verify modifier associations in admin panel
2. Check modifier active status
3. Review compatibility rules
4. Update formula to include modifier calculations

### Performance Issues

#### Slow Game Loading

**Symptoms**: Game list takes long time to load

**Solutions**:

1. Check database query performance
2. Verify cache configuration
3. Optimize pagination settings
4. Review network latency

#### Calculation Delays

**Symptoms**: Price calculation takes too long

**Solutions**:

1. Implement calculation result caching
2. Optimize formula evaluation
3. Review database query performance
4. Consider calculation pre-computation for common scenarios

### Data Consistency Issues

#### Configuration Conflicts

**Symptoms**: Different prices for same configuration

**Solutions**:

1. Review price configuration uniqueness constraints
2. Check for duplicate configurations
3. Validate formula consistency
4. Implement configuration version control

#### Cache Synchronization

**Symptoms**: Frontend shows stale data

**Solutions**:

1. Implement proper cache invalidation
2. Use React Query cache management
3. Add manual cache refresh options
4. Monitor cache hit/miss ratios

---

## Best Practices

### Development Guidelines

#### Code Organization

- Follow DDD principles in backend
- Maintain FSD structure in frontend
- Keep API contracts clean and versioned
- Implement proper error handling

#### Performance Optimization

- Implement caching for frequently accessed data
- Use pagination for large datasets
- Optimize database queries with proper indexing
- Monitor API response times

#### Security Considerations

- Validate all input data
- Implement proper authentication for admin functions
- Use parameterized queries to prevent SQL injection
- Implement rate limiting for calculation endpoints

### User Experience

#### Interface Design

- Maintain consistent navigation patterns
- Provide clear feedback for all actions
- Implement progressive disclosure for complex forms
- Use appropriate loading states and error messages

#### Data Validation

- Implement client-side validation for immediate feedback
- Validate data on server for security
- Provide clear error messages and correction guidance
- Handle edge cases gracefully

### Maintenance

#### Monitoring and Logging

- Implement comprehensive logging
- Monitor system performance metrics
- Track user behavior patterns
- Set up alerts for critical errors

#### Backup and Recovery

- Regular database backups
- Configuration version control
- Documentation of critical procedures
- Disaster recovery planning

---

## API Reference

### Games API

#### List Games

```
GET /api/games?page=0&size=20&search=lol&active=true
Response: PaginatedResponse<Game>
```

#### Get Game by ID

```
GET /api/games/{id}
Response: Game
```

#### Create Game

```
POST /api/games
Body: CreateGameRequest
Response: Game
```

#### Update Game

```
PUT /api/games/{id}
Body: UpdateGameRequest
Response: Game
```

#### Delete Game

```
DELETE /api/games/{id}
Response: void
```

### Calculation API

#### Calculate Price

```
POST /api/calculate
Body: UniversalCalculationRequest
Response: CalculationResponse
```

#### Get Available Modifiers

```
GET /api/modifiers?gameCode=LOL&serviceTypeCode=BOOSTING
Response: Modifier[]
```

#### Get Difficulty Levels

```
GET /api/games/{id}/difficulty-levels
Response: DifficultyLevel[]
```

### Admin API

#### Bulk Operations

```
POST /api/admin/games/bulk-activate
Body: { gameIds: string[] }
Response: BulkOperationResponse
```

#### Configuration Validation

```
POST /api/admin/validate-configuration
Body: PriceConfiguration
Response: ValidationResult
```

---

## Support and Contact

For technical support or questions regarding this documentation:

- **Technical Issues**: Check troubleshooting section first
- **Feature Requests**: Document requirements clearly
- **Bug Reports**: Include steps to reproduce and system information
- **Performance Issues**: Provide system metrics and logs

This documentation provides comprehensive guidance for both administrators managing the system and developers working with the Game Boosting Calculator. Regular updates and improvements should be reflected in this document.
