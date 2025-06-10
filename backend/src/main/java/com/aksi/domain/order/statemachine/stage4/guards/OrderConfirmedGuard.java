package com.aksi.domain.order.statemachine.stage4.guards;

import java.util.UUID;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.enums.Stage4Event;
import com.aksi.domain.order.statemachine.stage4.enums.Stage4State;
import com.aksi.domain.order.statemachine.stage4.service.Stage4StateService.Stage4Context;
import com.aksi.domain.order.statemachine.stage4.service.Stage4ValidationService;
import com.aksi.domain.order.statemachine.stage4.util.Stage4ContextExtractor;

/**
 * Guard для перевірки підтвердження замовлення.
 * Дозволяє перехід від ORDER_CONFIRMATION до LEGAL_ACCEPTANCE_PENDING.
 * Використовує сучасні Java практики для безпечної роботи з контекстом.
 */
@Component
public class OrderConfirmedGuard implements Guard<Stage4State, Stage4Event> {

    private final Stage4ValidationService validationService;

    public OrderConfirmedGuard(Stage4ValidationService validationService) {
        this.validationService = validationService;
    }

    @Override
    public boolean evaluate(StateContext<Stage4State, Stage4Event> context) {
        try {
            // Отримуємо sessionId з контексту State Machine використовуючи безпечний extractor
            UUID sessionId = Stage4ContextExtractor.extractUUIDOrNull(context, "sessionId");
            if (sessionId == null) {
                return false;
            }

            // Отримуємо Stage4Context з Extended State використовуючи безпечний extractor
            Stage4Context stage4Context = Stage4ContextExtractor.extractStage4ContextOrNull(context);
            if (stage4Context == null) {
                return false;
            }

            // Перевіряємо валідність підтвердження замовлення
            if (stage4Context.getOrderConfirmation() == null) {
                return false;
            }

            return validationService.validateOrderConfirmation(stage4Context.getOrderConfirmation()).isValid();

        } catch (Exception e) {
            // Логуємо помилку та повертаємо false
            return false;
        }
    }
}
