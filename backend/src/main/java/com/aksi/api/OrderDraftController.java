package com.aksi.api;

import com.aksi.dto.order.OrderDraftDto;
import com.aksi.dto.order.OrderDraftRequest;
import com.aksi.service.order.OrderDraftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST контролер для роботи з чернетками замовлень.
 */
@RestController
@RequestMapping("/orders/drafts")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Order Drafts", description = "API для роботи з чернетками замовлень")
public class OrderDraftController {

    private final OrderDraftService orderDraftService;

    @PostMapping
    @Operation(summary = "Створити чернетку замовлення", 
               description = "Створює нову чернетку замовлення з переданими даними")
    public ResponseEntity<OrderDraftDto> createDraft(
            @Valid @RequestBody OrderDraftRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("REST запит на створення чернетки замовлення");
        OrderDraftDto result = orderDraftService.createDraft(request, userDetails.getUsername());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Оновити чернетку замовлення", 
               description = "Оновлює існуючу чернетку замовлення за заданим ID")
    public ResponseEntity<OrderDraftDto> updateDraft(
            @Parameter(description = "ID чернетки", required = true)
            @PathVariable UUID id,
            @Valid @RequestBody OrderDraftRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("REST запит на оновлення чернетки замовлення з ID: {}", id);
        OrderDraftDto result = orderDraftService.updateDraft(id, request, userDetails.getUsername());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Отримати чернетку за ID", 
               description = "Повертає чернетку замовлення з заданим ID")
    public ResponseEntity<OrderDraftDto> getDraftById(
            @Parameter(description = "ID чернетки", required = true)
            @PathVariable UUID id) {
        
        log.info("REST запит на отримання чернетки замовлення з ID: {}", id);
        OrderDraftDto result = orderDraftService.getDraftById(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Отримати чернетки для клієнта", 
               description = "Повертає сторінку з чернетками замовлень для заданого клієнта")
    public ResponseEntity<Page<OrderDraftDto>> getDraftsByClient(
            @Parameter(description = "ID клієнта", required = true)
            @PathVariable UUID clientId,
            Pageable pageable) {
        
        log.info("REST запит на отримання чернеток замовлень для клієнта з ID: {}", clientId);
        Page<OrderDraftDto> result = orderDraftService.getDraftsByClient(clientId, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user")
    @Operation(summary = "Отримати чернетки поточного користувача", 
               description = "Повертає сторінку з чернетками замовлень, створеними поточним користувачем")
    public ResponseEntity<Page<OrderDraftDto>> getCurrentUserDrafts(
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        log.info("REST запит на отримання чернеток замовлень для користувача: {}", userDetails.getUsername());
        Page<OrderDraftDto> result = orderDraftService.getDraftsByUser(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Видалити чернетку", 
               description = "Видаляє чернетку замовлення з заданим ID")
    public ResponseEntity<Void> deleteDraft(
            @Parameter(description = "ID чернетки", required = true)
            @PathVariable UUID id) {
        
        log.info("REST запит на видалення чернетки замовлення з ID: {}", id);
        orderDraftService.deleteDraft(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{draftId}/convert/{orderId}")
    @Operation(summary = "Позначити чернетку як конвертовану", 
               description = "Позначає чернетку як конвертовану в замовлення")
    public ResponseEntity<OrderDraftDto> markAsConverted(
            @Parameter(description = "ID чернетки", required = true)
            @PathVariable UUID draftId,
            @Parameter(description = "ID замовлення", required = true)
            @PathVariable UUID orderId) {
        
        log.info("REST запит на позначення чернетки з ID: {} як конвертованої в замовлення з ID: {}", draftId, orderId);
        OrderDraftDto result = orderDraftService.markAsConverted(draftId, orderId);
        return ResponseEntity.ok(result);
    }
}
