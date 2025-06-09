package com.aksi.domain.order.statemachine.stage1.adapter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchCriteriaDTO;
import com.aksi.domain.order.statemachine.stage1.dto.ClientSearchResultDTO;
import com.aksi.domain.order.statemachine.stage1.service.ClientSearchCoordinationService;

/**
 * REST адаптер для пошуку та вибору існуючих клієнтів.
 * Етап 1.1: Вибір або створення клієнта.
 */
@RestController
@RequestMapping("/order-wizard/stage1/client-search")
public class ClientSearchAdapter {

    private final ClientSearchCoordinationService coordinationService;

    public ClientSearchAdapter(ClientSearchCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Пошук клієнтів за телефоном з пагінацією.
     */
    @GetMapping("/search/phone")
    public ResponseEntity<ClientSearchResultDTO> searchByPhone(
            @RequestParam String phone,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String sessionId = coordinationService.createSearchContext();
        ClientSearchCriteriaDTO criteria = new ClientSearchCriteriaDTO();
        criteria.setPhone(phone);
        criteria.setPage(page);
        criteria.setSize(size);

        ClientSearchResultDTO result = coordinationService.searchClients(sessionId, criteria);
        return ResponseEntity.ok(result);
    }

    /**
     * Пошук клієнтів за іменем з пагінацією.
     */
    @GetMapping("/search/name")
    public ResponseEntity<ClientSearchResultDTO> searchByName(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String sessionId = coordinationService.createSearchContext();
        ClientSearchCriteriaDTO criteria = new ClientSearchCriteriaDTO();
        criteria.setFirstName(firstName);
        criteria.setLastName(lastName);
        criteria.setPage(page);
        criteria.setSize(size);

        ClientSearchResultDTO result = coordinationService.searchClients(sessionId, criteria);
        return ResponseEntity.ok(result);
    }

    /**
     * Загальний пошук клієнтів з пагінацією.
     */
    @GetMapping("/search")
    public ResponseEntity<ClientSearchResultDTO> searchClients(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String sessionId = coordinationService.createSearchContext();
        ClientSearchCriteriaDTO criteria = coordinationService.createSearchCriteria(searchTerm);
        criteria.setPage(page);
        criteria.setSize(size);

        ClientSearchResultDTO result = coordinationService.searchClients(sessionId, criteria);
        return ResponseEntity.ok(result);
    }


}
