package com.aksi.domain.order.statemachine.stage2.validator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Validator для етапу 2.0 - головний екран менеджера предметів.
 *
 * Відповідає за валідацію:
 * - Наявності предметів у замовленні
 * - Коректності даних предметів
 * - Можливості переходу до наступного етапу
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ItemManagerValidator {

    private final OrderItemRepository orderItemRepository;

    /**
     * Результат валідації.
     */
    public static class ValidationResult {
        private final boolean valid;
        private final List<String> errors;

        public ValidationResult(boolean valid, List<String> errors) {
            this.valid = valid;
            this.errors = errors != null ? errors : new ArrayList<>();
        }

        public boolean isValid() {
            return valid;
        }

        public List<String> getErrors() {
            return errors;
        }

        public String getErrorMessage() {
            return errors.isEmpty() ? null : String.join("; ", errors);
        }

        public static ValidationResult success() {
            return new ValidationResult(true, new ArrayList<>());
        }

        public static ValidationResult failure(String error) {
            List<String> errors = new ArrayList<>();
            errors.add(error);
            return new ValidationResult(false, errors);
        }

        public static ValidationResult failure(List<String> errors) {
            return new ValidationResult(false, errors);
        }
    }

    /**
     * Валідує можливість переходу до наступного етапу.
     */
    public ValidationResult validateCanProceedToNextStage(String orderId) {
        log.debug("Валідація можливості переходу до наступного етапу для замовлення: {}", orderId);

        if (orderId == null || orderId.trim().isEmpty()) {
            return ValidationResult.failure("Не вказано ідентифікатор замовлення");
        }

        try {
            UUID orderUuid = UUID.fromString(orderId);
            long itemCount = orderItemRepository.countByOrderId(orderUuid);

            if (itemCount == 0) {
                return ValidationResult.failure("Додайте хоча б один предмет до замовлення");
            }

            log.debug("Валідація успішна: замовлення {} містить {} предметів", orderId, itemCount);
            return ValidationResult.success();

        } catch (IllegalArgumentException e) {
            log.error("Некоректний формат ідентифікатора замовлення: {}", orderId);
            return ValidationResult.failure("Некоректний формат ідентифікатора замовлення");
        } catch (Exception e) {
            log.error("Помилка при валідації замовлення: {}", orderId, e);
            return ValidationResult.failure("Помилка при перевірці замовлення");
        }
    }

    /**
     * Валідує існування предмета для видалення.
     */
    public ValidationResult validateItemForDeletion(String itemId) {
        return validateItemExists(itemId, "видалення");
    }

    /**
     * Валідує існування предмета для редагування.
     */
    public ValidationResult validateItemForEdit(String itemId) {
        return validateItemExists(itemId, "редагування");
    }

    /**
     * Приватний метод для валідації існування предмета.
     */
    private ValidationResult validateItemExists(String itemId, String operation) {
        log.debug("Валідація можливості {} предмета: {}", operation, itemId);

        if (itemId == null || itemId.trim().isEmpty()) {
            return ValidationResult.failure("Не вказано ідентифікатор предмета");
        }

        try {
            UUID itemUuid = UUID.fromString(itemId);

            if (!orderItemRepository.existsById(itemUuid)) {
                return ValidationResult.failure("Предмет не знайдено");
            }

            log.debug("Валідація успішна: предмет {} можна {}", itemId, operation);
            return ValidationResult.success();

        } catch (IllegalArgumentException e) {
            log.error("Некоректний формат ідентифікатора предмета: {}", itemId);
            return ValidationResult.failure("Некоректний формат ідентифікатора предмета");
        } catch (Exception e) {
            log.error("Помилка при валідації предмета для {}: {}", operation, itemId, e);
            return ValidationResult.failure("Помилка при перевірці предмета");
        }
    }

    /**
     * Валідує дані тимчасового предмета.
     */
    public ValidationResult validateTempItem(TempOrderItemDTO item) {
        log.debug("Валідація тимчасового предмета");

        if (item == null) {
            return ValidationResult.failure("Дані предмета відсутні");
        }

        List<String> errors = new ArrayList<>();

        // Базова валідація
        if (item.getName() == null || item.getName().trim().isEmpty()) {
            errors.add("Не вказано найменування предмета");
        }

        if (item.getCategory() == null || item.getCategory().trim().isEmpty()) {
            errors.add("Не вказано категорію предмета");
        }

        if (item.getQuantity() == null || item.getQuantity() <= 0) {
            errors.add("Некоректна кількість предмета");
        }

        if (item.getUnitPrice() == null || item.getUnitPrice().compareTo(java.math.BigDecimal.ZERO) < 0) {
            errors.add("Некоректна ціна предмета");
        }

        if (errors.isEmpty()) {
            log.debug("Валідація тимчасового предмета успішна");
            return ValidationResult.success();
        } else {
            log.debug("Валідація тимчасового предмета неуспішна: {}", errors);
            return ValidationResult.failure(errors);
        }
    }

    /**
     * Валідує дані DTO головного екрану.
     */
    public ValidationResult validateItemManagerDto(ItemManagerDTO dto) {
        log.debug("Валідація DTO головного екрану менеджера предметів");

        if (dto == null) {
            return ValidationResult.failure("DTO головного екрану відсутнє");
        }

        List<String> errors = new ArrayList<>();

        if (dto.getTotalPrice() == null || dto.getTotalPrice().compareTo(java.math.BigDecimal.ZERO) < 0) {
            errors.add("Некоректна загальна вартість");
        }

        if (dto.getTotalItemsCount() == null || dto.getTotalItemsCount() < 0) {
            errors.add("Некоректна кількість предметів");
        }

        // Перевіряємо узgodженість між кількістю предметів та списком
        if (dto.getItems() != null && dto.getTotalItemsCount() != null) {
            if (dto.getItems().size() != dto.getTotalItemsCount()) {
                errors.add("Невідповідність між розміром списку предметів та загальною кількістю");
            }
        }

        if (errors.isEmpty()) {
            log.debug("Валідація DTO головного екрану успішна");
            return ValidationResult.success();
        } else {
            log.debug("Валідація DTO головного екрану неуспішна: {}", errors);
            return ValidationResult.failure(errors);
        }
    }
}
