package com.aksi.domain.order.statemachine.stage2.substep4.adapter;

import java.math.BigDecimal;
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

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountEvent;
import com.aksi.domain.order.statemachine.stage2.substep4.service.PriceDiscountCoordinationService;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

/**
 * REST адаптер для підетапу 2.4: Знижки та надбавки (калькулятор ціни).
 */
@RestController
@RequestMapping("/order-wizard/stage2/substep4")
public class PriceDiscountAdapter {

    private final PriceDiscountCoordinationService coordinationService;

    public PriceDiscountAdapter(PriceDiscountCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    // ========== LIFECYCLE ENDPOINTS ==========

    /**
     * Ініціалізація підетапу з базовими даними з попередніх підетапів.
     */
    @PostMapping("/initialize/{sessionId}")
    public ResponseEntity<SubstepResultDTO> initializeSubstep(
            @PathVariable UUID sessionId,
            @RequestBody InitializeSubstepRequest request) {

        SubstepResultDTO result = coordinationService.initializeSubstep(
                sessionId,
                request.getBasicInfo(),
                request.getCharacteristics(),
                request.getStainsDefects()
        );

        return ResponseEntity.ok(result);
    }

    /**
     * Розрахунок базової ціни предмета.
     */
    @PostMapping("/calculate-base-price/{sessionId}")
    public ResponseEntity<SubstepResultDTO> calculateBasePrice(@PathVariable UUID sessionId) {
        SubstepResultDTO result = coordinationService.calculateBasePrice(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Додавання модифікатора до розрахунку.
     */
    @PostMapping("/modifiers/{sessionId}/add")
    public ResponseEntity<SubstepResultDTO> addModifier(
            @PathVariable UUID sessionId,
            @RequestBody AddModifierRequest request) {

        SubstepResultDTO result = coordinationService.addModifier(sessionId, request.getModifierId());
        return ResponseEntity.ok(result);
    }

    /**
     * Видалення модифікатора з розрахунку.
     */
    @DeleteMapping("/modifiers/{sessionId}/{modifierId}")
    public ResponseEntity<SubstepResultDTO> removeModifier(
            @PathVariable UUID sessionId,
            @PathVariable String modifierId) {

        SubstepResultDTO result = coordinationService.removeModifier(sessionId, modifierId);
        return ResponseEntity.ok(result);
    }

    /**
     * Розрахунок фінальної ціни з усіма модифікаторами.
     */
    @PostMapping("/calculate-final-price/{sessionId}")
    public ResponseEntity<SubstepResultDTO> calculateFinalPrice(@PathVariable UUID sessionId) {
        SubstepResultDTO result = coordinationService.calculateFinalPrice(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Підтвердження розрахунку та завершення підетапу.
     */
    @PostMapping("/confirm/{sessionId}")
    public ResponseEntity<SubstepResultDTO> confirmCalculation(@PathVariable UUID sessionId) {
        SubstepResultDTO result = coordinationService.confirmCalculation(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Скидання розрахунку.
     */
    @PostMapping("/reset/{sessionId}")
    public ResponseEntity<SubstepResultDTO> resetCalculation(@PathVariable UUID sessionId) {
        SubstepResultDTO result = coordinationService.resetCalculation(sessionId);
        return ResponseEntity.ok(result);
    }

    // ========== STATE AND VALIDATION ENDPOINTS ==========

    /**
     * Отримання поточного стану підетапу.
     */
    @GetMapping("/state/{sessionId}")
    public ResponseEntity<SubstepResultDTO> getCurrentState(@PathVariable UUID sessionId) {
        SubstepResultDTO result = coordinationService.getCurrentState(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Отримання доступних подій для поточного стану.
     */
    @GetMapping("/events/{sessionId}")
    public ResponseEntity<List<PriceDiscountEvent>> getAvailableEvents(@PathVariable UUID sessionId) {
        List<PriceDiscountEvent> events = coordinationService.getAvailableEvents(sessionId);
        return ResponseEntity.ok(events);
    }

    /**
     * Валідація поточного стану.
     */
    @GetMapping("/validate/{sessionId}")
    public ResponseEntity<Boolean> validateCurrentState(@PathVariable UUID sessionId) {
        boolean isValid = coordinationService.isCurrentStateValid(sessionId);
        return ResponseEntity.ok(isValid);
    }

    /**
     * Детальна валідація з результатом.
     */
    @GetMapping("/validate-detailed/{sessionId}")
    public ResponseEntity<SubstepResultDTO> validateDetailed(@PathVariable UUID sessionId) {
        SubstepResultDTO result = coordinationService.validateAllWithResult(sessionId);
        return ResponseEntity.ok(result);
    }

    // ========== DATA ENDPOINTS ==========

    /**
     * Отримання поточних даних сесії.
     */
    @GetMapping("/data/{sessionId}")
    public ResponseEntity<PriceDiscountDTO> getCurrentData(@PathVariable UUID sessionId) {
        PriceDiscountDTO data = coordinationService.getData(sessionId);

        if (data == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(data);
    }

    /**
     * Отримання доступних модифікаторів для категорії.
     */
    @GetMapping("/modifiers")
    public ResponseEntity<List<PriceModifierDTO>> getAvailableModifiers(
            @RequestParam String categoryCode) {

        List<PriceModifierDTO> modifiers = coordinationService.getAvailableModifiers(categoryCode);
        return ResponseEntity.ok(modifiers);
    }

    /**
     * Отримання рекомендованих модифікаторів.
     */
    @GetMapping("/modifiers/recommended")
    public ResponseEntity<List<PriceModifierDTO>> getRecommendedModifiers(
            @RequestParam String categoryCode,
            @RequestParam String itemName) {

        List<PriceModifierDTO> modifiers = coordinationService.getRecommendedModifiers(categoryCode, itemName);
        return ResponseEntity.ok(modifiers);
    }

    /**
     * Отримання розрахунку ціни.
     */
    @PostMapping("/calculate-price")
    public ResponseEntity<PriceCalculationResponseDTO> calculatePrice(
            @RequestBody PriceDiscountDTO data) {

        PriceCalculationResponseDTO calculation = coordinationService.calculatePrice(data);
        return ResponseEntity.ok(calculation);
    }

    // ========== UTILITY ENDPOINTS ==========

    /**
     * Перевірка існування сесії.
     */
    @GetMapping("/session/{sessionId}/exists")
    public ResponseEntity<Boolean> sessionExists(@PathVariable UUID sessionId) {
        boolean exists = coordinationService.hasContext(sessionId);
        return ResponseEntity.ok(exists);
    }

    /**
     * Видалення сесії (cleanup).
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> removeSession(@PathVariable UUID sessionId) {
        coordinationService.removeContext(sessionId);
        return ResponseEntity.noContent().build();
    }

    // ========== REQUEST/RESPONSE DTOs ==========

    /**
     * DTO для ініціалізації підетапу.
     */
    public static class InitializeSubstepRequest {
        private ItemBasicInfoDTO basicInfo;
        private ItemCharacteristicsDTO characteristics;
        private StainsDefectsDTO stainsDefects;

        // Getters and setters
        public ItemBasicInfoDTO getBasicInfo() {
            return basicInfo;
        }

        public void setBasicInfo(ItemBasicInfoDTO basicInfo) {
            this.basicInfo = basicInfo;
        }

        public ItemCharacteristicsDTO getCharacteristics() {
            return characteristics;
        }

        public void setCharacteristics(ItemCharacteristicsDTO characteristics) {
            this.characteristics = characteristics;
        }

        public StainsDefectsDTO getStainsDefects() {
            return stainsDefects;
        }

        public void setStainsDefects(StainsDefectsDTO stainsDefects) {
            this.stainsDefects = stainsDefects;
        }
    }

    /**
     * DTO для додавання модифікатора.
     */
    public static class AddModifierRequest {
        private String modifierId;
        private BigDecimal rangeValue;
        private Integer quantity;

        // Getters and setters
        public String getModifierId() {
            return modifierId;
        }

        public void setModifierId(String modifierId) {
            this.modifierId = modifierId;
        }

        public BigDecimal getRangeValue() {
            return rangeValue;
        }

        public void setRangeValue(BigDecimal rangeValue) {
            this.rangeValue = rangeValue;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
