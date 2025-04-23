package com.aksi.service.catalog.impl;

import com.aksi.domain.catalog.entity.Color;
import com.aksi.domain.catalog.entity.MeasurementUnit;
import com.aksi.domain.catalog.entity.WearDegree;
import com.aksi.domain.catalog.repository.ColorRepository;
import com.aksi.domain.catalog.repository.MeasurementUnitRepository;
import com.aksi.domain.catalog.repository.WearDegreeRepository;
import com.aksi.dto.catalog.ColorDto;
import com.aksi.dto.catalog.MeasurementUnitDto;
import com.aksi.dto.catalog.WearDegreeDto;
import com.aksi.service.catalog.ItemAttributesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of service for managing item attributes like colors and wear degrees.
 */
@Service
@RequiredArgsConstructor
public class ItemAttributesServiceImpl implements ItemAttributesService {

    private final ColorRepository colorRepository;
    private final WearDegreeRepository wearDegreeRepository;
    private final MeasurementUnitRepository measurementUnitRepository;
    
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
}
