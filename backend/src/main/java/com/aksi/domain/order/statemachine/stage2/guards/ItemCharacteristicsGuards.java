package com.aksi.domain.order.statemachine.stage2.guards;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.service.ItemCharacteristicsStepService;
import com.aksi.domain.order.statemachine.stage2.validator.ItemCharacteristicsValidator;

/**
 * Guards для підетапу 2.2 "Характеристики предмета".
 *
 * Відповідає за перевірку умов переходів між станами для підетапу характеристик предмета.
 */
@Component
public class ItemCharacteristicsGuards {

    private static final Logger logger = LoggerFactory.getLogger(ItemCharacteristicsGuards.class);
    private static final String WIZARD_ID_KEY = "wizardId";
    private static final String ITEM_CHARACTERISTICS_KEY = "itemCharacteristics";
    private static final String CHARACTERISTICS_VALID_KEY = "characteristicsValid";

    private final ItemCharacteristicsStepService characteristicsService;
    private final ItemCharacteristicsValidator validator;

    public ItemCharacteristicsGuards(ItemCharacteristicsStepService characteristicsService,
                                   ItemCharacteristicsValidator validator) {
        this.characteristicsService = characteristicsService;
        this.validator = validator;
    }

    /**
     * Перевіряє, чи можна перейти до підетапу 2.2.
     * Вимагає наявності базової інформації про предмет з підетапу 2.1.
     */
    public Guard<OrderState, OrderEvent> canEnterCharacteristicsStep() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.debug("Перевірка можливості входу в підетап характеристик для wizard: {}", wizardId);

