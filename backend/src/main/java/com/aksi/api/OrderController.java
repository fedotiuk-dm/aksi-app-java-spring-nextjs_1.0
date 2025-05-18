package com.aksi.api;

import java.math.BigDecimal;
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
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.CreateOrderRequest;
import com.aksi.domain.order.dto.OrderDTO;
import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.model.OrderStatusEnum;
import com.aksi.domain.order.service.OrderService;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.util.ApiResponseUtils;

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
    public ResponseEntity<?> getAllOrders() {
        log.debug("Запит на отримання всіх замовлень");
        try {
            List<OrderDTO> orders = orderService.getAllOrders();
            return ApiResponseUtils.ok(orders, "Отримано {} замовлень", orders.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при отриманні замовлень", 
                "Не вдалося отримати список замовлень. Причина: {}", 
                e.getMessage()
            );
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Отримати замовлення за ID", description = "Повертає замовлення за його ID")
    @ApiResponse(responseCode = "200", description = "Замовлення знайдено",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> getOrderById(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id) {
        log.debug("Запит на отримання замовлення за ID: {}", id);
        
        try {
            return orderService.getOrderById(id)
                    .map(order -> ApiResponseUtils.ok(order, "Отримано замовлення з ID: {}", id))
                    .orElseThrow(() -> EntityNotFoundException.withId(id));
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Замовлення не знайдено", 
                "Замовлення з ID: {} не знайдено", 
                id
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при отриманні замовлення", 
                "Не вдалося отримати замовлення з ID: {}. Причина: {}", 
                id, e.getMessage()
            );
        }
    }
    
    @PostMapping
    @Operation(summary = "Створити нове замовлення", description = "Створює нове замовлення")
    @ApiResponse(responseCode = "201", description = "Замовлення успішно створено",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    public ResponseEntity<?> createOrder(
            @Parameter(description = "Дані для створення замовлення", required = true)
            @Valid @RequestBody CreateOrderRequest request) {
        log.debug("Запит на створення нового замовлення");
        
        try {
            OrderDTO createdOrder = orderService.createOrder(request);
            return ApiResponseUtils.created(createdOrder, "Успішно створено нове замовлення з ID: {}", createdOrder.getId());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest(
                "Неправильні параметри для створення замовлення", 
                "Не вдалося створити замовлення. Причина: {}", 
                e.getMessage()
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при створенні замовлення", 
                "Не вдалося створити замовлення. Причина: {}", 
                e.getMessage()
            );
        }
    }
    
    @PostMapping("/draft")
    @Operation(summary = "Зберегти чернетку замовлення", description = "Зберігає замовлення як чернетку")
    @ApiResponse(responseCode = "201", description = "Чернетку замовлення успішно збережено",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    public ResponseEntity<?> saveOrderDraft(
            @Parameter(description = "Дані для чернетки замовлення", required = true)
            @Valid @RequestBody CreateOrderRequest request) {
        log.debug("Запит на збереження чернетки замовлення");
        
        try {
            OrderDTO draftOrder = orderService.saveOrderDraft(request);
            return ApiResponseUtils.created(draftOrder, "Успішно збережено чернетку замовлення з ID: {}", draftOrder.getId());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest(
                "Неправильні параметри для збереження чернетки", 
                "Не вдалося зберегти чернетку замовлення. Причина: {}", 
                e.getMessage()
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при збереженні чернетки", 
                "Не вдалося зберегти чернетку замовлення. Причина: {}", 
                e.getMessage()
            );
        }
    }
    
    @PutMapping("/{id}/status/{status}")
    @Operation(summary = "Оновити статус замовлення", description = "Оновлює статус замовлення")
    @ApiResponse(responseCode = "200", description = "Статус замовлення успішно оновлено",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> updateOrderStatus(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id,
            @Parameter(description = "Новий статус замовлення", required = true) @PathVariable OrderStatusEnum status) {
        log.debug("Запит на оновлення статусу замовлення {} на {}", id, status);
        
        try {
            OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
            return ApiResponseUtils.ok(updatedOrder, "Успішно оновлено статус замовлення {} на {}", id, status);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Замовлення не знайдено", 
                "Замовлення з ID: {} не знайдено", 
                id
            );
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest(
                "Неправильні параметри для оновлення статусу", 
                "Не вдалося оновити статус замовлення {}. Причина: {}", 
                id, e.getMessage()
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при оновленні статусу замовлення", 
                "Не вдалося оновити статус замовлення {}. Причина: {}", 
                id, e.getMessage()
            );
        }
    }
    
    @PutMapping("/{id}/convert-draft")
    @Operation(summary = "Перетворити чернетку на замовлення", 
               description = "Перетворює чернетку на активне замовлення")
    @ApiResponse(responseCode = "200", description = "Чернетку успішно перетворено на замовлення",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> convertDraftToOrder(
            @Parameter(description = "ID чернетки замовлення", required = true) @PathVariable UUID id) {
        log.debug("Запит на перетворення чернетки {} на активне замовлення", id);
        
        try {
            OrderDTO convertedOrder = orderService.convertDraftToOrder(id);
            return ApiResponseUtils.ok(convertedOrder, "Успішно перетворено чернетку {} на активне замовлення", id);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Чернетку не знайдено", 
                "Чернетку з ID: {} не знайдено", 
                id
            );
        } catch (IllegalStateException e) {
            return ApiResponseUtils.badRequest(
                "Неможливо перетворити на активне замовлення", 
                "Неможливо перетворити чернетку {} на активне замовлення. Причина: {}", 
                id, e.getMessage()
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при перетворенні чернетки", 
                "Не вдалося перетворити чернетку {} на активне замовлення. Причина: {}", 
                id, e.getMessage()
            );
        }
    }
    
    @PutMapping("/{id}/discount/{amount}")
    @Operation(summary = "Застосувати знижку", description = "Застосовує знижку до замовлення")
    @ApiResponse(responseCode = "200", description = "Знижку успішно застосовано",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> applyDiscount(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id,
            @Parameter(description = "Сума знижки", required = true) @PathVariable BigDecimal amount) {
        log.debug("Запит на застосування знижки {} до замовлення {}", amount, id);
        
        try {
            OrderDTO updatedOrder = orderService.applyDiscount(id, amount);
            return ApiResponseUtils.ok(updatedOrder, "Успішно застосовано знижку {} до замовлення {}", amount, id);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Замовлення не знайдено", 
                "Замовлення з ID: {} не знайдено", 
                id
            );
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest(
                "Неправильні параметри для застосування знижки", 
                "Не вдалося застосувати знижку до замовлення {}. Причина: {}", 
                id, e.getMessage()
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при застосуванні знижки", 
                "Не вдалося застосувати знижку до замовлення {}. Причина: {}", 
                id, e.getMessage()
            );
        }
    }
    
    @PutMapping("/{id}/prepayment/{amount}")
    @Operation(summary = "Додати передоплату", description = "Додає передоплату до замовлення")
    @ApiResponse(responseCode = "200", description = "Передоплату успішно додано",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> addPrepayment(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id,
            @Parameter(description = "Сума передоплати", required = true) @PathVariable BigDecimal amount) {
        log.debug("Запит на додавання передоплати {} до замовлення {}", amount, id);
        
        try {
            OrderDTO updatedOrder = orderService.addPrepayment(id, amount);
            return ApiResponseUtils.ok(updatedOrder, "Успішно додано передоплату {} до замовлення {}", amount, id);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Замовлення не знайдено", 
                "Замовлення з ID: {} не знайдено", 
                id
            );
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest(
                "Неправильні параметри для додавання передоплати", 
                "Не вдалося додати передоплату до замовлення {}. Причина: {}", 
                id, e.getMessage()
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при додаванні передоплати", 
                "Не вдалося додати передоплату до замовлення {}. Причина: {}", 
                id, e.getMessage()
            );
        }
    }
    
    @PutMapping("/{id}/complete")
    @Operation(summary = "Відзначити замовлення як виконане", 
               description = "Відзначає замовлення як виконане")
    @ApiResponse(responseCode = "200", description = "Замовлення успішно відзначено як виконане",
            content = @Content(schema = @Schema(implementation = OrderDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> completeOrder(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id) {
        log.debug("Запит на відзначення замовлення {} як виконане", id);
        
        try {
            OrderDTO completedOrder = orderService.completeOrder(id);
            return ApiResponseUtils.ok(completedOrder, "Успішно відзначено замовлення {} як виконане", id);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Замовлення не знайдено", 
                "Замовлення з ID: {} не знайдено", 
                id
            );
        } catch (IllegalStateException e) {
            return ApiResponseUtils.badRequest(
                "Неможливо відзначити замовлення як виконане", 
                "Неможливо відзначити замовлення {} як виконане. Причина: {}", 
                id, e.getMessage()
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при відзначенні замовлення як виконане", 
                "Не вдалося відзначити замовлення {} як виконане. Причина: {}", 
                id, e.getMessage()
            );
        }
    }
    
    @DeleteMapping("/{id}/cancel")
    @Operation(summary = "Скасувати замовлення", description = "Скасовує замовлення")
    @ApiResponse(responseCode = "204", description = "Замовлення успішно скасовано")
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> cancelOrder(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID id) {
        log.debug("Запит на скасування замовлення {}", id);
        
        try {
            orderService.cancelOrder(id);
            return ApiResponseUtils.noContent("Успішно скасовано замовлення {}", id);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Замовлення не знайдено", 
                "Замовлення з ID: {} не знайдено", 
                id
            );
        } catch (IllegalStateException e) {
            return ApiResponseUtils.badRequest(
                "Неможливо скасувати замовлення", 
                "Неможливо скасувати замовлення {}. Причина: {}", 
                id, e.getMessage()
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при скасуванні замовлення", 
                "Не вдалося скасувати замовлення {}. Причина: {}", 
                id, e.getMessage()
            );
        }
    }
    
    @GetMapping("/active")
    @Operation(summary = "Отримати активні замовлення", 
               description = "Повертає список активних замовлень")
    @ApiResponse(responseCode = "200", description = "Успішно отримано список активних замовлень",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderDTO.class))))
    public ResponseEntity<?> getActiveOrders() {
        log.debug("Запит на отримання активних замовлень");
        
        try {
            List<OrderDTO> activeOrders = orderService.getActiveOrders();
            return ApiResponseUtils.ok(activeOrders, "Отримано {} активних замовлень", activeOrders.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при отриманні активних замовлень", 
                "Не вдалося отримати активні замовлення. Причина: {}", 
                e.getMessage()
            );
        }
    }
    
    @GetMapping("/drafts")
    @Operation(summary = "Отримати чернетки замовлень", 
               description = "Повертає список чернеток замовлень")
    @ApiResponse(responseCode = "200", description = "Успішно отримано список чернеток замовлень",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderDTO.class))))
    public ResponseEntity<?> getDraftOrders() {
        log.debug("Запит на отримання чернеток замовлень");
        
        try {
            List<OrderDTO> draftOrders = orderService.getDraftOrders();
            return ApiResponseUtils.ok(draftOrders, "Отримано {} чернеток замовлень", draftOrders.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при отриманні чернеток замовлень", 
                "Не вдалося отримати чернетки замовлень. Причина: {}", 
                e.getMessage()
            );
        }
    }
    
    @GetMapping("/{orderId}/items")
    @Operation(summary = "Отримати всі предмети замовлення", 
               description = "Повертає список всіх предметів для конкретного замовлення")
    @ApiResponse(responseCode = "200", description = "Успішно отримано список предметів замовлення",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = OrderItemDTO.class))))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> getOrderItems(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId) {
        log.debug("Запит на отримання всіх предметів замовлення {}", orderId);
        
        try {
            List<OrderItemDTO> items = orderService.getOrderItems(orderId);
            return ApiResponseUtils.ok(items, "Отримано {} предметів для замовлення {}", items.size(), orderId);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Замовлення не знайдено", 
                "Замовлення з ID: {} не знайдено", 
                orderId
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при отриманні предметів замовлення", 
                "Не вдалося отримати предмети замовлення {}. Причина: {}", 
                orderId, e.getMessage()
            );
        }
    }
    
    @GetMapping("/{orderId}/items/{itemId}")
    @Operation(summary = "Отримати конкретний предмет замовлення", 
               description = "Повертає предмет замовлення за його ID")
    @ApiResponse(responseCode = "200", description = "Предмет замовлення знайдено",
            content = @Content(schema = @Schema(implementation = OrderItemDTO.class)))
    @ApiResponse(responseCode = "404", description = "Предмет замовлення не знайдено")
    public ResponseEntity<?> getOrderItem(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId,
            @Parameter(description = "ID предмета", required = true) @PathVariable UUID itemId) {
        log.debug("Запит на отримання предмета {} замовлення {}", itemId, orderId);
        
        try {
            return orderService.getOrderItem(orderId, itemId)
                    .map(item -> ApiResponseUtils.ok(item, "Отримано предмет {} замовлення {}", itemId, orderId))
                    .orElseThrow(() -> EntityNotFoundException.withId(itemId));
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Предмет замовлення не знайдено", 
                "Предмет {} замовлення {} не знайдено", 
                itemId, orderId
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при отриманні предмета замовлення", 
                "Не вдалося отримати предмет {} замовлення {}. Причина: {}", 
                itemId, orderId, e.getMessage()
            );
        }
    }
    
    @PostMapping("/{orderId}/items")
    @Operation(summary = "Додати новий предмет до замовлення", 
               description = "Додає новий предмет до конкретного замовлення")
    @ApiResponse(responseCode = "201", description = "Предмет успішно додано до замовлення",
            content = @Content(schema = @Schema(implementation = OrderItemDTO.class)))
    @ApiResponse(responseCode = "404", description = "Замовлення не знайдено")
    public ResponseEntity<?> addOrderItem(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId,
            @Parameter(description = "Дані предмета", required = true) 
            @Valid @RequestBody OrderItemDTO itemDTO) {
        log.debug("Запит на додавання нового предмета до замовлення {}", orderId);
        
        try {
            OrderItemDTO addedItem = orderService.addOrderItem(orderId, itemDTO);
            return ApiResponseUtils.created(addedItem, "Успішно додано новий предмет до замовлення {}", orderId);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Замовлення не знайдено", 
                "Замовлення з ID: {} не знайдено", 
                orderId
            );
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest(
                "Неправильні параметри предмета", 
                "Не вдалося додати предмет до замовлення {}. Причина: {}", 
                orderId, e.getMessage()
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при додаванні предмета", 
                "Не вдалося додати предмет до замовлення {}. Причина: {}", 
                orderId, e.getMessage()
            );
        }
    }
    
    @PutMapping("/{orderId}/items/{itemId}")
    @Operation(summary = "Оновити предмет замовлення", 
               description = "Оновлює існуючий предмет у замовленні")
    @ApiResponse(responseCode = "200", description = "Предмет замовлення успішно оновлено",
            content = @Content(schema = @Schema(implementation = OrderItemDTO.class)))
    @ApiResponse(responseCode = "404", description = "Предмет замовлення не знайдено")
    public ResponseEntity<?> updateOrderItem(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId,
            @Parameter(description = "ID предмета", required = true) @PathVariable UUID itemId,
            @Parameter(description = "Оновлені дані предмета", required = true) 
            @Valid @RequestBody OrderItemDTO itemDTO) {
        log.debug("Запит на оновлення предмета {} у замовленні {}", itemId, orderId);
        
        try {
            OrderItemDTO updatedItem = orderService.updateOrderItem(orderId, itemId, itemDTO);
            return ApiResponseUtils.ok(updatedItem, "Успішно оновлено предмет {} у замовленні {}", itemId, orderId);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Предмет або замовлення не знайдено", 
                "Предмет {} замовлення {} не знайдено", 
                itemId, orderId
            );
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest(
                "Неправильні параметри для оновлення предмета", 
                "Не вдалося оновити предмет {} у замовленні {}. Причина: {}", 
                itemId, orderId, e.getMessage()
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при оновленні предмета", 
                "Не вдалося оновити предмет {} у замовленні {}. Причина: {}", 
                itemId, orderId, e.getMessage()
            );
        }
    }
    
    @DeleteMapping("/{orderId}/items/{itemId}")
    @Operation(summary = "Видалити предмет замовлення", 
               description = "Видаляє предмет із замовлення")
    @ApiResponse(responseCode = "204", description = "Предмет замовлення успішно видалено")
    @ApiResponse(responseCode = "404", description = "Предмет замовлення не знайдено")
    public ResponseEntity<?> deleteOrderItem(
            @Parameter(description = "ID замовлення", required = true) @PathVariable UUID orderId,
            @Parameter(description = "ID предмета", required = true) @PathVariable UUID itemId) {
        log.debug("Запит на видалення предмета {} із замовлення {}", itemId, orderId);
        
        try {
            orderService.deleteOrderItem(orderId, itemId);
            return ApiResponseUtils.noContent("Успішно видалено предмет {} із замовлення {}", itemId, orderId);
        } catch (EntityNotFoundException e) {
            return ApiResponseUtils.notFound(
                "Предмет або замовлення не знайдено", 
                "Предмет {} замовлення {} не знайдено", 
                itemId, orderId
            );
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError(
                "Помилка при видаленні предмета", 
                "Не вдалося видалити предмет {} із замовлення {}. Причина: {}", 
                itemId, orderId, e.getMessage()
            );
        }
    }
}
