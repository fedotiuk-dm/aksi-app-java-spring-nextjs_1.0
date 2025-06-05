package com.aksi.domain.order.statemachine.stage3.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage3.dto.OrderAdditionalInfoDTO;
import com.aksi.domain.order.statemachine.stage3.mapper.OrderAdditionalInfoMapper;
import com.aksi.domain.order.statemachine.stage3.validator.OrderAdditionalInfoValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для підетапу 3.4 "Додаткова інформація".
 *
 * Обробляє збереження та завантаження:
 * - Загальних примітки до замовлення
 * - Додаткових вимог клієнта
 * - Критичної інформації
 * - Необхідності додаткового підтвердження
 *
 * Це найпростіший підетап етапу 3, оскільки всі поля є необов'язковими.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderAdditionalInfoStepService {

    // Ключі для wizard persistence
    private static final String ADDITIONAL_INFO_KEY = "orderAdditionalInfo";

    // Stage та step номери для persistence
    private static final int STAGE_NUMBER = 3;
    private static final int STEP_NUMBER = 4;

    private final OrderWizardPersistenceService persistenceService;
    private final OrderAdditionalInfoValidator validator;
    private final OrderAdditionalInfoMapper mapper;
    private final ObjectMapper objectMapper;

    /**
     * Завантажує дані для підетапу 3.4 "Додаткова інформація".
     */
    public OrderAdditionalInfoDTO loadAdditionalInfoStep(String wizardId) {
        try {
            log.debug("Завантаження даних для підетапу додаткової інформації wizardId: {}", wizardId);

            // Спробуємо завантажити з persistence
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            OrderAdditionalInfoDTO dto = loadSavedAdditionalInfoData(wizardData);

            if (dto == null) {
                // Створюємо новий DTO (orderId отримаємо з wizardData або створимо тимчасовий)
                UUID orderId = extractOrderIdFromWizardData(wizardData);
                dto = mapper.createForNewOrder(orderId);
                log.debug("Створено новий OrderAdditionalInfoDTO для wizardId: {}", wizardId);
            } else {
                log.debug("Завантажено OrderAdditionalInfoDTO з persistence для wizardId: {}", wizardId);
            }

            // Валідуємо дані
            List<String> errors = validator.validate(dto);
            dto.setValidationErrors(errors);

            return dto;

        } catch (Exception e) {
            log.error("Помилка при завантаженні даних додаткової інформації для wizardId: {}", wizardId, e);
            // Використовуємо безпечні значення за замовчуванням
            return mapper.createForNewOrder(UUID.randomUUID());
        }
    }

    /**
     * Зберігає дані підетапу додаткової інформації.
     */
    public OrderAdditionalInfoDTO saveAdditionalInfoStep(String wizardId, OrderAdditionalInfoDTO dto) {
        try {
            log.debug("Збереження даних підетапу додаткової інформації для wizardId: {}", wizardId);

            if (dto == null) {
                throw new IllegalArgumentException("OrderAdditionalInfoDTO не може бути null");
            }

            // Валідуємо дані
            List<String> errors = validator.validate(dto);
            if (!errors.isEmpty()) {
                dto.setValidationErrors(errors);
                log.warn("Валідація не пройдена для збереження додаткової інформації: {}", errors);
                return dto;
            }

            // Оновлюємо статус готовності
            dto.setIsComplete(true);
            dto.setLastUpdated(LocalDateTime.now());

            // Зберігаємо в persistence
            persistenceService.saveWizardData(wizardId, ADDITIONAL_INFO_KEY, dto, STAGE_NUMBER, STEP_NUMBER);

            log.info("Дані підетапу додаткової інформації збережено для wizardId: {}", wizardId);
            return dto;

        } catch (Exception e) {
            log.error("Помилка при збереженні даних додаткової інформації: {}", e.getMessage(), e);
            if (dto != null) {
                dto.setHasErrors(true);
                dto.setErrors(List.of("Помилка збереження: " + e.getMessage()));
            }
            return dto;
        }
    }

    /**
     * Оновлює примітки до замовлення.
     */
    public OrderAdditionalInfoDTO updateOrderNotes(String wizardId, String notes) {
        try {
            log.debug("Оновлення примітки до замовлення для wizardId: {}", wizardId);

            // Завантажуємо поточний DTO
            OrderAdditionalInfoDTO dto = loadAdditionalInfoStep(wizardId);

            // Оновлюємо примітки
            mapper.updateOrderNotes(dto, notes);

            // Зберігаємо оновлені дані
            return saveAdditionalInfoStep(wizardId, dto);

        } catch (Exception e) {
            log.error("Помилка при оновленні примітки: {}", e.getMessage(), e);
            OrderAdditionalInfoDTO dto = mapper.createForNewOrder(UUID.randomUUID());
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка оновлення примітки: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Оновлює вимоги клієнта.
     */
    public OrderAdditionalInfoDTO updateCustomerRequirements(String wizardId, String requirements) {
        try {
            log.debug("Оновлення вимог клієнта для wizardId: {}", wizardId);

            // Завантажуємо поточний DTO
            OrderAdditionalInfoDTO dto = loadAdditionalInfoStep(wizardId);

            // Оновлюємо вимоги клієнта
            mapper.updateCustomerRequirements(dto, requirements);

            // Зберігаємо оновлені дані
            return saveAdditionalInfoStep(wizardId, dto);

        } catch (Exception e) {
            log.error("Помилка при оновленні вимог клієнта: {}", e.getMessage(), e);
            OrderAdditionalInfoDTO dto = mapper.createForNewOrder(UUID.randomUUID());
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка оновлення вимог клієнта: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Оновлює критичну інформацію.
     */
    public OrderAdditionalInfoDTO updateCriticalInfo(String wizardId, boolean hasCriticalInfo, String criticalInfoText) {
        try {
            log.debug("Оновлення критичної інформації для wizardId: {}", wizardId);

            // Завантажуємо поточний DTO
            OrderAdditionalInfoDTO dto = loadAdditionalInfoStep(wizardId);

            // Оновлюємо критичну інформацію
            mapper.updateCriticalInfo(dto, hasCriticalInfo, criticalInfoText);

            // Зберігаємо оновлені дані
            return saveAdditionalInfoStep(wizardId, dto);

        } catch (Exception e) {
            log.error("Помилка при оновленні критичної інформації: {}", e.getMessage(), e);
            OrderAdditionalInfoDTO dto = mapper.createForNewOrder(UUID.randomUUID());
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка оновлення критичної інформації: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Оновлює інформацію про додаткове підтвердження.
     */
    public OrderAdditionalInfoDTO updateAdditionalConfirmation(String wizardId, boolean requiresConfirmation, String reason) {
        try {
            log.debug("Оновлення додаткового підтвердження для wizardId: {}", wizardId);

            // Завантажуємо поточний DTO
            OrderAdditionalInfoDTO dto = loadAdditionalInfoStep(wizardId);

            // Оновлюємо інформацію про підтвердження
            mapper.updateAdditionalConfirmation(dto, requiresConfirmation, reason);

            // Зберігаємо оновлені дані
            return saveAdditionalInfoStep(wizardId, dto);

        } catch (Exception e) {
            log.error("Помилка при оновленні додаткового підтвердження: {}", e.getMessage(), e);
            OrderAdditionalInfoDTO dto = mapper.createForNewOrder(UUID.randomUUID());
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка оновлення додаткового підтвердження: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Очищає всю додаткову інформацію.
     */
    public OrderAdditionalInfoDTO clearAllAdditionalInfo(String wizardId) {
        try {
            log.debug("Очищення всієї додаткової інформації для wizardId: {}", wizardId);

            // Завантажуємо поточний DTO
            OrderAdditionalInfoDTO dto = loadAdditionalInfoStep(wizardId);

            // Очищаємо всю інформацію
            mapper.clearAllAdditionalInfo(dto);

            // Зберігаємо очищені дані
            return saveAdditionalInfoStep(wizardId, dto);

        } catch (Exception e) {
            log.error("Помилка при очищенні додаткової інформації: {}", e.getMessage(), e);
            OrderAdditionalInfoDTO dto = mapper.createForNewOrder(UUID.randomUUID());
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка очищення додаткової інформації: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку (етапу 4).
     */
    public boolean canProceedToNextStep(String wizardId) {
        try {
            if (wizardId == null || wizardId.isEmpty()) {
                return false;
            }

            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            OrderAdditionalInfoDTO dto = loadSavedAdditionalInfoData(wizardData);

            // Для цього підетапу завжди можна перейти далі, оскільки всі поля необов'язкові
            // Але перевіряємо валідацію
            if (dto == null) {
                return true; // Якщо немає даних, то можна перейти
            }

            return validator.canProceedToNext(dto);

        } catch (Exception e) {
            log.error("Помилка при перевірці можливості переходу до наступного кроку: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Очищає дані підетапу.
     */
    public void clearStepData(String wizardId) {
        try {
            if (wizardId == null || wizardId.isEmpty()) {
                log.warn("Спроба очистити дані для null/empty wizardId");
                return;
            }

            // Очищаємо дані шляхом збереження null значення
            persistenceService.saveWizardData(wizardId, ADDITIONAL_INFO_KEY, null, STAGE_NUMBER, STEP_NUMBER);
            log.debug("Дані підетапу додаткової інформації очищено для wizardId: {}", wizardId);
        } catch (Exception e) {
            log.error("Помилка при очищенні даних підетапу додаткової інформації: {}", e.getMessage(), e);
        }
    }

    /**
     * Отримує підсумок додаткової інформації для відображення.
     */
    public String getAdditionalInfoSummary(String wizardId) {
        try {
            OrderAdditionalInfoDTO dto = loadAdditionalInfoStep(wizardId);
            return dto.getAdditionalInfoSummary();
        } catch (Exception e) {
            log.error("Помилка при отриманні підсумку додаткової інформації: {}", e.getMessage(), e);
            return "Помилка отримання підсумку";
        }
    }

    /**
     * Перевіряє чи є критичні помилки що блокують збереження.
     */
    public boolean hasCriticalErrors(String wizardId) {
        try {
            OrderAdditionalInfoDTO dto = loadAdditionalInfoStep(wizardId);
            return validator.hasCriticalErrors(dto);
        } catch (Exception e) {
            log.error("Помилка при перевірці критичних помилок: {}", e.getMessage(), e);
            return true; // При помилці вважаємо що є критичні проблеми
        }
    }

    // Приватні допоміжні методи

    /**
     * Завантажує збережені дані додаткової інформації з wizard даних.
     */
    private OrderAdditionalInfoDTO loadSavedAdditionalInfoData(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(ADDITIONAL_INFO_KEY);
            if (data == null) {
                return null;
            }

            if (data instanceof OrderAdditionalInfoDTO) {
                return (OrderAdditionalInfoDTO) data;
            } else {
                return objectMapper.convertValue(data, OrderAdditionalInfoDTO.class);
            }
        } catch (Exception e) {
            log.error("Помилка завантаження збережених даних додаткової інформації: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Витягує orderId з wizard даних (може бути в різних ключах).
     */
    private UUID extractOrderIdFromWizardData(Map<String, Object> wizardData) {
        try {
            // Спробуємо знайти orderId в різних можливих місцях
            Object orderIdValue = wizardData.get("orderId");
            if (orderIdValue instanceof UUID) {
                return (UUID) orderIdValue;
            } else if (orderIdValue instanceof String) {
                return UUID.fromString((String) orderIdValue);
            }

            // Якщо не знайшли, створюємо тимчасовий
            return UUID.randomUUID();
        } catch (Exception e) {
            log.warn("Не вдалося витягти orderId з wizard даних: {}", e.getMessage());
            return UUID.randomUUID();
        }
    }
}
