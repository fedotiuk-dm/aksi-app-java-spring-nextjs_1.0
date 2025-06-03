package com.aksi.api;

import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.service.OrderWizardStateMachineService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST API контролер для Етапу 1 Order Wizard
 * Використовує реальні доменні DTO та працює з реальними даними
 */
@RestController
@RequestMapping("/api/order-wizard/stage1")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class OrderWizardStage1Controller {

    private final OrderWizardStateMachineService wizardService;

    /**
     * Етап 1.1: Збереження даних клієнта (використовує реальний ClientResponse)
     */
    @PostMapping("/{wizardId}/client")
    public ResponseEntity<?> submitClientData(
            @PathVariable String wizardId,
            @RequestBody ClientResponse client) {

        log.info("Етап 1.1: Збереження даних клієнта для wizard: {}", wizardId);

        try {
            Map<String, Object> eventData = Map.of("clientData", client);
            boolean success = wizardService.sendEvent(wizardId, OrderEvent.CLIENT_SELECTED, eventData);

            if (success) {
                OrderState newState = wizardService.getCurrentState(wizardId);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "newState", newState,
                    "message", "Дані клієнта збережено успішно"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Помилка валідації даних клієнта"
                ));
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Помилка збереження даних клієнта для wizard {}: {}", wizardId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Внутрішня помилка"));
        }
    }

    /**
     * Етап 1.2: Збереження базової інформації замовлення
     */
    @PostMapping("/{wizardId}/order-info")
    public ResponseEntity<?> submitOrderBasicInfo(
            @PathVariable String wizardId,
            @RequestBody OrderBasicInfoRequest orderRequest) {

        log.info("Етап 1.2: Збереження базової інформації замовлення для wizard: {}", wizardId);

        try {
            // Перетворюємо дані на Map для передачі в State Machine
            Map<String, Object> orderBasicInfo = Map.of(
                "branchId", orderRequest.branchId(),
                "uniqueTag", orderRequest.uniqueTag() != null ? orderRequest.uniqueTag() : ""
            );

            Map<String, Object> eventData = Map.of("orderBasicInfo", orderBasicInfo);
            boolean success = wizardService.sendEvent(wizardId, OrderEvent.ORDER_INFO_COMPLETED, eventData);

            if (success) {
                OrderState newState = wizardService.getCurrentState(wizardId);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "newState", newState,
                    "message", "Базова інформація замовлення збережена"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Помилка валідації базової інформації"
                ));
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Помилка збереження базової інформації для wizard {}: {}", wizardId, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Внутрішня помилка"));
        }
    }

    /**
     * Отримання поточних даних Етапу 1
     */
    @GetMapping("/{wizardId}/data")
    public ResponseEntity<?> getStage1Data(@PathVariable String wizardId) {
        try {
            OrderState currentState = wizardService.getCurrentState(wizardId);
            Map<Object, Object> wizardData = wizardService.getWizardData(wizardId);

            return ResponseEntity.ok(Map.of(
                "currentState", currentState,
                "wizardData", wizardData
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Помилка отримання даних Етапу 1 для wizard {}: {}", wizardId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Мінімальний DTO для базової інформації замовлення
     * Використовує record для простоти
     */
    public record OrderBasicInfoRequest(UUID branchId, String uniqueTag) {}
}
