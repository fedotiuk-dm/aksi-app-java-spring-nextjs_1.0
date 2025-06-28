package com.aksi.domain.client.delegate;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.aksi.api.client.ClientsApiDelegate;
import com.aksi.api.client.dto.ClientPageResponse;
import com.aksi.api.client.dto.ClientResponse;
import com.aksi.api.client.dto.ClientStatistics;
import com.aksi.api.client.dto.CreateClientRequest;
import com.aksi.api.client.dto.PageableInfo;
import com.aksi.api.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.client.service.ClientAnalyticsService;
import com.aksi.domain.client.service.ClientCrudService;

/**
 * ============================================================================
 * CLIENTS API DELEGATE - ОСНОВНІ CRUD ОПЕРАЦІЇ З КЛІЄНТАМИ
 * ============================================================================
 *
 * ВІДПОВІДАЛЬНІСТЬ:
 * • GET /api/clients - отримання списку клієнтів з пагінацією
 * • POST /api/clients - створення нового клієнта
 * • GET /api/clients/{id} - отримання клієнта за UUID
 * • PUT /api/clients/{id} - оновлення існуючого клієнта
 * • DELETE /api/clients/{id} - м'яке видалення клієнта
 * • GET /api/clients/{id}/statistics - отримання статистики клієнта
 *
 * АРХІТЕКТУРНІ ПРИНЦИПИ:
 * • Тонкий шар між API та Service рівнем
 * • DTO конвертація через ClientMapper
 * • Functional Programming: Optional + map/filter
 * • Proper HTTP Status Codes: 200 OK, 201 Created, 404 Not Found, 400 Bad Request
 */
@Component
public class ClientsApiDelegateImpl implements ClientsApiDelegate {

    private final ClientCrudService clientService;
    private final ClientAnalyticsService statisticsService;
    private final ClientMapper clientMapper;

    public ClientsApiDelegateImpl(
        ClientCrudService clientService,
        ClientAnalyticsService statisticsService,
        ClientMapper clientMapper
    ) {
        this.clientService = clientService;
        this.statisticsService = statisticsService;
        this.clientMapper = clientMapper;
    }

    /**
     * GET /api/clients - Отримання списку клієнтів з пагінацією
     */
    @Override
    public ResponseEntity<ClientPageResponse> getClients(Integer page, Integer size, String sort) {
        // Валідація параметрів
        int validPage = Math.max(0, page != null ? page : 0);
        int validSize = Math.min(100, Math.max(1, size != null ? size : 20));

        Pageable pageable = PageRequest.of(validPage, validSize);
        Page<ClientEntity> clientPage = clientService.getAllClients(pageable);

        // Конверсія до DTO згідно згенерованої схеми
        ClientPageResponse response = new ClientPageResponse();
        response.setContent(clientMapper.toClientResponseList(clientPage.getContent()));

        // PageableInfo тільки з основними параметрами (page, size, sort)
        PageableInfo pageInfo = new PageableInfo();
        pageInfo.setPage(clientPage.getNumber());
        pageInfo.setSize(clientPage.getSize());
        response.setPageable(pageInfo);

        // Метадані пагінації на рівні response
        response.setTotalElements(clientPage.getTotalElements());
        response.setTotalPages(clientPage.getTotalPages());
        response.setFirst(clientPage.isFirst());
        response.setLast(clientPage.isLast());
        response.setNumberOfElements(clientPage.getNumberOfElements());

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/clients - Створення нового клієнта
     */
    @Override
    public ResponseEntity<ClientResponse> createClient(CreateClientRequest createClientRequest) {
        try {
            // Конверсія DTO до Entity
            ClientEntity entity = clientMapper.toEntity(createClientRequest);

            // Збереження через сервіс
            ClientEntity savedEntity = clientService.createClient(entity);

            // Конверсія назад до DTO
            ClientResponse response = clientMapper.toClientResponse(savedEntity);

            // Додавання статистики
            statisticsService.getClientStatistics(savedEntity.getUuid())
                .ifPresent(stats -> response.setStatistics(clientMapper.toClientStatisticsDto(stats)));

            return ResponseEntity.status(201).body(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/clients/{id} - Отримання клієнта за UUID
     */
    @Override
    public ResponseEntity<ClientResponse> getClientById(UUID id) {
        return clientService.findByUuid(id)
            .map(entity -> {
                ClientResponse response = clientMapper.toClientResponse(entity);

                // Додавання статистики
                statisticsService.getClientStatistics(entity.getUuid())
                    .ifPresent(stats -> response.setStatistics(clientMapper.toClientStatisticsDto(stats)));

                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT /api/clients/{id} - Оновлення існуючого клієнта
     */
    @Override
    public ResponseEntity<ClientResponse> updateClient(UUID id, UpdateClientRequest updateClientRequest) {
        return clientService.findByUuid(id)
            .map(existingEntity -> {
                try {
                    // Оновлення Entity з DTO
                    clientMapper.updateEntityFromRequest(updateClientRequest, existingEntity);

                    // Збереження змін
                    ClientEntity updatedEntity = clientService.updateClient(existingEntity);

                    // Конверсія до DTO
                    ClientResponse response = clientMapper.toClientResponse(updatedEntity);

                    // Додавання статистики
                    statisticsService.getClientStatistics(updatedEntity.getUuid())
                        .ifPresent(stats -> response.setStatistics(clientMapper.toClientStatisticsDto(stats)));

                    return ResponseEntity.ok(response);

                } catch (IllegalArgumentException e) {
                    // Правильний спосіб повернення помилки без cast
                    ClientResponse errorResponse = null;
                    return ResponseEntity.badRequest().body(errorResponse);
                } catch (Exception e) {
                    ClientResponse errorResponse = null;
                    return ResponseEntity.internalServerError().body(errorResponse);
                }
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/clients/{id} - М'яке видалення клієнта
     */
    @Override
    public ResponseEntity<Void> deleteClient(UUID id) {
        boolean deleted = clientService.deleteClient(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    /**
     * GET /api/clients/{id}/statistics - Отримання статистики клієнта
     */
    @Override
    public ResponseEntity<ClientStatistics> getClientStatistics(UUID id) {
        return statisticsService.getClientStatistics(id)
            .map(stats -> ResponseEntity.ok(clientMapper.toClientStatisticsDto(stats)))
            .orElse(ResponseEntity.notFound().build());
    }
}
