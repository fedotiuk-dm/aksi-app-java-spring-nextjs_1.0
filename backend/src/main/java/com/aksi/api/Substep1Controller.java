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
@Tag(name = "Substep 1 API", description = "API для підетапу 1 - Основна інформація про предмет")
public class Substep1Controller {

    private final ItemBasicInfoAdapter itemBasicInfoAdapter;

    public Substep1Controller(ItemBasicInfoAdapter itemBasicInfoAdapter) {
        this.itemBasicInfoAdapter = itemBasicInfoAdapter;
    }

    // =================== ОСНОВНА ІНФОРМАЦІЯ ПРО ПРЕДМЕТ ===================

    @Operation(summary = "Починає новий підетап 1 - Основна інформація")
    @PostMapping("/start")
    public ResponseEntity<ItemBasicInfoDTO> startSubstep1() {
        return itemBasicInfoAdapter.startSubstep();
    }

    @Operation(summary = "Отримує список доступних категорій послуг")
    @GetMapping("/service-categories")
    public ResponseEntity<List<ServiceCategoryDTO>> getServiceCategories() {
        return itemBasicInfoAdapter.getServiceCategories();
    }

    @Operation(summary = "Вибирає категорію послуги")
    @PostMapping("/{sessionId}/select-category")
    public ResponseEntity<ItemBasicInfoDTO> selectServiceCategory(
            @PathVariable UUID sessionId,
            @RequestParam UUID categoryId) {
        return itemBasicInfoAdapter.selectServiceCategory(sessionId, categoryId);
    }

    @Operation(summary = "Отримує список предметів для категорії")
    @GetMapping("/categories/{categoryId}/items")
    public ResponseEntity<List<PriceListItemDTO>> getItemsForCategory(@PathVariable UUID categoryId) {
        return itemBasicInfoAdapter.getItemsForCategory(categoryId);
    }

    @Operation(summary = "Вибирає предмет з прайс-листа")
    @PostMapping("/{sessionId}/select-item")
    public ResponseEntity<ItemBasicInfoDTO> selectPriceListItem(
            @PathVariable UUID sessionId,
            @RequestParam UUID itemId) {
        return itemBasicInfoAdapter.selectPriceListItem(sessionId, itemId);
    }

    @Operation(summary = "Вводить кількість")
    @PostMapping("/{sessionId}/enter-quantity")
    public ResponseEntity<ItemBasicInfoDTO> enterQuantity(
            @PathVariable UUID sessionId,
            @RequestParam BigDecimal quantity) {
        return itemBasicInfoAdapter.enterQuantity(sessionId, quantity);
    }

    @Operation(summary = "Валідує та завершує підетап 1")
    @PostMapping("/{sessionId}/validate-and-complete")
    public ResponseEntity<ItemBasicInfoDTO> validateAndCompleteSubstep1(@PathVariable UUID sessionId) {
        return itemBasicInfoAdapter.validateAndComplete(sessionId);
    }

    @Operation(summary = "Отримує поточний стан підетапу 1")
    @GetMapping("/{sessionId}/status")
    public ResponseEntity<SubstepResultDTO> getSubstep1Status(@PathVariable UUID sessionId) {
        return itemBasicInfoAdapter.getStatus(sessionId);
    }

    @Operation(summary = "Скидає підетап 1 до початкового стану")
    @PostMapping("/{sessionId}/reset")
    public ResponseEntity<ItemBasicInfoDTO> resetSubstep1(@PathVariable UUID sessionId) {
        return itemBasicInfoAdapter.resetSubstep(sessionId);
    }

    @Operation(summary = "Завершує сесію підетапу 1")
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> finalizeSubstep1Session(@PathVariable UUID sessionId) {
        return itemBasicInfoAdapter.finalizeSession(sessionId);
    }
}
