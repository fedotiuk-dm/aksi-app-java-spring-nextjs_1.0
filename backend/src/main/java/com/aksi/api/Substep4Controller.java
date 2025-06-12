package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.stage2.substep4.adapter.PriceDiscountAdapter;
import com.aksi.domain.order.statemachine.stage2.substep4.adapter.PriceDiscountAdapter.AddModifierRequest;
import com.aksi.domain.order.statemachine.stage2.substep4.adapter.PriceDiscountAdapter.InitializeSubstepRequest;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountEvent;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST API контроллер для Stage 2 Substep 4 - Знижки та надбавки.
 *
 * Відповідальність:
 * - Тільки підетап 4: розрахунок ціни з модифікаторами
 * - Делегування до PriceDiscountAdapter
 *
 * Принципи:
 * - Один файл = одна відповідальність (тільки substep4)
 * - Тонкий контроллер - тільки HTTP обробка
 * - Вся логіка винесена в адаптер
 */
@RestController
@RequestMapping("/v1/order-wizard/stage2/substep4")
@Tag(name = "Order Wizard - Stage 2 Substep 4", description = "Підетап 4: Знижки та надбавки")
public class Substep4Controller {

    private final PriceDiscountAdapter priceDiscountAdapter;

    public Substep4Controller(PriceDiscountAdapter priceDiscountAdapter) {
        this.priceDiscountAdapter = priceDiscountAdapter;
    }

    // =================== ЗНИЖКИ ТА НАДБАВКИ ===================

    @Operation(
        summary = "Ініціалізація підетапу 4",
        operationId = "substep4InitializeSubstep",
        tags = {"Order Wizard - Stage 2 Substep 4", "Price Calculation"}
    )
    @PostMapping("/initialize/{sessionId}")
    public ResponseEntity<SubstepResultDTO> initializeSubstep4(
            @PathVariable UUID sessionId,
            @RequestBody InitializeSubstepRequest request) {
        return priceDiscountAdapter.initializeSubstep(sessionId, request);
    }

    @Operation(
        summary = "Розрахунок базової ціни предмета",
        operationId = "substep4CalculateBasePrice",
        tags = {"Order Wizard - Stage 2 Substep 4", "Price Calculation"}
    )
    @PostMapping("/calculate-base-price/{sessionId}")
    public ResponseEntity<SubstepResultDTO> calculateBasePrice(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.calculateBasePrice(sessionId);
    }

    @Operation(
        summary = "Додавання модифікатора до розрахунку",
        operationId = "substep4AddModifier",
        tags = {"Order Wizard - Stage 2 Substep 4", "Price Modifiers"}
    )
    @PostMapping("/modifiers/{sessionId}/add")
    public ResponseEntity<SubstepResultDTO> addModifier(
            @PathVariable UUID sessionId,
            @RequestBody AddModifierRequest request) {
        return priceDiscountAdapter.addModifier(sessionId, request);
    }

    @Operation(
        summary = "Видалення модифікатора з розрахунку",
        operationId = "substep4RemoveModifier",
        tags = {"Order Wizard - Stage 2 Substep 4", "Price Modifiers"}
    )
    @DeleteMapping("/modifiers/{sessionId}/{modifierId}")
    public ResponseEntity<SubstepResultDTO> removeModifier(
            @PathVariable UUID sessionId,
            @PathVariable String modifierId) {
        return priceDiscountAdapter.removeModifier(sessionId, modifierId);
    }

    @Operation(
        summary = "Розрахунок фінальної ціни з усіма модифікаторами",
        operationId = "substep4CalculateFinalPrice",
        tags = {"Order Wizard - Stage 2 Substep 4", "Price Calculation"}
    )
    @PostMapping("/calculate-final-price/{sessionId}")
    public ResponseEntity<SubstepResultDTO> calculateFinalPrice(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.calculateFinalPrice(sessionId);
    }

    @Operation(
        summary = "Підтвердження розрахунку та завершення підетапу",
        operationId = "substep4ConfirmCalculation",
        tags = {"Order Wizard - Stage 2 Substep 4", "Completion"}
    )
    @PostMapping("/confirm/{sessionId}")
    public ResponseEntity<SubstepResultDTO> confirmCalculation(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.confirmCalculation(sessionId);
    }

