package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.dto.client.ClientCreateRequest;
import com.aksi.dto.client.ClientResponse;
import com.aksi.dto.client.ClientSearchRequest;
import com.aksi.dto.client.ClientUpdateRequest;
import com.aksi.service.client.ClientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для роботи з клієнтами
 */
@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Clients", description = "API для управління клієнтами")
public class ClientController {
    
    private final ClientService clientService;
    
    /**
     * Пошук клієнтів з пагінацією, сортуванням та фільтрацією
     * @param request параметри пошуку
     * @return сторінка з клієнтами
     */
    @PostMapping("/search")
    @Operation(summary = "Пошук клієнтів", 
               description = "Повертає список клієнтів з пагінацією, сортуванням та фільтрацією")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<Page<ClientResponse>> searchClients(
            @RequestBody ClientSearchRequest request) {
        log.info("Отримано запит на пошук клієнтів");
        return ResponseEntity.ok(clientService.searchClients(request));
    }
    
    /**
     * Отримання клієнта за ідентифікатором
     * @param id ідентифікатор клієнта
     * @return дані клієнта
     */
    @GetMapping("/{id}")
    @Operation(summary = "Отримання клієнта", 
               description = "Повертає клієнта за ідентифікатором")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ClientResponse> getClientById(
            @Parameter(description = "Ідентифікатор клієнта") 
            @PathVariable UUID id) {
        log.info("Отримано запит на отримання клієнта з ID: {}", id);
        return ResponseEntity.ok(clientService.getClientById(id));
    }
    
    /**
     * Створення нового клієнта
     * @param request дані для створення клієнта
     * @return створений клієнт
     */
    @PostMapping
    @Operation(summary = "Створення клієнта", 
               description = "Створює нового клієнта з переданими даними")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ClientResponse> createClient(
            @Valid @RequestBody ClientCreateRequest request) {
        log.info("Отримано запит на створення клієнта: {}", request.getFullName());
        return new ResponseEntity<>(clientService.createClient(request), HttpStatus.CREATED);
    }
    
    /**
     * Оновлення клієнта
     * @param id ідентифікатор клієнта
     * @param request дані для оновлення клієнта
     * @return оновлений клієнт
     */
    @PutMapping("/{id}")
    @Operation(summary = "Оновлення клієнта", 
               description = "Оновлює існуючого клієнта за ідентифікатором")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ClientResponse> updateClient(
            @Parameter(description = "Ідентифікатор клієнта") 
            @PathVariable UUID id,
            @Valid @RequestBody ClientUpdateRequest request) {
        log.info("Отримано запит на оновлення клієнта з ID: {}", id);
        return ResponseEntity.ok(clientService.updateClient(id, request));
    }
    
    /**
     * Видалення клієнта
     * @param id ідентифікатор клієнта
     * @return статус відповіді
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Видалення клієнта", 
               description = "Видаляє клієнта за ідентифікатором")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteClient(
            @Parameter(description = "Ідентифікатор клієнта") 
            @PathVariable UUID id) {
        log.info("Отримано запит на видалення клієнта з ID: {}", id);
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Отримання найбільш лояльних клієнтів
     * @param limit кількість клієнтів (за замовчуванням 10)
     * @return список найбільш лояльних клієнтів
     */
    @GetMapping("/top/loyal")
    @Operation(summary = "Найбільш лояльні клієнти", 
               description = "Повертає список найбільш лояльних клієнтів")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ClientResponse>> getTopLoyalClients(
            @Parameter(description = "Кількість клієнтів") 
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Отримано запит на топ {} лояльних клієнтів", limit);
        return ResponseEntity.ok(clientService.getTopLoyalClients(limit));
    }
    
    /**
     * Отримання клієнтів з найбільшою сумою замовлень
     * @param limit кількість клієнтів (за замовчуванням 10)
     * @return список клієнтів з найбільшою сумою замовлень
     */
    @GetMapping("/top/spending")
    @Operation(summary = "Клієнти з найбільшою сумою замовлень", 
               description = "Повертає список клієнтів з найбільшою сумою замовлень")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<ClientResponse>> getTopSpendingClients(
            @Parameter(description = "Кількість клієнтів") 
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Отримано запит на топ {} клієнтів за витратами", limit);
        return ResponseEntity.ok(clientService.getTopSpendingClients(limit));
    }
} 