package com.aksi.ui.wizard.step2.substeps.item_info.events;

import java.math.BigDecimal;
import java.util.List;

import com.aksi.ui.wizard.step2.substeps.item_info.domain.ItemBasicInfoState;

/**
 * Events для координації між компонентами основної інформації про предмет.
 * Дотримуємось принципу інверсії залежностей (DIP).
 */
public sealed interface BasicInfoEvents {

    /**
     * Подія запиту завантаження категорій.
     */
    record CategoriesLoadRequested() implements BasicInfoEvents {}

    /**
     * Подія завершення завантаження категорій.
     */
    record CategoriesLoaded(
            List<ItemBasicInfoState.CategoryOption> categories
    ) implements BasicInfoEvents {}

    /**
     * Подія зміни вибраної категорії.
     */
    record CategorySelected(
            String categoryId,
            String categoryName
    ) implements BasicInfoEvents {}

    /**
     * Подія запиту завантаження предметів для категорії.
     */
    record ItemsLoadRequested(
            String categoryId
    ) implements BasicInfoEvents {}

    /**
     * Подія завершення завантаження предметів.
     */
    record ItemsLoaded(
            String categoryId,
            List<ItemBasicInfoState.ItemOption> items
    ) implements BasicInfoEvents {}

    /**
     * Подія зміни вибраного предмета.
     */
    record ItemSelected(
            String itemId,
            String itemName,
            String unitOfMeasure,
            BigDecimal unitPrice
    ) implements BasicInfoEvents {}

    /**
     * Подія зміни кількості.
     */
    record QuantityChanged(
            Integer newQuantity
    ) implements BasicInfoEvents {}

    /**
     * Подія оновлення повного стану основної інформації.
     */
    record BasicInfoStateUpdated(
            ItemBasicInfoState basicInfoState
    ) implements BasicInfoEvents {}

    /**
     * Подія помилки завантаження або валідації.
     */
    record BasicInfoFailed(
            String errorMessage,
            Throwable cause
    ) implements BasicInfoEvents {}

    /**
     * Подія валідації основної інформації.
     */
    record BasicInfoValidationRequested(
            ItemBasicInfoState currentState
    ) implements BasicInfoEvents {}

    /**
     * Подія результату валідації основної інформації.
     */
    record BasicInfoValidationCompleted(
            boolean isValid,
            List<String> validationErrors,
            boolean canProceedNext
    ) implements BasicInfoEvents {}

    /**
     * Подія зміни стану UI компонентів.
     */
    record UIStateChanged(
            boolean itemSelectionEnabled,
            boolean quantityEnabled,
            boolean nextButtonEnabled
    ) implements BasicInfoEvents {}

    /**
     * Подія ініціалізації основної інформації з існуючими значеннями.
     */
    record BasicInfoInitialized(
            ItemBasicInfoState initialState
    ) implements BasicInfoEvents {}

    /**
     * Подія оновлення інформації про ціни.
     */
    record PriceInfoUpdated(
            String formattedUnitPrice,
            String formattedTotalPrice,
            BigDecimal totalPriceValue
    ) implements BasicInfoEvents {}

    /**
     * Подія готовності до переходу на наступний етап.
     */
    record ReadyForNext(
            ItemBasicInfoState finalState,
            boolean isReadyToNavigate
    ) implements BasicInfoEvents {}

    /**
     * Подія скидання вибору предмета при зміні категорії.
     */
    record ItemSelectionCleared() implements BasicInfoEvents {}
}
