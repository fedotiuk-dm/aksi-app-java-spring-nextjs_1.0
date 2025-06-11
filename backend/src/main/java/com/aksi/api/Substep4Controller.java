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
@Tag(name = "Substep 4 API", description = "API для підетапу 4 - Знижки та надбавки")
public class Substep4Controller {

    private final PriceDiscountAdapter priceDiscountAdapter;

    public Substep4Controller(PriceDiscountAdapter priceDiscountAdapter) {
        this.priceDiscountAdapter = priceDiscountAdapter;
    }

    // =================== ЗНИЖКИ ТА НАДБАВКИ ===================

    @Operation(summary = "Ініціалізація підетапу 4")
    @PostMapping("/initialize/{sessionId}")
    public ResponseEntity<SubstepResultDTO> initializeSubstep4(
            @PathVariable UUID sessionId,
            @RequestBody InitializeSubstepRequest request) {
        return priceDiscountAdapter.initializeSubstep(sessionId, request);
    }

    @Operation(summary = "Розрахунок базової ціни предмета")
    @PostMapping("/calculate-base-price/{sessionId}")
    public ResponseEntity<SubstepResultDTO> calculateBasePrice(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.calculateBasePrice(sessionId);
    }

    @Operation(summary = "Додавання модифікатора до розрахунку")
    @PostMapping("/modifiers/{sessionId}/add")
    public ResponseEntity<SubstepResultDTO> addModifier(
            @PathVariable UUID sessionId,
            @RequestBody AddModifierRequest request) {
        return priceDiscountAdapter.addModifier(sessionId, request);
    }

    @Operation(summary = "Видалення модифікатора з розрахунку")
    @DeleteMapping("/modifiers/{sessionId}/{modifierId}")
    public ResponseEntity<SubstepResultDTO> removeModifier(
            @PathVariable UUID sessionId,
            @PathVariable String modifierId) {
        return priceDiscountAdapter.removeModifier(sessionId, modifierId);
    }

    @Operation(summary = "Розрахунок фінальної ціни з усіма модифікаторами")
    @PostMapping("/calculate-final-price/{sessionId}")
    public ResponseEntity<SubstepResultDTO> calculateFinalPrice(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.calculateFinalPrice(sessionId);
    }

    @Operation(summary = "Підтвердження розрахунку та завершення підетапу")
    @PostMapping("/confirm/{sessionId}")
    public ResponseEntity<SubstepResultDTO> confirmCalculation(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.confirmCalculation(sessionId);
    }

    @Operation(summary = "Скидання розрахунку")
    @PostMapping("/reset/{sessionId}")
    public ResponseEntity<SubstepResultDTO> resetCalculation(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.resetCalculation(sessionId);
    }

    @Operation(summary = "Отримання поточного стану підетапу")
    @GetMapping("/state/{sessionId}")
    public ResponseEntity<SubstepResultDTO> getCurrentState(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.getCurrentState(sessionId);
    }

    @Operation(summary = "Отримання доступних подій для поточного стану")
    @GetMapping("/events/{sessionId}")
    public ResponseEntity<List<PriceDiscountEvent>> getAvailableEvents(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.getAvailableEvents(sessionId);
    }

    @Operation(summary = "Валідація поточного стану")
    @GetMapping("/validate/{sessionId}")
    public ResponseEntity<Boolean> validateCurrentState(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.validateCurrentState(sessionId);
    }

    @Operation(summary = "Детальна валідація з результатом")
    @GetMapping("/validate-detailed/{sessionId}")
    public ResponseEntity<SubstepResultDTO> validateDetailed(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.validateDetailed(sessionId);
    }

    @Operation(summary = "Отримання поточних даних сесії")
    @GetMapping("/data/{sessionId}")
    public ResponseEntity<PriceDiscountDTO> getCurrentData(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.getCurrentData(sessionId);
    }

    @Operation(summary = "Отримання доступних модифікаторів для категорії")
    @GetMapping("/modifiers")
    public ResponseEntity<List<PriceModifierDTO>> getAvailableModifiers(
            @RequestParam String categoryCode) {
        return priceDiscountAdapter.getAvailableModifiers(categoryCode);
    }

    @Operation(summary = "Отримання рекомендованих модифікаторів")
    @GetMapping("/modifiers/recommended")
    public ResponseEntity<List<PriceModifierDTO>> getRecommendedModifiers(
            @RequestParam String categoryCode,
            @RequestParam String itemName) {
        return priceDiscountAdapter.getRecommendedModifiers(categoryCode, itemName);
    }

    @Operation(summary = "Розрахунок ціни")
    @PostMapping("/calculate-price")
    public ResponseEntity<PriceCalculationResponseDTO> calculatePrice(@RequestBody PriceDiscountDTO data) {
        return priceDiscountAdapter.calculatePrice(data);
    }

    @Operation(summary = "Перевірка існування сесії")
    @GetMapping("/session/{sessionId}/exists")
    public ResponseEntity<Boolean> sessionExists(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.sessionExists(sessionId);
    }

    @Operation(summary = "Видалення сесії")
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> removeSession(@PathVariable UUID sessionId) {
        return priceDiscountAdapter.removeSession(sessionId);
    }
}
