package com.aksi.domain.order.statemachine.stage2.substep2.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.constants.ItemCharacteristicsConstants;
import com.aksi.domain.order.service.ItemCharacteristicsService;

/**
 * Сервіс операцій для характеристик предмета - тонка обгортка над доменними сервісами
 */
@Service
public class ItemCharacteristicsOperationsService {

    private final ItemCharacteristicsService itemCharacteristicsService;

    public ItemCharacteristicsOperationsService(ItemCharacteristicsService itemCharacteristicsService) {
        this.itemCharacteristicsService = itemCharacteristicsService;
    }

    /**
     * Отримати всі доступні матеріали
     */
    public List<String> getAllMaterials() {
        return ItemCharacteristicsConstants.Materials.getAllMaterials();
    }

    /**
     * Отримати матеріали для певної категорії
     */
    public List<String> getMaterialsByCategory(String category) {
        return itemCharacteristicsService.getMaterialsByCategory(category);
    }

    /**
     * Отримати всі базові кольори
     */
    public List<String> getAllColors() {
        return ItemCharacteristicsConstants.Colors.getAllColors();
    }

    /**
     * Отримати всі типи наповнювачів
     */
    public List<String> getAllFillerTypes() {
        return ItemCharacteristicsConstants.FillerTypes.getAllFillerTypes();
    }

    /**
     * Отримати всі ступені зносу
     */
    public List<String> getAllWearDegrees() {
        return ItemCharacteristicsConstants.WearDegrees.getAllWearDegrees();
    }

    /**
     * Перевірити чи потрібно показувати секцію наповнювача для категорії
     */
    public boolean shouldShowFillerSection(String categoryCode) {
        return ItemCharacteristicsConstants.FillerCategories.shouldShowFillerSection(categoryCode);
    }

    /**
     * Отримати коефіцієнт зносу для розрахунку ціни
     */
    public double getWearFactor(String wearDegree) {
        return ItemCharacteristicsConstants.WearDegrees.getWearFactor(wearDegree);
    }

    /**
     * Перевірити валідність матеріалу
     */
    public boolean isValidMaterial(String material) {
        if (material == null || material.trim().isEmpty()) {
            return false;
        }
        return getAllMaterials().contains(material.trim());
    }

    /**
     * Перевірити валідність типу наповнювача
     */
    public boolean isValidFillerType(String fillerType) {
        if (fillerType == null || fillerType.trim().isEmpty()) {
            return false;
        }
        return getAllFillerTypes().contains(fillerType.trim());
    }

    /**
     * Перевірити валідність ступеню зносу
     */
    public boolean isValidWearDegree(String wearDegree) {
        if (wearDegree == null || wearDegree.trim().isEmpty()) {
            return false;
        }
        return getAllWearDegrees().contains(wearDegree.trim());
    }

    /**
     * Перевірити валідність кольору
     */
    public boolean isValidColor(String color) {
        return color != null && !color.trim().isEmpty() && color.trim().length() <= 50;
    }
}
