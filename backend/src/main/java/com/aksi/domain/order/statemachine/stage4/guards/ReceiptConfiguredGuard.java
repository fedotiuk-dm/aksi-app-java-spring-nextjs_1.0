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
 * Guard для перевірки конфігурації квитанції.
 * Дозволяє перехід від RECEIPT_CONFIGURATION до ORDER_COMPLETION.
 * Використовує сучасні Java практики для безпечної роботи з контекстом.
 */
@Component
public class ReceiptConfiguredGuard implements Guard<Stage4State, Stage4Event> {

    private final Stage4ValidationService validationService;

    public ReceiptConfiguredGuard(Stage4ValidationService validationService) {
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

            // Перевіряємо валідність конфігурації квитанції
            if (stage4Context.getReceiptConfiguration() == null) {
                return false;
            }

            return validationService.validateReceiptConfiguration(stage4Context.getReceiptConfiguration()).isValid();

        } catch (Exception e) {
            // Логуємо помилку та повертаємо false
            return false;
        }
    }
}
