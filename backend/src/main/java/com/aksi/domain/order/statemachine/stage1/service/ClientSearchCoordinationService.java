package com.aksi.domain.order.statemachine.stage1.service;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchResultDTO;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.mapper.ClientSearchMapper;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchStateService.ClientSearchContext;
import com.aksi.domain.order.statemachine.stage1.validator.ClientSearchValidationResult;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * Координаційний сервіс для пошуку клієнта в етапі 1.1.
 * Головний делегатор між усіма сервісами для роботи з пошуком клієнта.
 */
@Service
public class ClientSearchCoordinationService {

    private static final Logger logger = LoggerFactory.getLogger(ClientSearchCoordinationService.class);

    private final ClientSearchValidationService validationService;
    private final ClientSearchStateService stateService;
    private final ClientSearchOperationsService operationsService;
    private final ClientSearchWorkflowService workflowService;

    public ClientSearchCoordinationService(
            ClientSearchValidationService validationService,
            ClientSearchStateService stateService,
            ClientSearchOperationsService operationsService,
            ClientSearchWorkflowService workflowService) {
        this.validationService = validationService;
        this.stateService = stateService;
        this.operationsService = operationsService;
        this.workflowService = workflowService;
        logger.info("🚀 ClientSearchCoordinationService ініціалізовано з stateService: {}, validationService: {}, operationsService: {}, workflowService: {}",
                   stateService != null, validationService != null, operationsService != null, workflowService != null);
    }

    // ========== Делегування до ValidationService ==========

    public ValidationResult validateSearchCriteria(ClientSearchCriteriaDTO criteria) {
        return validationService.validateSearchCriteria(criteria);
    }

    public boolean isReadyForSearch(ClientSearchCriteriaDTO criteria) {
        return validationService.isReadyForSearch(criteria);
    }

    public boolean canSaveAsDraft(ClientSearchCriteriaDTO criteria) {
        return validationService.canSaveAsDraft(criteria);
    }

    public boolean hasMinimumRequiredData(ClientSearchCriteriaDTO criteria) {
        return validationService.hasMinimumRequiredData(criteria);
    }

    // ========== Делегування до StateService ==========

    public String createSearchContext() {
        return stateService.createSearchContext();
    }

    public ClientSearchContext getSearchContext(String sessionId) {
        return stateService.getSearchContext(sessionId);
    }

    /**
     * Перевіряє чи існує контекст пошуку для даної сесії.
     */
    public boolean searchContextExists(String sessionId) {
        logger.info("🔍 [CLIENT-SEARCH-COORDINATION] Перевірка існування контексту для sessionId: {}", sessionId);

        try {
            boolean exists = stateService.getSearchContext(sessionId) != null;
            logger.info("📋 [CLIENT-SEARCH-COORDINATION] Результат перевірки контексту для sessionId: {} -> exists: {}",
                       sessionId, exists);
            return exists;
        } catch (Exception e) {
            logger.error("❌ [CLIENT-SEARCH-COORDINATION] Помилка при перевірці контексту для sessionId: {}, error: {}",
                        sessionId, e.getMessage(), e);
            return false;
        }
    }

    public void saveSearchCriteria(String sessionId, ClientSearchCriteriaDTO criteria) {
        stateService.saveSearchCriteria(sessionId, criteria);
    }

    public void saveSearchResults(String sessionId, ClientSearchResultDTO results) {
        stateService.saveSearchResults(sessionId, results);
    }

    public void saveSelectedClient(String sessionId, ClientResponse client) {
        stateService.saveSelectedClient(sessionId, client);
    }

    public void switchToCreateNewClientMode(String sessionId) {
        stateService.switchToCreateNewClientMode(sessionId);
    }

    public void clearSearchResults(String sessionId) {
        stateService.clearSearchResults(sessionId);
    }

    public void completeClientSearch(String sessionId) {
        stateService.completeClientSearch(sessionId);
    }

    public void removeSearchContext(String sessionId) {
        stateService.removeSearchContext(sessionId);
    }

    public boolean isReadyToComplete(String sessionId) {
        return stateService.isReadyToComplete(sessionId);
    }

    /**
     * Отримує поточний стан пошуку.
     */
    public ClientSearchState getCurrentState(String sessionId) {
        logger.info("🔍 [CLIENT-SEARCH-COORDINATION] Запит на отримання стану для sessionId: {}", sessionId);

        try {
            ClientSearchStateService.ClientSearchContext context = stateService.getSearchContext(sessionId);
            ClientSearchState state = context != null ? context.getCurrentState() : null;
            logger.info("✅ [CLIENT-SEARCH-COORDINATION] Успішно отримано стан: {} для sessionId: {}", state, sessionId);
            return state;
        } catch (Exception e) {
            logger.error("❌ [CLIENT-SEARCH-COORDINATION] Помилка при отриманні стану для sessionId: {}, error: {}",
                        sessionId, e.getMessage(), e);
            throw e;
        }
    }

    // ========== Делегування до OperationsService ==========

    public ClientSearchResultDTO searchClientsByOperations(ClientSearchCriteriaDTO criteria) {
        return operationsService.searchClients(criteria);
    }

    public ClientResponse getClientById(UUID clientId) {
        return operationsService.getClientById(clientId);
    }

    public boolean checkClientExists(ClientResponse client) {
        return operationsService.checkClientExists(client);
    }

