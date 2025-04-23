package com.aksi.dto.catalog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for measurement units used in items.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementUnitDto {
    private String id;
    private String name;
    private String shortName;
    private String description;
    private Integer sortOrder;
}
