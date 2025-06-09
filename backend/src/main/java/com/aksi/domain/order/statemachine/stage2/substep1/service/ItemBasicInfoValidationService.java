package com.aksi.domain.order.statemachine.stage2.substep1.service;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.validator.ItemBasicInfoValidator;
import com.aksi.domain.order.statemachine.stage2.substep1.validator.ValidationResult;

/**
 * Сервіс валідації для підетапу 2.1 - консолідує всі валідатори
 */
@Service
public class ItemBasicInfoValidationService {

    private final ItemBasicInfoValidator itemBasicInfoValidator;

    public ItemBasicInfoValidationService(ItemBasicInfoValidator itemBasicInfoValidator) {
        this.itemBasicInfoValidator = itemBasicInfoValidator;
    }

    /**
     * Валідує основну інформацію про предмет
     */
    public ValidationResult validateBasicInfo(ItemBasicInfoDTO itemBasicInfo) {
        return itemBasicInfoValidator.validate(itemBasicInfo);
    }

    /**
     * Швидка перевірка чи всі обов'язкові поля заповнені
     */
    public boolean isBasicInfoComplete(ItemBasicInfoDTO itemBasicInfo) {
        if (itemBasicInfo == null) {
            return false;
        }

        return itemBasicInfo.getServiceCategory() != null
                && itemBasicInfo.getPriceListItem() != null
                && itemBasicInfo.getQuantity() != null;
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку
     */
    public boolean canProceedToNextStep(ItemBasicInfoDTO itemBasicInfo) {
        if (!isBasicInfoComplete(itemBasicInfo)) {
            return false;
        }

        ValidationResult result = validateBasicInfo(itemBasicInfo);
        return result.isValid();
    }

    // ========== Методи для Guards ==========

    /**
     * Перевіряє чи обрана категорія послуги
     */
    public boolean isServiceCategorySelected(ItemBasicInfoDTO itemBasicInfo) {
        return itemBasicInfo != null && itemBasicInfo.getServiceCategory() != null;
    }

    /**
     * Перевіряє чи обране найменування предмета
     */
    public boolean isItemNameSelected(ItemBasicInfoDTO itemBasicInfo) {
        return itemBasicInfo != null &&
               itemBasicInfo.getServiceCategory() != null &&
               itemBasicInfo.getPriceListItem() != null;
    }

    /**
     * Перевіряє чи введена кількість
     */
    public boolean isQuantityEntered(ItemBasicInfoDTO itemBasicInfo) {
        return itemBasicInfo != null &&
               itemBasicInfo.getQuantity() != null &&
               itemBasicInfo.getQuantity().compareTo(java.math.BigDecimal.ZERO) > 0;
    }
}
