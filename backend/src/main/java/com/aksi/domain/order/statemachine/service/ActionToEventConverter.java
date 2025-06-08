package com.aksi.domain.order.statemachine.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.OrderEvent;

import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для конвертації дій користувача в події State Machine.
 *
 * Застосовує Strategy Pattern для маппінгу між:
 * - Діями фронтенду (searchClients, createClient тощо)
 * - Подіями State Machine (CLIENT_SEARCH_STARTED, CLIENT_CREATED тощо)
 *
 * Принципи SOLID:
 * - SRP: Тільки конвертація дій в події
 * - OCP: Легко додавати нові дії без зміни існуючого коду
 * - LSP: Всі конвертери мають однаковий інтерфейс
 * - ISP: Клієнти використовують тільки потрібні методи конвертації
 * - DIP: Залежить від абстракцій OrderEvent, а не конкретних реалізацій
 */
@Service
@Slf4j
public class ActionToEventConverter {

    /**
     * Конвертує дію етапу в подію State Machine.
     */
    public OrderEvent convertActionToEvent(int stage, String action) {
        log.debug("Конвертація дії '{}' етапу {} в подію State Machine", action, stage);

        return switch (stage) {
            case 1 -> convertStage1Action(action);
            case 2 -> convertStage2Action(action);
            case 3 -> convertStage3Action(action);
            case 4 -> convertStage4Action(action);
            default -> {
                log.warn("Невідомий етап: {}. Використовується універсальна подія.", stage);
                yield OrderEvent.SAVE_DRAFT; // Fallback подія
            }
        };
    }

    /**
     * Конвертує дії етапу 1 (Клієнт та базова інформація).
     */
    private OrderEvent convertStage1Action(String action) {
        return switch (action) {
            case "searchClients", "selectClient", "createClient" -> OrderEvent.CLIENT_SELECTED;
            case "selectBranch", "setUniqueTag", "generateReceiptNumber" -> OrderEvent.ORDER_INFO_COMPLETED;
            case "finishStage1" -> OrderEvent.ORDER_INFO_COMPLETED;
            default -> {
                log.debug("Невідома дія етапу 1: {}. Використовується універсальна подія.", action);
                yield OrderEvent.SAVE_DRAFT;
            }
        };
    }

    /**
     * Конвертує дії етапу 2 (Менеджер предметів).
     */
    private OrderEvent convertStage2Action(String action) {
        return switch (action) {
            case "startItemWizard" -> OrderEvent.START_ITEM_WIZARD;
            case "completeItemWizard" -> OrderEvent.ITEM_ADDED;
            case "deleteItem" -> OrderEvent.DELETE_ITEM;
            case "addItem" -> OrderEvent.ADD_ITEM;
            case "editItem" -> OrderEvent.EDIT_ITEM;
            case "finishStage2" -> OrderEvent.ITEMS_COMPLETED;
            // Підетапи Item Wizard
            case "saveBasicInfo" -> OrderEvent.BASIC_INFO_COMPLETED;
            case "saveCharacteristics" -> OrderEvent.CHARACTERISTICS_COMPLETED;
            case "saveDefectsStains" -> OrderEvent.DEFECTS_COMPLETED;
            case "calculatePrice" -> OrderEvent.PRICING_COMPLETED;
            case "uploadPhoto" -> OrderEvent.PHOTOS_COMPLETED;
            default -> {
                log.debug("Невідома дія етапу 2: {}. Використовується універсальна подія.", action);
                yield OrderEvent.SAVE_DRAFT;
            }
        };
    }

    /**
     * Конвертує дії етапу 3 (Параметри виконання та оплата).
     */
    private OrderEvent convertStage3Action(String action) {
        return switch (action) {
            case "setExecutionParameters", "setDeliveryDate", "setUrgency" -> OrderEvent.EXECUTION_PARAMS_SET;
            case "applyDiscount" -> OrderEvent.DISCOUNTS_APPLIED;
            case "setPaymentMethod" -> OrderEvent.PAYMENT_PROCESSED;
            case "saveAdditionalInfo" -> OrderEvent.ADDITIONAL_INFO_COMPLETED;
            case "finishStage3" -> OrderEvent.ADDITIONAL_INFO_COMPLETED;
            default -> {
                log.debug("Невідома дія етапу 3: {}. Використовується універсальна подія.", action);
                yield OrderEvent.SAVE_DRAFT;
            }
        };
    }

    /**
     * Конвертує дії етапу 4 (Завершення та квитанція).
     */
    private OrderEvent convertStage4Action(String action) {
        return switch (action) {
            case "generateOrderSummary" -> OrderEvent.REVIEW_ORDER;
            case "acceptLegalTerms" -> OrderEvent.TERMS_ACCEPTED;
            case "generateReceipt", "printReceipt", "emailReceipt" -> OrderEvent.RECEIPT_GENERATED;
            case "completeWizard" -> OrderEvent.RECEIPT_GENERATED;
            default -> {
                log.debug("Невідома дія етапу 4: {}. Використовується універсальна подія.", action);
                yield OrderEvent.SAVE_DRAFT;
            }
        };
    }

    /**
     * Перевіряє чи підтримується дія для вказаного етапу.
     */
    public boolean isActionSupported(int stage, String action) {
        try {
            OrderEvent event = convertActionToEvent(stage, action);
            return event != OrderEvent.SAVE_DRAFT; // SAVE_DRAFT використовується як fallback
        } catch (Exception e) {
            log.debug("Дія '{}' етапу {} не підтримується: {}", action, stage, e.getMessage());
            return false;
        }
    }

    /**
     * Отримує список підтримуваних дій для етапу.
     */
    public Map<String, String> getSupportedActions(int stage) {
        return switch (stage) {
            case 1 -> Map.of(
                "searchClients", "Пошук клієнтів",
                "selectClient", "Вибір клієнта",
                "createClient", "Створення клієнта",
                "selectBranch", "Вибір філії",
                "setUniqueTag", "Встановлення унікальної мітки",
                "generateReceiptNumber", "Генерація номера квитанції",
                "finishStage1", "Завершення етапу 1"
            );
            case 2 -> Map.of(
                "startItemWizard", "Запуск візарда предмета",
                "completeItemWizard", "Завершення візарда предмета",
                "deleteItem", "Видалення предмета",
                "addItem", "Додавання предмета",
                "editItem", "Редагування предмета",
                "finishStage2", "Завершення етапу 2"
            );
            case 3 -> Map.of(
                "setExecutionParameters", "Встановлення параметрів виконання",
                "applyDiscount", "Застосування знижки",
                "setPaymentMethod", "Встановлення способу оплати",
                "saveAdditionalInfo", "Збереження додаткової інформації",
                "finishStage3", "Завершення етапу 3"
            );
            case 4 -> Map.of(
                "generateOrderSummary", "Генерація підсумку замовлення",
                "acceptLegalTerms", "Прийняття правових умов",
                "generateReceipt", "Генерація квитанції",
                "completeWizard", "Завершення візарда"
            );
            default -> Map.of();
        };
    }
}
