package com.aksi.domain.client.delegate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.aksi.api.client.ClientSearchApiDelegate;
import com.aksi.api.client.dto.ClientPageResponse;
import com.aksi.api.client.dto.ClientSearchRequest;
import com.aksi.api.client.dto.ClientSearchResponse;
import com.aksi.api.client.dto.PageableInfo;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.client.service.ClientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація ClientSearchApiDelegate для пошуку клієнтів.
 * Спеціально для швидкого пошуку в OrderWizard.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ClientSearchApiDelegateImpl implements ClientSearchApiDelegate {

    private final ClientService clientService;
    private final ClientMapper clientMapper;

    @Override
    public ResponseEntity<ClientSearchResponse> searchClients(String query, Integer limit) {
        log.debug("Quick search clients via API: query={}, limit={}", query, limit);

        try {
            // Default limit для автозаповнення
            int searchLimit = limit != null ? limit : 10;

            // Швидкий пошук через сервіс
            List<ClientEntity> foundClients = clientService.quickSearchClients(query, searchLimit);

            // Конвертація до ClientSearchResult
            ClientSearchResponse response = new ClientSearchResponse();
            response.setResults(clientMapper.toClientSearchResultList(foundClients));
            response.setTotalFound(foundClients.size());
            response.setHasMore(foundClients.size() >= searchLimit);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error in quick search clients: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public ResponseEntity<ClientPageResponse> advancedSearchClients(ClientSearchRequest searchRequest) {
        log.debug("Advanced search clients via API: {}", searchRequest);

        try {
            // Створення Pageable
            int pageNumber = Optional.ofNullable(searchRequest.getPage()).orElse(0);
            int pageSize = Optional.ofNullable(searchRequest.getSize()).orElse(20);
            String sortBy = searchRequest.getSort() != null ?
                    getSortField(searchRequest.getSort()) : "lastName";
            Sort.Direction direction = Sort.Direction.ASC; // Default ascending

            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortBy));

            // Конвертація дат
            LocalDateTime registrationFrom = searchRequest.getRegistrationDateFrom() != null ?
                    searchRequest.getRegistrationDateFrom().atStartOfDay() : null;
            LocalDateTime registrationTo = searchRequest.getRegistrationDateTo() != null ?
                    searchRequest.getRegistrationDateTo().atTime(23, 59, 59) : null;

            // Розширений пошук через сервіс
            Page<ClientEntity> clientsPage = clientService.searchClients(
                    searchRequest.getFirstName(),
                    searchRequest.getLastName(),
                    searchRequest.getPhone(),
                    searchRequest.getEmail(),
                    searchRequest.getCity(),
                    clientMapper.clientSourceTypeFromApi(searchRequest.getSourceType()),
                    registrationFrom,
                    registrationTo,
                    searchRequest.getIsVip(),
                    pageable
            );

            // Створення відповіді
            ClientPageResponse response = new ClientPageResponse();
            response.setContent(clientMapper.toClientResponseList(clientsPage.getContent()));
            response.setFirst(clientsPage.isFirst());
            response.setLast(clientsPage.isLast());
            response.setTotalElements(clientsPage.getTotalElements());
            response.setTotalPages(clientsPage.getTotalPages());
            response.setNumberOfElements(clientsPage.getNumberOfElements());

            // Налаштування pageable info
            PageableInfo pageableInfo = new PageableInfo();
            pageableInfo.setPage(pageNumber);
            pageableInfo.setSize(pageSize);
            pageableInfo.setSort(clientsPage.getSort().stream()
                    .map(order -> order.getProperty() + "," + order.getDirection())
                    .toList());
            response.setPageable(pageableInfo);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error in advanced search clients: {}", e.getMessage(), e);
            throw e;
        }
    }

    // === Helper methods ===

        private String getSortField(ClientSearchRequest.SortEnum sort) {
        if (sort == null) {
            return "lastName";
        }

        return switch (sort) {
            case FIRST_NAME -> "firstName";
            case LAST_NAME -> "lastName";
            case PHONE -> "phone";
            case CREATED_AT -> "createdAt";
            case TOTAL_ORDERS -> "totalOrders";
            case TOTAL_SPENT -> "totalSpent";
            default -> "lastName";
        };
    }
}
