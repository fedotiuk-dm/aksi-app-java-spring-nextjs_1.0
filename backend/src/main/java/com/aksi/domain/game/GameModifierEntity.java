package com.aksi.domain.game;

import java.time.Instant;
import java.util.List;

import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.domain.common.BaseEntity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Game modifier entity for game boosting services.
 * Represents additional modifiers that can be applied to game services.
 */
@Entity
@Table(
    name = "game_modifiers",
    uniqueConstraints = @UniqueConstraint(columnNames = {"code", "game_code"}),
    indexes = {
        @Index(name = "idx_game_modifier_code", columnList = "code"),
        @Index(name = "idx_game_modifier_game_code", columnList = "game_code"),
        @Index(name = "idx_game_modifier_type", columnList = "modifier_type"),
        @Index(name = "idx_game_modifier_active", columnList = "active"),
        @Index(name = "idx_game_modifier_sort_order", columnList = "sort_order")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameModifierEntity extends BaseEntity {

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "modifier_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private GameModifierType type;

    @Column(name = "operation_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private GameModifierOperation operation = GameModifierOperation.ADD;

    @Column(name = "modifier_value", nullable = false)
    private Integer value;

    @Column(name = "game_code", nullable = false, length = 20)
    private String gameCode;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "game_modifier_service_types",
        joinColumns = @JoinColumn(name = "game_modifier_id")
    )
    @Column(name = "service_type_code")
    private List<String> serviceTypeCodes;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "icon", length = 10)
    private String icon;

    @Column(name = "color", length = 7)
    private String color;

    @Column(name = "priority")
    private Integer priority = 0;

    @Column(name = "max_uses")
    private Integer maxUses;

    @Column(name = "effective_date")
    private Instant effectiveDate;

    @Column(name = "expiration_date")
    private Instant expirationDate;

    @Column(name = "conditions", columnDefinition = "TEXT")
    private String conditions;

    @Column(name = "active", nullable = false)
    private Boolean active = true;
}
