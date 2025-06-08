package com.aksi.domain.order.statemachine.dto;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для статусу завершення етапів Order Wizard.
 * Відслідковує прогрес виконання кожного етапу та загальний стан wizard.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Статус завершення етапів Order Wizard")
public class StageCompletionStatusDTO {

    @Schema(description = "Унікальний ідентифікатор wizard", example = "wizard-123e4567-e89b-12d3-a456-426614174000")
    private String wizardId;

    @Schema(description = "Статус завершення етапу 1 - Клієнт та базова інформація", example = "true")
    private Boolean stage1Completed;

    @Schema(description = "Час завершення етапу 1")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime stage1CompletedAt;

    @Schema(description = "Статус завершення етапу 2 - Менеджер предметів", example = "false")
    private Boolean stage2Completed;

    @Schema(description = "Час завершення етапу 2")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime stage2CompletedAt;

    @Schema(description = "Кількість доданих предметів в етапі 2", example = "3")
    private Integer stage2ItemsCount;

    @Schema(description = "Статус завершення етапу 3 - Параметри замовлення", example = "false")
    private Boolean stage3Completed;

    @Schema(description = "Час завершення етапу 3")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime stage3CompletedAt;

    @Schema(description = "Статус завершення етапу 4 - Підтвердження та завершення", example = "false")
    private Boolean stage4Completed;

    @Schema(description = "Час завершення етапу 4")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime stage4CompletedAt;

    @Schema(description = "Загальний відсоток завершення wizard", example = "25")
    private Integer overallCompletionPercentage;

    @Schema(description = "Поточний активний етап", example = "2")
    private Integer currentStageNumber;

    @Schema(description = "Назва поточного етапу", example = "Менеджер предметів")
    private String currentStageName;

    @Schema(description = "Чи може wizard перейти до завершення", example = "false")
    private Boolean canComplete;

    @Schema(description = "Причини чому wizard не може завершитися")
    private Map<String, String> blockingReasons;

    @Schema(description = "Час останнього оновлення статусу")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastUpdated;

    /**
     * Перевіряє, чи можна перейти до наступного етапу.
     */
    public boolean canProceedToStage(int stageNumber) {
        return switch (stageNumber) {
            case 2 -> Boolean.TRUE.equals(stage1Completed);
            case 3 -> Boolean.TRUE.equals(stage1Completed) && Boolean.TRUE.equals(stage2Completed);
            case 4 -> Boolean.TRUE.equals(stage1Completed) && Boolean.TRUE.equals(stage2Completed)
                      && Boolean.TRUE.equals(stage3Completed);
            default -> false;
        };
    }

    /**
     * Розраховує загальний відсоток завершення.
     */
    public void calculateCompletionPercentage() {
        int completedStages = 0;
        if (Boolean.TRUE.equals(stage1Completed)) completedStages++;
        if (Boolean.TRUE.equals(stage2Completed)) completedStages++;
        if (Boolean.TRUE.equals(stage3Completed)) completedStages++;
        if (Boolean.TRUE.equals(stage4Completed)) completedStages++;

        this.overallCompletionPercentage = (completedStages * 100) / 4;
    }

    /**
     * Перевіряє чи wizard повністю завершений.
     */
    public boolean isFullyCompleted() {
        return Boolean.TRUE.equals(stage1Completed) &&
               Boolean.TRUE.equals(stage2Completed) &&
               Boolean.TRUE.equals(stage3Completed) &&
               Boolean.TRUE.equals(stage4Completed);
    }
}
