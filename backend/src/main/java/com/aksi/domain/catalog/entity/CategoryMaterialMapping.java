package com.aksi.domain.catalog.entity;

import com.aksi.domain.pricing.entity.ServiceCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Сутність, яка визначає зв'язок між категоріями послуг та матеріалами.
 * Використовується для визначення, які матеріали доступні для кожної категорії.
 */
@Entity
@Table(name = "category_material_mappings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryMaterialMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Категорія послуг, до якої відноситься матеріал.
     */
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    /**
     * Назва матеріалу.
     */
    @Column(nullable = false)
    private String material;

    /**
     * Порядок сортування для відображення.
     */
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
