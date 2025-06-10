package com.aksi.domain.order.statemachine.stage4.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.enums.Stage4Event;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;
import com.aksi.domain.order.statemachine.stage4.service.Stage4StateService.Stage4Context;
import com.aksi.domain.order.statemachine.stage4.service.Stage4ValidationService;
import com.aksi.domain.order.statemachine.stage4.util.Stage4ContextExtractor;

/**
 * Guard для перевірки завершення юридичного прийняття.
 * Дозволяє перехід від LEGAL_ACCEPTANCE_PENDING до RECEIPT_CONFIGURATION.
 * Використовує сучасні Java практики для безпечної роботи з контекстом.
 */
@Component
public class LegalAcceptanceCompletedGuard implements Guard<Stage4State, Stage4Event> {

    private final Stage4ValidationService validationService;

    public LegalAcceptanceCompletedGuard(Stage4ValidationService validationService) {
        this.validationService = validationService;
    }

    @Override
    public boolean evaluate(StateContext<Stage4State, Stage4Event> context) {
        try {
            // Отримуємо Stage4Context з Extended State використовуючи безпечний extractor
            Stage4Context stage4Context = Stage4ContextExtractor.extractStage4ContextOrNull(context);
            if (stage4Context == null) {
                return false;
            }

            // Перевіряємо валідність юридичного прийняття
            if (stage4Context.getLegalAcceptance() == null) {
                return false;
            }

            return validationService.validateLegalAcceptance(stage4Context.getLegalAcceptance()).isValid();

        } catch (Exception e) {
            // Логуємо помилку та повертаємо false
            return false;
        }
    }
}
