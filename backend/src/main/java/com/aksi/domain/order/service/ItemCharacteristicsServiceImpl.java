package com.aksi.domain.order.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.constants.ItemCharacteristicsConstants;
import com.aksi.domain.pricing.enums.RiskLevel;
import com.aksi.domain.pricing.service.DefectTypeService;
import com.aksi.domain.pricing.service.StainTypeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з характеристиками предметів замовлення.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ItemCharacteristicsServiceImpl implements ItemCharacteristicsService {
    
    private final StainTypeService stainTypeService;
    private final DefectTypeService defectTypeService;
    
    // ---------- Характеристики предмета ----------
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getMaterialsByCategory(String category) {
        log.debug("Отримання доступних матеріалів для категорії: {}", category);
        return ItemCharacteristicsConstants.Materials.getMaterialsByCategory(category);
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getAllColors() {
        log.debug("Отримання всіх базових кольорів");
        return ItemCharacteristicsConstants.Colors.getAllColors();
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getAllFillerTypes() {
        log.debug("Отримання типів наповнювачів");
        return ItemCharacteristicsConstants.FillerTypes.getAllFillerTypes();
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getAllWearDegrees() {
        log.debug("Отримання ступенів зносу");
        return ItemCharacteristicsConstants.WearDegrees.getAllWearDegrees();
    }
    
    // ---------- Забруднення та дефекти ----------
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getAllStainTypes() {
        log.debug("Отримання всіх типів плям з бази даних");
        return stainTypeService.getAllActiveStainTypes().stream()
                .map(stainType -> stainType.getName())
                .collect(Collectors.toList());
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getAllDefectsAndRisks() {
        log.debug("Отримання всіх типів дефектів та ризиків з бази даних");
        return defectTypeService.getAllActiveDefectTypes().stream()
                .map(defectType -> defectType.getName())
                .collect(Collectors.toList());
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getDefects() {
        log.debug("Отримання тільки типів дефектів з бази даних");
        // Фільтруємо за типом ризику LOW і MEDIUM (вважаємо їх дефектами)
        return defectTypeService.getAllActiveDefectTypes().stream()
                .filter(defectType -> defectType.getRiskLevel() == RiskLevel.LOW || 
                                      defectType.getRiskLevel() == RiskLevel.MEDIUM)
                .map(defectType -> defectType.getName())
                .collect(Collectors.toList());
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getRisks() {
        log.debug("Отримання тільки типів ризиків з бази даних");
        // Фільтруємо за типом ризику HIGH (вважаємо їх ризиками)
        return defectTypeService.getAllActiveDefectTypes().stream()
                .filter(defectType -> defectType.getRiskLevel() == RiskLevel.HIGH)
                .map(defectType -> defectType.getName())
                .collect(Collectors.toList());
    }
}
