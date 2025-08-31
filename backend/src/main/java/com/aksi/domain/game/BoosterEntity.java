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
@Table(name = "boosters")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoosterEntity extends BaseEntity {

  @Column(name = "discord_username", nullable = false, unique = true, length = 100)
  private String discordUsername;

  @Column(name = "contact_email")
  private String contactEmail;

  @Column(name = "display_name", nullable = false, length = 100)
  private String displayName;

  @Column(name = "rating", nullable = false)
  @Builder.Default
  private Integer rating = 0; // Rating out of 50 (0-50 scale)

  @Column(name = "completed_orders", nullable = false)
  @Builder.Default
  private Integer completedOrders = 0;

  @Column(name = "active", nullable = false)
  @Builder.Default
  private Boolean active = true;

  // Relations
  @OneToMany(mappedBy = "booster", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @Builder.Default
  private List<BoosterGameSpecializationEntity> gameSpecializations = new ArrayList<>();
}
