package com.aksi.domain.order.statemachine.stage1.adapter;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.order.statemachine.adapter.BaseStateMachineAdapter;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchResultDTO;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchAdapterMessages;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchEvents;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchLogMessages;
import com.aksi.domain.order.statemachine.stage1.enums.ClientSearchState;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchCoordinationService;
import com.aksi.domain.order.statemachine.stage1.util.ClientSearchAdapterHelper;
import com.aksi.domain.order.statemachine.stage1.validator.ValidationResult;

/**
 * REST адаптер для пошуку клієнтів в Stage1.
 * Використовує StateMachineService та існуючі сервіси.
 * Базується на документації Spring State Machine Event Service.
 *
 * Рефакторований з використанням енумів для кращої підтримуваності.
 */
@RestController
@RequestMapping("/order-wizard/stage1/client-search")
public class ClientSearchAdapter extends BaseStateMachineAdapter {

    private static final Logger logger = LoggerFactory.getLogger(ClientSearchAdapter.class);

    private final ClientSearchCoordinationService coordinationService;
    private final ClientSearchAdapterHelper helper;

    public ClientSearchAdapter(ClientSearchCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
        this.helper = new ClientSearchAdapterHelper(coordinationService);
    }

    /**
     * Ініціалізує новий контекст пошуку клієнтів.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<String> initializeContext() {
        logger.info(ClientSearchAdapterMessages.INIT_REQUEST.getMessage());

        try {
            String sessionId = coordinationService.startClientSearch();
            logger.info(ClientSearchAdapterMessages.INIT_SUCCESS.getMessage(), sessionId);
            return ResponseEntity.ok(sessionId);
        } catch (Exception e) {
            logger.error(ClientSearchAdapterMessages.INIT_ERROR.getMessage(), e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }



    /**
     * Очищує результати пошуку.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Void> clearSearch(String sessionId) {
        logger.info(ClientSearchAdapterMessages.CLEAR_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);
            coordinationService.clearSearchResults(sessionId);
            logger.info(ClientSearchAdapterMessages.CLEAR_SUCCESS.getMessage(), sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error(ClientSearchAdapterMessages.CLEAR_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Завершує пошук клієнта.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Void> completeSearch(String sessionId) {
        logger.info(ClientSearchAdapterMessages.COMPLETE_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);
            coordinationService.completeClientSearch(sessionId);
            logger.info(ClientSearchAdapterMessages.COMPLETE_SUCCESS.getMessage(), sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error(ClientSearchAdapterMessages.COMPLETE_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Скасовує пошук клієнта.
     * Метод для сумісності з контроллером.
     */
    public ResponseEntity<Void> cancelSearch(String sessionId) {
        logger.info(ClientSearchAdapterMessages.CANCEL_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);
            coordinationService.removeSearchContext(sessionId);
            logger.info(ClientSearchAdapterMessages.CANCEL_SUCCESS.getMessage(), sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error(ClientSearchAdapterMessages.CANCEL_ERROR.getMessage(), sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // === ІСНУЮЧІ МЕТОДИ (без змін) ===

    /**
     * Отримує поточний стан пошуку клієнтів.
     */
    @GetMapping("/session/{sessionId}/state")
    public ResponseEntity<ClientSearchState> getClientSearchState(@PathVariable String sessionId) {
        logger.info(ClientSearchLogMessages.STATE_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);
            ClientSearchState state = coordinationService.getCurrentState(sessionId);

            logger.info(ClientSearchLogMessages.STATE_SUCCESS.getMessage(), state, sessionId);
            return ResponseEntity.ok(state);

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.STATE_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримує поточні критерії пошуку з контексту.
     */
    @GetMapping("/session/{sessionId}/criteria")
    public ResponseEntity<ClientSearchCriteriaDTO> getCurrentCriteria(@PathVariable String sessionId) {
        logger.info(ClientSearchLogMessages.CRITERIA_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            var context = coordinationService.getSearchContext(sessionId);
            ClientSearchCriteriaDTO criteria = context != null ? context.getSearchCriteria() : null;

            if (criteria != null) {
                logger.info(ClientSearchLogMessages.CRITERIA_SUCCESS.getMessage(), sessionId);
                return ResponseEntity.ok(criteria);
            } else {
                logger.info(ClientSearchLogMessages.CRITERIA_NOT_FOUND.getMessage(), sessionId);
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.CRITERIA_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Виконує пошук клієнтів за критеріями.
     */
    @PostMapping("/session/{sessionId}/search")
    public ResponseEntity<ClientSearchResultDTO> searchClients(
            @PathVariable String sessionId,
            @RequestBody ClientSearchCriteriaDTO criteria) {

        logger.info(ClientSearchLogMessages.SEARCH_REQUEST.getMessage(), sessionId, criteria);

        try {
            helper.ensureContextExists(sessionId);

            ClientSearchResultDTO results = coordinationService.searchClients(sessionId, criteria);

            logger.info(ClientSearchLogMessages.SEARCH_SUCCESS.getMessage(),
                       sessionId, results.getClients().size());
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.SEARCH_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Пошук клієнтів за номером телефону.
     */
    @PostMapping("/session/{sessionId}/search-by-phone")
    public ResponseEntity<ClientSearchResultDTO> searchByPhone(
            @PathVariable String sessionId,
            @RequestParam String phone) {

        logger.info(ClientSearchLogMessages.PHONE_SEARCH_REQUEST.getMessage(), sessionId, phone);

        try {
            helper.ensureContextExists(sessionId);

            ClientSearchCriteriaDTO criteria = coordinationService.createSearchCriteria(phone);
            criteria.setPhone(phone);

            ClientSearchResultDTO results = coordinationService.searchClients(sessionId, criteria);

            logger.info(ClientSearchLogMessages.PHONE_SEARCH_SUCCESS.getMessage(), sessionId);
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.PHONE_SEARCH_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Вибирає клієнта зі списку результатів.
     * Метод для сумісності з контроллером (приймає UUID).
     */
    public ResponseEntity<Void> selectClient(String sessionId, UUID clientId) {
        logger.info(ClientSearchLogMessages.SELECT_CLIENT_REQUEST.getMessage(), sessionId, clientId);

        try {
            helper.ensureContextExists(sessionId);

            ValidationResult result = coordinationService.selectClient(sessionId, clientId);

            if (result.isValid()) {
                logger.info(ClientSearchLogMessages.SELECT_CLIENT_SUCCESS.getMessage(), sessionId, clientId);
                return ResponseEntity.ok().build();
            } else {
                logger.warn(ClientSearchLogMessages.EVENT_NOT_PROCESSED.getMessage(),
                           ClientSearchEvents.SELECT_CLIENT, sessionId);
                return ResponseEntity.badRequest().build();
            }

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.SELECT_CLIENT_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Вибирає клієнта зі списку результатів.
     */
    @PostMapping("/session/{sessionId}/select-client")
    public ResponseEntity<Void> selectClient(
            @PathVariable String sessionId,
            @RequestParam String clientId) {

        logger.info(ClientSearchLogMessages.SELECT_CLIENT_REQUEST.getMessage(), sessionId, clientId);

        try {
            helper.ensureContextExists(sessionId);

            UUID clientUuid = helper.parseClientId(clientId, sessionId);
            if (clientUuid == null) {
                return ResponseEntity.badRequest().build();
            }

            ValidationResult result = coordinationService.selectClient(sessionId, clientUuid);

            if (result.isValid()) {
                logger.info(ClientSearchLogMessages.SELECT_CLIENT_SUCCESS.getMessage(), sessionId, clientId);
                return ResponseEntity.ok().build();
            } else {
                logger.warn(ClientSearchLogMessages.EVENT_NOT_PROCESSED.getMessage(),
                           ClientSearchEvents.SELECT_CLIENT, sessionId);
                return ResponseEntity.badRequest().build();
            }

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.SELECT_CLIENT_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримує обраного клієнта.
     */
    @GetMapping("/session/{sessionId}/selected-client")
    public ResponseEntity<ClientResponse> getSelectedClient(@PathVariable String sessionId) {
        logger.info(ClientSearchLogMessages.GET_SELECTED_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            ClientResponse selectedClient = coordinationService.getSelectedClient(sessionId);

            if (selectedClient != null) {
                logger.info(ClientSearchLogMessages.GET_SELECTED_SUCCESS.getMessage(), sessionId);
                return ResponseEntity.ok(selectedClient);
            } else {
                logger.info(ClientSearchLogMessages.CLIENT_NOT_SELECTED.getMessage(), sessionId);
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.GET_SELECTED_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Очищує обраного клієнта.
     */
    @DeleteMapping("/session/{sessionId}/selected-client")
    public ResponseEntity<Void> clearSelectedClient(@PathVariable String sessionId) {
        logger.info(ClientSearchLogMessages.CLEAR_SELECTION_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            coordinationService.saveSelectedClient(sessionId, null);

            logger.info(ClientSearchLogMessages.CLEAR_SELECTION_SUCCESS.getMessage(), sessionId);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.CLEAR_SELECTION_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримує результати пошуку.
     */
    @GetMapping("/session/{sessionId}/results")
    public ResponseEntity<ClientSearchResultDTO> getSearchResults(@PathVariable String sessionId) {
        logger.info(ClientSearchLogMessages.RESULTS_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            var context = coordinationService.getSearchContext(sessionId);
            ClientSearchResultDTO results = context != null ? context.getSearchResult() : null;

            if (results != null) {
                logger.info(ClientSearchLogMessages.RESULTS_SUCCESS.getMessage(), sessionId);
                return ResponseEntity.ok(results);
            } else {
                logger.info(ClientSearchLogMessages.RESULTS_NOT_FOUND.getMessage(), sessionId);
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.RESULTS_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Перевіряє готовність до завершення.
     */
    @GetMapping("/session/{sessionId}/ready-for-completion")
    public ResponseEntity<Boolean> isReadyForCompletion(@PathVariable String sessionId) {
        logger.info(ClientSearchLogMessages.READY_FOR_COMPLETION_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            boolean isReady = coordinationService.isReadyToComplete(sessionId);

            logger.info(ClientSearchLogMessages.READY_FOR_COMPLETION_SUCCESS.getMessage(), sessionId, isReady);
            return ResponseEntity.ok(isReady);

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.READY_FOR_COMPLETION_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Завершує пошук клієнта.
     */
    @PostMapping("/session/{sessionId}/complete")
    public ResponseEntity<Void> completeClientSearch(@PathVariable String sessionId) {
        logger.info(ClientSearchLogMessages.COMPLETE_REQUEST.getMessage(), sessionId);

        try {
            helper.ensureContextExists(sessionId);

            if (!coordinationService.isReadyToComplete(sessionId)) {
                String reason = "Пошук клієнта не готовий для завершення";
                logger.warn(ClientSearchLogMessages.COMPLETION_FAILED.getMessage(), sessionId, reason);
                return ResponseEntity.badRequest().build();
            }

            coordinationService.completeClientSearch(sessionId);

            logger.info(ClientSearchLogMessages.COMPLETE_SUCCESS.getMessage(), sessionId);
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            logger.error(ClientSearchLogMessages.COMPLETE_ERROR.getMessage(), sessionId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
