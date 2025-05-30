package com.aksi.ui.wizard.step2.substeps.item_defects.application;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.service.ItemCharacteristicsService;
import com.aksi.ui.wizard.step2.substeps.item_defects.domain.ItemDefectsState;
import com.aksi.ui.wizard.step2.substeps.item_defects.events.DefectsEvents;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Application Service для координації управління дефектами, плямами та ризиками предмета.
 * Відповідає за координацію між доменом та інфраструктурою.
 */
@RequiredArgsConstructor
@Slf4j
public class DefectsManagementService {

    private final ItemCharacteristicsService characteristicsService;

    // Event handlers
    private Consumer<DefectsEvents> eventHandler;

    /**
     * Встановлює обробник подій.
     */
    public void setEventHandler(Consumer<DefectsEvents> handler) {
        this.eventHandler = handler;
    }

    /**
     * Ініціалізує дефекти для предмета.
     */
    public ItemDefectsState initializeDefects(OrderItemDTO item) {
        log.debug("Ініціалізація дефектів для предмета: {} категорії: {}",
                 item.getName(), item.getCategory());

        try {
            // Створюємо початковий стан
            ItemDefectsState initialState = ItemDefectsState.createInitial(
                    item.getCategory(),
                    item.getName()
            );

            // Завантажуємо доступні опції
            loadDefectsData(item.getCategory(), initialState);

            // Повідомляємо про ініціалізацію
            publishEvent(new DefectsEvents.DefectsInitialized(initialState));

            return initialState;

        } catch (Exception ex) {
            log.error("Помилка ініціалізації дефектів: {}", ex.getMessage(), ex);
            publishEvent(new DefectsEvents.DefectsFailed(
                    "Помилка ініціалізації дефектів: " + ex.getMessage(),
                    ex
            ));

            // Повертаємо порожній стан при помилці
            return ItemDefectsState.createInitial(
                    item.getCategory(),
                    item.getName()
            );
        }
    }

    /**
     * Завантажує дані дефектів для категорії.
     */
    private void loadDefectsData(String categoryCode, ItemDefectsState currentState) {
        log.debug("Завантаження даних дефектів для категорії: {}", categoryCode);

        try {
            publishEvent(new DefectsEvents.DefectsDataLoadRequested(categoryCode));

            // Завантажуємо дані з сервісу
            List<String> stainTypes = characteristicsService.getAllStainTypes();
            List<String> defectsAndRisks = characteristicsService.getAllDefectsAndRisks();

            publishEvent(new DefectsEvents.DefectsDataLoaded(
                    categoryCode, stainTypes, defectsAndRisks
            ));

            // Оновлюємо стан з новими опціями
            ItemDefectsState updatedState = currentState.withAvailableOptions(
                    stainTypes, defectsAndRisks
            );

            publishEvent(new DefectsEvents.DefectsStateUpdated(updatedState));

        } catch (Exception ex) {
            log.error("Помилка завантаження дефектів для категорії {}: {}",
                     categoryCode, ex.getMessage(), ex);
            publishEvent(new DefectsEvents.DefectsFailed(
                    "Помилка завантаження дефектів: " + ex.getMessage(),
                    ex
            ));
        }
    }

