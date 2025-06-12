package com.aksi.domain.order.statemachine.stage1.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchResultDTO;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;

/**
 * Сервіс для управління станом пошуку клієнта в етапі 1.1.
 * Відповідає тільки за збереження та управління контекстом пошуку.
 */
@Service
public class ClientSearchStateService {

    /**
     * Контекст пошуку клієнта для конкретної сесії.
     */
    public static class ClientSearchContext {
        private ClientSearchState currentState;
        private ClientSearchCriteriaDTO searchCriteria;
        private ClientSearchResultDTO searchResult;
        private ClientResponse selectedClient;
        private boolean isCreateNewClientMode;

        public ClientSearchContext() {
            this.currentState = ClientSearchState.INIT;
            this.isCreateNewClientMode = false;
        }

        // Геттери та сеттери
        public ClientSearchState getCurrentState() {
            return currentState;
        }

        public void setCurrentState(ClientSearchState currentState) {
            this.currentState = currentState;
        }

        public ClientSearchCriteriaDTO getSearchCriteria() {
            return searchCriteria;
        }

        public void setSearchCriteria(ClientSearchCriteriaDTO searchCriteria) {
            this.searchCriteria = searchCriteria;
        }

        public ClientSearchResultDTO getSearchResult() {
            return searchResult;
        }

        public void setSearchResult(ClientSearchResultDTO searchResult) {
            this.searchResult = searchResult;
        }

        public ClientResponse getSelectedClient() {
            return selectedClient;
        }

        public void setSelectedClient(ClientResponse selectedClient) {
            this.selectedClient = selectedClient;
        }

        public boolean isCreateNewClientMode() {
            return isCreateNewClientMode;
        }

        public void setCreateNewClientMode(boolean createNewClientMode) {
            this.isCreateNewClientMode = createNewClientMode;
        }

        public boolean hasSearchCriteria() {
            return searchCriteria != null && searchCriteria.hasSearchCriteria();
        }

        public boolean hasSearchResults() {
            return searchResult != null && searchResult.hasResults();
        }

        public boolean hasSelectedClient() {
            return selectedClient != null;
        }
    }

    /**
     * Сховище контекстів пошуку за sessionId.
     */
    private final Map<String, ClientSearchContext> searchContexts = new ConcurrentHashMap<>();

    /**
     * Створює новий контекст пошуку для сесії.
     */
    public String createSearchContext() {
        String sessionId = UUID.randomUUID().toString();
        searchContexts.put(sessionId, new ClientSearchContext());
        return sessionId;
    }

    /**
     * Отримує контекст пошуку для сесії.
     */
    public ClientSearchContext getSearchContext(String sessionId) {
        return searchContexts.get(sessionId);
    }

    /**
     * Отримує контекст пошуку для сесії або створює новий.
     */
    public ClientSearchContext getOrCreateContext(String sessionId) {
        if (sessionId == null) {
            sessionId = createSearchContext();
        }

        ClientSearchContext context = searchContexts.get(sessionId);
        if (context == null) {
            context = new ClientSearchContext();
            searchContexts.put(sessionId, context);
        }

        return context;
    }

    /**
     * Видаляє контекст пошуку для сесії.
     */
    public void removeSearchContext(String sessionId) {
        searchContexts.remove(sessionId);
    }

    /**
     * Оновлює стан пошуку.
     */
    public void updateState(String sessionId, ClientSearchState newState) {
        ClientSearchContext context = getSearchContext(sessionId);
        if (context != null) {
            context.setCurrentState(newState);
        }
    }

    /**
     * Зберігає критерії пошуку.
     */
    public void saveSearchCriteria(String sessionId, ClientSearchCriteriaDTO criteria) {
        ClientSearchContext context = getSearchContext(sessionId);
        if (context != null) {
            context.setSearchCriteria(criteria);
            updateState(sessionId, ClientSearchState.SEARCHING);
        }
    }

    /**
     * Зберігає результати пошуку.
     */
    public void saveSearchResults(String sessionId, ClientSearchResultDTO results) {
        ClientSearchContext context = getSearchContext(sessionId);
        if (context != null) {
            context.setSearchResult(results);
            updateState(sessionId, ClientSearchState.RESULTS_DISPLAYED);
        }
    }

    /**
     * Зберігає обраного клієнта.
     */
    public void saveSelectedClient(String sessionId, ClientResponse client) {
        ClientSearchContext context = getSearchContext(sessionId);
        if (context != null) {
            context.setSelectedClient(client);
            updateState(sessionId, ClientSearchState.CLIENT_SELECTED);
        }
    }

    /**
     * Переключає в режим створення нового клієнта.
     */
    public void switchToCreateNewClientMode(String sessionId) {
        ClientSearchContext context = getSearchContext(sessionId);
        if (context != null) {
            context.setCreateNewClientMode(true);
            updateState(sessionId, ClientSearchState.CREATE_NEW_CLIENT_MODE);
        }
    }

    /**
     * Очищає результати пошуку.
     */
    public void clearSearchResults(String sessionId) {
        ClientSearchContext context = getSearchContext(sessionId);
        if (context != null) {
            context.setSearchResult(null);
            context.setSelectedClient(null);
            updateState(sessionId, ClientSearchState.INIT);
        }
    }

    /**
     * Завершує пошук клієнта.
     */
    public void completeClientSearch(String sessionId) {
        ClientSearchContext context = getSearchContext(sessionId);
        if (context != null) {
            updateState(sessionId, ClientSearchState.COMPLETED);
        }
    }

    /**
     * Перевіряє чи контекст готовий для завершення.
     */
    public boolean isReadyToComplete(String sessionId) {
        ClientSearchContext context = getSearchContext(sessionId);
        return context != null &&
               (context.hasSelectedClient() || context.isCreateNewClientMode());
    }
}
