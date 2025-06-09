package com.aksi.domain.order.statemachine.stage1.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1State;

/**
 * Сервіс для управління станом та контекстом Stage1.
 */
@Service
public class Stage1StateService {

    private final Map<String, Stage1Context> sessionContexts = new ConcurrentHashMap<>();

    /**
     * Створює новий контекст для сесії.
     */
    public Stage1Context createSession(String sessionId) {
        Stage1Context context = new Stage1Context();
        context.setCurrentState(Stage1State.INIT);
        sessionContexts.put(sessionId, context);
        return context;
    }

    /**
     * Отримує контекст сесії.
     */
    public Stage1Context getContext(String sessionId) {
        return sessionContexts.get(sessionId);
    }

    /**
     * Перевіряє, чи існує сесія.
     */
    public boolean hasSession(String sessionId) {
        return sessionContexts.containsKey(sessionId);
    }

    /**
     * Оновлює стан сесії.
     */
    public void updateState(String sessionId, Stage1State newState) {
        Stage1Context context = sessionContexts.get(sessionId);
        if (context != null) {
            context.setCurrentState(newState);
        }
    }

    /**
     * Встановлює дані вибору клієнта.
     */
    public void setClientSelection(String sessionId, ClientSelectionDTO clientSelection) {
        Stage1Context context = sessionContexts.get(sessionId);
        if (context != null) {
            context.setClientSelection(clientSelection);
        }
    }

    /**
     * Видаляє сесію.
     */
    public void removeSession(String sessionId) {
        sessionContexts.remove(sessionId);
    }

    /**
     * Очищає всі сесії.
     */
    public void clearAllSessions() {
        sessionContexts.clear();
    }

    /**
     * Внутрішній клас для контексту Stage1.
     */
    public static class Stage1Context {
        private Stage1State currentState;
        private ClientSelectionDTO clientSelection;

        public Stage1State getCurrentState() {
            return currentState;
        }

        public void setCurrentState(Stage1State currentState) {
            this.currentState = currentState;
        }

        public ClientSelectionDTO getClientSelection() {
            return clientSelection;
        }

        public void setClientSelection(ClientSelectionDTO clientSelection) {
            this.clientSelection = clientSelection;
        }
    }
}
