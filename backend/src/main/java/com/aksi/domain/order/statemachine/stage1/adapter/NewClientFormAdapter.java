package com.aksi.domain.order.statemachine.stage1.adapter;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.enums.NewClientFormState;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormCoordinationService;
import com.aksi.domain.order.statemachine.stage1.validator.NewClientFormValidationResult;

/**
 * REST адаптер для форми нового клієнта.
 * Забезпечує HTTP API для роботи з формою створення нового клієнта.
 */
@RestController
@RequestMapping("/order-wizard/stage1/new-client-form")
public class NewClientFormAdapter {

    private final NewClientFormCoordinationService coordinationService;

    public NewClientFormAdapter(NewClientFormCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Ініціалізує новий контекст форми.
     */
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeContext() {
        String sessionId = coordinationService.initializeFormSession();
        return ResponseEntity.ok(sessionId);
    }

    /**
     * Отримує поточний стан форми.
     */
    @GetMapping("/session/{sessionId}/state")
    public ResponseEntity<NewClientFormState> getCurrentState(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormState state = coordinationService.getCurrentState(sessionId);
        return ResponseEntity.ok(state);
    }

    /**
     * Отримує поточні дані форми.
     */
    @GetMapping("/session/{sessionId}/data")
    public ResponseEntity<NewClientFormDTO> getCurrentData(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO data = coordinationService.getFormDataFromSession(sessionId);
        return ResponseEntity.ok(data);
    }

    /**
     * Оновлює дані форми.
     */
    @PutMapping("/session/{sessionId}/data")
    public ResponseEntity<Void> updateFormData(
            @PathVariable String sessionId,
            @RequestBody NewClientFormDTO formData) {

        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.updateFormDataInSession(sessionId, formData);
        return ResponseEntity.ok().build();
    }

    /**
     * Валідує дані форми.
     */
    @PostMapping("/session/{sessionId}/validate")
    public ResponseEntity<NewClientFormValidationResult> validateData(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormValidationResult result = coordinationService.validateComplete(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Валідує критичні поля форми.
     */
    @PostMapping("/session/{sessionId}/validate-critical")
    public ResponseEntity<NewClientFormValidationResult> validateCritical(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormValidationResult result = coordinationService.validateCritical(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Перевіряє дублікати клієнтів.
     */
    @PostMapping("/session/{sessionId}/check-duplicates")
    public ResponseEntity<List<ClientResponse>> checkDuplicates(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO formData = coordinationService.getFormDataFromSession(sessionId);
        List<ClientResponse> duplicates = coordinationService.checkForDuplicates(formData);
        return ResponseEntity.ok(duplicates);
    }

    /**
     * Створює нового клієнта.
     */
    @PostMapping("/session/{sessionId}/create-client")
    public ResponseEntity<ClientResponse> createClient(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        try {
            ClientResponse createdClient = coordinationService.createClientFromForm(sessionId);
            return ResponseEntity.ok(createdClient);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Завершує роботу з формою.
     */
    @PostMapping("/session/{sessionId}/complete")
    public ResponseEntity<Void> completeForm(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.completeFormSession(sessionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Скасовує роботу з формою.
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> cancelForm(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.removeFormSession(sessionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Отримує звіт валідації.
     */
    @GetMapping("/session/{sessionId}/validation-report")
    public ResponseEntity<String> getValidationReport(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        String report = coordinationService.getValidationReport(sessionId);
        return ResponseEntity.ok(report);
    }
}
