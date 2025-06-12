package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.adapter.BasicOrderInfoAdapter;
import com.aksi.domain.order.statemachine.stage1.adapter.ClientSearchAdapter;
import com.aksi.domain.order.statemachine.stage1.adapter.NewClientFormAdapter;
import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchResultDTO;
import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormState;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST API контроллер для Stage 1 - Клієнт та базова інформація замовлення.
 *
 * Відповідальність:
 * - Делегування запитів до окремих адаптерів Stage 1
 * - Координація між пошуком клієнтів, створенням нових клієнтів та базовою інформацією
 *
 * Принципи:
 * - Один файл = одна відповідальність (тільки Stage 1)
 * - Тонкий контроллер - тільки HTTP обробка та делегування
 * - Вся логіка винесена в окремі адаптери
 */
@RestController
@RequestMapping("/v1/order-wizard/stage1")
@Tag(name = "Order Wizard - Stage 1", description = "Етап 1: Клієнт та базова інформація замовлення")
public class Stage1Controller {

    private static final Logger logger = LoggerFactory.getLogger(Stage1Controller.class);

    private final ClientSearchAdapter clientSearchAdapter;
    private final NewClientFormAdapter newClientFormAdapter;
    private final BasicOrderInfoAdapter basicOrderInfoAdapter;

    public Stage1Controller(
            ClientSearchAdapter clientSearchAdapter,
            NewClientFormAdapter newClientFormAdapter,
            BasicOrderInfoAdapter basicOrderInfoAdapter) {

        this.clientSearchAdapter = clientSearchAdapter;
        this.newClientFormAdapter = newClientFormAdapter;
        this.basicOrderInfoAdapter = basicOrderInfoAdapter;

        logger.info("🚀 Stage1Controller ініціалізовано з адаптерами: clientSearch={}, newClientForm={}, basicOrderInfo={}",
                   clientSearchAdapter != null, newClientFormAdapter != null, basicOrderInfoAdapter != null);
    }

    // =================== ПОШУК КЛІЄНТІВ ===================

    @Operation(
        summary = "Ініціалізує новий контекст пошуку клієнтів",
        operationId = "stage1InitializeClientSearch",
        tags = {"Order Wizard - Stage 1", "Client Search"}
    )
    @PostMapping("/client-search/initialize")
    public ResponseEntity<String> initializeClientSearch() {
        return clientSearchAdapter.initializeContext();
    }

    @Operation(
        summary = "Виконує пошук клієнтів з критеріями",
        operationId = "stage1SearchClients",
        tags = {"Order Wizard - Stage 1", "Client Search"}
    )
    @PostMapping("/client-search/session/{sessionId}/search")
    public ResponseEntity<ClientSearchResultDTO> searchClients(
            @PathVariable String sessionId,
            @RequestBody ClientSearchCriteriaDTO criteria) {
        return clientSearchAdapter.searchClients(sessionId, criteria);
    }

    @Operation(
        summary = "Пошук клієнтів за телефоном",
        operationId = "stage1SearchClientsByPhone",
        tags = {"Order Wizard - Stage 1", "Client Search"}
    )
    @PostMapping("/client-search/session/{sessionId}/search-by-phone")
    public ResponseEntity<ClientSearchResultDTO> searchClientsByPhone(
            @PathVariable String sessionId,
            @RequestParam String phone) {
        return clientSearchAdapter.searchByPhone(sessionId, phone);
    }

    @Operation(
        summary = "Вибирає клієнта зі списку результатів",
        operationId = "stage1SelectClient",
        tags = {"Order Wizard - Stage 1", "Client Search"}
    )
    @PostMapping("/client-search/session/{sessionId}/select-client")
    public ResponseEntity<Void> selectClient(
            @PathVariable String sessionId,
            @RequestParam UUID clientId) {
        return clientSearchAdapter.selectClient(sessionId, clientId);
    }

