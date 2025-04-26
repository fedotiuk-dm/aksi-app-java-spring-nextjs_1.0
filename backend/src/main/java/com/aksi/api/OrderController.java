package com.aksi.api;

import java.math.BigDecimal;
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
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.model.OrderStatusEnum;
import com.aksi.domain.order.service.OrderService;
import com.aksi.exceptions.EntityNotFoundException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST контролер для операцій з замовленнями.
 */
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Orders", description = "API для управління замовленнями")
public class OrderController {
    
    private final OrderService orderService;
    
    @GetMapping
    @Operation(summary = "Отримати всі замовлення", description = "Повертає список всіх замовлень")
    @ApiResponse(responseCode = "200", description = "Успішно отримано список замовлень",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderDTO.class))))
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        log.debug("REST запит на отримання всіх замовлень");
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Отримати замовлення за ID", description = "Повертає замовлення за його ID")
    @ApiResponse(responseCode = "200", description = "Замовлення знайдено",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<OrderDTO> getOrderById(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id) {
        log.debug("REST запит на отримання замовлення за ID: {}", id);
        
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Замовлення не знайдено", id));
    }
    
    @PostMapping
    @Operation(summary = "Створити нове замовлення", description = "Створює нове замовлення")
    @ApiResponse(responseCode = "201", description = "Замовлення успішно створено",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    public ResponseEntity<OrderDTO> createOrder(
            @Parameter(description = "Дані для створення замовлення", required = true)
            @Valid @RequestBody CreateOrderRequest request) {
        log.debug("REST запит на створення нового замовлення");
        
        OrderDTO createdOrder = orderService.createOrder(request);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }
    
    @PostMapping("/draft")
    @Operation(summary = "Зберегти чернетку замовлення", description = "Зберігає замовлення як чернетку")
    @ApiResponse(responseCode = "201", description = "Чернетку замовлення успішно збережено",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    public ResponseEntity<OrderDTO> saveOrderDraft(
            @Parameter(description = "Дані для чернетки замовлення", required = true)
            @Valid @RequestBody CreateOrderRequest request) {
        log.debug("REST запит на збереження чернетки замовлення");
        
        OrderDTO draftOrder = orderService.saveOrderDraft(request);
        return new ResponseEntity<>(draftOrder, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}/status/{status}")
    @Operation(summary = "Оновити статус замовлення", description = "Оновлює статус замовлення")
    @ApiResponse(responseCode = "200", description = "Статус замовлення успішно оновлено",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id,
            @Parameter(description = "Новий статус замовлення", required = true) @PathVariable OrderStatusEnum status) {
        log.debug("REST запит на оновлення статусу замовлення {} на {}", id, status);
        
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
    
    @PutMapping("/{id}/convert-draft")
    @Operation(summary = "Перетворити чернетку на замовлення", 
               description = "Перетворює чернетку на активне замовлення")
    @ApiResponse(responseCode = "200", description = "Чернетку успішно перетворено на замовлення",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<OrderDTO> convertDraftToOrder(
            @Parameter(description = "ID чернетки замовлення", required = true) @PathVariable UUID id) {
        log.debug("REST запит на перетворення чернетки {} на активне замовлення", id);
        
        OrderDTO convertedOrder = orderService.convertDraftToOrder(id);
        return ResponseEntity.ok(convertedOrder);
    }
    
    @PutMapping("/{id}/discount/{amount}")
    @Operation(summary = "Застосувати знижку", description = "Застосовує знижку до замовлення")
    @ApiResponse(responseCode = "200", description = "Знижку успішно застосовано",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<OrderDTO> applyDiscount(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id,
            @Parameter(description = "Сума знижки", required = true) @PathVariable BigDecimal amount) {
        log.debug("REST запит на застосування знижки {} до замовлення {}", amount, id);
        
        OrderDTO updatedOrder = orderService.applyDiscount(id, amount);
        return ResponseEntity.ok(updatedOrder);
    }
    
    @PutMapping("/{id}/prepayment/{amount}")
    @Operation(summary = "Додати передоплату", description = "Додає передоплату до замовлення")
    @ApiResponse(responseCode = "200", description = "Передоплату успішно додано",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<OrderDTO> addPrepayment(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id,
            @Parameter(description = "Сума передоплати", required = true) @PathVariable BigDecimal amount) {
        log.debug("REST запит на додавання передоплати {} до замовлення {}", amount, id);
        
        OrderDTO updatedOrder = orderService.addPrepayment(id, amount);
        return ResponseEntity.ok(updatedOrder);
    }
    
    @PutMapping("/{id}/complete")
    @Operation(summary = "Відзначити замовлення як виконане", 
               description = "Відзначає замовлення як виконане")
    @ApiResponse(responseCode = "200", description = "Замовлення успішно відзначено як виконане",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<OrderDTO> completeOrder(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id) {
        log.debug("REST запит на відзначення замовлення {} як виконане", id);
        
        OrderDTO completedOrder = orderService.completeOrder(id);
        return ResponseEntity.ok(completedOrder);
    }
    
    @DeleteMapping("/{id}/cancel")
    @Operation(summary = "Скасувати замовлення", description = "Скасовує замовлення")
    @ApiResponse(responseCode = "204", description = "Замовлення успішно скасовано")
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<Void> cancelOrder(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id) {
        log.debug("REST запит на скасування замовлення {}", id);
        
        orderService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/active")
    @Operation(summary = "Отримати активні замовлення", 
               description = "Повертає список активних замовлень")
    @ApiResponse(responseCode = "200", description = "Успішно отримано список активних замовлень",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderDTO.class))))
    public ResponseEntity<List<OrderDTO>> getActiveOrders() {
        log.debug("REST запит на отримання активних замовлень");
        return ResponseEntity.ok(orderService.getActiveOrders());
    }
    
    @GetMapping("/drafts")
    @Operation(summary = "Отримати чернетки замовлень", 
               description = "Повертає список чернеток замовлень")
    @ApiResponse(responseCode = "200", description = "Успішно отримано список чернеток замовлень",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderDTO.class))))
    public ResponseEntity<List<OrderDTO>> getDraftOrders() {
        log.debug("REST запит на отримання чернеток замовлень");
        return ResponseEntity.ok(orderService.getDraftOrders());
    }
}
