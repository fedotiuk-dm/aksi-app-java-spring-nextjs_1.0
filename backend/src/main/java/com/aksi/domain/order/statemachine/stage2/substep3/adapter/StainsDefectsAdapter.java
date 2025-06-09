package com.aksi.domain.order.statemachine.stage2.substep3.adapter;

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
import com.aksi.domain.order.statemachine.stage2.substep3.enums.StainsDefectsState;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsCoordinationService;
import com.aksi.domain.order.statemachine.stage2.substep3.service.StainsDefectsStateService.StainsDefectsContext;

/**
 * REST API адаптер для підетапу 2.3 "Забруднення, дефекти та ризики".
 * Використовує ТІЛЬКИ CoordinationService (згідно архітектурних правил).
 */
@RestController
@RequestMapping("/order-wizard/stage2/substep3")
public class StainsDefectsAdapter {

    private final StainsDefectsCoordinationService coordinationService;

    public StainsDefectsAdapter(final StainsDefectsCoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Ініціалізація підетапу 2.3.
     *
     * @param sessionId ідентифікатор сесії
     * @param currentItem поточний предмет
     * @return контекст підетапу
     */
    @PostMapping("/initialize/{sessionId}")
    public ResponseEntity<StainsDefectsContext> initializeSubstep(
            @PathVariable final UUID sessionId,
            @RequestBody final OrderItemAddRequest currentItem) {
        try {
            final StainsDefectsContext context = coordinationService.initializeSubstep(sessionId, currentItem);
            return ResponseEntity.ok(context);
        } catch (Exception e) {
            coordinationService.setError(sessionId, "Помилка ініціалізації: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Отримання доступних типів плям.
     *
     * @return список типів плям
     */
    @GetMapping("/stain-types")
    public ResponseEntity<List<String>> getAvailableStainTypes() {
        try {
            final List<String> stainTypes = coordinationService.getAvailableStainTypes();
            return ResponseEntity.ok(stainTypes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Отримання доступних типів дефектів.
     *
     * @return список типів дефектів
     */
    @GetMapping("/defect-types")
    public ResponseEntity<List<String>> getAvailableDefectTypes() {
        try {
            final List<String> defectTypes = coordinationService.getAvailableDefectTypes();
            return ResponseEntity.ok(defectTypes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Обробка вибору плям.
     *
     * @param sessionId ідентифікатор сесії
     * @param selectedStains вибрані плями
     * @param otherStains інші плями
     * @return оновлений контекст
     */
    @PostMapping("/stains/{sessionId}")
    public ResponseEntity<StainsDefectsContext> processStainSelection(
            @PathVariable final UUID sessionId,
            @RequestParam(required = false) final String selectedStains,
            @RequestParam(required = false) final String otherStains) {
        try {
            final StainsDefectsContext context = coordinationService.processStainSelection(
                sessionId, selectedStains, otherStains);
            return ResponseEntity.ok(context);
        } catch (Exception e) {
            coordinationService.setError(sessionId, "Помилка обробки плям: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Обробка вибору дефектів та ризиків.
     *
     * @param sessionId ідентифікатор сесії
     * @param selectedDefects вибрані дефекти
     * @param noGuaranteeReason причина відмови від гарантій
     * @return оновлений контекст
     */
    @PostMapping("/defects/{sessionId}")
    public ResponseEntity<StainsDefectsContext> processDefectSelection(
            @PathVariable final UUID sessionId,
            @RequestParam(required = false) final String selectedDefects,
            @RequestParam(required = false) final String noGuaranteeReason) {
        try {
            final StainsDefectsContext context = coordinationService.processDefectSelection(
                sessionId, selectedDefects, noGuaranteeReason);
            return ResponseEntity.ok(context);
        } catch (Exception e) {
            coordinationService.setError(sessionId, "Помилка обробки дефектів: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Обробка додавання приміток про дефекти.
     *
     * @param sessionId ідентифікатор сесії
     * @param defectNotes примітки про дефекти
     * @return оновлений контекст
     */
    @PostMapping("/notes/{sessionId}")
    public ResponseEntity<StainsDefectsContext> processDefectNotes(
            @PathVariable final UUID sessionId,
            @RequestParam(required = false) final String defectNotes) {
        try {
            final StainsDefectsContext context = coordinationService.processDefectNotes(sessionId, defectNotes);
            return ResponseEntity.ok(context);
        } catch (Exception e) {
            coordinationService.setError(sessionId, "Помилка обробки приміток: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Завершення підетапу.
     *
     * @param sessionId ідентифікатор сесії
     * @return фінальний контекст
     */
    @PostMapping("/complete/{sessionId}")
    public ResponseEntity<StainsDefectsContext> completeSubstep(@PathVariable final UUID sessionId) {
        try {
            // Перевірка готовності до завершення
            if (!coordinationService.isReadyForCompletion(sessionId)) {
                final String errors = coordinationService.getValidationErrors(sessionId);
                coordinationService.setError(sessionId, "Не можна завершити підетап: " + errors);
                return ResponseEntity.badRequest().build();
            }

            final StainsDefectsContext context = coordinationService.completeSubstep(sessionId);
            return ResponseEntity.ok(context);
        } catch (Exception e) {
            coordinationService.setError(sessionId, "Помилка завершення: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Повернення до попереднього стану.
     *
     * @param sessionId ідентифікатор сесії
     * @param targetState цільовий стан
     * @return оновлений контекст
     */
    @PostMapping("/go-back/{sessionId}")
    public ResponseEntity<StainsDefectsContext> goBack(
            @PathVariable final UUID sessionId,
            @RequestParam final StainsDefectsState targetState) {
        try {
            final StainsDefectsContext context = coordinationService.goBack(sessionId, targetState);
            return ResponseEntity.ok(context);
        } catch (Exception e) {
            coordinationService.setError(sessionId, "Помилка повернення: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Скидання підетапу.
     *
     * @param sessionId ідентифікатор сесії
     * @return скинутий контекст
     */
    @PostMapping("/reset/{sessionId}")
    public ResponseEntity<StainsDefectsContext> reset(@PathVariable final UUID sessionId) {
        try {
            final StainsDefectsContext context = coordinationService.reset(sessionId);
            return ResponseEntity.ok(context);
        } catch (Exception e) {
            coordinationService.setError(sessionId, "Помилка скидання: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Отримання поточного контексту сесії.
     *
     * @param sessionId ідентифікатор сесії
     * @return контекст сесії
     */
    @GetMapping("/context/{sessionId}")
    public ResponseEntity<StainsDefectsContext> getContext(@PathVariable final UUID sessionId) {
        try {
            final StainsDefectsContext context = coordinationService.getContext(sessionId);
            if (context == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(context);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
