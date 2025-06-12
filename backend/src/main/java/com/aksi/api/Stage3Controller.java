package com.aksi.api;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.stage3.adapter.Stage3StateMachineAdapter;
import com.aksi.domain.order.statemachine.stage3.dto.AdditionalInfoDTO;
import com.aksi.domain.order.statemachine.stage3.dto.DiscountConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParamsDTO;
import com.aksi.domain.order.statemachine.stage3.dto.PaymentConfigurationDTO;
import com.aksi.domain.order.statemachine.stage3.enums.Stage3State;
import com.aksi.domain.order.statemachine.stage3.service.Stage3StateService.Stage3Context;
import com.aksi.domain.order.statemachine.stage3.validator.ValidationResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST API контроллер для Stage 3 - Загальні параметри замовлення.
 *
 * Відповідальність:
 * - Управління сесіями Stage 3
 * - Параметри виконання, знижки, оплата, додаткова інформація
 * - Валідація та координація підетапів
 *
 * Принципи:
 * - Один файл = одна відповідальність (тільки Stage 3)
 * - Тонкий контроллер - тільки HTTP обробка
 * - Вся логіка винесена в адаптер
 */
@RestController
@RequestMapping("/v1/order-wizard/stage3")
@Tag(name = "Order Wizard - Stage 3", description = "Етап 3: Загальні параметри замовлення")
public class Stage3Controller {

    private final Stage3StateMachineAdapter stage3Adapter;

    public Stage3Controller(Stage3StateMachineAdapter stage3Adapter) {
        this.stage3Adapter = stage3Adapter;
    }

    // ========== УПРАВЛІННЯ СЕСІЯМИ ==========

    @Operation(
        summary = "Створити нову сесію Stage3",
        operationId = "stage3CreateSession",
        tags = {"Order Wizard - Stage 3", "Session Management"}
    )
    @PostMapping("/sessions")
    public ResponseEntity<UUID> createSession(@RequestBody UUID orderId) {
        return stage3Adapter.createSession(orderId);
    }

    @Operation(
        summary = "Ініціалізувати Stage3 для сесії",
        operationId = "stage3InitializeStage",
        tags = {"Order Wizard - Stage 3", "Session Management"}
    )
    @PostMapping("/sessions/{sessionId}/initialize")
    public ResponseEntity<Void> initializeStage3(@PathVariable UUID sessionId) {
        return stage3Adapter.initializeStage3(sessionId);
    }

    @Operation(
        summary = "Отримати контекст сесії",
        operationId = "stage3GetSessionContext",
        tags = {"Order Wizard - Stage 3", "Session Management"}
    )
    @GetMapping("/sessions/{sessionId}/context")
    public ResponseEntity<Stage3Context> getSessionContext(@PathVariable UUID sessionId) {
        return stage3Adapter.getSessionContext(sessionId);
    }

    @Operation(
        summary = "Отримати стан сесії",
        operationId = "stage3GetSessionState",
        tags = {"Order Wizard - Stage 3", "Session Management"}
    )
    @GetMapping("/sessions/{sessionId}/state")
    public ResponseEntity<Stage3State> getSessionState(@PathVariable UUID sessionId) {
        return stage3Adapter.getSessionState(sessionId);
    }

    @Operation(
        summary = "Отримати прогрес сесії",
        operationId = "stage3GetSessionProgress",
        tags = {"Order Wizard - Stage 3", "Session Management"}
    )
    @GetMapping("/sessions/{sessionId}/progress")
    public ResponseEntity<Integer> getSessionProgress(@PathVariable UUID sessionId) {
        return stage3Adapter.getSessionProgress(sessionId);
    }

    @Operation(
        summary = "Закрити сесію",
        operationId = "stage3CloseSession",
        tags = {"Order Wizard - Stage 3", "Session Management"}
    )
    @PostMapping("/sessions/{sessionId}/close")
    public ResponseEntity<Void> closeSession(@PathVariable UUID sessionId) {
        return stage3Adapter.closeSession(sessionId);
    }

    // ========== ПІДЕТАП 3.1: ПАРАМЕТРИ ВИКОНАННЯ ==========

    @Operation(
        summary = "Оновити параметри виконання",
        operationId = "stage3UpdateExecutionParams",
        tags = {"Order Wizard - Stage 3", "Execution Parameters"}
    )
    @PutMapping("/sessions/{sessionId}/execution-params")
    public ResponseEntity<ValidationResult> updateExecutionParams(
            @PathVariable UUID sessionId,
            @RequestBody ExecutionParamsDTO executionParams) {
        return stage3Adapter.updateExecutionParams(sessionId, executionParams);
    }

    @Operation(
        summary = "Перевірити готовність параметрів виконання",
        operationId = "stage3IsExecutionParamsReady",
        tags = {"Order Wizard - Stage 3", "Execution Parameters"}
    )
    @GetMapping("/sessions/{sessionId}/execution-params/ready")
    public ResponseEntity<Boolean> isExecutionParamsReady(@PathVariable UUID sessionId) {
        return stage3Adapter.isExecutionParamsReady(sessionId);
    }

