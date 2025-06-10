package com.aksi.domain.order.statemachine.adapter;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.statemachine.StateMachine;
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
 */
@RestController
@RequestMapping("/api/order-wizard")
public class OrderWizardAdapter {

    private final StateMachine<OrderState, OrderEvent> orderWizardStateMachine;

    @Autowired
    public OrderWizardAdapter(
            @Qualifier("orderWizardMainStateMachine") StateMachine<OrderState, OrderEvent> orderWizardStateMachine) {
        this.orderWizardStateMachine = orderWizardStateMachine;
    }

    /**
     * Запускає новий Order Wizard.
     */
    @PostMapping("/start")
    public ResponseEntity<OrderWizardResponseDTO> startOrderWizard() {
        return StateMachineUtils.startOrderWizard(orderWizardStateMachine);
    }

    /**
     * Отримує поточний стан Order Wizard.
     */
    @GetMapping("/session/{sessionId}/state")
    public ResponseEntity<OrderWizardResponseDTO> getCurrentState(@PathVariable String sessionId) {
        return StateMachineUtils.getCurrentStateResponse(orderWizardStateMachine, sessionId);
    }

    /**
     * Отримує всі можливі переходи з поточного стану.
     */
    @GetMapping("/session/{sessionId}/available-transitions")
    public ResponseEntity<Map<String, Object>> getAvailableTransitions(@PathVariable String sessionId) {
        return StateMachineUtils.getAvailableTransitions(orderWizardStateMachine, sessionId);
    }

    /**
     * Перехід до наступного етапу з Stage1 до Stage2.
     */
    @PostMapping("/session/{sessionId}/complete-stage1")
    public ResponseEntity<OrderWizardResponseDTO> completeStage1(@PathVariable String sessionId) {
        return StateMachineUtils.processStateTransition(
            orderWizardStateMachine,
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
        return StateMachineUtils.processStateTransition(
            orderWizardStateMachine,
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
        return StateMachineUtils.processStateTransition(
            orderWizardStateMachine,
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
        return StateMachineUtils.processStateTransition(
            orderWizardStateMachine,
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
        return StateMachineUtils.processStateTransition(
            orderWizardStateMachine,
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
        return StateMachineUtils.processStateTransition(
            orderWizardStateMachine,
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
        return StateMachineUtils.getDetailedSessionInfo(orderWizardStateMachine, sessionId);
    }
}
