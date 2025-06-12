package com.aksi.api;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.adapter.Stage2StateMachineAdapter;
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2State;
import com.aksi.domain.order.statemachine.stage2.validator.ValidationResult;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST API контроллер для Stage 2 - Головний менеджер предметів.
 *
 * Відповідальність:
 * - Тільки головний екран менеджера предметів
 * - Управління сесіями та загальними операціями
 * - CRUD операції з предметами
 *
 * Принципи:
 * - Один файл = одна відповідальність (тільки головний менеджер)
 * - Підетапи винесені в окремі контроллери
 * - Тонкий контроллер - тільки HTTP обробка
 */
@RestController
@RequestMapping("/v1/order-wizard/stage2")
@Tag(name = "Order Wizard - Stage 2", description = "Етап 2: Головний менеджер предметів")
public class Stage2Controller {

    private final Stage2StateMachineAdapter stage2Adapter;

    public Stage2Controller(Stage2StateMachineAdapter stage2Adapter) {
        this.stage2Adapter = stage2Adapter;
    }

    // =================== ГОЛОВНИЙ ЕКРАН МЕНЕДЖЕРА ПРЕДМЕТІВ ===================

    @Operation(
        summary = "Ініціалізує новий сеанс менеджера предметів для замовлення",
        operationId = "stage2InitializeItemManager",
        tags = {"Order Wizard - Stage 2", "Item Manager"}
    )
    @PostMapping("/initialize/{orderId}")
    public ResponseEntity<ItemManagerDTO> initializeItemManager(@PathVariable UUID orderId) {
        return stage2Adapter.initializeItemManager(orderId);
    }

    @Operation(
        summary = "Отримує поточний стан менеджера предметів",
        operationId = "stage2GetCurrentManager",
        tags = {"Order Wizard - Stage 2", "Item Manager"}
    )
    @GetMapping("/manager/{sessionId}")
    public ResponseEntity<ItemManagerDTO> getCurrentManager(@PathVariable UUID sessionId) {
        return stage2Adapter.getCurrentManager(sessionId);
    }

    @Operation(
        summary = "Запускає новий підвізард додавання предмета",
        operationId = "stage2StartNewItemWizard",
        tags = {"Order Wizard - Stage 2", "Item Wizard"}
    )
    @PostMapping("/wizard/new/{sessionId}")
    public ResponseEntity<ItemManagerDTO> startNewItemWizard(@PathVariable UUID sessionId) {
        return stage2Adapter.startNewItemWizard(sessionId);
    }

    @Operation(
        summary = "Запускає підвізард редагування існуючого предмета",
        operationId = "stage2StartEditItemWizard",
        tags = {"Order Wizard - Stage 2", "Item Wizard"}
    )
    @PostMapping("/wizard/edit/{sessionId}/{itemId}")
    public ResponseEntity<ItemManagerDTO> startEditItemWizard(
            @PathVariable UUID sessionId,
            @PathVariable UUID itemId) {
        return stage2Adapter.startEditItemWizard(sessionId, itemId);
    }

    @Operation(
        summary = "Додає новий предмет до замовлення (з підвізарда)",
        operationId = "stage2AddItemToOrder",
        tags = {"Order Wizard - Stage 2", "Item Operations"}
    )
    @PostMapping("/items/{sessionId}")
    public ResponseEntity<ItemManagerDTO> addItemToOrder(
            @PathVariable UUID sessionId,
            @RequestBody OrderItemDTO itemDTO) {
        return stage2Adapter.addItemToOrder(sessionId, itemDTO);
    }

    @Operation(
        summary = "Оновлює існуючий предмет замовлення (з підвізарда)",
        operationId = "stage2UpdateItemInOrder",
        tags = {"Order Wizard - Stage 2", "Item Operations"}
    )
    @PutMapping("/items/{sessionId}/{itemId}")
    public ResponseEntity<ItemManagerDTO> updateItemInOrder(
            @PathVariable UUID sessionId,
            @PathVariable UUID itemId,
            @RequestBody OrderItemDTO itemDTO) {
        return stage2Adapter.updateItemInOrder(sessionId, itemId, itemDTO);
    }

