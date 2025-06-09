package com.aksi.domain.order.statemachine.stage1.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchResultDTO;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchStateService.ClientSearchContext;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * Сервіс для workflow бізнес-логіки пошуку клієнта в етапі 1.1.
 * Містить складну логіку оркестрації процесу пошуку.
 */
@Service
public class ClientSearchWorkflowService {

    private final ClientSearchValidationService validationService;
    private final ClientSearchStateService stateService;
    private final ClientSearchOperationsService operationsService;

    public ClientSearchWorkflowService(
            ClientSearchValidationService validationService,
            ClientSearchStateService stateService,
            ClientSearchOperationsService operationsService) {
        this.validationService = validationService;
        this.stateService = stateService;
        this.operationsService = operationsService;
    }

    /**
     * Виконує повний процес пошуку клієнтів з валідацією та збереженням.
     */
    public ClientSearchResultDTO executeSearchWithValidation(String sessionId, ClientSearchCriteriaDTO criteria) {
        // Валідація критеріїв
        ValidationResult validation = validationService.validateSearchCriteria(criteria);
        if (validation.isInvalid()) {
            return createEmptyResultForFailure(criteria);
        }

        // Збереження критеріїв в контексті
        stateService.saveSearchCriteria(sessionId, criteria);

        // Виконання пошуку
        ClientSearchResultDTO results = operationsService.searchClients(criteria);

        // Збереження результатів в контексті
        stateService.saveSearchResults(sessionId, results);

        return results;
    }

    /**
     * Обробляє вибір клієнта з результатів або отримання з сервісу.
     */
    public ValidationResult processClientSelection(String sessionId, UUID clientId) {
        ClientSearchContext context = stateService.getSearchContext(sessionId);
        if (context == null) {
            return ValidationResult.failure("Сесія не знайдена: " + sessionId);
        }

        // Пошук клієнта в результатах або отримання з сервісу
        ClientResponse selectedClient = findClientInResultsOrService(context, clientId);

        if (selectedClient == null) {
            return ValidationResult.failure("Клієнт з ID " + clientId + " не знайдений");
        }

        // Збереження обраного клієнта
        stateService.saveSelectedClient(sessionId, selectedClient);

        return ValidationResult.success();
    }

    /**
     * Обробляє переключення в режим створення нового клієнта з перевірками.
     */
    public ValidationResult processSwitchToCreateNewClient(String sessionId) {
        if (!sessionExists(sessionId)) {
            return ValidationResult.failure("Сесія не знайдена: " + sessionId);
        }

        stateService.switchToCreateNewClientMode(sessionId);
        return ValidationResult.success();
    }

    /**
     * Обробляє очищення результатів пошуку з перевірками.
     */
    public ValidationResult processClearSearch(String sessionId) {
        if (!sessionExists(sessionId)) {
            return ValidationResult.failure("Сесія не знайдена: " + sessionId);
        }

        stateService.clearSearchResults(sessionId);
        return ValidationResult.success();
    }

    /**
     * Завершує пошук клієнта з повною валідацією готовності.
     */
    public ValidationResult completeSearchWithValidation(String sessionId) {
        ClientSearchContext context = stateService.getSearchContext(sessionId);

        // Перевірка готовності до завершення
        ValidationResult readinessValidation = validateReadinessToComplete(sessionId, context);
        if (readinessValidation.isInvalid()) {
            return readinessValidation;
        }

        // Завершення пошуку
        stateService.completeClientSearch(sessionId);

        return ValidationResult.success();
    }

    /**
     * Валідує готовність до завершення пошуку.
     */
    private ValidationResult validateReadinessToComplete(String sessionId, ClientSearchContext context) {
        if (context == null) {
            return ValidationResult.failure("Контекст пошуку не знайдено для сесії: " + sessionId);
        }

        if (!context.hasSelectedClient() && !context.isCreateNewClientMode()) {
            return ValidationResult.failure("Потрібно обрати клієнта або перейти в режим створення нового клієнта");
        }

        return ValidationResult.success();
    }

    /**
     * Шукає клієнта в результатах пошуку або отримує з сервісу.
     */
    private ClientResponse findClientInResultsOrService(ClientSearchContext context, UUID clientId) {
        // Спочатку шукаємо в результатах
        ClientResponse client = findClientInResults(context, clientId);

        // Якщо не знайшли, отримуємо з сервісу
        if (client == null) {
            client = operationsService.getClientById(clientId);
        }

        return client;
    }

    /**
     * Шукає клієнта в результатах пошуку за ID.
     */
    private ClientResponse findClientInResults(ClientSearchContext context, UUID clientId) {
        if (!context.hasSearchResults()) {
            return null;
        }

        return context.getSearchResult().getClients().stream()
                .filter(client -> clientId.equals(client.getId()))
                .findFirst()
                .orElse(null);
    }

    /**
     * Створює порожній результат для випадку помилки валідації.
     */
    private ClientSearchResultDTO createEmptyResultForFailure(ClientSearchCriteriaDTO criteria) {
        // Тут можна використати mapper через ін'єкцію, але поки що створимо просто
        return new ClientSearchResultDTO(java.util.List.of(), criteria);
    }

    /**
     * Перевіряє чи існує сесія.
     */
    private boolean sessionExists(String sessionId) {
        return stateService.getSearchContext(sessionId) != null;
    }
}
