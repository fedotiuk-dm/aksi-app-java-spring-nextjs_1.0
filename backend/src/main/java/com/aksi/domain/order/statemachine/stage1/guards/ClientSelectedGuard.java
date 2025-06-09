package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1Event;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1State;
import com.aksi.domain.order.statemachine.stage1.service.Stage1ValidationService;

/**
 * Guard для перевірки готовності вибору клієнта.
 */
@Component
public class ClientSelectedGuard implements Guard<Stage1State, Stage1Event> {

    private final Stage1ValidationService validationService;

    public ClientSelectedGuard(Stage1ValidationService validationService) {
        this.validationService = validationService;
    }

    @Override
    public boolean evaluate(StateContext<Stage1State, Stage1Event> context) {
        ClientSelectionDTO clientSelection = getClientSelectionFromContext(context);
        return validationService.isClientSelectionReady(clientSelection);
    }

    /**
     * Отримання ClientSelectionDTO з контексту State Machine.
     */
    private ClientSelectionDTO getClientSelectionFromContext(StateContext<Stage1State, Stage1Event> context) {
        Object clientSelectionObj = context.getExtendedState().getVariables().get("clientSelection");

        if (clientSelectionObj instanceof ClientSelectionDTO clientSelection) {
            return clientSelection;
        }

        return null;
    }
}
