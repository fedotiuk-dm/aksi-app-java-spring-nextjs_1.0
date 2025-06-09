package com.aksi.domain.order.statemachine.stage2.substep4.enums;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * Події підетапу 2.4: Знижки та надбавки (калькулятор ціни).
 * Містить логіку обробки подій та валідації.
 */
public enum PriceDiscountEvent {
    /**
     * Ініціалізація підетапу.
     */
    INITIALIZE("Ініціалізація", "Запуск підетапу розрахунку ціни",
               EventType.SYSTEM, EventPriority.HIGH) {
        @Override
        public boolean isValidForState(PriceDiscountState state) {
            return state == PriceDiscountState.INITIAL;
        }

        @Override
        public PriceDiscountState getTargetState() {
            return PriceDiscountState.CALCULATING_BASE_PRICE;
        }
    },

    /**
     * Розрахунок базової ціни.
     */
    CALCULATE_BASE_PRICE("Розрахунок базової ціни", "Обчислення ціни з прайс-листа",
                        EventType.CALCULATION, EventPriority.HIGH) {
        @Override
        public boolean isValidForState(PriceDiscountState state) {
            return state == PriceDiscountState.CALCULATING_BASE_PRICE;
        }

        @Override
        public PriceDiscountState getTargetState() {
            return PriceDiscountState.SELECTING_MODIFIERS;
        }
    },

    /**
     * Вибір модифікаторів.
     */
    SELECT_MODIFIERS("Вибір модифікаторів", "Перехід до налаштування знижок",
                    EventType.USER_ACTION, EventPriority.MEDIUM) {
        @Override
        public boolean isValidForState(PriceDiscountState state) {
            return state == PriceDiscountState.SELECTING_MODIFIERS ||
                   state == PriceDiscountState.CALCULATING_BASE_PRICE;
        }

        @Override
        public PriceDiscountState getTargetState() {
            return PriceDiscountState.SELECTING_MODIFIERS;
        }
    },

    /**
     * Додавання модифікатора.
     */
    ADD_MODIFIER("Додати модифікатор", "Додавання знижки або надбавки",
                EventType.USER_ACTION, EventPriority.MEDIUM) {
        @Override
        public boolean isValidForState(PriceDiscountState state) {
            return state == PriceDiscountState.SELECTING_MODIFIERS;
        }

        @Override
        public PriceDiscountState getTargetState() {
            return PriceDiscountState.SELECTING_MODIFIERS;
        }

        @Override
        public boolean requiresData() {
            return true;
        }
    },

    /**
     * Видалення модифікатора.
     */
    REMOVE_MODIFIER("Видалити модифікатор", "Видалення знижки або надбавки",
                   EventType.USER_ACTION, EventPriority.MEDIUM) {
        @Override
        public boolean isValidForState(PriceDiscountState state) {
            return state == PriceDiscountState.SELECTING_MODIFIERS;
        }

        @Override
        public PriceDiscountState getTargetState() {
            return PriceDiscountState.SELECTING_MODIFIERS;
        }

        @Override
        public boolean requiresData() {
            return true;
        }
    },

    /**
     * Розрахунок фінальної ціни.
     */
    CALCULATE_FINAL_PRICE("Розрахунок фінальної ціни", "Обчислення ціни з модифікаторами",
                         EventType.CALCULATION, EventPriority.HIGH) {
        @Override
        public boolean isValidForState(PriceDiscountState state) {
            return state == PriceDiscountState.CALCULATING_FINAL_PRICE ||
                   state == PriceDiscountState.SELECTING_MODIFIERS;
        }

        @Override
        public PriceDiscountState getTargetState() {
            return PriceDiscountState.CALCULATING_FINAL_PRICE;
        }
    },

    /**
     * Підтвердження розрахунку.
     */
    CONFIRM_CALCULATION("Підтвердити розрахунок", "Фіналізація розрахунку ціни",
                       EventType.SYSTEM, EventPriority.HIGH) {
        @Override
        public boolean isValidForState(PriceDiscountState state) {
            return state == PriceDiscountState.CALCULATING_FINAL_PRICE;
        }

        @Override
        public PriceDiscountState getTargetState() {
            return PriceDiscountState.COMPLETED;
        }
    },

