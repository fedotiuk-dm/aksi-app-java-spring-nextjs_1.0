package com.aksi.domain.order.service.recommendation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.ModifierRecommendationDTO;
import com.aksi.domain.order.dto.ModifierRecommendationDTO.RecommendationPriority;
import com.aksi.domain.pricing.dto.ItemIssueDTO;
import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.enums.RiskLevel;
import com.aksi.domain.pricing.repository.CatalogPriceModifierRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Базовий сервіс для обробки рекомендацій модифікаторів.
 * Містить спільні методи для обробки рекомендацій на основі плям, дефектів тощо.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationBaseService {

    private final CatalogPriceModifierRepository modifierRepository;

    /**
     * Інформація про модифікатор для рекомендацій.
     */
    public static class ModifierInfo {
        public final String code;                    // Код модифікатора
        public final Double recommendedValue;        // Рекомендоване значення (наприклад, відсоток)
        public final RecommendationPriority priority; // Пріоритет рекомендації

        public ModifierInfo(final String code, final Double recommendedValue, final RecommendationPriority priority) {
            this.code = code;
            this.recommendedValue = recommendedValue;
            this.priority = priority;
        }
    }

    /**
     * Функціональний інтерфейс для створення опису причини рекомендації.
     */
    @FunctionalInterface
    public interface ReasonProvider {
        String getReason(String itemName, PriceModifierDefinitionEntity entity, ModifierInfo info);
    }

    /**
     * Карта відповідності типів елементів (плям/дефектів) до модифікаторів.
     */
    private final Map<String, List<ModifierInfo>> stainModifierMap = initializeStainModifierMap();
    private final Map<String, List<ModifierInfo>> defectModifierMap = initializeDefectModifierMap();

    /**
     * Ініціалізує карту відповідності плям до модифікаторів.
     */
    private Map<String, List<ModifierInfo>> initializeStainModifierMap() {
        final Map<String, List<ModifierInfo>> map = new HashMap<>();
        
        // Базові модифікатори для плям різного рівня ризику
        map.put("HIGH", List.of(
            new ModifierInfo("VERY_DIRTY", 70.0, RecommendationPriority.HIGH),
            new ModifierInfo("MANUAL_CLEANING", null, RecommendationPriority.HIGH)
        ));
        
        map.put("MEDIUM", List.of(
            new ModifierInfo("VERY_DIRTY", 50.0, RecommendationPriority.MEDIUM),
            new ModifierInfo("MANUAL_CLEANING", null, RecommendationPriority.MEDIUM)
        ));
        
        map.put("LOW", List.of(
            new ModifierInfo("VERY_DIRTY", 30.0, RecommendationPriority.LOW)
        ));
        
        return map;
    }

    /**
     * Ініціалізує карту відповідності дефектів до модифікаторів.
     */
    private Map<String, List<ModifierInfo>> initializeDefectModifierMap() {
        final Map<String, List<ModifierInfo>> map = new HashMap<>();
        
        // Базові модифікатори для дефектів різного рівня ризику
        map.put("HIGH", List.of(
            new ModifierInfo("MANUAL_CLEANING", null, RecommendationPriority.HIGH)
        ));
        
        map.put("MEDIUM", List.of(
            new ModifierInfo("MANUAL_CLEANING", null, RecommendationPriority.MEDIUM)
        ));
        
        return map;
    }

    /**
     * Отримує рекомендовані модифікатори для даного коду на основі рівня ризику.
     */
    public List<ModifierInfo> getModifiersForRiskLevel(RiskLevel riskLevel, boolean isStain) {
        final Map<String, List<ModifierInfo>> sourceMap = isStain ? stainModifierMap : defectModifierMap;
        if (riskLevel == null) {
            return List.of();
        }
        return sourceMap.getOrDefault(riskLevel.name(), List.of());
    }

    /**
     * Обробляє рекомендації модифікаторів для заданого набору елементів.
     *
     * @param <T> тип елемента (StainTypeDTO або DefectTypeDTO)
     * @param items набір назв елементів (плям або дефектів)
     * @param itemByName мапа для пошуку елемента за назвою
     * @param codeExtractor функція для отримання коду з елемента
     * @param categoryCode код категорії предмета
     * @param reasonProvider функціональний інтерфейс для створення опису причини рекомендації
     * @return список рекомендованих модифікаторів
     */
    public <T extends ItemIssueDTO> List<ModifierRecommendationDTO> processModifierRecommendations(
            final Set<String> items,
            final Map<String, T> itemByName,
            final Function<T, String> codeExtractor,
            final String categoryCode,
            final ReasonProvider reasonProvider) {

        final List<ModifierRecommendationDTO> recommendations = new ArrayList<>();

        if (items == null || items.isEmpty() || itemByName == null || itemByName.isEmpty()) {
            return recommendations;
        }

        // Обробка кожного елемента (плями або дефекту)
        for (final String itemName : items) {
            final T item = itemByName.get(itemName);

            if (item != null) {
                // Отримуємо необхідні дані про елемент
                final RiskLevel riskLevel = item.getRiskLevel();
                final boolean isStain = item instanceof StainTypeDTO;
                
                // Отримуємо список рекомендованих модифікаторів на основі рівня ризику
                final List<ModifierInfo> modifierInfos = getModifiersForRiskLevel(riskLevel, isStain);

                if (!modifierInfos.isEmpty()) {
                    for (final ModifierInfo info : modifierInfos) {
                        // Пошук модифікатора в базі даних
                        modifierRepository.findByCode(info.code)
                            .ifPresent(entity -> {
                                // Перевірка відповідності категорії
                                if (isCategoryCompatible(entity, categoryCode)) {
                                    recommendations.add(createRecommendation(entity, info,
                                        reasonProvider.getReason(itemName, entity, info)));
                                }
                            });
                    }
                }
            }
        }

        // Об'єднуємо дублікати модифікаторів з різних причин, вибираючи найвищий пріоритет
        return mergeRecommendations(recommendations);
    }

    /**
     * Обробляє попередження про ризики для набору елементів.
     *
     * @param <T> тип елемента (StainTypeDTO або DefectTypeDTO)
     * @param items набір назв елементів (плям або дефектів)
     * @param itemByName мапа для пошуку елемента за назвою
     * @param warningProvider функція для створення тексту попередження
     * @return список попереджень про ризики
     */
    public <T extends ItemIssueDTO> List<String> processRiskWarnings(
            final Set<String> items,
            final Map<String, T> itemByName,
            final BiFunction<T, String, String> warningProvider) {

        final List<String> warnings = new ArrayList<>();

        if (items == null || items.isEmpty() || itemByName == null || itemByName.isEmpty()) {
            return warnings;
        }

        // Додаємо попередження для елементів високого ризику
        for (final String itemName : items) {
            final T item = itemByName.get(itemName);
            if (item != null && RiskLevel.HIGH.equals(item.getRiskLevel())) {
                warnings.add(warningProvider.apply(item, itemName));
            }
        }

        return warnings;
    }

    /**
     * Перевіряє, чи сумісний модифікатор з категорією предмета.
     */
    private boolean isCategoryCompatible(final PriceModifierDefinitionEntity modifier, final String categoryCode) {
        if (modifier == null) {
            return false;
        }
        
        final ModifierCategory category = modifier.getCategory();
        
        if (category == ModifierCategory.GENERAL) {
            return true; // Загальні модифікатори доступні для всіх категорій
        }

        if (categoryCode == null || categoryCode.isEmpty()) {
            return false;
        }
        
        final String categoryUpper = categoryCode.toUpperCase();

        // Для текстильних модифікаторів
        if (category == ModifierCategory.TEXTILE) {
            return categoryUpper.contains("CLOTHING") ||
                   categoryUpper.contains("LAUNDRY") ||
                   categoryUpper.contains("IRONING") ||
                   categoryUpper.contains("DYEING");
        }

        // Для шкіряних модифікаторів
        if (category == ModifierCategory.LEATHER) {
            return categoryUpper.contains("LEATHER") ||
                   categoryUpper.contains("PADDING") ||
                   categoryUpper.contains("FUR");
        }

        return false;
    }

    /**
     * Створює об'єкт рекомендації з сутності модифікатора та допоміжної інформації.
     */
    private ModifierRecommendationDTO createRecommendation(final PriceModifierDefinitionEntity entity, final ModifierInfo info, final String reason) {
        return ModifierRecommendationDTO.builder()
                .modifierId(entity.getId().toString())
                .code(entity.getCode())
                .name(entity.getName())
                .reason(reason)
                .recommendedValue(info.recommendedValue)
                .priority(info.priority)
                .riskWarning(null) // Можна додати попередження, якщо потрібно
                .build();
    }

    /**
     * Об'єднує дублікати рекомендацій, залишаючи найвищий пріоритет.
     */
    private List<ModifierRecommendationDTO> mergeRecommendations(final List<ModifierRecommendationDTO> recommendations) {
        final Map<String, ModifierRecommendationDTO> mergedMap = new HashMap<>();

        for (final ModifierRecommendationDTO rec : recommendations) {
            if (!mergedMap.containsKey(rec.getCode()) ||
                mergedMap.get(rec.getCode()).getPriority().ordinal() > rec.getPriority().ordinal()) {
                mergedMap.put(rec.getCode(), rec);
            }
        }

        return new ArrayList<>(mergedMap.values());
    }
} 