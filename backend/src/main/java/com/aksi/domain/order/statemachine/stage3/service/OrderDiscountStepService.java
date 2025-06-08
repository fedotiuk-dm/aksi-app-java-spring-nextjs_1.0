package com.aksi.domain.order.statemachine.stage3.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderDiscountRequest;
import com.aksi.domain.order.dto.OrderDiscountResponse;
import com.aksi.domain.order.model.DiscountType;
import com.aksi.domain.order.service.DiscountService;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage3.dto.OrderDiscountDTO;
import com.aksi.domain.order.statemachine.stage3.mapper.OrderDiscountMapper;
import com.aksi.domain.order.statemachine.stage3.validator.OrderDiscountValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для підетапу 3.2 "Знижки" з інтеграцією існуючого DiscountService
 *
 * Інтегрується з існуючим DiscountService для застосування знижок
 * та забезпечує функціональність wizard persistence.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderDiscountStepService {

    // Ключі для wizard persistence
    private static final String DISCOUNT_KEY = "orderDiscount";

    // Stage та step номери для persistence
    private static final int STAGE_NUMBER = 3;
    private static final int STEP_NUMBER = 2;

    private final OrderWizardPersistenceService persistenceService;
    private final OrderDiscountValidator validator;
    private final OrderDiscountMapper mapper;
    private final DiscountService discountService;
    private final ObjectMapper objectMapper;

    /**
     * Завантажує дані для підетапу 3.2 "Знижки".
     */
    public OrderDiscountDTO loadDiscountStep(String wizardId, List<String> orderItemCategories) {
        try {
            log.debug("Завантаження даних для підетапу знижок wizardId: {}", wizardId);

            // Забезпечуємо що orderItemCategories не null
            List<String> categories = orderItemCategories != null ? orderItemCategories : List.of();

            // Спробуємо завантажити з persistence
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            OrderDiscountDTO dto = loadSavedDiscountData(wizardData);

            if (dto == null) {
                // Створюємо новий DTO (orderId отримаємо з wizardData або створимо тимчасовий)
                UUID orderId = extractOrderIdFromWizardData(wizardData);
                dto = mapper.createForNewOrder(orderId, categories);
                log.debug("Створено новий OrderDiscountDTO для wizardId: {}", wizardId);
            } else {
                // Оновлюємо категорії товарів (могли змінитися на попередніх етапах)
                dto.setOrderItemCategories(categories);
                // Оновлюємо попередження тільки якщо DTO не null
                mapper.updateDiscountWarnings(dto);
                log.debug("Завантажено OrderDiscountDTO з persistence для wizardId: {}", wizardId);
            }

            // Спробуємо отримати поточну знижку з DiscountService якщо є orderId
            if (dto.getOrderId() != null) {
                try {
                    OrderDiscountResponse currentDiscount = discountService.getOrderDiscount(dto.getOrderId().toString());
                    if (currentDiscount != null) {
                        mapper.updateWithDiscountResponse(dto, currentDiscount);
                        log.debug("Оновлено OrderDiscountDTO з поточною знижкою");
                    }
                } catch (Exception e) {
                    log.debug("Поточна знижка не знайдена для замовлення: {}", dto.getOrderId());
                }
            }

            // Валідуємо дані
            List<String> errors = validator.validate(dto);
            dto.setErrors(errors);
            dto.setHasErrors(!errors.isEmpty());

            return dto;

        } catch (Exception e) {
            log.error("Помилка при завантаженні даних знижки для wizardId: {}", wizardId, e);
            // Використовуємо безпечні значення за замовчуванням
            List<String> safeCategories = orderItemCategories != null ? orderItemCategories : List.of();
            return mapper.createForNewOrder(UUID.randomUUID(), safeCategories);
        }
    }

    /**
     * Зберігає дані підетапу знижок.
     */
    public OrderDiscountDTO saveDiscountStep(String wizardId, OrderDiscountDTO dto) {
        try {
            log.debug("Збереження даних підетапу знижок для wizardId: {}", wizardId);

            if (dto == null) {
                throw new IllegalArgumentException("OrderDiscountDTO не може бути null");
            }

            // Валідуємо дані
            List<String> errors = validator.validate(dto);
            if (!errors.isEmpty()) {
                dto.setErrors(errors);
                dto.setHasErrors(true);
                log.warn("Валідація не пройдена для збереження знижки: {}", errors);
                return dto;
            }

            // Зберігаємо в persistence
            dto.setLastUpdated(LocalDateTime.now());
            persistenceService.saveWizardData(wizardId, DISCOUNT_KEY, dto, STAGE_NUMBER, STEP_NUMBER);

            log.info("Дані підетапу знижок збережено для wizardId: {}", wizardId);
            return dto;

        } catch (Exception e) {
            log.error("Помилка при збереженні даних знижки: {}", e.getMessage(), e);
            if (dto != null) {
                dto.setHasErrors(true);
                dto.setErrors(List.of("Помилка збереження: " + e.getMessage()));
            }
            return dto;
        }
    }

    /**
     * Застосовує знижку до замовлення.
     */
    public OrderDiscountDTO applyDiscount(String wizardId, OrderDiscountDTO dto) {
        try {
            log.debug("Застосування знижки для wizardId: {}, orderId: {}",
                     wizardId, dto != null ? dto.getOrderId() : "null");

            if (dto == null) {
                throw new IllegalArgumentException("OrderDiscountDTO не може бути null");
            }

            if (dto.getOrderId() == null) {
                throw new IllegalArgumentException("OrderId не може бути null для застосування знижки");
            }

            // Валідуємо дані перед застосуванням
            List<String> errors = validator.validate(dto);
            if (!errors.isEmpty()) {
                dto.setErrors(errors);
                dto.setHasErrors(true);
                return dto;
            }

            // Створюємо запит для DiscountService
            OrderDiscountRequest request = mapper.toOrderDiscountRequest(dto);
            if (request == null) {
                dto.setHasErrors(true);
                dto.setErrors(List.of("Помилка створення запиту знижки"));
                return dto;
            }

            // Застосовуємо знижку через DiscountService
            OrderDiscountResponse response = discountService.applyDiscount(request);

            // Оновлюємо DTO з результатом
            mapper.updateWithDiscountResponse(dto, response);

            // Зберігаємо оновлені дані
            dto.setLastUpdated(LocalDateTime.now());
            persistenceService.saveWizardData(wizardId, DISCOUNT_KEY, dto, STAGE_NUMBER, STEP_NUMBER);

            log.info("Знижку застосовано для wizardId: {}, orderId: {}", wizardId, dto.getOrderId());
            return dto;

        } catch (Exception e) {
            log.error("Помилка при застосуванні знижки: {}", e.getMessage(), e);
            if (dto != null) {
                dto.setHasErrors(true);
                dto.setErrors(List.of("Помилка застосування знижки: " + e.getMessage()));
            }
            return dto;
        }
    }

    /**
     * Видаляє знижку з замовлення.
     */
    public OrderDiscountDTO removeDiscount(String wizardId, UUID orderId) {
        try {
            log.debug("Видалення знижки для wizardId: {}, orderId: {}", wizardId, orderId);

            if (orderId == null) {
                throw new IllegalArgumentException("orderId не може бути null");
            }

            // Видаляємо знижку через DiscountService
            OrderDiscountResponse response = discountService.removeDiscount(orderId.toString());

            // Створюємо DTO без знижки
            OrderDiscountDTO dto = mapper.createForNewOrder(orderId, List.of());
            if (response != null) {
                mapper.updateWithDiscountResponse(dto, response);
            }

            // Зберігаємо оновлені дані
            dto.setLastUpdated(LocalDateTime.now());
            persistenceService.saveWizardData(wizardId, DISCOUNT_KEY, dto, STAGE_NUMBER, STEP_NUMBER);

            log.info("Знижку видалено для wizardId: {}, orderId: {}", wizardId, orderId);
            return dto;

        } catch (Exception e) {
            log.error("Помилка при видаленні знижки: {}", e.getMessage(), e);
            OrderDiscountDTO dto = mapper.createForNewOrder(orderId != null ? orderId : UUID.randomUUID(), List.of());
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка видалення знижки: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Оновлює тип знижки.
     */
    public OrderDiscountDTO updateDiscountType(String wizardId, DiscountType discountType,
                                              Integer percentage, String description,
                                              List<String> categories) {
        try {
            log.debug("Оновлення типу знижки для wizardId: {} на тип: {}", wizardId, discountType);

            if (discountType == null) {
                throw new IllegalArgumentException("discountType не може бути null");
            }

            // Забезпечуємо що categories не null
            List<String> safeCategories = categories != null ? categories : List.of();

            // Завантажуємо поточний DTO
            OrderDiscountDTO dto = loadDiscountStep(wizardId, safeCategories);

            // Оновлюємо тип знижки
            mapper.updateDiscountType(dto, discountType, percentage, description);

            // Валідуємо оновлені дані
            List<String> errors = validator.validate(dto);
            dto.setErrors(errors);
            dto.setHasErrors(!errors.isEmpty());

            // Якщо валідація пройшла і це не "без знижки", застосовуємо знижку
            if (errors.isEmpty() && discountType != DiscountType.NO_DISCOUNT && dto.getOrderId() != null) {
                dto = applyDiscount(wizardId, dto);
            } else if (discountType == DiscountType.NO_DISCOUNT && dto.getOrderId() != null) {
                // Видаляємо знижку якщо обрано "без знижки"
                dto = removeDiscount(wizardId, dto.getOrderId());
            } else {
                // Просто зберігаємо дані без застосування
                dto = saveDiscountStep(wizardId, dto);
            }

            log.info("Тип знижки оновлено для wizardId: {}", wizardId);
            return dto;

        } catch (Exception e) {
            log.error("Помилка при оновленні типу знижки: {}", e.getMessage(), e);
            List<String> safeCategories = categories != null ? categories : List.of();
            OrderDiscountDTO dto = mapper.createForNewOrder(UUID.randomUUID(), safeCategories);
            dto.setHasErrors(true);
            dto.setErrors(List.of("Помилка оновлення типу знижки: " + e.getMessage()));
            return dto;
        }
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     */
    public boolean canProceedToNextStep(String wizardId) {
        try {
            if (wizardId == null || wizardId.isEmpty()) {
                return false;
            }

            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            OrderDiscountDTO dto = loadSavedDiscountData(wizardData);

            if (dto == null) {
                // Якщо немає даних, то можна перейти (без знижки)
                return true;
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
            persistenceService.saveWizardData(wizardId, DISCOUNT_KEY, null, STAGE_NUMBER, STEP_NUMBER);
            log.debug("Дані підетапу знижок очищено для wizardId: {}", wizardId);
        } catch (Exception e) {
            log.error("Помилка при очищенні даних підетапу знижок: {}", e.getMessage(), e);
        }
    }

    /**
     * Перевіряє чи можна застосувати знижку до категорії.
     */
    public boolean isDiscountApplicable(String categoryCode) {
        if (categoryCode == null || categoryCode.isEmpty()) {
            return false;
        }
        return discountService.isDiscountApplicable(categoryCode);
    }

    /**
     * Аналізує категорії товарів для визначення можливості застосування знижки.
     */
    public String analyzeDiscountApplicability(List<String> categories) {
        if (categories == null || categories.isEmpty()) {
            return "Відсутні товари для аналізу можливості застосування знижки";
        }

        List<String> nonDiscountableCategories = categories.stream()
                .filter(category -> category != null && !category.isEmpty())
                .filter(category -> !discountService.isDiscountApplicable(category))
                .toList();

        if (nonDiscountableCategories.isEmpty()) {
            return null; // Знижка може бути застосована до всіх категорій
        }

        if (nonDiscountableCategories.size() == categories.size()) {
            return "Знижка не може бути застосована - всі товари належать до категорій що не підлягають знижкам";
        }

        return "Знижка буде застосована частково. Не підлягають знижкам: " +
               String.join(", ", nonDiscountableCategories);
    }

    // Приватні допоміжні методи

    /**
     * Завантажує збережені дані знижки з wizard даних.
     */
    private OrderDiscountDTO loadSavedDiscountData(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(DISCOUNT_KEY);
            if (data == null) {
                return null;
            }

            if (data instanceof OrderDiscountDTO) {
                return (OrderDiscountDTO) data;
            } else {
                return objectMapper.convertValue(data, OrderDiscountDTO.class);
            }
        } catch (Exception e) {
            log.error("Помилка завантаження збережених даних знижки: {}", e.getMessage(), e);
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
