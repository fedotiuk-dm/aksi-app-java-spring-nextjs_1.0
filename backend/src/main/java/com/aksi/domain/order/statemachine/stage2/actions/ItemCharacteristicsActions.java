package com.aksi.domain.order.statemachine.stage2.actions;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.service.ItemCharacteristicsStepService;
import com.aksi.domain.order.statemachine.stage2.service.TempOrderItemService;

/**
 * Actions для підетапу 2.2 "Характеристики предмета".
 *
 * Відповідає за обробку подій стану машини для підетапу характеристик предмета.
 */
@Component
public class ItemCharacteristicsActions {

    private static final Logger logger = LoggerFactory.getLogger(ItemCharacteristicsActions.class);
    private static final String WIZARD_ID_KEY = "wizardId";
    private static final String ITEM_CHARACTERISTICS_KEY = "itemCharacteristics";
    private static final String CHARACTERISTICS_VALID_KEY = "characteristicsValid";

    private final ItemCharacteristicsStepService characteristicsService;
    private final TempOrderItemService tempOrderItemService;

    public ItemCharacteristicsActions(ItemCharacteristicsStepService characteristicsService,
                                    TempOrderItemService tempOrderItemService) {
        this.characteristicsService = characteristicsService;
        this.tempOrderItemService = tempOrderItemService;
    }

    /**
     * Action для входу в підетап 2.2.
     * Завантажує доступні характеристики та попередньо заповнені дані.
     */
    public Action<OrderState, OrderEvent> loadCharacteristicsAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.info("Завантаження характеристик предмета для wizard: {}", wizardId);

