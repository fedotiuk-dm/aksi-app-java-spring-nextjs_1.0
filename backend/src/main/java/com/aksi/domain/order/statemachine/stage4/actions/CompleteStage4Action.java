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
 * Action для завершення Stage4.
 * Виконується при переході до стану STAGE4_COMPLETED.
 * Використовує сучасні Java практики для безпечної роботи з контекстом.
 */
@Component
public class CompleteStage4Action implements Action<Stage4State, Stage4Event> {

    private final Stage4CoordinationService coordinationService;

    public CompleteStage4Action(Stage4CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<Stage4State, Stage4Event> context) {
        Stage4ActionErrorHandler.executeWithErrorHandling(
            context,
            () -> performStage4Completion(context),
            "completionError",
            "Помилка завершення Stage4"
        );
    }

    /**
     * Виконує завершення Stage4 з використанням безпечних extractors.
     */
    private void performStage4Completion(StateContext<Stage4State, Stage4Event> context) {
        // Отримуємо обов'язкові параметри з контексту
        UUID sessionId = Stage4ContextExtractor.extractRequiredUUID(context, "sessionId");
        UUID orderId = Stage4ContextExtractor.extractRequiredUUID(context, "orderId");

        // Отримуємо опціональні параметри завершення з значеннями за замовчуванням
        String signatureData = Stage4ContextExtractor.extractStringOrDefault(context, "finalSignatureData", "");
        Boolean sendByEmail = Stage4ContextExtractor.extractBooleanOrDefault(context, "sendByEmail", false);
        Boolean generatePrintable = Stage4ContextExtractor.extractBooleanOrDefault(context, "generatePrintable", true);
        String comments = Stage4ContextExtractor.extractStringOrDefault(context, "finalComments", "");

        // Завершуємо замовлення через координатор
        Stage4Context finalContext = coordinationService.completeOrder(
                sessionId, orderId, signatureData, sendByEmail, generatePrintable, comments);

        // Оновлюємо контекст в Extended State
        Stage4ContextExtractor.storeValue(context, "stage4Context", finalContext);

        // Встановлюємо прапор завершення
        Stage4ContextExtractor.storeValue(context, "stage4Completed", true);
    }
}
