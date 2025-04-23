package com.aksi.domain.catalog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing measurement unit data for items.
 */
@Entity
@Table(name = "measurement_units")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeasurementUnit {
    
    @Id
    @Column(name = "id", nullable = false)
    private String id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "short_name", nullable = false)
    private String shortName;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "sort_order")
    private Integer sortOrder;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
