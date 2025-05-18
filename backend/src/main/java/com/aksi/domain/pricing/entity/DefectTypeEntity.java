package com.aksi.domain.pricing.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * Entity для зберігання типів дефектів.
 * Використовується для рекомендацій модифікаторів цін та відображення 
 * у інтерфейсі замовлення.
 */
@Entity
@Table(name = "defect_types")
@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DefectTypeEntity extends AbstractItemIssueEntity {
    
    // Можна додати специфічні для дефектів поля, якщо вони з'являться
} 