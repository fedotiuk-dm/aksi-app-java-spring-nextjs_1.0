# 🎮 Game Boosting Calculator Setup Instructions

## 📋 Overview

This document provides step-by-step instructions for setting up the game boosting calculator with proper data structure. The calculator requires specific entities to be created in the correct order for price calculations to work properly.

## 🏗️ Data Structure Requirements

### 1. Game Entity

**Purpose:** Represents the game for which boosting services are provided.

**Required Fields:**

- `code`: Unique game identifier (e.g., "LOL", "WOW", "COD")
- `name`: Human-readable game name
- `category`: Game category for organization
- `is_active`: Must be `true` for active games

**Example:**

```json
{
  "code": "LOL",
  "name": "League of Legends",
  "category": "MOBA",
  "is_active": true
}
```

### 2. Difficulty Level Entity

**Purpose:** Defines skill levels/ranks within the game.

**Required Fields:**

- `game_id`: Reference to the game
- `code`: Unique level code within the game (e.g., "BRONZE", "CHALLENGER")
- `name`: Human-readable level name
- `level_value`: Numeric value for level comparison
- `is_active`: Must be `true` for active levels

**Example:**

```json
{
  "game_id": "uuid-of-lol-game",
  "code": "CHALLENGER",
  "name": "Challenger",
  "level_value": 100,
  "is_active": true
}
```

### 3. Service Type Entity

**Purpose:** Defines the type of boosting service offered.

**Required Fields:**

- `game_id`: Reference to the game
- `code`: Service type identifier (e.g., "RANK_BOOST", "DIVISION_BOOST")
- `name`: Human-readable service name
- `is_active`: Must be `true` for active services

**Example:**

```json
{
  "game_id": "uuid-of-lol-game",
  "code": "RANK_BOOST",
  "name": "Rank Boost",
  "is_active": true
}
```

### 4. Price Configuration Entity

**Purpose:** Defines pricing rules and formulas for specific game/level/service combinations.

**Required Fields:**

- `game_id`: Reference to the game
- `difficulty_level_id`: Reference to difficulty level
- `service_type_id`: Reference to service type
- `base_price`: Base price in cents (e.g., 1000 = $10.00)
- `price_per_level`: Price per level in cents
- `calculation_formula`: JSON formula object
- `calculation_type`: Formula type (e.g., "LINEAR")
- `currency`: Currency code (default: "USD")
- `is_active`: Must be `true`

**Example:**

```json
{
  "game_id": "uuid-of-lol-game",
  "difficulty_level_id": "uuid-of-challenger-level",
  "service_type_id": "uuid-of-rank-boost-service",
  "base_price": 1000,
  "price_per_level": 1000,
  "calculation_formula": {
    "type": "LINEAR",
    "pricePerLevel": 1000
  },
  "calculation_type": "LINEAR",
  "currency": "USD",
  "is_active": true
}
```

### 5. Game Modifier Entity

**Purpose:** Defines price modifiers that can be applied to services.

**Required Fields:**

- `code`: Modifier identifier (e.g., "STREAMING", "PRIORITY")
- `name`: Human-readable modifier name
- `type`: Modifier type affecting level dependency
- `operation`: Math operation ("ADD", "MULTIPLY", etc.)
- `value`: Modifier value in cents
- `game_code`: Game this modifier applies to
- `is_active`: Must be `true`

**Important Notes:**

- `type: "SPELLS"` modifiers are **NOT level-dependent** (one-time fees)
- `type: "EXTRA"` modifiers **ARE level-dependent** (scale with level difference)

**Example:**

```json
{
  "code": "STREAMING",
  "name": "Streaming Service",
  "type": "SPELLS",
  "operation": "ADD",
  "value": 50000,
  "game_code": "LOL",
  "is_active": true
}
```

## 🔄 Creation Order

**CRITICAL:** Entities must be created in this exact order:

1. **Game** ← First
2. **Difficulty Level** ← Requires Game
3. **Service Type** ← Requires Game
4. **Price Configuration** ← Requires Game + Difficulty Level + Service Type
5. **Game Modifier** ← Can be created independently

## 🎯 Calculation Flow Example

### Input Request:

