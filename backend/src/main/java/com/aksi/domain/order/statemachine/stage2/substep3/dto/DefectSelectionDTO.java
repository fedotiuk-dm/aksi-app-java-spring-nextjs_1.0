package com.aksi.domain.order.statemachine.stage2.substep3.dto;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.pricing.enums.RiskLevel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для відображення типу дефекту з додатковою інформацією
 *
 * Розширює базову інформацію з БД додатковою логікою
 * для відображення в UI та рекомендацій
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DefectSelectionDTO {

    /**
     * ID з БД
     */
    private UUID id;

    /**
     * Код дефекту (для програмного використання)
     */
    private String code;

    /**
     * Назва дефекту для відображення
     */
    private String name;

    /**
     * Опис дефекту
     */
    private String description;

    /**
     * Рівень ризику (з БД)
     */
    private RiskLevel riskLevel;

    /**
     * Чи активний дефект
     */
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Чи вибраний користувачем
     */
    @Builder.Default
    private Boolean isSelected = false;

    /**
     * Чи рекомендується для поточного матеріала/категорії
     */
    @Builder.Default
    private Boolean isRecommended = false;

    /**
     * Категорія дефекту (фізичний, естетичний, функціональний)
     */
    private String category;

    /**
     * Чи може бути відремонтований
     */
    @Builder.Default
    private Boolean isRepairable = false;

    /**
     * Список рекомендованих методів виправлення
     */
    @Builder.Default
    private List<String> repairMethods = List.of();

    /**
     * Попередження щодо цього дефекту
     */
    @Builder.Default
    private List<String> warnings = List.of();

    /**
     * Рекомендовані модифікатори цін для цього дефекту
     */
    @Builder.Default
    private List<String> recommendedModifiers = List.of();

    /**
     * Чи потребує обов'язкового погодження з клієнтом
     */
    @Builder.Default
    private Boolean requiresClientApproval = false;

    /**
     * Додаткові примітки
     */
    private String notes;

    /**
     * Створює DefectSelectionDTO з базового DefectTypeDTO
     */
    public static DefectSelectionDTO fromDefectTypeDTO(com.aksi.domain.pricing.dto.DefectTypeDTO defectType) {
        return DefectSelectionDTO.builder()
                .id(defectType.getId())
                .code(defectType.getCode())
                .name(defectType.getName())
                .description(defectType.getDescription())
                .riskLevel(defectType.getRiskLevel())
                .isActive(defectType.isActive())
                .build();
    }

    /**
     * Перевіряє чи є дефект високого ризику
     */
    public boolean isHighRisk() {
        return riskLevel == RiskLevel.HIGH;
    }

    /**
     * Перевіряє чи є дефект критичним (потребує особливої уваги)
     */
    public boolean isCritical() {
        return isHighRisk() || Boolean.TRUE.equals(requiresClientApproval);
    }

    /**
     * Перевіряє чи може погіршити стан предмета при обробці
     */
    public boolean canWorsenDuringProcessing() {
        return isHighRisk() && !warnings.isEmpty();
    }

    /**
     * Отримує стиль для відображення в UI (залежно від ризику)
     */
    public String getDisplayStyle() {
        return switch (riskLevel) {
            case HIGH -> "danger";
            case MEDIUM -> "warning";
            case LOW -> "info";
            default -> "default";
        };
    }

    /**
     * Отримує іконку для відображення в UI
     */
    public String getDisplayIcon() {
        if (Boolean.TRUE.equals(requiresClientApproval)) {
            return "❗";
        }

        return switch (riskLevel) {
            case HIGH -> "🔴";
            case MEDIUM -> "🟡";
            case LOW -> "🔵";
            default -> "⚪";
        };
    }

    /**
     * Отримує рекомендацію щодо подальшої дії
     */
    public String getActionRecommendation() {
        if (isCritical()) {
            return "Потребує погодження з клієнтом";
        } else if (Boolean.TRUE.equals(isRepairable)) {
            return "Можна виправити під час обробки";
        } else {
            return "Врахувати при обробці";
        }
    }
}
