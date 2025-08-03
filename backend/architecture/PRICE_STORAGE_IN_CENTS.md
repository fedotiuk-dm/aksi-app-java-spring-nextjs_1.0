# Price Storage in Cents - Architecture Decision

## Decision

Store all monetary values as integers representing cents (kopiykas) instead of BigDecimal.

## Current State

Currently using:
- Database: `DECIMAL(10,2)` columns
- Java: `BigDecimal` type
- API: `BigDecimal` with JsonNullable wrapper

## Proposed Change

- Database: `INT` columns (storing kopiykas)
- Java: `Integer` or `Long` type  
- API: Keep BigDecimal for backward compatibility

## Implementation

### 1. Database Migration
```sql
-- Example migration
ALTER TABLE price_list_items 
  ADD COLUMN base_price_cents INT;
  
UPDATE price_list_items 
  SET base_price_cents = ROUND(base_price * 100);
  
-- After verification, drop old columns
```

### 2. Entity Changes
```java
@Entity
public class PriceListItem {
    @Column(name = "base_price_cents")
    private Integer basePriceCents;
    
    @Column(name = "price_black_cents")
    private Integer priceBlackCents;
    
    @Column(name = "price_color_cents") 
    private Integer priceColorCents;
}
```

### 3. Service Layer Conversion
```java
public class PriceUtils {
    public static Integer toKopiykas(BigDecimal hryvnias) {
        if (hryvnias == null) return null;
        return hryvnias.multiply(BigDecimal.valueOf(100))
                       .setScale(0, RoundingMode.HALF_UP)
                       .intValue();
    }
    
    public static BigDecimal toHryvnias(Integer kopiykas) {
        if (kopiykas == null) return null;
        return BigDecimal.valueOf(kopiykas)
                         .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
}
```

### 4. Mapper Updates
```java
@Mapper
public interface PriceListItemMapper {
    @Mapping(target = "basePrice", expression = "java(PriceUtils.toHryvnias(item.getBasePriceCents()))")
    PriceListItemInfo toPriceListItemInfo(PriceListItem item);
    
    @Mapping(target = "basePriceCents", expression = "java(PriceUtils.toKopiykas(request.getBasePrice()))")
    PriceListItem toEntity(CreatePriceListItemRequest request);
}
```

## Benefits

1. **Performance**: Integer arithmetic is faster
2. **Accuracy**: No floating-point precision issues
3. **Storage**: Less database storage (4 bytes vs 5 bytes)
4. **Simplicity**: Easier calculations and comparisons

## Risks

1. **Maximum Value**: INT max = 21,474,836.47 UAH (should be sufficient)
2. **Migration**: Need careful data migration
3. **Developer Awareness**: Team must remember the unit is kopiykas

## Alternatives Considered

1. **Keep BigDecimal**: Safe but slower
2. **Use Long**: Supports larger values but overkill for dry cleaning prices
3. **Store as String**: Bad for performance and calculations

## Decision

Recommend implementing price storage in kopiykas (cents) for better performance and accuracy.

## Migration Strategy

1. Add new columns with `_cents` suffix
2. Run parallel writes to both columns
3. Migrate existing data
4. Switch reads to new columns
5. Remove old columns after verification