package com.aksi.domain.order.statemachine.stage2.substep2.adapter;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.ItemCharacteristicsState;
import com.aksi.domain.order.statemachine.stage2.substep2.service.ItemCharacteristicsCoordinationService;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ValidationResult;

/**
 * REST API адаптер для підетапу характеристик предмета
 */
@RestController
@RequestMapping("/api/order-wizard/stage2/substep2/characteristics")
public class ItemCharacteristicsAdapter {

    private final ItemCharacteristicsCoordinationService coordinationService;

    public ItemCharacteristicsAdapter(ItemCharacteristicsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Початок підетапу характеристик
     */
    @PostMapping("/start")
    public ResponseEntity<ItemCharacteristicsDTO> startSubstep(
            @RequestParam UUID sessionId,
            @RequestParam String categoryCode) {

        ItemCharacteristicsDTO result = coordinationService.startSubstep(sessionId, categoryCode);
        return ResponseEntity.ok(result);
    }

    /**
     * Вибір матеріалу
     */
    @PostMapping("/material")
    public ResponseEntity<ItemCharacteristicsDTO> selectMaterial(
            @RequestParam UUID sessionId,
            @RequestParam String material) {

        ItemCharacteristicsDTO result = coordinationService.selectMaterial(sessionId, material);
        return ResponseEntity.ok(result);
    }

    /**
     * Вибір кольору
     */
    @PostMapping("/color")
    public ResponseEntity<ItemCharacteristicsDTO> selectColor(
            @RequestParam UUID sessionId,
            @RequestParam String color) {

        ItemCharacteristicsDTO result = coordinationService.selectColor(sessionId, color);
        return ResponseEntity.ok(result);
    }

    /**
     * Завершення підетапу
     */
    @PostMapping("/complete")
    public ResponseEntity<ItemCharacteristicsDTO> completeSubstep(@RequestParam UUID sessionId) {
        ItemCharacteristicsDTO result = coordinationService.completeSubstep(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Отримання поточних даних
     */
    @GetMapping("/current")
    public ResponseEntity<ItemCharacteristicsDTO> getCurrentData(@RequestParam UUID sessionId) {
        ItemCharacteristicsDTO result = coordinationService.getCurrentData(sessionId);
        return ResponseEntity.ok(result);
    }

    /**
     * Отримання поточного стану
     */
    @GetMapping("/state")
    public ResponseEntity<ItemCharacteristicsState> getCurrentState(@RequestParam UUID sessionId) {
        ItemCharacteristicsState state = coordinationService.getCurrentState(sessionId);
        return ResponseEntity.ok(state);
    }

    /**
     * Валідація матеріалу
     */
    @PostMapping("/validate/material")
    public ResponseEntity<ValidationResult> validateMaterial(@RequestParam String material) {
        ValidationResult result = coordinationService.validateMaterial(material);
        return ResponseEntity.ok(result);
    }

    /**
     * Валідація кольору
     */
    @PostMapping("/validate/color")
    public ResponseEntity<ValidationResult> validateColor(@RequestParam String color) {
        ValidationResult result = coordinationService.validateColor(color);
        return ResponseEntity.ok(result);
    }

    /**
     * Отримання списку доступних матеріалів
     */
    @GetMapping("/materials")
    public ResponseEntity<List<String>> getAvailableMaterials(@RequestParam UUID sessionId) {
        List<String> materials = coordinationService.getAvailableMaterials(sessionId);
        return ResponseEntity.ok(materials);
    }

    /**
     * Отримання списку доступних кольорів
     */
    @GetMapping("/colors")
    public ResponseEntity<List<String>> getAvailableColors() {
        List<String> colors = coordinationService.getAvailableColors();
        return ResponseEntity.ok(colors);
    }

    /**
     * Отримання списку доступних наповнювачів
     */
    @GetMapping("/fillers")
    public ResponseEntity<List<String>> getAvailableFillers() {
        List<String> fillers = coordinationService.getAvailableFillers();
        return ResponseEntity.ok(fillers);
    }

    /**
     * Отримання списку доступних ступенів зносу
     */
    @GetMapping("/wear-degrees")
    public ResponseEntity<List<String>> getAvailableWearDegrees() {
        List<String> wearDegrees = coordinationService.getAvailableWearDegrees();
        return ResponseEntity.ok(wearDegrees);
    }

    /**
     * Перевірка чи потрібна секція наповнювача
     */
    @GetMapping("/filler-section-required")
    public ResponseEntity<Boolean> shouldShowFillerSection(@RequestParam String categoryCode) {
        boolean required = coordinationService.shouldShowFillerSection(categoryCode);
        return ResponseEntity.ok(required);
    }
}
