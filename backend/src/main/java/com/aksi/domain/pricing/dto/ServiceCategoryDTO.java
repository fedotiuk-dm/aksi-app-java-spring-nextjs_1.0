package com.aksi.domain.pricing.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCategoryDTO {
    private UUID id;
    private String code;
    private String name;
    private String description;
    private Integer sortOrder;
    private boolean active; // булеве поле без префіксу 'is' для коректної роботи з JavaBeans
    private List<PriceListItemDTO> items;
}

