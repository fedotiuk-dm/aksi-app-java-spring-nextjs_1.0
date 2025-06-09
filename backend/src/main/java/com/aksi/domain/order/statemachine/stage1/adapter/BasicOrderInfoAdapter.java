package com.aksi.domain.order.statemachine.stage1.adapter;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.statemachine.stage1.dto.BasicOrderInfoDTO;
import com.aksi.domain.order.statemachine.stage1.enums.BasicOrderInfoState;
import com.aksi.domain.order.statemachine.stage1.service.BasicOrderInfoCoordinationService;
import com.aksi.domain.order.statemachine.stage1.validator.BasicOrderInfoValidationResult;

/**
 * REST адаптер для базової інформації замовлення.
 * Забезпечує HTTP API для роботи з базовою інформацією замовлення.
 */
@RestController
@RequestMapping("/order-wizard/stage1/basic-order-info")
public class BasicOrderInfoAdapter {

    private final BasicOrderInfoCoordinationService coordinationService;

    public BasicOrderInfoAdapter(BasicOrderInfoCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Ініціалізує новий контекст базової інформації.
     */
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeContext() {
        String sessionId = coordinationService.initializeContext();
        return ResponseEntity.ok(sessionId);
    }

    /**
     * Ініціалізує новий workflow.
     */
    @PostMapping("/workflow/start")
    public ResponseEntity<String> startWorkflow() {
        String sessionId = coordinationService.startWorkflow();
        return ResponseEntity.ok(sessionId);
    }

    /**
     * Ініціалізує workflow з даними.
     */
    @PostMapping("/workflow/start-with-data")
    public ResponseEntity<String> startWorkflowWithData(@RequestBody BasicOrderInfoDTO basicOrderInfo) {
        String sessionId = coordinationService.startWorkflowWithData(basicOrderInfo);
        return ResponseEntity.ok(sessionId);
    }

    /**
     * Отримує поточний стан.
     */
    @GetMapping("/session/{sessionId}/state")
    public ResponseEntity<BasicOrderInfoState> getCurrentState(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        BasicOrderInfoState state = coordinationService.getCurrentState(sessionId);
        return ResponseEntity.ok(state);
    }

    /**
     * Отримує поточні дані.
     */
    @GetMapping("/session/{sessionId}/data")
    public ResponseEntity<BasicOrderInfoDTO> getCurrentData(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        BasicOrderInfoDTO data = coordinationService.getCurrentData(sessionId);
        return ResponseEntity.ok(data);
    }

    /**
     * Оновлює дані в сесії.
     */
    @PutMapping("/session/{sessionId}/data")
    public ResponseEntity<Void> updateBasicOrderInfo(
            @PathVariable String sessionId,
            @RequestBody BasicOrderInfoDTO basicOrderInfo) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean updated = coordinationService.updateBasicOrderInfo(sessionId, basicOrderInfo);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    /**
     * Генерує номер квитанції.
     */
    @PostMapping("/session/{sessionId}/generate-receipt-number")
    public ResponseEntity<String> generateReceiptNumber(
            @PathVariable String sessionId,
            @RequestParam String branchCode) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        String receiptNumber = coordinationService.generateReceiptNumber(branchCode);
        if (receiptNumber != null) {
            coordinationService.confirmReceiptGeneration(sessionId, receiptNumber);
            return ResponseEntity.ok(receiptNumber);
        }
        return ResponseEntity.badRequest().build();
    }

    /**
     * Встановлює унікальну мітку.
     */
    @PostMapping("/session/{sessionId}/set-unique-tag")
    public ResponseEntity<Void> setUniqueTag(
            @PathVariable String sessionId,
            @RequestParam String uniqueTag) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean success = coordinationService.transitionToUniqueTagEntry(sessionId) &&
                         coordinationService.confirmUniqueTag(sessionId, uniqueTag);

        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    /**
     * Вибирає філію.
     */
    @PostMapping("/session/{sessionId}/select-branch")
    public ResponseEntity<Void> selectBranch(
            @PathVariable String sessionId,
            @RequestParam UUID branchId) {

        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        if (!coordinationService.isBranchAvailable(branchId)) {
            return ResponseEntity.badRequest().build();
        }

        boolean success = coordinationService.transitionToBranchSelection(sessionId) &&
                         coordinationService.confirmBranchSelection(sessionId, branchId);

        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    /**
     * Валідує дані.
     */
    @PostMapping("/session/{sessionId}/validate")
    public ResponseEntity<BasicOrderInfoValidationResult> validateData(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        BasicOrderInfoDTO data = coordinationService.getCurrentData(sessionId);
        BasicOrderInfoValidationResult result = coordinationService.validateComplete(data);
        return ResponseEntity.ok(result);
    }

    /**
     * Валідує критичні поля.
     */
    @PostMapping("/session/{sessionId}/validate-critical")
    public ResponseEntity<BasicOrderInfoValidationResult> validateCritical(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        BasicOrderInfoDTO data = coordinationService.getCurrentData(sessionId);
        BasicOrderInfoValidationResult result = coordinationService.validateCritical(data);
        return ResponseEntity.ok(result);
    }

    /**
     * Перевіряє готовність до завершення.
     */
    @GetMapping("/session/{sessionId}/ready-for-completion")
    public ResponseEntity<Boolean> isReadyForCompletion(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean ready = coordinationService.isReadyForCompletion(sessionId);
        return ResponseEntity.ok(ready);
    }

    /**
     * Завершує процес.
     */
    @PostMapping("/session/{sessionId}/complete")
    public ResponseEntity<Void> completeWorkflow(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean completed = coordinationService.completeWorkflow(sessionId);
        return completed ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    /**
     * Скидає процес.
     */
    @PostMapping("/session/{sessionId}/reset")
    public ResponseEntity<Void> resetWorkflow(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean reset = coordinationService.resetWorkflow(sessionId);
        return reset ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    /**
     * Повертається до попереднього кроку.
     */
    @PostMapping("/session/{sessionId}/go-back")
    public ResponseEntity<Void> goBack(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean success = coordinationService.goBack(sessionId);
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    /**
     * Скасовує процес.
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> cancelWorkflow(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean cancelled = coordinationService.cancelWorkflow(sessionId);
        return cancelled ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    /**
     * Отримує звіт валідації.
     */
    @GetMapping("/session/{sessionId}/validation-report")
    public ResponseEntity<String> getValidationReport(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        BasicOrderInfoDTO data = coordinationService.getCurrentData(sessionId);
        String report = coordinationService.getValidationReport(data);
        return ResponseEntity.ok(report);
    }

    /**
     * Очищає помилки.
     */
    @PostMapping("/session/{sessionId}/clear-errors")
    public ResponseEntity<Void> clearErrors(@PathVariable String sessionId) {
        if (!coordinationService.sessionExists(sessionId)) {
            return ResponseEntity.notFound().build();
        }

        boolean cleared = coordinationService.clearErrors(sessionId);
        return cleared ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
