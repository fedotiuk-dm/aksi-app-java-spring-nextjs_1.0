package com.aksi.domain.order.statemachine.stage2.substep2.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;

/**
 * Сервіс для управління станом підетапу характеристик предмета
 */
@Service
public class ItemCharacteristicsStateService {

    private final Map<UUID, ItemCharacteristicsContext> contexts = new ConcurrentHashMap<>();

    /**
     * Контекст підетапу характеристик предмета
     */
    public static class ItemCharacteristicsContext {
        private ItemCharacteristicsState currentState;
        private ItemCharacteristicsDTO characteristicsData;
        private String categoryCode;
        private long lastUpdated;

        public ItemCharacteristicsContext() {
            this.currentState = ItemCharacteristicsState.NOT_STARTED;
            this.characteristicsData = ItemCharacteristicsDTO.createEmpty();
            this.lastUpdated = System.currentTimeMillis();
        }

        // Getters та Setters
        public ItemCharacteristicsState getCurrentState() {
            return currentState;
        }

        public void setCurrentState(ItemCharacteristicsState currentState) {
            this.currentState = currentState;
            this.lastUpdated = System.currentTimeMillis();
        }

        public ItemCharacteristicsDTO getCharacteristicsData() {
            return characteristicsData;
        }

        public void setCharacteristicsData(ItemCharacteristicsDTO characteristicsData) {
            this.characteristicsData = characteristicsData;
            this.lastUpdated = System.currentTimeMillis();
        }

        public String getCategoryCode() {
            return categoryCode;
        }

        public void setCategoryCode(String categoryCode) {
            this.categoryCode = categoryCode;
            this.lastUpdated = System.currentTimeMillis();
        }

        public long getLastUpdated() {
            return lastUpdated;
        }
    }

    /**
     * Отримати контекст для сесії
     */
    public ItemCharacteristicsContext getContext(UUID sessionId) {
        return contexts.computeIfAbsent(sessionId, k -> new ItemCharacteristicsContext());
    }

    /**
     * Зберегти контекст для сесії
     */
    public void saveContext(UUID sessionId, ItemCharacteristicsContext context) {
        if (sessionId != null && context != null) {
            contexts.put(sessionId, context);
        }
    }

    /**
     * Видалити контекст сесії
     */
    public void removeContext(UUID sessionId) {
        if (sessionId != null) {
            contexts.remove(sessionId);
        }
    }

    /**
     * Отримати поточний стан підетапу
     */
    public ItemCharacteristicsState getCurrentState(UUID sessionId) {
        ItemCharacteristicsContext context = getContext(sessionId);
        return context.getCurrentState();
    }

    /**
     * Встановити поточний стан підетапу
     */
    public void setCurrentState(UUID sessionId, ItemCharacteristicsState state) {
        ItemCharacteristicsContext context = getContext(sessionId);
        context.setCurrentState(state);
        saveContext(sessionId, context);
    }

    /**
     * Отримати дані характеристик
     */
    public ItemCharacteristicsDTO getCharacteristicsData(UUID sessionId) {
        ItemCharacteristicsContext context = getContext(sessionId);
        return context.getCharacteristicsData();
    }

    /**
     * Оновити дані характеристик
     */
    public void updateCharacteristicsData(UUID sessionId, ItemCharacteristicsDTO data) {
        ItemCharacteristicsContext context = getContext(sessionId);
        context.setCharacteristicsData(data);
        saveContext(sessionId, context);
    }

    /**
     * Встановити код категорії для контексту
     */
    public void setCategoryCode(UUID sessionId, String categoryCode) {
        ItemCharacteristicsContext context = getContext(sessionId);
        context.setCategoryCode(categoryCode);
        saveContext(sessionId, context);
    }

    /**
     * Отримати код категорії з контексту
     */
    public String getCategoryCode(UUID sessionId) {
        ItemCharacteristicsContext context = getContext(sessionId);
        return context.getCategoryCode();
    }

    /**
     * Перевірити чи контекст існує
     */
    public boolean hasContext(UUID sessionId) {
        return sessionId != null && contexts.containsKey(sessionId);
    }

    /**
     * Ініціалізувати новий контекст
     */
    public ItemCharacteristicsContext initializeContext(UUID sessionId, String categoryCode) {
        ItemCharacteristicsContext context = new ItemCharacteristicsContext();
        context.setCategoryCode(categoryCode);

        // Створюємо DTO з урахуванням категорії
        ItemCharacteristicsDTO dto = ItemCharacteristicsDTO.createEmpty();
        dto = dto.toBuilder()
                .showFillerSection(shouldShowFillerSection(categoryCode))
                .build();

        context.setCharacteristicsData(dto);
        saveContext(sessionId, context);

        return context;
    }

    /**
     * Скинути контекст до початкового стану
     */
    public void resetContext(UUID sessionId) {
        ItemCharacteristicsContext context = getContext(sessionId);
        String categoryCode = context.getCategoryCode();

        context.setCurrentState(ItemCharacteristicsState.NOT_STARTED);
        context.setCharacteristicsData(ItemCharacteristicsDTO.createEmpty());

        // Відновлюємо категорію та налаштування для неї
        if (categoryCode != null) {
            context.setCategoryCode(categoryCode);
            ItemCharacteristicsDTO dto = context.getCharacteristicsData();
            dto = dto.toBuilder()
                    .showFillerSection(shouldShowFillerSection(categoryCode))
                    .build();
            context.setCharacteristicsData(dto);
        }

        saveContext(sessionId, context);
    }

    /**
     * Отримати кількість активних сесій
     */
    public int getActiveSessionsCount() {
        return contexts.size();
    }

    /**
     * Очистити старі контексти (старіше 24 годин)
     */
    public void cleanupOldContexts() {
        long cutoffTime = System.currentTimeMillis() - (24 * 60 * 60 * 1000); // 24 години
        contexts.entrySet().removeIf(entry -> entry.getValue().getLastUpdated() < cutoffTime);
    }

    // Приватні методи

    private boolean shouldShowFillerSection(String categoryCode) {
        if (categoryCode == null) {
            return false;
        }
        // Тут можна додати логіку визначення чи потрібна секція наповнювача
        // На основі категорії предмета
        return categoryCode.toLowerCase().contains("куртк") ||
               categoryCode.toLowerCase().contains("пальт") ||
               categoryCode.toLowerCase().contains("подушк");
    }
}