    @Operation(
        summary = "Скидання розрахунку",
        operationId = "substep4ResetCalculation",
        tags = {"Order Wizard - Stage 2 Substep 4", "Session Management"}
    )
    @PostMapping("/reset/{sessionId}")
    public ResponseEntity<SubstepResultDTO> resetCalculation(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.resetCalculation(sessionId);
    }

    @Operation(
        summary = "Отримання поточного стану підетапу",
        operationId = "substep4GetCurrentState",
        tags = {"Order Wizard - Stage 2 Substep 4", "Status"}
    )
    @GetMapping("/state/{sessionId}")
    public ResponseEntity<SubstepResultDTO> getCurrentState(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.getCurrentState(sessionId);
    }

    @Operation(
        summary = "Отримання доступних подій для поточного стану",
        operationId = "substep4GetAvailableEvents",
        tags = {"Order Wizard - Stage 2 Substep 4", "Status"}
    )
    @GetMapping("/events/{sessionId}")
    public ResponseEntity<List<PriceDiscountEvent>> getAvailableEvents(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.getAvailableEvents(sessionId);
    }

    @Operation(
        summary = "Валідація поточного стану",
        operationId = "substep4ValidateCurrentState",
        tags = {"Order Wizard - Stage 2 Substep 4", "Validation"}
    )
    @GetMapping("/validate/{sessionId}")
    public ResponseEntity<Boolean> validateCurrentState(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.validateCurrentState(sessionId);
    }

    @Operation(
        summary = "Детальна валідація з результатом",
        operationId = "substep4ValidateDetailed",
        tags = {"Order Wizard - Stage 2 Substep 4", "Validation"}
    )
    @GetMapping("/validate-detailed/{sessionId}")
    public ResponseEntity<SubstepResultDTO> validateDetailed(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.validateDetailed(sessionId);
    }

    @Operation(
        summary = "Отримання поточних даних сесії",
        operationId = "substep4GetCurrentData",
        tags = {"Order Wizard - Stage 2 Substep 4", "Status"}
    )
    @GetMapping("/data/{sessionId}")
    public ResponseEntity<PriceDiscountDTO> getCurrentData(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.getCurrentData(sessionId);
    }

    @Operation(
        summary = "Отримання доступних модифікаторів для категорії",
        operationId = "substep4GetAvailableModifiers",
        tags = {"Order Wizard - Stage 2 Substep 4", "Price Modifiers"}
    )
    @GetMapping("/modifiers")
    public ResponseEntity<List<PriceModifierDTO>> getAvailableModifiers(
            @RequestParam String categoryCode) {
        return priceDiscountAdapter.getAvailableModifiers(categoryCode);
    }

    @Operation(
        summary = "Отримання рекомендованих модифікаторів",
        operationId = "substep4GetRecommendedModifiers",
        tags = {"Order Wizard - Stage 2 Substep 4", "Price Modifiers"}
    )
    @GetMapping("/modifiers/recommended")
    public ResponseEntity<List<PriceModifierDTO>> getRecommendedModifiers(
            @RequestParam String categoryCode,
            @RequestParam String itemName) {
        return priceDiscountAdapter.getRecommendedModifiers(categoryCode, itemName);
    }

    @Operation(
        summary = "Розрахунок ціни",
        operationId = "substep4CalculatePrice",
        tags = {"Order Wizard - Stage 2 Substep 4", "Price Calculation"}
    )
    @PostMapping("/calculate-price")
    public ResponseEntity<PriceCalculationResponseDTO> calculatePrice(@RequestBody PriceDiscountDTO data) {
        return priceDiscountAdapter.calculatePrice(data);
    }

    @Operation(
        summary = "Перевірка існування сесії",
        operationId = "substep4SessionExists",
        tags = {"Order Wizard - Stage 2 Substep 4", "Session Management"}
    )
    @GetMapping("/session/{sessionId}/exists")
    public ResponseEntity<Boolean> sessionExists(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.sessionExists(sessionId);
    }

    @Operation(
        summary = "Видалення сесії",
        operationId = "substep4RemoveSession",
        tags = {"Order Wizard - Stage 2 Substep 4", "Session Management"}
    )
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> removeSession(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.removeSession(sessionId);
    }
}
