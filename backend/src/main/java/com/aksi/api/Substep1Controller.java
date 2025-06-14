package com.aksi.api;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.stage2.substep1.adapter.ItemBasicInfoAdapter;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.SubstepResultDTO;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

/**
 * REST API контроллер для Stage 2 Substep 1 - Основна інформація про предмет.
 *
 * Відповідальність:
 * - Тільки підетап 1: вибір категорії, предмета та кількості
 * - Делегування до ItemBasicInfoAdapter
 *
 * Принципи:
 * - Один файл = одна відповідальність (тільки substep1)
 * - Тонкий контроллер - тільки HTTP обробка
 * - Вся логіка винесена в адаптер
 */
@RestController
@RequestMapping("/v1/order-wizard/stage2/substep1")
@Tag(name = "Order Wizard - Stage 2 Substep 1", description = "Підетап 1: Основна інформація про предмет")
@Slf4j
public class Substep1Controller {

    private final ItemBasicInfoAdapter itemBasicInfoAdapter;

    public Substep1Controller(ItemBasicInfoAdapter itemBasicInfoAdapter) {
        this.itemBasicInfoAdapter = itemBasicInfoAdapter;
    }

    // =================== ОСНОВНА ІНФОРМАЦІЯ ПРО ПРЕДМЕТ ===================

    @Operation(
        summary = "Починає новий підетап 1 - Основна інформація",
        operationId = "substep1StartSubstep",
        tags = {"Order Wizard - Stage 2 Substep 1", "Item Basic Info"}
    )
    @PostMapping("/start")
    public ResponseEntity<ItemBasicInfoDTO> startSubstep1() {
        log.info("🚀 API ЗАПИТ: POST /v1/order-wizard/stage2/substep1/start - ПОЧАТОК ПІДЕТАПУ 1");

        ResponseEntity<ItemBasicInfoDTO> response = itemBasicInfoAdapter.startSubstep();

        if (response.getStatusCode().is2xxSuccessful()) {
            log.info("✅ ПІДЕТАП 1 УСПІШНО РОЗПОЧАТО: sessionId створено, готовий до роботи");
        } else {
            log.error("❌ ПОМИЛКА ПОЧАТКУ ПІДЕТАПУ 1: статус {}", response.getStatusCode());
        }

        return response;
    }

    @Operation(
        summary = "Отримує список доступних категорій послуг",
        operationId = "substep1GetServiceCategories",
        tags = {"Order Wizard - Stage 2 Substep 1", "Service Categories"}
    )
    @GetMapping("/service-categories")
    public ResponseEntity<List<ServiceCategoryDTO>> getServiceCategories() {
        log.info("🔍 API ЗАПИТ: GET /v1/order-wizard/stage2/substep1/service-categories");

        ResponseEntity<List<ServiceCategoryDTO>> response = itemBasicInfoAdapter.getServiceCategories();

                List<ServiceCategoryDTO> categories = response.getBody();
        if (categories == null || categories.isEmpty()) {
            log.warn("⚠️ API ВІДПОВІДЬ: Порожній список категорій! Можливо база даних не містить даних.");
            log.info("💡 РЕКОМЕНДАЦІЯ: Перевірте чи запущені міграції та SQL скрипти для імпорту даних");
        } else {
            log.info("✅ API ВІДПОВІДЬ: Повертаємо {} категорій послуг", categories.size());
            categories.forEach(cat ->
                log.info("📋 Категорія: {} (код: {})", cat.getName(), cat.getCode())
            );
        }

        return response;
    }

