package com.aksi.domain.order.statemachine.stage1.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.order.statemachine.stage1.dto.NewClientFormDTO;
import com.aksi.domain.order.statemachine.stage1.mapper.NewClientFormMapper;
import com.aksi.domain.order.statemachine.stage1.service.NewClientFormStateService.NewClientFormContext;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * Координаційний сервіс для форми нового клієнта.
 * Головний делегатор між усіма сервісами для роботи з формою нового клієнта.
 */
@Service
public class NewClientFormCoordinationService {

    private final NewClientFormValidationService validationService;
    private final NewClientFormSessionService sessionService;
    private final NewClientOperationsService operationsService;
    private final NewClientFormStateService stateService;
    private final NewClientFormMapper mapper;

    public NewClientFormCoordinationService(
            NewClientFormValidationService validationService,
            NewClientFormSessionService sessionService,
            NewClientOperationsService operationsService,
            NewClientFormStateService stateService,
            NewClientFormMapper mapper) {
        this.validationService = validationService;
        this.sessionService = sessionService;
        this.operationsService = operationsService;
        this.stateService = stateService;
        this.mapper = mapper;
    }

    // ========== Делегування до ValidationService ==========

    public ValidationResult validateNewClientForm(NewClientFormDTO formData) {
        return validationService.validateNewClientForm(formData);
    }

    public ValidationResult validateRequiredFields(NewClientFormDTO formData) {
        return validationService.validateRequiredFields(formData);
    }

    public boolean isFormReadyForSubmission(NewClientFormDTO formData) {
        return validationService.isFormReadyForSubmission(formData);
    }

    public boolean canSaveAsDraft(NewClientFormDTO formData) {
        return validationService.canSaveAsDraft(formData);
    }

    public boolean hasMinimumRequiredData(NewClientFormDTO formData) {
        return validationService.hasMinimumRequiredData(formData);
    }

    // ========== Делегування до SessionService ==========

    public String initializeFormSession() {
        return sessionService.initializeFormSession();
    }

    public NewClientFormContext getFormSession(String sessionId) {
        return sessionService.getFormSession(sessionId);
    }

    public boolean formSessionExists(String sessionId) {
        return sessionService.formSessionExists(sessionId);
    }

    public void updateFormDataInSession(String sessionId, NewClientFormDTO formData) {
        sessionService.updateFormDataInSession(sessionId, formData);
    }

    public NewClientFormDTO getFormDataFromSession(String sessionId) {
        return sessionService.getFormDataFromSession(sessionId);
    }

    public void completeFormSession(String sessionId) {
        sessionService.completeFormSession(sessionId);
    }

    public void removeFormSession(String sessionId) {
        sessionService.removeFormSession(sessionId);
    }

    public boolean hasFormDataInSession(String sessionId) {
        return sessionService.hasFormDataInSession(sessionId);
    }

    // ========== Делегування до OperationsService ==========

    public ClientResponse createClient(CreateClientRequest request) {
        return operationsService.createClient(request);
    }

    public List<ClientResponse> searchClientsByPhone(String phone) {
        return operationsService.searchClientsByPhone(phone);
    }

    public List<ClientResponse> searchClientsByName(String firstName, String lastName) {
        return operationsService.searchClientsByName(firstName, lastName);
    }

    public List<ClientResponse> searchClients(String searchTerm) {
        return operationsService.searchClients(searchTerm);
    }

    // ========== Делегування до StateService ==========

    public NewClientFormContext createFormContext(String sessionId) {
        return stateService.createFormContext(sessionId);
    }

    public NewClientFormContext getFormContext(String sessionId) {
        return stateService.getFormContext(sessionId);
    }

    public boolean hasFormContext(String sessionId) {
        return stateService.hasFormContext(sessionId);
    }

    public void updateFormData(String sessionId, NewClientFormDTO formData) {
        stateService.updateFormData(sessionId, formData);
    }

    public void removeFormContext(String sessionId) {
        stateService.removeFormContext(sessionId);
    }

    // ========== Інтеграційні методи з Mapper ==========

    public CreateClientRequest convertToCreateRequest(NewClientFormDTO formData) {
        return mapper.toCreateClientRequest(formData);
    }

    // ========== Високорівневі методи ==========

    /**
     * Повний процес створення клієнта з валідацією.
     */
    public ClientResponse createClientFromForm(String sessionId) {
        NewClientFormDTO formData = getFormDataFromSession(sessionId);
        if (formData == null) {
            throw new IllegalStateException("Дані форми не знайдені в сесії: " + sessionId);
        }

        ValidationResult validation = validateNewClientForm(formData);
        if (!validation.isValid()) {
            throw new IllegalArgumentException("Форма містить помилки: " + validation.getErrors());
        }

        CreateClientRequest request = convertToCreateRequest(formData);
        ClientResponse createdClient = createClient(request);

        // Очищаємо сесію після успішного створення
        completeFormSession(sessionId);

        return createdClient;
    }

    /**
     * Перевірка унікальності клієнта.
     */
    public List<ClientResponse> checkForDuplicates(NewClientFormDTO formData) {
        if (formData.getPhone() != null && !formData.getPhone().trim().isEmpty()) {
            return searchClientsByPhone(formData.getPhone());
        }
        return List.of();
    }
}
