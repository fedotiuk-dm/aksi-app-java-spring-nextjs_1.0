package com.aksi.api;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.OrderFinalizationRequest;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.statemachine.stage4.adapter.Stage4StateMachineAdapter;
import com.aksi.domain.order.statemachine.stage4.dto.LegalAcceptanceDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderConfirmationDTO;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptConfigurationDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST API контроллер для Stage 4 - Підсумок і завершення замовлення.
 *
 * Відповідальність:
 * - Підтвердження замовлення і юридичне прийняття
 * - Генерація квитанцій і збереження підписів
 * - Завершення та фіналізація замовлення
 *
 * Принципи:
 * - Один файл = одна відповідальність (тільки Stage 4)
 * - Тонкий контроллер - тільки HTTP обробка
 * - Вся логіка винесена в адаптер
 */
@RestController
@RequestMapping("/v1/order-wizard/stage4")
@Tag(name = "Order Wizard - Stage 4", description = "Етап 4: Підсумок і завершення замовлення")
public class Stage4Controller {

    private final Stage4StateMachineAdapter stage4Adapter;

    public Stage4Controller(Stage4StateMachineAdapter stage4Adapter) {
        this.stage4Adapter = stage4Adapter;
    }

    // ========== УПРАВЛІННЯ СЕСІЯМИ ==========

    @Operation(
        summary = "Ініціалізація Stage4 для замовлення",
        operationId = "stage4InitializeStage",
        tags = {"Order Wizard - Stage 4", "Session Management"}
    )
    @PostMapping("/initialize/{orderId}")
    public ResponseEntity<?> initializeStage4(@PathVariable UUID orderId) {
        return stage4Adapter.initializeStage4(orderId);
    }

    @Operation(
        summary = "Отримання поточного контексту сесії",
        operationId = "stage4GetSessionContext",
        tags = {"Order Wizard - Stage 4", "Session Management"}
    )
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getSessionContext(@PathVariable UUID sessionId) {
        return stage4Adapter.getSessionContext(sessionId);
    }

    @Operation(
        summary = "Отримання поточного стану Stage4",
        operationId = "stage4GetCurrentState",
        tags = {"Order Wizard - Stage 4", "Session Management"}
    )
    @GetMapping("/session/{sessionId}/state")
    public ResponseEntity<?> getCurrentState(@PathVariable UUID sessionId) {
        return stage4Adapter.getCurrentState(sessionId);
    }

    // ========== ВАЛІДАЦІЯ ==========

    @Operation(
        summary = "Валідація підтвердження замовлення",
        operationId = "stage4ValidateOrderConfirmation",
        tags = {"Order Wizard - Stage 4", "Validation"}
    )
    @PostMapping("/validate/order-confirmation")
    public ResponseEntity<?> validateOrderConfirmation(@RequestBody OrderConfirmationDTO orderConfirmation) {
        return stage4Adapter.validateOrderConfirmation(orderConfirmation);
    }

    @Operation(
        summary = "Валідація юридичного прийняття",
        operationId = "stage4ValidateLegalAcceptance",
        tags = {"Order Wizard - Stage 4", "Validation"}
    )
    @PostMapping("/validate/legal-acceptance")
    public ResponseEntity<?> validateLegalAcceptance(@RequestBody LegalAcceptanceDTO legalAcceptance) {
        return stage4Adapter.validateLegalAcceptance(legalAcceptance);
    }

    @Operation(
        summary = "Валідація конфігурації квитанції",
        operationId = "stage4ValidateReceiptConfiguration",
        tags = {"Order Wizard - Stage 4", "Validation"}
    )
    @PostMapping("/validate/receipt-configuration")
    public ResponseEntity<?> validateReceiptConfiguration(@RequestBody ReceiptConfigurationDTO receiptConfiguration) {
        return stage4Adapter.validateReceiptConfiguration(receiptConfiguration);
    }

    @Operation(
        summary = "Валідація завершення замовлення",
        operationId = "stage4ValidateOrderCompletion",
        tags = {"Order Wizard - Stage 4", "Validation"}
    )
    @PostMapping("/validate/order-completion")
    public ResponseEntity<?> validateOrderCompletion(@RequestBody OrderCompletionDTO orderCompletion) {
        return stage4Adapter.validateOrderCompletion(orderCompletion);
    }

    @Operation(
        summary = "Повна валідація Stage4",
        operationId = "stage4ValidateComplete",
        tags = {"Order Wizard - Stage 4", "Validation"}
    )
    @GetMapping("/validate/complete/{sessionId}")
    public ResponseEntity<?> validateComplete(@PathVariable UUID sessionId) {
        return stage4Adapter.validateComplete(sessionId);
    }

