package com.aksi.domain.game;

import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "games")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameEntity extends BaseEntity {

  @Column(name = "code", nullable = false, unique = true, length = 50)
  private String code;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "description", length = 500)
  private String description;

  @Column(name = "category", nullable = false, length = 50)
  private String category;

  @Column(name = "active", nullable = false)
  @Builder.Default
  private Boolean active = true;

  @Column(name = "sort_order", nullable = false)
  @Builder.Default
  private Integer sortOrder = 0;

  // Relations
  @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @Builder.Default
  private List<DifficultyLevelEntity> difficultyLevels = new ArrayList<>();

  @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @Builder.Default
  private List<PriceConfigurationEntity> priceConfigurations = new ArrayList<>();

  @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @Builder.Default
  private List<BoosterGameSpecializationEntity> boosterSpecializations = new ArrayList<>();
}
