package com.aksi.domain.order.statemachine.stage2.substep5.actions;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep5.adapter.PhotosStateMachineAdapter;
import com.aksi.domain.order.statemachine.stage2.substep5.dto.PhotoDocumentationDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Action для збереження фотодокументації підетапу 2.5.
 *
 * Принцип "один файл = одна відповідальність":
 * Тільки збереження даних фотодокументації через адаптер.
 *
 * Викликається при переході від підетапу ITEM_PHOTOS до наступного стану.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SavePhotosAction implements Action<OrderState, OrderEvent> {

    private final PhotosStateMachineAdapter photosAdapter;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.debug("Виконання SavePhotosAction");

        try {
            // Ініціалізуємо підетап якщо потрібно
            PhotoDocumentationDTO photosData = photosAdapter.initializePhotosStep(context);

            if (photosData == null) {
                log.error("Не вдалося ініціалізувати дані фотодокументації");
                context.getExtendedState().getVariables().put("actionError",
                    "Помилка ініціалізації фотодокументації");
                return;
            }

            // Валідуємо готовність до збереження
            Boolean isValid = photosAdapter.validatePhotosStep(context);
            if (!isValid) {
                log.warn("Фотодокументація не готова до збереження");
                context.getExtendedState().getVariables().put("validationError",
                    "Фотодокументація не завершена");
                return;
            }

            // Встановлюємо прапор успішного збереження
            context.getExtendedState().getVariables().put("photosStepCompleted", true);
            context.getExtendedState().getVariables().put("photosValidationStatus", "VALID");

            log.info("SavePhotosAction успішно виконано. Фотодокументація збережена");

        } catch (Exception e) {
            log.error("Помилка в SavePhotosAction", e);
            context.getExtendedState().getVariables().put("actionError",
                "Помилка збереження фотодокументації: " + e.getMessage());
            context.getExtendedState().getVariables().put("photosValidationStatus", "ERROR");
        }
    }
}
