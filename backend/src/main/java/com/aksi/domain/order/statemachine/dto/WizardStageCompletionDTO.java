package com.aksi.domain.order.statemachine.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.aksi.domain.order.statemachine.OrderState;

import lombok.Builder;
import lombok.Data;

/**
 * DTO для статусу завершення етапів Order Wizard.
 */
@Data
@Builder
public class WizardStageCompletionDTO {

    /**
     * ID wizard.
     */
    private String wizardId;

    /**
     * Поточний стан wizard.
     */
    private OrderState currentState;

    /**
     * Номер поточного етапу (1-4).
     */
    private Integer currentStageNumber;

    /**
     * Назва поточного етапу.
     */
    private String currentStageName;

    /**
     * Чи завершено етап 1.
     */
    private Boolean stage1Completed;

    /**
     * Час завершення етапу 1.
     */
    private LocalDateTime stage1CompletedAt;

    /**
     * Чи завершено етап 2.
     */
    private Boolean stage2Completed;

    /**
     * Час завершення етапу 2.
     */
    private LocalDateTime stage2CompletedAt;

    /**
     * Кількість предметів в етапі 2.
     */
    private Integer stage2ItemsCount;

    /**
     * Чи завершено етап 3.
     */
    private Boolean stage3Completed;

    /**
     * Час завершення етапу 3.
     */
    private LocalDateTime stage3CompletedAt;

    /**
     * Чи завершено етап 4.
     */
    private Boolean stage4Completed;

    /**
     * Час завершення етапу 4.
     */
    private LocalDateTime stage4CompletedAt;

    /**
     * Загальний відсоток завершення (0-100).
     */
    private Integer overallCompletionPercentage;

    /**
     * Чи може wizard завершитися.
     */
    private Boolean canComplete;

    /**
     * Причини блокування завершення.
     */
    private Map<String, String> blockingReasons;

    /**
     * Список відсутніх обов'язкових даних.
     */
    private List<String> missingRequiredData;

    /**
     * Час останнього оновлення.
     */
    private LocalDateTime lastUpdated;
}
