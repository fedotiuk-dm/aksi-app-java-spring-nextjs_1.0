package com.aksi.domain.order.statemachine.stage2.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.dto.ItemManagerDTO;

/**
 * Mapper для головного екрану менеджера предметів (Етап 2.0).
 * Перетворює між внутрішнім DTO та domain DTO згідно з архітектурними правилами.
 */
@Component
public class ItemManagerMapper {

    /**
     * Створює новий ItemManagerDTO для початку роботи з менеджером предметів
     */
    public ItemManagerDTO createEmpty(final UUID orderId) {
        return ItemManagerDTO.builder()
                .sessionId(UUID.randomUUID())
                .orderId(orderId)
                .addedItems(new java.util.ArrayList<>())
                .totalAmount(BigDecimal.ZERO)
                .itemCount(0)
                .canProceedToNextStage(false)
                .currentStatus("INITIALIZED")
                .build();
    }

    /**
     * Створює ItemManagerDTO з існуючими предметами замовлення
     */
    public ItemManagerDTO fromExistingItems(final UUID orderId, final List<OrderItemDTO> existingItems) {
        final ItemManagerDTO manager = ItemManagerDTO.builder()
                .sessionId(UUID.randomUUID())
                .orderId(orderId)
                .addedItems(existingItems != null ? existingItems : new java.util.ArrayList<>())
                .currentStatus("ITEMS_LOADED")
                .build();

        manager.updateCalculatedFields();
        return manager;
    }

    /**
     * Додає новий предмет до менеджера
     */
    public ItemManagerDTO addItem(final ItemManagerDTO manager, final OrderItemDTO newItem) {
        final List<OrderItemDTO> updatedItems = new java.util.ArrayList<>(manager.getAddedItems());
        updatedItems.add(newItem);

        final ItemManagerDTO updated = manager.toBuilder()
                .addedItems(updatedItems)
                .activeWizardId(null) // Закриваємо підвізард після додавання
                .editingItemId(null)  // Виходимо з режиму редагування
                .build();

        updated.updateCalculatedFields();
        return updated;
    }

    /**
     * Оновлює існуючий предмет в менеджері
     */
    public ItemManagerDTO updateItem(final ItemManagerDTO manager, final UUID itemId, final OrderItemDTO updatedItem) {
        final List<OrderItemDTO> updatedItems = new java.util.ArrayList<>(manager.getAddedItems());

        for (int i = 0; i < updatedItems.size(); i++) {
            if (updatedItems.get(i).getId().equals(itemId)) {
                updatedItems.set(i, updatedItem);
                break;
            }
        }

        final ItemManagerDTO updated = manager.toBuilder()
                .addedItems(updatedItems)
                .activeWizardId(null) // Закриваємо підвізард після оновлення
                .editingItemId(null)  // Виходимо з режиму редагування
                .build();

        updated.updateCalculatedFields();
        return updated;
    }

    /**
     * Видаляє предмет з менеджера
     */
    public ItemManagerDTO removeItem(final ItemManagerDTO manager, final UUID itemId) {
        final List<OrderItemDTO> updatedItems = manager.getAddedItems().stream()
                .filter(item -> !item.getId().equals(itemId))
                .collect(java.util.stream.Collectors.toList());

        final ItemManagerDTO updated = manager.toBuilder()
                .addedItems(updatedItems)
                .build();

        updated.updateCalculatedFields();
        return updated;
    }

    /**
     * Запускає новий підвізард додавання предмета
     */
    public ItemManagerDTO startNewItemWizard(final ItemManagerDTO manager) {
        return manager.toBuilder()
                .activeWizardId(UUID.randomUUID())
                .editingItemId(null) // Не в режимі редагування
                .currentStatus("NEW_ITEM_WIZARD_ACTIVE")
                .build();
    }

    /**
     * Запускає підвізард редагування існуючого предмета
     */
    public ItemManagerDTO startEditItemWizard(final ItemManagerDTO manager, final UUID itemId) {
        return manager.toBuilder()
                .activeWizardId(UUID.randomUUID())
                .editingItemId(itemId)
                .currentStatus("EDIT_ITEM_WIZARD_ACTIVE")
                .build();
    }

    /**
     * Закриває активний підвізард
     */
    public ItemManagerDTO closeWizard(final ItemManagerDTO manager) {
        return manager.toBuilder()
                .activeWizardId(null)
                .editingItemId(null)
                .currentStatus("ITEMS_MANAGER_SCREEN")
                .build();
    }

    /**
     * Позначає менеджер як готовий до переходу на наступний етап
     */
    public ItemManagerDTO markReadyToProceed(final ItemManagerDTO manager) {
        manager.updateCalculatedFields();

        return manager.toBuilder()
                .currentStatus("READY_TO_PROCEED")
                .build();
    }

    /**
     * Витягує предмет для редагування за його ID
     */
    public OrderItemDTO getItemForEdit(final ItemManagerDTO manager, final UUID itemId) {
        return manager.getAddedItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElse(null);
    }

    /**
     * Перевіряє, чи можна перейти до наступного етапу
     */
    public boolean canProceedToNextStage(final ItemManagerDTO manager) {
        return manager.hasItems() && !manager.isWizardActive();
    }
}