    /**
     * Скидання розрахунку.
     */
    RESET_CALCULATION("Скинути розрахунок", "Повернення до початкового стану",
                     EventType.USER_ACTION, EventPriority.LOW) {
        @Override
        public boolean isValidForState(PriceDiscountState state) {
            return !state.isInitial() && !state.isCompleted();
        }

        @Override
        public PriceDiscountState getTargetState() {
            return PriceDiscountState.INITIAL;
        }
    },

    /**
     * Обробка помилки.
     */
    HANDLE_ERROR("Обробити помилку", "Обробка помилки розрахунку",
                EventType.SYSTEM, EventPriority.CRITICAL) {
        @Override
        public boolean isValidForState(PriceDiscountState state) {
            return !state.isError(); // З будь-якого стану окрім помилки
        }

        @Override
        public PriceDiscountState getTargetState() {
            return PriceDiscountState.ERROR;
        }
    };

    private final String displayName;
    private final String description;
    private final EventType type;
    private final EventPriority priority;

    PriceDiscountEvent(String displayName, String description, EventType type, EventPriority priority) {
        this.displayName = displayName;
        this.description = description;
        this.type = type;
        this.priority = priority;
    }

    // === АБСТРАКТНІ МЕТОДИ ===

    /**
     * Перевірка валідності події для стану.
     */
    public abstract boolean isValidForState(PriceDiscountState state);

    /**
     * Отримання цільового стану після обробки події.
     */
    public abstract PriceDiscountState getTargetState();

    // === ПУБЛІЧНІ МЕТОДИ ===

    /**
     * Перевірка чи подія потребує додаткових даних.
     */
    public boolean requiresData() {
        return false;
    }

    /**
     * Перевірка чи подія є навігаційною.
     */
    public boolean isNavigational() {
        return false;
    }

    /**
     * Перевірка чи подія є системною.
     */
    public boolean isSystemEvent() {
        return type == EventType.SYSTEM;
    }

    /**
     * Перевірка чи подія є розрахунковою.
     */
    public boolean isCalculationEvent() {
        return type == EventType.CALCULATION;
    }

    /**
     * Перевірка чи подія має високий пріоритет.
     */
    public boolean isHighPriority() {
        return priority == EventPriority.HIGH || priority == EventPriority.CRITICAL;
    }

    // === СТАТИЧНІ МЕТОДИ ===

    /**
     * Отримання доступних подій для стану.
     */
    public static List<PriceDiscountEvent> getValidEventsForState(PriceDiscountState state) {
        return Arrays.stream(values())
            .filter(event -> event.isValidForState(state))
            .toList();
    }

    /**
     * Отримання системних подій.
     */
    public static Set<PriceDiscountEvent> getSystemEvents() {
        return Set.of(INITIALIZE, CONFIRM_CALCULATION, HANDLE_ERROR);
    }

    /**
     * Отримання подій користувача.
     */
    public static Set<PriceDiscountEvent> getUserEvents() {
        return Set.of(SELECT_MODIFIERS, ADD_MODIFIER, REMOVE_MODIFIER, RESET_CALCULATION);
    }

    /**
     * Отримання розрахункових подій.
     */
    public static Set<PriceDiscountEvent> getCalculationEvents() {
        return Set.of(CALCULATE_BASE_PRICE, CALCULATE_FINAL_PRICE);
    }

    // === ЕНУМИ ПІДТРИМКИ ===

    public enum EventType {
        SYSTEM("Системна"),
        USER_ACTION("Дія користувача"),
        CALCULATION("Розрахунок"),
        NAVIGATION("Навігація");

        private final String displayName;

        EventType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum EventPriority {
        LOW(1, "Низький"),
        MEDIUM(2, "Середній"),
        HIGH(3, "Високий"),
        CRITICAL(4, "Критичний");

        private final int level;
        private final String displayName;

        EventPriority(int level, String displayName) {
            this.level = level;
            this.displayName = displayName;
        }

        public int getLevel() {
            return level;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // === GETTERS ===

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public EventType getType() {
        return type;
    }

    public EventPriority getPriority() {
        return priority;
    }
}
