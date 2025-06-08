package com.aksi.domain.order.statemachine.stage2.substep3.dto;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.pricing.enums.RiskLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відображення типу плями з додатковою інформацією
 *
 * Розширює базову інформацію з БД додатковою логікою
 * для відображення в UI та рекомендацій
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StainSelectionDTO {

    /**
     * ID з БД
     */
    private UUID id;

    /**
     * Код плями (для програмного використання)
     */
    private String code;

    /**
     * Назва плями для відображення
     */
    private String name;

    /**
     * Опис плями
     */
    private String description;

    /**
     * Рівень ризику (з БД)
     */
    private RiskLevel riskLevel;

    /**
     * Чи активна пляма
     */
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Чи вибрана користувачем
     */
    @Builder.Default
    private Boolean isSelected = false;

    /**
     * Чи рекомендується для поточного матеріала/категорії
     */
    @Builder.Default
    private Boolean isRecommended = false;

    /**
     * Список рекомендованих методів видалення
     */
    @Builder.Default
    private List<String> removalMethods = List.of();

    /**
     * Попередження щодо цієї плями
     */
    @Builder.Default
    private List<String> warnings = List.of();

    /**
     * Рекомендовані модифікатори цін для цієї плями
     */
    @Builder.Default
    private List<String> recommendedModifiers = List.of();

    /**
     * Додаткові примітки
     */
    private String notes;

    /**
     * Створює StainSelectionDTO з базового StainTypeDTO
     */
    public static StainSelectionDTO fromStainTypeDTO(com.aksi.domain.pricing.dto.StainTypeDTO stainType) {
        return StainSelectionDTO.builder()
                .id(stainType.getId())
                .code(stainType.getCode())
                .name(stainType.getName())
                .description(stainType.getDescription())
                .riskLevel(stainType.getRiskLevel())
                .isActive(stainType.isActive())
                .build();
    }

    /**
     * Перевіряє чи є пляма високого ризику
     */
    public boolean isHighRisk() {
        return riskLevel == RiskLevel.HIGH;
    }

    /**
     * Перевіряє чи потребує спеціального видалення
     */
    public boolean requiresSpecialRemoval() {
        return isHighRisk() || !removalMethods.isEmpty();
    }

    /**
     * Отримує стиль для відображення в UI (залежно від ризику)
     */
    public String getDisplayStyle() {
        return switch (riskLevel) {
            case HIGH -> "danger";
            case MEDIUM -> "warning";
            case LOW -> "success";
            default -> "default";
        };
    }

    /**
     * Отримує іконку для відображення в UI
     */
    public String getDisplayIcon() {
        return switch (riskLevel) {
            case HIGH -> "⚠️";
            case MEDIUM -> "⚡";
            case LOW -> "✓";
            default -> "•";
        };
    }
}
