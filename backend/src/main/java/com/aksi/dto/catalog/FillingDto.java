package com.aksi.dto.catalog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для передачі даних про наповнювач на фронтенд.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FillingDto {
    private String id;
    private String name;
    private Integer sortOrder;
}
