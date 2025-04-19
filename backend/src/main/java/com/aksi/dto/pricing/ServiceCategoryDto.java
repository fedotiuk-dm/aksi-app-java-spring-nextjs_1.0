package com.aksi.dto.pricing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCategoryDto {
    private UUID id;
    private String code;
    private String name;
    private String description;
    private Integer sortOrder;
    private boolean active;
    private List<PriceListItemDto> items;
}
