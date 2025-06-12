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

            logger.info("🔧 Calling StateMachineUtils.startOrderWizard()...");

            ResponseEntity<OrderWizardResponseDTO> result = StateMachineUtils.startOrderWizard(stateMachine);

                        if (result != null && result.getBody() != null) {
                // Встановлюємо sessionId у відповіді
                OrderWizardResponseDTO responseBody = result.getBody();
                                if (responseBody != null) {
                    OrderWizardResponseDTO updatedResponse = new OrderWizardResponseDTO(
                        sessionId,
                        responseBody.getCurrentState(),
                        responseBody.isSuccess(),
                        responseBody.getMessage()
                    );

                    logger.info("✅ StateMachineUtils returned: status={}, sessionId={}, state={}",
                        result.getStatusCode(), sessionId, responseBody.getCurrentState());

                    return ResponseEntity.ok(updatedResponse);
                } else {
                    logger.error("❌ StateMachineUtils returned null responseBody!");
                    return ResponseEntity.status(500)
                        .body(new OrderWizardResponseDTO(sessionId, null, false,
                            "Failed to start Order Wizard - null response"));
                }
            } else {
                logger.error("❌ StateMachineUtils returned null!");
                return ResponseEntity.status(500)
                    .body(new OrderWizardResponseDTO(sessionId, null, false,
                        "Failed to start Order Wizard"));
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
}
