package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchEvent;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormCoordinationService;

/**
 * Action для обробки створення нового клієнта з форми.
 */
@Component
public class CreateNewClientAction implements Action<ClientSearchState, ClientSearchEvent> {

    private final NewClientFormCoordinationService coordinationService;

    public CreateNewClientAction(NewClientFormCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    @Override
    public void execute(StateContext<ClientSearchState, ClientSearchEvent> context) {
        String sessionId = getSessionId(context);
        NewClientFormDTO formData = getNewClientFormFromContext(context);

        if (sessionId != null && formData != null) {
            try {
                // Валідуємо форму
                if (!coordinationService.isFormReadyForSubmission(formData)) {
                    System.err.println("Форма не готова для створення клієнта: " + sessionId);
                    context.getExtendedState().getVariables().put("createClientError",
                        "Форма містить помилки");
                    return;
                }

                // Перевіряємо на дублікати
                var duplicates = coordinationService.checkForDuplicates(formData);
                if (!duplicates.isEmpty()) {
                    System.out.println("Знайдені можливі дублікати для сесії: " + sessionId);
                    context.getExtendedState().getVariables().put("possibleDuplicates", duplicates);
                }

                // Створюємо клієнта
                ClientResponse createdClient = coordinationService.createClientFromForm(sessionId);

                // Зберігаємо результат
                context.getExtendedState().getVariables().put("createdClient", createdClient);
                context.getExtendedState().getVariables().put("createdClientId", createdClient.getId());

                // Логування
                System.out.println("Новий клієнт створений для сесії: " + sessionId +
                                 ", ID клієнта: " + createdClient.getId() +
                                 ", ПІБ: " + createdClient.getLastName() + " " + createdClient.getFirstName());

            } catch (Exception e) {
                // Обробка помилок
                System.err.println("Помилка при створенні клієнта для сесії: " + sessionId +
                                 ", помилка: " + e.getMessage());
                context.getExtendedState().getVariables().put("createClientError", e.getMessage());
            }
        } else {
            System.err.println("Відсутні дані для створення клієнта: sessionId=" + sessionId +
                             ", formData=" + (formData != null ? "присутні" : "відсутні"));
        }
    }

    /**
     * Отримання sessionId з контексту.
     */
    private String getSessionId(StateContext<ClientSearchState, ClientSearchEvent> context) {
        Object sessionIdObj = context.getExtendedState().getVariables().get("sessionId");
        return sessionIdObj instanceof String ? (String) sessionIdObj : null;
    }

    /**
     * Отримання NewClientFormDTO з контексту.
     */
    private NewClientFormDTO getNewClientFormFromContext(StateContext<ClientSearchState, ClientSearchEvent> context) {
        Object formDataObj = context.getExtendedState().getVariables().get("newClientForm");
        return formDataObj instanceof NewClientFormDTO ? (NewClientFormDTO) formDataObj : null;
    }
}