    @Operation(
        summary = "Отримує обраного клієнта",
        operationId = "stage1GetSelectedClient",
        tags = {"Order Wizard - Stage 1", "Client Search"}
    )
    @GetMapping("/client-search/session/{sessionId}/selected-client")
    public ResponseEntity<ClientResponse> getSelectedClient(@PathVariable String sessionId) {
        return clientSearchAdapter.getSelectedClient(sessionId);
    }

    @Operation(
        summary = "Отримує поточний стан пошуку",
        operationId = "stage1GetClientSearchState",
        tags = {"Order Wizard - Stage 1", "Client Search"}
    )
    @GetMapping("/client-search/session/{sessionId}/state")
    public ResponseEntity<ClientSearchState> getClientSearchState(@PathVariable String sessionId) {
        logger.info("🔍 [CLIENT-SEARCH-STATE] Запит на отримання стану пошуку для sessionId: {}", sessionId);

        try {
            ResponseEntity<ClientSearchState> response = clientSearchAdapter.getClientSearchState(sessionId);
            logger.info("✅ [CLIENT-SEARCH-STATE] Успішно отримано стан: {} для sessionId: {}",
                       response.getBody(), sessionId);
            return response;
        } catch (Exception e) {
            logger.error("❌ [CLIENT-SEARCH-STATE] Помилка при отриманні стану для sessionId: {}, error: {}",
                        sessionId, e.getMessage(), e);
            throw e;
        }
    }

    @Operation(
        summary = "Очищує результати пошуку",
        operationId = "stage1ClearClientSearch",
        tags = {"Order Wizard - Stage 1", "Client Search"}
    )
    @PostMapping("/client-search/session/{sessionId}/clear")
    public ResponseEntity<Void> clearClientSearch(@PathVariable String sessionId) {
        return clientSearchAdapter.clearSearch(sessionId);
    }

    @Operation(
        summary = "Завершує пошук клієнта",
        operationId = "stage1CompleteClientSearch",
        tags = {"Order Wizard - Stage 1", "Client Search"}
    )
    @PostMapping("/client-search/session/{sessionId}/complete")
    public ResponseEntity<Void> completeClientSearch(@PathVariable String sessionId) {
        return clientSearchAdapter.completeSearch(sessionId);
    }

    @Operation(
        summary = "Скасовує пошук клієнта",
        operationId = "stage1CancelClientSearch",
        tags = {"Order Wizard - Stage 1", "Client Search"}
    )
    @DeleteMapping("/client-search/session/{sessionId}")
    public ResponseEntity<Void> cancelClientSearch(@PathVariable String sessionId) {
        return clientSearchAdapter.cancelSearch(sessionId);
    }

    // =================== СТВОРЕННЯ НОВОГО КЛІЄНТА ===================

    @Operation(
        summary = "Ініціалізує форму створення нового клієнта",
        operationId = "stage1InitializeNewClient",
        tags = {"Order Wizard - Stage 1", "Client Creation"}
    )
    @PostMapping("/new-client/initialize")
    public ResponseEntity<String> initializeNewClientForm() {
        return newClientFormAdapter.initializeContext();
    }

    @Operation(
        summary = "Оновлює дані форми клієнта",
        operationId = "stage1UpdateClientData",
        tags = {"Order Wizard - Stage 1", "Client Creation"}
    )
    @PutMapping("/new-client/session/{sessionId}/data")
    public ResponseEntity<Void> updateNewClientData(
            @PathVariable String sessionId,
            @RequestBody NewClientFormDTO formData) {
        return newClientFormAdapter.updateFormData(sessionId, formData);
    }

    @Operation(
        summary = "Валідує форму клієнта",
        operationId = "stage1ValidateClientForm",
        tags = {"Order Wizard - Stage 1", "Client Creation"}
    )
    @PostMapping("/new-client/session/{sessionId}/validate")
    public ResponseEntity<?> validateNewClientForm(@PathVariable String sessionId) {
        return newClientFormAdapter.validateData(sessionId);
    }

