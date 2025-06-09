package com.aksi.domain.order.statemachine.stage1.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormStateService.NewClientFormContext;

/**
 * Сервіс для управління життєвим циклом сесій форми нового клієнта.
 */
@Service
public class NewClientFormSessionService {

    private final NewClientFormStateService stateService;

    public NewClientFormSessionService(NewClientFormStateService stateService) {
        this.stateService = stateService;
    }

    /**
     * Ініціалізація нової сесії форми.
     */
    public String initializeFormSession() {
        String sessionId = generateSessionId();
        stateService.createFormContext(sessionId);
        return sessionId;
    }

    /**
     * Отримання контексту сесії форми.
     */
    public NewClientFormContext getFormSession(String sessionId) {
        return stateService.getFormContext(sessionId);
    }

    /**
     * Перевірка існування сесії форми.
     */
    public boolean formSessionExists(String sessionId) {
        return stateService.hasFormContext(sessionId);
    }

    /**
     * Оновлення даних форми в сесії.
     */
    public void updateFormDataInSession(String sessionId, NewClientFormDTO formData) {
        stateService.updateFormData(sessionId, formData);
    }

    /**
     * Отримання даних форми з сесії.
     */
    public NewClientFormDTO getFormDataFromSession(String sessionId) {
        NewClientFormContext context = stateService.getFormContext(sessionId);
        return context != null ? context.getFormData() : null;
    }

    /**
     * Завершення сесії форми.
     */
    public void completeFormSession(String sessionId) {
        // При завершенні просто видаляємо сесію
        stateService.removeFormContext(sessionId);
    }

    /**
     * Видалення сесії форми.
     */
    public void removeFormSession(String sessionId) {
        stateService.removeFormContext(sessionId);
    }

    /**
     * Очищення всіх сесій форм.
     */
    public void clearAllFormSessions() {
        stateService.clearAllContexts();
    }

    /**
     * Перевірка чи є дані в сесії.
     */
    public boolean hasFormDataInSession(String sessionId) {
        NewClientFormDTO formData = getFormDataFromSession(sessionId);
        return formData != null && (
            (formData.getFirstName() != null && !formData.getFirstName().trim().isEmpty()) ||
            (formData.getLastName() != null && !formData.getLastName().trim().isEmpty()) ||
            (formData.getPhone() != null && !formData.getPhone().trim().isEmpty())
        );
    }

    /**
     * Генерація унікального ID сесії форми.
     */
    private String generateSessionId() {
        return "new-client-form-" + UUID.randomUUID().toString();
    }
}
