package com.aksi.domain.order.statemachine.adapter;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.statemachine.StateMachine;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO;
import com.aksi.domain.order.statemachine.util.StateMachineUtils;

/**
 * Головний REST адаптер для Order Wizard.
 * Управляє переходами між основними етапами.
 * Використовує StateMachineService для управління життєвим циклом StateMachine.
 */
@RestController
@RequestMapping("/api/order-wizard")
public class OrderWizardAdapter {

    private static final Logger logger = LoggerFactory.getLogger(OrderWizardAdapter.class);

    private final StateMachineService<OrderState, OrderEvent> stateMachineService;

    @Autowired
    public OrderWizardAdapter(StateMachineService<OrderState, OrderEvent> stateMachineService) {
        this.stateMachineService = stateMachineService;

        if (stateMachineService != null) {
            logger.info("✅ OrderWizardAdapter initialized with StateMachineService: {}",
                stateMachineService.getClass().getSimpleName());
        } else {
            logger.error("❌ OrderWizardAdapter initialized with NULL StateMachineService!");
        }
    }

    /**
     * Отримує або створює StateMachine для заданого sessionId.
     */
    private StateMachine<OrderState, OrderEvent> getStateMachine(String sessionId) {
        return stateMachineService.acquireStateMachine(sessionId);
    }

