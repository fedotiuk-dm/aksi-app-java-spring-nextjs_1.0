package com.aksi.domain.order.statemachine.stage1.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.client.dto.ClientPageResponse;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.ClientSearchRequest;
import com.aksi.domain.client.service.ClientService;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.validator.ClientDataValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для управління етапом вибору клієнта (1.1).
 *
 * Відповідає за:
 * - Пошук існуючих клієнтів
 * - Підготовку форми для створення нового клієнта
 * - Валідацію вибраного/створеного клієнта
 * - Управління UI станом етапу вибору клієнта
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ClientSelectionService {

    private final ClientService clientService;
    private final ClientDataValidator clientValidator;

    /**
     * Ініціалізує етап вибору клієнта.
     */
    public void initializeClientSelection(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Ініціалізація етапу вибору клієнта для wizard: {}", wizardId);

        // Створюємо початковий DTO для UI
        ClientSelectionDTO dto = ClientSelectionDTO.builder()
            .mode(ClientSelectionDTO.ClientSelectionMode.SEARCH_EXISTING)
            .canProceedToNext(false)
            .build();

        // Зберігаємо в контексті для відображення в UI
        context.getExtendedState().getVariables().put("clientSelectionData", dto);

        log.debug("Етап вибору клієнта ініціалізовано для wizard: {}", wizardId);
    }

    /**
     * Виконує пошук клієнтів за запитом.
     */
    public void searchClients(String wizardId, String searchQuery, StateContext<OrderState, OrderEvent> context) {
        log.debug("Пошук клієнтів для wizard: {} за запитом: {}", wizardId, searchQuery);

        try {
            // Виконуємо пошук клієнтів з використанням нового API
            ClientSearchRequest searchRequest = ClientSearchRequest.builder()
                .query(searchQuery)
                .page(0)
                .size(50) // Достатньо для UI вибору
                .build();

            ClientPageResponse pageResponse = clientService.searchClients(searchRequest);
            List<ClientResponse> searchResults = pageResponse.getContent();

            // Конвертуємо в DTO для UI
            List<ClientSelectionDTO.ClientSummaryDto> clientSummaries = searchResults.stream()
                .map(this::convertToClientSummary)
                .collect(Collectors.toList());

            // Оновлюємо DTO
            ClientSelectionDTO dto = getOrCreateClientSelectionDTO(context);
            dto.setSearchQuery(searchQuery);
            dto.setSearchResults(clientSummaries);
            dto.setTotalResultsCount(clientSummaries.size());
            dto.setCanProceedToNext(false); // Поки не обрано клієнта

            // Зберігаємо оновлені дані
            context.getExtendedState().getVariables().put("clientSelectionData", dto);

            log.info("Знайдено {} клієнтів для wizard: {} за запитом: {}",
                clientSummaries.size(), wizardId, searchQuery);

        } catch (Exception e) {
            log.error("Помилка пошуку клієнтів для wizard {}: {}", wizardId, e.getMessage(), e);

            ClientSelectionDTO dto = getOrCreateClientSelectionDTO(context);
            dto.setValidationMessage("Помилка пошуку клієнтів: " + e.getMessage());
            context.getExtendedState().getVariables().put("clientSelectionData", dto);
        }
    }

    /**
     * Вибирає клієнта зі списку результатів пошуку.
     */
    public void selectClient(String wizardId, String clientId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Вибір клієнта {} для wizard: {}", clientId, wizardId);

        try {
            // Отримуємо повні дані клієнта
            ClientResponse selectedClient = clientService.getClientById(UUID.fromString(clientId));

            // Валідуємо клієнта
            ClientDataValidator.ValidationResult validation = clientValidator.validate(selectedClient);

            if (!validation.isValid()) {
                log.warn("Обраний клієнт {} не пройшов валідацію для wizard {}: {}",
                    clientId, wizardId, validation.getErrors());

                ClientSelectionDTO dto = getOrCreateClientSelectionDTO(context);
                dto.setValidationMessage("Обраний клієнт не відповідає вимогам: " +
                    String.join(", ", validation.getErrors()));
                context.getExtendedState().getVariables().put("clientSelectionData", dto);
                return;
            }

            // Оновлюємо DTO
            ClientSelectionDTO dto = getOrCreateClientSelectionDTO(context);
            dto.setSelectedClient(selectedClient);
            dto.setCanProceedToNext(true);
            dto.setValidationMessage(null);

            // Зберігаємо дані клієнта в контексті wizard
            context.getExtendedState().getVariables().put("clientSelectionData", dto);
            context.getExtendedState().getVariables().put("selectedClientId", clientId);
            context.getExtendedState().getVariables().put("selectedClient", selectedClient);

            log.info("Клієнт {} обрано для wizard: {}", clientId, wizardId);

        } catch (Exception e) {
            log.error("Помилка вибору клієнта {} для wizard {}: {}", clientId, wizardId, e.getMessage(), e);

            ClientSelectionDTO dto = getOrCreateClientSelectionDTO(context);
            dto.setValidationMessage("Помилка вибору клієнта: " + e.getMessage());
            context.getExtendedState().getVariables().put("clientSelectionData", dto);
        }
    }

    /**
     * Переключає режим на створення нового клієнта.
     */
    public void switchToCreateNewClient(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Переключення на створення нового клієнта для wizard: {}", wizardId);

        ClientSelectionDTO dto = getOrCreateClientSelectionDTO(context);
        dto.setMode(ClientSelectionDTO.ClientSelectionMode.CREATE_NEW);
        dto.setSelectedClient(null);
        dto.setCanProceedToNext(false);
        dto.setValidationMessage(null);

        // Створюємо пустий об'єкт для нового клієнта
        ClientResponse newClient = ClientResponse.builder().build();
        dto.setNewClientData(newClient);

        context.getExtendedState().getVariables().put("clientSelectionData", dto);

        log.debug("Переключено на створення нового клієнта для wizard: {}", wizardId);
    }

    /**
     * Зберігає дані нового клієнта та валідує їх.
     */
    public void saveNewClientData(String wizardId, ClientResponse newClientData,
                                  StateContext<OrderState, OrderEvent> context) {
        log.debug("Збереження даних нового клієнта для wizard: {}", wizardId);

        try {
            // Валідуємо дані нового клієнта
            ClientDataValidator.ValidationResult validation = clientValidator.validate(newClientData);

            ClientSelectionDTO dto = getOrCreateClientSelectionDTO(context);
            dto.setNewClientData(newClientData);

            if (!validation.isValid()) {
                log.warn("Дані нового клієнта не пройшли валідацію для wizard {}: {}",
                    wizardId, validation.getErrors());

                dto.setValidationMessage("Помилки валідації: " + String.join(", ", validation.getErrors()));
                dto.setCanProceedToNext(false);
            } else {
                log.info("Дані нового клієнта валідні для wizard: {}", wizardId);

                dto.setValidationMessage(null);
                dto.setCanProceedToNext(true);
                dto.setSelectedClient(newClientData); // Встановлюємо як обраного
            }

            context.getExtendedState().getVariables().put("clientSelectionData", dto);

        } catch (Exception e) {
            log.error("Помилка збереження даних нового клієнта для wizard {}: {}",
                wizardId, e.getMessage(), e);

            ClientSelectionDTO dto = getOrCreateClientSelectionDTO(context);
            dto.setValidationMessage("Помилка збереження: " + e.getMessage());
            context.getExtendedState().getVariables().put("clientSelectionData", dto);
        }
    }

    /**
     * Валідує готовність етапу до завершення.
     */
    public boolean validateCanProceedToNext(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Валідація готовності етапу вибору клієнта для wizard: {}", wizardId);

        ClientSelectionDTO dto = getOrCreateClientSelectionDTO(context);

        boolean canProceed = dto.getCanProceedToNext() != null && dto.getCanProceedToNext();
        boolean hasSelectedClient = dto.hasSelectedClient();

        boolean result = canProceed && hasSelectedClient;

        log.debug("Валідація етапу вибору клієнта для wizard {}: canProceed={}, hasSelectedClient={}, result={}",
            wizardId, canProceed, hasSelectedClient, result);

        return result;
    }

    /**
     * Фіналізує етап вибору клієнта.
     */
    public void finalizeClientSelection(String wizardId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Фіналізація етапу вибору клієнта для wizard: {}", wizardId);

        ClientSelectionDTO dto = getOrCreateClientSelectionDTO(context);

        if (dto.hasSelectedClient()) {
            // Зберігаємо обраного клієнта в глобальних змінних wizard
            context.getExtendedState().getVariables().put("finalSelectedClient", dto.getSelectedClient());

            log.info("Етап вибору клієнта завершено для wizard: {} з клієнтом: {}",
                wizardId, dto.getSelectedClient().getId());
        } else {
            throw new IllegalStateException("Неможливо завершити етап без обраного клієнта");
        }
    }

    /**
     * Отримує або створює DTO для етапу вибору клієнта.
     */
    private ClientSelectionDTO getOrCreateClientSelectionDTO(StateContext<OrderState, OrderEvent> context) {
        Object dtoObj = context.getExtendedState().getVariables().get("clientSelectionData");

        if (dtoObj instanceof ClientSelectionDTO dto) {
            return dto;
        }

        // Створюємо новий DTO якщо його немає
        return ClientSelectionDTO.builder()
            .mode(ClientSelectionDTO.ClientSelectionMode.SEARCH_EXISTING)
            .canProceedToNext(false)
            .build();
    }

    /**
     * Конвертує ClientResponse у ClientSummaryDto для відображення в UI.
     */
    private ClientSelectionDTO.ClientSummaryDto convertToClientSummary(ClientResponse client) {
        return ClientSelectionDTO.ClientSummaryDto.builder()
            .id(client.getId() != null ? client.getId().toString() : null)
            .fullName(buildFullName(client))
            .phone(client.getPhone())
            .email(client.getEmail())
            .address(buildAddress(client))
            .previousOrdersCount(0) // TODO: Додати підрахунок замовлень
            .lastOrderDate(null) // TODO: Додати дату останнього замовлення
            .build();
    }

    /**
     * Формує повне ім'я клієнта.
     */
    private String buildFullName(ClientResponse client) {
        StringBuilder sb = new StringBuilder();
        if (client.getFirstName() != null && !client.getFirstName().trim().isEmpty()) {
            sb.append(client.getFirstName());
        }
        if (client.getLastName() != null && !client.getLastName().trim().isEmpty()) {
            if (sb.length() > 0) {
                sb.append(" ");
            }
            sb.append(client.getLastName());
        }
        return sb.toString();
    }

    /**
     * Формує адресу клієнта.
     */
    private String buildAddress(ClientResponse client) {
        return client.getAddress() != null ? client.getAddress() : "";
    }
}
