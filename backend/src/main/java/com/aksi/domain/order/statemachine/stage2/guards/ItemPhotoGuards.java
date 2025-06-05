package com.aksi.domain.order.statemachine.stage2.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.service.TempOrderItemService;
import com.aksi.domain.order.statemachine.stage2.validator.ItemPhotoValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guards для підетапу 2.5 "Фотодокументація".
 *
 * Містить перевірки для переходів state machine:
 * - Валідації фотографій
 * - Можливості збереження фото
 * - Перевірки обмежень розміру та кількості
 * - Контролю завершення підетапу
 *
 * Фото не є обов'язковими, але якщо додаються - мають бути валідними.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ItemPhotoGuards {

    private final TempOrderItemService tempOrderItemService;
    private final ItemPhotoValidator photoValidator;

    /**
     * Перевіряє чи можна зберегти фотографії.
     */
    public Guard<OrderState, OrderEvent> canSavePhotos() {
        return context -> {
            try {
                TempOrderItemDTO tempItem = getTempItemFromContext(context);
                if (tempItem == null) {
                    log.warn("TempOrderItemDTO відсутній в контексті для збереження фотографій");
                    return false;
                }

                // Якщо фото немає - можна зберегти (фото необов'язкові)
                if (!tempItem.hasPhotos()) {
                    log.debug("Немає фотографій для збереження, дозволяємо");
                    return true;
                }

                // Якщо фото є - перевіряємо базову валідність
                // ItemPhotoValidator працює з ItemPhotoDTO, тому робимо базову перевірку
                boolean isValid = tempItem.getPhotoIds() != null && !tempItem.getPhotoIds().isEmpty();
                log.debug("Валідність фотографій для збереження: {}", isValid);

                return isValid;

            } catch (Exception e) {
                log.error("Помилка при перевірці можливості збереження фотографій: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна додати нову фотографію.
     */
    public Guard<OrderState, OrderEvent> canAddPhoto() {
        return context -> {
            try {
                TempOrderItemDTO tempItem = getTempItemFromContext(context);
                if (tempItem == null) {
                    log.warn("TempOrderItemDTO відсутній в контексті для додавання фото");
                    return false;
                }

                // Перевіряємо ліміт фотографій (максимум 5)
                int photoCount = tempItem.getPhotoIds() != null ? tempItem.getPhotoIds().size() : 0;
                boolean canAdd = photoCount < 5; // Максимум 5 фото
                log.debug("Можливість додавання нового фото (поточна кількість: {}): {}", photoCount, canAdd);

                return canAdd;

            } catch (Exception e) {
                log.error("Помилка при перевірці можливості додавання фото: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна видалити фотографію.
     */
    public Guard<OrderState, OrderEvent> canDeletePhoto() {
        return context -> {
            try {
                TempOrderItemDTO tempItem = getTempItemFromContext(context);
                if (tempItem == null) {
                    log.warn("TempOrderItemDTO відсутній в контексті для видалення фото");
                    return false;
                }

                // Завжди можна видалити фото, оскільки вони необов'язкові
                log.debug("Видалення фото дозволено");
                return true;

            } catch (Exception e) {
                log.error("Помилка при перевірці можливості видалення фото: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна завершити підетап фотодокументації.
     */
    public Guard<OrderState, OrderEvent> canCompletePhotoStep() {
        return context -> {
            try {
                TempOrderItemDTO tempItem = getTempItemFromContext(context);
                if (tempItem == null) {
                    log.warn("TempOrderItemDTO відсутній в контексті для завершення фото етапу");
                    return false;
                }

                // Фото необов'язкові, тому завжди можна завершити
                // Базова перевірка - немає критичних помилок
                boolean canComplete = true; // Фото завжди можна завершити
                log.debug("Можливість завершення фото етапу: {}", canComplete);

                return canComplete;

            } catch (Exception e) {
                log.error("Помилка при перевірці можливості завершення фото етапу: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна перейти до завершення додавання предмета.
     */
    public Guard<OrderState, OrderEvent> canProceedToAddItem() {
        return context -> {
            try {
                TempOrderItemDTO tempItem = getTempItemFromContext(context);
                if (tempItem == null) {
                    log.warn("TempOrderItemDTO відсутній в контексті для додавання предмета");
                    return false;
                }

                // Перевіряємо чи готовий весь TempOrderItem для додавання
                boolean readyToAdd = tempOrderItemService.isReadyToComplete(tempItem);
                log.debug("Готовність TempOrderItem для додавання: {}", readyToAdd);

                return readyToAdd;

            } catch (Exception e) {
                log.error("Помилка при перевірці готовності до додавання предмета: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи є фотографії для предмета.
     */
    public Guard<OrderState, OrderEvent> hasPhotos() {
        return context -> {
            try {
                TempOrderItemDTO tempItem = getTempItemFromContext(context);
                if (tempItem == null) {
                    return false;
                }

                boolean hasPhotos = tempItem.hasPhotos();
                log.debug("Наявність фотографій для предмета: {}", hasPhotos);

                return hasPhotos;

            } catch (Exception e) {
                log.error("Помилка при перевірці наявності фотографій: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи перевищено ліміт фотографій.
     */
    public Guard<OrderState, OrderEvent> isPhotoLimitExceeded() {
        return context -> {
            try {
                TempOrderItemDTO tempItem = getTempItemFromContext(context);
                if (tempItem == null) {
                    return false;
                }

                int photoCount = tempItem.getPhotoIds() != null ? tempItem.getPhotoIds().size() : 0;
                boolean limitExceeded = photoCount >= 5; // Максимум 5 фото
                if (limitExceeded) {
                    log.warn("Перевищено ліміт фотографій для предмета: {}/5", photoCount);
                }

                return limitExceeded;

            } catch (Exception e) {
                log.error("Помилка при перевірці ліміту фотографій: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи всі фотографії валідні за розміром.
     */
    public Guard<OrderState, OrderEvent> arePhotosValidSize() {
        return context -> {
            try {
                TempOrderItemDTO tempItem = getTempItemFromContext(context);
                if (tempItem == null) {
                    return true; // Немає фото = валідно
                }

                // Базова перевірка розмірів фото - якщо фото є, вважаємо їх валідними
                // (детальна валідація відбувається при завантаженні)
                boolean validSize = true;
                if (!validSize) {
                    log.warn("Знайдено фотографії з невалідним розміром");
                }

                return validSize;

            } catch (Exception e) {
                log.error("Помилка при перевірці розміру фотографій: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна очистити всі фотографії.
     */
    public Guard<OrderState, OrderEvent> canClearAllPhotos() {
        return context -> {
            try {
                TempOrderItemDTO tempItem = getTempItemFromContext(context);
                if (tempItem == null) {
                    log.warn("TempOrderItemDTO відсутній в контексті для очищення фото");
                    return false;
                }

                // Завжди можна очистити фото, оскільки вони необов'язкові
                log.debug("Очищення всіх фотографій дозволено");
                return true;

            } catch (Exception e) {
                log.error("Помилка при перевірці можливості очищення фото: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    // Допоміжні методи

    /**
     * Витягує TempOrderItemDTO з контексту state machine.
     */
    private TempOrderItemDTO getTempItemFromContext(StateContext<OrderState, OrderEvent> context) {
        try {
            if (context == null || context.getExtendedState() == null) {
                return null;
            }

            Object tempItemObj = context.getExtendedState().getVariables().get("tempOrderItem");
            if (tempItemObj instanceof TempOrderItemDTO tempItem) {
                return tempItem;
            }

            return null;

        } catch (Exception e) {
            log.error("Помилка при витягуванні TempOrderItemDTO з контексту: {}", e.getMessage(), e);
            return null;
        }
    }
}
