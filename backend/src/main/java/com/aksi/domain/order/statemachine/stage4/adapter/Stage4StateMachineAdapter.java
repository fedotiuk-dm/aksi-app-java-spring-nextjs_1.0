package com.aksi.domain.order.statemachine.stage4.adapter;

import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.CustomerSignatureRequest;
import com.aksi.domain.order.dto.OrderDetailedSummaryResponse;
import com.aksi.domain.order.dto.OrderFinalizationRequest;
import com.aksi.domain.order.dto.receipt.ReceiptDTO;
import com.aksi.domain.order.dto.receipt.ReceiptGenerationRequest;
import com.aksi.domain.order.statemachine.stage4.dto.LegalAcceptanceDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderCompletionDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderConfirmationDTO;
import com.aksi.domain.order.statemachine.stage4.dto.ReceiptConfigurationDTO;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;
import com.aksi.domain.order.statemachine.stage4.service.Stage4CoordinationService;
import com.aksi.domain.order.statemachine.stage4.service.Stage4StateService.Stage4Context;
import com.aksi.domain.order.statemachine.stage4.validator.ValidationResult;

/**
 * REST API адаптер для Stage4 State Machine.
 * Всі операції делегуються до CoordinationService.
 */
@RestController
@RequestMapping("/api/order-wizard/stage4")
public class Stage4StateMachineAdapter {

    private final Stage4CoordinationService coordinationService;

    public Stage4StateMachineAdapter(Stage4CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    // ========== Управління сесіями ==========

    /**
     * Ініціалізація Stage4 для замовлення.
     */
    @PostMapping("/initialize/{orderId}")
    public ResponseEntity<?> initializeStage4(@PathVariable UUID orderId) {
        try {
            UUID sessionId = coordinationService.initializeStage4WithValidation(orderId);
            return ResponseEntity.ok().body(new SessionResponse(sessionId, "Stage4 ініціалізовано"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Помилка ініціалізації: " + e.getMessage()));
        }
    }

    /**
     * Отримання поточного контексту сесії.
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getSessionContext(@PathVariable UUID sessionId) {
        Optional<Stage4Context> contextOpt = coordinationService.getSessionContext(sessionId);
        if (contextOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(contextOpt.get());
    }

    /**
     * Отримання поточного стану Stage4.
     */
    @GetMapping("/session/{sessionId}/state")
    public ResponseEntity<?> getCurrentState(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }
        Stage4State currentState = coordinationService.getCurrentState(sessionId);
        return ResponseEntity.ok().body(new StateResponse(currentState));
    }

    // ========== Валідація ==========

    /**
     * Валідація підтвердження замовлення.
     */
    @PostMapping("/validate/order-confirmation")
    public ResponseEntity<ValidationResponse> validateOrderConfirmation(
            @RequestBody OrderConfirmationDTO orderConfirmation) {
        ValidationResult result = coordinationService.validateOrderConfirmation(orderConfirmation);
        return ResponseEntity.ok(new ValidationResponse(result));
    }

    /**
     * Валідація юридичного прийняття.
     */
    @PostMapping("/validate/legal-acceptance")
    public ResponseEntity<ValidationResponse> validateLegalAcceptance(
            @RequestBody LegalAcceptanceDTO legalAcceptance) {
        ValidationResult result = coordinationService.validateLegalAcceptance(legalAcceptance);
        return ResponseEntity.ok(new ValidationResponse(result));
    }

    /**
     * Валідація конфігурації квитанції.
     */
    @PostMapping("/validate/receipt-configuration")
    public ResponseEntity<ValidationResponse> validateReceiptConfiguration(
            @RequestBody ReceiptConfigurationDTO receiptConfiguration) {
        ValidationResult result = coordinationService.validateReceiptConfiguration(receiptConfiguration);
        return ResponseEntity.ok(new ValidationResponse(result));
    }

    /**
     * Валідація завершення замовлення.
     */
    @PostMapping("/validate/order-completion")
    public ResponseEntity<ValidationResponse> validateOrderCompletion(
            @RequestBody OrderCompletionDTO orderCompletion) {
        ValidationResult result = coordinationService.validateOrderCompletion(orderCompletion);
        return ResponseEntity.ok(new ValidationResponse(result));
    }

    /**
     * Повна валідація Stage4.
     */
    @GetMapping("/validate/complete/{sessionId}")
    public ResponseEntity<ValidationResponse> validateComplete(@PathVariable UUID sessionId) {
        ValidationResult result = coordinationService.validateComplete(sessionId);
        return ResponseEntity.ok(new ValidationResponse(result));
    }

    // ========== Оновлення даних ==========

    /**
     * Оновлення підтвердження замовлення.
     */
    @PostMapping("/session/{sessionId}/order-confirmation")
    public ResponseEntity<?> updateOrderConfirmation(
            @PathVariable UUID sessionId,
            @RequestBody OrderConfirmationDTO orderConfirmation) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ValidationResult validation = coordinationService.validateOrderConfirmation(orderConfirmation);
        if (!validation.isValid()) {
            return ResponseEntity.badRequest().body(new ValidationResponse(validation));
        }

        coordinationService.updateOrderConfirmation(sessionId, orderConfirmation);
        return ResponseEntity.ok().body(new SuccessResponse("Підтвердження замовлення оновлено"));
    }

    /**
     * Оновлення юридичного прийняття.
     */
    @PostMapping("/session/{sessionId}/legal-acceptance")
    public ResponseEntity<?> updateLegalAcceptance(
            @PathVariable UUID sessionId,
            @RequestBody LegalAcceptanceDTO legalAcceptance) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ValidationResult validation = coordinationService.validateLegalAcceptance(legalAcceptance);
        if (!validation.isValid()) {
            return ResponseEntity.badRequest().body(new ValidationResponse(validation));
        }

        coordinationService.updateLegalAcceptance(sessionId, legalAcceptance);
        return ResponseEntity.ok().body(new SuccessResponse("Юридичне прийняття оновлено"));
    }

