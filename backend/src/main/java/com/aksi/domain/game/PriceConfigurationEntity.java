package com.aksi.domain.game;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "price_configurations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceConfigurationEntity extends BaseEntity {

  @Column(name = "base_price", nullable = false)
  @Builder.Default
  private Integer basePrice = 0; // Price in kopiykas

  @Column(name = "price_per_level", nullable = false)
  @Builder.Default
  private Integer pricePerLevel = 0; // Additional price per level in kopiykas

  @Column(name = "calculation_formula", columnDefinition = "text")
  private String calculationFormula; // Formula for complex calculations

  @Column(name = "active", nullable = false)
  @Builder.Default
  private Boolean active = true;

  @Column(name = "is_default", nullable = false)
  @Builder.Default
  private Boolean isDefault = false;

  @Column(name = "sort_order", nullable = false)
  @Builder.Default
  private Integer sortOrder = 0;

  // Relations
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "game_id", nullable = false)
  private GameEntity game;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "difficulty_level_id", nullable = false)
  private DifficultyLevelEntity difficultyLevel;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "service_type_id", nullable = false)
  private ServiceTypeEntity serviceType;
}
