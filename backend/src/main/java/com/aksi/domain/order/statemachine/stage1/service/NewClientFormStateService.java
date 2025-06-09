package com.aksi.domain.order.statemachine.stage1.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;

/**
 * Простий сервіс для управління станом форми нового клієнта.
 */
@Service
public class NewClientFormStateService {

    private final Map<String, NewClientFormContext> formContexts = new ConcurrentHashMap<>();

    /**
     * Створює новий контекст форми.
     */
    public NewClientFormContext createFormContext(String sessionId) {
        NewClientFormContext context = new NewClientFormContext();
        formContexts.put(sessionId, context);
        return context;
    }

    /**
     * Отримує контекст форми.
     */
    public NewClientFormContext getFormContext(String sessionId) {
        return formContexts.get(sessionId);
    }

    /**
     * Перевіряє, чи існує контекст форми.
     */
    public boolean hasFormContext(String sessionId) {
        return formContexts.containsKey(sessionId);
    }

    /**
     * Оновлює дані форми.
     */
    public void updateFormData(String sessionId, NewClientFormDTO formData) {
        NewClientFormContext context = formContexts.get(sessionId);
        if (context != null) {
            context.setFormData(formData);
        }
    }

    /**
     * Видаляє контекст форми.
     */
    public void removeFormContext(String sessionId) {
        formContexts.remove(sessionId);
    }

    /**
     * Очищає всі контексти.
     */
    public void clearAllContexts() {
        formContexts.clear();
    }

    /**
     * Внутрішній клас для контексту форми нового клієнта.
     */
    public static class NewClientFormContext {
        private NewClientFormDTO formData;

        public NewClientFormDTO getFormData() {
            return formData;
        }

        public void setFormData(NewClientFormDTO formData) {
            this.formData = formData;
        }
    }
}