```json
{
  "context": {
    "gameCode": "LOL",
    "difficultyCode": "CHALLENGER",
    "serviceTypeCode": "RANK_BOOST",
    "startLevel": 50,
    "targetLevel": 60,
    "modifiers": ["STREAMING"]
  },
  "formula": {
    "type": "LINEAR",
    "pricePerLevel": 1000
  }
}
```

### Calculation Steps:

1. **Find entities by codes:**

   - Game: "LOL" → Game entity
   - Difficulty Level: "CHALLENGER" for LOL → Difficulty Level entity
   - Service Type: "RANK_BOOST" for LOL → Service Type entity

2. **Base price calculation:**

   - Level difference: 60 - 50 = 10 levels
   - Price per level: $10.00 (1000 cents)
   - Base price: 10 × 1000 = 10,000 cents ($100.00)

3. **Apply modifiers:**
   - Find modifier: "STREAMING" for LOL
   - Operation: ADD
   - Value: 50,000 cents ($500.00)
   - Final price: 10,000 + 50,000 = 60,000 cents ($600.00)

## 🧪 Testing the Setup

### 1. Create Test Data:

```bash
# Use the integration test or API calls to create:
# 1. Game (LOL)
# 2. Difficulty Level (CHALLENGER)
# 3. Service Type (RANK_BOOST)
# 4. Price Configuration (Linear formula)
# 5. Game Modifier (STREAMING)
```

### 2. Test Calculation:

```bash
# API call to test calculator:
POST /api/games/calculator/formulas/LINEAR/calculate
{
  "context": {
    "gameCode": "LOL",
    "difficultyCode": "CHALLENGER",
    "serviceTypeCode": "RANK_BOOST",
    "startLevel": 50,
    "targetLevel": 60,
    "modifiers": ["STREAMING"]
  },
  "formula": {
    "type": "LINEAR",
    "pricePerLevel": 1000
  }
}

# Expected response:
{
  "finalPrice": 60000,
  "breakdown": {
    "baseCalculation": 10000,
    "totalAdjustment": 50000,
    "modifierAdjustments": [
      {
        "modifierCode": "STREAMING",
        "adjustment": 50000,
        "description": "Streaming Service"
      }
    ]
  }
}
```

## ⚠️ Critical Issues to Avoid

### 1. Code Mismatches:

- **Frontend sends:** `serviceTypeCode: "BOOSTING"`
- **Database has:** `serviceTypeCode: "RANK_BOOST"`
- **Result:** "Service type not found" error

### 2. Missing Price Configuration:

- **Problem:** No price config for specific game/level/service combo
- **Result:** Formula not found error

### 3. Wrong Modifier Types:

- **SPELLS type:** One-time fees (streaming, priority)
- **EXTRA type:** Level-dependent fees (additional services)
- **Wrong type:** Incorrect price calculations

### 4. Inactive Entities:

- All entities must have `is_active: true`
- Inactive entities are not found during calculations

## 🔧 Troubleshooting

### Common Errors:

1. **"Service type not found: X for game: Y"**

   - Check service type code matches exactly
   - Ensure service type exists for the specific game
   - Verify service type is active

2. **"Formula is required when additional parameters are insufficient"**

   - Missing price configuration
   - Invalid formula in price configuration
   - Wrong calculation type

3. **Wrong final price**
   - Check modifier values (in cents)
   - Verify modifier operations (ADD/MULTIPLY)
   - Confirm modifier types (SPELLS vs EXTRA)

## 📚 API Reference

### Calculator Endpoint:

```
POST /api/games/calculator/formulas/{formulaType}/calculate
```

### Required Headers:

```
Content-Type: application/json
```

### Data Creation Endpoints:

- `POST /api/games` - Create game
- `POST /api/games/{gameId}/difficulty-levels` - Create difficulty level
- `POST /api/games/{gameId}/service-types` - Create service type
- `POST /api/games/price-configurations` - Create price configuration
- `POST /api/games/modifiers` - Create game modifier

## ✅ Success Checklist

- [ ] Game created with correct code
- [ ] Difficulty level created for the game
- [ ] Service type created for the game
- [ ] Price configuration created with proper formula
- [ ] Game modifier created with correct values
- [ ] Calculator API returns expected price
- [ ] All entities are active (is_active: true)
- [ ] Frontend uses correct entity codes

**Following this guide ensures the calculator works correctly and provides accurate price calculations! 🎯**
