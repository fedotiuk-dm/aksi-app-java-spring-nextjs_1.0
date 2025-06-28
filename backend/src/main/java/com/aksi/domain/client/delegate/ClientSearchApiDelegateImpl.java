package com.aksi.domain.client.delegate;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.aksi.api.client.ClientSearchApiDelegate;
import com.aksi.api.client.dto.ClientPageResponse;
import com.aksi.api.client.dto.ClientSearchRequest;
import com.aksi.api.client.dto.ClientSearchResponse;
import com.aksi.api.client.dto.ClientSearchResult;
import com.aksi.api.client.dto.PageableInfo;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.client.service.ClientSearchService;

/**
 * Delegate для пошукових операцій з клієнтами
 * Реалізує endpoints: searchClients, advancedSearchClients
 */
@Component
public class ClientSearchApiDelegateImpl implements ClientSearchApiDelegate {

    private final ClientSearchService searchService;
    private final ClientMapper clientMapper;

    public ClientSearchApiDelegateImpl(
        ClientSearchService searchService,
        ClientMapper clientMapper
    ) {
        this.searchService = searchService;
        this.clientMapper = clientMapper;
    }

    /**
     * GET /api/clients/search?query={query} - Швидкий пошук клієнтів (для Order Wizard)
     */
    @Override
    public ResponseEntity<ClientSearchResponse> searchClients(String query, Integer limit) {
        // Валідація параметрів
        if (query == null || query.trim().isEmpty() || query.trim().length() < 2) {
            return ResponseEntity.badRequest().build();
        }

        int validLimit = Math.min(50, Math.max(1, limit != null ? limit : 10));

        // Пошук через сервіс
        List<ClientEntity> searchResults = searchService.quickSearch(query.trim(), validLimit);

        // Конверсія до DTO
        List<ClientSearchResult> searchResultDtos = clientMapper.toSearchResultList(searchResults);

        // Підсвічування знайдених полів
        highlightSearchResults(searchResultDtos, query.trim());

        // Формування відповіді
        ClientSearchResponse response = new ClientSearchResponse();
        response.setResults(searchResultDtos);
        response.setTotalFound(searchResultDtos.size());
        response.setHasMore(searchResultDtos.size() == validLimit);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/clients/search/advanced - Розширений пошук з фільтрами
     */
    @Override
    public ResponseEntity<ClientPageResponse> advancedSearchClients(ClientSearchRequest searchRequest) {
        try {
            // Використовуємо дефолтні значення для пагінації
            int defaultPage = 0;
            int defaultSize = 20;

            Pageable pageable = PageRequest.of(defaultPage, defaultSize);

            // Конверсія API DTO до service criteria
            ClientSearchService.AdvancedSearchCriteria criteria =
                clientMapper.toSearchCriteria(searchRequest);

            // Додаткова обробка для communication methods (тільки перший елемент)
            if (searchRequest.getCommunicationMethods() != null &&
                !searchRequest.getCommunicationMethods().isEmpty()) {

                var firstMethod = searchRequest.getCommunicationMethods().get(0);
                var domainMethod = com.aksi.domain.client.enums.CommunicationMethodType
                    .valueOf(firstMethod.name());
                criteria.setCommunicationMethod(domainMethod);
            }

            // Пошук через сервіс
            Page<ClientEntity> searchPage = searchService.advancedSearch(criteria, pageable);

            // Конверсія до DTO
            ClientPageResponse response = new ClientPageResponse();
            response.setContent(clientMapper.toClientResponseList(searchPage.getContent()));

            // Налаштування PageableInfo (тільки page/size/sort)
            PageableInfo pageInfo = new PageableInfo();
            pageInfo.setPage(searchPage.getNumber());
            pageInfo.setSize(searchPage.getSize());
            response.setPageable(pageInfo);

            // Налаштування pagination metadata (напряму в response)
            response.setTotalElements(searchPage.getTotalElements());
            response.setTotalPages(searchPage.getTotalPages());
            response.setFirst(searchPage.isFirst());
            response.setLast(searchPage.isLast());
            response.setNumberOfElements(searchPage.getNumberOfElements());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // === PRIVATE HELPER METHODS ===

    /**
     * Підсвічування знайдених полів у результатах пошуку
     */
    private void highlightSearchResults(List<ClientSearchResult> results, String query) {
        String lowerQuery = query.toLowerCase();

        results.forEach(result -> {
            List<String> highlightedFields = new java.util.ArrayList<>();

            // Перевірка співпадінь у різних полях
            if (result.getFirstName() != null &&
                result.getFirstName().toLowerCase().contains(lowerQuery)) {
                highlightedFields.add("firstName");
            }

            if (result.getLastName() != null &&
                result.getLastName().toLowerCase().contains(lowerQuery)) {
                highlightedFields.add("lastName");
            }

            if (result.getPhone() != null &&
                result.getPhone().contains(query)) {
                highlightedFields.add("phone");
            }

            if (result.getEmail() != null &&
                result.getEmail().toLowerCase().contains(lowerQuery)) {
                highlightedFields.add("email");
            }

            result.setHighlightedFields(highlightedFields);
        });
    }
}
