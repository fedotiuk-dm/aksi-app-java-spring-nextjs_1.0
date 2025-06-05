package com.aksi.domain.order.statemachine.stage2.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.service.OrderWizardPersistenceService;
import com.aksi.domain.order.statemachine.stage2.dto.ItemStainDefectDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.mapper.ItemStainDefectMapper;
import com.aksi.domain.order.statemachine.stage2.validator.ItemStainDefectValidator;
import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.service.DefectTypeService;
import com.aksi.domain.pricing.service.StainTypeService;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Сервіс для управління підетапом 2.3 "Забруднення, дефекти та ризики".
 *
 * Відповідає за завантаження, збереження та валідацію плям та дефектів предмета:
 * - Завантаження активних типів плям з БД через StainTypeService
 * - Завантаження активних типів дефектів з БД через DefectTypeService
 * - Збереження вибраних значень у wizard persistence
 * - Валідацію даних через ItemStainDefectValidator
 * - Інтеграцію з тимчасовим предметом (TempOrderItemDTO)
 *
 * Використовує тільки реальні дані з Entity та БД.
 */
@Service
public class ItemStainDefectStepService {

    private static final Logger logger = LoggerFactory.getLogger(ItemStainDefectStepService.class);

    // Ключі для wizard persistence
    private static final String TEMP_ITEM_KEY = "tempOrderItem";
    private static final String STAIN_DEFECT_KEY = "itemStainDefect";

    // Stage та step номери для persistence
    private static final int STAGE_NUMBER = 2;
    private static final int STEP_NUMBER = 3;

    private final OrderWizardPersistenceService persistenceService;
    private final ItemStainDefectValidator validator;
    private final ItemStainDefectMapper mapper;
    private final ObjectMapper objectMapper;

    // Сервіси для роботи з реальними даними з БД
    private final StainTypeService stainTypeService;
    private final DefectTypeService defectTypeService;

    public ItemStainDefectStepService(
            OrderWizardPersistenceService persistenceService,
            ItemStainDefectValidator validator,
            ItemStainDefectMapper mapper,
            ObjectMapper objectMapper,
            StainTypeService stainTypeService,
            DefectTypeService defectTypeService) {
        this.persistenceService = persistenceService;
        this.validator = validator;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
        this.stainTypeService = stainTypeService;
        this.defectTypeService = defectTypeService;
    }

