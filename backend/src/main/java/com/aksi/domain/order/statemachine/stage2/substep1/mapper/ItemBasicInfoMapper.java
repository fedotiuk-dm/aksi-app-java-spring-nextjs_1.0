package com.aksi.domain.order.statemachine.stage2.substep1.mapper;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Mapper для перетворення даних основної інформації про предмет
 */
@Component
public class ItemBasicInfoMapper {

    /**
     * Створює новий ItemBasicInfoDTO з мінімальними даними
     */
    public ItemBasicInfoDTO createEmpty() {
        return ItemBasicInfoDTO.builder()
                .itemId(UUID.randomUUID())
                .isComplete(false)
                .isValid(false)
                .build();
    }

    /**
     * Створює ItemBasicInfoDTO з вибраною категорією
     */
    public ItemBasicInfoDTO withServiceCategory(ItemBasicInfoDTO current, ServiceCategoryDTO serviceCategory) {
        return current.toBuilder()
                .serviceCategory(serviceCategory)
                .priceListItem(null) // Скидаємо вибраний предмет при зміні категорії
                .unitOfMeasure(null)
                .quantity(null)
                .totalBasePrice(null)
                .isComplete(false)
                .isValid(false)
                .build();
    }

    /**
     * Створює ItemBasicInfoDTO з вибраним предметом з прайс-листа
     */
    public ItemBasicInfoDTO withPriceListItem(ItemBasicInfoDTO current, PriceListItemDTO priceListItem) {
        return current.toBuilder()
                .priceListItem(priceListItem)
                .unitOfMeasure(priceListItem.getUnitOfMeasure())
                .quantity(null) // Скидаємо кількість при зміні предмета
                .totalBasePrice(null)
                .isComplete(false)
                .isValid(false)
                .build();
    }

    /**
     * Створює ItemBasicInfoDTO з введеною кількістю
     */
    public ItemBasicInfoDTO withQuantity(ItemBasicInfoDTO current, BigDecimal quantity) {
        BigDecimal totalBasePrice = null;

        // Розраховуємо загальну вартість якщо є всі необхідні дані
        if (current.getPriceListItem() != null && quantity != null) {
            BigDecimal basePrice = current.getPriceListItem().getBasePrice();
            if (basePrice != null) {
                totalBasePrice = basePrice.multiply(quantity);
            }
        }

        boolean isComplete = isItemComplete(current.getServiceCategory(), current.getPriceListItem(), quantity);

        return current.toBuilder()
                .quantity(quantity)
                .totalBasePrice(totalBasePrice)
                .isComplete(isComplete)
                .isValid(false) // Валідація потрібна після заповнення
                .build();
    }

    /**
     * Позначає DTO як валідний
     */
    public ItemBasicInfoDTO markAsValid(ItemBasicInfoDTO current) {
        return current.toBuilder()
                .isValid(true)
                .build();
    }

    /**
     * Позначає DTO як невалідний
     */
    public ItemBasicInfoDTO markAsInvalid(ItemBasicInfoDTO current) {
        return current.toBuilder()
                .isValid(false)
                .build();
    }

    /**
     * Перевіряє чи всі обов'язкові поля заповнені
     */
    private boolean isItemComplete(ServiceCategoryDTO serviceCategory,
                                  PriceListItemDTO priceListItem,
                                  BigDecimal quantity) {
        return serviceCategory != null
                && priceListItem != null
                && quantity != null
                && quantity.compareTo(BigDecimal.ZERO) > 0;
    }
}
