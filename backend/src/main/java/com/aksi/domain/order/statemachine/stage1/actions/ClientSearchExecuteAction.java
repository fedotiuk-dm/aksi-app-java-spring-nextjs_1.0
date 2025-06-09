package com.aksi.domain.order.statemachine.stage1.actions;

import java.util.List;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchResultDTO;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchEvent;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchCoordinationService;

/**
 * Action для виконання пошуку клієнтів.
 * Здійснює пошук та зберігає результати в контексті.
 */
@Component
public class ClientSearchExecuteAction implements Action<ClientSearchState, ClientSearchEvent> {

    private final ClientSearchCoordinationService coordinationService;

    public ClientSearchExecuteAction(ClientSearchCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<ClientSearchState, ClientSearchEvent> context) {
        try {
            context.getExtendedState().getVariables().put("isSearching", true);

            List<ClientResponse> results = null;
            ClientSearchEvent event = context.getEvent();

                                    // Створюємо критерії пошуку на основі події
            ClientSearchCriteriaDTO criteria = new ClientSearchCriteriaDTO();
            String sessionId = context.getExtendedState().get("sessionId", String.class);

            switch (event) {
                case SEARCH_BY_PHONE -> {
                    String phone = context.getExtendedState().get("phone", String.class);
                    criteria.setPhone(phone);
                }
                case SEARCH_BY_NAME -> {
                    String firstName = context.getExtendedState().get("firstName", String.class);
                    String lastName = context.getExtendedState().get("lastName", String.class);
                    criteria.setFirstName(firstName);
                    criteria.setLastName(lastName);
                }
                case GENERAL_SEARCH -> {
                    String searchTerm = context.getExtendedState().get("searchTerm", String.class);
                    criteria.setGeneralSearchTerm(searchTerm);
                }
                default -> {
                    // No action needed
                }
            }

            if (sessionId != null) {
                ClientSearchResultDTO searchResult = coordinationService.searchClients(sessionId, criteria);
                results = searchResult.getClients();
            }

            context.getExtendedState().getVariables().put("searchResults", results);
            context.getExtendedState().getVariables().put("hasResults", results != null && !results.isEmpty());
            context.getExtendedState().getVariables().put("isSearching", false);

        } catch (Exception e) {
            context.getExtendedState().getVariables().put("searchError", e.getMessage());
            context.getExtendedState().getVariables().put("isSearching", false);
        }
    }
}
