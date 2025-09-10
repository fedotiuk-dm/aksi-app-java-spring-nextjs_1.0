# Game Calculation System Architecture

## 🎯 Overview

Universal API-first calculation system that automatically routes different calculation types to specialized calculators. Single endpoint, multiple calculation strategies with automatic dispatch.

## 🏗️ Architecture Flow

```
HTTP Request → CalculationController → CalculationService → CalculationQueryService → CalculationStrategyFactory → Strategy → Calculator
```

graph TD
    A[HTTP Request] --> B[CalculationController]
    B --> C[CalculationService]
    C --> D[CalculationQueryService]
    D --> E[CalculationStrategyFactory]
    E --> F{Factory автовибір}
    F -->|LINEAR| G[LinearCalculationStrategy]
    F -->|RANGE| H[RangeCalculationStrategy]
    F -->|TIME_BASED| I[TimeBasedCalculationStrategy]
    F -->|FORMULA| J[FormulaCalculationStrategy]
    F -->|UNIVERSAL| K[UniversalCalculationStrategy]
    G --> L[LinearFormulaCalculator]
    H --> M[RangeFormulaCalculator]
    I --> N[TimeBasedFormulaCalculator]
    J --> O[FormulaExpressionCalculator]
    K --> O

### Key Components

1. **CalculationController** - Single HTTP endpoint for all calculation types
2. **CalculationStrategyFactory** - Auto-selects appropriate strategy based on formula type
3. **Strategy Pattern** - Different strategies for different calculation types
4. **Calculator Services** - Pure business logic for each calculation type

## 📋 Calculation Types & Routing

| Formula Type   | Strategy Class               | Calculator Class            | Use Cases                              |
| -------------- | ---------------------------- | --------------------------- | -------------------------------------- |
| **LINEAR**     | LinearCalculationStrategy    | LinearFormulaCalculator     | Character leveling, linear progression |
| **RANGE**      | RangeCalculationStrategy     | RangeFormulaCalculator      | Tier-based pricing, level brackets     |
| **TIME_BASED** | TimeBasedCalculationStrategy | TimeBasedFormulaCalculator  | Ranked boosts, time-dependent services |
| **FORMULA**    | FormulaCalculationStrategy   | FormulaExpressionCalculator | Complex expressions with variables     |
| **UNIVERSAL**  | UniversalCalculationStrategy | FormulaExpressionCalculator | Auto-generated default formulas        |

## 🔄 How Auto-Dispatch Works

### 1. Request Entry Point

- **Single Endpoint**: `POST /api/calculator/{formulaType}`
- **Universal Contract**: Same request/response structure for all types
- **Formula Type**: Determines which calculator to use

### 2. Factory Auto-Selection

- **CalculationStrategyFactory** analyzes the formula type
- **Strategy.supports()** method determines compatibility
- **Automatic routing** to correct calculator
- **No manual routing logic** needed

### 3. Strategy Delegation

- Each Strategy acts as a thin wrapper
- **Validates** formula type compatibility
- **Delegates** actual calculation to specialized Calculator
- **Standardizes** error handling and response format

### 4. Calculator Execution

- **Pure business logic** for specific calculation type
- **No HTTP concerns** - only mathematical operations
- **Entity ↔ DTO** conversion handled by Strategy
- **Testable** in isolation

## 🎮 Real Game Data Integration

### WOW DF Character Leveling

- **Type**: LINEAR
- **Pattern**: Per-level pricing ($1.00/level)
- **Data**: 1-60 level progression
- **Calculator**: LinearFormulaCalculator

### WOW DF Range Pricing

- **Type**: RANGE
- **Pattern**: Fixed price per level bracket
- **Data**: 01-05 ($4.00), 05-10 ($5.00), etc.
- **Calculator**: RangeFormulaCalculator

### Apex Ranked Boosts

- **Type**: TIME_BASED
- **Pattern**: Hours per division + complexity multiplier
- **Data**: Bronze IV (8h/div), Silver (10h/div)
- **Calculator**: TimeBasedFormulaCalculator

### Apex RP Calculations

- **Type**: FORMULA
- **Pattern**: Complex expressions with variables
- **Data**: perPoint × RPDiff calculations
- **Calculator**: FormulaExpressionCalculator

