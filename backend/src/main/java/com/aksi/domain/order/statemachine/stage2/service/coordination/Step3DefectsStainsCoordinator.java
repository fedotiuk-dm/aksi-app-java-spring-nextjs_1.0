package com.aksi.domain.order.statemachine.stage2.service.coordination;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.service.DefectsStainsStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координатор для підетапу 2.3: Забруднення та дефекти предмета.
 *
 * Відповідальності:
 * - Координація роботи з DefectsStainsStepService
 * - Управління списками плям, дефектів та ризиків
 * - Валідація забруднень та дефектів
 * - Формування підсумків проблем предмета
 *
 * Принцип: один файл = одна логіка координації забруднень та дефектів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class Step3DefectsStainsCoordinator {

    private final DefectsStainsStepService defectsStainsStepService;

    /**
     * Отримує список доступних плям.
     */
    public List<StainSelectionDTO> getAvailableStains() {
        log.debug("Координація отримання доступних плям");
        return defectsStainsStepService.getAvailableStains();
    }

    /**
     * Отримує список доступних дефектів.
     */
    public List<DefectSelectionDTO> getAvailableDefects() {
        log.debug("Координація отримання доступних дефектів");
        return defectsStainsStepService.getAvailableDefects();
    }

    /**
     * Отримує список доступних ризиків.
     */
    public List<DefectSelectionDTO> getAvailableRisks() {
        log.debug("Координація отримання доступних ризиків");
        return defectsStainsStepService.getAvailableRisks();
    }

    /**
     * Валідує забруднення та дефекти.
     */
    public DefectsStainsDTO validateDefectsStains(DefectsStainsDTO defectsStains) {
        log.debug("Координація валідації забруднень та дефектів");
        return defectsStainsStepService.validateDefectsStains(defectsStains);
    }

    /**
     * Зберігає забруднення та дефекти в сесії wizard.
     */
    public DefectsStainsDTO saveDefectsStains(String wizardId, DefectsStainsDTO defectsStains) {
        log.debug("Координація збереження забруднень та дефектів для wizardId: {}", wizardId);
        return defectsStainsStepService.saveDefectsStains(wizardId, defectsStains);
    }

    /**
     * Завантажує забруднення та дефекти з сесії wizard.
     */
    public DefectsStainsDTO loadDefectsStains(String wizardId) {
        log.debug("Координація завантаження забруднень та дефектів для wizardId: {}", wizardId);
        return defectsStainsStepService.loadDefectsStains(wizardId);
    }

    /**
     * Перевіряє готовність для переходу до наступного кроку.
     */
    public boolean isReadyForNextStep(String wizardId) {
        log.debug("Координація перевірки готовності для наступного кроку wizardId: {}", wizardId);
        return defectsStainsStepService.isReadyForNextStep(wizardId);
    }

    /**
     * Отримує підсумок проблем предмета.
     */
    public Map<String, Object> getIssuesSummary(DefectsStainsDTO defectsStains) {
        log.debug("Координація отримання підсумку проблем");
        return defectsStainsStepService.getIssuesSummary(defectsStains);
    }

    /**
     * Перевіряє чи є критичні проблеми що потребують особливої уваги.
     */
    public boolean hasCriticalIssues(DefectsStainsDTO defectsStains) {
        log.debug("Координація перевірки критичних проблем");

        if (defectsStains == null) {
            return false;
        }

        Map<String, Object> summary = getIssuesSummary(defectsStains);

        // Перевіряємо наявність критичних дефектів або великої кількості проблем
        Integer defectsCount = (Integer) summary.getOrDefault("defectsCount", 0);
        Integer stainsCount = (Integer) summary.getOrDefault("stainsCount", 0);
        Integer risksCount = (Integer) summary.getOrDefault("risksCount", 0);

        // Критичними вважаємо: більше 3 дефектів, більше 5 плям, або більше 2 ризиків
        return defectsCount > 3 || stainsCount > 5 || risksCount > 2;
    }

    /**
     * Отримує рекомендації щодо обробки на основі дефектів та плям.
     */
    public List<String> getProcessingRecommendations(DefectsStainsDTO defectsStains) {
        log.debug("Координація отримання рекомендацій щодо обробки");

        Map<String, Object> summary = getIssuesSummary(defectsStains);

        // На основі підсумку формуємо рекомендації
        // Тут можна додати більш складну логіку
        return List.of(
            "Рекомендації будуть сформовані на основі вибраних проблем",
            "Детальні рекомендації доступні в підсумку: " + summary.toString()
        );
    }
}