    @Operation(
        summary = "Видаляє предмет з замовлення",
        operationId = "stage2DeleteItemFromOrder",
        tags = {"Order Wizard - Stage 2", "Item Operations"}
    )
    @DeleteMapping("/items/{sessionId}/{itemId}")
    public ResponseEntity<ItemManagerDTO> deleteItemFromOrder(
            @PathVariable UUID sessionId,
            @PathVariable UUID itemId) {
        return stage2Adapter.deleteItemFromOrder(sessionId, itemId);
    }

    @Operation(
        summary = "Закриває активний підвізард без збереження",
        operationId = "stage2CloseWizard",
        tags = {"Order Wizard - Stage 2", "Item Wizard"}
    )
    @PostMapping("/wizard/close/{sessionId}")
    public ResponseEntity<ItemManagerDTO> closeWizard(@PathVariable UUID sessionId) {
        return stage2Adapter.closeWizard(sessionId);
    }

    @Operation(
        summary = "Перевіряє готовність до переходу на наступний етап",
        operationId = "stage2CheckReadinessToProceed",
        tags = {"Order Wizard - Stage 2", "Stage Operations"}
    )
    @GetMapping("/ready/{sessionId}")
    public ResponseEntity<Boolean> checkReadinessToProceed(@PathVariable UUID sessionId) {
        return stage2Adapter.checkReadinessToProceed(sessionId);
    }

    @Operation(
        summary = "Завершує етап 2 та переходить до наступного етапу",
        operationId = "stage2CompleteStage",
        tags = {"Order Wizard - Stage 2", "Stage Operations"}
    )
    @PostMapping("/complete/{sessionId}")
    public ResponseEntity<ItemManagerDTO> completeStage2(@PathVariable UUID sessionId) {
        return stage2Adapter.completeStage2(sessionId);
    }

    @Operation(
        summary = "Отримує поточний стан сесії",
        operationId = "stage2GetCurrentState",
        tags = {"Order Wizard - Stage 2", "Session Management"}
    )
    @GetMapping("/state/{sessionId}")
    public ResponseEntity<Stage2State> getCurrentState(@PathVariable UUID sessionId) {
        return stage2Adapter.getCurrentState(sessionId);
    }

    @Operation(
        summary = "Валідує поточний стан менеджера",
        operationId = "stage2ValidateCurrentState",
        tags = {"Order Wizard - Stage 2", "Session Management"}
    )
    @GetMapping("/validate/{sessionId}")
    public ResponseEntity<ValidationResult> validateCurrentState(@PathVariable UUID sessionId) {
        return stage2Adapter.validateCurrentState(sessionId);
    }

    @Operation(
        summary = "Синхронізує стан менеджера",
        operationId = "stage2SynchronizeManager",
        tags = {"Order Wizard - Stage 2", "Session Management"}
    )
    @PostMapping("/synchronize/{sessionId}")
    public ResponseEntity<ItemManagerDTO> synchronizeManager(@PathVariable UUID sessionId) {
        return stage2Adapter.synchronizeManager(sessionId);
    }

    @Operation(
        summary = "Скидає сесію до початкового стану",
        operationId = "stage2ResetSession",
        tags = {"Order Wizard - Stage 2", "Session Management"}
    )
    @PostMapping("/reset/{sessionId}")
    public ResponseEntity<Void> resetSession(@PathVariable UUID sessionId) {
        return stage2Adapter.resetSession(sessionId);
    }

    @Operation(
        summary = "Завершує сесію та звільняє ресурси",
        operationId = "stage2TerminateSession",
        tags = {"Order Wizard - Stage 2", "Session Management"}
    )
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> terminateSession(@PathVariable UUID sessionId) {
        return stage2Adapter.terminateSession(sessionId);
    }

    @Operation(
        summary = "Отримує кількість активних сесій",
        operationId = "stage2GetActiveSessionCount",
        tags = {"Order Wizard - Stage 2", "Session Management"}
    )
    @GetMapping("/sessions/count")
    public ResponseEntity<Integer> getActiveSessionCount() {
        return stage2Adapter.getActiveSessionCount();
    }
}
