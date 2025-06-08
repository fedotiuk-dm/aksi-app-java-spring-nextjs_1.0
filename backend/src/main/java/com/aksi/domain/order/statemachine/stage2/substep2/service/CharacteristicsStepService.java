package com.aksi.domain.order.statemachine.stage2.substep2.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.enums.ItemWizardStep;
import com.aksi.domain.order.statemachine.stage2.integration.PricingIntegrationService;
import com.aksi.domain.order.statemachine.stage2.service.ItemWizardManagementService;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.MaterialOptionDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.FillingType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.MaterialType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.WearLevel;
import com.aksi.domain.order.statemachine.stage2.substep2.mapper.CharacteristicsMapper;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.CharacteristicsValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для управління підетапом 2.2: Характеристики предмета
 *
 * Відповідає за:
 * - Отримання доступних матеріалів через інтеграцію з реальними даними
 * - Управління кольорами (стандартні + кастомні)
 * - Роботу з наповнювачами (залежно від категорії)
 * - Валідацію характеристик через CharacteristicsValidator
 * - Збереження/завантаження даних підетапу
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CharacteristicsStepService {

    private final PricingIntegrationService pricingIntegrationService;
    private final CharacteristicsValidator characteristicsValidator;
    private final CharacteristicsMapper characteristicsMapper;
    private final ItemWizardManagementService itemWizardManagementService;

    /**
     * Отримує доступні матеріали для конкретної категорії послуги
     *
     * @param categoryCode код категорії послуги
     * @return список доступних матеріалів
     */
    public List<MaterialOptionDTO> getAvailableMaterials(String categoryCode) {
        log.debug("Отримання доступних матеріалів для категорії: {}", categoryCode);

        try {
            // Отримуємо рекомендовані матеріали для категорії
            List<MaterialType> recommendedMaterials = characteristicsValidator.getRecommendedMaterials(categoryCode);

            return java.util.Arrays.stream(MaterialType.values())
                    .map(MaterialOptionDTO::fromMaterialType)
                    .peek(option -> {
                        // Встановлюємо доступність та рекомендації
                        boolean isCompatible = characteristicsValidator.isMaterialCompatibleWithCategory(
                                option.getMaterialType(), categoryCode);
                        boolean isRecommended = recommendedMaterials.contains(option.getMaterialType());

                        option.setIsAvailable(isCompatible);
                        option.setIsRecommended(isRecommended);

                        // Додаємо рекомендовані кольори для матеріала
                        option.setRecommendedColors(getRecommendedColorsForMaterial(option.getMaterialType()));

                        // Додаємо попередження якщо потрібно
                        if (!isCompatible) {
                            option.getWarnings().add("Матеріал може бути несумісним з обраною категорією послуги");
                        }
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Помилка при отриманні доступних матеріалів", e);
            // Повертаємо базовий список без додаткової інформації
            return java.util.Arrays.stream(MaterialType.values())
                    .map(MaterialOptionDTO::fromMaterialType)
                    .collect(Collectors.toList());
        }
    }

    /**
     * Отримує список стандартних кольорів
     *
     * @return список стандартних кольорів
     */
    public List<String> getStandardColors() {
        log.debug("Отримання списку стандартних кольорів");
        return characteristicsValidator.getStandardColors();
    }

    /**
     * Отримує рекомендовані кольори для конкретного матеріала
     *
     * @param materialType тип матеріала
     * @return список рекомендованих кольорів
     */
    public List<String> getRecommendedColorsForMaterial(MaterialType materialType) {
        if (materialType == null) {
            return List.of();
        }

        // Логіка рекомендованих кольорів для різних матеріалів
        return switch (materialType) {
            case COTTON -> List.of("білий", "бежевий", "сірий", "синій");
            case WOOL -> List.of("сірий", "коричневий", "чорний", "бежевий");
            case SILK -> List.of("білий", "кремовий", "рожевий", "фіолетовий");
            case SYNTHETIC -> List.of("білий", "чорний", "синій", "червоний");
            case SMOOTH_LEATHER -> List.of("чорний", "коричневий", "білий", "бежевий");
            case NUBUCK -> List.of("коричневий", "сірий", "чорний");
            case SPLIT_LEATHER -> List.of("коричневий", "чорний", "сірий");
            case SUEDE -> List.of("коричневий", "сірий", "бежевий", "чорний");
        };
    }

    /**
     * Отримує доступні типи наповнювача для категорії
     *
     * @param categoryCode код категорії послуги
     * @return список доступних типів наповнювача
     */
    public List<FillingType> getAvailableFillings(String categoryCode) {
        log.debug("Отримання доступних наповнювачів для категорії: {}", categoryCode);

        if (categoryCode == null) {
            return List.of(FillingType.values());
        }

        // Логіка доступності наповнювачів для різних категорій
        return switch (categoryCode.toLowerCase()) {
            case "leather_cleaning", "leather_restoration" -> List.of(); // Шкіра зазвичай без наповнювача
            case "textile_cleaning" -> List.of(FillingType.values()); // Всі типи доступні
            case "laundry" -> List.of(FillingType.SYNTHETIC, FillingType.OTHER); // Обмежений список
            case "fur_cleaning" -> List.of(FillingType.DOWN, FillingType.OTHER); // Спеціальні типи
            default -> List.of(FillingType.values()); // За замовчуванням всі
        };
    }

    /**
     * Отримує доступні рівні зносу
     *
     * @return список всіх доступних рівнів зносу
     */
    public List<WearLevel> getAvailableWearLevels() {
        log.debug("Отримання доступних рівнів зносу");
        return List.of(WearLevel.values());
    }

    /**
     * Валідує характеристики предмета
     *
     * @param characteristics дані для валідації
     * @return валідовані дані з результатами валідації
     */
    public CharacteristicsDTO validateCharacteristics(CharacteristicsDTO characteristics) {
        log.debug("Валідація характеристик: {}", characteristics);

        if (characteristics == null) {
            return CharacteristicsDTO.builder()
                    .isValid(false)
                    .validationErrors(List.of("Характеристики не можуть бути порожніми"))
                    .build();
        }

        // Валідація через CharacteristicsValidator
        var validationResult = characteristicsValidator.validate(characteristics);

        // Створюємо копію з результатами валідації
        return characteristics.toBuilder()
                .isValid(validationResult.isValid())
                .validationErrors(validationResult.getErrors())
                .build();
    }

    /**
     * Валідує сумісність матеріала з категорією
     *
     * @param material матеріал
     * @param categoryCode код категорії
     * @return true якщо сумісний
     */
    public boolean isMaterialCompatibleWithCategory(MaterialType material, String categoryCode) {
        return characteristicsValidator.isMaterialCompatibleWithCategory(material, categoryCode);
    }

    /**
     * Перевіряє чи є колір стандартним
     *
     * @param color колір для перевірки
     * @return true якщо стандартний
     */
    public boolean isStandardColor(String color) {
        return characteristicsValidator.isStandardColor(color);
    }

    /**
     * Отримує рекомендації по обробці на основі характеристик
     *
     * @param characteristics характеристики предмета
     * @return список рекомендацій
     */
    public List<String> getProcessingRecommendations(CharacteristicsDTO characteristics) {
        log.debug("Отримання рекомендацій по обробці для: {}", characteristics);

        if (characteristics == null) {
            return List.of();
        }

        return characteristics.getProcessingRecommendations();
    }

    /**
     * Отримує попередження на основі характеристик
     *
     * @param characteristics характеристики предмета
     * @return список попереджень
     */
    public List<String> getWarnings(CharacteristicsDTO characteristics) {
        log.debug("Отримання попереджень для: {}", characteristics);

        if (characteristics == null) {
            return List.of();
        }

        return characteristics.getWarnings();
    }

    /**
     * Зберігає характеристики для вказаної сесії візарда
     *
     * @param wizardId ID сесії візарда
     * @param characteristics дані для збереження
     * @return збережені дані
     */
    public CharacteristicsDTO saveCharacteristics(String wizardId, CharacteristicsDTO characteristics) {
        log.debug("Збереження характеристик для візарда: {}", wizardId);

        // Валідуємо перед збереженням
        CharacteristicsDTO validatedCharacteristics = validateCharacteristics(characteristics);

        try {
            // Зберігаємо через ItemWizardManagementService
            itemWizardManagementService.saveStepData(wizardId, ItemWizardStep.CHARACTERISTICS, validatedCharacteristics);

            log.info("Характеристики збережено для візарда: {}, valid: {}",
                    wizardId, validatedCharacteristics.getIsValid());

            return validatedCharacteristics;

        } catch (Exception e) {
            log.error("Помилка збереження характеристик для візарда: {}", wizardId, e);
            return validatedCharacteristics.toBuilder()
                    .isValid(false)
                    .validationErrors(java.util.List.of("Помилка збереження: " + e.getMessage()))
                    .build();
        }
    }

    /**
     * Завантажує характеристики для вказаної сесії візарда
     *
     * @param wizardId ID сесії візарда
     * @return збережені дані або порожні дані якщо нічого не збережено
     */
    public CharacteristicsDTO loadCharacteristics(String wizardId) {
        log.debug("Завантаження характеристик для візарда: {}", wizardId);

        try {
            CharacteristicsDTO loadedCharacteristics = itemWizardManagementService.loadStepData(
                    wizardId, ItemWizardStep.CHARACTERISTICS, CharacteristicsDTO.class);

            if (loadedCharacteristics != null) {
                log.debug("Характеристики завантажено для візарда: {}", wizardId);
                return loadedCharacteristics;
            } else {
                log.debug("Характеристики не знайдені для візарда: {}, повертаємо порожні дані", wizardId);
                return CharacteristicsDTO.builder().build();
            }

        } catch (Exception e) {
            log.warn("Помилка завантаження характеристик для візарда: {}", wizardId, e);
            return CharacteristicsDTO.builder()
                    .isValid(false)
                    .validationErrors(java.util.List.of("Помилка завантаження: " + e.getMessage()))
                    .build();
        }
    }

    /**
     * Швидка перевірка готовності до наступного кроку
     *
     * @param characteristics дані для перевірки
     * @return true якщо можна переходити до наступного кроку
     */
    public boolean isReadyForNextStep(CharacteristicsDTO characteristics) {
        return characteristicsValidator.isReadyForNextStep(characteristics);
    }

    /**
     * Отримує статистику по характеристикам
     *
     * @param characteristics дані для аналізу
     * @return інформація про стан заповнення
     */
    public String getCompletionStatus(CharacteristicsDTO characteristics) {
        if (characteristics == null) {
            return "Не заповнено";
        }

        if (characteristics.isComplete() && characteristics.getIsValid()) {
            return "Готово";
        } else if (characteristics.isComplete()) {
            return "Заповнено з помилками";
        } else {
            return "Частково заповнено";
        }
    }

    /**
     * Отримує автоматичні рекомендації на основі категорії та матеріала
     *
     * @param categoryCode код категорії
     * @param material вибраний матеріал
     * @return автоматичні рекомендації
     */
    public CharacteristicsDTO getAutoRecommendations(String categoryCode, MaterialType material) {
        log.debug("Отримання автоматичних рекомендацій для категорії: {} та матеріала: {}", categoryCode, material);

        CharacteristicsDTO.CharacteristicsDTOBuilder builder = CharacteristicsDTO.builder();

        if (material != null) {
            builder.material(material);

            // Рекомендований колір на основі матеріала
            List<String> recommendedColors = getRecommendedColorsForMaterial(material);
            if (!recommendedColors.isEmpty()) {
                builder.color(recommendedColors.get(0))
                       .isStandardColor(true);
            }

            // Рекомендований наповнювач
            List<FillingType> availableFillings = getAvailableFillings(categoryCode);
            if (!availableFillings.isEmpty() && !material.isLeather()) {
                builder.filling(availableFillings.get(0));
            }

            // Рекомендований рівень зносу (за замовчуванням мінімальний)
            builder.wearLevel(WearLevel.LEVEL_10);
        }

        return builder.build();
    }
}