    /**
     * Оновлює плями предмета.
     */
    public ItemDefectsState updateStains(
            ItemDefectsState currentState,
            Set<String> selectedStains,
            String otherStains) {

        log.debug("Оновлення плям: {} вибрано, інше: '{}'", selectedStains.size(), otherStains);

        try {
            publishEvent(new DefectsEvents.StainsChanged(selectedStains, otherStains));

            // Створюємо новий стан з оновленими плямами
            ItemDefectsState newState = currentState.withDefects(
                    selectedStains,
                    otherStains,
                    currentState.getSelectedDefectsAndRisks(),
                    currentState.getNoGuaranteeReason(),
                    currentState.getDefectsNotes()
            );

            publishEvent(new DefectsEvents.DefectsStateUpdated(newState));

            // Перевіряємо зміни видимості
            checkVisibilityChanges(currentState, newState);

            // Оновлюємо статистику
            updateStatistics(newState);

            return newState;

        } catch (Exception ex) {
            log.error("Помилка оновлення плям: {}", ex.getMessage(), ex);
            publishEvent(new DefectsEvents.DefectsFailed(
                    "Помилка оновлення плям: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Оновлює дефекти та ризики предмета.
     */
    public ItemDefectsState updateDefectsAndRisks(
            ItemDefectsState currentState,
            Set<String> selectedDefectsAndRisks,
            String noGuaranteeReason) {

        log.debug("Оновлення дефектів та ризиків: {} вибрано", selectedDefectsAndRisks.size());

        try {
            publishEvent(new DefectsEvents.DefectsAndRisksChanged(selectedDefectsAndRisks, noGuaranteeReason));

            // Створюємо новий стан з оновленими дефектами
            ItemDefectsState newState = currentState.withDefects(
                    currentState.getSelectedStains(),
                    currentState.getOtherStains(),
                    selectedDefectsAndRisks,
                    noGuaranteeReason,
                    currentState.getDefectsNotes()
            );

            publishEvent(new DefectsEvents.DefectsStateUpdated(newState));

            // Перевіряємо зміни видимості
            checkVisibilityChanges(currentState, newState);

            // Перевіряємо критичні ризики
            checkCriticalRisks(selectedDefectsAndRisks);

            // Оновлюємо статистику
            updateStatistics(newState);

            return newState;

        } catch (Exception ex) {
            log.error("Помилка оновлення дефектів та ризиків: {}", ex.getMessage(), ex);
            publishEvent(new DefectsEvents.DefectsFailed(
                    "Помилка оновлення дефектів та ризиків: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Оновлює примітки до дефектів.
     */
    public ItemDefectsState updateDefectsNotes(
            ItemDefectsState currentState,
            String defectsNotes) {

        log.debug("Оновлення примітки до дефектів: {}", defectsNotes != null ? defectsNotes.length() + " символів" : "порожня");

        try {
            publishEvent(new DefectsEvents.DefectsNotesChanged(defectsNotes));

            // Створюємо новий стан з оновленими примітками
            ItemDefectsState newState = currentState.withDefects(
                    currentState.getSelectedStains(),
                    currentState.getOtherStains(),
                    currentState.getSelectedDefectsAndRisks(),
                    currentState.getNoGuaranteeReason(),
                    defectsNotes
            );

            publishEvent(new DefectsEvents.DefectsStateUpdated(newState));

            return newState;

        } catch (Exception ex) {
            log.error("Помилка оновлення примітки: {}", ex.getMessage(), ex);
            publishEvent(new DefectsEvents.DefectsFailed(
                    "Помилка оновлення примітки: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Валідує поточні дефекти.
     */
    public ItemDefectsState validateDefects(ItemDefectsState currentState) {
        log.debug("Валідація дефектів для предмета: {}", currentState.getItemName());

        try {
            publishEvent(new DefectsEvents.DefectsValidationRequested(currentState));

            // Валідація відбувається автоматично в domain model при створенні стану
            publishEvent(new DefectsEvents.DefectsValidationCompleted(
                    currentState.isValid(),
                    currentState.getValidationErrors(),
                    currentState.hasCriticalErrors()
            ));

            return currentState;

        } catch (Exception ex) {
            log.error("Помилка валідації дефектів: {}", ex.getMessage(), ex);
            publishEvent(new DefectsEvents.DefectsFailed(
                    "Помилка валідації дефектів: " + ex.getMessage(),
                    ex
            ));
            return currentState;
        }
    }

    /**
     * Застосовує дефекти до предмета замовлення.
     */
    public OrderItemDTO applyDefectsToItem(OrderItemDTO item, ItemDefectsState defectsState) {
        log.debug("Застосування дефектів до предмета: {}", item.getName());

        try {
            // Застосовуємо плями
            item.setStains(defectsState.getFinalStainsString());
            item.setOtherStains(defectsState.getOtherStains());

            // Застосовуємо дефекти та ризики
            item.setDefectsAndRisks(defectsState.getFinalDefectsAndRisksString());
            item.setNoGuaranteeReason(defectsState.getNoGuaranteeReason());
            item.setDefectsNotes(defectsState.getDefectsNotes());

            return item;

        } catch (Exception ex) {
            log.error("Помилка застосування дефектів: {}", ex.getMessage(), ex);
            publishEvent(new DefectsEvents.DefectsFailed(
                    "Помилка застосування дефектів: " + ex.getMessage(),
                    ex
            ));
            return item;
        }
    }

    /**
     * Завантажує існуючі дефекти з предмета.
     */
    public ItemDefectsState loadExistingDefects(OrderItemDTO item, ItemDefectsState baseState) {
        log.debug("Завантаження існуючих дефектів з предмета: {}", item.getName());

        try {
            // Парсимо існуючі плями
            Set<String> stains = parseStringToSet(item.getStains());
            if (item.getOtherStains() != null && !item.getOtherStains().trim().isEmpty()) {
                stains.add("Інше");
            }

            // Парсимо існуючі дефекти та ризики
            Set<String> defectsAndRisks = parseStringToSet(item.getDefectsAndRisks());

            return baseState.withDefects(
                    stains,
                    item.getOtherStains(),
                    defectsAndRisks,
                    item.getNoGuaranteeReason(),
                    item.getDefectsNotes()
            );

        } catch (Exception ex) {
            log.error("Помилка завантаження існуючих дефектів: {}", ex.getMessage(), ex);
            return baseState;
        }
    }

    /**
     * Перевіряє зміни видимості полів.
     */
    private void checkVisibilityChanges(ItemDefectsState oldState, ItemDefectsState newState) {
        if (oldState.isOtherStainsVisible() != newState.isOtherStainsVisible() ||
            oldState.isNoGuaranteeReasonVisible() != newState.isNoGuaranteeReasonVisible()) {

            publishEvent(new DefectsEvents.FieldVisibilityChanged(
                    newState.isOtherStainsVisible(),
                    newState.isNoGuaranteeReasonVisible()
            ));
        }
    }

    /**
     * Перевіряє критичні ризики.
     */
    private void checkCriticalRisks(Set<String> selectedDefectsAndRisks) {
        Set<String> criticalRisks = selectedDefectsAndRisks.stream()
                .filter(risk -> risk.contains("Без гарантій") ||
                               risk.contains("Ризики деформації") ||
                               risk.contains("Ризики зміни кольору"))
                .collect(Collectors.toSet());

        if (!criticalRisks.isEmpty()) {
            String warningMessage = "Увага! Вибрано критичні ризики: " + String.join(", ", criticalRisks);
            publishEvent(new DefectsEvents.CriticalRisksWarning(criticalRisks, warningMessage));
        }
    }

    /**
     * Оновлює статистику дефектів.
     */
    private void updateStatistics(ItemDefectsState state) {
        publishEvent(new DefectsEvents.DefectsStatistics(
                state.getTotalStainsCount(),
                state.getTotalDefectsAndRisksCount(),
                state.hasAnyDefects(),
                state.requiresAttention()
        ));
    }

    /**
     * Парсить рядок у множину значень.
     */
    private Set<String> parseStringToSet(String value) {
        if (value == null || value.trim().isEmpty()) {
            return Set.of();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    /**
     * Публікує подію, якщо є обробник.
     */
    private void publishEvent(DefectsEvents event) {
        if (eventHandler != null) {
            try {
                eventHandler.accept(event);
            } catch (Exception ex) {
                log.error("Помилка обробки події {}: {}", event.getClass().getSimpleName(), ex.getMessage(), ex);
            }
        }
    }
}
