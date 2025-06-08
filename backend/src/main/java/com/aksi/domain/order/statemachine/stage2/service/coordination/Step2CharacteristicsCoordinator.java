package com.aksi.domain.order.statemachine.stage2.service.coordination;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.MaterialOptionDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.FillingType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.MaterialType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.WearLevel;
import com.aksi.domain.order.statemachine.stage2.substep2.service.CharacteristicsStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координатор для підетапу 2.2: Характеристики предмета.
 *
 * Відповідальності:
 * - Координація роботи з CharacteristicsStepService
 * - Управління опціями матеріалів, кольорів, наповнювачів
 * - Валідація характеристик предмета
 * - Забезпечення переходів між кроками підетапу
 *
 * Принцип: один файл = одна логіка координації характеристик.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class Step2CharacteristicsCoordinator {

    private final CharacteristicsStepService characteristicsStepService;

    /**
     * Отримує доступні матеріали для категорії.
     */
    public List<MaterialOptionDTO> getAvailableMaterials(String categoryCode) {
        log.debug("Координація отримання матеріалів для категорії: {}", categoryCode);
        return characteristicsStepService.getAvailableMaterials(categoryCode);
    }

    /**
     * Отримує стандартні кольори.
     */
    public List<String> getStandardColors() {
        log.debug("Координація отримання стандартних кольорів");
        return characteristicsStepService.getStandardColors();
    }

    /**
     * Отримує рекомендовані кольори для матеріалу.
     */
    public List<String> getRecommendedColorsForMaterial(MaterialType materialType) {
        log.debug("Координація отримання кольорів для матеріалу: {}", materialType);
        return characteristicsStepService.getRecommendedColorsForMaterial(materialType);
    }

    /**
     * Отримує доступні наповнювачі для категорії.
     */
    public List<FillingType> getAvailableFillings(String categoryCode) {
        log.debug("Координація отримання наповнювачів для категорії: {}", categoryCode);
        return characteristicsStepService.getAvailableFillings(categoryCode);
    }

    /**
     * Отримує доступні ступені зносу.
     */
    public List<WearLevel> getAvailableWearLevels() {
        log.debug("Координація отримання ступенів зносу");
        return characteristicsStepService.getAvailableWearLevels();
    }

    /**
     * Валідує характеристики предмета.
     */
    public CharacteristicsDTO validateCharacteristics(CharacteristicsDTO characteristics) {
        log.debug("Координація валідації характеристик: {}", characteristics);
        return characteristicsStepService.validateCharacteristics(characteristics);
    }

    /**
     * Перевіряє сумісність матеріалу з категорією.
     */
    public boolean isMaterialCompatibleWithCategory(MaterialType material, String categoryCode) {
        log.debug("Координація перевірки сумісності матеріалу {} з категорією {}", material, categoryCode);
        return characteristicsStepService.isMaterialCompatibleWithCategory(material, categoryCode);
    }

    /**
     * Отримує рекомендації для обробки.
     */
    public List<String> getProcessingRecommendations(CharacteristicsDTO characteristics) {
        log.debug("Координація отримання рекомендацій для обробки");
        return characteristicsStepService.getProcessingRecommendations(characteristics);
    }

    /**
     * Отримує попередження щодо характеристик.
     */
    public List<String> getWarnings(CharacteristicsDTO characteristics) {
        log.debug("Координація отримання попереджень");
        return characteristicsStepService.getWarnings(characteristics);
    }

    /**
     * Зберігає характеристики в сесії wizard.
     */
    public CharacteristicsDTO saveCharacteristics(String wizardId, CharacteristicsDTO characteristics) {
        log.debug("Координація збереження характеристик для wizardId: {}", wizardId);
        return characteristicsStepService.saveCharacteristics(wizardId, characteristics);
    }

    /**
     * Завантажує характеристики з сесії wizard.
     */
    public CharacteristicsDTO loadCharacteristics(String wizardId) {
        log.debug("Координація завантаження характеристик для wizardId: {}", wizardId);
        return characteristicsStepService.loadCharacteristics(wizardId);
    }

    /**
     * Перевіряє готовність для переходу до наступного кроку.
     */
    public boolean isReadyForNextStep(CharacteristicsDTO characteristics) {
        log.debug("Координація перевірки готовності для наступного кроку");
        return characteristicsStepService.isReadyForNextStep(characteristics);
    }

    /**
     * Отримує статус завершення підетапу.
     */
    public String getCompletionStatus(CharacteristicsDTO characteristics) {
        log.debug("Координація отримання статусу завершення");
        return characteristicsStepService.getCompletionStatus(characteristics);
    }

    /**
     * Отримує автоматичні рекомендації на основі категорії та матеріалу.
     */
    public CharacteristicsDTO getAutoRecommendations(String categoryCode, MaterialType material) {
        log.debug("Координація отримання автоматичних рекомендацій для категорії {} та матеріалу {}",
                  categoryCode, material);
        return characteristicsStepService.getAutoRecommendations(categoryCode, material);
    }
}
