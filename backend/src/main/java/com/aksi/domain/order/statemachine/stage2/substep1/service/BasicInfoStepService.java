package com.aksi.domain.order.statemachine.stage2.substep1.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.enums.ItemWizardStep;
import com.aksi.domain.order.statemachine.stage2.integration.PricingIntegrationService;
import com.aksi.domain.order.statemachine.stage2.service.ItemWizardManagementService;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.PriceListItemDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.ServiceCategoryDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.mapper.BasicInfoMapper;
import com.aksi.domain.order.statemachine.stage2.substep1.validator.BasicInfoValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для управління підетапом 2.1: Основна інформація про предмет
 *
 * Відповідає за:
 * - Отримання категорій послуг через PricingIntegrationService
 * - Отримання предметів з прайс-листа через PricingIntegrationService
 * - Розрахунок базової ціни через PricingIntegrationService
 * - Валідацію основної інформації через BasicInfoValidator
 * - Збереження/завантаження даних підетапу
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BasicInfoStepService {

    private final PricingIntegrationService pricingIntegrationService;
    private final BasicInfoValidator basicInfoValidator;
    private final BasicInfoMapper basicInfoMapper;
    private final ItemWizardManagementService itemWizardManagementService;

    /**
     * Отримує список доступних категорій послуг
     *
     * @return список категорій
     */
    public List<ServiceCategoryDTO> getAvailableCategories() {
        log.debug("Отримання доступних категорій послуг");

        try {
            List<com.aksi.domain.pricing.dto.ServiceCategoryDTO> categories =
                pricingIntegrationService.getServiceCategories();
            return basicInfoMapper.mapCategoriesToDTO(categories);
        } catch (Exception e) {
            log.error("Помилка при отриманні категорій послуг", e);
            throw new RuntimeException("Не вдалося завантажити категорії послуг", e);
        }
    }

    /**
     * Отримує категорію за кодом
     *
     * @param categoryCode код категорії
     * @return категорія або null якщо не знайдена
     */
    public ServiceCategoryDTO getCategoryByCode(String categoryCode) {
        log.debug("Отримання категорії за кодом: {}", categoryCode);

        if (categoryCode == null || categoryCode.trim().isEmpty()) {
            return null;
        }

        try {
            com.aksi.domain.pricing.dto.ServiceCategoryDTO category =
                pricingIntegrationService.getCategoryByCode(categoryCode);
            return category != null ? basicInfoMapper.mapCategoryToDTO(category) : null;
        } catch (Exception e) {
            log.error("Помилка при отриманні категорії за кодом: {}", categoryCode, e);
            return null;
        }
    }

    /**
     * Отримує предмети з прайс-листа для вказаної категорії
     *
     * @param categoryCode код категорії
     * @return список предметів
     */
    public List<PriceListItemDTO> getItemsByCategory(String categoryCode) {
        log.debug("Отримання предметів для категорії: {}", categoryCode);

        if (categoryCode == null || categoryCode.trim().isEmpty()) {
            return List.of();
        }

        try {
            List<com.aksi.domain.pricing.dto.PriceListItemDTO> items =
                pricingIntegrationService.getPriceListItemsByCode(categoryCode);
            return basicInfoMapper.mapItemsToDTO(items);
        } catch (Exception e) {
            log.error("Помилка при отриманні предметів для категорії: {}", categoryCode, e);
            return List.of();
        }
    }

        /**
     * Отримує предмет з прайс-листа за ID
     *
     * @param itemId ID предмета
     * @return предмет або null якщо не знайдений
     */
    public PriceListItemDTO getItemById(String itemId) {
        log.debug("Отримання предмета за ID: {}", itemId);

        if (itemId == null || itemId.trim().isEmpty()) {
            return null;
        }

                try {
            UUID uuid = UUID.fromString(itemId);
            List<com.aksi.domain.pricing.dto.PriceListItemDTO> items =
                pricingIntegrationService.getPriceListItemsById(uuid);

            if (items == null || items.isEmpty()) {
                return null;
            }

            // Беремо перший предмет (метод повинен повертати один предмет за ID)
            com.aksi.domain.pricing.dto.PriceListItemDTO item = items.get(0);
            return basicInfoMapper.mapItemToDTO(item);
        } catch (IllegalArgumentException e) {
            log.warn("Некоректний формат UUID для предмета: {}", itemId);
            return null;
        } catch (Exception e) {
            log.error("Помилка при отриманні предмета за ID: {}", itemId, e);
            return null;
        }
    }

    /**
     * Отримує рекомендовану одиницю виміру для категорії
     *
     * @param categoryCode код категорії
     * @return рекомендована одиниця виміру
     */
    public String getRecommendedUnitOfMeasure(String categoryCode) {
        log.debug("Отримання рекомендованої одиниці виміру для категорії: {}", categoryCode);

        try {
            return pricingIntegrationService.getRecommendedUnitOfMeasure(categoryCode, null);
        } catch (Exception e) {
            log.warn("Помилка при отриманні рекомендованої одиниці виміру для категорії: {}", categoryCode, e);
            return "шт"; // За замовчуванням
        }
    }

        /**
     * Розраховує базову ціну для предмета
     *
     * @param categoryCode код категорії
     * @param itemName назва предмета
     * @param color колір (може бути null)
     * @return базова ціна
     */
    public BigDecimal getBasePrice(String categoryCode, String itemName, String color) {
        log.debug("Розрахунок базової ціни для предмета: categoryCode={}, itemName={}, color={}",
                  categoryCode, itemName, color);

        try {
            return pricingIntegrationService.calculateBasePrice(categoryCode, itemName, color);
        } catch (Exception e) {
            log.warn("Помилка при розрахунку базової ціни", e);
            return BigDecimal.ZERO;
        }
    }

    /**
     * Валідує основну інформацію про предмет
     *
     * @param basicInfo дані для валідації
     * @return валідовані дані з результатами валідації
     */
    public BasicInfoDTO validateBasicInfo(BasicInfoDTO basicInfo) {
        log.debug("Валідація основної інформації: {}", basicInfo);

        if (basicInfo == null) {
            return BasicInfoDTO.builder()
                    .isValid(false)
                    .validationErrors(List.of("Основна інформація не може бути порожньою"))
                    .build();
        }

        // Валідація через BasicInfoValidator
        var validationResult = basicInfoValidator.validate(basicInfo);

        // Створюємо копію з результатами валідації
        return basicInfo.toBuilder()
                .isValid(validationResult.isValid())
                .validationErrors(validationResult.getErrors())
                .build();
    }

    /**
     * Автоматично заповнює дані при виборі предмета з прайс-листа
     *
     * @param basicInfo поточні дані
     * @param selectedItemId ID вибраного предмета
     * @return оновлені дані
     */
    public BasicInfoDTO autoFillFromPriceListItem(BasicInfoDTO basicInfo, String selectedItemId) {
        log.debug("Автозаповнення даних для предмета з прайс-листа: {}", selectedItemId);

        if (basicInfo == null || selectedItemId == null || selectedItemId.trim().isEmpty()) {
            return basicInfo;
        }

        try {
            PriceListItemDTO item = getItemById(selectedItemId);
            if (item == null) {
                log.warn("Предмет з ID {} не знайдений", selectedItemId);
                return basicInfo;
            }

            // Автозаповнення даних з прайс-листа
            return basicInfo.toBuilder()
                    .itemId(item.getId())
                    .itemCode(item.getCode())
                    .itemName(item.getName())
                    .description(item.getDescription())
                    .unitOfMeasure(item.getUnitOfMeasure())
                    .basePrice(item.getBasePrice())
                    .build();

        } catch (Exception e) {
            log.error("Помилка при автозаповненні даних з прайс-листа", e);
            return basicInfo;
        }
    }

    /**
     * Обчислює ціну на основі базової інформації
     *
     * @param basicInfo дані для розрахунку
     * @return оновлені дані з розрахованою ціною
     */
    public BasicInfoDTO calculatePrice(BasicInfoDTO basicInfo) {
        log.debug("Розрахунок ціни для основної інформації: {}", basicInfo);

        if (basicInfo == null || !basicInfo.isComplete()) {
            return basicInfo;
        }

                try {
            BigDecimal basePrice = getBasePrice(
                basicInfo.getCategoryCode(),
                basicInfo.getItemName(),
                null // Колір поки що null, буде додано в наступних етапах
            );

            return basicInfo.toBuilder()
                    .basePrice(basePrice)
                    .build();

        } catch (Exception e) {
            log.error("Помилка при розрахунку ціни", e);
            return basicInfo;
        }
    }

    /**
     * Зберігає основну інформацію для вказаної сесії візарда
     *
     * @param wizardId ID сесії візарда
     * @param basicInfo дані для збереження
     * @return збережені дані
     */
    public BasicInfoDTO saveBasicInfo(String wizardId, BasicInfoDTO basicInfo) {
        log.debug("Збереження основної інформації для візарда: {}", wizardId);

        // Валідуємо перед збереженням
        BasicInfoDTO validatedInfo = validateBasicInfo(basicInfo);

        try {
            // Зберігаємо через ItemWizardManagementService
            itemWizardManagementService.saveStepData(wizardId, ItemWizardStep.BASIC_INFO, validatedInfo);

            log.info("Основну інформацію збережено для візарда: {}, valid: {}",
                    wizardId, validatedInfo.getIsValid());

            return validatedInfo;

        } catch (Exception e) {
            log.error("Помилка збереження основної інформації для візарда: {}", wizardId, e);
            return validatedInfo.toBuilder()
                    .isValid(false)
                    .validationErrors(java.util.List.of("Помилка збереження: " + e.getMessage()))
                    .build();
        }
    }

    /**
     * Завантажує основну інформацію для вказаної сесії візарда
     *
     * @param wizardId ID сесії візарда
     * @return збережені дані або порожні дані якщо нічого не збережено
     */
    public BasicInfoDTO loadBasicInfo(String wizardId) {
        log.debug("Завантаження основної інформації для візарда: {}", wizardId);

        try {
            BasicInfoDTO loadedInfo = itemWizardManagementService.loadStepData(
                    wizardId, ItemWizardStep.BASIC_INFO, BasicInfoDTO.class);

            if (loadedInfo != null) {
                log.debug("Основну інформацію завантажено для візарда: {}", wizardId);
                return loadedInfo;
            } else {
                log.debug("Основна інформація не знайдена для візарда: {}, повертаємо порожні дані", wizardId);
                return BasicInfoDTO.builder().build();
            }

        } catch (Exception e) {
            log.warn("Помилка завантаження основної інформації для візарда: {}", wizardId, e);
            return BasicInfoDTO.builder()
                    .isValid(false)
                    .validationErrors(java.util.List.of("Помилка завантаження: " + e.getMessage()))
                    .build();
        }
    }

    /**
     * Перевіряє чи доступна категорія для вибору
     *
     * @param categoryCode код категорії
     * @return true якщо доступна
     */
    public boolean isCategoryAvailable(String categoryCode) {
        try {
            return pricingIntegrationService.isCategoryAvailable(categoryCode);
        } catch (Exception e) {
            log.warn("Помилка при перевірці доступності категорії: {}", categoryCode, e);
            return false;
        }
    }

    /**
     * Перевіряє чи доступний предмет для вибору
     *
     * @param categoryCode код категорії (обов'язковий)
     * @param itemId ID предмета
     * @return true якщо доступний
     */
    public boolean isItemAvailable(String categoryCode, String itemId) {
        try {
            return pricingIntegrationService.isItemAvailable(categoryCode, itemId);
        } catch (Exception e) {
            log.warn("Помилка при перевірці доступності предмета: categoryCode={}, itemId={}",
                     categoryCode, itemId, e);
            return false;
        }
    }

    /**
     * Швидка перевірка готовності до наступного кроку
     *
     * @param basicInfo дані для перевірки
     * @return true якщо можна переходити до наступного кроку
     */
    public boolean isReadyForNextStep(BasicInfoDTO basicInfo) {
        return basicInfoValidator.isReadyForNextStep(basicInfo);
    }

    /**
     * Отримує статистику по основній інформації
     *
     * @param basicInfo дані для аналізу
     * @return інформація про стан заповнення
     */
    public String getCompletionStatus(BasicInfoDTO basicInfo) {
        if (basicInfo == null) {
            return "Не заповнено";
        }

        if (basicInfo.isComplete() && basicInfo.getIsValid()) {
            return "Готово";
        } else if (basicInfo.isComplete()) {
            return "Заповнено з помилками";
        } else {
            return "Частково заповнено";
        }
    }
}
