package com.aksi.domain.order.statemachine.stage1.adapter;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.service.Stage1CoordinationService;
import com.aksi.domain.order.statemachine.stage1.service.Stage1StateService.Stage1Context;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * REST API адаптер для Stage1 State Machine.
 */
@RestController
@RequestMapping("/order-wizard/stage1")
public class Stage1StateMachineAdapter {

    private final Stage1CoordinationService coordinationService;

    public Stage1StateMachineAdapter(Stage1CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Ініціалізація нової сесії Stage1.
     */
    @PostMapping("/session")
    public ResponseEntity<String> initializeSession() {
        String sessionId = coordinationService.initializeSession();
        return ResponseEntity.ok(sessionId);
    }

    /**
     * Отримання контексту сесії.
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<Stage1Context> getSession(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }
        Stage1Context context = coordinationService.getSession(sessionId);
        return ResponseEntity.ok(context);
    }

    /**
     * Пошук клієнтів.
     */
    @GetMapping("/clients/search")
    public ResponseEntity<List<ClientResponse>> searchClients(@RequestParam String searchTerm) {
        List<ClientResponse> clients = coordinationService.searchClients(searchTerm);
        return ResponseEntity.ok(clients);
    }

    /**
     * Отримання клієнта за ID.
     */
    @GetMapping("/clients/{clientId}")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable UUID clientId) {
        if (!coordinationService.clientExists(clientId)) {
            return ResponseEntity.notFound().build();
        }
        ClientResponse client = coordinationService.getClientById(clientId);
        return ResponseEntity.ok(client);
    }

    /**
     * Створення нового клієнта.
     */
    @PostMapping("/clients")
    public ResponseEntity<ClientResponse> createClient(@RequestBody CreateClientRequest request) {
        ClientResponse client = coordinationService.createClient(request);
        return ResponseEntity.ok(client);
    }

    /**
     * Встановлення вибору клієнта в сесію.
     */
    @PostMapping("/session/{sessionId}/client-selection")
    public ResponseEntity<ValidationResult> setClientSelection(
            @PathVariable String sessionId,
            @RequestBody ClientSelectionDTO clientSelection) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        ValidationResult validation = coordinationService.validateClientSelection(clientSelection);
        if (!validation.isValid()) {
            return ResponseEntity.badRequest().body(validation);
        }

        coordinationService.setClientSelectionInSession(sessionId, clientSelection);
        return ResponseEntity.ok(validation);
    }

    /**
     * Перевірка готовності вибору клієнта.
     */
    @GetMapping("/session/{sessionId}/client-selection/ready")
    public ResponseEntity<Boolean> isClientSelectionReady(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        Stage1Context context = coordinationService.getSession(sessionId);
        boolean ready = coordinationService.isClientSelectionReady(context.getClientSelection());
        return ResponseEntity.ok(ready);
    }

    /**
     * Завершення Stage1.
     */
    @PostMapping("/session/{sessionId}/complete")
    public ResponseEntity<String> completeStage1(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        Stage1Context context = coordinationService.getSession(sessionId);
        if (!coordinationService.isStage1Ready(context.getClientSelection())) {
            return ResponseEntity.badRequest().body("Stage1 не готовий до завершення");
        }

        coordinationService.completeSession(sessionId);
        return ResponseEntity.ok("Stage1 завершено успішно");
    }
}