    @Operation(
        summary = "Створює нового клієнта",
        operationId = "stage1CreateClient",
        tags = {"Order Wizard - Stage 1", "Client Creation"}
    )
    @PostMapping("/new-client/session/{sessionId}/create")
    public ResponseEntity<ClientResponse> createNewClient(@PathVariable String sessionId) {
        return newClientFormAdapter.createClient(sessionId);
    }

    @Operation(
        summary = "Отримує поточний стан форми",
        operationId = "stage1GetClientFormState",
        tags = {"Order Wizard - Stage 1", "Client Creation"}
    )
    @GetMapping("/new-client/session/{sessionId}/state")
    public ResponseEntity<NewClientFormState> getNewClientFormState(@PathVariable String sessionId) {
        return newClientFormAdapter.getCurrentState(sessionId);
    }

    @Operation(
        summary = "Отримує поточні дані форми",
        operationId = "stage1GetClientFormData",
        tags = {"Order Wizard - Stage 1", "Client Creation"}
    )
    @GetMapping("/new-client/session/{sessionId}/data")
    public ResponseEntity<NewClientFormDTO> getCurrentNewClientForm(@PathVariable String sessionId) {
        return newClientFormAdapter.getCurrentData(sessionId);
    }

    @Operation(
        summary = "Завершує створення клієнта",
        operationId = "stage1CompleteClientCreation",
        tags = {"Order Wizard - Stage 1", "Client Creation"}
    )
    @PostMapping("/new-client/session/{sessionId}/complete")
    public ResponseEntity<Void> completeNewClientCreation(@PathVariable String sessionId) {
        return newClientFormAdapter.completeForm(sessionId);
    }

    @Operation(
        summary = "Скасовує створення клієнта",
        operationId = "stage1CancelClientCreation",
        tags = {"Order Wizard - Stage 1", "Client Creation"}
    )
    @DeleteMapping("/new-client/session/{sessionId}")
    public ResponseEntity<Void> cancelNewClientCreation(@PathVariable String sessionId) {
        return newClientFormAdapter.cancelForm(sessionId);
    }

    // =================== БАЗОВА ІНФОРМАЦІЯ ЗАМОВЛЕННЯ ===================