            try {
                // Завантажуємо характеристики
                ItemCharacteristicsDTO dto = characteristicsService.loadCharacteristics(wizardId);

                // Якщо немає збережених даних, спробуємо завантажити контекст з попереднього кроку
                if (!dto.hasAvailableOptions() || dto.getCompletionPercentage() == 0) {
                                        // Завантажуємо тимчасовий предмет і зливаємо дані
                    @SuppressWarnings("unchecked")
                    Map<String, Object> variables = (Map<String, Object>) (Map<?, ?>) context.getExtendedState().getVariables();
                    TempOrderItemDTO tempItem = tempOrderItemService.loadFromContext(variables);
                    if (tempItem != null && tempItem.hasBasicInfo()) {
                        logger.debug("Зливання даних з TempOrderItemDTO для wizard: {}, категорія: {}",
                                   wizardId, tempItem.getCategory());

                        // Зливаємо основну інформацію в характеристики
                        tempItem = tempOrderItemService.mergeBasicInfoToCharacteristics(tempItem, tempItem.getCategory());

                        // Оновлюємо контекст
                        tempOrderItemService.saveToContext(variables, tempItem);

                        // Оновлюємо DTO з даними категорії для фільтрації матеріалів
                        mergeDataFromPreviousStep(dto, tempItem);
                    }
                }

                // Зберігаємо DTO в контекст
                context.getExtendedState().getVariables().put(ITEM_CHARACTERISTICS_KEY, dto);

                logger.debug("Характеристики успішно завантажено для wizard: {}", wizardId);

            } catch (Exception e) {
                logger.error("Помилка завантаження характеристик для wizard {}: {}", wizardId, e.getMessage(), e);
                // Створюємо порожнє DTO з помилкою
                ItemCharacteristicsDTO errorDto = ItemCharacteristicsDTO.builder()
                        .hasErrors(true)
                        .errorMessage("Не вдалося завантажити характеристики предмета")
                        .build();
                context.getExtendedState().getVariables().put(ITEM_CHARACTERISTICS_KEY, errorDto);
            }
        };
    }

    /**
     * Action для збереження характеристик предмета.
     */
    public Action<OrderState, OrderEvent> saveCharacteristicsAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.info("Збереження характеристик предмета для wizard: {}", wizardId);

            try {
                // Отримуємо DTO з контексту
                ItemCharacteristicsDTO dto = (ItemCharacteristicsDTO) context.getExtendedState()
                        .getVariables().get(ITEM_CHARACTERISTICS_KEY);

                if (dto == null) {
                    logger.warn("Не знайдено дані характеристик для збереження в wizard: {}", wizardId);
                    return;
                }

                // Зберігаємо характеристики
                ItemCharacteristicsDTO savedDto = characteristicsService.saveCharacteristics(wizardId, dto);

                // Оновлюємо контекст
                context.getExtendedState().getVariables().put(ITEM_CHARACTERISTICS_KEY, savedDto);

                logger.debug("Характеристики успішно збережено для wizard: {}", wizardId);

            } catch (Exception e) {
                logger.error("Помилка збереження характеристик для wizard {}: {}", wizardId, e.getMessage(), e);
            }
        };
    }

    /**
     * Action для валідації характеристик перед переходом до наступного кроку.
     */
    public Action<OrderState, OrderEvent> validateCharacteristicsAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.info("Валідація характеристик предмета для wizard: {}", wizardId);

            try {
                boolean canProceed = characteristicsService.canProceedToNextStep(wizardId);

                // Зберігаємо результат валідації в контекст
                context.getExtendedState().getVariables().put(CHARACTERISTICS_VALID_KEY, canProceed);

                if (canProceed) {
                    logger.debug("Валідація характеристик пройшла успішно для wizard: {}", wizardId);
                } else {
                    logger.warn("Валідація характеристик не пройшла для wizard: {}", wizardId);
                }

            } catch (Exception e) {
                logger.error("Помилка валідації характеристик для wizard {}: {}", wizardId, e.getMessage(), e);
                context.getExtendedState().getVariables().put(CHARACTERISTICS_VALID_KEY, false);
            }
        };
    }

    /**
     * Action для скидання характеристик.
     */
    public Action<OrderState, OrderEvent> resetCharacteristicsAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.info("Скидання характеристик предмета для wizard: {}", wizardId);

            try {
                characteristicsService.resetCharacteristics(wizardId);

                // Очищуємо дані з контексту
                context.getExtendedState().getVariables().remove(ITEM_CHARACTERISTICS_KEY);
                context.getExtendedState().getVariables().remove(CHARACTERISTICS_VALID_KEY);

                logger.debug("Характеристики успішно скинуто для wizard: {}", wizardId);

            } catch (Exception e) {
                logger.error("Помилка скидання характеристик для wizard {}: {}", wizardId, e.getMessage(), e);
            }
        };
    }

    /**
     * Action для оновлення вибору матеріалу.
     */
    public Action<OrderState, OrderEvent> updateMaterialAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            String selectedMaterial = (String) context.getExtendedState().getVariables().get("selectedMaterial");

            logger.debug("Оновлення матеріалу {} для wizard: {}", selectedMaterial, wizardId);

            try {
                // Отримуємо поточні характеристики
                ItemCharacteristicsDTO dto = (ItemCharacteristicsDTO) context.getExtendedState()
                        .getVariables().get(ITEM_CHARACTERISTICS_KEY);

                if (dto != null && selectedMaterial != null) {
                    dto.setSelectedMaterial(selectedMaterial);
                    dto.clearErrors(); // Очищуємо помилки при зміні

                    // Зберігаємо оновлені дані
                    context.getExtendedState().getVariables().put(ITEM_CHARACTERISTICS_KEY, dto);
                }

            } catch (Exception e) {
                logger.error("Помилка оновлення матеріалу для wizard {}: {}", wizardId, e.getMessage(), e);
            }
        };
    }

    /**
     * Action для оновлення вибору кольору.
     */
    public Action<OrderState, OrderEvent> updateColorAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            String selectedColor = (String) context.getExtendedState().getVariables().get("selectedColor");
            String customColor = (String) context.getExtendedState().getVariables().get("customColor");

            logger.debug("Оновлення кольору для wizard: {}", wizardId);

            try {
                // Отримуємо поточні характеристики
                ItemCharacteristicsDTO dto = (ItemCharacteristicsDTO) context.getExtendedState()
                        .getVariables().get(ITEM_CHARACTERISTICS_KEY);

                if (dto != null) {
                    dto.setSelectedColor(selectedColor);
                    dto.setCustomColor(customColor);
                    dto.clearErrors(); // Очищуємо помилки при зміні

                    // Зберігаємо оновлені дані
                    context.getExtendedState().getVariables().put(ITEM_CHARACTERISTICS_KEY, dto);
                }

            } catch (Exception e) {
                logger.error("Помилка оновлення кольору для wizard {}: {}", wizardId, e.getMessage(), e);
            }
        };
    }

    /**
     * Зливає дані з попереднього кроку (підетап 2.1) з поточними характеристиками.
     *
     * @param current поточні характеристики
     * @param tempItem тимчасовий предмет з попереднього кроку
     */
    private void mergeDataFromPreviousStep(ItemCharacteristicsDTO current, TempOrderItemDTO tempItem) {
        if (current == null || tempItem == null) {
            return;
        }

        logger.debug("Зливання даних TempOrderItemDTO в ItemCharacteristicsDTO");

        // 1. Передача categoryCode для правильної фільтрації матеріалів
        if (tempItem.getCategory() != null) {
            current.setCategoryCode(tempItem.getCategory());
            logger.debug("Встановлено категорію: {}", tempItem.getCategory());
        }

        // 2. Попереднє заповнення полів на основі збережених характеристик
        if (tempItem.getMaterial() != null) {
            current.setSelectedMaterial(tempItem.getMaterial());
            logger.debug("Встановлено матеріал: {}", tempItem.getMaterial());
        }

        if (tempItem.getColor() != null) {
            current.setSelectedColor(tempItem.getColor());
            logger.debug("Встановлено колір: {}", tempItem.getColor());
        }

        // 3. Налаштування додаткових опцій
        if (tempItem.getFillerType() != null) {
            current.setSelectedFillerType(tempItem.getFillerType());
            logger.debug("Встановлено наповнювач: {}", tempItem.getFillerType());
        }

        if (tempItem.getFillerCompressed() != null) {
            current.setFillerCompressed(tempItem.getFillerCompressed());
            logger.debug("Встановлено стан наповнювача: {}", tempItem.getFillerCompressed());
        }

        if (tempItem.getWearDegree() != null) {
            current.setSelectedWearDegree(tempItem.getWearDegree());
            logger.debug("Встановлено ступінь зносу: {}", tempItem.getWearDegree());
        }

        // 4. Очищення помилок при успішному зливанні
        if (tempItem.hasCharacteristics()) {
            current.clearErrors(); // Очищуємо помилки якщо дані успішно злиті
            logger.debug("Очищено помилки після успішного зливання даних");
        }

        logger.debug("Зливання даних TempOrderItemDTO завершено успішно");
    }

}
