# 🎮 Game Boosting Calculator

Clean architecture implementation for game boosting price calculation following the order-wizard pattern.

## 📋 Features

- **Game Selection**: Search and select games from the catalog
- **Booster Selection**: Choose available boosters for selected game
- **Price Calculator**: Configure modifiers and calculate final price
- **Order Summary**: Review order details and place order

## 🏗️ Architecture

### Clean Architecture Pattern

```
features/game-boosting-calculator/
├── GameBoostingCalculator.tsx     # Main container component
├── store/
│   └── game-boosting-store.ts     # Zustand state management
├── components/
│   ├── games/                     # Game selection components
│   ├── boosters/                  # Booster selection components
│   ├── calculator/                # Price calculation components
│   └── summary/                   # Order summary components
├── hooks/                         # Business logic hooks
├── utils/                         # Helper functions
└── index.ts                       # Barrel exports
```

### Component Structure

```
GameBoostingCalculator (Main Container)
├── GameSection
│   ├── GameSearch (Orval API integration)
│   └── Selected game display
├── BoosterSection
│   ├── BoosterSelector (Orval API integration)
│   └── Selected booster display
├── CalculatorSection
│   ├── Price input
│   ├── Modifiers selection
│   └── Price calculation (Orval API)
└── SummarySection
    ├── Order details review
    └── Order placement
```

## 🔧 Technical Implementation

### State Management

- **Zustand Store**: Centralized UI state management
- **React Query**: Server state management via Orval
- **Separation of Concerns**: UI state vs API state

### API Integration

- **Orval Generated**: Type-safe API clients
- **Direct API Calls**: No additional abstractions
- **Error Handling**: Centralized error states

### UI Patterns

- **Atomic Design**: Shared UI components
- **Material-UI**: Consistent design system
- **Responsive Design**: Mobile-first approach

## 🚀 Usage

```tsx
import { GameBoostingCalculator } from '@/features/game-boosting-calculator';

// Use in your app
<GameBoostingCalculator />;
```

### Individual Components

```tsx
import {
  GameSection,
  BoosterSection,
  CalculatorSection,
  SummarySection,
  useGameOperations,
  useBoosterOperations,
  useCalculatorOperations,
} from '@/features/game-boosting-calculator';
```

## 🔄 Data Flow

1. **Game Selection**: User searches and selects a game
2. **Booster Selection**: Available boosters for selected game are loaded
3. **Price Configuration**: User sets base price and selects modifiers
4. **Calculation**: Price is calculated using game API
5. **Order Summary**: Final details are displayed for confirmation

## 📊 API Endpoints Used

- `GET /api/game-services/games` - List games
- `GET /api/game-services/boosters` - List boosters
- `POST /api/game-services/calculator` - Calculate price
- `GET /api/game-services/games/{id}` - Get game details
- `GET /api/game-services/boosters/{id}` - Get booster details

## 🎯 Business Logic

### Price Calculation Flow

```typescript
// 1. User selects game and booster
store.setSelectedGame(gameId, game);
store.setSelectedBooster(boosterId, booster);

// 2. User configures price and modifiers
store.setBasePrice(price);
store.setSelectedModifiers(modifierIds);

// 3. Calculate final price
const result = await calculateMutation.mutateAsync({
  gameId,
  boosterId,
  basePrice: price,
  modifierIds,
});
```

### Validation Rules

- Game must be selected before booster selection
- Booster must be selected before price calculation
- Base price must be greater than 0
- At least one modifier can be selected (optional)

## 🧪 Testing Strategy

### Unit Tests

- Component rendering tests
- Hook logic tests
- Store state management tests

### Integration Tests

- API integration tests
- Form submission tests
- Navigation flow tests

### E2E Tests

- Complete user journey tests
- Error handling tests
- Performance tests

## 🔮 Future Enhancements

- [ ] Real-time price updates
- [ ] Bulk order calculations
- [ ] Price comparison with other boosters
- [ ] Order history integration
- [ ] Payment integration
- [ ] Order tracking

## 📝 Development Notes

### Orval Configuration

Game API is configured in `orval.config.ts` under the `game` domain.

### State Persistence

Consider implementing state persistence for better UX (localStorage/sessionStorage).

### Error Boundaries

Add error boundaries for better error handling in production.

### Performance Optimization

- Implement proper memoization for expensive calculations
- Add loading skeletons for better UX
- Optimize re-renders with proper dependency arrays
