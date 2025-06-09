package com.aksi.domain.order.statemachine.stage1.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSelectionDTO;
import com.aksi.domain.order.statemachine.stage1.enums.Stage1State;
import com.aksi.domain.order.statemachine.stage1.service.Stage1StateService.Stage1Context;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * Координаційний сервіс для Stage1.
 * Тонке делегування між усіма сервісами Stage1.
 */
@Service
public class Stage1CoordinationService {

    private final Stage1ValidationService validationService;
    private final Stage1SessionService sessionService;
    private final Stage1ClientOperationsService clientOperationsService;
    private final Stage1StateService stateService;

    public Stage1CoordinationService(
            Stage1ValidationService validationService,
            Stage1SessionService sessionService,
            Stage1ClientOperationsService clientOperationsService,
            Stage1StateService stateService) {
        this.validationService = validationService;
        this.sessionService = sessionService;
        this.clientOperationsService = clientOperationsService;
        this.stateService = stateService;
    }

    // ========== Делегування до ValidationService ==========

    public ValidationResult validateClientSelection(ClientSelectionDTO clientSelection) {
        return validationService.validateClientSelection(clientSelection);
    }

    public boolean isClientSelectionReady(ClientSelectionDTO clientSelection) {
        return validationService.isClientSelectionReady(clientSelection);
    }

    public boolean isStage1Ready(ClientSelectionDTO clientSelection) {
        return validationService.isStage1Ready(clientSelection);
    }

    // ========== Делегування до SessionService ==========

    public String initializeSession() {
        return sessionService.initializeSession();
    }

    public Stage1Context getSession(String sessionId) {
        return sessionService.getSession(sessionId);
    }

    public boolean sessionExists(String sessionId) {
        return sessionService.sessionExists(sessionId);
    }

    public void updateSessionState(String sessionId, Stage1State newState) {
        sessionService.updateSessionState(sessionId, newState);
    }

    public void setClientSelectionInSession(String sessionId, ClientSelectionDTO clientSelection) {
        sessionService.setClientSelectionInSession(sessionId, clientSelection);
    }

    public void completeSession(String sessionId) {
        sessionService.completeSession(sessionId);
    }

    public void removeSession(String sessionId) {
        sessionService.removeSession(sessionId);
    }

    // ========== Делегування до ClientOperationsService ==========

    public List<ClientResponse> searchClients(String searchTerm) {
        return clientOperationsService.searchClients(searchTerm);
    }

    public ClientResponse getClientById(UUID clientId) {
        return clientOperationsService.getClientById(clientId);
    }

    public ClientResponse createClient(CreateClientRequest createClientRequest) {
        return clientOperationsService.createClient(createClientRequest);
    }

    public boolean clientExists(UUID clientId) {
        return clientOperationsService.clientExists(clientId);
    }

    // ========== Делегування до StateService ==========

    public Stage1Context createStateSession(String sessionId) {
        return stateService.createSession(sessionId);
    }

    public Stage1Context getStateContext(String sessionId) {
        return stateService.getContext(sessionId);
    }

    public boolean hasStateSession(String sessionId) {
        return stateService.hasSession(sessionId);
    }

    public void updateState(String sessionId, Stage1State newState) {
        stateService.updateState(sessionId, newState);
    }

    public void setClientSelectionInState(String sessionId, ClientSelectionDTO clientSelection) {
        stateService.setClientSelection(sessionId, clientSelection);
    }

    public void removeStateSession(String sessionId) {
        stateService.removeSession(sessionId);
    }

    public void clearAllStateSessions() {
        stateService.clearAllSessions();
    }
}
