package com.aksi.service.catalog.impl;

import com.aksi.domain.catalog.entity.Color;
import com.aksi.domain.catalog.entity.Filling;
import com.aksi.domain.catalog.entity.MeasurementUnit;
import com.aksi.domain.catalog.entity.WearDegree;
import com.aksi.domain.catalog.repository.CategoryFillingRequirementRepository;
import com.aksi.domain.catalog.repository.CategoryMaterialMappingRepository;
import com.aksi.domain.catalog.repository.ColorRepository;
import com.aksi.domain.catalog.repository.FillingRepository;
import com.aksi.domain.catalog.repository.MeasurementUnitRepository;
import com.aksi.domain.catalog.repository.WearDegreeRepository;
import com.aksi.dto.catalog.ColorDto;
import com.aksi.dto.catalog.FillingDto;
import com.aksi.dto.catalog.MaterialDto;
import com.aksi.dto.catalog.MeasurementUnitDto;
import com.aksi.dto.catalog.WearDegreeDto;
import com.aksi.service.catalog.ItemAttributesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of service for managing item attributes like colors and wear degrees.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ItemAttributesServiceImpl implements ItemAttributesService {

    private final ColorRepository colorRepository;
    private final WearDegreeRepository wearDegreeRepository;
    private final MeasurementUnitRepository measurementUnitRepository;
    private final CategoryMaterialMappingRepository categoryMaterialMappingRepository;
    private final CategoryFillingRequirementRepository categoryFillingRequirementRepository;
    private final FillingRepository fillingRepository;
    
    @Override
    public List<ColorDto> getAllColors() {
        return colorRepository.findByIsActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(this::mapToColorDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<WearDegreeDto> getAllWearDegrees() {
        return wearDegreeRepository.findByIsActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(this::mapToWearDegreeDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Конвертує об'єкт entity Color в DTO
     */
    private ColorDto mapToColorDto(Color color) {
        return ColorDto.builder()
                .id(color.getId())
                .name(color.getName())
                .hex(color.getHex())
                .sortOrder(color.getSortOrder())
                .build();
    }
    
    /**
     * Конвертує об'єкт entity WearDegree в DTO
     */
    private WearDegreeDto mapToWearDegreeDto(WearDegree wearDegree) {
        return WearDegreeDto.builder()
                .id(wearDegree.getId())
                .name(wearDegree.getName())
                .description(wearDegree.getDescription())
                .sortOrder(wearDegree.getSortOrder())
                .build();
    }
    
    @Override
    public List<MeasurementUnitDto> getAllMeasurementUnits() {
        return measurementUnitRepository.findByIsActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(this::mapToMeasurementUnitDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Конвертує об'єкт entity MeasurementUnit в DTO
     */
    private MeasurementUnitDto mapToMeasurementUnitDto(MeasurementUnit unit) {
        return MeasurementUnitDto.builder()
                .id(unit.getId())
                .name(unit.getName())
                .shortName(unit.getShortName())
                .description(unit.getDescription())
                .sortOrder(unit.getSortOrder())
                .build();
    }

    @Override
    public List<MaterialDto> getMaterialsByCategory(UUID categoryId) {
        if (categoryId == null) {
            return Collections.emptyList();
        }

        try {
            log.info("Отримання матеріалів для категорії з ID: {}", categoryId);
            List<String> materials = categoryMaterialMappingRepository.findMaterialsByCategoryId(categoryId);
            
            // Конвертація в DTO
            return materials.stream()
                    .map(material -> MaterialDto.builder()
                            .id(material)
                            .name(material)
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Помилка при отриманні матеріалів для категорії з ID: {}", categoryId, e);
            return Collections.emptyList();
        }
    }

    @Override
    public List<MaterialDto> getMaterialsByCategoryCode(String categoryCode) {
        if (categoryCode == null || categoryCode.isEmpty()) {
            return Collections.emptyList();
        }

        try {
            log.info("Отримання матеріалів для категорії з кодом: {}", categoryCode);
            List<String> materials = categoryMaterialMappingRepository.findMaterialsByCategoryCode(categoryCode);
            
            // Конвертація в DTO
            return materials.stream()
                    .map(material -> MaterialDto.builder()
                            .id(material)
                            .name(material)
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Помилка при отриманні матеріалів для категорії з кодом: {}", categoryCode, e);
            return Collections.emptyList();
        }
    }

    @Override
    public boolean doesCategoryNeedFilling(UUID categoryId) {
        if (categoryId == null) {
            return false;
        }

        try {
            log.info("Перевірка необхідності наповнювача для категорії з ID: {}", categoryId);
            return categoryFillingRequirementRepository.findByCategoryId(categoryId)
                    .map(requirement -> requirement.getNeedsFilling())
                    .orElse(false);
        } catch (Exception e) {
            log.error("Помилка при перевірці необхідності наповнювача для категорії з ID: {}", categoryId, e);
            return false;
        }
    }

    @Override
    public boolean doesCategoryNeedFillingByCode(String categoryCode) {
        if (categoryCode == null || categoryCode.isEmpty()) {
            return false;
        }

        try {
            log.info("Перевірка необхідності наповнювача для категорії з кодом: {}", categoryCode);
            return categoryFillingRequirementRepository.findByCategoryCode(categoryCode)
                    .map(requirement -> requirement.getNeedsFilling())
                    .orElse(false);
        } catch (Exception e) {
            log.error("Помилка при перевірці необхідності наповнювача для категорії з кодом: {}", categoryCode, e);
            return false;
        }
    }

    @Override
    public List<FillingDto> getAllFillings() {
        try {
            log.info("Отримання всіх наповнювачів");
            return fillingRepository.findAllByOrderBySortOrderAsc()
                    .stream()
                    .map(this::mapToFillingDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Помилка при отриманні наповнювачів", e);
            return Collections.emptyList();
        }
    }

    /**
     * Конвертує об'єкт entity Filling в DTO
     */
    private FillingDto mapToFillingDto(Filling filling) {
        return FillingDto.builder()
                .id(filling.getCode())
                .name(filling.getName())
                .sortOrder(filling.getSortOrder())
                .build();
    }
}
