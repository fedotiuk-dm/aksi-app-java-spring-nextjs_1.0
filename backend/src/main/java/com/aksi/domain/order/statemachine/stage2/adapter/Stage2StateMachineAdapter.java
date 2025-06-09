package com.aksi.domain.order.statemachine.stage2.adapter;

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
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;
import com.aksi.domain.order.statemachine.stage2.enums.Stage2State;
import com.aksi.domain.order.statemachine.stage2.service.Stage2CoordinationService;
import com.aksi.domain.order.statemachine.stage2.validator.ValidationResult;

/**
 * REST адаптер для управління Stage2 - головним екраном менеджера предметів.
 * Забезпечує HTTP API для взаємодії з State Machine.
 */
@RestController
@RequestMapping("/order-wizard/stage2")
public class Stage2StateMachineAdapter {

    private final Stage2CoordinationService coordinationService;

    public Stage2StateMachineAdapter(final Stage2CoordinationService coordinationService) {
        this.coordinationService = coordinationService;
    }

    /**
     * Ініціалізує новий сеанс менеджера предметів для замовлення
     */
    @PostMapping("/initialize/{orderId}")
    public ResponseEntity<ItemManagerDTO> initializeItemManager(@PathVariable final UUID orderId) {
        try {
            final ItemManagerDTO manager = coordinationService.initializeItemManager(orderId);
            return ResponseEntity.ok(manager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Отримує поточний стан менеджера предметів
     */
    @GetMapping("/manager/{sessionId}")
    public ResponseEntity<ItemManagerDTO> getCurrentManager(@PathVariable final UUID sessionId) {
        try {
            final ItemManagerDTO manager = coordinationService.getCurrentManager(sessionId);
            if (manager == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(manager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Запускає новий підвізард додавання предмета
     */
    @PostMapping("/wizard/new/{sessionId}")
    public ResponseEntity<ItemManagerDTO> startNewItemWizard(@PathVariable final UUID sessionId) {
        try {
            final ItemManagerDTO manager = coordinationService.startNewItemWizard(sessionId);
            return ResponseEntity.ok(manager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Запускає підвізард редагування існуючого предмета
     */
    @PostMapping("/wizard/edit/{sessionId}/{itemId}")
    public ResponseEntity<ItemManagerDTO> startEditItemWizard(
            @PathVariable final UUID sessionId,
            @PathVariable final UUID itemId) {
        try {
            final ItemManagerDTO manager = coordinationService.startEditItemWizard(sessionId, itemId);
            return ResponseEntity.ok(manager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Додає новий предмет до замовлення (з підвізарда)
     */
    @PostMapping("/items/{sessionId}")
    public ResponseEntity<ItemManagerDTO> addItemToOrder(
            @PathVariable final UUID sessionId,
            @RequestBody final OrderItemDTO itemDTO) {
        try {
            final ItemManagerDTO manager = coordinationService.addItemToOrder(sessionId, itemDTO);
            return ResponseEntity.ok(manager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Оновлює існуючий предмет замовлення (з підвізарда)
     */
    @PutMapping("/items/{sessionId}/{itemId}")
    public ResponseEntity<ItemManagerDTO> updateItemInOrder(
            @PathVariable final UUID sessionId,
            @PathVariable final UUID itemId,
            @RequestBody final OrderItemDTO itemDTO) {
        try {
            final ItemManagerDTO manager = coordinationService.updateItemInOrder(sessionId, itemId, itemDTO);
            return ResponseEntity.ok(manager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Видаляє предмет з замовлення
     */
    @DeleteMapping("/items/{sessionId}/{itemId}")
    public ResponseEntity<ItemManagerDTO> deleteItemFromOrder(
            @PathVariable final UUID sessionId,
            @PathVariable final UUID itemId) {
        try {
            final ItemManagerDTO manager = coordinationService.deleteItemFromOrder(sessionId, itemId);
            return ResponseEntity.ok(manager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Закриває активний підвізард без збереження
     */
    @PostMapping("/wizard/close/{sessionId}")
    public ResponseEntity<ItemManagerDTO> closeWizard(@PathVariable final UUID sessionId) {
        try {
            final ItemManagerDTO manager = coordinationService.closeWizard(sessionId);
            return ResponseEntity.ok(manager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Перевіряє готовність до переходу на наступний етап
     */
    @GetMapping("/ready/{sessionId}")
    public ResponseEntity<Boolean> checkReadinessToProceed(@PathVariable final UUID sessionId) {
        try {
            final boolean ready = coordinationService.checkReadinessToProceed(sessionId);
            return ResponseEntity.ok(ready);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Завершує етап 2 та переходить до наступного етапу
     */
    @PostMapping("/complete/{sessionId}")
    public ResponseEntity<ItemManagerDTO> completeStage2(@PathVariable final UUID sessionId) {
        try {
            final ItemManagerDTO manager = coordinationService.completeStage2(sessionId);
            return ResponseEntity.ok(manager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Отримує поточний стан сесії
     */
    @GetMapping("/state/{sessionId}")
    public ResponseEntity<Stage2State> getCurrentState(@PathVariable final UUID sessionId) {
        try {
            final Stage2State state = coordinationService.getCurrentState(sessionId);
            return ResponseEntity.ok(state);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Валідує поточний стан менеджера
     */
    @GetMapping("/validate/{sessionId}")
    public ResponseEntity<ValidationResult> validateCurrentState(@PathVariable final UUID sessionId) {
        try {
            final ItemManagerDTO manager = coordinationService.getCurrentManager(sessionId);
            if (manager == null) {
                return ResponseEntity.notFound().build();
            }
            final ValidationResult result = coordinationService.validateManager(manager);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Синхронізує менеджер з актуальними даними замовлення
     */
    @PostMapping("/synchronize/{sessionId}")
    public ResponseEntity<ItemManagerDTO> synchronizeManager(@PathVariable final UUID sessionId) {
        try {
            final ItemManagerDTO manager = coordinationService.synchronizeManager(sessionId);
            return ResponseEntity.ok(manager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Скидає сесію до початкового стану
     */
    @PostMapping("/reset/{sessionId}")
    public ResponseEntity<Void> resetSession(@PathVariable final UUID sessionId) {
        try {
            coordinationService.resetSession(sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Видаляє сесію повністю
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> terminateSession(@PathVariable final UUID sessionId) {
        try {
            coordinationService.terminateSession(sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Отримує статистику активних сесій
     */
    @GetMapping("/sessions/count")
    public ResponseEntity<Integer> getActiveSessionCount() {
        try {
            final int count = coordinationService.getActiveContextCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
