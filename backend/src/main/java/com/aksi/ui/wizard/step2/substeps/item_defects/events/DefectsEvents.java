package com.aksi.ui.wizard.step2.substeps.item_defects.events;

import java.util.List;
import java.util.Set;

import com.aksi.ui.wizard.step2.substeps.item_defects.domain.ItemDefectsState;

/**
 * Events для координації між компонентами дефектів, плям та ризиків.
 * Дотримуємось принципу інверсії залежностей (DIP).
 */
public sealed interface DefectsEvents {

    /**
     * Подія запиту завантаження даних дефектів.
     */
    record DefectsDataLoadRequested(
            String categoryCode
    ) implements DefectsEvents {}

    /**
     * Подія завершення завантаження даних дефектів.
     */
    record DefectsDataLoaded(
            String categoryCode,
            List<String> stainTypes,
            List<String> defectsAndRisks
    ) implements DefectsEvents {}

    /**
     * Подія зміни плям.
     */
    record StainsChanged(
            Set<String> selectedStains,
            String otherStains
    ) implements DefectsEvents {}

    /**
     * Подія зміни дефектів та ризиків.
     */
    record DefectsAndRisksChanged(
            Set<String> selectedDefectsAndRisks,
            String noGuaranteeReason
    ) implements DefectsEvents {}

    /**
     * Подія зміни примітки.
     */
    record DefectsNotesChanged(
            String defectsNotes
    ) implements DefectsEvents {}

    /**
     * Подія оновлення повного стану дефектів.
     */
    record DefectsStateUpdated(
            ItemDefectsState defectsState
    ) implements DefectsEvents {}

    /**
     * Подія помилки завантаження або валідації.
     */
    record DefectsFailed(
            String errorMessage,
            Throwable cause
    ) implements DefectsEvents {}

    /**
     * Подія валідації дефектів.
     */
    record DefectsValidationRequested(
            ItemDefectsState currentState
    ) implements DefectsEvents {}

    /**
     * Подія результату валідації дефектів.
     */
    record DefectsValidationCompleted(
            boolean isValid,
            List<String> validationErrors,
            boolean hasCriticalErrors
    ) implements DefectsEvents {}

    /**
     * Подія зміни видимості полів.
     */
    record FieldVisibilityChanged(
            boolean otherStainsVisible,
            boolean noGuaranteeReasonVisible
    ) implements DefectsEvents {}

    /**
     * Подія ініціалізації дефектів з існуючими значеннями.
     */
    record DefectsInitialized(
            ItemDefectsState initialState
    ) implements DefectsEvents {}

    /**
     * Подія попередження про критичні ризики.
     */
    record CriticalRisksWarning(
            Set<String> criticalRisks,
            String warningMessage
    ) implements DefectsEvents {}

    /**
     * Подія статистики дефектів для відображення підсумків.
     */
    record DefectsStatistics(
            int totalStains,
            int totalDefectsAndRisks,
            boolean hasAnyDefects,
            boolean requiresAttention
    ) implements DefectsEvents {}
}
