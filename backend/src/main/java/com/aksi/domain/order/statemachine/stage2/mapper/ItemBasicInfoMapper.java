package com.aksi.domain.order.statemachine.stage2.mapper;

import java.util.Map;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.aksi.domain.order.statemachine.stage2.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;

/**
 * MapStruct маппер для підетапу 2.1 "Основна інформація про предмет".
 *
 * Відповідає за перетворення:
 * - ItemBasicInfoDTO в TempOrderItemDTO та навпаки
 * - Map параметрів в DTO
 * - DTO в параметри для валідації
 */
@Mapper(componentModel = "spring")
public interface ItemBasicInfoMapper {

        /**
     * Перетворює дані підетапу 2.1 у тимчасовий DTO предмета.
     */
    @Mapping(target = "category", source = "selectedCategory.name")
    @Mapping(target = "name", source = "selectedItem.name")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "unitOfMeasure", source = "unitOfMeasure")
    @Mapping(target = "unitPrice", source = "selectedItem.basePrice")
    @Mapping(target = "totalPrice", source = "basePrice")
    @Mapping(target = "description", source = "selectedItem.name")

    // Поля які будуть заповнені на наступних підетапах
    @Mapping(target = "material", ignore = true)
    @Mapping(target = "color", ignore = true)
    @Mapping(target = "fillerType", ignore = true)
    @Mapping(target = "fillerCompressed", ignore = true)
    @Mapping(target = "wearDegree", ignore = true)
    @Mapping(target = "stains", ignore = true)
    @Mapping(target = "otherStains", ignore = true)
    @Mapping(target = "defectsAndRisks", ignore = true)
    @Mapping(target = "defectsNotes", ignore = true)
    @Mapping(target = "noGuaranteeReason", ignore = true)
    @Mapping(target = "appliedModifiers", ignore = true)
    @Mapping(target = "priceCalculationDetails", ignore = true)
    @Mapping(target = "photoIds", ignore = true)
    @Mapping(target = "photoUrls", ignore = true)
    @Mapping(target = "hasPhotos", ignore = true)
    @Mapping(target = "specialInstructions", ignore = true)
    @Mapping(target = "defects", ignore = true)
    @Mapping(target = "isValid", ignore = true)
    @Mapping(target = "validationErrors", ignore = true)
    @Mapping(target = "wizardStep", constant = "1")
    TempOrderItemDTO toTempOrderItemDTO(ItemBasicInfoDTO basicInfo);

        /**
     * Оновлює ItemBasicInfoDTO даними з TempOrderItemDTO (для режиму редагування).
     * Примітка: selectedCategory та selectedItem потрібно заповнити окремо через сервіс,
     * оскільки TempOrderItemDTO містить тільки їх назви, а не повні об'єкти.
     */
    @Mapping(target = "selectedCategory", ignore = true) // Заповнюється через сервіс
    @Mapping(target = "selectedItem", ignore = true)    // Заповнюється через сервіс
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "unitOfMeasure", source = "unitOfMeasure")
    @Mapping(target = "basePrice", source = "totalPrice")

    // Список категорій та предметів потрібно заповнити окремо через сервіс
    @Mapping(target = "availableCategories", ignore = true)
    @Mapping(target = "availableItems", ignore = true)

    // UI стан
    @Mapping(target = "canProceedToNext", ignore = true)
    @Mapping(target = "validationMessage", ignore = true)
    @Mapping(target = "isLoading", constant = "false")
    @Mapping(target = "hasErrors", constant = "false")
    @Mapping(target = "errorMessage", ignore = true)
    ItemBasicInfoDTO fromTempOrderItemDTO(TempOrderItemDTO tempItem);

    /**
     * Створює Map для валідації з даних ItemBasicInfoDTO.
     */
    default Map<String, Object> toValidationMap(ItemBasicInfoDTO basicInfo) {
        Map<String, Object> validationData = new java.util.HashMap<>();

        if (basicInfo.getSelectedCategory() != null) {
            validationData.put("categoryId", basicInfo.getSelectedCategory().getId().toString());
        }

        if (basicInfo.getSelectedItem() != null) {
            validationData.put("itemId", basicInfo.getSelectedItem().getId().toString());
        }

        if (basicInfo.getQuantity() != null) {
            validationData.put("quantity", basicInfo.getQuantity());
        }

        return validationData;
    }

    /**
     * Створює базовий ItemBasicInfoDTO з переданих параметрів.
     */
    default ItemBasicInfoDTO createFromParameters(ServiceCategoryDTO category,
                                                  PriceListItemDTO item,
                                                  Integer quantity) {
        return ItemBasicInfoDTO.builder()
            .selectedCategory(category)
            .selectedItem(item)
            .quantity(quantity != null ? quantity : 1)
            .unitOfMeasure(item != null ? item.getUnitOfMeasure() : null)
            .basePrice(item != null && quantity != null ?
                      item.getBasePrice().multiply(java.math.BigDecimal.valueOf(quantity)) :
                      java.math.BigDecimal.ZERO)
            .isLoading(false)
            .hasErrors(false)
            .build();
    }

    /**
     * Створює порожній ItemBasicInfoDTO для ініціалізації.
     */
    default ItemBasicInfoDTO createEmpty() {
        return ItemBasicInfoDTO.builder()
            .quantity(1)
            .basePrice(java.math.BigDecimal.ZERO)
            .isLoading(false)
            .hasErrors(false)
            .build();
    }
}