    // ========== ПІДЕТАП 3.2: КОНФІГУРАЦІЯ ЗНИЖОК ==========

    @Operation(
        summary = "Оновити конфігурацію знижок",
        operationId = "stage3UpdateDiscountConfig",
        tags = {"Order Wizard - Stage 3", "Discount Configuration"}
    )
    @PutMapping("/sessions/{sessionId}/discount-config")
    public ResponseEntity<ValidationResult> updateDiscountConfig(
            @PathVariable UUID sessionId,
            @RequestBody DiscountConfigurationDTO discountConfig) {
        return stage3Adapter.updateDiscountConfig(sessionId, discountConfig);
    }

    @Operation(
        summary = "Перевірити готовність конфігурації знижок",
        operationId = "stage3IsDiscountConfigReady",
        tags = {"Order Wizard - Stage 3", "Discount Configuration"}
    )
    @GetMapping("/sessions/{sessionId}/discount-config/ready")
    public ResponseEntity<Boolean> isDiscountConfigReady(@PathVariable UUID sessionId) {
        return stage3Adapter.isDiscountConfigReady(sessionId);
    }

    // ========== ПІДЕТАП 3.3: КОНФІГУРАЦІЯ ОПЛАТИ ==========

    @Operation(
        summary = "Оновити конфігурацію оплати",
        operationId = "stage3UpdatePaymentConfig",
        tags = {"Order Wizard - Stage 3", "Payment Configuration"}
    )
    @PutMapping("/sessions/{sessionId}/payment-config")
    public ResponseEntity<ValidationResult> updatePaymentConfig(
            @PathVariable UUID sessionId,
            @RequestBody PaymentConfigurationDTO paymentConfig) {
        return stage3Adapter.updatePaymentConfig(sessionId, paymentConfig);
    }

    @Operation(
        summary = "Перевірити готовність конфігурації оплати",
        operationId = "stage3IsPaymentConfigReady",
        tags = {"Order Wizard - Stage 3", "Payment Configuration"}
    )
    @GetMapping("/sessions/{sessionId}/payment-config/ready")
    public ResponseEntity<Boolean> isPaymentConfigReady(@PathVariable UUID sessionId) {
        return stage3Adapter.isPaymentConfigReady(sessionId);
    }

    // ========== ПІДЕТАП 3.4: ДОДАТКОВА ІНФОРМАЦІЯ ==========

    @Operation(
        summary = "Оновити додаткову інформацію",
        operationId = "stage3UpdateAdditionalInfo",
        tags = {"Order Wizard - Stage 3", "Additional Information"}
    )
    @PutMapping("/sessions/{sessionId}/additional-info")
    public ResponseEntity<ValidationResult> updateAdditionalInfo(
            @PathVariable UUID sessionId,
            @RequestBody AdditionalInfoDTO additionalInfo) {
        return stage3Adapter.updateAdditionalInfo(sessionId, additionalInfo);
    }

    @Operation(
        summary = "Перевірити готовність додаткової інформації",
        operationId = "stage3IsAdditionalInfoReady",
        tags = {"Order Wizard - Stage 3", "Additional Information"}
    )
    @GetMapping("/sessions/{sessionId}/additional-info/ready")
    public ResponseEntity<Boolean> isAdditionalInfoReady(@PathVariable UUID sessionId) {
        return stage3Adapter.isAdditionalInfoReady(sessionId);
    }

    // ========== ЗАГАЛЬНА ВАЛІДАЦІЯ ТА ЗАВЕРШЕННЯ ==========

    @Operation(
        summary = "Перевірити готовність Stage3",
        operationId = "stage3IsStageReady",
        tags = {"Order Wizard - Stage 3", "Stage Operations"}
    )
    @GetMapping("/sessions/{sessionId}/ready")
    public ResponseEntity<Boolean> isStage3Ready(@PathVariable UUID sessionId) {
        return stage3Adapter.isStage3Ready(sessionId);
    }

    @Operation(
        summary = "Валідувати всі підетапи",
        operationId = "stage3ValidateAllSubsteps",
        tags = {"Order Wizard - Stage 3", "Validation"}
    )
    @GetMapping("/sessions/{sessionId}/validate-all")
    public ResponseEntity<ValidationResult> validateAllSubsteps(@PathVariable UUID sessionId) {
        return stage3Adapter.validateAllSubsteps(sessionId);
    }

    @Operation(
        summary = "Отримати наступний підетап",
        operationId = "stage3GetNextSubstep",
        tags = {"Order Wizard - Stage 3", "Navigation"}
    )
    @GetMapping("/sessions/{sessionId}/next-substep")
    public ResponseEntity<Stage3State> getNextSubstep(@PathVariable UUID sessionId) {
        return stage3Adapter.getNextSubstep(sessionId);
    }
}
