package com.aksi.domain.order.statemachine.stage1.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.statemachine.StateContext;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.service.BranchLocationService;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.service.ClientService;
import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.dto.OrderInitializationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс бізнес-операцій для першого етапу Order Wizard.
 *
 * Етап: 1 (загальний) - бізнес-операції
 * Підетапи: 1.1 (вибір клієнта), 1.2 (базова інформація замовлення)
 *
 * Відповідальності:
 * - Пошук існуючих клієнтів
 * - Створення нових клієнтів
 * - Генерація номерів квитанцій
 * - Робота з філіями
 * - Інтеграція з доменними сервісами
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Stage1OperationsService {

    private final ClientService clientService;
    private final BranchLocationService branchLocationService;
    private final Stage1StateService stateService;

    // ========== Підетап 1.1: Операції з клієнтами ==========

    /**
     * Здійснює пошук клієнтів за заданим терміном.
     */
    public List<ClientResponse> searchClients(String searchTerm, StateContext<OrderState, OrderEvent> context) {
        log.debug("Пошук клієнтів за терміном: {}", searchTerm);

        try {
            if (!StringUtils.hasText(searchTerm)) {
                log.debug("Термін пошуку порожній, повертаємо порожній список");
                return List.of();
            }

            // Пошук через доменний сервіс
            List<ClientResponse> results = clientService.searchClients(searchTerm);

            // Оновлюємо DTO з результатами
            ClientSelectionDTO dto = stateService.getOrCreateClientSelectionDTO(context);
            dto.setSearchQuery(searchTerm);
            dto.setTotalResultsCount(results.size());
            dto.setCanProceedToNext(!results.isEmpty());
            stateService.updateClientSelectionDTO(context, dto);

            log.debug("Знайдено {} клієнтів за терміном: {}", results.size(), searchTerm);
            return results;

        } catch (Exception e) {
            log.error("Помилка при пошуку клієнтів: {}", e.getMessage());
            return List.of();
        }
    }

    /**
     * Вибирає клієнта зі списку знайдених.
     */
    public void selectExistingClient(UUID clientId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Вибір існуючого клієнта з ID: {}", clientId);

        try {
            // Завантажуємо повні дані клієнта
            ClientResponse client = clientService.getClientById(clientId);

            // Зберігаємо вибраного клієнта
            context.getExtendedState().getVariables().put("selectedClient", client);
            context.getExtendedState().getVariables().put("selectedClientId", clientId);

            // Оновлюємо DTO
            ClientSelectionDTO dto = stateService.getOrCreateClientSelectionDTO(context);
            dto.setSelectedClient(client);
            dto.setCanProceedToNext(true);
            stateService.updateClientSelectionDTO(context, dto);

            log.debug("Клієнта {} {} вибрано", client.getFirstName(), client.getLastName());

        } catch (Exception e) {
            log.error("Помилка при виборі клієнта: {}", e.getMessage());
        }
    }

    /**
     * Створює нового клієнта.
     */
    public ClientResponse createNewClient(CreateClientRequest request, StateContext<OrderState, OrderEvent> context) {
        log.debug("Створення нового клієнта: {} {}", request.getFirstName(), request.getLastName());

        try {
            // Створюємо клієнта через доменний сервіс
            ClientResponse newClient = clientService.createClient(request);

            // Зберігаємо створеного клієнта як вибраного
            context.getExtendedState().getVariables().put("selectedClient", newClient);
            context.getExtendedState().getVariables().put("selectedClientId", newClient.getId());

            // Оновлюємо DTO
            ClientSelectionDTO dto = stateService.getOrCreateClientSelectionDTO(context);
            dto.setSelectedClient(newClient);
            dto.setNewClientData(newClient);
            dto.setCanProceedToNext(true);
            stateService.updateClientSelectionDTO(context, dto);

            log.debug("Нового клієнта створено з ID: {}", newClient.getId());
            return newClient;

        } catch (Exception e) {
            log.error("Помилка при створенні клієнта: {}", e.getMessage());
            throw new RuntimeException("Не вдалося створити клієнта: " + e.getMessage());
        }
    }

    /**
     * Переключає режим підетапу 1.1 на створення нового клієнта.
     */
    public void switchToCreateNewClientMode(StateContext<OrderState, OrderEvent> context) {
        log.debug("Переключення на режим створення нового клієнта");

        ClientSelectionDTO dto = stateService.getOrCreateClientSelectionDTO(context);
        dto.setMode(ClientSelectionDTO.ClientSelectionMode.CREATE_NEW);
        dto.setCanProceedToNext(false);

        // Очищаємо попередні результати пошуку
        dto.setSearchResults(null);
        dto.setSelectedClient(null);

        stateService.updateClientSelectionDTO(context, dto);

        // Очищаємо контекст від попереднього вибору
        context.getExtendedState().getVariables().remove("selectedClient");
        context.getExtendedState().getVariables().remove("selectedClientId");
    }

    /**
     * Переключає режим підетапу 1.1 на пошук існуючого клієнта.
     */
    public void switchToSearchExistingMode(StateContext<OrderState, OrderEvent> context) {
        log.debug("Переключення на режим пошуку існуючого клієнта");

        ClientSelectionDTO dto = stateService.getOrCreateClientSelectionDTO(context);
        dto.setMode(ClientSelectionDTO.ClientSelectionMode.SEARCH_EXISTING);
        dto.setCanProceedToNext(false);

        // Очищаємо дані нового клієнта
        dto.setNewClientData(null);
        dto.setSelectedClient(null);

        stateService.updateClientSelectionDTO(context, dto);

        // Очищаємо контекст від попереднього вибору
        context.getExtendedState().getVariables().remove("selectedClient");
        context.getExtendedState().getVariables().remove("selectedClientId");
    }

    /**
     * Завершує вибір клієнта та зберігає фінальний результат.
     */
    public void finalizeClientSelection(StateContext<OrderState, OrderEvent> context) {
        log.debug("Завершення вибору клієнта");

        Object selectedClientObj = context.getExtendedState().getVariables().get("selectedClient");

        if (selectedClientObj instanceof ClientResponse) {
            ClientResponse client = (ClientResponse) selectedClientObj;
            context.getExtendedState().getVariables().put("finalSelectedClient", client);
            log.debug("Фінальний клієнт збережено: {} {}", client.getFirstName(), client.getLastName());
        } else {
            log.warn("Не вдалося завершити вибір клієнта - клієнт не знайдено");
        }
    }

    // ========== Підетап 1.2: Операції з базовою інформацією замовлення ==========

    /**
     * Вибирає філію для замовлення.
     */
    public void selectBranch(UUID branchId, StateContext<OrderState, OrderEvent> context) {
        log.debug("Вибір філії з ID: {}", branchId);

        try {
            BranchLocationDTO branch = branchLocationService.getBranchLocationById(branchId);

            // Зберігаємо вибрану філію
            context.getExtendedState().getVariables().put("selectedBranch", branch);
            context.getExtendedState().getVariables().put("selectedBranchId", branchId);

            // Оновлюємо DTO
            OrderInitializationDTO dto = stateService.getOrCreateOrderInitializationDTO(context);
            dto.setSelectedBranch(branch);
            stateService.updateOrderInitializationDTO(context, dto);

            log.debug("Філію '{}' вибрано", branch.getName());

        } catch (Exception e) {
            log.error("Помилка при виборі філії: {}", e.getMessage());
        }
    }

    /**
     * Встановлює унікальну мітку замовлення.
     */
    public void setUniqueTag(String uniqueTag, StateContext<OrderState, OrderEvent> context) {
        log.debug("Встановлення унікальної мітки: {}", uniqueTag);

        if (!StringUtils.hasText(uniqueTag)) {
            log.warn("Унікальна мітка порожня");
            return;
        }

        // Зберігаємо унікальну мітку
        context.getExtendedState().getVariables().put("uniqueTag", uniqueTag);

        // Оновлюємо DTO
        OrderInitializationDTO dto = stateService.getOrCreateOrderInitializationDTO(context);
        dto.setUniqueTag(uniqueTag);
        stateService.updateOrderInitializationDTO(context, dto);

        log.debug("Унікальну мітку встановлено: {}", uniqueTag);
    }

    /**
     * Генерує та встановлює номер квитанції.
     */
    public String generateAndSetReceiptNumber(StateContext<OrderState, OrderEvent> context) {
        log.debug("Генерація номера квитанції");

        try {
            String receiptNumber = generateReceiptNumber();

            // Зберігаємо номер квитанції
            context.getExtendedState().getVariables().put("receiptNumber", receiptNumber);

            // Оновлюємо DTO
            OrderInitializationDTO dto = stateService.getOrCreateOrderInitializationDTO(context);
            dto.setReceiptNumber(receiptNumber);
            stateService.updateOrderInitializationDTO(context, dto);

            log.debug("Номер квитанції згенеровано: {}", receiptNumber);
            return receiptNumber;

        } catch (Exception e) {
            log.error("Помилка при генерації номера квитанції: {}", e.getMessage());
            throw new RuntimeException("Не вдалося згенерувати номер квитанції");
        }
    }

    /**
     * Перегенеровує номер квитанції.
     */
    public String regenerateReceiptNumber(StateContext<OrderState, OrderEvent> context) {
        log.debug("Перегенерація номера квитанції");
        return generateAndSetReceiptNumber(context);
    }

    /**
     * Завершує ініціалізацію базової інформації замовлення.
     */
    public void finalizeOrderInitialization(StateContext<OrderState, OrderEvent> context) {
        log.debug("Завершення ініціалізації базової інформації замовлення");

        try {
            // Зберігаємо фінальні дані
            Object receiptNumber = context.getExtendedState().getVariables().get("receiptNumber");
            Object uniqueTag = context.getExtendedState().getVariables().get("uniqueTag");
            Object selectedBranch = context.getExtendedState().getVariables().get("selectedBranch");
            LocalDateTime orderCreationTime = LocalDateTime.now();

            context.getExtendedState().getVariables().put("finalReceiptNumber", receiptNumber);
            context.getExtendedState().getVariables().put("finalUniqueTag", uniqueTag);
            context.getExtendedState().getVariables().put("finalBranch", selectedBranch);
            context.getExtendedState().getVariables().put("finalOrderCreationTime", orderCreationTime);

            log.debug("Ініціалізацію базової інформації замовлення завершено");

        } catch (Exception e) {
            log.error("Помилка при завершенні ініціалізації замовлення: {}", e.getMessage());
        }
    }

    // ========== Допоміжні методи ==========

    /**
     * Генерує унікальний номер квитанції.
     */
    private String generateReceiptNumber() {
        // Формат: YYYYMMDD-XXXX (де XXXX - випадкове 4-значне число)
        LocalDateTime now = LocalDateTime.now();
        String datePart = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomPart = ThreadLocalRandom.current().nextInt(1000, 9999);

        return datePart + "-" + randomPart;
    }
}