    @Operation(
        summary = "Вибирає категорію послуги",
        operationId = "substep1SelectServiceCategory",
        tags = {"Order Wizard - Stage 2 Substep 1", "Service Categories"}
    )
    @PostMapping("/{sessionId}/select-category")
    public ResponseEntity<ItemBasicInfoDTO> selectServiceCategory(
            @PathVariable UUID sessionId,
            @RequestParam UUID categoryId) {
        log.info("🎯 API ЗАПИТ: POST /v1/order-wizard/stage2/substep1/{}/select-category?categoryId={}",
                sessionId, categoryId);
        log.info("📝 ПЕРЕХІД НА КРОК: Вибір категорії послуги в підетапі 1");

        ResponseEntity<ItemBasicInfoDTO> response = itemBasicInfoAdapter.selectServiceCategory(sessionId, categoryId);

        if (response.getStatusCode().is2xxSuccessful()) {
            log.info("✅ КАТЕГОРІЯ ВИБРАНА: sessionId={}, categoryId={}", sessionId, categoryId);
        } else {
            log.error("❌ ПОМИЛКА ВИБОРУ КАТЕГОРІЇ: sessionId={}, categoryId={}, статус={}",
                    sessionId, categoryId, response.getStatusCode());
        }

        return response;
    }

    @Operation(
        summary = "Отримує список предметів для категорії",
        operationId = "substep1GetItemsForCategory",
        tags = {"Order Wizard - Stage 2 Substep 1", "Price List Items"}
    )
    @GetMapping("/categories/{categoryId}/items")
    public ResponseEntity<List<PriceListItemDTO>> getItemsForCategory(@PathVariable UUID categoryId) {
        return itemBasicInfoAdapter.getItemsForCategory(categoryId);
    }

    @Operation(
        summary = "Вибирає предмет з прайс-листа",
        operationId = "substep1SelectPriceListItem",
        tags = {"Order Wizard - Stage 2 Substep 1", "Price List Items"}
    )
    @PostMapping("/{sessionId}/select-item")
    public ResponseEntity<ItemBasicInfoDTO> selectPriceListItem(
            @PathVariable UUID sessionId,
            @RequestParam UUID itemId) {
        return itemBasicInfoAdapter.selectPriceListItem(sessionId, itemId);
    }

    @Operation(
        summary = "Вводить кількість",
        operationId = "substep1EnterQuantity",
        tags = {"Order Wizard - Stage 2 Substep 1", "Quantity"}
    )
    @PostMapping("/{sessionId}/enter-quantity")
    public ResponseEntity<ItemBasicInfoDTO> enterQuantity(
            @PathVariable UUID sessionId,
            @RequestParam BigDecimal quantity) {
        return itemBasicInfoAdapter.enterQuantity(sessionId, quantity);
    }

    @Operation(
        summary = "Валідує та завершує підетап 1",
        operationId = "substep1ValidateAndComplete",
        tags = {"Order Wizard - Stage 2 Substep 1", "Validation"}
    )
    @PostMapping("/{sessionId}/validate-and-complete")
    public ResponseEntity<ItemBasicInfoDTO> validateAndCompleteSubstep1(@PathVariable UUID sessionId) {
        return itemBasicInfoAdapter.validateAndComplete(sessionId);
    }

    @Operation(
        summary = "Отримує поточний стан підетапу 1",
        operationId = "substep1GetStatus",
        tags = {"Order Wizard - Stage 2 Substep 1", "Status"}
    )
    @GetMapping("/{sessionId}/status")
    public ResponseEntity<SubstepResultDTO> getSubstep1Status(@PathVariable UUID sessionId) {
        return itemBasicInfoAdapter.getStatus(sessionId);
    }

    @Operation(
        summary = "Скидає підетап 1 до початкового стану",
        operationId = "substep1Reset",
        tags = {"Order Wizard - Stage 2 Substep 1", "Session Management"}
    )
    @PostMapping("/{sessionId}/reset")
    public ResponseEntity<ItemBasicInfoDTO> resetSubstep1(@PathVariable UUID sessionId) {
        return itemBasicInfoAdapter.resetSubstep(sessionId);
    }

    @Operation(
        summary = "Завершує сесію підетапу 1",
        operationId = "substep1FinalizeSession",
        tags = {"Order Wizard - Stage 2 Substep 1", "Session Management"}
    )
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> finalizeSubstep1Session(@PathVariable UUID sessionId) {
        return itemBasicInfoAdapter.finalizeSession(sessionId);
    }
}
