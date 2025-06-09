package com.aksi.domain.order.statemachine.stage2.substep2.adapter;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.service.ItemCharacteristicsCoordinationService;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.ValidationResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST API адаптер для управління характеристиками предмета (substep 2.2)
 * Відповідає виключно за REST інтерфейс, всю логіку делегує в CoordinationService
 */
@RestController
@RequestMapping("/order-wizard/stage2/substep2/item-characteristics")
@RequiredArgsConstructor
@Slf4j
public class ItemCharacteristicsStateMachineAdapter {

    private final ItemCharacteristicsCoordinationService coordinationService;

    /**
     * Ініціалізація підетапу характеристик предмета
     */
    @PostMapping("/initialize/{sessionId}")
    public ResponseEntity<ItemCharacteristicsDTO> initializeSubstep(
            @PathVariable UUID sessionId,
            @RequestParam UUID itemId) {

        log.info("Ініціалізація substep2 для session: {} та item: {}", sessionId, itemId);

        try {
            ItemCharacteristicsDTO result = coordinationService.initializeSubstep(sessionId, itemId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Помилка при ініціалізації substep2", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

        /**
     * Отримання доступних матеріалів для вибраної категорії
     */
    @GetMapping("/materials/{sessionId}")
    public ResponseEntity<List<String>> getAvailableMaterials(
            @PathVariable UUID sessionId) {

        log.info("Запит доступних матеріалів для session: {}", sessionId);

        try {
            List<String> materials = coordinationService.getAvailableMaterials(sessionId);
            return ResponseEntity.ok(materials);
        } catch (Exception e) {
            log.error("Помилка при отриманні матеріалів", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Вибір матеріалу
     */
    @PostMapping("/select-material/{sessionId}")
    public ResponseEntity<ValidationResult> selectMaterial(
            @PathVariable UUID sessionId,
            @RequestParam UUID materialId) {

        log.info("Вибір матеріалу {} для session: {}", materialId, sessionId);

        try {
            ValidationResult result = coordinationService.selectMaterial(sessionId, materialId);

            if (result.isValid()) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            log.error("Помилка при виборі матеріалу", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Вибір кольору
     */
    @PostMapping("/select-color/{sessionId}")
    public ResponseEntity<ValidationResult> selectColor(
            @PathVariable UUID sessionId,
            @RequestParam String color) {

        log.info("Вибір кольору '{}' для session: {}", color, sessionId);

        try {
            ValidationResult result = coordinationService.selectColor(sessionId, color);

            if (result.isValid()) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            log.error("Помилка при виборі кольору", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Вибір наповнювача
     */
    @PostMapping("/select-filler/{sessionId}")
    public ResponseEntity<ValidationResult> selectFiller(
            @PathVariable UUID sessionId,
            @RequestParam(required = false) String fillerType,
            @RequestParam(required = false, defaultValue = "false") Boolean isFillerDamaged) {

        log.info("Вибір наповнювача '{}' (пошкоджений: {}) для session: {}",
                fillerType, isFillerDamaged, sessionId);

        try {
            ValidationResult result = coordinationService.selectFiller(sessionId, fillerType, isFillerDamaged);

            if (result.isValid()) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            log.error("Помилка при виборі наповнювача", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Вибір ступеня зносу
     */
    @PostMapping("/select-wear-level/{sessionId}")
    public ResponseEntity<ValidationResult> selectWearLevel(
            @PathVariable UUID sessionId,
            @RequestParam Integer wearPercentage) {

        log.info("Вибір ступеня зносу {}% для session: {}", wearPercentage, sessionId);

        try {
            ValidationResult result = coordinationService.selectWearLevel(sessionId, wearPercentage);

            if (result.isValid()) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            log.error("Помилка при виборі ступеня зносу", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Валідація всіх даних характеристик
     */
    @PostMapping("/validate/{sessionId}")
    public ResponseEntity<ValidationResult> validateCharacteristics(@PathVariable UUID sessionId) {

        log.info("Валідація характеристик для session: {}", sessionId);

        try {
            ValidationResult result = coordinationService.validateCharacteristics(sessionId);

            if (result.isValid()) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            log.error("Помилка при валідації характеристик", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Завершення підетапу характеристик
     */
    @PostMapping("/complete/{sessionId}")
    public ResponseEntity<Map<String, Object>> completeSubstep(@PathVariable UUID sessionId) {

        log.info("Завершення substep2 для session: {}", sessionId);

        try {
            Map<String, Object> result = coordinationService.completeSubstep(sessionId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Помилка при завершенні substep2", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Отримання поточного стану характеристик
     */
    @GetMapping("/current-state/{sessionId}")
    public ResponseEntity<ItemCharacteristicsDTO> getCurrentCharacteristics(@PathVariable UUID sessionId) {

        log.info("Запит поточного стану характеристик для session: {}", sessionId);

        try {
            ItemCharacteristicsDTO current = coordinationService.getCurrentCharacteristics(sessionId);

            if (current != null) {
                return ResponseEntity.ok(current);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Помилка при отриманні поточного стану", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Скасування підетапу
     */
    @PostMapping("/cancel/{sessionId}")
    public ResponseEntity<Void> cancelSubstep(@PathVariable UUID sessionId) {

        log.info("Скасування substep2 для session: {}", sessionId);

        try {
            coordinationService.cancelSubstep(sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Помилка при скасуванні substep2", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
