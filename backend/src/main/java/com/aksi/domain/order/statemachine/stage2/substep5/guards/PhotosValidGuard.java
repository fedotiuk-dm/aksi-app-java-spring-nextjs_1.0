package com.aksi.domain.order.statemachine.stage2.substep5.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep5.adapter.PhotosStateMachineAdapter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Guard для валідації фотодокументації підетапу 2.5.
 *
 * Принцип "один файл = одна відповідальність":
 * Тільки валідація готовності фотодокументації до переходу на наступний крок.
 *
 * Перевіряє:
 * - Наявність фотографій АБО обґрунтованого пропуску
 * - Завершеність процесу документування
 * - Відсутність помилок валідації
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PhotosValidGuard implements Guard<OrderState, OrderEvent> {

    private final PhotosStateMachineAdapter photosAdapter;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        log.debug("Виконання PhotosValidGuard");

        try {
            // Перевіряємо валідність через адаптер
            Boolean isValid = photosAdapter.validatePhotosStep(context);

            if (isValid) {
                log.debug("Фотодокументація валідна, дозволяємо перехід");
                return true;
            } else {
                log.debug("Фотодокументація не валідна, блокуємо перехід");

                // Зберігаємо причину блокування
                context.getExtendedState().getVariables().put("guardBlockReason",
                    "Фотодокументація не завершена. Додайте фото або вкажіть причину пропуску.");

                return false;
            }

        } catch (Exception e) {
            log.error("Помилка в PhotosValidGuard", e);

            // У випадку помилки блокуємо перехід
            context.getExtendedState().getVariables().put("guardBlockReason",
                "Помилка валідації фотодокументації: " + e.getMessage());

            return false;
        }
    }
}
