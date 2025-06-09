package com.aksi.domain.order.statemachine.stage1.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1State;
import com.aksi.domain.order.statemachine.stage1.service.Stage1StateService.Stage1Context;

/**
 * Сервіс для управління життєвим циклом сесій Stage1.
 */
@Service
public class Stage1SessionService {

    private final Stage1StateService stateService;

    public Stage1SessionService(Stage1StateService stateService) {
        this.stateService = stateService;
    }

    /**
     * Ініціалізація нової сесії Stage1.
     */
    public String initializeSession() {
        String sessionId = generateSessionId();
        stateService.createSession(sessionId);
        return sessionId;
    }

    /**
     * Отримання контексту сесії.
     */
    public Stage1Context getSession(String sessionId) {
        return stateService.getContext(sessionId);
    }

    /**
     * Перевірка існування сесії.
     */
    public boolean sessionExists(String sessionId) {
        return stateService.hasSession(sessionId);
    }

    /**
     * Оновлення стану сесії.
     */
    public void updateSessionState(String sessionId, Stage1State newState) {
        stateService.updateState(sessionId, newState);
    }

    /**
     * Встановлення даних вибору клієнта в сесію.
     */
    public void setClientSelectionInSession(String sessionId, ClientSelectionDTO clientSelection) {
        stateService.setClientSelection(sessionId, clientSelection);
    }

    /**
     * Завершення сесії.
     */
    public void completeSession(String sessionId) {
        stateService.updateState(sessionId, Stage1State.COMPLETED);
    }

    /**
     * Видалення сесії.
     */
    public void removeSession(String sessionId) {
        stateService.removeSession(sessionId);
    }

    /**
     * Очищення всіх сесій.
     */
    public void clearAllSessions() {
        stateService.clearAllSessions();
    }

    /**
     * Генерація унікального ID сесії.
     */
    private String generateSessionId() {
        return "stage1-" + UUID.randomUUID().toString();
    }
}
