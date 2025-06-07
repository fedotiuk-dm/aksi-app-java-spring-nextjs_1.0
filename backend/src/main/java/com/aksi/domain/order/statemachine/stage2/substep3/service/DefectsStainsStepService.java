package com.aksi.domain.order.statemachine.stage2.substep3.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainSelectionDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.validator.DefectsStainsValidator;
import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.service.DefectTypeService;
import com.aksi.domain.pricing.service.StainTypeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для підетапу 2.3: Забруднення, дефекти та ризики
 *
 * Відповідає за:
 * - Надання доступних типів плям та дефектів (з БД)
 * - Валідацію вибраних комбінацій
 * - Генерацію рекомендацій та попереджень
 * - Збереження та завантаження даних
 * - Інтеграцію з pricing domain
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DefectsStainsStepService {

    private final StainTypeService stainTypeService;
    private final DefectTypeService defectTypeService;
    private final DefectsStainsValidator validator;

    /**
     * Отримати всі доступні типи плям з БД
     */
    public List<StainSelectionDTO> getAvailableStains() {
        log.debug("Отримання доступних типів плям");

        List<StainTypeDTO> stainTypes = stainTypeService.getActiveStainTypes();

        return stainTypes.stream()
                .map(this::enrichStainTypeWithRecommendations)
                .collect(Collectors.toList());
    }

    /**
     * Отримати всі доступні типи дефектів з БД
     */
    public List<DefectSelectionDTO> getAvailableDefects() {
        log.debug("Отримання доступних типів дефектів");

        List<DefectTypeDTO> defectTypes = defectTypeService.getActiveDefectTypes();

        return defectTypes.stream()
                .map(this::enrichDefectTypeWithRecommendations)
                .collect(Collectors.toList());
    }

    /**
     * Отримати доступні ризики (фіксований список)
     */
    public List<DefectSelectionDTO> getAvailableRisks() {
        log.debug("Отримання доступних типів ризиків");

        return List.of(
            DefectSelectionDTO.builder()
                .code("color_change_risk")
                .name("Ризики зміни кольору")
                .description("Можлива зміна кольору під час обробки")
                .category("Колір")
                .build(),

            DefectSelectionDTO.builder()
                .code("deformation_risk")
                .name("Ризики деформації")
                .description("Можлива деформація або зміна форми")
                .category("Форма")
                .build(),

            DefectSelectionDTO.builder()
                .code("texture_change_risk")
                .name("Ризики зміни фактури")
                .description("Можлива зміна фактури матеріалу")
                .category("Фактура")
                .build(),

            DefectSelectionDTO.builder()
                .code("no_warranty")
                .name("Без гарантій")
                .description("Обробка без надання гарантій якості")
                .category("Гарантії")
                .requiresClientApproval(true)
                .build()
        );
    }

    /**
     * Валідувати DefectsStainsDTO
     */
    public DefectsStainsDTO validateDefectsStains(DefectsStainsDTO defectsStains) {
        log.debug("Валідація дефектів та плям: {}", defectsStains);

        if (defectsStains == null) {
            return DefectsStainsDTO.builder()
                    .isValid(false)
                    .validationErrors(List.of("Дані не можуть бути порожніми"))
                    .build();
        }

        // Основна валідація
        DefectsStainsValidator.ValidationResult result = validator.validate(defectsStains);

        // Збагачуємо DTO результатами валідації
        DefectsStainsDTO enrichedDTO = defectsStains.toBuilder()
                .isValid(result.isValid())
                .validationErrors(result.getErrors())
                .recommendedModifiers(generateRecommendedModifiers(defectsStains))
                .riskWarnings(validator.getRiskWarnings(defectsStains))
                .processingRecommendations(validator.getRecommendations(defectsStains))
                .build();

        log.debug("Результат валідації: valid={}, errors={}", result.isValid(), result.getErrors());
        return enrichedDTO;
    }

    /**
     * Зберегти дані дефектів та плям у контексті віарда
     */
    public DefectsStainsDTO saveDefectsStains(String wizardId, DefectsStainsDTO defectsStains) {
        log.debug("Збереження дефектів та плям для wizardId: {}", wizardId);

        // Валідуємо перед збереженням
        DefectsStainsDTO validatedDTO = validateDefectsStains(defectsStains);

        // Тут має бути логіка збереження в кеш/БД/контекст
        // Поки що повертаємо валідовані дані

        log.info("Дефекти та плями збережено для wizardId: {}, valid: {}",
                wizardId, validatedDTO.getIsValid());

        return validatedDTO;
    }

    /**
     * Завантажити дані дефектів та плям з контексту візарда
     */
    public DefectsStainsDTO loadDefectsStains(String wizardId) {
        log.debug("Завантаження дефектів та плям для wizardId: {}", wizardId);

        // Тут має бути логіка завантаження з кеш/БД/контексту
        // Поки що повертаємо порожню структуру

        return DefectsStainsDTO.builder()
                .selectedStains(Set.of())
                .selectedDefects(Set.of())
                .selectedRisks(Set.of())
                .isValid(false)
                .build();
    }

    /**
     * Перевіряє чи готові дані для переходу до наступного кроку
     */
    public boolean isReadyForNextStep(String wizardId) {
        DefectsStainsDTO data = loadDefectsStains(wizardId);
        return validator.isReadyForNextStep(data);
    }

    /**
     * Отримати автоматичні рекомендації на основі обраних дефектів/плям
     */
    public List<String> getAutoRecommendations(DefectsStainsDTO defectsStains,
                                               String categoryCode,
                                               String materialType) {
        log.debug("Генерація автоматичних рекомендацій для category: {}, material: {}",
                categoryCode, materialType);

        List<String> recommendations = validator.getRecommendations(defectsStains);

        // Додаткові рекомендації на основі матеріалу та категорії
        if ("leather".equalsIgnoreCase(materialType)) {
            if (defectsStains.getSelectedStains().contains("water_damage")) {
                recommendations.add("Спеціальна обробка для відновлення шкіри після водного пошкодження");
            }
        }

        if ("silk".equalsIgnoreCase(materialType)) {
            if (!defectsStains.getSelectedStains().isEmpty()) {
                recommendations.add("Ручна обробка для делікатних тканин");
            }
        }

        return recommendations;
    }

    /**
     * Отримати інформацію про вибрані проблеми для відображення
     */
    public Map<String, Object> getIssuesSummary(DefectsStainsDTO defectsStains) {
        return Map.of(
            "totalCount", defectsStains.getTotalIssuesCount(),
            "summary", defectsStains.getIssuesSummary(),
            "hasCritical", defectsStains.hasCriticalIssues(),
            "requiresSpecial", defectsStains.requiresSpecialTreatment(),
            "noWarranty", Boolean.TRUE.equals(defectsStains.getNoWarranty())
        );
    }

    /**
     * Збагатити StainTypeDTO додатковою інформацією
     */
    private StainSelectionDTO enrichStainTypeWithRecommendations(StainTypeDTO stainType) {
        StainSelectionDTO dto = StainSelectionDTO.fromStainTypeDTO(stainType);

        // Додаємо рекомендації на основі типу плями
        switch (stainType.getCode()) {
            case "oil", "fat" -> {
                dto.setRemovalMethods(List.of("Обезжирення", "Спеціальні розчинники"));
                dto.setWarnings(List.of("Не використовувати воду до обезжирення"));
            }
            case "blood" -> {
                dto.setRemovalMethods(List.of("Холодна вода", "Протеїнові ферменти"));
                dto.setWarnings(List.of("Не використовувати гарячу воду"));
            }
            case "wine" -> {
                dto.setRemovalMethods(List.of("Негайне видалення", "Спеціальні розчинники"));
                dto.setWarnings(List.of("Може закріпитися від тепла"));
            }
            case "ink" -> {
                dto.setRemovalMethods(List.of("Спеціальні розчинники", "Ультразвук"));
                dto.setWarnings(List.of("Високий ризик розповсюдження"));
            }
        }

        return dto;
    }

    /**
     * Збагатити DefectTypeDTO додатковою інформацією
     */
    private DefectSelectionDTO enrichDefectTypeWithRecommendations(DefectTypeDTO defectType) {
        DefectSelectionDTO dto = DefectSelectionDTO.fromDefectTypeDTO(defectType);

        // Додаємо рекомендації на основі типу дефекту
        switch (defectType.getCode()) {
            case "torn", "holes" -> {
                dto.setCategory("Фізичні");
                dto.setIsRepairable(true);
                dto.setRepairMethods(List.of("Штопання", "Латання"));
                dto.setRequiresClientApproval(true);
            }
            case "missing_hardware" -> {
                dto.setCategory("Фурнітура");
                dto.setIsRepairable(true);
                dto.setRepairMethods(List.of("Заміна фурнітури"));
            }
            case "color_fading" -> {
                dto.setCategory("Колір");
                dto.setIsRepairable(false);
                dto.setWarnings(List.of("Неможливо відновити"));
                dto.setRequiresClientApproval(true);
            }
            case "wear", "abrasion" -> {
                dto.setCategory("Знос");
                dto.setIsRepairable(false);
                dto.setWarnings(List.of("Може погіршитися при обробці"));
            }
        }

        return dto;
    }

    /**
     * Генерує рекомендовані модифікатори цін
     */
    private List<String> generateRecommendedModifiers(DefectsStainsDTO defectsStains) {
        List<String> modifiers = List.of();

        // Базові модифікатори на основі плям
        if (defectsStains.hasStains()) {
            if (defectsStains.getSelectedStains().contains("oil") ||
                defectsStains.getSelectedStains().contains("fat")) {
                modifiers = List.of("heavily_soiled"); // Дуже забруднені речі
            }

            if (defectsStains.getSelectedStains().size() > 3) {
                modifiers = List.of("heavily_soiled", "manual_cleaning"); // Ручна чистка
            }
        }

        // Модифікатори на основі дефектів
        if (defectsStains.hasDefects()) {
            if (defectsStains.getSelectedDefects().contains("torn") ||
                defectsStains.getSelectedDefects().contains("holes")) {
                modifiers = List.of("manual_cleaning", "special_care"); // Спеціальна обробка
            }
        }

        // Модифікатори для "Без гарантій"
        if (Boolean.TRUE.equals(defectsStains.getNoWarranty())) {
            modifiers = List.of("no_warranty_discount"); // Знижка за відсутність гарантій
        }

        return modifiers;
    }
}
