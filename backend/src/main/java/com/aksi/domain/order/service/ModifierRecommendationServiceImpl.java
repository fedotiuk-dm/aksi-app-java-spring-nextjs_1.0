package com.aksi.domain.order.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.ModifierRecommendationDTO;
import com.aksi.domain.order.dto.ModifierRecommendationDTO.RecommendationPriority;
import com.aksi.domain.pricing.dto.DefectTypeDTO;
import com.aksi.domain.pricing.dto.StainTypeDTO;
import com.aksi.domain.pricing.entity.PriceModifierEntity;
import com.aksi.domain.pricing.enums.RiskLevel;
import com.aksi.domain.pricing.repository.PriceModifierRepository;
import com.aksi.domain.pricing.service.DefectTypeService;
import com.aksi.domain.pricing.service.StainTypeService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу рекомендацій модифікаторів.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ModifierRecommendationServiceImpl implements ModifierRecommendationService {
    
    private final PriceModifierRepository modifierRepository;
    private final StainTypeService stainTypeService;
    private final DefectTypeService defectTypeService;
    
    // Мапа відповідності типів плям до рекомендованих модифікаторів
    private final Map<String, List<ModifierInfo>> stainToModifierMap = new HashMap<>();
    
    // Мапа відповідності типів дефектів до рекомендованих модифікаторів
    private final Map<String, List<ModifierInfo>> defectToModifierMap = new HashMap<>();
    
    /**
     * Ініціалізує картини відповідності плям і дефектів до модифікаторів.
     * Замість статичних хардкод-даних використовуються дані з бази даних.
     */
    @PostConstruct
    public void init() {
        log.info("Ініціалізація мап рекомендацій модифікаторів на основі даних з БД");
        
        initializeStainModifierMap();
        initializeDefectModifierMap();
        
        log.info("Ініціалізація мап рекомендацій завершена: {} типів плям, {} типів дефектів", 
                stainToModifierMap.size(), defectToModifierMap.size());
    }
    
    /**
     * Ініціалізує карту відповідності плям до модифікаторів.
     */
    private void initializeStainModifierMap() {
        final List<StainTypeDTO> stainTypes = stainTypeService.getActiveStainTypes();
        
        for (final StainTypeDTO stain : stainTypes) {
            final String stainCode = stain.getCode();
            
            final List<ModifierInfo> modifierInfos = new ArrayList<>();
            
            // На основі ризику формуємо відповідні рекомендації модифікаторів
            switch (stain.getRiskLevel()) {
                case HIGH -> {
                    modifierInfos.add(new ModifierInfo("VERY_DIRTY", 
                            70.0, RecommendationPriority.HIGH));
                    modifierInfos.add(new ModifierInfo("MANUAL_CLEANING", 
                            null, RecommendationPriority.HIGH));
                }
                case MEDIUM -> {
                    modifierInfos.add(new ModifierInfo("VERY_DIRTY", 
                            50.0, RecommendationPriority.MEDIUM));
                    modifierInfos.add(new ModifierInfo("MANUAL_CLEANING", 
                            null, RecommendationPriority.MEDIUM));
                }
                case LOW -> 
                    modifierInfos.add(new ModifierInfo("VERY_DIRTY", 
                            30.0, RecommendationPriority.LOW));
                default -> { 
                    // За замовчуванням нічого не додаємо
                }
            }
            
            // Якщо для типу плями є модифікатори, додаємо їх до карти
            if (!modifierInfos.isEmpty()) {
                stainToModifierMap.put(stainCode, modifierInfos);
                log.debug("Додано {} рекомендацій модифікаторів для типу плями: {}", 
                        modifierInfos.size(), stain.getName());
            }
        }
    }
    
    /**
     * Ініціалізує карту відповідності дефектів до модифікаторів.
     */
    private void initializeDefectModifierMap() {
        final List<DefectTypeDTO> defectTypes = defectTypeService.getActiveDefectTypes();
        
        for (final DefectTypeDTO defect : defectTypes) {
            final String defectCode = defect.getCode();
            
            final List<ModifierInfo> modifierInfos = new ArrayList<>();
            
            // На основі ризику формуємо відповідні рекомендації модифікаторів
            switch (defect.getRiskLevel()) {
                case HIGH -> 
                    modifierInfos.add(new ModifierInfo("MANUAL_CLEANING", 
                            null, RecommendationPriority.HIGH));
                case MEDIUM -> 
                    modifierInfos.add(new ModifierInfo("MANUAL_CLEANING", 
                            null, RecommendationPriority.MEDIUM));
                case LOW -> {
                    // Для низького ризику достатньо стандартної обробки
                }
                default -> {
                    // За замовчуванням нічого не додаємо
                }
            }
            
            // Якщо для типу дефекту є модифікатори, додаємо їх до карти
            if (!modifierInfos.isEmpty()) {
                defectToModifierMap.put(defectCode, modifierInfos);
                log.debug("Додано {} рекомендацій модифікаторів для типу дефекту: {}", 
                        modifierInfos.size(), defect.getName());
            }
        }
    }
    
    @Override
    public List<ModifierRecommendationDTO> getRecommendedModifiersForStains(final Set<String> stains, final String categoryCode, final String materialType) {
        if (stains == null || stains.isEmpty()) {
            return List.of();
        }
        
        final List<ModifierRecommendationDTO> recommendations = new ArrayList<>();
        
        // Отримуємо всі активні типи плям
        final List<StainTypeDTO> stainTypes = stainTypeService.getActiveStainTypes();
        final Map<String, StainTypeDTO> stainTypeByName = new HashMap<>();
        
        // Створюємо мапу для пошуку типу плями за назвою
        for (final StainTypeDTO stainType : stainTypes) {
            stainTypeByName.put(stainType.getName(), stainType);
        }
        
        // Обробка кожного типу плями
        for (final String stainName : stains) {
            final StainTypeDTO stainType = stainTypeByName.get(stainName);
            
            if (stainType != null) {
                final String stainCode = stainType.getCode();
                final List<ModifierInfo> modifierInfos = stainToModifierMap.get(stainCode);
                
                if (modifierInfos != null) {
                    for (final ModifierInfo info : modifierInfos) {
                        // Пошук модифікатора в базі даних
                        modifierRepository.findByCode(info.code)
                            .ifPresent(entity -> {
                                // Перевірка відповідності категорії
                                if (isCategoryCompatible(entity, categoryCode)) {
                                    recommendations.add(createRecommendation(entity, info, 
                                        String.format("Рекомендовано через пляму: %s", stainName)));
                                }
                            });
                    }
                }
            }
        }
        
        // Об'єднуємо дублікати модифікаторів з різних причин, вибираючи найвищий пріоритет
        return mergeRecommendations(recommendations);
    }
    
    @Override
    public List<ModifierRecommendationDTO> getRecommendedModifiersForDefects(final Set<String> defects, final String categoryCode, final String materialType) {
        if (defects == null || defects.isEmpty()) {
            return List.of();
        }
        
        final List<ModifierRecommendationDTO> recommendations = new ArrayList<>();
        
        // Отримуємо всі активні типи дефектів
        final List<DefectTypeDTO> defectTypes = defectTypeService.getActiveDefectTypes();
        final Map<String, DefectTypeDTO> defectTypeByName = new HashMap<>();
        
        // Створюємо мапу для пошуку типу дефекту за назвою
        for (final DefectTypeDTO defectType : defectTypes) {
            defectTypeByName.put(defectType.getName(), defectType);
        }
        
        // Обробка кожного типу дефекту
        for (final String defectName : defects) {
            final DefectTypeDTO defectType = defectTypeByName.get(defectName);
            
            if (defectType != null) {
                final String defectCode = defectType.getCode();
                final List<ModifierInfo> modifierInfos = defectToModifierMap.get(defectCode);
                
                if (modifierInfos != null) {
                    for (final ModifierInfo info : modifierInfos) {
                        // Пошук модифікатора в базі даних
                        modifierRepository.findByCode(info.code)
                            .ifPresent(entity -> {
                                // Перевірка відповідності категорії
                                if (isCategoryCompatible(entity, categoryCode)) {
                                    recommendations.add(createRecommendation(entity, info, 
                                        String.format("Рекомендовано через дефект: %s", defectName)));
                                }
                            });
                    }
                }
            }
        }
        
        // Об'єднуємо дублікати модифікаторів з різних причин, вибираючи найвищий пріоритет
        return mergeRecommendations(recommendations);
    }
    
    @Override
    public List<String> getRiskWarnings(final Set<String> stains, final Set<String> defects, final String materialType, final String categoryCode) {
        final List<String> warnings = new ArrayList<>();
        
        // Отримуємо всі типи плям та дефектів
        final List<StainTypeDTO> stainTypes = stainTypeService.getActiveStainTypes();
        final List<DefectTypeDTO> defectTypes = defectTypeService.getActiveDefectTypes();
        
        // Створюємо мапи для пошуку типу плями/дефекту за назвою
        final Map<String, StainTypeDTO> stainTypeByName = new HashMap<>();
        final Map<String, DefectTypeDTO> defectTypeByName = new HashMap<>();
        
        for (final StainTypeDTO stainType : stainTypes) {
            stainTypeByName.put(stainType.getName(), stainType);
        }
        
        for (final DefectTypeDTO defectType : defectTypes) {
            defectTypeByName.put(defectType.getName(), defectType);
        }
        
        // Додаємо попередження для плям високого ризику
        if (stains != null) {
            for (final String stainName : stains) {
                final StainTypeDTO stainType = stainTypeByName.get(stainName);
                if (stainType != null && RiskLevel.HIGH.equals(stainType.getRiskLevel())) {
                    warnings.add(String.format("Увага! Плями типу \"%s\" можуть не видалитися повністю.", stainName));
                }
            }
        }
        
        // Додаємо попередження для дефектів високого ризику
        if (defects != null) {
            for (final String defectName : defects) {
                final DefectTypeDTO defectType = defectTypeByName.get(defectName);
                if (defectType != null && RiskLevel.HIGH.equals(defectType.getRiskLevel())) {
                    warnings.add(String.format("Увага! Через наявність дефекту \"%s\" можливі ускладнення під час чистки.", defectName));
                }
            }
        }
        
        return warnings;
    }
    
    /**
     * Перевіряє, чи модифікатор застосовний для вказаної категорії.
     */
    private boolean isCategoryCompatible(final PriceModifierEntity modifier, final String categoryCode) {
        if (modifier.getCategory() == PriceModifierEntity.ModifierCategory.GENERAL) {
            return true; // Загальні модифікатори доступні для всіх категорій
        }
        
        if (categoryCode == null) {
            return false;
        }
        
        // Для текстильних модифікаторів
        if (modifier.getCategory() == PriceModifierEntity.ModifierCategory.TEXTILE) {
            return categoryCode.toUpperCase().contains("CLOTHING") || 
                   categoryCode.toUpperCase().contains("LAUNDRY") || 
                   categoryCode.toUpperCase().contains("IRONING") || 
                   categoryCode.toUpperCase().contains("DYEING");
        }
        
        // Для шкіряних модифікаторів
        if (modifier.getCategory() == PriceModifierEntity.ModifierCategory.LEATHER) {
            return categoryCode.toUpperCase().contains("LEATHER") || 
                   categoryCode.toUpperCase().contains("PADDING") || 
                   categoryCode.toUpperCase().contains("FUR");
        }
        
        return false;
    }
    
    /**
     * Створює об'єкт рекомендації з сутності модифікатора та допоміжної інформації.
     */
    private ModifierRecommendationDTO createRecommendation(final PriceModifierEntity entity, final ModifierInfo info, final String reason) {
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
    
    /**
     * Клас для зберігання інформації про зв'язок плями/дефекту з модифікатором.
     */
    private static class ModifierInfo {
        final String code;                    // Код модифікатора
        final Double recommendedValue;        // Рекомендоване значення (наприклад, відсоток)
        final RecommendationPriority priority; // Пріоритет рекомендації
        
        ModifierInfo(final String code, final Double recommendedValue, final RecommendationPriority priority) {
            this.code = code;
            this.recommendedValue = recommendedValue;
            this.priority = priority;
        }
    }
} 