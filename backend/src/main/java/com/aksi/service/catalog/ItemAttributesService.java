package com.aksi.service.catalog;

import com.aksi.dto.catalog.ColorDto;
import com.aksi.dto.catalog.MeasurementUnitDto;
import com.aksi.dto.catalog.WearDegreeDto;

import java.util.List;

/**
 * Service interface for managing item attributes like colors, wear degrees and measurement units.
 */
public interface ItemAttributesService {

    /**
     * Get list of all available colors
     *
     * @return List of color DTOs
     */
    List<ColorDto> getAllColors();

    /**
     * Get list of all available wear degrees
     *
     * @return List of wear degree DTOs
     */
    List<WearDegreeDto> getAllWearDegrees();
    
    /**
     * Get list of all available measurement units
     *
     * @return List of measurement unit DTOs
     */
    List<MeasurementUnitDto> getAllMeasurementUnits();
}