            try {
                                // Перевіряємо наявність базових даних предмета з попереднього кроку
                Object tempItemObj = context.getExtendedState().getVariables().get("tempOrderItem");
                TempOrderItemDTO tempItem = null;

                if (tempItemObj instanceof TempOrderItemDTO) {
                    tempItem = (TempOrderItemDTO) tempItemObj;
                }

                boolean canEnter = tempItem != null && tempItem.hasBasicInfo();

                if (canEnter) {
                    logger.debug("Дозволено вхід в підетап характеристик для wizard: {} - знайдено базову інформацію", wizardId);
                } else {
                    if (tempItem == null) {
                        logger.warn("Заборонено вхід в підетап характеристик - немає тимчасового предмета для wizard: {}", wizardId);
                    } else {
                        logger.warn("Заборонено вхід в підетап характеристик - незаповнена базова інформація для wizard: {}", wizardId);
                    }
                }

                return canEnter;

            } catch (Exception e) {
                logger.error("Помилка перевірки входу в підетап характеристик для wizard {}: {}",
                        wizardId, e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє, чи можна перейти до наступного підетапу.
     * Вимагає заповнення всіх обов'язкових характеристик.
     */
    public Guard<OrderState, OrderEvent> canProceedFromCharacteristics() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.debug("Перевірка можливості переходу з підетапу характеристик для wizard: {}", wizardId);

            try {
                // Перевіряємо через сервіс
                boolean canProceed = characteristicsService.canProceedToNextStep(wizardId);

                // Додатково перевіряємо дані в контексті
                ItemCharacteristicsDTO dto = (ItemCharacteristicsDTO) context.getExtendedState()
                        .getVariables().get(ITEM_CHARACTERISTICS_KEY);

                if (dto != null) {
                    boolean contextValid = validator.isBasicValidationPassed(dto);
                    canProceed = canProceed && contextValid;
                }

                if (canProceed) {
                    logger.debug("Дозволено перехід з підетапу характеристик для wizard: {}", wizardId);
                } else {
                    logger.warn("Заборонено перехід з підетапу характеристик - незаповнені обов'язкові поля для wizard: {}", wizardId);
                }

                return canProceed;

            } catch (Exception e) {
                logger.error("Помилка перевірки переходу з підетапу характеристик для wizard {}: {}",
                        wizardId, e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє, чи матеріал підходить для вибраної категорії.
     */
    public Guard<OrderState, OrderEvent> isMaterialValidForCategory() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            String selectedMaterial = (String) context.getExtendedState().getVariables().get("selectedMaterial");

            logger.debug("Перевірка відповідності матеріалу категорії для wizard: {}", wizardId);

            try {
                // Отримуємо категорію з контексту або попереднього кроку
                String category = getCategoryFromContext(context, wizardId);

                if (category == null || selectedMaterial == null) {
                    logger.warn("Не вдалося отримати категорію або матеріал для валідації в wizard: {}", wizardId);
                    return false;
                }

                boolean isValid = validator.isMaterialValidForCategory(selectedMaterial, category);

                if (isValid) {
                    logger.debug("Матеріал {} підходить для категорії {} в wizard: {}",
                            selectedMaterial, category, wizardId);
                } else {
                    logger.warn("Матеріал {} не підходить для категорії {} в wizard: {}",
                            selectedMaterial, category, wizardId);
                }

                return isValid;

            } catch (Exception e) {
                logger.error("Помилка перевірки відповідності матеріалу категорії для wizard {}: {}",
                        wizardId, e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє, чи заповнені основні характеристики предмета.
     */
    public Guard<OrderState, OrderEvent> areBasicCharacteristicsFilled() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.debug("Перевірка заповнення основних характеристик для wizard: {}", wizardId);

            try {
                ItemCharacteristicsDTO dto = (ItemCharacteristicsDTO) context.getExtendedState()
                        .getVariables().get(ITEM_CHARACTERISTICS_KEY);

                if (dto == null) {
                    logger.warn("Дані характеристик не знайдено в контексті для wizard: {}", wizardId);
                    return false;
                }

                boolean isFilled = dto.getSelectedMaterial() != null &&
                                  !dto.getSelectedMaterial().trim().isEmpty() &&
                                  dto.getFinalColor() != null &&
                                  !dto.getFinalColor().trim().isEmpty() &&
                                  dto.getSelectedWearDegree() != null &&
                                  !dto.getSelectedWearDegree().trim().isEmpty();

                if (isFilled) {
                    logger.debug("Основні характеристики заповнено для wizard: {}", wizardId);
                } else {
                    logger.debug("Основні характеристики не заповнено повністю для wizard: {}", wizardId);
                }

                return isFilled;

            } catch (Exception e) {
                logger.error("Помилка перевірки заповнення характеристик для wizard {}: {}",
                        wizardId, e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє, чи потрібно показувати поля наповнювача для поточної категорії.
     */
    public Guard<OrderState, OrderEvent> shouldShowFillerFields() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.debug("Перевірка необхідності показу полів наповнювача для wizard: {}", wizardId);

            try {
                String category = getCategoryFromContext(context, wizardId);

                if (category == null) {
                    logger.debug("Категорія не знайдена, не показуємо поля наповнювача для wizard: {}", wizardId);
                    return false;
                }

                String lowerCategory = category.toLowerCase();
                boolean shouldShow = lowerCategory.contains("куртка") || lowerCategory.contains("пальто") ||
                                    lowerCategory.contains("пуховик") || lowerCategory.contains("одіял") ||
                                    lowerCategory.contains("подушк") || lowerCategory.contains("матрац") ||
                                    lowerCategory.contains("плед") || lowerCategory.contains("ковдра");

                if (shouldShow) {
                    logger.debug("Показуємо поля наповнювача для категорії {} в wizard: {}", category, wizardId);
                } else {
                    logger.debug("Не показуємо поля наповнювача для категорії {} в wizard: {}", category, wizardId);
                }

                return shouldShow;

            } catch (Exception e) {
                logger.error("Помилка перевірки необхідності полів наповнювача для wizard {}: {}",
                        wizardId, e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє, чи дані характеристик збережені та валідні.
     */
    public Guard<OrderState, OrderEvent> areCharacteristicsSaved() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.debug("Перевірка збереження характеристик для wizard: {}", wizardId);

            try {
                // Перевіряємо, чи є позначка про успішне збереження в контексті
                Boolean characteristicsValid = (Boolean) context.getExtendedState()
                        .getVariables().get(CHARACTERISTICS_VALID_KEY);

                if (characteristicsValid != null && characteristicsValid) {
                    logger.debug("Характеристики збережено та валідні для wizard: {}", wizardId);
                    return true;
                }

                // Додатково перевіряємо через сервіс
                boolean saved = characteristicsService.canProceedToNextStep(wizardId);

                if (saved) {
                    logger.debug("Характеристики збережено (перевірено через сервіс) для wizard: {}", wizardId);
                } else {
                    logger.debug("Характеристики не збережено або невалідні для wizard: {}", wizardId);
                }

                return saved;

            } catch (Exception e) {
                logger.error("Помилка перевірки збереження характеристик для wizard {}: {}",
                        wizardId, e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Guard для перевірки можливості переходу до наступного кроку.
     * Перевіряє, чи всі обов'язкові характеристики заповнені та валідні.
     */
    public Guard<OrderState, OrderEvent> canProceedGuard() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.debug("Перевірка можливості переходу для wizard: {}", wizardId);

            try {
                // Перевіряємо валідність через сервіс
                boolean canProceed = characteristicsService.canProceedToNextStep(wizardId);

                logger.debug("Результат перевірки для wizard {}: {}", wizardId,
                        canProceed ? "ДОЗВОЛЕНО" : "ЗАБОРОНЕНО");

                return canProceed;

            } catch (Exception e) {
                logger.error("Помилка перевірки переходу для wizard {}: {}", wizardId, e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Guard для перевірки відповідності матеріалу обраній категорії.
     */
    public Guard<OrderState, OrderEvent> materialCategoryGuard() {
        return context -> {
            try {
                ItemCharacteristicsDTO dto = (ItemCharacteristicsDTO) context.getExtendedState()
                        .getVariables().get(ITEM_CHARACTERISTICS_KEY);

                if (dto == null) {
                    return false;
                }

                String material = dto.getSelectedMaterial();
                String categoryCode = dto.getCategoryCode();

                if (material == null || categoryCode == null) {
                    return false;
                }

                return validator.isMaterialValidForCategory(categoryCode, material);

            } catch (Exception e) {
                logger.error("Помилка перевірки матеріалу для категорії: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Guard для базової валідації обов'язкових полів.
     */
    public Guard<OrderState, OrderEvent> basicFieldsValidGuard() {
        return context -> {
            try {
                ItemCharacteristicsDTO dto = (ItemCharacteristicsDTO) context.getExtendedState()
                        .getVariables().get(ITEM_CHARACTERISTICS_KEY);

                return dto != null && validator.isBasicValidationPassed(dto);

            } catch (Exception e) {
                logger.error("Помилка базової валідації: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Guard для перевірки, чи потрібно відображати секцію наповнювача.
     */
    public Guard<OrderState, OrderEvent> shouldShowFillerGuard() {
        return context -> {
            try {
                ItemCharacteristicsDTO dto = (ItemCharacteristicsDTO) context.getExtendedState()
                        .getVariables().get(ITEM_CHARACTERISTICS_KEY);

                if (dto == null || dto.getCategoryCode() == null) {
                    return false;
                }

                return validator.isFillerRequired(dto.getCategoryCode());

            } catch (Exception e) {
                logger.error("Помилка перевірки необхідності наповнювача: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Guard для перевірки можливості збереження.
     */
    public Guard<OrderState, OrderEvent> canSaveGuard() {
        return context -> {
            try {
                ItemCharacteristicsDTO dto = (ItemCharacteristicsDTO) context.getExtendedState()
                        .getVariables().get(ITEM_CHARACTERISTICS_KEY);

                if (dto == null) {
                    return false;
                }

                // Для збереження достатньо базової валідації
                return validator.isBasicValidationPassed(dto);

            } catch (Exception e) {
                logger.error("Помилка перевірки можливості збереження: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Допоміжний метод для отримання категорії з контексту або попереднього кроку.
     */
    private String getCategoryFromContext(StateContext<OrderState, OrderEvent> context, String wizardId) {
        try {
            // Спочатку пробуємо отримати з поточних характеристик
            ItemCharacteristicsDTO dto = (ItemCharacteristicsDTO) context.getExtendedState()
                    .getVariables().get(ITEM_CHARACTERISTICS_KEY);

            if (dto != null && dto.getCategoryCode() != null) {
                return dto.getCategoryCode();
            }

            // Якщо не знайдено, пробуємо завантажити з попереднього кроку через TempOrderItemDTO
            Object tempItemObj = context.getExtendedState().getVariables().get("tempOrderItem");
            if (tempItemObj instanceof TempOrderItemDTO) {
                TempOrderItemDTO tempItem = (TempOrderItemDTO) tempItemObj;
                if (tempItem.getCategory() != null) {
                    return tempItem.getCategory();
                }
            }

            return null;

        } catch (Exception e) {
            logger.error("Помилка отримання категорії з контексту для wizard {}: {}", wizardId, e.getMessage());
            return null;
        }
    }
}
