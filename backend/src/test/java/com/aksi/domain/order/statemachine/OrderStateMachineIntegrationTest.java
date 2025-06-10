package com.aksi.domain.order.statemachine;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.statemachine.StateMachine;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.statemachine.service.OrderStateMachineService;
import com.aksi.domain.order.statemachine.service.OrderWizardSessionService;

import lombok.extern.slf4j.Slf4j;

/**
 * Інтеграційний тест для Order State Machine.
 * Перевіряє повний флоу Order Wizard.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Slf4j
class OrderStateMachineIntegrationTest {

    @Autowired
    private OrderStateMachineService stateMachineService;

    @Autowired
    private OrderWizardSessionService sessionService;

    @Test
    void testOrderWizardFullFlow() {
        log.info("=== ТЕСТ: Повний флоу Order Wizard ===");

        // 1. Створення сесії та State Machine
        UUID sessionId = UUID.randomUUID();
        StateMachine<OrderState, OrderEvent> stateMachine = stateMachineService.createOrderStateMachine(sessionId);

        assertNotNull(stateMachine);
        assertEquals(OrderState.INITIAL, stateMachine.getState().getId());
        assertTrue(sessionService.isSessionActive(sessionId));

        log.info("✅ Сесію та State Machine створено");

        // 2. Запуск Order Wizard
        boolean started = stateMachineService.sendEvent(sessionId, OrderEvent.START_ORDER);
        assertTrue(started);
        assertEquals(OrderState.CLIENT_SELECTION, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Order Wizard запущено - перехід до вибору клієнта");

        // 3. Вибір клієнта
        stateMachine.getExtendedState().getVariables().put("selectedClientId", UUID.randomUUID());
        boolean clientSelected = stateMachineService.sendEvent(sessionId, OrderEvent.CLIENT_SELECTED);
        assertTrue(clientSelected);
        assertEquals(OrderState.ORDER_INITIALIZATION, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Клієнта вибрано - перехід до ініціалізації замовлення");

        // 4. Заповнення базової інформації замовлення
        stateMachine.getExtendedState().getVariables().put("receiptNumber", "TEST-001");
        stateMachine.getExtendedState().getVariables().put("uniqueTag", "TAG-001");
        stateMachine.getExtendedState().getVariables().put("branchId", UUID.randomUUID());

        boolean orderInfoCompleted = stateMachineService.sendEvent(sessionId, OrderEvent.ORDER_INFO_COMPLETED);
        assertTrue(orderInfoCompleted);
        assertEquals(OrderState.ITEM_MANAGEMENT, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Базову інформацію заповнено - перехід до менеджера предметів");

        // 5. Додавання предмета
        boolean addItem = stateMachineService.sendEvent(sessionId, OrderEvent.ADD_ITEM);
        assertTrue(addItem);
        assertEquals(OrderState.ITEM_WIZARD_ACTIVE, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Підвізард предметів активовано");

        // 6. Проходження підвізарда предметів
        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.START_ITEM_WIZARD));
        assertEquals(OrderState.ITEM_BASIC_INFO, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.BASIC_INFO_COMPLETED));
        assertEquals(OrderState.ITEM_CHARACTERISTICS, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.CHARACTERISTICS_COMPLETED));
        assertEquals(OrderState.ITEM_DEFECTS_STAINS, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.DEFECTS_COMPLETED));
        assertEquals(OrderState.ITEM_PRICING, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.PRICING_COMPLETED));
        assertEquals(OrderState.ITEM_PHOTOS, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.PHOTOS_COMPLETED));
        assertEquals(OrderState.ITEM_COMPLETED, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Підвізард предметів завершено");

        // 7. Додавання предмета до замовлення
        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.ITEM_ADDED));
        assertEquals(OrderState.ITEM_MANAGEMENT, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Предмет додано до замовлення");

        // 8. Завершення додавання предметів та перехід до етапу 3
        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.ITEMS_COMPLETED));
        assertEquals(OrderState.EXECUTION_PARAMS, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Перехід до етапу 3 - параметри виконання");

        // 9. Етап 3 - Загальні параметри
        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.EXECUTION_PARAMS_SET));
        assertEquals(OrderState.GLOBAL_DISCOUNTS, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.DISCOUNTS_APPLIED));
        assertEquals(OrderState.PAYMENT_PROCESSING, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.PAYMENT_PROCESSED));
        assertEquals(OrderState.ADDITIONAL_INFO, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.ADDITIONAL_INFO_COMPLETED));
        assertEquals(OrderState.ORDER_CONFIRMATION, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Етап 3 завершено - перехід до підтвердження");

        // 10. Етап 4 - Підтвердження та завершення
        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.REVIEW_ORDER));
        assertEquals(OrderState.ORDER_REVIEW, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.ORDER_APPROVED));
        assertEquals(OrderState.LEGAL_ASPECTS, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.TERMS_ACCEPTED));
        assertEquals(OrderState.RECEIPT_GENERATION, stateMachineService.getCurrentState(sessionId));

        assertTrue(stateMachineService.sendEvent(sessionId, OrderEvent.RECEIPT_GENERATED));
        assertEquals(OrderState.COMPLETED, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Замовлення успішно завершено!");

        // 11. Завершення сесії
        stateMachineService.completeStateMachine(sessionId);

        log.info("✅ Сесію завершено та ресурси очищено");
        log.info("=== ТЕСТ УСПІШНО ЗАВЕРШЕНО ===");
    }

    @Test
    void testOrderCancellation() {
        log.info("=== ТЕСТ: Скасування замовлення ===");

        // Створення та запуск
        UUID sessionId = UUID.randomUUID();
        stateMachineService.createOrderStateMachine(sessionId);
        stateMachineService.sendEvent(sessionId, OrderEvent.START_ORDER);

        assertEquals(OrderState.CLIENT_SELECTION, stateMachineService.getCurrentState(sessionId));

        // Скасування з будь-якого стану
        boolean cancelled = stateMachineService.sendEvent(sessionId, OrderEvent.CANCEL_ORDER);
        assertTrue(cancelled);
        assertEquals(OrderState.CANCELLED, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Замовлення успішно скасовано");
    }

    @Test
    void testItemWizardCancellation() {
        log.info("=== ТЕСТ: Скасування підвізарда предметів ===");

        // Підготовка до підвізарда
        UUID sessionId = UUID.randomUUID();
        StateMachine<OrderState, OrderEvent> stateMachine = stateMachineService.createOrderStateMachine(sessionId);

        // Дістаємося до ITEM_MANAGEMENT
        stateMachineService.sendEvent(sessionId, OrderEvent.START_ORDER);
        stateMachine.getExtendedState().getVariables().put("selectedClientId", UUID.randomUUID());
        stateMachineService.sendEvent(sessionId, OrderEvent.CLIENT_SELECTED);
        stateMachine.getExtendedState().getVariables().put("receiptNumber", "TEST-002");
        stateMachine.getExtendedState().getVariables().put("uniqueTag", "TAG-002");
        stateMachine.getExtendedState().getVariables().put("branchId", UUID.randomUUID());
        stateMachineService.sendEvent(sessionId, OrderEvent.ORDER_INFO_COMPLETED);

        // Запускаємо підвізард
        stateMachineService.sendEvent(sessionId, OrderEvent.ADD_ITEM);
        stateMachineService.sendEvent(sessionId, OrderEvent.START_ITEM_WIZARD);
        stateMachineService.sendEvent(sessionId, OrderEvent.BASIC_INFO_COMPLETED);

        assertEquals(OrderState.ITEM_CHARACTERISTICS, stateMachineService.getCurrentState(sessionId));

        // Скасовуємо підвізард
        boolean cancelled = stateMachineService.sendEvent(sessionId, OrderEvent.CANCEL_ITEM_WIZARD);
        assertTrue(cancelled);
        assertEquals(OrderState.ITEM_MANAGEMENT, stateMachineService.getCurrentState(sessionId));

        log.info("✅ Підвізард предметів успішно скасовано");
    }
}
