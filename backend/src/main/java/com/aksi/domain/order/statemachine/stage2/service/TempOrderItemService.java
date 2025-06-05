package com.aksi.domain.order.statemachine.stage2.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Центральний сервіс для керування TempOrderItemDTO через всі етапи State Machine.
 *
 * Відповідальний за:
 * - Завантаження/збереження TempOrderItemDTO з контексту State Machine
 * - Зливання даних між етапами
 * - Валідацію готовності до переходу між етапами
 * - Конвертацію в фінальний OrderItem
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TempOrderItemService {

    private static final String TEMP_ORDER_ITEM_KEY = "tempOrderItem";
    private static final String CURRENT_ITEM_STEP_KEY = "currentItemStep";

    private final ObjectMapper objectMapper;

    /**
     * Завантажити TempOrderItemDTO з контексту State Machine.
     */
    public TempOrderItemDTO loadFromContext(Map<String, Object> contextVariables) {
        log.debug("Завантаження TempOrderItemDTO з контексту State Machine");

        Object data = contextVariables.get(TEMP_ORDER_ITEM_KEY);
        if (data == null) {
            log.debug("TempOrderItemDTO не знайдено в контексті, створюємо новий");
            return initializeNewTempItem();
        }

        try {
            if (data instanceof TempOrderItemDTO tempItem) {
                log.debug("TempOrderItemDTO завантажено з контексту, крок: {}, прогрес: {}%",
                         tempItem.getWizardStep(), tempItem.getCompletionPercentage());
                return tempItem;
            }

            // Якщо дані в іншому форматі, конвертуємо
            TempOrderItemDTO tempItem = objectMapper.convertValue(data, TempOrderItemDTO.class);
            log.debug("TempOrderItemDTO сконвертовано з контексту, крок: {}", tempItem.getWizardStep());
            return tempItem;

        } catch (Exception e) {
            log.error("Помилка конвертації TempOrderItemDTO з контексту: {}", e.getMessage(), e);
            return initializeNewTempItem();
        }
    }

    /**
     * Зберегти TempOrderItemDTO в контекст State Machine.
     */
    public void saveToContext(Map<String, Object> contextVariables, TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            log.warn("Спроба збереження null TempOrderItemDTO в контекст");
            return;
        }

        contextVariables.put(TEMP_ORDER_ITEM_KEY, tempItem);
        contextVariables.put(CURRENT_ITEM_STEP_KEY, tempItem.getWizardStep());

        log.debug("TempOrderItemDTO збережено в контекст, крок: {}, прогрес: {}%",
                 tempItem.getWizardStep(), tempItem.getCompletionPercentage());
    }

    /**
     * Ініціалізувати новий TempOrderItemDTO.
     */
    public TempOrderItemDTO initializeNewTempItem() {
        TempOrderItemDTO tempItem = TempOrderItemDTO.builder()
                .wizardStep(1)
                .isValid(false)
                .hasPhotos(false)
                .build();

        log.debug("Ініціалізовано новий TempOrderItemDTO");
        return tempItem;
    }

    /**
     * Перехід до наступного кроку підвізарда.
     */
    public TempOrderItemDTO proceedToNextStep(TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            log.warn("Неможливо перейти до наступного кроку: TempOrderItemDTO є null");
            return initializeNewTempItem();
        }

        Integer wizardStep = tempItem.getWizardStep();
        int currentStep = wizardStep != null ? wizardStep : 1;
        int nextStep = Math.min(currentStep + 1, 5); // Максимум 5 кроків

        tempItem.setWizardStep(nextStep);
        log.debug("TempOrderItemDTO перейшов до кроку: {} (був: {})", nextStep, currentStep);

        return tempItem;
    }

    /**
     * Повернення до попереднього кроку підвізарда.
     */
    public TempOrderItemDTO goToPreviousStep(TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            return initializeNewTempItem();
        }

        Integer wizardStep = tempItem.getWizardStep();
        int currentStep = wizardStep != null ? wizardStep : 1;
        int previousStep = Math.max(currentStep - 1, 1); // Мінімум 1 крок

        tempItem.setWizardStep(previousStep);
        log.debug("TempOrderItemDTO повернувся до кроку: {} (був: {})", previousStep, currentStep);

        return tempItem;
    }

    /**
     * Перевірити готовність до переходу на наступний крок.
     */
    public boolean canProceedToStep(TempOrderItemDTO tempItem, int targetStep) {
        if (tempItem == null) {
            return false;
        }

        return switch (targetStep) {
            case 1 -> true; // Завжди можна перейти до першого кроку
            case 2 -> tempItem.hasBasicInfo(); // Крок 2 потребує основної інформації
            case 3 -> tempItem.hasBasicInfo() && tempItem.hasCharacteristics(); // Крок 3 потребує характеристик
            case 4 -> tempItem.hasBasicInfo() && tempItem.hasCharacteristics(); // Крок 4 для ціноутворення
            case 5 -> tempItem.hasBasicInfo() && tempItem.hasCharacteristics() && tempItem.hasPrice(); // Крок 5 для фото
            default -> false;
        };
    }

    /**
     * Перевірити готовність до завершення підвізарда.
     */
    public boolean isReadyToComplete(TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            return false;
        }

        boolean ready = tempItem.isReadyForOrder();
        log.debug("TempOrderItemDTO готовність до завершення: {}, прогрес: {}%",
                 ready, tempItem.getCompletionPercentage());

        return ready;
    }

    /**
     * Злити дані з основної інформації (крок 1) до характеристик (крок 2).
     */
    public TempOrderItemDTO mergeBasicInfoToCharacteristics(TempOrderItemDTO tempItem, String categoryCode) {
        if (tempItem == null || categoryCode == null) {
            return tempItem;
        }

        // Встановлюємо категорію, якщо вона ще не встановлена
        if (tempItem.getCategory() == null || !tempItem.getCategory().equals(categoryCode)) {
            tempItem.setCategory(categoryCode);

            // Скидаємо характеристики при зміні категорії
            tempItem.setMaterial(null);
            tempItem.setFillerType(null);
            tempItem.setFillerCompressed(null);

            // Скидаємо ціноутворення
            tempItem.resetPricing();

            log.debug("TempOrderItemDTO: категорія змінена на {}, характеристики скинуті", categoryCode);
        }

        return tempItem;
    }

    /**
     * Злити дані з характеристик (крок 2) до плям/дефектів (крок 3).
     */
    public TempOrderItemDTO mergeCharacteristicsToStains(TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            return tempItem;
        }

        // Тут можна додати логіку автоматичного визначення ризиків на основі матеріалу
        // Наприклад, шовк має ризик зміни кольору, замша - деформації тощо

        log.debug("TempOrderItemDTO: дані характеристик передані до етапу плям/дефектів");
        return tempItem;
    }

    /**
     * Злити дані з плям/дефектів (крок 3) до ціноутворення (крок 4).
     */
    public TempOrderItemDTO mergeStainsToPricing(TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            return tempItem;
        }

        // Скидаємо попередні розрахунки при зміні плям/дефектів
        tempItem.resetPricing();

        log.debug("TempOrderItemDTO: дані плям/дефектів передані до етапу ціноутворення");
        return tempItem;
    }

    /**
     * Валідувати TempOrderItemDTO для певного кроку.
     */
    public TempOrderItemValidationResult validateForStep(TempOrderItemDTO tempItem, int step) {
        if (tempItem == null) {
            return new TempOrderItemValidationResult(false, "TempOrderItemDTO є null");
        }

        return switch (step) {
            case 1 -> validateBasicInfo(tempItem);
            case 2 -> validateCharacteristics(tempItem);
            case 3 -> validateStainsAndDefects(tempItem);
            case 4 -> validatePricing(tempItem);
            case 5 -> validatePhotos(tempItem);
            default -> new TempOrderItemValidationResult(false, "Невідомий крок: " + step);
        };
    }

    /**
     * Валідація основної інформації (крок 1).
     */
    private TempOrderItemValidationResult validateBasicInfo(TempOrderItemDTO tempItem) {
        if (!tempItem.hasBasicInfo()) {
            return new TempOrderItemValidationResult(false,
                "Не заповнена основна інформація: категорія, назва, кількість");
        }
        return new TempOrderItemValidationResult(true, null);
    }

    /**
     * Валідація характеристик (крок 2).
     */
    private TempOrderItemValidationResult validateCharacteristics(TempOrderItemDTO tempItem) {
        if (!tempItem.hasCharacteristics()) {
            return new TempOrderItemValidationResult(false,
                "Не заповнені характеристики: матеріал, колір");
        }
        return new TempOrderItemValidationResult(true, null);
    }

    /**
     * Валідація плям та дефектів (крок 3).
     */
    private TempOrderItemValidationResult validateStainsAndDefects(TempOrderItemDTO tempItem) {
        // Плями та дефекти не є обов'язковими, але потрібна їх документація
        return tempItem != null ? new TempOrderItemValidationResult(true, null)
                                : new TempOrderItemValidationResult(false, "TempOrderItemDTO є null");
    }

    /**
     * Валідація ціноутворення (крок 4).
     */
    private TempOrderItemValidationResult validatePricing(TempOrderItemDTO tempItem) {
        if (!tempItem.hasPrice()) {
            return new TempOrderItemValidationResult(false,
                "Не розрахована ціна предмета");
        }
        return new TempOrderItemValidationResult(true, null);
    }

    /**
     * Валідація фотографій (крок 5).
     */
    private TempOrderItemValidationResult validatePhotos(TempOrderItemDTO tempItem) {
        // Фотографії не є обов'язковими
        return tempItem != null ? new TempOrderItemValidationResult(true, null)
                                : new TempOrderItemValidationResult(false, "TempOrderItemDTO є null");
    }

    /**
     * Результат валідації TempOrderItemDTO.
     */
    public record TempOrderItemValidationResult(
        boolean isValid,
        String errorMessage
    ) {}
}
