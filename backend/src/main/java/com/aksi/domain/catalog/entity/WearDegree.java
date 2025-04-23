package com.aksi.domain.catalog.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entity representing wear degree data for items.
 */
@Entity
@Table(name = "wear_degrees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WearDegree {
    
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "sort_order")
    private Integer sortOrder;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
