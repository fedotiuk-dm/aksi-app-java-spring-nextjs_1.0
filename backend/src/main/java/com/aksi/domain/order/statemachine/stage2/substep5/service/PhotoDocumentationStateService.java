package com.aksi.domain.order.statemachine.stage2.substep5.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;

/**
 * Сервіс управління станом для підетапу 2.5: Фотодокументація.
 * Відповідає за зберігання та управління контекстом сесій.
 */
@Service
public class PhotoDocumentationStateService {

    private final Map<UUID, PhotoDocumentationContext> sessionContexts;

    public PhotoDocumentationStateService() {
        this.sessionContexts = new ConcurrentHashMap<>();
    }

    /**
     * Створення нового контексту сесії.
     */
    public PhotoDocumentationContext createContext(UUID sessionId, UUID itemId) {
        PhotoDocumentationContext context = new PhotoDocumentationContext(
            sessionId,
            itemId,
            PhotoDocumentationState.INITIAL
        );
        sessionContexts.put(sessionId, context);
        return context;
    }

    /**
     * Отримання контексту сесії.
     */
    public PhotoDocumentationContext getContext(UUID sessionId) {
        return sessionContexts.get(sessionId);
    }

    /**
     * Оновлення стану контексту.
     */
    public PhotoDocumentationContext updateState(UUID sessionId, PhotoDocumentationState newState) {
        PhotoDocumentationContext context = sessionContexts.get(sessionId);
        if (context != null) {
            context = context.withState(newState);
            sessionContexts.put(sessionId, context);
        }
        return context;
    }

    /**
     * Оновлення даних контексту.
     */
    public PhotoDocumentationContext updateData(UUID sessionId, PhotoDocumentationDTO data) {
        PhotoDocumentationContext context = sessionContexts.get(sessionId);
        if (context != null) {
            context = context.withData(data);
            sessionContexts.put(sessionId, context);
        }
        return context;
    }

    /**
     * Видалення контексту сесії.
     */
    public void removeContext(UUID sessionId) {
        sessionContexts.remove(sessionId);
    }

    /**
     * Перевірка існування контексту.
     */
    public boolean hasContext(UUID sessionId) {
        return sessionContexts.containsKey(sessionId);
    }

    /**
     * Отримання кількості активних сесій.
     */
    public int getActiveSessionsCount() {
        return sessionContexts.size();
    }

    /**
     * Очистка всіх контекстів.
     */
    public void clearAllContexts() {
        sessionContexts.clear();
    }

    /**
     * Клас контексту сесії фотодокументації.
     */
    public static class PhotoDocumentationContext {
        private final UUID sessionId;
        private final UUID itemId;
        private final PhotoDocumentationState currentState;
        private final PhotoDocumentationDTO data;

        public PhotoDocumentationContext(UUID sessionId, UUID itemId, PhotoDocumentationState currentState) {
            this(sessionId, itemId, currentState, null);
        }

        public PhotoDocumentationContext(UUID sessionId, UUID itemId,
                                       PhotoDocumentationState currentState,
                                       PhotoDocumentationDTO data) {
            this.sessionId = sessionId;
            this.itemId = itemId;
            this.currentState = currentState;
            this.data = data;
        }

        public UUID getSessionId() {
            return sessionId;
        }

        public UUID getItemId() {
            return itemId;
        }

        public PhotoDocumentationState getCurrentState() {
            return currentState;
        }

        public PhotoDocumentationDTO getData() {
            return data;
        }

        public PhotoDocumentationContext withState(PhotoDocumentationState newState) {
            return new PhotoDocumentationContext(sessionId, itemId, newState, data);
        }

        public PhotoDocumentationContext withData(PhotoDocumentationDTO newData) {
            return new PhotoDocumentationContext(sessionId, itemId, currentState, newData);
        }

        public boolean hasData() {
            return data != null;
        }

        public boolean isInState(PhotoDocumentationState state) {
            return currentState == state;
        }
    }
}
