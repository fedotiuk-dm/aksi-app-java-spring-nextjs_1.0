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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormCoordinationService;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormStateService.NewClientFormContext;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * REST API адаптер для форми нового клієнта.
 * Тонкий шар над CoordinationService для HTTP запитів.
 */
@RestController
@RequestMapping("/order-wizard/stage1/new-client-form")
public class NewClientFormAdapter {

    private final NewClientFormCoordinationService coordinationService;

    public NewClientFormAdapter(NewClientFormCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Ініціалізація нової сесії форми.
     */
    @PostMapping("/session")
    public ResponseEntity<String> initializeFormSession() {
        String sessionId = coordinationService.initializeFormSession();
        return ResponseEntity.ok(sessionId);
    }

    /**
     * Отримання контексту сесії форми.
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<NewClientFormContext> getFormSession(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }
        NewClientFormContext context = coordinationService.getFormSession(sessionId);
        return ResponseEntity.ok(context);
    }

    /**
     * Отримання даних форми з сесії.
     */
    @GetMapping("/session/{sessionId}/data")
    public ResponseEntity<NewClientFormDTO> getFormData(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO formData = coordinationService.getFormDataFromSession(sessionId);
        if (formData == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(formData);
    }

    /**
     * Оновлення даних форми в сесії.
     */
    @PutMapping("/session/{sessionId}/data")
    public ResponseEntity<ValidationResult> updateFormData(
            @PathVariable String sessionId,
            @RequestBody NewClientFormDTO formData) {

        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        // Валідуємо дані
        ValidationResult validation = coordinationService.validateNewClientForm(formData);

        // Зберігаємо навіть якщо є помилки (для чернетки)
        coordinationService.updateFormDataInSession(sessionId, formData);

        return ResponseEntity.ok(validation);
    }

    /**
     * Валідація форми.
     */
    @PostMapping("/session/{sessionId}/validate")
    public ResponseEntity<ValidationResult> validateForm(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO formData = coordinationService.getFormDataFromSession(sessionId);
        if (formData == null) {
            return ResponseEntity.badRequest().body(
                ValidationResult.failure(List.of("Дані форми відсутні")));
        }

        ValidationResult validation = coordinationService.validateNewClientForm(formData);
        return ResponseEntity.ok(validation);
    }

    /**
     * Валідація тільки обов'язкових полів.
     */
    @PostMapping("/session/{sessionId}/validate/required")
    public ResponseEntity<ValidationResult> validateRequiredFields(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO formData = coordinationService.getFormDataFromSession(sessionId);
        if (formData == null) {
            return ResponseEntity.badRequest().body(
                ValidationResult.failure(List.of("Дані форми відсутні")));
        }

        ValidationResult validation = coordinationService.validateRequiredFields(formData);
        return ResponseEntity.ok(validation);
    }

    /**
     * Перевірка готовності форми до відправки.
     */
    @GetMapping("/session/{sessionId}/ready")
    public ResponseEntity<Boolean> isFormReady(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO formData = coordinationService.getFormDataFromSession(sessionId);
        if (formData == null) {
            return ResponseEntity.ok(false);
        }

        boolean ready = coordinationService.isFormReadyForSubmission(formData);
        return ResponseEntity.ok(ready);
    }

    /**
     * Перевірка дублікатів клієнтів.
     */
    @PostMapping("/session/{sessionId}/check-duplicates")
    public ResponseEntity<List<ClientResponse>> checkDuplicates(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        NewClientFormDTO formData = coordinationService.getFormDataFromSession(sessionId);
        if (formData == null) {
            return ResponseEntity.badRequest().build();
        }

        List<ClientResponse> duplicates = coordinationService.checkForDuplicates(formData);
        return ResponseEntity.ok(duplicates);
    }

    /**
     * Створення клієнта з форми.
     */
    @PostMapping("/session/{sessionId}/create-client")
    public ResponseEntity<?> createClient(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        try {
            ClientResponse createdClient = coordinationService.createClientFromForm(sessionId);
            return ResponseEntity.ok(createdClient);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("Дані форми не знайдені");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Помилка валідації: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Помилка створення клієнта: " + e.getMessage());
        }
    }

    /**
     * Пошук клієнтів за телефоном.
     */
    @GetMapping("/search/phone")
    public ResponseEntity<List<ClientResponse>> searchByPhone(@RequestParam String phone) {
        List<ClientResponse> clients = coordinationService.searchClientsByPhone(phone);
        return ResponseEntity.ok(clients);
    }

    /**
     * Пошук клієнтів за іменем.
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<ClientResponse>> searchByName(
            @RequestParam String firstName,
            @RequestParam String lastName) {
        List<ClientResponse> clients = coordinationService.searchClientsByName(firstName, lastName);
        return ResponseEntity.ok(clients);
    }

    /**
     * Видалення сесії форми.
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> removeFormSession(@PathVariable String sessionId) {
        if (!coordinationService.formSessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        coordinationService.removeFormSession(sessionId);
        return ResponseEntity.noContent().build();
    }
}