    /**
     * Оновлення конфігурації квитанції.
     */
    @PostMapping("/session/{sessionId}/receipt-configuration")
    public ResponseEntity<?> updateReceiptConfiguration(
            @PathVariable UUID sessionId,
            @RequestBody ReceiptConfigurationDTO receiptConfiguration) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ValidationResult validation = coordinationService.validateReceiptConfiguration(receiptConfiguration);
        if (!validation.isValid()) {
            return ResponseEntity.badRequest().body(new ValidationResponse(validation));
        }

        coordinationService.updateReceiptConfiguration(sessionId, receiptConfiguration);
        return ResponseEntity.ok().body(new SuccessResponse("Конфігурація квитанції оновлена"));
    }

    /**
     * Оновлення завершення замовлення.
     */
    @PostMapping("/session/{sessionId}/order-completion")
    public ResponseEntity<?> updateOrderCompletion(
            @PathVariable UUID sessionId,
            @RequestBody OrderCompletionDTO orderCompletion) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ValidationResult validation = coordinationService.validateOrderCompletion(orderCompletion);
        if (!validation.isValid()) {
            return ResponseEntity.badRequest().body(new ValidationResponse(validation));
        }

        coordinationService.updateOrderCompletion(sessionId, orderCompletion);
        return ResponseEntity.ok().body(new SuccessResponse("Завершення замовлення оновлено"));
    }

    // ========== Бізнес-операції ==========

    /**
     * Отримання детального підсумку замовлення.
     */
    @GetMapping("/order/{orderId}/summary")
    public ResponseEntity<?> getOrderSummary(@PathVariable UUID orderId) {
        if (!coordinationService.orderExists(orderId)) {
            return ResponseEntity.notFound().build();
        }

        OrderDetailedSummaryResponse summary = coordinationService.getOrderDetailedSummary(orderId);
        return ResponseEntity.ok(summary);
    }

    /**
     * Генерація квитанції.
     */
    @PostMapping("/receipt/generate")
    public ResponseEntity<?> generateReceipt(@RequestBody ReceiptGenerationRequest request) {
        try {
            ReceiptDTO receipt = coordinationService.generateReceipt(request);
            return ResponseEntity.ok(receipt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Помилка генерації квитанції: " + e.getMessage()));
        }
    }

    /**
     * Генерація PDF квитанції.
     */
    @PostMapping("/receipt/generate-pdf")
    public ResponseEntity<?> generatePdfReceipt(@RequestBody ReceiptGenerationRequest request) {
        try {
            byte[] pdfBytes = coordinationService.generatePdfReceiptBytes(request);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=receipt.pdf")
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Помилка генерації PDF: " + e.getMessage()));
        }
    }

    /**
     * Збереження підпису клієнта.
     */
    @PostMapping("/signature/save")
    public ResponseEntity<?> saveSignature(@RequestBody CustomerSignatureRequest request) {
        try {
            coordinationService.saveSignature(request);
            return ResponseEntity.ok().body(new SuccessResponse("Підпис збережено"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Помилка збереження підпису: " + e.getMessage()));
        }
    }

    /**
     * Фіналізація замовлення.
     */
    @PostMapping("/finalize")
    public ResponseEntity<?> finalizeOrder(@RequestBody OrderFinalizationRequest request) {
        try {
            coordinationService.finalizeOrder(request);
            return ResponseEntity.ok().body(new SuccessResponse("Замовлення завершено"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Помилка завершення замовлення: " + e.getMessage()));
        }
    }

    /**
     * Закриття сесії.
     */
    @PostMapping("/session/{sessionId}/close")
    public ResponseEntity<?> closeSession(@PathVariable UUID sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.closeSession(sessionId);
        return ResponseEntity.ok().body(new SuccessResponse("Сесія закрита"));
    }

    // ========== Допоміжні DTO ==========

    private record SessionResponse(UUID sessionId, String message) {}
    private record StateResponse(Stage4State state) {}
    private record SuccessResponse(String message) {}
    private record ErrorResponse(String error) {}

    public record ValidationResponse(boolean isValid, String message, java.util.List<String> errors) {
        public ValidationResponse(ValidationResult result) {
            this(result.isValid(),
                 result.isValid() ? "Валідація пройшла успішно" : "Валідація не пройшла",
                 result.getErrorMessages());
        }
    }
}
