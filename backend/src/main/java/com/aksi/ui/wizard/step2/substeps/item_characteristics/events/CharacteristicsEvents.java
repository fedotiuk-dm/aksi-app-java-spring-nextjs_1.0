package com.aksi.ui.wizard.step2.substeps.item_characteristics.events;

import java.util.List;

import com.aksi.ui.wizard.step2.substeps.item_characteristics.domain.ItemCharacteristicsState;

/**
 * Events для координації між компонентами характеристик предмета.
 * Дотримуємось принципу інверсії залежностей (DIP).
 */
public sealed interface CharacteristicsEvents {

    /**
     * Подія запиту завантаження характеристик для категорії.
     */
    record CharacteristicsLoadRequested(
            String categoryCode
    ) implements CharacteristicsEvents {}

    /**
     * Подія завершення завантаження характеристик.
     */
    record CharacteristicsLoaded(
            String categoryCode,
            List<String> materials,
            List<String> colors,
            List<String> fillerTypes,
            List<String> wearDegrees
    ) implements CharacteristicsEvents {}

    /**
     * Подія зміни характеристик предмета.
     */
    record CharacteristicsChanged(
            String material,
            String color,
            String customColor,
            String fillerType,
            String customFillerType,
            Boolean fillerCompressed,
            String wearDegree
    ) implements CharacteristicsEvents {}

    /**
     * Подія оновлення стану характеристик.
     */
    record CharacteristicsStateUpdated(
            ItemCharacteristicsState characteristicsState
    ) implements CharacteristicsEvents {}

    /**
     * Подія помилки завантаження або валідації.
     */
    record CharacteristicsFailed(
            String errorMessage,
            Throwable cause
    ) implements CharacteristicsEvents {}

    /**
     * Подія валідації характеристик.
     */
    record CharacteristicsValidationRequested(
            ItemCharacteristicsState currentState
    ) implements CharacteristicsEvents {}

    /**
     * Подія результату валідації.
     */
    record CharacteristicsValidationCompleted(
            boolean isValid,
            List<String> validationErrors
    ) implements CharacteristicsEvents {}

    /**
     * Подія зміни видимості секцій.
     */
    record SectionVisibilityChanged(
            boolean fillerSectionVisible,
            boolean customColorVisible,
            boolean customFillerVisible
    ) implements CharacteristicsEvents {}

    /**
     * Подія ініціалізації характеристик з існуючими значеннями.
     */
    record CharacteristicsInitialized(
            ItemCharacteristicsState initialState
    ) implements CharacteristicsEvents {}
}
