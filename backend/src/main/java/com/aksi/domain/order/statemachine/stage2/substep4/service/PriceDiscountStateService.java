package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для управління станом підетапу 2.4: Знижки та надбавки.
 */
@Service
@Slf4j
public class PriceDiscountStateService {

    private final Map<UUID, PriceDiscountContext> contexts = new ConcurrentHashMap<>();

    /**
     * Контекст підетапу 2.4.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceDiscountContext {
        private UUID sessionId;
        private PriceDiscountState currentState;
        private PriceDiscountDTO priceDiscountData;
        private long lastUpdated;

        /**
         * Оновлює час останньої зміни.
         */
        public void updateTimestamp() {
            this.lastUpdated = System.currentTimeMillis();
        }
    }

    /**
     * Ініціалізує контекст для нової сесії.
     */
    public void initializeContext(UUID sessionId, PriceDiscountDTO initialData) {
        log.debug("Ініціалізація контексту для сесії: {}", sessionId);

        PriceDiscountContext context = PriceDiscountContext.builder()
                .sessionId(sessionId)
                .currentState(PriceDiscountState.INITIAL)
                .priceDiscountData(initialData)
                .lastUpdated(System.currentTimeMillis())
                .build();

        contexts.put(sessionId, context);
    }

    /**
     * Отримує контекст за ID сесії.
     */
    public PriceDiscountContext getContext(UUID sessionId) {
        return contexts.get(sessionId);
    }

    /**
     * Оновлює стан підетапу.
     */
    public void updateState(UUID sessionId, PriceDiscountState newState) {
        PriceDiscountContext context = contexts.get(sessionId);
        if (context != null) {
            log.debug("Оновлення стану сесії {} з {} на {}", sessionId, context.getCurrentState(), newState);
            context.setCurrentState(newState);
            context.updateTimestamp();
        } else {
            log.warn("Контекст не знайдено для сесії: {}", sessionId);
        }
    }

    /**
     * Оновлює дані підетапу.
     */
    public void updateData(UUID sessionId, PriceDiscountDTO updatedData) {
        PriceDiscountContext context = contexts.get(sessionId);
        if (context != null) {
            log.debug("Оновлення даних для сесії: {}", sessionId);
            context.setPriceDiscountData(updatedData);
            context.updateTimestamp();
        } else {
            log.warn("Контекст не знайдено для сесії: {}", sessionId);
        }
    }

    /**
     * Отримує поточний стан підетапу.
     */
    public PriceDiscountState getCurrentState(UUID sessionId) {
        PriceDiscountContext context = contexts.get(sessionId);
        return context != null ? context.getCurrentState() : null;
    }

    /**
     * Отримує дані підетапу.
     */
    public PriceDiscountDTO getData(UUID sessionId) {
        PriceDiscountContext context = contexts.get(sessionId);
        return context != null ? context.getPriceDiscountData() : null;
    }

    /**
     * Перевіряє, чи існує контекст для сесії.
     */
    public boolean hasContext(UUID sessionId) {
        return contexts.containsKey(sessionId);
    }

    /**
     * Видаляє контекст сесії.
     */
    public void removeContext(UUID sessionId) {
        log.debug("Видалення контексту для сесії: {}", sessionId);
        contexts.remove(sessionId);
    }

    /**
     * Очищає застарілі контексти (старші за 1 годину).
     */
    public void cleanupExpiredContexts() {
        long currentTime = System.currentTimeMillis();
        long expirationTime = 60 * 60 * 1000; // 1 година

        contexts.entrySet().removeIf(entry -> {
            boolean expired = (currentTime - entry.getValue().getLastUpdated()) > expirationTime;
            if (expired) {
                log.debug("Видалення застарілого контексту для сесії: {}", entry.getKey());
            }
            return expired;
        });
    }

    /**
     * Отримує кількість активних контекстів.
     */
    public int getActiveContextsCount() {
        return contexts.size();
    }
}
