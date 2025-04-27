package com.aksi.domain.order.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.constants.ItemCharacteristicsConstants;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з характеристиками предметів замовлення.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ItemCharacteristicsServiceImpl implements ItemCharacteristicsService {
    
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
        log.debug("Отримання всіх типів плям");
        return ItemCharacteristicsConstants.StainTypes.getAllStainTypes();
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getAllDefectsAndRisks() {
        log.debug("Отримання всіх типів дефектів та ризиків");
        return ItemCharacteristicsConstants.DefectsAndRisks.getAllDefectsAndRisks();
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getDefects() {
        log.debug("Отримання тільки типів дефектів");
        return ItemCharacteristicsConstants.DefectsAndRisks.getDefects();
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public List<String> getRisks() {
        log.debug("Отримання тільки типів ризиків");
        return ItemCharacteristicsConstants.DefectsAndRisks.getRisks();
    }
}
