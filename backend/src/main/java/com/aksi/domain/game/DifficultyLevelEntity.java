package com.aksi.domain.game;

import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "difficulty_levels")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DifficultyLevelEntity extends BaseEntity {

  @Column(name = "code", nullable = false, length = 50)
  private String code;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "level_value", nullable = false)
  private Integer levelValue;

  @Column(name = "sort_order", nullable = false)
  @Builder.Default
  private Integer sortOrder = 0;

  @Column(name = "active", nullable = false)
  @Builder.Default
  private Boolean active = true;

  // Relations
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "game_id", nullable = false)
  private GameEntity game;

  @OneToMany(mappedBy = "difficultyLevel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @Builder.Default
  private List<PriceConfigurationEntity> priceConfigurations = new ArrayList<>();
}
