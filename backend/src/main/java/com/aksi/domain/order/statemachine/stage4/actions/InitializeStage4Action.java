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
 * Action для ініціалізації Stage4.
 * Виконується при вході в стан STAGE4_INITIALIZED.
 * Використовує сучасні Java практики для безпечної роботи з контекстом.
 */
@Component
public class InitializeStage4Action implements Action<Stage4State, Stage4Event> {

    private final Stage4CoordinationService coordinationService;

    public InitializeStage4Action(Stage4CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<Stage4State, Stage4Event> context) {
        Stage4ActionErrorHandler.executeWithErrorHandling(
            context,
            () -> performInitialization(context),
            "initializationError",
            "Помилка ініціалізації Stage4"
        );
    }

    /**
     * Виконує ініціалізацію Stage4 з використанням безпечних extractors.
     */
    private void performInitialization(StateContext<Stage4State, Stage4Event> context) {
        // Отримуємо обов'язкові параметри з контексту використовуючи безпечні методи
        UUID sessionId = Stage4ContextExtractor.extractRequiredUUID(context, "sessionId");
        UUID orderId = Stage4ContextExtractor.extractRequiredUUID(context, "orderId");

        // Ініціалізуємо Stage4 через координатор
        Stage4Context stage4Context = coordinationService.initializeStage4(sessionId, orderId);

        // Зберігаємо контекст в Extended State для подальшого використання
        Stage4ContextExtractor.storeValue(context, "stage4Context", stage4Context);
    }
}
