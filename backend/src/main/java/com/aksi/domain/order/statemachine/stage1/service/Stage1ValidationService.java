package com.aksi.domain.order.statemachine.stage1.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.dto.OrderInitializationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Консолідований сервіс валідації для всього першого етапу Order Wizard.
 *
 * Етап: 1 (загальний) - валідація
 * Підетапи: 1.1 (вибір клієнта), 1.2 (базова інформація замовлення)
 *
 * Відповідальності:
 * - Валідація підетапу 1.1 (вибір клієнта)
 * - Валідація підетапу 1.2 (базова інформація замовлення)
 * - Валідація готовності до переходу між підетапами
 * - Валідація завершення всього етапу 1
 * - Перевірка цілісності даних
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Stage1ValidationService {

    private final Stage1StateService stateService;

    // ========== Підетап 1.1: Валідація вибору клієнта ==========

    /**
     * Валідує завершення підетапу 1.1 "Вибір клієнта".
     *
     * @param context Контекст State Machine
     * @return true якщо підетап можна завершити, false якщо ні
     */
    public boolean validateClientSelectionCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("Валідація завершення підетапу 1.1 (вибір клієнта)");

        try {
            // Перевіряємо наявність вибраного клієнта
            Object finalClientObj = context.getExtendedState().getVariables().get("finalSelectedClient");

            if (!(finalClientObj instanceof ClientResponse)) {
                log.warn("Вибраний клієнт відсутній або має неправильний тип");
                return false;
            }

            ClientResponse client = (ClientResponse) finalClientObj;
            List<String> errors = validateClientData(client);

            if (!errors.isEmpty()) {
                log.warn("Валідація клієнта не пройшла: {}", String.join(", ", errors));
                return false;
            }

            log.debug("Валідація підетапу 1.1 пройшла успішно");
            return true;

        } catch (Exception e) {
            log.error("Помилка при валідації підетапу 1.1: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Перевіряє чи може користувач перейти до наступного кроку в рамках підетапу 1.1.
     */
    public boolean canProceedToNextInClientSelection(StateContext<OrderState, OrderEvent> context) {
        ClientSelectionDTO dto = stateService.getOrCreateClientSelectionDTO(context);

        switch (dto.getMode()) {
            case SEARCH_EXISTING:
                // При пошуку потрібно мати вибраного клієнта
                Object selectedClient = context.getExtendedState().getVariables().get("selectedClient");
                return selectedClient instanceof ClientResponse;

            case CREATE_NEW:
                // При створенні нового потрібно заповнити обов'язкові поля
                return dto.getNewClientData() != null &&
                       validateMinimalClientData(dto.getNewClientData());

            default:
                return false;
        }
    }

    // ========== Підетап 1.2: Валідація базової інформації замовлення ==========

    /**
     * Валідує завершення підетапу 1.2 "Базова інформація замовлення".
     *
     * @param context Контекст State Machine
     * @return true якщо підетап можна завершити, false якщо ні
     */
    public boolean validateOrderInitializationCompletion(StateContext<OrderState, OrderEvent> context) {
        log.debug("Валідація завершення підетапу 1.2 (базова інформація замовлення)");

        try {
            OrderInitializationDTO dto = stateService.getOrCreateOrderInitializationDTO(context);
            List<String> errors = validateOrderInitializationData(dto, context);

            if (!errors.isEmpty()) {
                log.warn("Валідація підетапу 1.2 не пройшла: {}", String.join(", ", errors));
                return false;
            }

            log.debug("Валідація підетапу 1.2 пройшла успішно");
            return true;

        } catch (Exception e) {
            log.error("Помилка при валідації підетапу 1.2: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Перевіряє чи може користувач перейти до наступного кроку в рамках підетапу 1.2.
     */
    public boolean canProceedToNextInOrderInitialization(StateContext<OrderState, OrderEvent> context) {
        OrderInitializationDTO dto = stateService.getOrCreateOrderInitializationDTO(context);

        // Перевіряємо обов'язкові поля
        return StringUtils.hasText(dto.getReceiptNumber()) &&
               StringUtils.hasText(dto.getUniqueTag()) &&
               dto.getSelectedBranch() != null &&
               dto.getOrderCreationTime() != null;
    }

    // ========== Валідація всього етапу 1 ==========

    /**
     * Валідує завершення всього етапу 1.
     *
     * @param context Контекст State Machine
     * @return true якщо етап можна завершити, false якщо ні
     */
    public boolean validateStage1Completion(StateContext<OrderState, OrderEvent> context) {
        log.debug("Валідація завершення етапу 1");

        try {
            // Перевіряємо завершення обох підетапів
            boolean clientSelectionValid = validateClientSelectionCompletion(context);
            boolean orderInitializationValid = validateOrderInitializationCompletion(context);

            if (!clientSelectionValid || !orderInitializationValid) {
                log.warn("Валідація етапу 1 не пройшла. Клієнт: {}, Замовлення: {}",
                         clientSelectionValid, orderInitializationValid);
                return false;
            }

            // Додаткова валідація цілісності даних
            boolean integrityValid = validateStage1DataIntegrity(context);
            if (!integrityValid) {
                log.warn("Валідація цілісності даних етапу 1 не пройшла");
                return false;
            }

            log.debug("Валідація етапу 1 пройшла успішно");
            return true;

        } catch (Exception e) {
            log.error("Помилка при валідації етапу 1: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Перевіряє цілісність даних між підетапами 1.1 та 1.2.
     */
    public boolean validateStage1DataIntegrity(StateContext<OrderState, OrderEvent> context) {
        log.debug("Перевірка цілісності даних етапу 1");

        try {
            // Перевіряємо узгодженість клієнта між підетапами
            Object finalClient = context.getExtendedState().getVariables().get("finalSelectedClient");
            OrderInitializationDTO orderDto = stateService.getOrCreateOrderInitializationDTO(context);

            if (!(finalClient instanceof ClientResponse)) {
                log.warn("Фінальний клієнт відсутній");
                return false;
            }

            if (orderDto.getSelectedClient() == null) {
                log.warn("Клієнт в DTO замовлення відсутній");
                return false;
            }

            ClientResponse finalClientResp = (ClientResponse) finalClient;
            if (!finalClientResp.getId().equals(orderDto.getSelectedClient().getId())) {
                log.warn("Невідповідність ID клієнта між підетапами");
                return false;
            }

            log.debug("Перевірка цілісності даних етапу 1 пройшла успішно");
            return true;

        } catch (Exception e) {
            log.error("Помилка при перевірці цілісності даних: {}", e.getMessage());
            return false;
        }
    }

    // ========== Допоміжні методи валідації ==========

    /**
     * Валідує дані клієнта.
     */
    private List<String> validateClientData(ClientResponse client) {
        List<String> errors = new ArrayList<>();

        if (client.getId() == null) {
            errors.add("ID клієнта відсутній");
        }

        if (!StringUtils.hasText(client.getLastName())) {
            errors.add("Прізвище клієнта обов'язкове");
        }

        if (!StringUtils.hasText(client.getFirstName())) {
            errors.add("Ім'я клієнта обов'язкове");
        }

        if (!StringUtils.hasText(client.getPhone())) {
            errors.add("Телефон клієнта обов'язковий");
        }

        return errors;
    }

    /**
     * Мінімальна валідація даних клієнта для перевірки можливості продовження.
     */
    private boolean validateMinimalClientData(ClientResponse client) {
        return client != null &&
               StringUtils.hasText(client.getLastName()) &&
               StringUtils.hasText(client.getFirstName()) &&
               StringUtils.hasText(client.getPhone());
    }

    /**
     * Валідує дані ініціалізації замовлення.
     */
    private List<String> validateOrderInitializationData(OrderInitializationDTO dto, StateContext<OrderState, OrderEvent> context) {
        List<String> errors = new ArrayList<>();

        if (!StringUtils.hasText(dto.getReceiptNumber())) {
            errors.add("Номер квитанції обов'язковий");
        }

        if (!StringUtils.hasText(dto.getUniqueTag())) {
            errors.add("Унікальна мітка обов'язкова");
        }

        if (dto.getSelectedBranch() == null) {
            errors.add("Філія повинна бути обрана");
        } else {
            // Перевіряємо чи філія активна та доступна
            BranchLocationDTO branch = dto.getSelectedBranch();
            if (branch.getId() == null) {
                errors.add("ID філії відсутній");
            }
        }

        if (dto.getOrderCreationTime() == null) {
            errors.add("Час створення замовлення відсутній");
        }

        // Перевіряємо чи клієнт присутній
        if (dto.getSelectedClient() == null) {
            errors.add("Інформація про клієнта відсутня");
        }

        return errors;
    }
}
