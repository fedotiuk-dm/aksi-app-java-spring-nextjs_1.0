package com.aksi.api;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.stage2.substep2.adapter.ItemCharacteristicsStateMachineAdapter;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ValidationResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST API контроллер для Stage 2 Substep 2 - Характеристики предмета.
 *
 * Відповідальність:
 * - Тільки підетап 2: матеріал, колір, наповнювач, рівень зносу
 * - Делегування до ItemCharacteristicsStateMachineAdapter
 *
 * Принципи:
 * - Один файл = одна відповідальність (тільки substep2)
 * - Тонкий контроллер - тільки HTTP обробка
 * - Вся логіка винесена в адаптер
 */
@RestController
@RequestMapping("/v1/order-wizard/stage2/substep2")
@Tag(name = "Substep 2 API", description = "API для підетапу 2 - Характеристики предмета")
public class Substep2Controller {

    private final ItemCharacteristicsStateMachineAdapter itemCharacteristicsAdapter;

    public Substep2Controller(ItemCharacteristicsStateMachineAdapter itemCharacteristicsAdapter) {
        this.itemCharacteristicsAdapter = itemCharacteristicsAdapter;
    }

    // =================== ХАРАКТЕРИСТИКИ ПРЕДМЕТА ===================

    @Operation(summary = "Ініціалізує підетап 2 - Характеристики")
    @PostMapping("/initialize/{sessionId}")
    public ResponseEntity<ItemCharacteristicsDTO> initializeSubstep2(
            @PathVariable UUID sessionId,
            @RequestParam UUID itemId) {
        return itemCharacteristicsAdapter.initializeSubstep(sessionId, itemId);
    }

    @Operation(summary = "Отримує список доступних матеріалів")
    @GetMapping("/materials/{sessionId}")
    public ResponseEntity<List<String>> getAvailableMaterials(@PathVariable UUID sessionId) {
        return itemCharacteristicsAdapter.getAvailableMaterials(sessionId);
    }

    @Operation(summary = "Вибирає матеріал предмета")
    @PostMapping("/select-material/{sessionId}")
    public ResponseEntity<ValidationResult> selectMaterial(
            @PathVariable UUID sessionId,
            @RequestParam UUID materialId) {
        return itemCharacteristicsAdapter.selectMaterial(sessionId, materialId);
    }

    @Operation(summary = "Вибирає колір предмета")
    @PostMapping("/select-color/{sessionId}")
    public ResponseEntity<ValidationResult> selectColor(
            @PathVariable UUID sessionId,
            @RequestParam String color) {
        return itemCharacteristicsAdapter.selectColor(sessionId, color);
    }

    @Operation(summary = "Вибирає наповнювач")
    @PostMapping("/select-filler/{sessionId}")
    public ResponseEntity<ValidationResult> selectFiller(
            @PathVariable UUID sessionId,
            @RequestParam(required = false) String fillerType,
            @RequestParam(required = false, defaultValue = "false") Boolean isFillerDamaged) {
        return itemCharacteristicsAdapter.selectFiller(sessionId, fillerType, isFillerDamaged);
    }

    @Operation(summary = "Вибирає ступінь зносу")
    @PostMapping("/select-wear-level/{sessionId}")
    public ResponseEntity<ValidationResult> selectWearLevel(
            @PathVariable UUID sessionId,
            @RequestParam Integer wearPercentage) {
        return itemCharacteristicsAdapter.selectWearLevel(sessionId, wearPercentage);
    }

    @Operation(summary = "Валідує всі вибрані характеристики")
    @PostMapping("/validate/{sessionId}")
    public ResponseEntity<ValidationResult> validateCharacteristics(@PathVariable UUID sessionId) {
        return itemCharacteristicsAdapter.validateCharacteristics(sessionId);
    }

    @Operation(summary = "Завершує підетап 2")
    @PostMapping("/complete/{sessionId}")
    public ResponseEntity<Map<String, Object>> completeSubstep2(@PathVariable UUID sessionId) {
        return itemCharacteristicsAdapter.completeSubstep(sessionId);
    }

    @Operation(summary = "Отримує поточний стан підетапу 2")
    @GetMapping("/current-state/{sessionId}")
    public ResponseEntity<ItemCharacteristicsDTO> getCurrentCharacteristics(@PathVariable UUID sessionId) {
        return itemCharacteristicsAdapter.getCurrentCharacteristics(sessionId);
    }

    @Operation(summary = "Скасовує підетап 2")
    @PostMapping("/cancel/{sessionId}")
    public ResponseEntity<Void> cancelSubstep2(@PathVariable UUID sessionId) {
        return itemCharacteristicsAdapter.cancelSubstep(sessionId);
    }
}
