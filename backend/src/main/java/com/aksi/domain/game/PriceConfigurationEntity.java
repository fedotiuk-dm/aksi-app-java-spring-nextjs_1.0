package com.aksi.domain.game;

import java.time.Instant;

import org.hibernate.annotations.Type;

import com.aksi.domain.common.BaseEntity;
import com.aksi.domain.game.formula.CalculationFormulaEntity;
import com.aksi.domain.game.hibernate.CalculationFormulaUserType;

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

/**
 * Price configuration entity for game services.
 * Stores pricing information with calculation formulas.
 */
@Entity
@Table(name = "price_configurations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceConfigurationEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "game_id", nullable = false)
  private GameEntity game;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "difficulty_level_id", nullable = false)
  private DifficultyLevelEntity difficultyLevel;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "service_type_id", nullable = false)
  private ServiceTypeEntity serviceType;

  @Column(name = "base_price", nullable = false)
  private Integer basePrice; // in cents

  @Column(name = "price_per_level")
  @Builder.Default
  private Integer pricePerLevel = 0; // in cents

  @Column(name = "currency")
  @Builder.Default
  private String currency = "USD";

  @Column(name = "calculation_type")
  private String calculationType; // LINEAR, RANGE, FORMULA, TIME_BASED

  @Type(CalculationFormulaUserType.class)
  @Column(name = "calculation_formula", columnDefinition = "TEXT")
  private CalculationFormulaEntity calculationFormula;

  @Column(name = "active")
  @Builder.Default
  private Boolean active = true;

  @Column(name = "sort_order")
  @Builder.Default
  private Integer sortOrder = 0;

  @Column(name = "created_at")
  private Instant createdAt;

  @Column(name = "updated_at")
  private Instant updatedAt;
}
