package com.aksi.api;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.OrderItemAddRequest;
import com.aksi.domain.order.statemachine.stage2.substep3.adapter.StainsDefectsAdapter;
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsStateService.StainsDefectsContext;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST API контроллер для Stage 2 Substep 3 - Забруднення та дефекти.
 *
 * Відповідальність:
 * - Тільки підетап 3: обробка забруднень та дефектів
 * - Делегування до StainsDefectsAdapter
 *
 * Принципи:
 * - Один файл = одна відповідальність (тільки substep3)
 * - Тонкий контроллер - тільки HTTP обробка
 * - Вся логіка винесена в адаптер
 */
@RestController
@RequestMapping("/v1/order-wizard/stage2/substep3")
@Tag(name = "Order Wizard - Stage 2 Substep 3", description = "Підетап 3: Забруднення та дефекти")
public class Substep3Controller {

    private final StainsDefectsAdapter stainsDefectsAdapter;

    public Substep3Controller(StainsDefectsAdapter stainsDefectsAdapter) {
        this.stainsDefectsAdapter = stainsDefectsAdapter;
    }

    // =================== ЗАБРУДНЕННЯ ТА ДЕФЕКТИ ===================

    @Operation(
        summary = "Ініціалізація підетапу 3",
        operationId = "substep3InitializeSubstep",
        tags = {"Order Wizard - Stage 2 Substep 3", "Stains and Defects"}
    )
    @PostMapping("/initialize/{sessionId}")
    public ResponseEntity<StainsDefectsContext> initializeSubstep3(
            @PathVariable UUID sessionId,
            @RequestBody OrderItemAddRequest currentItem) {
        return stainsDefectsAdapter.initializeSubstep(sessionId, currentItem);
    }

    @Operation(
        summary = "Отримання доступних типів плям",
        operationId = "substep3GetAvailableStainTypes",
        tags = {"Order Wizard - Stage 2 Substep 3", "Stain Types"}
    )
    @GetMapping("/stain-types")
    public ResponseEntity<List<String>> getAvailableStainTypes() {
        return stainsDefectsAdapter.getAvailableStainTypes();
    }

    @Operation(
        summary = "Отримання доступних типів дефектів",
        operationId = "substep3GetAvailableDefectTypes",
        tags = {"Order Wizard - Stage 2 Substep 3", "Defect Types"}
    )
    @GetMapping("/defect-types")
    public ResponseEntity<List<String>> getAvailableDefectTypes() {
        return stainsDefectsAdapter.getAvailableDefectTypes();
    }

    @Operation(
        summary = "Обробка вибору плям",
        operationId = "substep3ProcessStainSelection",
        tags = {"Order Wizard - Stage 2 Substep 3", "Stain Selection"}
    )
    @PostMapping("/stains/{sessionId}")
    public ResponseEntity<StainsDefectsContext> processStainSelection(
            @PathVariable UUID sessionId,
            @RequestParam(required = false) String selectedStains,
            @RequestParam(required = false) String otherStains) {
        return stainsDefectsAdapter.processStainSelection(sessionId, selectedStains, otherStains);
    }

    @Operation(
        summary = "Обробка вибору дефектів та ризиків",
        operationId = "substep3ProcessDefectSelection",
        tags = {"Order Wizard - Stage 2 Substep 3", "Defect Selection"}
    )
    @PostMapping("/defects/{sessionId}")
    public ResponseEntity<StainsDefectsContext> processDefectSelection(
            @PathVariable UUID sessionId,
            @RequestParam(required = false) String selectedDefects,
            @RequestParam(required = false) String noGuaranteeReason) {
        return stainsDefectsAdapter.processDefectSelection(sessionId, selectedDefects, noGuaranteeReason);
    }

    @Operation(
        summary = "Обробка додавання приміток про дефекти",
        operationId = "substep3ProcessDefectNotes",
        tags = {"Order Wizard - Stage 2 Substep 3", "Defect Notes"}
    )
    @PostMapping("/notes/{sessionId}")
    public ResponseEntity<StainsDefectsContext> processDefectNotes(
            @PathVariable UUID sessionId,
            @RequestParam(required = false) String defectNotes) {
        return stainsDefectsAdapter.processDefectNotes(sessionId, defectNotes);
    }

    @Operation(
        summary = "Завершення підетапу 3",
        operationId = "substep3CompleteSubstep",
        tags = {"Order Wizard - Stage 2 Substep 3", "Completion"}
    )
    @PostMapping("/complete/{sessionId}")
    public ResponseEntity<StainsDefectsContext> completeSubstep3(@PathVariable UUID sessionId) {
        return stainsDefectsAdapter.completeSubstep(sessionId);
    }

    @Operation(
        summary = "Повернення до попереднього стану",
        operationId = "substep3GoBack",
        tags = {"Order Wizard - Stage 2 Substep 3", "Navigation"}
    )
    @PostMapping("/go-back/{sessionId}")
    public ResponseEntity<StainsDefectsContext> goBack(
            @PathVariable UUID sessionId,
            @RequestParam StainsDefectsState targetState) {
        return stainsDefectsAdapter.goBack(sessionId, targetState);
    }

    @Operation(
        summary = "Отримання поточного контексту",
        operationId = "substep3GetContext",
        tags = {"Order Wizard - Stage 2 Substep 3", "Status"}
    )
    @GetMapping("/context/{sessionId}")
    public ResponseEntity<StainsDefectsContext> getContext(@PathVariable UUID sessionId) {
        return stainsDefectsAdapter.getContext(sessionId);
    }
}
