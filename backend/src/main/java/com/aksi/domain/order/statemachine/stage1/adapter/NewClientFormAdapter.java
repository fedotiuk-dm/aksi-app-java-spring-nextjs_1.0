package com.aksi.domain.order.statemachine.stage1.adapter;

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
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormCoordinationService;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * REST адаптер для форми нового клієнта.
 * Етап 1.2: Форма створення нового клієнта.
 */
@RestController
@RequestMapping("/order-wizard/stage1/new-client-form")
public class NewClientFormAdapter {

    private final NewClientFormCoordinationService coordinationService;

    public NewClientFormAdapter(NewClientFormCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Ініціалізує нову сесію форми.
     */
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeForm() {
        String sessionId = coordinationService.initializeFormSession();
        return ResponseEntity.ok(sessionId);
    }

    /**
     * Отримує дані форми з сесії.
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<NewClientFormDTO> getFormData(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO formData = coordinationService.getFormDataFromSession(sessionId);
        return ResponseEntity.ok(formData);
    }

    /**
     * Оновлює дані форми в сесії.
     */
    @PutMapping("/session/{sessionId}")
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
     * Валідує поточні дані форми.
     */
    @PostMapping("/session/{sessionId}/validate")
    public ResponseEntity<ValidationResult> validateForm(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO formData = coordinationService.getFormDataFromSession(sessionId);
        ValidationResult result = coordinationService.validateNewClientForm(formData);
        return ResponseEntity.ok(result);
    }

    /**
     * Валідує тільки обов'язкові поля.
     */
    @PostMapping("/session/{sessionId}/validate-required")
    public ResponseEntity<ValidationResult> validateRequiredFields(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO formData = coordinationService.getFormDataFromSession(sessionId);
        ValidationResult result = coordinationService.validateRequiredFields(formData);
        return ResponseEntity.ok(result);
    }

    /**
     * Перевіряє чи готова форма для відправки.
     */
    @GetMapping("/session/{sessionId}/ready-for-submission")
    public ResponseEntity<Boolean> isReadyForSubmission(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO formData = coordinationService.getFormDataFromSession(sessionId);
        boolean ready = coordinationService.isFormReadyForSubmission(formData);
        return ResponseEntity.ok(ready);
    }

    /**
     * Створює клієнта з даних форми.
     */
    @PostMapping("/session/{sessionId}/create-client")
    public ResponseEntity<ClientResponse> createClient(@PathVariable String sessionId) {
        try {
            ClientResponse client = coordinationService.createClientFromForm(sessionId);
            return ResponseEntity.ok(client);
        } catch (IllegalStateException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Завершує сесію форми.
     */
    @PostMapping("/session/{sessionId}/complete")
    public ResponseEntity<Void> completeSession(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.completeFormSession(sessionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Видаляє сесію форми.
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> removeSession(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.removeFormSession(sessionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Перетворює дані форми в запит на створення.
     */
    @PostMapping("/convert-to-create-request")
    public ResponseEntity<CreateClientRequest> convertToCreateRequest(@RequestBody NewClientFormDTO formData) {
        CreateClientRequest request = coordinationService.convertToCreateRequest(formData);
        return ResponseEntity.ok(request);
    }
}
