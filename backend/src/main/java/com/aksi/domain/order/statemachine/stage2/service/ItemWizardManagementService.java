package com.aksi.domain.order.statemachine.stage2.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemWizardSessionDTO;
import com.aksi.domain.order.statemachine.stage2.enums.ItemWizardStep;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemEditDataMapper;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemWizardDataMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс управління сесіями Item Wizard.
 *
 * Відповідає за:
 * - Створення та управління сесіями підвізарда
 * - Збереження/завантаження даних кроків
 * - Навігацію між кроками
 * - Збірку повного предмета з усіх кроків
 * - Режим редагування існуючих предметів
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ItemWizardManagementService {

    // Маппери для роботи з даними
    private final ItemWizardDataMapper itemWizardDataMapper;
    private final ItemEditDataMapper itemEditDataMapper;

    // Тимчасове сховище сесій (в production використовуйте Redis або database)
    private final Map<String, ItemWizardSessionDTO> activeSessions = new ConcurrentHashMap<>();

    // ========== Управління сесіями ==========

    /**
     * Створює нову сесію Item Wizard.
     */
    public ItemWizardSessionDTO createNewSession(String wizardId) {
        log.debug("Створення нової сесії Item Wizard для wizardId: {}", wizardId);

        String itemWizardId = generateItemWizardId();

        ItemWizardSessionDTO session = ItemWizardSessionDTO.builder()
            .wizardId(wizardId)
            .itemWizardId(itemWizardId)
            .currentStep(ItemWizardStep.BASIC_INFO)
            .isEditMode(false)
            .build();

        activeSessions.put(itemWizardId, session);

        log.info("Створено нову сесію Item Wizard: {}", itemWizardId);
        return session;
    }

    /**
     * Створює сесію для редагування існуючого предмета.
     */
    public ItemWizardSessionDTO createEditSession(String wizardId, String itemId, OrderItemDTO existingItem) {
        log.debug("Створення сесії редагування для предмета {} у wizardId: {}", itemId, wizardId);

        // Валідуємо предмет для редагування
        if (!itemEditDataMapper.validateOrderItemForEdit(existingItem)) {
            throw new RuntimeException("Предмет не може бути відредагований: недостатньо даних");
        }

        String itemWizardId = generateItemWizardId();

        ItemWizardSessionDTO session = ItemWizardSessionDTO.builder()
            .wizardId(wizardId)
            .itemWizardId(itemWizardId)
            .currentStep(ItemWizardStep.BASIC_INFO)
            .isEditMode(true)
            .editingItemId(itemId)
            .build();

        // Заповнюємо сесію даними з існуючого предмета через маппер
        itemEditDataMapper.populateSessionFromOrderItem(existingItem, session);

        activeSessions.put(itemWizardId, session);

        log.info("Створено сесію редагування Item Wizard: {}", itemWizardId);
        return session;
    }

    /**
     * Отримує активну сесію за ID.
     */
    public ItemWizardSessionDTO getSession(String itemWizardId) {
        ItemWizardSessionDTO session = activeSessions.get(itemWizardId);
        if (session == null) {
            throw new RuntimeException("Сесія Item Wizard не знайдена: " + itemWizardId);
        }
        return session;
    }

    /**
     * Оновлює сесію.
     */
    public void updateSession(ItemWizardSessionDTO session) {
        if (session.getItemWizardId() == null) {
            throw new RuntimeException("ID сесії не може бути null");
        }

        session.updateLastActivity();
        activeSessions.put(session.getItemWizardId(), session);

        log.debug("Оновлено сесію Item Wizard: {}", session.getItemWizardId());
    }

    /**
     * Очищує сесію після завершення.
     */
    public void clearSession(String itemWizardId) {
        activeSessions.remove(itemWizardId);
        log.info("Очищено сесію Item Wizard: {}", itemWizardId);
    }

    // ========== Робота з даними кроків ==========

    /**
     * Зберігає дані кроку в сесії.
     */
    public void saveStepData(String itemWizardId, ItemWizardStep step, Object data) {
        ItemWizardSessionDTO session = getSession(itemWizardId);
        session.setStepData(step, data);

        // Оновлюємо статус завершеності кроку
        session.setCurrentStepCompleted(true);
        session.setCanProceedToNextStep(true);

        updateSession(session);

        log.debug("Збережено дані кроку {} для сесії {}", step, itemWizardId);
    }

    /**
     * Завантажує дані кроку з сесії.
     */
    public <T> T loadStepData(String itemWizardId, ItemWizardStep step, Class<T> clazz) {
        ItemWizardSessionDTO session = getSession(itemWizardId);
        return session.getStepData(step, clazz);
    }

    /**
     * Перехід до наступного кроку.
     */
    public boolean proceedToNextStep(String itemWizardId) {
        ItemWizardSessionDTO session = getSession(itemWizardId);
        boolean success = session.proceedToNextStep();

        if (success) {
            updateSession(session);
            log.debug("Перехід до наступного кроку {} для сесії {}",
                session.getCurrentStep(), itemWizardId);
        }

        return success;
    }

    /**
     * Повернення до попереднього кроку.
     */
    public boolean goToPreviousStep(String itemWizardId) {
        ItemWizardSessionDTO session = getSession(itemWizardId);
        boolean success = session.goToPreviousStep();

        if (success) {
            updateSession(session);
            log.debug("Повернення до попереднього кроку {} для сесії {}",
                session.getCurrentStep(), itemWizardId);
        }

        return success;
    }

    // ========== Збірка повного предмета ==========

    /**
     * Збирає повний OrderItemDTO з усіх кроків сесії.
     * ВИКОРИСТОВУЄ МАППЕР замість заглушки!
     */
    public OrderItemDTO buildCompleteItem(String itemWizardId) {
        log.debug("Збірка повного предмета для сесії: {}", itemWizardId);

        ItemWizardSessionDTO session = getSession(itemWizardId);

        // Перевіряємо, що всі обов'язкові кроки завершені
        validateSessionCompleteness(session);

        try {
            // Використовуємо маппер для збірки повного предмета
            OrderItemDTO completeItem = itemWizardDataMapper.buildCompleteOrderItem(session);

            log.info("✅ Успішно зібрано повний предмет для сесії {}: {}",
                     itemWizardId, completeItem.getName());

            return completeItem;

        } catch (Exception e) {
            log.error("❌ Помилка збірки повного предмета для сесії {}: {}",
                      itemWizardId, e.getMessage(), e);
            throw new RuntimeException("Не вдалося зібрати повний предмет з даних сесії", e);
        }
    }

    // ========== Допоміжні методи ==========

    /**
     * Генерує унікальний ID для Item Wizard.
     */
    private String generateItemWizardId() {
        return "iw_" + UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * Перевіряє повноту сесії перед збіркою предмета.
     */
    private void validateSessionCompleteness(ItemWizardSessionDTO session) {
        log.debug("Валідація повноти сесії {}", session.getItemWizardId());

        // Перевіряємо, що всі обов'язкові кроки завершені
        for (ItemWizardStep step : ItemWizardStep.values()) {
            if (step.isRequired() && !session.isStepCompleted(step)) {
                String error = String.format("Обов'язковий крок '%s' не завершений", step.getStepName());
                log.error("❌ Валідація сесії {} неуспішна: {}", session.getItemWizardId(), error);
                throw new RuntimeException(error);
            }
        }

        log.debug("✅ Валідація сесії {} успішна", session.getItemWizardId());
    }

    /**
     * Отримує статистику по сесії для налагодження
     */
    public String getSessionStats(String itemWizardId) {
        try {
            ItemWizardSessionDTO session = getSession(itemWizardId);

            long completedSteps = java.util.Arrays.stream(ItemWizardStep.values())
                .mapToLong(step -> session.isStepCompleted(step) ? 1 : 0)
                .sum();

            return String.format("Сесія %s: %d/%d кроків завершено, поточний крок: %s",
                itemWizardId, completedSteps, ItemWizardStep.values().length,
                session.getCurrentStep().getStepName());

        } catch (Exception e) {
            return String.format("Помилка отримання статистики сесії %s: %s",
                itemWizardId, e.getMessage());
        }
    }

    /**
     * Скидає сесію до початкового стану
     */
    public void resetSession(String itemWizardId) {
        log.debug("Скидання сесії до початкового стану: {}", itemWizardId);

        ItemWizardSessionDTO session = getSession(itemWizardId);
        session.reset();
        updateSession(session);

        log.info("Сесію {} скинуто до початкового стану", itemWizardId);
    }
}
