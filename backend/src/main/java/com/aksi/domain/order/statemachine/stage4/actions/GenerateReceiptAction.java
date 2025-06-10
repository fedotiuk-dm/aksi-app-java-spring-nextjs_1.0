package com.aksi.domain.order.statemachine.stage4.actions;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.enums.Stage4Event;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;
import com.aksi.domain.order.statemachine.stage4.service.Stage4CoordinationService;
import com.aksi.domain.order.statemachine.stage4.service.Stage4StateService.Stage4Context;
import com.aksi.domain.order.statemachine.stage4.util.Stage4ActionErrorHandler;
import com.aksi.domain.order.statemachine.stage4.util.Stage4ContextExtractor;

/**
 * Action для генерації квитанції.
 * Виконується при переході до стану RECEIPT_GENERATED.
 * Використовує сучасні Java практики для безпечної роботи з контекстом.
 */
@Component
public class GenerateReceiptAction implements Action<Stage4State, Stage4Event> {

    private final Stage4CoordinationService coordinationService;

    public GenerateReceiptAction(Stage4CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<Stage4State, Stage4Event> context) {
        Stage4ActionErrorHandler.executeWithErrorHandling(
            context,
            () -> performReceiptGeneration(context),
            "receiptGenerationError",
            "Помилка генерації квитанції"
        );
    }

    /**
     * Виконує генерацію квитанції з використанням безпечних extractors.
     */
    private void performReceiptGeneration(StateContext<Stage4State, Stage4Event> context) {
        // Отримуємо обов'язкові параметри з контексту
        UUID sessionId = Stage4ContextExtractor.extractRequiredUUID(context, "sessionId");
        UUID orderId = Stage4ContextExtractor.extractRequiredUUID(context, "orderId");

        // Отримуємо опціональні параметри генерації квитанції з значеннями за замовчуванням
        Boolean sendByEmail = Stage4ContextExtractor.extractBooleanOrDefault(context, "sendByEmail", false);
        Boolean generatePrintable = Stage4ContextExtractor.extractBooleanOrDefault(context, "generatePrintable", true);

        // Генеруємо квитанцію через координатор
        Stage4Context updatedContext = coordinationService.generateReceipt(
                sessionId, orderId, sendByEmail, generatePrintable);

        // Оновлюємо контекст в Extended State
        Stage4ContextExtractor.storeValue(context, "stage4Context", updatedContext);
    }
}
