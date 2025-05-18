package com.aksi.api;

import java.util.List;
import java.util.UUID;

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
import com.aksi.util.ApiResponseUtils;

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
    public ResponseEntity<?> getAllClients() {
        try {
            List<ClientResponse> clients = clientService.getAllClients();
            return ApiResponseUtils.ok(clients, "REST запит на отримання всіх клієнтів");
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні списку клієнтів", 
                "Не вдалося отримати список клієнтів. Причина: {}", e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Отримати клієнта за ID", description = "Повертає дані клієнта за його ID")
    @ApiResponse(responseCode = "200", description = "Успішно отримано дані клієнта",
            content = @Content(schema = @Schema(implementation = ClientResponse.class)))
    @ApiResponse(responseCode = "404", description = "Клієнта не знайдено")
    public ResponseEntity<?> getClientById(
            @Parameter(description = "ID клієнта", required = true) @PathVariable UUID id) {
        try {
            ClientResponse client = clientService.getClientById(id);
            return ApiResponseUtils.ok(client, "REST запит на отримання клієнта за ID: {}", id);
        } catch (Exception e) {
            return ApiResponseUtils.notFound("Клієнта не знайдено", 
                "Не вдалося знайти клієнта з ID: {}. Причина: {}", id, e.getMessage());
        }
    }
    
    @GetMapping("/search")
    @Operation(summary = "Пошук клієнтів", description = "Пошук клієнтів за ключовим словом")
    @ApiResponse(responseCode = "200", description = "Успішно отримано результати пошуку",
            content = @Content(schema = @Schema(implementation = ClientResponse.class)))
    public ResponseEntity<?> searchClients(
            @Parameter(description = "Ключове слово для пошуку") @RequestParam String keyword) {
        try {
            List<ClientResponse> clients = clientService.searchClients(keyword);
            return ApiResponseUtils.ok(clients, "REST запит на пошук клієнтів за ключовим словом: {}", keyword);
        } catch (Exception e) {
            return ApiResponseUtils.badRequest("Помилка при пошуку клієнтів", 
                "Не вдалося виконати пошук клієнтів за ключовим словом: {}. Причина: {}", keyword, e.getMessage());
        }
    }
    
    @PostMapping
    @Operation(summary = "Створити нового клієнта", description = "Створює нового клієнта з наданими даними")
    @ApiResponse(responseCode = "201", description = "Клієнта успішно створено",
            content = @Content(schema = @Schema(implementation = ClientResponse.class)))
    @ApiResponse(responseCode = "400", description = "Невірні дані")
    public ResponseEntity<?> createClient(
            @Parameter(description = "Дані нового клієнта", required = true) 
            @Valid @RequestBody CreateClientRequest request) {
        try {
            ClientResponse client = clientService.createClient(request);
            return ApiResponseUtils.created(client, "REST запит на створення нового клієнта: {}", request);
        } catch (Exception e) {
            return ApiResponseUtils.badRequest("Помилка при створенні клієнта", 
                "Не вдалося створити клієнта. Причина: {}", e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Оновити клієнта", description = "Оновлює дані існуючого клієнта")
    @ApiResponse(responseCode = "200", description = "Клієнта успішно оновлено",
            content = @Content(schema = @Schema(implementation = ClientResponse.class)))
    @ApiResponse(responseCode = "400", description = "Невірні дані")
    @ApiResponse(responseCode = "404", description = "Клієнта не знайдено")
    public ResponseEntity<?> updateClient(
            @Parameter(description = "ID клієнта", required = true) @PathVariable UUID id,
            @Parameter(description = "Дані для оновлення клієнта", required = true) 
            @Valid @RequestBody UpdateClientRequest request) {
        try {
            ClientResponse client = clientService.updateClient(id, request);
            return ApiResponseUtils.ok(client, "REST запит на оновлення клієнта {}: {}", id, request);
        } catch (Exception e) {
            return ApiResponseUtils.notFound("Клієнта не знайдено або помилка при оновленні", 
                "Не вдалося оновити клієнта з ID: {}. Причина: {}", id, e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Видалити клієнта", description = "Видаляє клієнта за його ID")
    @ApiResponse(responseCode = "204", description = "Клієнта успішно видалено")
    @ApiResponse(responseCode = "404", description = "Клієнта не знайдено")
    public ResponseEntity<?> deleteClient(
            @Parameter(description = "ID клієнта", required = true) @PathVariable UUID id) {
        try {
            clientService.deleteClient(id);
            return ApiResponseUtils.noContent("REST запит на видалення клієнта: {}", id);
        } catch (Exception e) {
            return ApiResponseUtils.notFound("Клієнта не знайдено або помилка при видаленні", 
                "Не вдалося видалити клієнта з ID: {}. Причина: {}", id, e.getMessage());
        }
    }
}
