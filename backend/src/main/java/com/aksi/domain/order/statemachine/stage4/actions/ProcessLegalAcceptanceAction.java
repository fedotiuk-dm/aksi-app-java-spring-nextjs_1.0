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
 * Action для обробки юридичного прийняття.
 * Виконується при переході до стану LEGAL_ACCEPTANCE_COMPLETED.
 * Використовує сучасні Java практики для безпечної роботи з контекстом.
 */
@Component
public class ProcessLegalAcceptanceAction implements Action<Stage4State, Stage4Event> {

    private final Stage4CoordinationService coordinationService;

    public ProcessLegalAcceptanceAction(Stage4CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<Stage4State, Stage4Event> context) {
        Stage4ActionErrorHandler.executeWithErrorHandling(
            context,
            () -> performLegalAcceptanceProcessing(context),
            "legalAcceptanceError",
            "Помилка обробки юридичного прийняття"
        );
    }

    /**
     * Виконує обробку юридичного прийняття з використанням безпечних extractors.
     */
    private void performLegalAcceptanceProcessing(StateContext<Stage4State, Stage4Event> context) {
        // Отримуємо обов'язкові параметри з контексту
        UUID sessionId = Stage4ContextExtractor.extractRequiredUUID(context, "sessionId");
        UUID orderId = Stage4ContextExtractor.extractRequiredUUID(context, "orderId");
        String signatureData = Stage4ContextExtractor.extractRequiredString(context, "signatureData");
        Boolean termsAccepted = Stage4ContextExtractor.extractRequiredBoolean(context, "termsAccepted");

        // Обробляємо юридичне прийняття через координатор
        Stage4Context updatedContext = coordinationService.processLegalAcceptance(
                sessionId, orderId, signatureData, termsAccepted);

        // Оновлюємо контекст в Extended State
        Stage4ContextExtractor.storeValue(context, "stage4Context", updatedContext);
    }
}
