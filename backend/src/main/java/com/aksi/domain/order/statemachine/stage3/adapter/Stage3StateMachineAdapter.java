package com.aksi.domain.order.statemachine.stage3.adapter;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.stage3.dto.AdditionalInfoDTO;
import com.aksi.domain.order.statemachine.stage3.dto.DiscountConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParamsDTO;
import com.aksi.domain.order.statemachine.stage3.dto.PaymentConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.enums.Stage3State;
import com.aksi.domain.order.statemachine.stage3.service.Stage3CoordinationService;
import com.aksi.domain.order.statemachine.stage3.service.Stage3StateService.Stage3Context;
import com.aksi.domain.order.statemachine.stage3.validator.ValidationResult;

/**
 * REST API Adapter для Stage3 - Загальні параметри замовлення.
 * Надає HTTP ендпоінти для роботи з Stage3 state machine.
 *
 * ЕТАП 5.1: Adapter (REST API)
 * Дозволені імпорти: ТІЛЬКИ CoordinationService + DTO + енуми + Spring Web + Java стандартні
 * Заборонено: Прямі імпорти окремих Services (крім Coordination), Actions, Guards
 */
@RestController
@RequestMapping("/api/v1/order-wizard/stage3")
public class Stage3StateMachineAdapter {

    private final Stage3CoordinationService coordinationService;