    // ========== Делегування до WorkflowService ==========

    public ClientSearchResultDTO executeSearchWithValidation(String sessionId, ClientSearchCriteriaDTO criteria) {
        return workflowService.executeSearchWithValidation(sessionId, criteria);
    }

    public ValidationResult processClientSelection(String sessionId, UUID clientId) {
        return workflowService.processClientSelection(sessionId, clientId);
    }

    public ValidationResult processSwitchToCreateNewClient(String sessionId) {
        return workflowService.processSwitchToCreateNewClient(sessionId);
    }

    public ValidationResult processClearSearch(String sessionId) {
        return workflowService.processClearSearch(sessionId);
    }

    public ValidationResult completeSearchWithValidation(String sessionId) {
        return workflowService.completeSearchWithValidation(sessionId);
    }

    // ========== Інтеграційні методи з Mapper ==========

    public ClientSearchResultDTO createEmptyResult(ClientSearchCriteriaDTO criteria) {
        return ClientSearchMapper.createEmptyResult(criteria);
    }

    public ClientSearchCriteriaDTO createSearchCriteria(String searchTerm) {
        return ClientSearchMapper.createGeneralSearchCriteria(searchTerm);
    }

    // ========== Високорівневі методи ==========

    /**
     * Розпочинає новий пошук клієнта.
     */
    public String startClientSearch() {
        return createSearchContext();
    }

    /**
     * Ініціалізує пошук клієнта з існуючим sessionId від головного wizard.
     */
    public void initializeClientSearch(String sessionId) {
        logger.info("🔥🔥🔥 CLIENT_SEARCH: initializeClientSearch() ВИКЛИКАНО з sessionId: {} 🔥🔥🔥", sessionId);

        try {
            if (sessionId == null || sessionId.trim().isEmpty()) {
                logger.error("❌ CLIENT_SEARCH: sessionId є null або порожнім!");
                return;
            }

            logger.info("🔧 CLIENT_SEARCH: Створення або отримання контексту для sessionId: {}", sessionId);
            stateService.getOrCreateContext(sessionId);

            logger.info("✅ CLIENT_SEARCH: Контекст успішно створено/отримано для sessionId: {}", sessionId);

            // Перевіряємо що контекст справді існує
            boolean exists = stateService.getSearchContext(sessionId) != null;
            logger.info("🔍 CLIENT_SEARCH: Перевірка існування контексту після створення: exists={}", exists);

        } catch (Exception e) {
            logger.error("💥 CLIENT_SEARCH: Помилка при ініціалізації для sessionId: {}, error: {}", sessionId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Виконує пошук клієнтів за критеріями з валідацією.
     */
    public ClientSearchResultDTO searchClients(String sessionId, ClientSearchCriteriaDTO criteria) {
        return executeSearchWithValidation(sessionId, criteria);
    }

    /**
     * Обирає клієнта зі списку результатів або отримує з сервісу.
     */
    public ValidationResult selectClient(String sessionId, UUID clientId) {
        return processClientSelection(sessionId, clientId);
    }

    /**
     * Переключає в режим створення нового клієнта.
     */
    public ValidationResult switchToCreateNewClient(String sessionId) {
        return processSwitchToCreateNewClient(sessionId);
    }

    /**
     * Очищає результати пошуку та починає заново.
     */
    public ValidationResult clearSearch(String sessionId) {
        return processClearSearch(sessionId);
    }

    /**
     * Завершує пошук клієнта з валідацією готовності.
     */
    public ValidationResult completeClientSearchWithValidation(String sessionId) {
        return completeSearchWithValidation(sessionId);
    }

    /**
     * Отримує обраного клієнта з контексту.
     */
    public ClientResponse getSelectedClient(String sessionId) {
        ClientSearchContext context = getSearchContext(sessionId);
        return context != null ? context.getSelectedClient() : null;
    }

    /**
     * Видаляє контекст пошуку (cleanup).
     */
    public void cleanupSearchContext(String sessionId) {
        removeSearchContext(sessionId);
    }

    // ========== Делегування ValidationService для Guards ==========

    /**
     * Перевіряє чи критерії пошуку валідні через sessionId для Guards
     */
    public boolean areSearchCriteriaValid(String sessionId) {
        ClientSearchContext context = getSearchContext(sessionId);
        if (context == null || context.getSearchCriteria() == null) {
            return false;
        }
        return validationService.areSearchCriteriaValid(context.getSearchCriteria());
    }

    // ========== Делегування ValidationService для адаптера ==========

    /**
     * Повна валідація критеріїв пошуку з поверненням структурованого результату.
     */
    public ClientSearchValidationResult validateCriteria(String sessionId) {
        ClientSearchContext context = getSearchContext(sessionId);
        return validationService.validateCriteriaStructured(context.getSearchCriteria());
    }

    /**
     * Валідація критичних критеріїв з поверненням структурованого результату.
     */
    public ClientSearchValidationResult validateCritical(String sessionId) {
        ClientSearchContext context = getSearchContext(sessionId);
        return validationService.validateCriticalStructured(context.getSearchCriteria());
    }

    /**
     * Генерує звіт валідації.
     */
    public String getValidationReport(String sessionId) {
        ClientSearchContext context = getSearchContext(sessionId);
        ValidationResult result = validationService.validateSearchCriteria(context.getSearchCriteria());
        return String.join("; ", result.getErrorMessages());
    }
}
