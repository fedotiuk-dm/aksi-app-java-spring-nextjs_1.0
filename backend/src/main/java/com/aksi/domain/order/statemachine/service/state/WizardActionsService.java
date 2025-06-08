package com.aksi.domain.order.statemachine.service.state;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderState;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для визначення доступних дій у Order Wizard.
 *
 * Відповідальності (SRP):
 * - Визначення доступних дій для поточного стану
 * - Перевірка чи стан потребує введення даних
 *
 * Принципи:
 * - Single Responsibility: тільки логіка доступних дій
 * - Open/Closed: легко розширюється для нових станів
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WizardActionsService {

    /**
     * Отримує список доступних дій для поточного стану wizard.
     */
    public List<String> getAvailableActions(OrderState currentState, Map<String, Object> wizardData) {
        log.debug("Визначення доступних дій для стану: {}", currentState);

        List<String> actions = new ArrayList<>();

        switch (currentState) {
            case INITIAL -> actions.add("Почати створення замовлення");

            case CLIENT_SELECTION -> {
                actions.add("Пошук існуючого клієнта");
                actions.add("Створення нового клієнта");
                if (hasClientData(wizardData)) {
                    actions.add("Підтвердити вибір клієнта");
                    actions.add("Перейти до базової інформації");
                }
            }

            case ORDER_INITIALIZATION -> {
                actions.add("Вибрати філію");
                actions.add("Встановити унікальну мітку");
                if (hasBasicOrderData(wizardData)) {
                    actions.add("Перейти до додавання предметів");
                }
            }

            case ITEM_MANAGEMENT -> {
                actions.add("Додати новий предмет");
                actions.add("Редагувати існуючі предмети");
                if (hasAnyItems(wizardData)) {
                    actions.add("Перейти до параметрів виконання");
                }
            }

            case ITEM_WIZARD_ACTIVE, ITEM_BASIC_INFO -> {
                actions.add("Заповнити основну інформацію предмета");
                actions.add("Перейти до характеристик");
            }

            case ITEM_CHARACTERISTICS -> {
                actions.add("Встановити характеристики предмета");
                actions.add("Перейти до дефектів та плям");
            }

            case ITEM_DEFECTS_STAINS -> {
                actions.add("Відмітити дефекти та плями");
                actions.add("Перейти до розрахунку ціни");
            }

            case ITEM_PRICING -> {
                actions.add("Розрахувати ціну предмета");
                actions.add("Застосувати модифікатори");
                actions.add("Перейти до фото");
            }

            case ITEM_PHOTOS -> {
                actions.add("Завантажити фото предмета");
                actions.add("Завершити додавання предмета");
            }

            case EXECUTION_PARAMS -> {
                actions.add("Встановити дату виконання");
                actions.add("Вибрати тип доставки");
                if (hasExecutionParams(wizardData)) {
                    actions.add("Перейти до знижок");
                }
            }

            case GLOBAL_DISCOUNTS -> {
                actions.add("Застосувати знижки");
                actions.add("Перейти до оплати");
            }

            case PAYMENT_PROCESSING -> {
                actions.add("Вибрати спосіб оплати");
                actions.add("Обробити передоплату");
                if (hasPaymentData(wizardData)) {
                    actions.add("Перейти до додаткової інформації");
                }
            }

            case ADDITIONAL_INFO -> {
                actions.add("Додати коментарі");
                actions.add("Перейти до підтвердження");
            }

            case ORDER_CONFIRMATION -> {
                actions.add("Переглянути замовлення");
                actions.add("Підтвердити замовлення");
            }

            case ORDER_REVIEW -> {
                actions.add("Остаточний огляд");
                actions.add("Перейти до правових аспектів");
            }

            case LEGAL_ASPECTS -> {
                actions.add("Прийняти умови");
                if (hasLegalAcceptance(wizardData)) {
                    actions.add("Генерувати квитанцію");
                }
            }

            case RECEIPT_GENERATION -> {
                actions.add("Генерувати PDF квитанцію");
                actions.add("Надіслати на email");
                actions.add("Завершити замовлення");
            }

            default -> actions.add("Невідомий стан");
        }

        // Додаємо загальні дії для незавершених wizard
        if (!isFinalState(currentState)) {
            actions.add("Зберегти прогрес");
            actions.add("Скасувати замовлення");
        }

        log.debug("Знайдено {} доступних дій для стану {}", actions.size(), currentState);
        return actions;
    }

    /**
     * Перевіряє чи стан потребує введення даних від користувача.
     */
    public boolean isDataInputRequired(OrderState state) {
        return switch (state) {
            case CLIENT_SELECTION, ORDER_INITIALIZATION, ITEM_BASIC_INFO,
                 ITEM_CHARACTERISTICS, ITEM_DEFECTS_STAINS, ITEM_PRICING,
                 EXECUTION_PARAMS, GLOBAL_DISCOUNTS, PAYMENT_PROCESSING,
                 LEGAL_ASPECTS -> true;
            default -> false;
        };
    }

    // ========== Приватні методи валідації даних ==========

    private boolean hasClientData(Map<String, Object> data) {
        return data.containsKey("selectedClient") || data.containsKey("clientData");
    }

    private boolean hasBasicOrderData(Map<String, Object> data) {
        return data.containsKey("selectedBranch") && data.containsKey("orderInfo");
    }

    private boolean hasAnyItems(Map<String, Object> data) {
        Object items = data.get("orderItems");
        return items instanceof List && !((List<?>) items).isEmpty();
    }

    private boolean hasExecutionParams(Map<String, Object> data) {
        return data.containsKey("executionParams") || data.containsKey("deliveryDate");
    }

    private boolean hasPaymentData(Map<String, Object> data) {
        return data.containsKey("paymentMethod") || data.containsKey("paymentData");
    }

    private boolean hasLegalAcceptance(Map<String, Object> data) {
        return Boolean.TRUE.equals(data.get("legalAccepted"));
    }

    private boolean isFinalState(OrderState state) {
        return state == OrderState.COMPLETED || state == OrderState.CANCELLED;
    }
}
