package com.aksi.domain.order.statemachine.stage1.adapter;

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
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchResultDTO;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchCoordinationService;
import com.aksi.domain.order.statemachine.stage1.validator.ClientSearchValidationResult;

/**
 * REST адаптер для пошуку та вибору існуючих клієнтів.
 * Забезпечує HTTP API для роботи з пошуком клієнтів з підтримкою пагінації.
 *
 * Пагінація реалізована через ClientSearchCriteriaDTO:
 * - page: номер сторінки (з 0, по замовчуванню 0)
 * - size: розмір сторінки (по замовчуванню 10)
 *
 * Результати повертаються в ClientSearchResultDTO з метаданими пагінації:
 * - totalElements, totalPages, pageNumber, pageSize, hasPrevious, hasNext
 */
@RestController
@RequestMapping("/order-wizard/stage1/client-search")
public class ClientSearchAdapter {

    private final ClientSearchCoordinationService coordinationService;

    public ClientSearchAdapter(ClientSearchCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Ініціалізує новий контекст пошуку.
     */
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeContext() {
        String sessionId = coordinationService.startClientSearch();
        return ResponseEntity.ok(sessionId);
    }

    /**
     * Отримує поточний стан пошуку.
     */
    @GetMapping("/session/{sessionId}/state")
    public ResponseEntity<ClientSearchState> getCurrentState(@PathVariable String sessionId) {
        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ClientSearchState state = coordinationService.getCurrentState(sessionId);
        return ResponseEntity.ok(state);
    }

    /**
     * Отримує поточні критерії пошуку.
     */
    @GetMapping("/session/{sessionId}/criteria")
    public ResponseEntity<ClientSearchCriteriaDTO> getCurrentCriteria(@PathVariable String sessionId) {
        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        // Отримуємо критерії з контексту
        return ResponseEntity.ok(new ClientSearchCriteriaDTO());
    }

    /**
     * Оновлює критерії пошуку.
     */
    @PutMapping("/session/{sessionId}/criteria")
    public ResponseEntity<Void> updateCriteria(
            @PathVariable String sessionId,
            @RequestBody ClientSearchCriteriaDTO criteria) {

        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.saveSearchCriteria(sessionId, criteria);
        return ResponseEntity.ok().build();
    }

    /**
     * Виконує пошук клієнтів з критеріями з тіла запиту з підтримкою пагінації.
     * Параметри пагінації передаються в ClientSearchCriteriaDTO (page, size).
     */
    @PostMapping("/session/{sessionId}/search")
    public ResponseEntity<ClientSearchResultDTO> searchClients(
            @PathVariable String sessionId,
            @RequestBody ClientSearchCriteriaDTO criteria) {

        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ClientSearchResultDTO result = coordinationService.searchClients(sessionId, criteria);
        return ResponseEntity.ok(result);
    }

    /**
     * Виконує пошук за телефоном з використанням значень пагінації по замовчуванню.
     * Використовує page=0, size=10 (значення по замовчуванню з ClientSearchCriteriaDTO).
     */
    @PostMapping("/session/{sessionId}/search-by-phone")
    public ResponseEntity<ClientSearchResultDTO> searchByPhone(
            @PathVariable String sessionId,
            @RequestParam String phone) {

        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ClientSearchCriteriaDTO criteria = new ClientSearchCriteriaDTO();
        criteria.setPhone(phone);

        ClientSearchResultDTO result = coordinationService.searchClients(sessionId, criteria);
        return ResponseEntity.ok(result);
    }

    /**
     * Вибирає клієнта зі списку результатів.
     */
    @PostMapping("/session/{sessionId}/select-client")
    public ResponseEntity<Void> selectClient(
            @PathVariable String sessionId,
            @RequestParam UUID clientId) {

        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.selectClient(sessionId, clientId);
        return ResponseEntity.ok().build();
    }

    /**
     * Отримує обраного клієнта.
     */
    @GetMapping("/session/{sessionId}/selected-client")
    public ResponseEntity<ClientResponse> getSelectedClient(@PathVariable String sessionId) {
        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ClientResponse client = coordinationService.getSelectedClient(sessionId);
        if (client == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(client);
    }

    /**
     * Валідує критерії пошуку.
     */
    @PostMapping("/session/{sessionId}/validate")
    public ResponseEntity<ClientSearchValidationResult> validateCriteria(@PathVariable String sessionId) {
        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ClientSearchValidationResult result = coordinationService.validateCriteria(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Валідує критичні критерії пошуку.
     */
    @PostMapping("/session/{sessionId}/validate-critical")
    public ResponseEntity<ClientSearchValidationResult> validateCritical(@PathVariable String sessionId) {
        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ClientSearchValidationResult result = coordinationService.validateCritical(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Очищає результати пошуку.
     */
    @PostMapping("/session/{sessionId}/clear")
    public ResponseEntity<Void> clearSearch(@PathVariable String sessionId) {
        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.clearSearch(sessionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Завершує пошук клієнта.
     */
    @PostMapping("/session/{sessionId}/complete")
    public ResponseEntity<Void> completeSearch(@PathVariable String sessionId) {
        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.completeClientSearchWithValidation(sessionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Скасовує пошук клієнта.
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> cancelSearch(@PathVariable String sessionId) {
        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.cleanupSearchContext(sessionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Отримує звіт валідації.
     */
    @GetMapping("/session/{sessionId}/validation-report")
    public ResponseEntity<String> getValidationReport(@PathVariable String sessionId) {
        if (!coordinationService.searchContextExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        String report = coordinationService.getValidationReport(sessionId);
        return ResponseEntity.ok(report);
    }
}
