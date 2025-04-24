package com.aksi.service.catalog;

import com.aksi.dto.catalog.ColorDto;
import com.aksi.dto.catalog.MaterialDto;
import com.aksi.dto.catalog.MeasurementUnitDto;
import com.aksi.dto.catalog.FillingDto;
import com.aksi.dto.catalog.WearDegreeDto;

import java.util.List;
import java.util.UUID;

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
    
    /**
     * Get materials available for the specified category
     *
     * @param categoryId ID of the category
     * @return List of material DTOs
     */
    List<MaterialDto> getMaterialsByCategory(UUID categoryId);
    
    /**
     * Get materials available for the specified category by code
     *
     * @param categoryCode Code of the category
     * @return List of material DTOs
     */
    List<MaterialDto> getMaterialsByCategoryCode(String categoryCode);
    
    /**
     * Check if the specified category requires filling
     *
     * @param categoryId ID of the category
     * @return true if filling is required, false otherwise
     */
    boolean doesCategoryNeedFilling(UUID categoryId);
    
    /**
     * Check if the specified category requires filling by code
     *
     * @param categoryCode Code of the category
     * @return true if filling is required, false otherwise
     */
    boolean doesCategoryNeedFillingByCode(String categoryCode);
    
    /**
     * Get all available fillings
     *
     * @return List of filling DTOs
     */
    List<FillingDto> getAllFillings();
}