    /**
     * Запускає новий Order Wizard.
     */
    @PostMapping("/start")
    public ResponseEntity<OrderWizardResponseDTO> startOrderWizard() {
        logger.info("🚀 OrderWizardAdapter.startOrderWizard() called");

        try {
            // Генеруємо новий sessionId
            String sessionId = java.util.UUID.randomUUID().toString();

            // Отримуємо StateMachine для цієї сесії
            StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);

            if (stateMachine == null) {
                logger.error("❌ StateMachine is null for sessionId: {}", sessionId);
                throw new IllegalStateException("StateMachine not created for sessionId: " + sessionId);
            }

            logger.info("📊 StateMachine created for sessionId: {}, currentState={}",
                sessionId, stateMachine.getState() != null ? stateMachine.getState().getId() : "NULL");

            logger.info("🔧 Calling StateMachineUtils.startStateMachine()...");

            // Ініціалізуємо сесію з нашим sessionId
            StateMachineUtils.initializeSession(stateMachine, sessionId);

            // Запускаємо state machine з початковою подією
            boolean success = StateMachineUtils.startStateMachine(stateMachine, sessionId, OrderEvent.START_ORDER);

            if (success) {
                OrderState currentState = StateMachineUtils.getCurrentState(stateMachine);
                logger.info("✅ StateMachine started successfully: sessionId={}, state={}", sessionId, currentState);

                OrderWizardResponseDTO responseBody = new OrderWizardResponseDTO(
                    sessionId, currentState, true, "Order wizard started successfully"
                );

                return ResponseEntity.ok(responseBody);
            } else {
                logger.error("❌ Failed to start StateMachine for sessionId: {}", sessionId);
                return ResponseEntity.status(500)
                    .body(new OrderWizardResponseDTO(sessionId, null, false, "Failed to start order wizard"));
            }

        } catch (RuntimeException e) {
            logger.error("💥 Exception in OrderWizardAdapter.startOrderWizard(): {}", e.getMessage(), e);

            return ResponseEntity.status(500)
                .body(new OrderWizardResponseDTO(null, null, false,
                    "Internal error: " + e.getMessage()));
        }
    }

    /**
     * Отримує поточний стан Order Wizard.
     */
    @GetMapping("/session/{sessionId}/state")
    public ResponseEntity<OrderWizardResponseDTO> getCurrentState(@PathVariable String sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        return StateMachineUtils.getCurrentStateResponse(stateMachine, sessionId);
    }

    /**
     * Отримує всі можливі переходи з поточного стану.
     */
    @GetMapping("/session/{sessionId}/available-transitions")
    public ResponseEntity<Map<String, Object>> getAvailableTransitions(@PathVariable String sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        return StateMachineUtils.getAvailableTransitions(stateMachine, sessionId);
    }

    /**
     * Перехід до наступного етапу з Stage1 до Stage2.
     */
    @PostMapping("/session/{sessionId}/complete-stage1")
    public ResponseEntity<OrderWizardResponseDTO> completeStage1(@PathVariable String sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        return StateMachineUtils.processStateTransition(
            stateMachine,
            sessionId,
            OrderEvent.ORDER_INFO_COMPLETED,
            "Stage 1 completed successfully"
        );
    }

    /**
     * Перехід до Stage3 з Stage2.
     */
    @PostMapping("/session/{sessionId}/complete-stage2")
    public ResponseEntity<OrderWizardResponseDTO> completeStage2(@PathVariable String sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        return StateMachineUtils.processStateTransition(
            stateMachine,
            sessionId,
            OrderEvent.ITEMS_COMPLETED,
            "Stage 2 completed successfully"
        );
    }

    /**
     * Перехід до Stage4 з Stage3.
     */
    @PostMapping("/session/{sessionId}/complete-stage3")
    public ResponseEntity<OrderWizardResponseDTO> completeStage3(@PathVariable String sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        return StateMachineUtils.processStateTransition(
            stateMachine,
            sessionId,
            OrderEvent.ADDITIONAL_INFO_COMPLETED,
            "Stage 3 completed successfully"
        );
    }

    /**
     * Завершення Order Wizard.
     */
    @PostMapping("/session/{sessionId}/complete-order")
    public ResponseEntity<OrderWizardResponseDTO> completeOrder(@PathVariable String sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        return StateMachineUtils.processStateTransition(
            stateMachine,
            sessionId,
            OrderEvent.RECEIPT_GENERATED,
            "Order completed successfully"
        );
    }

    /**
     * Скасування Order Wizard.
     */
    @PostMapping("/session/{sessionId}/cancel")
    public ResponseEntity<OrderWizardResponseDTO> cancelOrder(@PathVariable String sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        return StateMachineUtils.processStateTransition(
            stateMachine,
            sessionId,
            OrderEvent.CANCEL_ORDER,
            "Order cancelled successfully"
        );
    }

    /**
     * Повернення на попередній етап.
     */
    @PostMapping("/session/{sessionId}/go-back")
    public ResponseEntity<OrderWizardResponseDTO> goBack(@PathVariable String sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        return StateMachineUtils.processStateTransition(
            stateMachine,
            sessionId,
            OrderEvent.GO_BACK,
            "Moved back to previous stage"
        );
    }

    /**
     * Отримання детальної інформації про поточну сесію.
     */
    @GetMapping("/session/{sessionId}/info")
    public ResponseEntity<Map<String, Object>> getSessionInfo(@PathVariable String sessionId) {
        StateMachine<OrderState, OrderEvent> stateMachine = getStateMachine(sessionId);
        return StateMachineUtils.getDetailedSessionInfo(stateMachine, sessionId);
    }

    /**
     * Очищення всіх активних сесій Order Wizard.
     * Використовується для вирішення проблем з валідацією sessionId.
     */
    @SuppressWarnings("unchecked")
    public void clearAllSessions() {
        logger.info("🧹 Clearing all StateMachine sessions...");
        try {
            if (stateMachineService != null) {
                // Отримуємо всі активні StateMachine IDs та звільняємо їх
                // Використовуємо рефлексію для доступу до внутрішніх структур DefaultStateMachineService
                try {
                    java.lang.reflect.Field machinesField = stateMachineService.getClass().getDeclaredField("machines");
                    machinesField.setAccessible(true);
                    java.util.Map<String, ?> machines = (java.util.Map<String, ?>) machinesField.get(stateMachineService);

                    if (machines != null && !machines.isEmpty()) {
                        logger.info("🔍 Found {} active sessions to clear", machines.size());

                        // Логуємо всі sessionId перед очищенням
                        for (String sessionId : machines.keySet()) {
                            logger.info("📋 Active session found: {}", sessionId);
                        }

                        // Створюємо копію ключів щоб уникнути ConcurrentModificationException
                        java.util.Set<String> sessionIds = new java.util.HashSet<>(machines.keySet());

                        for (String sessionId : sessionIds) {
                            try {
                                logger.info("🗑️ Releasing session: {}", sessionId);
                                stateMachineService.releaseStateMachine(sessionId);
                                logger.info("✅ Session {} released successfully", sessionId);
                            } catch (RuntimeException e) {
                                logger.warn("⚠️ Failed to release session {}: {}", sessionId, e.getMessage());
                            }
                        }

                        // Перевіряємо чи дійсно очистилися всі сесії
                        java.util.Map<String, ?> machinesAfter = (java.util.Map<String, ?>) machinesField.get(stateMachineService);
                        if (machinesAfter != null && !machinesAfter.isEmpty()) {
                            logger.warn("⚠️ {} sessions still remain after clearing:", machinesAfter.size());
                            for (String remainingId : machinesAfter.keySet()) {
                                logger.warn("🔍 Remaining session: {}", remainingId);
                            }

                            // Спробуємо очистити мапу напряму
                            try {
                                machinesAfter.clear();
                                logger.info("✅ Forced clear of remaining sessions");
                            } catch (RuntimeException clearError) {
                                logger.warn("⚠️ Could not force clear remaining sessions: {}", clearError.getMessage());
                            }
                        }

                        logger.info("✅ All {} sessions cleared successfully", sessionIds.size());
                    } else {
                        logger.info("ℹ️ No active sessions found to clear");
                    }

                    // Додатково спробуємо очистити кеш якщо він існує
                    try {
                        java.lang.reflect.Field cacheField = stateMachineService.getClass().getDeclaredField("cache");
                        cacheField.setAccessible(true);
                        Object cache = cacheField.get(stateMachineService);
                        if (cache != null && cache instanceof java.util.Map) {
                            java.util.Map<?, ?> cacheMap = (java.util.Map<?, ?>) cache;
                            cacheMap.clear();
                            logger.info("✅ StateMachine cache cleared");
                        }
                    } catch (NoSuchFieldException | IllegalAccessException cacheError) {
                        logger.debug("ℹ️ No cache field found or accessible: {}", cacheError.getMessage());
                    }

                } catch (NoSuchFieldException | IllegalAccessException | SecurityException reflectionError) {
                    logger.warn("⚠️ Could not access internal StateMachineService structure: {}", reflectionError.getMessage());
                    logger.info("✅ StateMachine service reset attempted (fallback)");
                }
            } else {
                logger.warn("⚠️ StateMachineService is null, cannot clear sessions");
            }
        } catch (RuntimeException e) {
            logger.error("❌ Error clearing StateMachine sessions: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to clear sessions", e);
        }
    }
}
