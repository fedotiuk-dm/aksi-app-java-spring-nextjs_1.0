package com.aksi.domain.order.statemachine.stage1.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchEvent;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchValidationService;

/**
 * Guard для перевірки валідності пошукового запиту.
 * Перевіряє, чи є достатньо даних для пошуку клієнта.
 */
@Component
public class ClientSearchValidGuard implements Guard<ClientSearchState, ClientSearchEvent> {

    private final ClientSearchValidationService validationService;

    public ClientSearchValidGuard(ClientSearchValidationService validationService) {
        this.validationService = validationService;
    }

    @Override
    public boolean evaluate(StateContext<ClientSearchState, ClientSearchEvent> context) {
        // Створюємо критерії пошуку з контексту
        ClientSearchCriteriaDTO criteria = new ClientSearchCriteriaDTO();

        String searchTerm = context.getExtendedState().get("searchTerm", String.class);
        String phone = context.getExtendedState().get("phone", String.class);
        String firstName = context.getExtendedState().get("firstName", String.class);
        String lastName = context.getExtendedState().get("lastName", String.class);

        criteria.setGeneralSearchTerm(searchTerm);
        criteria.setPhone(phone);
        criteria.setFirstName(firstName);
        criteria.setLastName(lastName);

        // Використовуємо validation service
        return validationService.canSaveAsDraft(criteria);
    }
}
