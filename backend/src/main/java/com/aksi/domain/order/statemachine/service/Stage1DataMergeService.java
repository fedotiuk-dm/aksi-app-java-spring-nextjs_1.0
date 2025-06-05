package com.aksi.domain.order.statemachine.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.dto.OrderInitializationDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для керування даними етапу 1 Order Wizard.
 * Відповідає за збереження та валідацію даних:
 * - Підетап 1.1: Вибір клієнта
 * - Підетап 1.2: Базова інформація замовлення
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Stage1DataMergeService {

    private static final String CLIENT_SELECTION_KEY = "stage1ClientSelection";
    private static final String ORDER_INIT_KEY = "stage1OrderInit";

    private final ObjectMapper objectMapper;

    /**
     * === ПІДЕТАП 1.1: ВИБІР КЛІЄНТА ===
     */

    /**
     * Зберегти дані вибору клієнта.
     */
    public void saveClientSelection(Map<String, Object> contextVariables, ClientSelectionDTO clientSelection) {
        if (clientSelection == null) {
            log.warn("Спроба збереження null даних вибору клієнта");
            return;
        }

        contextVariables.put(CLIENT_SELECTION_KEY, clientSelection);

        log.debug("Дані вибору клієнта збережено: режим {}, обрано клієнта: {}",
                 clientSelection.getMode(), clientSelection.hasSelectedClient());
    }

    /**
     * Завантажити дані вибору клієнта.
     */
    public ClientSelectionDTO loadClientSelection(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(CLIENT_SELECTION_KEY);
        if (data == null) {
            log.debug("Дані вибору клієнта не знайдено в контексті");
            return null;
        }

        try {
            if (data instanceof ClientSelectionDTO clientSelectionData) {
                return clientSelectionData;
            }
            return objectMapper.convertValue(data, ClientSelectionDTO.class);
        } catch (Exception e) {
            log.error("Помилка конвертації даних вибору клієнта: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * === ПІДЕТАП 1.2: БАЗОВА ІНФОРМАЦІЯ ЗАМОВЛЕННЯ ===
     */

    /**
     * Зберегти дані ініціалізації замовлення.
     */
    public void saveOrderInitialization(Map<String, Object> contextVariables, OrderInitializationDTO orderInit) {
        if (orderInit == null) {
            log.warn("Спроба збереження null даних ініціалізації замовлення");
            return;
        }

        contextVariables.put(ORDER_INIT_KEY, orderInit);

        log.debug("Дані ініціалізації замовлення збережено: квитанція {}, філія {}",
                 orderInit.getReceiptNumber(),
                 orderInit.getSelectedBranch() != null ? orderInit.getSelectedBranch().getCode() : "null");
    }

    /**
     * Завантажити дані ініціалізації замовлення.
     */
    public OrderInitializationDTO loadOrderInitialization(Map<String, Object> contextVariables) {
        Object data = contextVariables.get(ORDER_INIT_KEY);
        if (data == null) {
            log.debug("Дані ініціалізації замовлення не знайдено в контексті");
            return null;
        }

        try {
            if (data instanceof OrderInitializationDTO orderInitData) {
                return orderInitData;
            }
            return objectMapper.convertValue(data, OrderInitializationDTO.class);
        } catch (Exception e) {
            log.error("Помилка конвертації даних ініціалізації замовлення: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * === ВАЛІДАЦІЯ ЕТАПУ 1 ===
     */

    /**
     * Перевірити завершеність етапу 1.
     */
    public boolean isStage1Complete(Map<String, Object> contextVariables) {
        ClientSelectionDTO clientSelection = loadClientSelection(contextVariables);
        OrderInitializationDTO orderInit = loadOrderInitialization(contextVariables);

        boolean complete = clientSelection != null && clientSelection.hasSelectedClient() &&
                          orderInit != null && orderInit.hasReceiptNumber() &&
                          orderInit.hasSelectedBranch();

        log.debug("Перевірка завершеності етапу 1: {}", complete);
        return complete;
    }

    /**
     * Валідувати дані підетапу 1.1 (вибір клієнта).
     */
    public Stage1ValidationResult validateClientSelection(Map<String, Object> contextVariables) {
        ClientSelectionDTO clientSelection = loadClientSelection(contextVariables);

        if (clientSelection == null) {
            return new Stage1ValidationResult(false, "Дані вибору клієнта не знайдено", 0);
        }

        if (!clientSelection.hasSelectedClient()) {
            return new Stage1ValidationResult(false, "Клієнт не обраний", 25);
        }

        if (clientSelection.hasValidationIssues()) {
            return new Stage1ValidationResult(false, clientSelection.getValidationMessage(), 25);
        }

        return new Stage1ValidationResult(true, null, 50);
    }

    /**
     * Валідувати дані підетапу 1.2 (базова інформація).
     */
    public Stage1ValidationResult validateOrderInitialization(Map<String, Object> contextVariables) {
        OrderInitializationDTO orderInit = loadOrderInitialization(contextVariables);

        if (orderInit == null) {
            return new Stage1ValidationResult(false, "Дані ініціалізації замовлення не знайдено", 50);
        }

        if (!orderInit.hasReceiptNumber()) {
            return new Stage1ValidationResult(false, "Номер квитанції не згенеровано", 60);
        }

        if (!orderInit.hasSelectedBranch()) {
            return new Stage1ValidationResult(false, "Філія не обрана", 75);
        }

        if (orderInit.hasValidationIssues()) {
            return new Stage1ValidationResult(false, orderInit.getValidationMessage(), 75);
        }

        return new Stage1ValidationResult(true, null, 100);
    }

    /**
     * Загальна валідація етапу 1.
     */
    public Stage1ValidationResult validateStage1(Map<String, Object> contextVariables) {
        // Спочатку перевіряємо вибір клієнта
        Stage1ValidationResult clientValidation = validateClientSelection(contextVariables);
        if (!clientValidation.isValid()) {
            return clientValidation;
        }

        // Потім перевіряємо ініціалізацію замовлення
        return validateOrderInitialization(contextVariables);
    }

    /**
     * === ЗЛИВАННЯ ДАНИХ В ЕТАПІ 1 ===
     */

    /**
     * Злити дані з підетапу 1.1 в підетап 1.2.
     */
    public OrderInitializationDTO mergeClientSelectionToOrderInit(
            Map<String, Object> contextVariables,
            OrderInitializationDTO orderInit) {

        ClientSelectionDTO clientSelection = loadClientSelection(contextVariables);

        if (clientSelection == null || !clientSelection.hasSelectedClient()) {
            log.warn("Неможливо злити дані: клієнт не обраний");
            return orderInit;
        }

        if (orderInit == null) {
            orderInit = OrderInitializationDTO.builder().build();
        }

        // Переносимо дані клієнта
        orderInit.setSelectedClient(clientSelection.getSelectedClient());

        log.debug("Дані клієнта злиті в ініціалізацію замовлення: {}",
                 clientSelection.getSelectedClient().getFirstName() + " " +
                 clientSelection.getSelectedClient().getLastName());

        return orderInit;
    }

    /**
     * === ОЧИЩЕННЯ ДАНИХ ===
     */

    /**
     * Очистити всі дані етапу 1.
     */
    public void clearStage1Data(Map<String, Object> contextVariables) {
        contextVariables.remove(CLIENT_SELECTION_KEY);
        contextVariables.remove(ORDER_INIT_KEY);

        log.info("Дані етапу 1 очищено");
    }

    /**
     * Очистити тільки дані вибору клієнта (для повторного вибору).
     */
    public void clearClientSelection(Map<String, Object> contextVariables) {
        contextVariables.remove(CLIENT_SELECTION_KEY);

        log.info("Дані вибору клієнта очищено");
    }

    /**
     * === ДОПОМІЖНІ КЛАСИ ===
     */

    /**
     * Результат валідації даних етапу 1.
     */
    public record Stage1ValidationResult(
        boolean isValid,
        String errorMessage,
        int completionPercentage
    ) {}
}
