package com.aksi.domain.order.statemachine.stage2.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.constants.ItemCharacteristicsConstants;
import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemCharacteristicsMapper;
import com.aksi.domain.order.statemachine.stage2.validator.ItemCharacteristicsValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Сервіс для управління підетапом 2.2 "Характеристики предмета".
 *
 * Відповідає за завантаження, збереження та валідацію характеристик предмета:
 * - Матеріал (з констант, фільтрується за категорією)
 * - Колір (з констант + можливість ввести власний)
 * - Наповнювач (з констант, показується тільки для відповідних категорій)
 * - Ступінь зносу (з констант, обов'язково)
 *
 * Використовує тільки реальні дані з констант і API.
 */
@Service
public class ItemCharacteristicsStepService {

    private static final Logger logger = LoggerFactory.getLogger(ItemCharacteristicsStepService.class);

    // Ключі для wizard persistence
    private static final String TEMP_ITEM_KEY = "tempOrderItem";
    private static final String CHARACTERISTICS_KEY = "itemCharacteristics";

    // Stage та step номери для persistence
    private static final int STAGE_NUMBER = 2;
    private static final int STEP_NUMBER = 2;

    private final OrderWizardPersistenceService persistenceService;
    private final ItemCharacteristicsValidator validator;
    private final ItemCharacteristicsMapper mapper;
    private final ObjectMapper objectMapper;

    public ItemCharacteristicsStepService(
            OrderWizardPersistenceService persistenceService,
            ItemCharacteristicsValidator validator,
            ItemCharacteristicsMapper mapper,
            ObjectMapper objectMapper) {
        this.persistenceService = persistenceService;
        this.validator = validator;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    /**
     * Завантажує характеристики предмета для підетапу 2.2.
     * Спочатку перевіряє збережені дані, потім дані з попереднього кроку.
     *
     * @param wizardId ID візарда
     * @return DTO з характеристиками предмета
     */
    public ItemCharacteristicsDTO loadCharacteristics(String wizardId) {
        logger.debug("Завантаження характеристик для wizard: {}", wizardId);

        try {
            // Завантажуємо всі дані wizard
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);

            // Спочатку перевіряємо збережені характеристики
            ItemCharacteristicsDTO dto = loadSavedCharacteristics(wizardData);

            if (dto == null) {
                // Якщо немає збережених, створюємо з тимчасового предмета
                dto = createFromTempItem(wizardData);
            }

            if (dto == null) {
                // Якщо і тимчасового предмета немає, створюємо порожні
                dto = createEmptyCharacteristics();
            }

            // Заповнюємо доступні опції з констант
            populateAvailableOptionsFromConstants(dto);

            // Налаштовуємо UI відповідно до категорії
            configureUIByCategory(dto);

            logger.debug("Характеристики завантажено для wizard: {}", wizardId);
            return dto;

        } catch (Exception e) {
            logger.error("Помилка завантаження характеристик для wizard {}: {}", wizardId, e.getMessage(), e);
            return createErrorCharacteristics("Помилка завантаження характеристик: " + e.getMessage());
        }
    }

    /**
     * Зберігає характеристики предмета.
     * Валідує дані, зберігає в wizard та оновлює тимчасовий предмет.
     *
     * @param wizardId ID візарда
     * @param characteristics Характеристики для збереження
     * @return Збережені характеристики з можливими помилками валідації
     */
    public ItemCharacteristicsDTO saveCharacteristics(String wizardId, ItemCharacteristicsDTO characteristics) {
        logger.debug("Збереження характеристик для wizard: {}", wizardId);

        try {
            // Валідуємо дані
            List<String> validationErrors = validator.validate(characteristics);
            if (!validationErrors.isEmpty()) {
                logger.warn("Валідація не пройшла для wizard {}: {}", wizardId, validationErrors);
                characteristics.setHasErrors(true);
                characteristics.setErrorMessage("Помилки: " + String.join("; ", validationErrors));
                return characteristics;
            }

            // Зберігаємо характеристики в wizard
            persistenceService.saveWizardData(wizardId, CHARACTERISTICS_KEY, characteristics, STAGE_NUMBER, STEP_NUMBER);

            // Оновлюємо тимчасовий предмет
            updateTempItemWithCharacteristics(wizardId, characteristics);

            // Заповнюємо доступні опції для відповіді
            populateAvailableOptionsFromConstants(characteristics);

            // Очищуємо помилки
            characteristics.setHasErrors(false);
            characteristics.setErrorMessage(null);

            logger.debug("Характеристики збережено для wizard: {}", wizardId);
            return characteristics;

        } catch (Exception e) {
            logger.error("Помилка збереження характеристик для wizard {}: {}", wizardId, e.getMessage(), e);
            characteristics.setHasErrors(true);
            characteristics.setErrorMessage("Помилка збереження: " + e.getMessage());
            return characteristics;
        }
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     * Використовує валідатор для перевірки збережених даних.
     *
     * @param wizardId ID візарда
     * @return true, якщо можна перейти до наступного кроку
     */
    public boolean canProceedToNextStep(String wizardId) {
        logger.debug("Перевірка можливості переходу до наступного кроку для wizard: {}", wizardId);

        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            ItemCharacteristicsDTO dto = loadSavedCharacteristics(wizardData);

            if (dto == null) {
                logger.warn("Немає збережених характеристик для wizard: {}", wizardId);
                return false;
            }

            boolean isValid = validator.isValid(dto);
            logger.debug("Валідація для wizard {}: {}", wizardId, isValid ? "ПРОЙШЛА" : "НЕ ПРОЙШЛА");
            return isValid;

        } catch (Exception e) {
            logger.error("Помилка перевірки валідації для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Скидає всі збережені характеристики предмета.
     * Очищує дані як в wizard, так і в тимчасовому предметі.
     *
     * @param wizardId ID візарда
     */
    public void resetCharacteristics(String wizardId) {
        logger.debug("Скидання характеристик для wizard: {}", wizardId);

        try {
            // Завантажуємо поточні дані
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);

            // Очищуємо збережені характеристики
            wizardData.remove(CHARACTERISTICS_KEY);

            // Очищуємо характеристики в тимчасовому предметі
            TempOrderItemDTO tempItem = loadTempItemFromData(wizardData);
            if (tempItem != null) {
                clearCharacteristicsFromTempItem(tempItem);
                persistenceService.saveWizardData(wizardId, TEMP_ITEM_KEY, tempItem, STAGE_NUMBER, 1);
            }

            logger.debug("Характеристики скинуто для wizard: {}", wizardId);

        } catch (Exception e) {
            logger.error("Помилка скидання характеристик для wizard {}: {}", wizardId, e.getMessage(), e);
        }
    }

    /**
     * Завантажує збережені характеристики з wizard даних.
     */
    private ItemCharacteristicsDTO loadSavedCharacteristics(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(CHARACTERISTICS_KEY);
            if (data == null) {
                return null;
            }

            if (data instanceof ItemCharacteristicsDTO) {
                return (ItemCharacteristicsDTO) data;
            } else {
                return objectMapper.convertValue(data, ItemCharacteristicsDTO.class);
            }
        } catch (Exception e) {
            logger.error("Помилка завантаження збережених характеристик: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Створює характеристики з тимчасового предмета.
     */
    private ItemCharacteristicsDTO createFromTempItem(Map<String, Object> wizardData) {
        TempOrderItemDTO tempItem = loadTempItemFromData(wizardData);
        if (tempItem == null) {
            return null;
        }

        return mapper.fromTempOrderItem(tempItem);
    }

    /**
     * Завантажує тимчасовий предмет з wizard даних.
     */
    private TempOrderItemDTO loadTempItemFromData(Map<String, Object> wizardData) {
        try {
            Object data = wizardData.get(TEMP_ITEM_KEY);
            if (data == null) {
                return null;
            }

            if (data instanceof TempOrderItemDTO) {
                return (TempOrderItemDTO) data;
            } else {
                return objectMapper.convertValue(data, TempOrderItemDTO.class);
            }
        } catch (Exception e) {
            logger.error("Помилка завантаження тимчасового предмета: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Оновлює тимчасовий предмет з характеристиками.
     */
    private void updateTempItemWithCharacteristics(String wizardId, ItemCharacteristicsDTO characteristics) {
        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            TempOrderItemDTO tempItem = loadTempItemFromData(wizardData);

            if (tempItem == null) {
                logger.warn("Тимчасовий предмет не знайдено для wizard: {}", wizardId);
                tempItem = new TempOrderItemDTO();
            }

            // Оновлюємо поля тимчасового предмета
            mapper.updateTempOrderItem(tempItem, characteristics);

            // Зберігаємо оновлений предмет
            persistenceService.saveWizardData(wizardId, TEMP_ITEM_KEY, tempItem, STAGE_NUMBER, 1);

        } catch (Exception e) {
            logger.error("Помилка оновлення тимчасового предмета: {}", e.getMessage(), e);
        }
    }

    /**
     * Очищає характеристики з тимчасового предмета.
     */
    private void clearCharacteristicsFromTempItem(TempOrderItemDTO tempItem) {
        tempItem.setMaterial(null);
        tempItem.setColor(null);
        tempItem.setFillerType(null);
        tempItem.setFillerCompressed(null);
        tempItem.setWearDegree(null);
    }

    /**
     * Заповнює доступні опції з констант на основі категорії.
     */
    private void populateAvailableOptionsFromConstants(ItemCharacteristicsDTO dto) {
        logger.debug("Заповнення опцій з констант для категорії: {}", dto.getCategoryCode());

        // Матеріали фільтруються за категорією
        List<String> materials = ItemCharacteristicsConstants.Materials
                .getMaterialsByCategory(dto.getCategoryCode());
        dto.setAvailableMaterials(materials);

        // Всі кольори з констант
        dto.setAvailableColors(ItemCharacteristicsConstants.Colors.getAllColors());

        // Всі типи наповнювачів з констант
        dto.setAvailableFillerTypes(ItemCharacteristicsConstants.FillerTypes.getAllFillerTypes());

        // Всі ступені зносу з констант
        dto.setAvailableWearDegrees(ItemCharacteristicsConstants.WearDegrees.getAllWearDegrees());

        logger.debug("Заповнено опцій: матеріали={}, кольори={}, наповнювачі={}, ступені зносу={}",
                materials.size(), dto.getAvailableColors().size(),
                dto.getAvailableFillerTypes().size(), dto.getAvailableWearDegrees().size());
    }

    /**
     * Налаштовує UI відповідно до категорії предмета.
     */
    private void configureUIByCategory(ItemCharacteristicsDTO dto) {
        logger.debug("Налаштування UI для категорії: {}", dto.getCategoryCode());

        // Визначаємо чи показувати секцію наповнювача
        boolean showFillerSection = shouldShowFillerForCategory(dto.getCategoryCode());
        dto.setShowFillerSection(showFillerSection);

        logger.debug("UI налаштовано: showFillerSection={}", showFillerSection);
    }

        /**
     * Визначає чи потрібно показувати секцію наповнювача для категорії.
     * Використовує константи замість хардкоду.
     */
    private boolean shouldShowFillerForCategory(String categoryCode) {
        return ItemCharacteristicsConstants.FillerCategories.shouldShowFillerSection(categoryCode);
    }

    /**
     * Створює порожні характеристики з усіма доступними опціями.
     */
    private ItemCharacteristicsDTO createEmptyCharacteristics() {
        ItemCharacteristicsDTO dto = ItemCharacteristicsDTO.builder()
                .showFillerSection(false)
                .hasErrors(false)
                .build();

        // Заповнюємо всі доступні опції з констант
        dto.setAvailableMaterials(ItemCharacteristicsConstants.Materials.getAllMaterials());
        dto.setAvailableColors(ItemCharacteristicsConstants.Colors.getAllColors());
        dto.setAvailableFillerTypes(ItemCharacteristicsConstants.FillerTypes.getAllFillerTypes());
        dto.setAvailableWearDegrees(ItemCharacteristicsConstants.WearDegrees.getAllWearDegrees());

        return dto;
    }

    /**
     * Створює характеристики з помилкою.
     */
    private ItemCharacteristicsDTO createErrorCharacteristics(String errorMessage) {
        return ItemCharacteristicsDTO.builder()
                .hasErrors(true)
                .errorMessage(errorMessage)
                .showFillerSection(false)
                .build();
    }
}

