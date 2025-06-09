package com.aksi.domain.order.statemachine.stage2.substep5.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationState;
import com.aksi.domain.order.statemachine.stage2.substep5.enums.PhotoDocumentationEvent;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO для результату виконання підетапу 2.5: Фотодокументація.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class SubstepResultDTO {

    /**
     * Унікальний ідентифікатор сесії.
     */
    private UUID sessionId;

    /**
     * Поточний стан підетапу.
     */
    private PhotoDocumentationState currentState;

    /**
     * Попередній стан підетапу.
     */
    private PhotoDocumentationState previousState;

    /**
     * Чи успішно виконана операція.
     */
    @Builder.Default
    private Boolean success = false;

    /**
     * Повідомлення про результат.
     */
    private String message;

    /**
     * Детальний опис результату.
     */
    private String details;

    /**
     * Дані фотодокументації.
     */
    private PhotoDocumentationDTO data;

    /**
     * Список доступних подій для поточного стану.
     */
    private List<PhotoDocumentationEvent> availableEvents;

    /**
     * Список помилок валідації.
     */
    private List<String> validationErrors;

    /**
     * Час створення результату.
     */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
