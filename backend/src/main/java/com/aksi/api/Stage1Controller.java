package com.aksi.api;

import java.util.UUID;

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
@Tag(name = "Stage 1 API", description = "API для Stage 1 - Клієнт та базова інформація замовлення")
public class Stage1Controller {

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
    }

    // =================== ПОШУК КЛІЄНТІВ ===================

    @Operation(summary = "Ініціалізує новий контекст пошуку клієнтів")
    @PostMapping("/client-search/initialize")
    public ResponseEntity<String> initializeClientSearch() {
        return clientSearchAdapter.initializeContext();
    }

    @Operation(summary = "Виконує пошук клієнтів з критеріями")
    @PostMapping("/client-search/session/{sessionId}/search")
    public ResponseEntity<ClientSearchResultDTO> searchClients(
            @PathVariable String sessionId,
            @RequestBody ClientSearchCriteriaDTO criteria) {
        return clientSearchAdapter.searchClients(sessionId, criteria);
    }

    @Operation(summary = "Пошук клієнтів за телефоном")
    @PostMapping("/client-search/session/{sessionId}/search-by-phone")
    public ResponseEntity<ClientSearchResultDTO> searchClientsByPhone(
            @PathVariable String sessionId,
            @RequestParam String phone) {
        return clientSearchAdapter.searchByPhone(sessionId, phone);
    }

    @Operation(summary = "Вибирає клієнта зі списку результатів")
    @PostMapping("/client-search/session/{sessionId}/select-client")
    public ResponseEntity<Void> selectClient(
            @PathVariable String sessionId,
            @RequestParam UUID clientId) {
        return clientSearchAdapter.selectClient(sessionId, clientId);
    }

    @Operation(summary = "Отримує обраного клієнта")
    @GetMapping("/client-search/session/{sessionId}/selected-client")
    public ResponseEntity<ClientResponse> getSelectedClient(@PathVariable String sessionId) {
        return clientSearchAdapter.getSelectedClient(sessionId);
    }

    @Operation(summary = "Отримує поточний стан пошуку")
    @GetMapping("/client-search/session/{sessionId}/state")
    public ResponseEntity<ClientSearchState> getClientSearchState(@PathVariable String sessionId) {
        return clientSearchAdapter.getCurrentState(sessionId);
    }

    @Operation(summary = "Очищує результати пошуку")
    @PostMapping("/client-search/session/{sessionId}/clear")
    public ResponseEntity<Void> clearClientSearch(@PathVariable String sessionId) {
        return clientSearchAdapter.clearSearch(sessionId);
    }

    @Operation(summary = "Завершує пошук клієнта")
    @PostMapping("/client-search/session/{sessionId}/complete")
    public ResponseEntity<Void> completeClientSearch(@PathVariable String sessionId) {
        return clientSearchAdapter.completeSearch(sessionId);
    }

    @Operation(summary = "Скасовує пошук клієнта")
    @DeleteMapping("/client-search/session/{sessionId}")
    public ResponseEntity<Void> cancelClientSearch(@PathVariable String sessionId) {
        return clientSearchAdapter.cancelSearch(sessionId);
    }

    // =================== СТВОРЕННЯ НОВОГО КЛІЄНТА ===================

    @Operation(summary = "Ініціалізує форму створення нового клієнта")
    @PostMapping("/new-client/initialize")
    public ResponseEntity<String> initializeNewClientForm() {
        return newClientFormAdapter.initializeContext();
    }

    @Operation(summary = "Оновлює дані форми клієнта")
    @PutMapping("/new-client/session/{sessionId}/data")
    public ResponseEntity<Void> updateNewClientData(
            @PathVariable String sessionId,
            @RequestBody NewClientFormDTO formData) {
        return newClientFormAdapter.updateFormData(sessionId, formData);
    }

    @Operation(summary = "Валідує форму клієнта")
    @PostMapping("/new-client/session/{sessionId}/validate")
    public ResponseEntity<?> validateNewClientForm(@PathVariable String sessionId) {
        return newClientFormAdapter.validateData(sessionId);
    }

    @Operation(summary = "Створює нового клієнта")
    @PostMapping("/new-client/session/{sessionId}/create")
    public ResponseEntity<ClientResponse> createNewClient(@PathVariable String sessionId) {
        return newClientFormAdapter.createClient(sessionId);
    }

    @Operation(summary = "Отримує поточний стан форми")
    @GetMapping("/new-client/session/{sessionId}/state")
    public ResponseEntity<NewClientFormState> getNewClientFormState(@PathVariable String sessionId) {
        return newClientFormAdapter.getCurrentState(sessionId);
    }

    @Operation(summary = "Отримує поточні дані форми")
    @GetMapping("/new-client/session/{sessionId}/data")
    public ResponseEntity<NewClientFormDTO> getCurrentNewClientForm(@PathVariable String sessionId) {
        return newClientFormAdapter.getCurrentData(sessionId);
    }

    @Operation(summary = "Завершує створення клієнта")
    @PostMapping("/new-client/session/{sessionId}/complete")
    public ResponseEntity<Void> completeNewClientCreation(@PathVariable String sessionId) {
        return newClientFormAdapter.completeForm(sessionId);
    }

    @Operation(summary = "Скасовує створення клієнта")
    @DeleteMapping("/new-client/session/{sessionId}")
    public ResponseEntity<Void> cancelNewClientCreation(@PathVariable String sessionId) {
        return newClientFormAdapter.cancelForm(sessionId);
    }

    // =================== БАЗОВА ІНФОРМАЦІЯ ЗАМОВЛЕННЯ ===================

    @Operation(summary = "Ініціалізує збір базової інформації замовлення")
    @PostMapping("/basic-order/initialize")
    public ResponseEntity<String> initializeBasicOrderInfo() {
        return basicOrderInfoAdapter.initializeContext();
    }

    @Operation(summary = "Починає workflow базової інформації")
    @PostMapping("/basic-order/workflow/start")
    public ResponseEntity<String> startBasicOrderWorkflow() {
        return basicOrderInfoAdapter.startWorkflow();
    }

    @Operation(summary = "Вибирає філію для замовлення")
    @PostMapping("/basic-order/session/{sessionId}/select-branch")
    public ResponseEntity<Void> selectBranch(
            @PathVariable String sessionId,
            @RequestParam UUID branchId) {
        return basicOrderInfoAdapter.selectBranch(sessionId, branchId);
    }

    @Operation(summary = "Генерує номер квитанції")
    @PostMapping("/basic-order/session/{sessionId}/generate-receipt-number")
    public ResponseEntity<String> generateReceiptNumber(
            @PathVariable String sessionId,
            @RequestParam String branchCode) {
        return basicOrderInfoAdapter.generateReceiptNumber(sessionId, branchCode);
    }

    @Operation(summary = "Встановлює унікальну мітку")
    @PostMapping("/basic-order/session/{sessionId}/set-unique-tag")
    public ResponseEntity<Void> setUniqueTag(
            @PathVariable String sessionId,
            @RequestParam String uniqueTag) {
        return basicOrderInfoAdapter.setUniqueTag(sessionId, uniqueTag);
    }

    @Operation(summary = "Валідує базову інформацію")
    @PostMapping("/basic-order/session/{sessionId}/validate")
    public ResponseEntity<?> validateBasicOrderInfo(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.validateData(sessionId);
    }

    @Operation(summary = "Отримує поточний стан базової інформації")
    @GetMapping("/basic-order/session/{sessionId}/state")
    public ResponseEntity<BasicOrderInfoState> getBasicOrderInfoState(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.getCurrentState(sessionId);
    }

    @Operation(summary = "Отримує поточну базову інформацію")
    @GetMapping("/basic-order/session/{sessionId}/data")
    public ResponseEntity<BasicOrderInfoDTO> getCurrentBasicOrderInfo(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.getCurrentData(sessionId);
    }

    @Operation(summary = "Оновлює базову інформацію")
    @PutMapping("/basic-order/session/{sessionId}/data")
    public ResponseEntity<Void> updateBasicOrderInfo(
            @PathVariable String sessionId,
            @RequestBody BasicOrderInfoDTO basicOrderInfo) {
        return basicOrderInfoAdapter.updateBasicOrderInfo(sessionId, basicOrderInfo);
    }

    @Operation(summary = "Завершує збір базової інформації")
    @PostMapping("/basic-order/session/{sessionId}/complete")
    public ResponseEntity<Void> completeBasicOrderInfo(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.completeWorkflow(sessionId);
    }

    @Operation(summary = "Скидає базову інформацію до початкового стану")
    @PostMapping("/basic-order/session/{sessionId}/reset")
    public ResponseEntity<Void> resetBasicOrderInfo(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.resetWorkflow(sessionId);
    }

    @Operation(summary = "Скасовує збір базової інформації")
    @DeleteMapping("/basic-order/session/{sessionId}")
    public ResponseEntity<Void> cancelBasicOrderInfo(@PathVariable String sessionId) {
        return basicOrderInfoAdapter.cancelWorkflow(sessionId);
    }
}
