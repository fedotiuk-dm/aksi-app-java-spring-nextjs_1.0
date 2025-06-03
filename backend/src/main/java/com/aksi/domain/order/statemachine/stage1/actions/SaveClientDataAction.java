package com.aksi.domain.order.statemachine.stage1.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.service.ClientService;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.mapper.ClientWizardMapper;
import com.aksi.domain.order.statemachine.stage1.validator.ClientDataValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Action для збереження даних клієнта
 * Використовує реальний ClientService для роботи з базою даних
 * Спрощено через MapStruct mapper та окремий валідатор
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SaveClientDataAction implements Action<OrderState, OrderEvent> {

    private final ClientService clientService;
    private final ClientWizardMapper clientMapper;
    private final ClientDataValidator clientValidator;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        String wizardId = (String) context.getExtendedState().getVariables().get("wizardId");
        log.info("Збереження даних клієнта для wizard: {}", wizardId);

        try {
            // Отримуємо дані клієнта з headers повідомлення
            Object clientDataObj = context.getMessageHeaders().get("clientData");

            if (!(clientDataObj instanceof ClientResponse clientResponse)) {
                log.error("Некоректний тип даних клієнта: {}",
                    clientDataObj != null ? clientDataObj.getClass() : "null");
                throw new IllegalArgumentException("Некоректні дані клієнта");
            }

            ClientResponse savedClient = clientValidator.isNewClient(clientResponse)
                ? createNewClient(clientResponse, wizardId)
                : getExistingClient(clientResponse, wizardId);

            // Зберігаємо дані клієнта в контексті
            context.getExtendedState().getVariables().put("clientId", savedClient.getId());
            context.getExtendedState().getVariables().put("clientData", savedClient);

            // Маскуємо чутливі дані в логах
            log.info("Дані клієнта збережено для wizard: {} (телефон: {}****)",
                wizardId, getMaskedPhone(savedClient.getPhone()));

        } catch (IllegalArgumentException e) {
            log.error("Некоректні дані клієнта для wizard {}: {}", wizardId, e.getMessage());
            context.getExtendedState().getVariables().put("lastError",
                "Некоректні дані клієнта: " + e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            log.error("Помилка збереження клієнта для wizard {}: {}", wizardId, e.getMessage(), e);
            context.getExtendedState().getVariables().put("lastError",
                "Помилка збереження клієнта: " + e.getMessage());
            throw e;
        }
    }

    /**
     * Створює нового клієнта використовуючи MapStruct mapper
     */
    private ClientResponse createNewClient(ClientResponse clientData, String wizardId) {
        CreateClientRequest createRequest = clientMapper.toCreateClientRequest(clientData);
        ClientResponse newClient = clientService.createClient(createRequest);

        log.info("Створено нового клієнта {} для wizard: {}",
            newClient.getId(), wizardId);

        return newClient;
    }

    /**
     * Отримує існуючого клієнта
     */
    private ClientResponse getExistingClient(ClientResponse clientData, String wizardId) {
        ClientResponse existingClient = clientService.getClientById(clientData.getId());

        log.info("Використано існуючого клієнта {} для wizard: {}",
            existingClient.getId(), wizardId);

        return existingClient;
    }

    /**
     * Маскує номер телефону для безпечного логування
     */
    private String getMaskedPhone(String phone) {
        if (phone == null || phone.length() < 6) {
            return "****";
        }
        return phone.substring(0, Math.min(phone.length() - 4, 6));
    }
}
