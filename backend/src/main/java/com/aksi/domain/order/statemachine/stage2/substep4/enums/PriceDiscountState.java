package com.aksi.domain.order.statemachine.stage2.substep4.enums;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;

/**
 * Стани підетапу 2.4: Знижки та надбавки (калькулятор ціни).
 * Містить логіку переходів та валідації станів.
 */
public enum PriceDiscountState {
    /**
     * Початковий стан - очікування ініціалізації.
     */
    INITIAL("Початковий стан", "Очікування ініціалізації даних") {
        @Override
        public boolean canTransitionTo(PriceDiscountState nextState) {
            return nextState == CALCULATING_BASE_PRICE;
        }

        @Override
        public boolean isValidForData(PriceDiscountDTO data) {
            return data != null;
        }

        @Override
        public String getRequiredData() {
            return "Базові дані з попередніх підетапів";
        }
    },

    /**
     * Стан розрахунку базової ціни.
     */
    CALCULATING_BASE_PRICE("Розрахунок базової ціни", "Обчислення початкової ціни предмета") {
        @Override
        public boolean canTransitionTo(PriceDiscountState nextState) {
            return nextState == SELECTING_MODIFIERS || nextState == INITIAL || nextState == ERROR;
        }

        @Override
        public boolean isValidForData(PriceDiscountDTO data) {
            return data != null &&
                   data.getCalculationRequest() != null &&
                   !data.isHasCalculationErrors();
        }

        @Override
        public String getRequiredData() {
            return "Дані предмета для розрахунку ціни";
        }
    },

    /**
     * Стан вибору модифікаторів.
     */
    SELECTING_MODIFIERS("Вибір модифікаторів", "Налаштування знижок та надбавок") {
        @Override
        public boolean canTransitionTo(PriceDiscountState nextState) {
            return nextState == CALCULATING_FINAL_PRICE ||
                   nextState == CALCULATING_BASE_PRICE ||
                   nextState == ERROR;
        }

        @Override
        public boolean isValidForData(PriceDiscountDTO data) {
            return data != null &&
                   data.getCalculationResponse() != null &&
                   data.getBasePrice() != null;
        }

        @Override
        public String getRequiredData() {
            return "Базова ціна та доступні модифікатори";
        }
    },

    /**
     * Стан розрахунку фінальної ціни.
     */
    CALCULATING_FINAL_PRICE("Розрахунок фінальної ціни", "Обчислення підсумкової ціни з модифікаторами") {
        @Override
        public boolean canTransitionTo(PriceDiscountState nextState) {
            return nextState == COMPLETED ||
                   nextState == SELECTING_MODIFIERS ||
                   nextState == ERROR;
        }

        @Override
        public boolean isValidForData(PriceDiscountDTO data) {
            return data != null &&
                   data.getCalculationResponse() != null &&
                   data.hasModifiers();
        }

        @Override
        public String getRequiredData() {
            return "Вибрані модифікатори для розрахунку";
        }
    },

    /**
     * Стан завершення підетапу.
     */
    COMPLETED("Завершено", "Підетап завершено успішно") {
        @Override
        public boolean canTransitionTo(PriceDiscountState nextState) {
            return nextState == SELECTING_MODIFIERS; // Можливість повернутися для корекції
        }

        @Override
        public boolean isValidForData(PriceDiscountDTO data) {
            return data != null &&
                   data.isCalculationCompleted() &&
                   data.getFinalPrice() != null &&
                   !data.isHasCalculationErrors();
        }

        @Override
        public String getRequiredData() {
            return "Завершений розрахунок ціни";
        }

        @Override
        public boolean isCompleted() {
            return true;
        }
    },

    /**
     * Стан помилки розрахунку.
     */
    ERROR("Помилка", "Помилка в розрахунку або валідації") {
        @Override
        public boolean canTransitionTo(PriceDiscountState nextState) {
            return nextState == INITIAL || nextState == CALCULATING_BASE_PRICE;
        }

        @Override
        public boolean isValidForData(PriceDiscountDTO data) {
            return data != null && data.isHasCalculationErrors();
        }

        @Override
        public String getRequiredData() {
            return "Корекція помилок";
        }

        @Override
        public boolean isError() {
            return true;
        }
    };

    private final String displayName;
    private final String description;

    PriceDiscountState(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    // === АБСТРАКТНІ МЕТОДИ ===

    /**
     * Перевірка можливості переходу до іншого стану.
     */
    public abstract boolean canTransitionTo(PriceDiscountState nextState);

    /**
     * Перевірка валідності даних для поточного стану.
     */
    public abstract boolean isValidForData(PriceDiscountDTO data);

    /**
     * Опис необхідних даних для стану.
     */
    public abstract String getRequiredData();

    // === ПУБЛІЧНІ МЕТОДИ ===

    /**
     * Перевірка чи стан завершений.
     */
    public boolean isCompleted() {
        return false;
    }

    /**
     * Перевірка чи стан помилки.
     */
    public boolean isError() {
        return false;
    }

    /**
     * Перевірка чи стан є початковим.
     */
    public boolean isInitial() {
        return this == INITIAL;
    }

    /**
     * Перевірка чи стан потребує розрахунків.
     */
    public boolean requiresCalculation() {
        return this == CALCULATING_BASE_PRICE || this == CALCULATING_FINAL_PRICE;
    }

    /**
     * Отримання можливих наступних станів.
     */
    public List<PriceDiscountState> getPossibleNextStates() {
        return Arrays.stream(values())
            .filter(this::canTransitionTo)
            .toList();
    }

    /**
     * Валідація переходу зі станом даних.
     */
    public boolean validateTransition(PriceDiscountState nextState, PriceDiscountDTO data) {
        return canTransitionTo(nextState) &&
               (nextState.isInitial() || nextState.isValidForData(data));
    }

    // === СТАТИЧНІ МЕТОДИ ===

    /**
     * Отримання станів що потребують розрахунків.
     */
    public static Set<PriceDiscountState> getCalculationStates() {
        return Set.of(CALCULATING_BASE_PRICE, CALCULATING_FINAL_PRICE);
    }

    /**
     * Отримання робочих станів (не початковий і не завершений).
     */
    public static Set<PriceDiscountState> getWorkingStates() {
        return Set.of(CALCULATING_BASE_PRICE, SELECTING_MODIFIERS, CALCULATING_FINAL_PRICE);
    }

    /**
     * Перевірка чи стан дозволяє редагування.
     */
    public boolean allowsEditing() {
        return this == SELECTING_MODIFIERS || this == CALCULATING_BASE_PRICE;
    }

    // === GETTERS ===

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
