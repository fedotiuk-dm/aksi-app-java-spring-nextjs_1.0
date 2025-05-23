package com.aksi.api;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
import com.aksi.domain.order.dto.OrderCompletionUpdateRequest;
import com.aksi.domain.order.service.CompletionDateService;
import com.aksi.domain.order.service.OrderService;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для управління датами завершення замовлень.
 */
@RestController
@RequestMapping("/orders/completion")
@RequiredArgsConstructor
@Tag(name = "Order Management - Lifecycle",
     description = "Управління життєвим циклом замовлень: завершення, фіналізація, статуси")
@Slf4j
public class OrderCompletionController {

    private final CompletionDateService completionDateService;
    private final OrderService orderService;

    /**
     * Розрахувати очікувану дату завершення замовлення.
     *
     * @param request запит з категоріями послуг та типом терміновості
     * @return відповідь з розрахованою датою завершення
     */
    @PostMapping("/calculate")
    @Operation(summary = "Розрахувати очікувану дату завершення замовлення",
               description = "Розраховує дату завершення на основі категорій послуг та типу терміновості")
    public ResponseEntity<?> calculateCompletionDate(
            @RequestBody @Validated CompletionDateCalculationRequest request) {

        log.info("Отримано запит на розрахунок дати завершення: {}", request);

        try {
            CompletionDateResponse response = completionDateService.calculateExpectedCompletionDate(request);
            log.info("Розраховано дату завершення: {}", response);

            return ApiResponseUtils.ok(response, "Успішно розраховано дату завершення для запиту");
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest("Неправильні параметри для розрахунку дати завершення",
                "Помилка при розрахунку дати завершення замовлення: {}. Причина: {}",
                request, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при розрахунку дати завершення",
                "Виникла несподівана помилка при розрахунку дати завершення: {}. Причина: {}",
                request, e.getMessage());
        }
    }

    /**
     * Оновити параметри виконання замовлення.
     *
     * @param request запит з параметрами виконання
     * @return статус операції
     */
    @PutMapping("/update")
    @Operation(summary = "Оновити параметри виконання замовлення",
               description = "Оновлює тип терміновості та очікувану дату завершення замовлення")
    public ResponseEntity<?> updateOrderCompletion(
            @RequestBody @Validated OrderCompletionUpdateRequest request) {

        log.info("Отримано запит на оновлення параметрів виконання замовлення: {}", request);

        try {
            orderService.updateOrderCompletionParameters(
                    request.getOrderId(),
                    request.getExpediteType(),
                    request.getExpectedCompletionDate());

            log.info("Параметри виконання замовлення успішно оновлено для orderId: {}", request.getOrderId());

            return ApiResponseUtils.noContent("Параметри виконання замовлення успішно оновлено для orderId: {}",
                    request.getOrderId());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest("Неправильні параметри для оновлення",
                "Помилка при оновленні параметрів виконання для orderId: {}. Причина: {}",
                request.getOrderId(), e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при оновленні параметрів виконання",
                "Виникла несподівана помилка при оновленні параметрів виконання для orderId: {}. Причина: {}",
                request.getOrderId(), e.getMessage());
        }
    }
}
