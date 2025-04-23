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
 * Entity representing color data for items.
 */
@Entity
@Table(name = "colors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Color {
    
    @Id
    @Column(name = "id", nullable = false)
    private String id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "hex", nullable = false)
    private String hex;
    
    @Column(name = "sort_order")
    private Integer sortOrder;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
}
