package com.aksi.dto.catalog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for wear degrees used in items.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WearDegreeDto {
    private Integer id;
    private String name;
    private String description;
    private Integer sortOrder;
}
