package com.aksi.dto.catalog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for colors used in items.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ColorDto {
    private String id;
    private String name;
    private String hex;
    private Integer sortOrder;
}