### Auto-Generated Scenarios

- **Type**: UNIVERSAL
- **Pattern**: Creates default formula from context
- **Data**: Any game/service combination
- **Calculator**: FormulaExpressionCalculator (delegation)

## ✅ Architecture Principles

### Single Responsibility Principle (SRP)

- **Controllers**: Only HTTP handling
- **Strategies**: Only formula-type routing
- **Calculators**: Only business logic
- **Factory**: Only strategy selection

### Open/Closed Principle (OCP)

- **Adding new calculator**: Create Strategy + Calculator
- **No changes** to existing code required
- **Factory automatically** discovers new strategies
- **Polymorphic behavior** through Strategy pattern

### Strategy Pattern Benefits

- **Runtime selection** of calculation algorithm
- **Easy testing** of individual calculators
- **Flexible extension** for new game types
- **Clean separation** of calculation logic

### Factory Pattern Benefits

- **Centralized routing** logic
- **Automatic discovery** of available strategies
- **Type-safe dispatch** with compile-time checking
- **Easy debugging** - single point of routing

## 🚀 Development Guidelines

### Adding New Calculation Type

1. **Create Calculator Service**

   - Implement business logic methods
   - Add validation methods
   - Focus only on mathematical operations

2. **Create Strategy Class**

   - Extend AbstractCalculationStrategy
   - Implement supports() method
   - Delegate to Calculator service
   - Handle Entity ↔ DTO conversion

3. **Register as Spring Bean**

   - Use @Component annotation
   - Factory auto-discovers via List<CalculationStrategy>
   - No manual registration needed

4. **Add Integration Tests**
   - Test with real game data
   - Verify edge cases and validation
   - Performance testing for large calculations

### Testing Strategy

- **Unit Tests**: Test each Calculator in isolation
- **Integration Tests**: Test Strategy + Calculator combination
- **End-to-End Tests**: Test full HTTP → Calculator flow
- **Real Data Tests**: Use parsed_data from actual games

## 📊 Benefits Summary

### For API Consumers

- **Single endpoint** for all calculation types
- **Consistent contract** regardless of internal changes
- **Automatic routing** - no need to know internal structure
- **Standardized responses** across all calculation types

### For Developers

- **Clear separation** of concerns
- **Easy to extend** with new calculation types
- **Testable components** in isolation
- **Maintainable architecture** with well-defined boundaries

### For Performance

- **Lazy loading** of strategies
- **No reflection** - compile-time type safety
- **Efficient routing** through supports() method
- **Cacheable results** at strategy level

## 🎯 Key Architecture Decisions

### Entity Refactoring Completed

- **Before**: Business logic in JPA entities (anti-pattern)
- **After**: Pure data entities + separate Calculator services
- **Benefit**: Clean separation between persistence and business logic

### Strategy Pattern Implementation

- **Before**: Large monolithic service with if/else chains
- **After**: Polymorphic strategy selection with Factory
- **Benefit**: Open/Closed principle compliance

### Universal API Design

- **Single point of entry** for all calculation types
- **Type-based automatic routing** to appropriate calculator
- **Consistent error handling** and response format
- **Extensible architecture** for future game types

---

## 📁 File Structure

```
strategy/
├── README.md                              # This file
├── CalculationStrategy.java               # Strategy interface
├── AbstractCalculationStrategy.java       # Common strategy logic
├── CalculationStrategyFactory.java        # Auto-dispatch factory
├── LinearCalculationStrategy.java         # Linear formula strategy
├── RangeCalculationStrategy.java          # Range formula strategy
├── TimeBasedCalculationStrategy.java      # Time-based formula strategy
├── FormulaCalculationStrategy.java        # Expression formula strategy
├── UniversalCalculationStrategy.java      # Universal formula strategy
├── LinearFormulaCalculator.java          # Linear business logic
├── RangeFormulaCalculator.java           # Range business logic
├── TimeBasedFormulaCalculator.java       # Time-based business logic
├── FormulaExpressionCalculator.java      # Expression business logic
└── UniversalCalculationStrategy.java     # Universal business logic
```

This architecture ensures **scalability**, **maintainability**, and **testability** while providing a **simple universal interface** for all game calculation needs.
