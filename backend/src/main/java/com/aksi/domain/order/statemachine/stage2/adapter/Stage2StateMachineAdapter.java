package com.aksi.domain.order.statemachine.stage2.adapter;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagementDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemWizardSessionDTO;
import com.aksi.domain.order.statemachine.stage2.service.Stage2CoordinationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Адаптер для інтеграції Етапу 2 з Spring State Machine.
 *
 * Відповідає за:
 * - Взаємодію між State Machine та бізнес-логікою етапу 2
 * - Управління контекстом State Machine для предметів
 * - Координацію переходів між станами підвізарда
 * - Збереження/завантаження стану етапу в контексті
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class Stage2StateMachineAdapter {

    private final Stage2CoordinationService stage2CoordinationService;

    // ========== Константи для контексту State Machine ==========

    private static final String ITEM_MANAGEMENT_DATA_KEY = "itemManagementData";
    private static final String CURRENT_ITEM_WIZARD_SESSION_KEY = "currentItemWizardSession";
    private static final String WIZARD_ID_KEY = "wizardId";
    private static final String ORDER_ID_KEY = "orderId";

    // ========== Ініціалізація та завантаження етапу 2 ==========

    /**
     * Ініціалізує етап 2 в контексті State Machine.
     * Завантажує поточні предмети замовлення та готує інтерфейс управління.
     */
    public void initializeStage2(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Ініціалізація етапу 2");

        String wizardId = extractWizardId(context);
        UUID orderId = extractOrderId(context);

        try {
            // Використовуємо координаційний сервіс для ініціалізації
            ItemManagementDTO itemManagement = stage2CoordinationService.initializeStage2(wizardId, orderId);

            // Зберігаємо стан в контексті State Machine
            updateItemManagementContext(context, itemManagement);

            log.info("Етап 2 успішно ініціалізовано для wizardId: {}", wizardId);

        } catch (Exception e) {
            log.error("Помилка ініціалізації етапу 2: {}", e.getMessage(), e);
            updateItemManagementContext(context, ItemManagementDTO.builder()
                .currentStatus("ERROR")
                .canProceedToNextStage(false)
                .build());
        }
    }

    /**
     * Завантажує поточний стан етапу 2.
     */
    public void loadStage2State(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завантаження стану етапу 2");

        String wizardId = extractWizardId(context);
        UUID orderId = extractOrderId(context);

        ItemManagementDTO currentState = stage2CoordinationService.loadStage2State(wizardId, orderId);
        updateItemManagementContext(context, currentState);
    }

    // ========== Управління Item Wizard ==========

    /**
     * Запускає новий Item Wizard для додавання предмета.
     */
    public void startNewItemWizard(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Запуск нового Item Wizard");

        String wizardId = extractWizardId(context);

        try {
            ItemWizardSessionDTO session = stage2CoordinationService.startNewItemWizard(wizardId);
            updateItemWizardContext(context, session);

            log.info("Новий Item Wizard запущено: {}", session.getItemWizardId());

        } catch (Exception e) {
            log.error("Помилка запуску Item Wizard: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("itemWizardError", e.getMessage());
        }
    }

    /**
     * Запускає Item Wizard для редагування предмета.
     */
    public void startEditItemWizard(StateContext<OrderState, OrderEvent> context, String itemId) {
        log.debug("State Machine: Запуск редагування предмета {}", itemId);

        String wizardId = extractWizardId(context);
        UUID orderId = extractOrderId(context);

        try {
            ItemWizardSessionDTO session = stage2CoordinationService.startEditItemWizard(wizardId, itemId, orderId);
            updateItemWizardContext(context, session);

            log.info("Item Wizard для редагування запущено: {}", session.getItemWizardId());

        } catch (Exception e) {
            log.error("Помилка запуску редагування: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("itemWizardError", e.getMessage());
        }
    }

    /**
     * Завершує Item Wizard та додає предмет до замовлення.
     */
    public void completeItemWizard(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завершення Item Wizard");

        String wizardId = extractWizardId(context);
        UUID orderId = extractOrderId(context);
        ItemWizardSessionDTO session = extractItemWizardSession(context);

        if (session == null) {
            log.error("Item Wizard сесія не знайдена в контексті");
            return;
        }

        try {
            // Завершуємо підвізард та отримуємо збережений предмет
            OrderItemDTO savedItem = stage2CoordinationService.completeItemWizard(
                wizardId, session.getItemWizardId(), orderId);

            // Оновлюємо стан етапу 2
            loadStage2State(context);

            // Очищуємо контекст підвізарда
            clearItemWizardContext(context);

            log.info("Item Wizard завершено, предмет додано: {}", savedItem.getId());

        } catch (Exception e) {
            log.error("Помилка завершення Item Wizard: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("itemWizardError", e.getMessage());
        }
    }

    // ========== Управління предметами ==========

    /**
     * Видаляє предмет з замовлення.
     */
    public void deleteItem(StateContext<OrderState, OrderEvent> context, String itemId) {
        log.debug("State Machine: Видалення предмета {}", itemId);

        String wizardId = extractWizardId(context);
        UUID orderId = extractOrderId(context);

        try {
            boolean deleted = stage2CoordinationService.deleteItem(wizardId, itemId, orderId);

            if (deleted) {
                // Оновлюємо стан етапу 2
                loadStage2State(context);
                log.info("Предмет {} видалено", itemId);
            } else {
                log.warn("Не вдалося видалити предмет {}", itemId);
            }

        } catch (Exception e) {
            log.error("Помилка видалення предмета: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("deleteItemError", e.getMessage());
        }
    }

    // ========== Завершення етапу 2 ==========

    /**
     * Перевіряє готовність етапу 2 до завершення.
     */
    public boolean canCompleteStage2(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Перевірка готовності етапу 2");

        String wizardId = extractWizardId(context);
        UUID orderId = extractOrderId(context);

        return stage2CoordinationService.canCompleteStage2(wizardId, orderId);
    }

    /**
     * Завершує етап 2 та готує перехід до етапу 3.
     */
    public void finalizeStage2(StateContext<OrderState, OrderEvent> context) {
        log.debug("State Machine: Завершення етапу 2");

        String wizardId = extractWizardId(context);
        UUID orderId = extractOrderId(context);

        try {
            ItemManagementDTO finalState = stage2CoordinationService.finalizeStage2(wizardId, orderId);
            updateItemManagementContext(context, finalState);

            log.info("Етап 2 успішно завершено для wizardId: {}", wizardId);

        } catch (Exception e) {
            log.error("Помилка завершення етапу 2: {}", e.getMessage(), e);
            context.getExtendedState().getVariables().put("stage2Error", e.getMessage());
        }
    }

    // ========== Методи роботи з контекстом ==========

    /**
     * Оновлює дані управління предметами в контексті.
     */
    private void updateItemManagementContext(StateContext<OrderState, OrderEvent> context,
                                           ItemManagementDTO itemManagement) {
        context.getExtendedState().getVariables().put(ITEM_MANAGEMENT_DATA_KEY, itemManagement);
        context.getExtendedState().getVariables().remove("stage2Error");
    }

    /**
     * Оновлює дані Item Wizard сесії в контексті.
     */
    private void updateItemWizardContext(StateContext<OrderState, OrderEvent> context,
                                       ItemWizardSessionDTO session) {
        context.getExtendedState().getVariables().put(CURRENT_ITEM_WIZARD_SESSION_KEY, session);
        context.getExtendedState().getVariables().remove("itemWizardError");
    }

    /**
     * Очищує контекст Item Wizard.
     */
    private void clearItemWizardContext(StateContext<OrderState, OrderEvent> context) {
        context.getExtendedState().getVariables().remove(CURRENT_ITEM_WIZARD_SESSION_KEY);
        context.getExtendedState().getVariables().remove("itemWizardError");
    }

    // ========== Допоміжні методи для отримання даних з контексту ==========

    private String extractWizardId(StateContext<OrderState, OrderEvent> context) {
        Object wizardIdObj = context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
        if (wizardIdObj instanceof String) {
            return (String) wizardIdObj;
        }
        throw new IllegalStateException("WizardId не знайдено в контексті State Machine");
    }

    private UUID extractOrderId(StateContext<OrderState, OrderEvent> context) {
        Object orderIdObj = context.getExtendedState().getVariables().get(ORDER_ID_KEY);
        if (orderIdObj instanceof UUID) {
            return (UUID) orderIdObj;
        } else if (orderIdObj instanceof String) {
            return UUID.fromString((String) orderIdObj);
        }
        throw new IllegalStateException("OrderId не знайдено в контексті State Machine");
    }

    private ItemWizardSessionDTO extractItemWizardSession(StateContext<OrderState, OrderEvent> context) {
        Object sessionObj = context.getExtendedState().getVariables().get(CURRENT_ITEM_WIZARD_SESSION_KEY);
        return sessionObj instanceof ItemWizardSessionDTO ? (ItemWizardSessionDTO) sessionObj : null;
    }

    /**
     * Отримує поточні дані управління предметами з контексту.
     */
    public ItemManagementDTO getCurrentItemManagement(StateContext<OrderState, OrderEvent> context) {
        Object dataObj = context.getExtendedState().getVariables().get(ITEM_MANAGEMENT_DATA_KEY);
        return dataObj instanceof ItemManagementDTO ? (ItemManagementDTO) dataObj : null;
    }

    /**
     * Отримує поточну сесію Item Wizard з контексту.
     */
    public ItemWizardSessionDTO getCurrentItemWizardSession(StateContext<OrderState, OrderEvent> context) {
        return extractItemWizardSession(context);
    }
}
