package com.aksi.domain.order.statemachine.service.state;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.service.OrderWizardFacade;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для розрахунку статусу завершення етапів Order Wizard.
 *
 * Відповідальності (SRP):
 * - Визначення поточного етапу на основі стану
 * - Розрахунок відсотка завершення кожного етапу
 * - Валідація готовності етапу до завершення
 * - Аналіз відсутніх обов'язкових даних
 *
 * Принципи:
 * - Single Responsibility: тільки розрахунок статусів
 * - Dependency Inversion: використовує OrderWizardFacade для валідації
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WizardCompletionService {

    private final OrderWizardFacade orderWizardFacade;

    /**
     * Визначає номер поточного етапу на основі стану.
     */
    public int getCurrentStageNumber(OrderState state) {
        return switch (state) {
            case INITIAL, CLIENT_SELECTION, ORDER_INITIALIZATION -> 1;
            case ITEM_MANAGEMENT, ITEM_WIZARD_ACTIVE, ITEM_BASIC_INFO,
                 ITEM_CHARACTERISTICS, ITEM_DEFECTS_STAINS, ITEM_PRICING,
                 ITEM_PHOTOS, ITEM_COMPLETED -> 2;
            case EXECUTION_PARAMS, GLOBAL_DISCOUNTS, PAYMENT_PROCESSING,
                 ADDITIONAL_INFO -> 3;
            case ORDER_CONFIRMATION, ORDER_REVIEW, LEGAL_ASPECTS,
                 RECEIPT_GENERATION -> 4;
            case COMPLETED, CANCELLED -> 5;
        };
    }

    /**
     * Отримує назву етапу за номером.
     */
    public String getStageName(int stageNumber) {
        return switch (stageNumber) {
            case 1 -> "Етап 1: Клієнт та базова інформація";
            case 2 -> "Етап 2: Менеджер предметів";
            case 3 -> "Етап 3: Параметри замовлення";
            case 4 -> "Етап 4: Підтвердження та завершення";
            case 5 -> "Завершено";
            default -> "Невідомий етап";
        };
    }

    /**
     * Перевіряє чи завершено етап 1.
     */
    public boolean isStage1Completed(OrderState state, Map<String, Object> data) {
        // Базова перевірка стану
        boolean stateCompleted = switch (state) {
            case INITIAL, CLIENT_SELECTION, ORDER_INITIALIZATION -> false;
            default -> true;
        };

        if (!stateCompleted) {
            return false;
        }

        // Валідація через facade
        try {
            // Використовуємо facade для більш комплексної валідації
            String wizardId = (String) data.get("wizardId");
            if (wizardId != null && orderWizardFacade.wizardExists(wizardId)) {
                Map<String, Object> result = orderWizardFacade.executeStage1Action(wizardId, "validateCompletion", data);
                Object completedValue = result.get("completed");

                if (completedValue instanceof Boolean completed) {
                    return completed;
                }
            }

            // Fallback до базової валідації
            return hasClientData(data) && hasBasicOrderData(data);

        } catch (Exception e) {
            log.debug("Помилка валідації Stage1 через facade, використовуємо базову валідацію: {}", e.getMessage());
            return hasClientData(data) && hasBasicOrderData(data);
        }
    }

    /**
     * Перевіряє чи завершено етап 2.
     */
    public boolean isStage2Completed(OrderState state, Map<String, Object> data) {
        // Базова перевірка стану
        boolean stateCompleted = switch (state) {
            case ITEM_MANAGEMENT, ITEM_WIZARD_ACTIVE, ITEM_BASIC_INFO,
                 ITEM_CHARACTERISTICS, ITEM_DEFECTS_STAINS, ITEM_PRICING,
                 ITEM_PHOTOS, ITEM_COMPLETED -> false;
            case EXECUTION_PARAMS, GLOBAL_DISCOUNTS, PAYMENT_PROCESSING,
                 ADDITIONAL_INFO, ORDER_CONFIRMATION, ORDER_REVIEW,
                 LEGAL_ASPECTS, RECEIPT_GENERATION, COMPLETED -> true;
            default -> isStage1Completed(state, data);
        };

        if (!stateCompleted) {
            return false;
        }

        // Валідація наявності предметів
        return hasAnyItems(data);
    }

    /**
     * Перевіряє чи завершено етап 3.
     */
    public boolean isStage3Completed(OrderState state, Map<String, Object> data) {
        boolean stateCompleted = switch (state) {
            case EXECUTION_PARAMS, GLOBAL_DISCOUNTS, PAYMENT_PROCESSING, ADDITIONAL_INFO -> false;
            case ORDER_CONFIRMATION, ORDER_REVIEW, LEGAL_ASPECTS, RECEIPT_GENERATION, COMPLETED -> true;
            default -> isStage2Completed(state, data);
        };

        if (!stateCompleted) {
            return false;
        }

        return hasExecutionParams(data) && hasPaymentData(data);
    }

    /**
     * Перевіряє чи завершено етап 4.
     */
    public boolean isStage4Completed(OrderState state, Map<String, Object> data) {
        return state == OrderState.COMPLETED && hasLegalAcceptance(data);
    }

    /**
     * Розраховує загальний прогрес wizard (0-100%).
     */
    public int calculateOverallProgress(OrderState state, Map<String, Object> data) {
        int totalStages = 4;
        int completedStages = 0;

        if (isStage1Completed(state, data)) completedStages++;
        if (isStage2Completed(state, data)) completedStages++;
        if (isStage3Completed(state, data)) completedStages++;
        if (isStage4Completed(state, data)) completedStages++;

        return (completedStages * 100) / totalStages;
    }

    /**
     * Перевіряє чи може wizard завершитися.
     */
    public boolean canWizardComplete(OrderState state, Map<String, Object> data) {
        return isStage1Completed(state, data) &&
               isStage2Completed(state, data) &&
               isStage3Completed(state, data) &&
               hasMinimumRequiredData(data);
    }

    /**
     * Отримує причини блокування завершення wizard.
     */
    public Map<String, String> getBlockingReasons(OrderState state, Map<String, Object> data) {
        Map<String, String> reasons = new HashMap<>();

        if (!isStage1Completed(state, data)) {
            reasons.put("stage1", "Не завершено вибір клієнта та базову інформацію");
        }
        if (!isStage2Completed(state, data)) {
            reasons.put("stage2", "Не додано жодного предмета до замовлення");
        }
        if (!isStage3Completed(state, data)) {
            reasons.put("stage3", "Не встановлено параметри виконання та оплати");
        }
        if (!hasMinimumRequiredData(data)) {
            reasons.put("data", "Відсутні обов'язкові дані для завершення");
        }

        return reasons;
    }

    /**
     * Отримує список відсутніх обов'язкових даних.
     */
    public List<String> getMissingRequiredData(Map<String, Object> data) {
        List<String> missing = new ArrayList<>();

        if (!hasClientData(data)) {
            missing.add("Дані клієнта");
        }
        if (!hasBasicOrderData(data)) {
            missing.add("Базова інформація замовлення");
        }
        if (!hasAnyItems(data)) {
            missing.add("Предмети замовлення");
        }
        if (!hasExecutionParams(data)) {
            missing.add("Параметри виконання");
        }
        if (!hasPaymentData(data)) {
            missing.add("Дані оплати");
        }

        return missing;
    }

    /**
     * Отримує дату завершення етапу.
     */
    public LocalDateTime getStageCompletedAt(Map<String, Object> data, String stageName) {
        Object completedAt = data.get(stageName + "_completed_at");
        if (completedAt instanceof LocalDateTime dateTime) {
            return dateTime;
        }
        return null;
    }

    /**
     * Отримує кількість предметів у замовленні.
     */
    public Integer getItemsCount(Map<String, Object> data) {
        Object itemsData = data.get("items");
        if (itemsData instanceof List<?> items) {
            return items.size();
        }
        return 0;
    }

    private boolean hasClientData(Map<String, Object> data) {
        return data.containsKey("selectedClient") || data.containsKey("clientData");
    }

    private boolean hasBasicOrderData(Map<String, Object> data) {
        return data.containsKey("receiptNumber") && data.containsKey("selectedBranch");
    }

    private boolean hasAnyItems(Map<String, Object> data) {
        Object items = data.get("items");
        return items instanceof List<?> itemsList && !itemsList.isEmpty();
    }

    private boolean hasExecutionParams(Map<String, Object> data) {
        return data.containsKey("executionDate") || data.containsKey("executionParams");
    }

    private boolean hasPaymentData(Map<String, Object> data) {
        return data.containsKey("paymentMethod") || data.containsKey("paymentData");
    }

    private boolean hasLegalAcceptance(Map<String, Object> data) {
        return Boolean.TRUE.equals(data.get("legalAccepted"));
    }

    private boolean hasMinimumRequiredData(Map<String, Object> data) {
        return hasClientData(data) && hasBasicOrderData(data) && hasAnyItems(data);
    }
}