    @Operation(
        summary = "Ініціалізує збір базової інформації замовлення",
        operationId = "stage1InitializeBasicOrder",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @PostMapping("/basic-order/initialize")
    public ResponseEntity<String> initializeBasicOrderInfo() {
        return basicOrderInfoAdapter.initializeContext();
    }

    @Operation(
        summary = "Починає workflow базової інформації",
        operationId = "stage1StartBasicOrderWorkflow",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @PostMapping("/basic-order/workflow/start")
    public ResponseEntity<String> startBasicOrderWorkflow() {
        return basicOrderInfoAdapter.startWorkflow();
    }

    @Operation(
        summary = "Вибирає філію для замовлення",
        operationId = "stage1SelectBranch",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @PostMapping("/basic-order/session/{sessionId}/select-branch")
    public ResponseEntity<Void> selectBranch(
            @PathVariable String sessionId,
            @RequestParam UUID branchId) {
        return basicOrderInfoAdapter.selectBranch(sessionId, branchId);
    }

    @Operation(
        summary = "Генерує номер квитанції",
        operationId = "stage1GenerateReceiptNumber",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @PostMapping("/basic-order/session/{sessionId}/generate-receipt-number")
    public ResponseEntity<String> generateReceiptNumber(
            @PathVariable String sessionId,
            @RequestParam String branchCode) {
        return basicOrderInfoAdapter.generateReceiptNumber(sessionId, branchCode);
    }

    @Operation(
        summary = "Встановлює унікальну мітку",
        operationId = "stage1SetUniqueTag",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @PostMapping("/basic-order/session/{sessionId}/set-unique-tag")
    public ResponseEntity<Void> setUniqueTag(
            @PathVariable String sessionId,
            @RequestParam String uniqueTag) {
        return basicOrderInfoAdapter.setUniqueTag(sessionId, uniqueTag);
    }

    @Operation(
        summary = "Валідує базову інформацію",
        operationId = "stage1ValidateBasicOrder",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @PostMapping("/basic-order/session/{sessionId}/validate")
    public ResponseEntity<?> validateBasicOrderInfo(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.validateData(sessionId);
    }

    @Operation(
        summary = "Отримує поточний стан базової інформації",
        operationId = "stage1GetBasicOrderState",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @GetMapping("/basic-order/session/{sessionId}/state")
    public ResponseEntity<BasicOrderInfoState> getBasicOrderInfoState(@PathVariable String sessionId) {
        logger.info("🔍 [BASIC-ORDER-STATE] Запит на отримання стану базової інформації для sessionId: {}", sessionId);

        try {
            ResponseEntity<BasicOrderInfoState> response = basicOrderInfoAdapter.getBasicOrderInfoState(sessionId);
            logger.info("✅ [BASIC-ORDER-STATE] Успішно отримано стан: {} для sessionId: {}",
                       response.getBody(), sessionId);
            return response;
        } catch (Exception e) {
            logger.error("❌ [BASIC-ORDER-STATE] Помилка при отриманні стану для sessionId: {}, error: {}",
                        sessionId, e.getMessage(), e);
            throw e;
        }
    }

    @Operation(
        summary = "Отримує поточну базову інформацію",
        operationId = "stage1GetBasicOrderData",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @GetMapping("/basic-order/session/{sessionId}/data")
    public ResponseEntity<BasicOrderInfoDTO> getCurrentBasicOrderInfo(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.getCurrentData(sessionId);
    }

    @Operation(
        summary = "Оновлює базову інформацію",
        operationId = "stage1UpdateBasicOrder",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @PutMapping("/basic-order/session/{sessionId}/data")
    public ResponseEntity<Void> updateBasicOrderInfo(
            @PathVariable String sessionId,
            @RequestBody BasicOrderInfoDTO basicOrderInfo) {
        return basicOrderInfoAdapter.updateBasicOrderInfo(sessionId, basicOrderInfo);
    }

    @Operation(
        summary = "Завершує збір базової інформації",
        operationId = "stage1CompleteBasicOrder",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @PostMapping("/basic-order/session/{sessionId}/complete")
    public ResponseEntity<Void> completeBasicOrderInfo(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.completeWorkflow(sessionId);
    }

    @Operation(
        summary = "Скидає базову інформацію до початкового стану",
        operationId = "stage1ResetBasicOrder",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @PostMapping("/basic-order/session/{sessionId}/reset")
    public ResponseEntity<Void> resetBasicOrderInfo(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.resetWorkflow(sessionId);
    }

    @Operation(
        summary = "Скасовує збір базової інформації",
        operationId = "stage1CancelBasicOrder",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @DeleteMapping("/basic-order/session/{sessionId}")
    public ResponseEntity<Void> cancelBasicOrderInfo(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.cancelWorkflow(sessionId);
    }

    @Operation(
        summary = "Отримує філії для конкретної сесії",
        operationId = "stage1GetBranchesForSession",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @GetMapping("/basic-order/session/{sessionId}/branches")
    public ResponseEntity<List<BranchLocationDTO>> getAvailableBranches(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.getAvailableBranches(sessionId);
    }

    @Operation(
        summary = "Перевіряє чи філії завантажені для сесії",
        operationId = "stage1AreBranchesLoaded",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @GetMapping("/basic-order/session/{sessionId}/branches/loaded")
    public ResponseEntity<Boolean> areBranchesLoaded(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.areBranchesLoaded(sessionId);
    }

    @Operation(
        summary = "Очищує помилки для сесії",
        operationId = "stage1ClearBasicOrderErrors",
        tags = {"Order Wizard - Stage 1", "Basic Order Info"}
    )
    @PostMapping("/basic-order/session/{sessionId}/clear-errors")
    public ResponseEntity<Void> clearErrors(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.clearErrors(sessionId);
    }
}
