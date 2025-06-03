package com.aksi.domain.order.statemachine.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.entity.OrderWizardSessionEntity;
import com.aksi.domain.order.statemachine.entity.OrderWizardStateDataEntity;
import com.aksi.domain.order.statemachine.repository.OrderWizardSessionRepository;
import com.aksi.domain.order.statemachine.repository.OrderWizardStateDataRepository;
import com.aksi.domain.user.entity.UserEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для персистентності Order Wizard даних
 * Забезпечує збереження та відновлення стану wizard з БД
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderWizardPersistenceService {

    private final OrderWizardSessionRepository sessionRepository;
    private final OrderWizardStateDataRepository stateDataRepository;
    private final ObjectMapper objectMapper;

    /**
     * Створює нову сесію wizard
     */
    public OrderWizardSessionEntity createWizardSession(String wizardId, UserEntity user) {
        OrderWizardSessionEntity session = OrderWizardSessionEntity.builder()
            .wizardId(wizardId)
            .currentState(OrderState.INITIAL)
            .user(user)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusHours(24)) // Сесія живе 24 години
            .isActive(true)
            .build();

        return sessionRepository.save(session);
    }

    /**
     * Оновлює стан сесії
     */
    public void updateSessionState(String wizardId, OrderState newState) {
        sessionRepository.findByWizardIdAndIsActiveTrue(wizardId)
            .ifPresent(session -> {
                session.setCurrentState(newState);
                session.setUpdatedAt(LocalDateTime.now());
                sessionRepository.save(session);
                log.debug("Оновлено стан сесії {} на {}", wizardId, newState);
            });
    }

    /**
     * Зберігає дані wizard
     */
    public void saveWizardData(String wizardId, String dataKey, Object value, int stage, int step) {
        Optional<OrderWizardSessionEntity> sessionOpt = sessionRepository.findByWizardIdAndIsActiveTrue(wizardId);

        if (sessionOpt.isEmpty()) {
            log.warn("Не знайдено активну сесію для wizard: {}", wizardId);
            return;
        }

        OrderWizardSessionEntity session = sessionOpt.get();

        try {
            String jsonValue = objectMapper.writeValueAsString(value);

            // Перевіряємо чи існує запис для цього ключа
            Optional<OrderWizardStateDataEntity> existingData =
                stateDataRepository.findByWizardSessionIdAndDataKey(session.getId(), dataKey);

            if (existingData.isPresent()) {
                // Оновлюємо існуючий запис
                OrderWizardStateDataEntity data = existingData.get();
                data.updateValue(jsonValue);
                data.setStage(stage);
                data.setStep(step);
                stateDataRepository.save(data);
            } else {
                // Створюємо новий запис
                OrderWizardStateDataEntity newData = OrderWizardStateDataEntity.builder()
                    .wizardSession(session)
                    .stage(stage)
                    .step(step)
                    .dataKey(dataKey)
                    .dataValue(jsonValue)
                    .dataType(OrderWizardStateDataEntity.DataType.JSON)
                    .isValidated(false)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

                stateDataRepository.save(newData);
            }

            log.debug("Збережено дані wizard {} для ключа {}", wizardId, dataKey);

        } catch (JsonProcessingException e) {
            log.error("Помилка серіалізації даних для wizard {}, ключ {}: {}",
                wizardId, dataKey, e.getMessage(), e);
        }
    }

    /**
     * Завантажує дані wizard
     */
    @Transactional(readOnly = true)
    public Map<String, Object> loadWizardData(String wizardId) {
        Optional<OrderWizardSessionEntity> sessionOpt = sessionRepository.findByWizardIdAndIsActiveTrue(wizardId);

        if (sessionOpt.isEmpty()) {
            log.warn("Не знайдено активну сесію для wizard: {}", wizardId);
            return Map.of();
        }

        List<OrderWizardStateDataEntity> stateData =
            stateDataRepository.findByWizardSessionIdOrderByStageAscStepAsc(sessionOpt.get().getId());

        Map<String, Object> result = new java.util.HashMap<>();

        for (OrderWizardStateDataEntity data : stateData) {
            try {
                Object value = objectMapper.readValue(data.getDataValue(), Object.class);
                result.put(data.getDataKey(), value);
            } catch (JsonProcessingException e) {
                log.error("Помилка десеріалізації даних для wizard {}, ключ {}: {}",
                    wizardId, data.getDataKey(), e.getMessage(), e);
            }
        }

        return result;
    }

    /**
     * Отримує сесію за wizardId
     */
    @Transactional(readOnly = true)
    public Optional<OrderWizardSessionEntity> getWizardSession(String wizardId) {
        return sessionRepository.findByWizardIdAndIsActiveTrue(wizardId);
    }

    /**
     * Деактивує сесію wizard
     */
    public void deactivateWizardSession(String wizardId) {
        sessionRepository.findByWizardIdAndIsActiveTrue(wizardId)
            .ifPresent(session -> {
                session.deactivate();
                sessionRepository.save(session);
                log.info("Деактивовано сесію wizard: {}", wizardId);
            });
    }

    /**
     * Продовжує сесію wizard
     */
    public void extendWizardSession(String wizardId, int hours) {
        sessionRepository.findByWizardIdAndIsActiveTrue(wizardId)
            .ifPresent(session -> {
                session.extendSession(hours);
                sessionRepository.save(session);
                log.debug("Продовжено сесію wizard {} на {} годин", wizardId, hours);
            });
    }

    /**
     * Очищає закінчені сесії
     */
    @Transactional
    public int cleanupExpiredSessions() {
        int deactivated = sessionRepository.deactivateExpiredSessions(LocalDateTime.now());

        if (deactivated > 0) {
            log.info("Деактивовано {} закінчених сесій wizard", deactivated);
        }

        return deactivated;
    }

    /**
     * Видаляє старі неактивні сесії
     */
    @Transactional
    public int deleteOldInactiveSessions(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        int deleted = sessionRepository.deleteOldInactiveSessions(cutoffDate);

        if (deleted > 0) {
            log.info("Видалено {} старих неактивних сесій wizard", deleted);
        }

        return deleted;
    }

    /**
     * Отримує активні сесії користувача
     */
    @Transactional(readOnly = true)
    public List<OrderWizardSessionEntity> getUserActiveSessions(UUID userId) {
        return sessionRepository.findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId);
    }

    /**
     * Перевіряє чи всі дані етапу валідні
     */
    @Transactional(readOnly = true)
    public boolean isStageDataValid(String wizardId, int stage) {
        Optional<OrderWizardSessionEntity> sessionOpt = sessionRepository.findByWizardIdAndIsActiveTrue(wizardId);

        if (sessionOpt.isEmpty()) {
            return false;
        }

        return stateDataRepository.isStageDataValid(sessionOpt.get().getId(), stage);
    }
}
