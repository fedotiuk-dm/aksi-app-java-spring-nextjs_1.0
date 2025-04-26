package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
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
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.dto.UpdateClientRequest;
import com.aksi.domain.client.service.ClientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для операцій з клієнтами.
 */
@RestController
@RequestMapping("/clients") 
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Clients", description = "API для управління клієнтами")
public class ClientsController {
    
    private final ClientService clientService;
    
    @GetMapping
    @Operation(summary = "Отримати всіх клієнтів", description = "Повертає список всіх клієнтів")
    @ApiResponse(responseCode = "200", description = "Успішно отримано список клієнтів",
            content = @Content(schema = @Schema(implementation = ClientResponse.class)))
    public ResponseEntity<List<ClientResponse>> getAllClients() {
        log.debug("REST запит на отримання всіх клієнтів");
        return ResponseEntity.ok(clientService.getAllClients());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Отримати клієнта за ID", description = "Повертає дані клієнта за його ID")
    @ApiResponse(responseCode = "200", description = "Успішно отримано дані клієнта",
            content = @Content(schema = @Schema(implementation = ClientResponse.class)))
    @ApiResponse(responseCode = "404", description = "Клієнта не знайдено")
    public ResponseEntity<ClientResponse> getClientById(
            @Parameter(description = "ID клієнта", required = true) @PathVariable UUID id) {
        log.debug("REST запит на отримання клієнта за ID: {}", id);
        return ResponseEntity.ok(clientService.getClientById(id));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Пошук клієнтів", description = "Пошук клієнтів за ключовим словом")
    @ApiResponse(responseCode = "200", description = "Успішно отримано результати пошуку",
            content = @Content(schema = @Schema(implementation = ClientResponse.class)))
    public ResponseEntity<List<ClientResponse>> searchClients(
            @Parameter(description = "Ключове слово для пошуку") @RequestParam String keyword) {
        log.debug("REST запит на пошук клієнтів за ключовим словом: {}", keyword);
        return ResponseEntity.ok(clientService.searchClients(keyword));
    }
    
    @PostMapping
    @Operation(summary = "Створити нового клієнта", description = "Створює нового клієнта з наданими даними")
    @ApiResponse(responseCode = "201", description = "Клієнта успішно створено",
            content = @Content(schema = @Schema(implementation = ClientResponse.class)))
    @ApiResponse(responseCode = "400", description = "Невірні дані")
    public ResponseEntity<ClientResponse> createClient(
            @Parameter(description = "Дані нового клієнта", required = true) 
            @Valid @RequestBody CreateClientRequest request) {
        log.debug("REST запит на створення нового клієнта: {}", request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clientService.createClient(request));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Оновити клієнта", description = "Оновлює дані існуючого клієнта")
    @ApiResponse(responseCode = "200", description = "Клієнта успішно оновлено",
            content = @Content(schema = @Schema(implementation = ClientResponse.class)))
    @ApiResponse(responseCode = "400", description = "Невірні дані")
    @ApiResponse(responseCode = "404", description = "Клієнта не знайдено")
    public ResponseEntity<ClientResponse> updateClient(
            @Parameter(description = "ID клієнта", required = true) @PathVariable UUID id,
            @Parameter(description = "Дані для оновлення клієнта", required = true) 
            @Valid @RequestBody UpdateClientRequest request) {
        log.debug("REST запит на оновлення клієнта {}: {}", id, request);
        return ResponseEntity.ok(clientService.updateClient(id, request));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Видалити клієнта", description = "Видаляє клієнта за його ID")
    @ApiResponse(responseCode = "204", description = "Клієнта успішно видалено")
    @ApiResponse(responseCode = "404", description = "Клієнта не знайдено")
    public ResponseEntity<Void> deleteClient(
            @Parameter(description = "ID клієнта", required = true) @PathVariable UUID id) {
        log.debug("REST запит на видалення клієнта: {}", id);
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
