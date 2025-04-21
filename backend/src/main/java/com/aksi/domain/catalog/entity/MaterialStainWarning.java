package com.aksi.domain.catalog.entity;

import com.aksi.domain.order.entity.StainType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Сутність для попереджень та ризиків, які виникають 
 * для певних комбінацій матеріалів і типів забруднень.
 */
@Entity
@Table(name = "material_stain_warnings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialStainWarning {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Матеріал, для якого виникає попередження.
     */
    @Column(nullable = false)
    private String material;

    /**
     * Тип забруднення. Якщо null - попередження стосується лише матеріалу,
     * незалежно від типу забруднення.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "stain_type")
    private StainType stainType;

    /**
     * Тип попередження (COLOR_CHANGE, DEFORMATION, NO_WARRANTY, MATERIAL_DAMAGE).
     */
    @Column(name = "warning_type", nullable = false)
    private String warningType;

    /**
     * Текст попередження, який буде показано користувачу.
     */
    @Column(name = "warning_message", nullable = false)
    private String warningMessage;

    /**
     * Серйозність попередження (INFO, WARNING, DANGER).
     */
    @Column(nullable = false)
    private String severity;
}
