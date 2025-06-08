package com.aksi.domain.order.statemachine.stage2.substep2.adapter;

import java.util.List;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.MaterialOptionDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.FillingType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.MaterialType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.WearLevel;
import com.aksi.domain.order.statemachine.stage2.substep2.service.CharacteristicsStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine адаптер для підетапу 2.2: Характеристики предмета
 *
 * Надає API для фронтенду для роботи з характеристиками предмета через State Machine.
 * Забезпечує інтеграцію між Spring State Machine контекстом та CharacteristicsStepService.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CharacteristicsStateMachineAdapter {

    private final CharacteristicsStepService characteristicsStepService;

    /**
     * Отримати доступні матеріали для категорії
     */
    public List<MaterialOptionDTO> getAvailableMaterials(StateContext<OrderState, OrderEvent> context, String categoryCode) {
        log.debug("Отримання доступних матеріалів для категорії {} через State Machine адаптер", categoryCode);

        List<MaterialOptionDTO> materials = characteristicsStepService.getAvailableMaterials(categoryCode);

        log.info("Отримано {} доступних матеріалів для категорії {}", materials.size(), categoryCode);
        return materials;
    }

    /**
     * Отримати список стандартних кольорів
     */
    public List<String> getStandardColors(StateContext<OrderState, OrderEvent> context) {
        log.debug("Отримання стандартних кольорів через State Machine адаптер");

        List<String> colors = characteristicsStepService.getStandardColors();

        log.info("Отримано {} стандартних кольорів", colors.size());
        return colors;
    }

    /**
     * Отримати рекомендовані кольори для матеріала
     */
    public List<String> getRecommendedColorsForMaterial(StateContext<OrderState, OrderEvent> context, MaterialType materialType) {
        log.debug("Отримання рекомендованих кольорів для матеріала {} через State Machine адаптер", materialType);

        List<String> colors = characteristicsStepService.getRecommendedColorsForMaterial(materialType);

        log.info("Отримано {} рекомендованих кольорів для матеріала {}", colors.size(), materialType);
        return colors;
    }

    /**
     * Отримати доступні типи наповнювача
     */
    public List<FillingType> getAvailableFillings(StateContext<OrderState, OrderEvent> context, String categoryCode) {
        log.debug("Отримання доступних наповнювачів для категорії {} через State Machine адаптер", categoryCode);

        List<FillingType> fillings = characteristicsStepService.getAvailableFillings(categoryCode);

        log.info("Отримано {} доступних наповнювачів для категорії {}", fillings.size(), categoryCode);
        return fillings;
    }

    /**
     * Отримати доступні рівні зносу
     */
    public List<WearLevel> getAvailableWearLevels(StateContext<OrderState, OrderEvent> context) {
        log.debug("Отримання доступних рівнів зносу через State Machine адаптер");

        List<WearLevel> wearLevels = characteristicsStepService.getAvailableWearLevels();

        log.info("Отримано {} доступних рівнів зносу", wearLevels.size());
        return wearLevels;
    }

    /**
     * Валідувати характеристики
     */
    public CharacteristicsDTO validateCharacteristics(StateContext<OrderState, OrderEvent> context, CharacteristicsDTO characteristics) {
        log.debug("Валідація характеристик через State Machine адаптер: {}", characteristics);

        CharacteristicsDTO validatedDTO = characteristicsStepService.validateCharacteristics(characteristics);

        log.info("Валідація характеристик завершена: valid={}, errors={}",
                validatedDTO.getIsValid(), validatedDTO.getValidationErrors().size());
        return validatedDTO;
    }

    /**
     * Перевірити сумісність матеріала з категорією
     */
    public boolean isMaterialCompatibleWithCategory(StateContext<OrderState, OrderEvent> context, MaterialType material, String categoryCode) {
        log.debug("Перевірка сумісності матеріала {} з категорією {} через State Machine адаптер", material, categoryCode);

        boolean compatible = characteristicsStepService.isMaterialCompatibleWithCategory(material, categoryCode);

        log.info("Сумісність матеріала {} з категорією {}: {}", material, categoryCode, compatible);
        return compatible;
    }

    /**
     * Перевірити чи є колір стандартним
     */
    public boolean isStandardColor(StateContext<OrderState, OrderEvent> context, String color) {
        log.debug("Перевірка чи є колір {} стандартним через State Machine адаптер", color);

        boolean isStandard = characteristicsStepService.isStandardColor(color);

        log.debug("Колір {} є стандартним: {}", color, isStandard);
        return isStandard;
    }

    /**
     * Отримати рекомендації по обробці
     */
    public List<String> getProcessingRecommendations(StateContext<OrderState, OrderEvent> context, CharacteristicsDTO characteristics) {
        log.debug("Отримання рекомендацій по обробці через State Machine адаптер");

        List<String> recommendations = characteristicsStepService.getProcessingRecommendations(characteristics);

        log.info("Отримано {} рекомендацій по обробці", recommendations.size());
        return recommendations;
    }

    /**
     * Отримати попередження
     */
    public List<String> getWarnings(StateContext<OrderState, OrderEvent> context, CharacteristicsDTO characteristics) {
        log.debug("Отримання попереджень через State Machine адаптер");

        List<String> warnings = characteristicsStepService.getWarnings(characteristics);

        log.info("Отримано {} попереджень", warnings.size());
        return warnings;
    }

    /**
     * Завантажити збережені характеристики
     */
    public CharacteristicsDTO loadCharacteristics(StateContext<OrderState, OrderEvent> context, String wizardId) {
        log.debug("Завантаження характеристик для wizardId {} через State Machine адаптер", wizardId);

        CharacteristicsDTO characteristics = characteristicsStepService.loadCharacteristics(wizardId);

        if (characteristics != null) {
            log.info("Характеристики завантажено для wizardId {}: material={}, color={}",
                    wizardId, characteristics.getMaterial(), characteristics.getColor());
        } else {
            log.info("Характеристики не знайдено для wizardId {}", wizardId);
        }

        return characteristics;
    }

    /**
     * Перевірити готовність до наступного кроку
     */
    public boolean isReadyForNextStep(StateContext<OrderState, OrderEvent> context, CharacteristicsDTO characteristics) {
        log.debug("Перевірка готовності до наступного кроку через State Machine адаптер");

        boolean isReady = characteristicsStepService.isReadyForNextStep(characteristics);

        log.info("Готовність до наступного кроку: {}", isReady);
        return isReady;
    }

    /**
     * Отримати статус завершеності
     */
    public String getCompletionStatus(StateContext<OrderState, OrderEvent> context, CharacteristicsDTO characteristics) {
        log.debug("Отримання статусу завершеності через State Machine адаптер");

        String status = characteristicsStepService.getCompletionStatus(characteristics);

        log.debug("Статус завершеності: {}", status);
        return status;
    }

    /**
     * Отримати автоматичні рекомендації
     */
    public CharacteristicsDTO getAutoRecommendations(StateContext<OrderState, OrderEvent> context, String categoryCode, MaterialType material) {
        log.debug("Отримання автоматичних рекомендацій для категорії {} та матеріала {} через State Machine адаптер",
                categoryCode, material);

        CharacteristicsDTO recommendations = characteristicsStepService.getAutoRecommendations(categoryCode, material);

        log.info("Автоматичні рекомендації отримано: material={}, color={}, wearLevel={}",
                recommendations.getMaterial(), recommendations.getColor(), recommendations.getWearLevel());
        return recommendations;
    }
}