    /**
     * Завантажує дані плям та дефектів для підетапу 2.3.
     * Спочатку перевіряє збережені дані, потім дані з тимчасового предмета.
     * Завжди завантажує актуальні активні типи з БД.
     *
     * @param wizardId ID візарда
     * @return DTO з плямами та дефектами
     */
    public ItemStainDefectDTO loadStainDefectData(String wizardId) {
        logger.debug("Завантаження плям та дефектів для wizard: {}", wizardId);

        try {
            // Завантажуємо всі дані wizard
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);

            // Спочатку перевіряємо збережені дані
            ItemStainDefectDTO dto = loadSavedStainDefectData(wizardData);

            if (dto == null) {
                // Якщо немає збережених, створюємо з тимчасового предмета
                dto = createFromTempItem(wizardData);
            }

            if (dto == null) {
                // Якщо і тимчасового предмета немає, створюємо порожні
                dto = createEmptyStainDefectData();
            }

            // Завжди завантажуємо актуальні доступні опції з БД
            populateAvailableOptionsFromDatabase(dto);

            // Налаштовуємо UI відповідно до вибраних значень
            configureUIBySelections(dto);

            // Перевіряємо критичні ризики
            checkAndSetCriticalRisks(dto);

            logger.debug("Плями та дефекти успішно завантажено для wizard: {}", wizardId);
            return dto;

        } catch (Exception e) {
            logger.error("Помилка завантаження плям та дефектів для wizard {}: {}", wizardId, e.getMessage(), e);
            return createErrorStainDefectData("Помилка завантаження плям та дефектів: " + e.getMessage());
        }
    }

    /**
     * Зберігає дані плям та дефектів.
     * Валідує дані, зберігає в wizard та оновлює тимчасовий предмет.
     *
     * @param wizardId ID візарда
     * @param stainDefectData Дані плям та дефектів для збереження
     * @return Збережені дані з можливими помилками валідації
     */
    public ItemStainDefectDTO saveStainDefectData(String wizardId, ItemStainDefectDTO stainDefectData) {
        logger.debug("Збереження плям та дефектів для wizard: {}", wizardId);

        try {
            // Завжди оновлюємо доступні опції перед валідацією
            populateAvailableOptionsFromDatabase(stainDefectData);

            // Валідуємо дані
            List<String> validationErrors = validator.validate(stainDefectData);
            if (!validationErrors.isEmpty()) {
                logger.warn("Валідація не пройшла для wizard {}: {}", wizardId, validationErrors);
                stainDefectData.setHasErrors(true);
                stainDefectData.setErrorMessage("Помилки: " + String.join("; ", validationErrors));
                return stainDefectData;
            }

            // Зберігаємо дані в wizard
            persistenceService.saveWizardData(wizardId, STAIN_DEFECT_KEY, stainDefectData, STAGE_NUMBER, STEP_NUMBER);

            // Оновлюємо тимчасовий предмет
            updateTempItemWithStainDefectData(wizardId, stainDefectData);

            // Налаштовуємо UI
            configureUIBySelections(stainDefectData);

            // Перевіряємо критичні ризики
            checkAndSetCriticalRisks(stainDefectData);

            // Очищуємо помилки
            stainDefectData.setHasErrors(false);
            stainDefectData.setErrorMessage(null);

            logger.debug("Плями та дефекти збережено для wizard: {}", wizardId);
            return stainDefectData;

        } catch (Exception e) {
            logger.error("Помилка збереження плям та дефектів для wizard {}: {}", wizardId, e.getMessage(), e);
            stainDefectData.setHasErrors(true);
            stainDefectData.setErrorMessage("Помилка збереження: " + e.getMessage());
            return stainDefectData;
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
            ItemStainDefectDTO dto = loadSavedStainDefectData(wizardData);

            // Підетап 2.3 необов'язковий, тому завжди можна переходити далі
            // але перевіряємо базову валідність якщо дані є
            if (dto != null) {
                // Оновлюємо доступні опції для валідації
                populateAvailableOptionsFromDatabase(dto);

                boolean isValid = validator.isBasicValidationPassed(dto);
                logger.debug("Валідація для wizard {}: {}", wizardId, isValid ? "ПРОЙШЛА" : "НЕ ПРОЙШЛА");
                return isValid;
            }

            return true; // Немає даних - можна переходити

        } catch (Exception e) {
            logger.error("Помилка перевірки валідації для wizard {}: {}", wizardId, e.getMessage(), e);
            return true; // У випадку помилки дозволяємо перехід
        }
    }

    /**
     * Скидає всі збережені дані плям та дефектів.
     * Очищає дані як в wizard, так і в тимчасовому предметі.
     *
     * @param wizardId ID візарда
     */
    public void resetStainDefectData(String wizardId) {
        logger.debug("Скидання плям та дефектів для wizard: {}", wizardId);

        try {
            // Завантажуємо поточні дані
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);

            // Очищуємо збережені дані
            wizardData.remove(STAIN_DEFECT_KEY);

            // Очищуємо дані в тимчасовому предметі
            TempOrderItemDTO tempItem = loadTempItemFromData(wizardData);
            if (tempItem != null) {
                clearStainDefectDataFromTempItem(tempItem);
                persistenceService.saveWizardData(wizardId, TEMP_ITEM_KEY, tempItem, STAGE_NUMBER, 1);
            }

            // Зберігаємо оновлені дані wizard (видаляємо ключ плям та дефектів)
            persistenceService.saveWizardData(wizardId, STAIN_DEFECT_KEY, null, STAGE_NUMBER, STEP_NUMBER);

            logger.debug("Плями та дефекти успішно скинуто для wizard: {}", wizardId);

        } catch (Exception e) {
            logger.error("Помилка скидання плям та дефектів для wizard {}: {}", wizardId, e.getMessage(), e);
            throw new RuntimeException("Не вдалося скинути дані плям та дефектів", e);
        }
    }

    /**
     * Перевіряє, чи є критичні ризики у вибраних дефектах.
     *
     * @param wizardId ID візарда
     * @return true, якщо є критичні ризики
     */
    public boolean hasCriticalRisks(String wizardId) {
        logger.debug("Перевірка критичних ризиків для wizard: {}", wizardId);

        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            ItemStainDefectDTO dto = loadSavedStainDefectData(wizardData);

            if (dto != null && dto.getSelectedDefectsAndRisks() != null) {
                return dto.checkCriticalRisks();
            }

            return false;

        } catch (Exception e) {
            logger.error("Помилка перевірки критичних ризиків для wizard {}: {}", wizardId, e.getMessage(), e);
            return false;
        }
    }

    // === Приватні методи ===

    /**
     * Завантажує збережені дані плям та дефектів з wizard data.
     */
    private ItemStainDefectDTO loadSavedStainDefectData(Map<String, Object> wizardData) {
        try {
            Object savedData = wizardData.get(STAIN_DEFECT_KEY);
            if (savedData == null) {
                return null;
            }

            if (savedData instanceof ItemStainDefectDTO) {
                return (ItemStainDefectDTO) savedData;
            } else {
                return objectMapper.convertValue(savedData, ItemStainDefectDTO.class);
            }

        } catch (Exception e) {
            logger.error("Помилка завантаження збережених даних плям та дефектів: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Створює DTO з даних тимчасового предмета.
     */
    private ItemStainDefectDTO createFromTempItem(Map<String, Object> wizardData) {
        try {
            TempOrderItemDTO tempItem = loadTempItemFromData(wizardData);
            if (tempItem != null) {
                return mapper.fromTempOrderItem(tempItem);
            }
            return null;

        } catch (Exception e) {
            logger.error("Помилка створення DTO з тимчасового предмета: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Завантажує тимчасовий предмет з wizard data.
     */
    private TempOrderItemDTO loadTempItemFromData(Map<String, Object> wizardData) {
        try {
            Object tempItemData = wizardData.get(TEMP_ITEM_KEY);
            if (tempItemData == null) {
                return null;
            }

            if (tempItemData instanceof TempOrderItemDTO) {
                return (TempOrderItemDTO) tempItemData;
            } else {
                return objectMapper.convertValue(tempItemData, TempOrderItemDTO.class);
            }

        } catch (Exception e) {
            logger.error("Помилка завантаження тимчасового предмета: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Оновлює тимчасовий предмет даними плям та дефектів.
     */
    private void updateTempItemWithStainDefectData(String wizardId, ItemStainDefectDTO stainDefectData) {
        try {
            Map<String, Object> wizardData = persistenceService.loadWizardData(wizardId);
            TempOrderItemDTO tempItem = loadTempItemFromData(wizardData);

            if (tempItem != null) {
                mapper.updateTempOrderItem(tempItem, stainDefectData);
                persistenceService.saveWizardData(wizardId, TEMP_ITEM_KEY, tempItem, STAGE_NUMBER, 1);
            }

        } catch (Exception e) {
            logger.error("Помилка оновлення тимчасового предмета: {}", e.getMessage(), e);
        }
    }

    /**
     * Очищає дані плям та дефектів з тимчасового предмета.
     */
    private void clearStainDefectDataFromTempItem(TempOrderItemDTO tempItem) {
        tempItem.setStains(null);
        tempItem.setOtherStains(null);
        tempItem.setDefectsAndRisks(null);
        tempItem.setDefectsNotes(null);
        tempItem.setNoGuaranteeReason(null);
    }

    /**
     * Завантажує доступні опції з БД через сервіси.
     */
    private void populateAvailableOptionsFromDatabase(ItemStainDefectDTO dto) {
        try {
            // Завантажуємо активні типи плям з БД
            List<StainTypeDTO> availableStains = stainTypeService.getActiveStainTypes();
            dto.setAvailableStains(availableStains);

            // Завантажуємо активні типи дефектів з БД
            List<DefectTypeDTO> availableDefects = defectTypeService.getActiveDefectTypes();
            dto.setAvailableDefectsAndRisks(availableDefects);

            logger.debug("Завантажено {} типів плям та {} типів дефектів з БД",
                        availableStains.size(), availableDefects.size());

        } catch (Exception e) {
            logger.error("Помилка завантаження доступних опцій з БД: {}", e.getMessage(), e);
            // У випадку помилки залишаємо порожні списки
            dto.setAvailableStains(List.of());
            dto.setAvailableDefectsAndRisks(List.of());
        }
    }

    /**
     * Налаштовує UI відповідно до вибраних значень.
     */
    private void configureUIBySelections(ItemStainDefectDTO dto) {
        // Показуємо поле для опису власної плями, якщо вибрано "OTHER"
        dto.setShowCustomStainField(dto.hasCustomStain());

        // Показуємо поле для причини "Без гарантій", якщо вибрано "NO_GUARANTEE"
        dto.setShowNoGuaranteeReasonField(dto.hasNoGuarantee());
    }

    /**
     * Перевіряє та встановлює прапорець критичних ризиків.
     */
    private void checkAndSetCriticalRisks(ItemStainDefectDTO dto) {
        boolean hasCriticalRisks = dto.checkCriticalRisks();
        dto.setHasCriticalRisks(hasCriticalRisks);

        if (hasCriticalRisks) {
            logger.info("Виявлено критичні ризики у підетапі 2.3");
        }
    }

    /**
     * Створює порожні дані плям та дефектів.
     */
    private ItemStainDefectDTO createEmptyStainDefectData() {
        return ItemStainDefectDTO.builder()
                .hasErrors(false)
                .build();
    }

    /**
     * Створює дані з помилкою.
     */
    private ItemStainDefectDTO createErrorStainDefectData(String errorMessage) {
        return ItemStainDefectDTO.builder()
                .hasErrors(true)
                .errorMessage(errorMessage)
                .build();
    }
}
