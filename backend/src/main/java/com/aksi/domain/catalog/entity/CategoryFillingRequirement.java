package com.aksi.domain.catalog.entity;

import com.aksi.domain.pricing.entity.ServiceCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Сутність, яка визначає, які категорії потребують наповнювача.
 */
@Entity
@Table(name = "category_filling_requirements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryFillingRequirement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Категорія послуг, яка потребує наповнювача.
     */
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false, unique = true)
    private ServiceCategory category;

    /**
     * Чи потрібен наповнювач для цієї категорії.
     */
    @Column(name = "needs_filling", nullable = false)
    private Boolean needsFilling;
}
