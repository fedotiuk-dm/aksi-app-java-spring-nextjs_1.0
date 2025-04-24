package com.aksi.domain.catalog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Сутність, яка представляє наповнювач для предметів.
 */
@Entity
@Table(name = "fillings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Filling {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Назва наповнювача.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Код наповнювача для системної ідентифікації.
     */
    @Column(nullable = false, unique = true)
    private String code;

    /**
     * Порядок сортування для відображення.
     */
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