    // ========== ОНОВЛЕННЯ ДАНИХ ==========

    @Operation(
        summary = "Оновлення підтвердження замовлення",
        operationId = "stage4UpdateOrderConfirmation",
        tags = {"Order Wizard - Stage 4", "Order Confirmation"}
    )
    @PostMapping("/session/{sessionId}/order-confirmation")
    public ResponseEntity<?> updateOrderConfirmation(
            @PathVariable UUID sessionId,
            @RequestBody OrderConfirmationDTO orderConfirmation) {
        return stage4Adapter.updateOrderConfirmation(sessionId, orderConfirmation);
    }

    @Operation(
        summary = "Оновлення юридичного прийняття",
        operationId = "stage4UpdateLegalAcceptance",
        tags = {"Order Wizard - Stage 4", "Legal Acceptance"}
    )
    @PostMapping("/session/{sessionId}/legal-acceptance")
    public ResponseEntity<?> updateLegalAcceptance(
            @PathVariable UUID sessionId,
            @RequestBody LegalAcceptanceDTO legalAcceptance) {
        return stage4Adapter.updateLegalAcceptance(sessionId, legalAcceptance);
    }

    @Operation(
        summary = "Оновлення конфігурації квитанції",
        operationId = "stage4UpdateReceiptConfiguration",
        tags = {"Order Wizard - Stage 4", "Receipt Configuration"}
    )
    @PostMapping("/session/{sessionId}/receipt-configuration")
    public ResponseEntity<?> updateReceiptConfiguration(
            @PathVariable UUID sessionId,
            @RequestBody ReceiptConfigurationDTO receiptConfiguration) {
        return stage4Adapter.updateReceiptConfiguration(sessionId, receiptConfiguration);
    }

    @Operation(
        summary = "Оновлення завершення замовлення",
        operationId = "stage4UpdateOrderCompletion",
        tags = {"Order Wizard - Stage 4", "Order Completion"}
    )
    @PostMapping("/session/{sessionId}/order-completion")
    public ResponseEntity<?> updateOrderCompletion(
            @PathVariable UUID sessionId,
            @RequestBody OrderCompletionDTO orderCompletion) {
        return stage4Adapter.updateOrderCompletion(sessionId, orderCompletion);
    }

    // ========== ПІДСУМОК ТА ЗВІТИ ==========

    @Operation(
        summary = "Отримання детального підсумку замовлення",
        operationId = "stage4GetOrderSummary",
        tags = {"Order Wizard - Stage 4", "Order Summary"}
    )
    @GetMapping("/order/{orderId}/summary")
    public ResponseEntity<?> getOrderSummary(@PathVariable UUID orderId) {
        return stage4Adapter.getOrderSummary(orderId);
    }

    @Operation(
        summary = "Генерація квитанції",
        operationId = "stage4GenerateReceipt",
        tags = {"Order Wizard - Stage 4", "Receipt Generation"}
    )
    @PostMapping("/receipt/generate")
    public ResponseEntity<?> generateReceipt(@RequestBody ReceiptGenerationRequest request) {
        return stage4Adapter.generateReceipt(request);
    }

    @Operation(
        summary = "Генерація PDF квитанції",
        operationId = "stage4GeneratePdfReceipt",
        tags = {"Order Wizard - Stage 4", "Receipt Generation"}
    )
    @PostMapping("/receipt/generate-pdf")
    public ResponseEntity<?> generatePdfReceipt(@RequestBody ReceiptGenerationRequest request) {
        return stage4Adapter.generatePdfReceipt(request);
    }

    // ========== ПІДПИСИ ТА ЗАВЕРШЕННЯ ==========

    @Operation(
        summary = "Збереження підпису клієнта",
        operationId = "stage4SaveSignature",
        tags = {"Order Wizard - Stage 4", "Customer Signature"}
    )
    @PostMapping("/signature/save")
    public ResponseEntity<?> saveSignature(@RequestBody CustomerSignatureRequest request) {
        return stage4Adapter.saveSignature(request);
    }

    @Operation(
        summary = "Фіналізація замовлення",
        operationId = "stage4FinalizeOrder",
        tags = {"Order Wizard - Stage 4", "Order Finalization"}
    )
    @PostMapping("/finalize")
    public ResponseEntity<?> finalizeOrder(@RequestBody OrderFinalizationRequest request) {
        return stage4Adapter.finalizeOrder(request);
    }

    @Operation(
        summary = "Закриття сесії",
        operationId = "stage4CloseSession",
        tags = {"Order Wizard - Stage 4", "Session Management"}
    )
    @PostMapping("/session/{sessionId}/close")
    public ResponseEntity<?> closeSession(@PathVariable UUID sessionId) {
        return stage4Adapter.closeSession(sessionId);
    }
}