    public Stage3StateMachineAdapter(Stage3CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    // ========== УПРАВЛІННЯ СЕСІЯМИ ==========

    /**
     * Створити нову сесію Stage3
     */
    @PostMapping("/sessions")
    public ResponseEntity<UUID> createSession(@RequestBody UUID orderId) {
        UUID sessionId = coordinationService.createSession(orderId);
        return ResponseEntity.ok(sessionId);
    }

    /**
     * Ініціалізувати Stage3 для сесії
     */
    @PostMapping("/sessions/{sessionId}/initialize")
    public ResponseEntity<Void> initializeStage3(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.initializeStage3(sessionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Отримати контекст сесії
     */
    @GetMapping("/sessions/{sessionId}/context")
    public ResponseEntity<Stage3Context> getSessionContext(@PathVariable UUID sessionId) {
        Stage3Context context = coordinationService.getSessionContext(sessionId);

        if (context == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(context);
    }

    /**
     * Отримати стан сесії
     */
    @GetMapping("/sessions/{sessionId}/state")
    public ResponseEntity<Stage3State> getSessionState(@PathVariable UUID sessionId) {
        Stage3State state = coordinationService.getSessionState(sessionId);

        if (state == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(state);
    }

    /**
     * Отримати прогрес сесії
     */
    @GetMapping("/sessions/{sessionId}/progress")
    public ResponseEntity<Integer> getSessionProgress(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        int progress = coordinationService.getCurrentProgress(sessionId);
        return ResponseEntity.ok(progress);
    }

    /**
     * Закрити сесію
     */
    @PostMapping("/sessions/{sessionId}/close")
    public ResponseEntity<Void> closeSession(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.closeSession(sessionId);
        return ResponseEntity.ok().build();
    }

    // ========== ПІДЕТАП 3.1: ПАРАМЕТРИ ВИКОНАННЯ ==========

    /**
     * Оновити параметри виконання
     */
    @PutMapping("/sessions/{sessionId}/execution-params")
    public ResponseEntity<ValidationResult> updateExecutionParams(
            @PathVariable UUID sessionId,
            @RequestBody ExecutionParamsDTO executionParams) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        // Валідація
        ValidationResult validationResult = coordinationService.validateExecutionParams(executionParams);
        if (!validationResult.isValid()) {
            return ResponseEntity.badRequest().body(validationResult);
        }

        // Оновлення
        coordinationService.updateExecutionParams(sessionId, executionParams);
        return ResponseEntity.ok(validationResult);
    }

    /**
     * Перевірити готовність параметрів виконання
     */
    @GetMapping("/sessions/{sessionId}/execution-params/ready")
    public ResponseEntity<Boolean> isExecutionParamsReady(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean ready = coordinationService.isExecutionParamsReady(sessionId);
        return ResponseEntity.ok(ready);
    }

    // ========== ПІДЕТАП 3.2: КОНФІГУРАЦІЯ ЗНИЖОК ==========

    /**
     * Оновити конфігурацію знижок
     */
    @PutMapping("/sessions/{sessionId}/discount-config")
    public ResponseEntity<ValidationResult> updateDiscountConfig(
            @PathVariable UUID sessionId,
            @RequestBody DiscountConfigurationDTO discountConfig) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        // Валідація
        ValidationResult validationResult = coordinationService.validateDiscountConfiguration(discountConfig);
        if (!validationResult.isValid()) {
            return ResponseEntity.badRequest().body(validationResult);
        }

        // Оновлення
        coordinationService.updateDiscountConfig(sessionId, discountConfig);
        return ResponseEntity.ok(validationResult);
    }

    /**
     * Перевірити готовність конфігурації знижок
     */
    @GetMapping("/sessions/{sessionId}/discount-config/ready")
    public ResponseEntity<Boolean> isDiscountConfigReady(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean ready = coordinationService.isDiscountConfigReady(sessionId);
        return ResponseEntity.ok(ready);
    }

    // ========== ПІДЕТАП 3.3: КОНФІГУРАЦІЯ ОПЛАТИ ==========

    /**
     * Оновити конфігурацію оплати
     */
    @PutMapping("/sessions/{sessionId}/payment-config")
    public ResponseEntity<ValidationResult> updatePaymentConfig(
            @PathVariable UUID sessionId,
            @RequestBody PaymentConfigurationDTO paymentConfig) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        // Валідація
        ValidationResult validationResult = coordinationService.validatePaymentConfiguration(paymentConfig);
        if (!validationResult.isValid()) {
            return ResponseEntity.badRequest().body(validationResult);
        }

        // Оновлення
        coordinationService.updatePaymentConfig(sessionId, paymentConfig);
        return ResponseEntity.ok(validationResult);
    }

    /**
     * Перевірити готовність конфігурації оплати
     */
    @GetMapping("/sessions/{sessionId}/payment-config/ready")
    public ResponseEntity<Boolean> isPaymentConfigReady(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean ready = coordinationService.isPaymentConfigReady(sessionId);
        return ResponseEntity.ok(ready);
    }

    // ========== ПІДЕТАП 3.4: ДОДАТКОВА ІНФОРМАЦІЯ ==========

    /**
     * Оновити додаткову інформацію
     */
    @PutMapping("/sessions/{sessionId}/additional-info")
    public ResponseEntity<ValidationResult> updateAdditionalInfo(
            @PathVariable UUID sessionId,
            @RequestBody AdditionalInfoDTO additionalInfo) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        // Валідація
        ValidationResult validationResult = coordinationService.validateAdditionalInfo(additionalInfo);
        if (!validationResult.isValid()) {
            return ResponseEntity.badRequest().body(validationResult);
        }

        // Оновлення
        coordinationService.updateAdditionalInfo(sessionId, additionalInfo);
        return ResponseEntity.ok(validationResult);
    }

    /**
     * Перевірити готовність додаткової інформації
     */
    @GetMapping("/sessions/{sessionId}/additional-info/ready")
    public ResponseEntity<Boolean> isAdditionalInfoReady(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean ready = coordinationService.isAdditionalInfoReady(sessionId);
        return ResponseEntity.ok(ready);
    }

    // ========== ЗАВЕРШЕННЯ STAGE3 ==========

    /**
     * Перевірити готовність Stage3 до завершення
     */
    @GetMapping("/sessions/{sessionId}/ready")
    public ResponseEntity<Boolean> isStage3Ready(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean ready = coordinationService.isStage3Ready(sessionId);
        return ResponseEntity.ok(ready);
    }

    /**
     * Валідувати всі підетапи
     */
    @GetMapping("/sessions/{sessionId}/validate-all")
    public ResponseEntity<ValidationResult> validateAllSubsteps(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ValidationResult result = coordinationService.validateAllSubstepsBySession(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Отримати наступний підетап
     */
    @GetMapping("/sessions/{sessionId}/next-substep")
    public ResponseEntity<Stage3State> getNextSubstep(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        Stage3State nextSubstep = coordinationService.getNextSubstep(sessionId);
        return ResponseEntity.ok(nextSubstep);
    }
}
