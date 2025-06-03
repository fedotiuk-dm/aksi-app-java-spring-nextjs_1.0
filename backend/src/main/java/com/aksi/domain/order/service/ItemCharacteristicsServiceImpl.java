package com.aksi.domain.order.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.constants.ItemCharacteristicsConstants;
import com.aksi.domain.pricing.entity.ItemColorEntity;
import com.aksi.domain.pricing.entity.ItemMaterialEntity;
import com.aksi.domain.pricing.enums.RiskLevel;
import com.aksi.domain.pricing.repository.ItemColorRepository;
import com.aksi.domain.pricing.repository.ItemMaterialRepository;
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

    // Нові залежності для роботи з БД
    private final ItemColorRepository itemColorRepository;
    private final ItemMaterialRepository itemMaterialRepository;

    // ---------- Характеристики предмета ----------

    /**
     * {@inheritDoc}.
     */
    @Override
    public List<String> getMaterialsByCategory(String category) {
        log.debug("Отримання доступних матеріалів для категорії: {}", category);

        // Читаємо з БД
        List<ItemMaterialEntity> materials = itemMaterialRepository.findByActiveTrueOrderBySortOrderAsc();
        List<String> materialNames = materials.stream()
                .map(ItemMaterialEntity::getNameUa)
                .collect(Collectors.toList());

        log.debug("Отримано {} матеріалів з БД: {}", materialNames.size(), materialNames);

        // Якщо в БД немає даних, використовуємо константи як fallback
        if (materialNames.isEmpty()) {
            log.warn("БД не містить матеріалів, використовуємо константи");
            return ItemCharacteristicsConstants.Materials.getMaterialsByCategory(category);
        }

        return materialNames;
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    public List<String> getAllColors() {
        log.debug("Отримання всіх базових кольорів");

        // Читаємо з БД
        List<ItemColorEntity> colors = itemColorRepository.findByActiveTrueOrderBySortOrderAsc();
        List<String> colorNames = colors.stream()
                .map(ItemColorEntity::getNameUa)
                .collect(Collectors.toList());

        log.debug("Отримано {} кольорів з БД: {}", colorNames.size(), colorNames);

        // Якщо в БД немає даних, використовуємо константи як fallback
        if (colorNames.isEmpty()) {
            log.warn("БД не містить кольорів, використовуємо константи");
            return ItemCharacteristicsConstants.Colors.getAllColors();
        }

        return colorNames;
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    public List<String> getAllFillerTypes() {
        log.debug("Отримання типів наповнювачів");
        // Поки що використовуємо константи для наповнювачів
        return ItemCharacteristicsConstants.FillerTypes.getAllFillerTypes();
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    public List<String> getAllWearDegrees() {
        log.debug("Отримання ступенів зносу");
        // Поки що використовуємо константи для ступенів зносу
        return ItemCharacteristicsConstants.WearDegrees.getAllWearDegrees();
    }

    // ---------- Забруднення та дефекти ----------

    /**
     * {@inheritDoc}.
     */
    @Override
    public List<String> getAllStainTypes() {
        log.debug("Отримання всіх типів плям з бази даних");
        return stainTypeService.getAllActiveStainTypes().stream()
                .map(stainType -> stainType.getName())
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}.
     */
    @Override
    public List<String> getAllDefectsAndRisks() {
        log.debug("Отримання всіх типів дефектів та ризиків з бази даних");
        return defectTypeService.getAllActiveDefectTypes().stream()
                .map(defectType -> defectType.getName())
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}.
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
     * {@inheritDoc}.
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
