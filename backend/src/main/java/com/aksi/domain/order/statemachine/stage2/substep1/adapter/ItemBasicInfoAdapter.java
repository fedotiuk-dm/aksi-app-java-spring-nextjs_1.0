package com.aksi.domain.order.statemachine.stage2.substep1.adapter;

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

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.service.ItemBasicInfoCoordinationService;
import com.aksi.domain.order.statemachine.stage2.substep1.validator.ValidationResult;
import com.aksi.domain.pricing.dto.PriceListItemDTO;
import com.aksi.domain.pricing.dto.ServiceCategoryDTO;

/**
 * REST API контролер для підетапу 2.1 - Основна інформація про предмет
 */
@RestController
@RequestMapping("/order-wizard/stage2/substep1")
public class ItemBasicInfoAdapter {

    private final ItemBasicInfoCoordinationService coordinationService;

    public ItemBasicInfoAdapter(ItemBasicInfoCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Починає новий підетап
     */
    @PostMapping("/start")
    public ResponseEntity<ItemBasicInfoDTO> startSubstep() {
        UUID sessionId = coordinationService.initializeSession();
        ItemBasicInfoDTO data = coordinationService.initializeSubstep(sessionId);
        return ResponseEntity.ok(data);
    }

    /**
     * Отримує список доступних категорій послуг
     */
    @GetMapping("/service-categories")
    public ResponseEntity<List<ServiceCategoryDTO>> getServiceCategories() {
        List<ServiceCategoryDTO> categories = coordinationService.getAllActiveServiceCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Вибирає категорію послуги
     */
    @PostMapping("/{sessionId}/select-category")
    public ResponseEntity<ItemBasicInfoDTO> selectServiceCategory(
            @PathVariable UUID sessionId,
            @RequestParam UUID categoryId) {

        ItemBasicInfoDTO data = coordinationService.selectServiceCategory(sessionId, categoryId);
        return ResponseEntity.ok(data);
    }

    /**
     * Отримує список предметів для категорії
     */
    @GetMapping("/categories/{categoryId}/items")
    public ResponseEntity<List<PriceListItemDTO>> getItemsForCategory(@PathVariable UUID categoryId) {
        List<PriceListItemDTO> items = coordinationService.getItemsForCategory(categoryId);
        return ResponseEntity.ok(items);
    }

    /**
     * Вибирає предмет з прайс-листа
     */
    @PostMapping("/{sessionId}/select-item")
    public ResponseEntity<ItemBasicInfoDTO> selectPriceListItem(
            @PathVariable UUID sessionId,
            @RequestParam UUID itemId) {

        ItemBasicInfoDTO data = coordinationService.selectPriceListItem(sessionId, itemId);
        return ResponseEntity.ok(data);
    }

    /**
     * Вводить кількість
     */
    @PostMapping("/{sessionId}/enter-quantity")
    public ResponseEntity<ItemBasicInfoDTO> enterQuantity(
            @PathVariable UUID sessionId,
            @RequestParam BigDecimal quantity) {

        ItemBasicInfoDTO data = coordinationService.enterQuantity(sessionId, quantity);
        return ResponseEntity.ok(data);
    }

    /**
     * Валідує та завершує підетап
     */
    @PostMapping("/{sessionId}/validate-and-complete")
    public ResponseEntity<ItemBasicInfoDTO> validateAndComplete(@PathVariable UUID sessionId) {
        ValidationResult validationResult = coordinationService.validateAndComplete(sessionId);

        if (validationResult.isValid()) {
            ItemBasicInfoDTO data = coordinationService.getCurrentData(sessionId);
            return ResponseEntity.ok(data);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Отримує поточний стан підетапу
     */
    @GetMapping("/{sessionId}/status")
    public ResponseEntity<SubstepResultDTO> getStatus(@PathVariable UUID sessionId) {
        SubstepResultDTO result = coordinationService.getSubstepResult(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Скидає підетап до початкового стану
     */
    @PostMapping("/{sessionId}/reset")
    public ResponseEntity<ItemBasicInfoDTO> resetSubstep(@PathVariable UUID sessionId) {
        ItemBasicInfoDTO data = coordinationService.resetSubstep(sessionId);
        return ResponseEntity.ok(data);
    }

    /**
     * Завершує сесію підетапу
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> finalizeSession(@PathVariable UUID sessionId) {
        coordinationService.finalizeSession(sessionId);
        return ResponseEntity.noContent().build();
    }
}
