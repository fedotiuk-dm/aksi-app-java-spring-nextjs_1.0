package com.aksi.domain.order.statemachine.stage3.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage3.dto.OrderAdditionalInfoDTO;
import com.aksi.domain.order.statemachine.stage3.service.OrderAdditionalInfoStepService;
import com.aksi.domain.order.statemachine.stage3.validator.OrderAdditionalInfoValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Guards для підетапу 3.4 "Додаткова інформація".
 *
 * Містить перевірки для переходів state machine:
 * - Валідації даних для збереження
 * - Можливості переходу до наступного етапу
 * - Перевірки критичних помилок
 * - Контролю завершення підетапу
 *
 * Цей підетап є найпростішим, оскільки всі поля необов'язкові.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderAdditionalInfoGuards {

    private final OrderAdditionalInfoStepService stepService;
    private final OrderAdditionalInfoValidator validator;

    /**
     * Перевіряє чи можна зберегти дані додаткової інформації.
     */
    public Guard<OrderState, OrderEvent> canSaveAdditionalInfo() {
        return context -> {
            try {
                String wizardId = getWizardIdFromContext(context);
                if (wizardId == null) {
                    log.warn("WizardId відсутній в контексті для збереження додаткової інформації");
                    return false;
                }

                // Завантажуємо дані та перевіряємо чи немає критичних помилок
                return !stepService.hasCriticalErrors(wizardId);

            } catch (Exception e) {
                log.error("Помилка при перевірці можливості збереження додаткової інформації: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна перейти до наступного етапу (етап 4).
     */
    public Guard<OrderState, OrderEvent> canProceedToNextStage() {
        return context -> {
            try {
                String wizardId = getWizardIdFromContext(context);
                if (wizardId == null) {
                    log.warn("WizardId відсутній в контексті для переходу до наступного етапу");
                    return false;
                }

                // Для додаткової інформації завжди можна перейти далі
                // оскільки всі поля необов'язкові
                boolean canProceed = stepService.canProceedToNextStep(wizardId);

                if (canProceed) {
                    log.debug("Можна перейти до етапу 4 з додаткової інформації для wizardId: {}", wizardId);
                } else {
                    log.warn("Неможливо перейти до етапу 4 з додаткової інформації для wizardId: {}", wizardId);
                }

                return canProceed;

            } catch (Exception e) {
                log.error("Помилка при перевірці можливості переходу до наступного етапу: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна завершити підетап 3.4.
     */
    public Guard<OrderState, OrderEvent> canCompleteAdditionalInfoStep() {
        return context -> {
            try {
                String wizardId = getWizardIdFromContext(context);
                if (wizardId == null) {
                    log.warn("WizardId відсутній в контексті для завершення підетапу");
                    return false;
                }

                // Завантажуємо дані та перевіряємо валідацію
                OrderAdditionalInfoDTO dto = stepService.loadAdditionalInfoStep(wizardId);
                boolean isValid = validator.canProceedToNext(dto);

                if (isValid) {
                    log.debug("Підетап додаткової інформації можна завершити для wizardId: {}", wizardId);
                } else {
                    log.warn("Підетап додаткової інформації не можна завершити через помилки валідації для wizardId: {}", wizardId);
                }

                return isValid;

            } catch (Exception e) {
                log.error("Помилка при перевірці можливості завершення підетапу додаткової інформації: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна редагувати дані додаткової інформації.
     */
    public Guard<OrderState, OrderEvent> canEditAdditionalInfo() {
        return context -> {
            try {
                String wizardId = getWizardIdFromContext(context);
                if (wizardId == null) {
                    log.warn("WizardId відсутній в контексті для редагування додаткової інформації");
                    return false;
                }

                // Для додаткової інформації завжди можна редагувати
                // оскільки це не впливає на критичні частини замовлення
                log.debug("Редагування додаткової інформації дозволено для wizardId: {}", wizardId);
                return true;

            } catch (Exception e) {
                log.error("Помилка при перевірці можливості редагування додаткової інформації: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи можна очистити дані додаткової інформації.
     */
    public Guard<OrderState, OrderEvent> canClearAdditionalInfo() {
        return context -> {
            try {
                String wizardId = getWizardIdFromContext(context);
                if (wizardId == null) {
                    log.warn("WizardId відсутній в контексті для очищення додаткової інформації");
                    return false;
                }

                // Завжди можна очистити додаткову інформацію
                // оскільки всі поля необов'язкові
                log.debug("Очищення додаткової інформації дозволено для wizardId: {}", wizardId);
                return true;

            } catch (Exception e) {
                log.error("Помилка при перевірці можливості очищення додаткової інформації: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи є критична інформація що потребує особливої уваги.
     */
    public Guard<OrderState, OrderEvent> hasCriticalInfo() {
        return context -> {
            try {
                String wizardId = getWizardIdFromContext(context);
                if (wizardId == null) {
                    return false;
                }

                OrderAdditionalInfoDTO dto = stepService.loadAdditionalInfoStep(wizardId);
                boolean hasCritical = Boolean.TRUE.equals(dto.getHasCriticalInfo());

                if (hasCritical) {
                    log.info("Виявлено критичну інформацію в замовленні wizardId: {}", wizardId);
                }

                return hasCritical;

            } catch (Exception e) {
                log.error("Помилка при перевірці наявності критичної інформації: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи потрібне додаткове підтвердження від клієнта.
     */
    public Guard<OrderState, OrderEvent> requiresAdditionalConfirmation() {
        return context -> {
            try {
                String wizardId = getWizardIdFromContext(context);
                if (wizardId == null) {
                    return false;
                }

                OrderAdditionalInfoDTO dto = stepService.loadAdditionalInfoStep(wizardId);
                boolean requiresConfirmation = Boolean.TRUE.equals(dto.getRequiresAdditionalConfirmation());

                if (requiresConfirmation) {
                    log.info("Замовлення потребує додаткового підтвердження wizardId: {}", wizardId);
                }

                return requiresConfirmation;

            } catch (Exception e) {
                log.error("Помилка при перевірці необхідності додаткового підтвердження: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи є будь-яка додаткова інформація заповнена.
     */
    public Guard<OrderState, OrderEvent> hasAnyAdditionalInfo() {
        return context -> {
            try {
                String wizardId = getWizardIdFromContext(context);
                if (wizardId == null) {
                    return false;
                }

                OrderAdditionalInfoDTO dto = stepService.loadAdditionalInfoStep(wizardId);
                boolean hasInfo = dto.hasAnyAdditionalInfo();

                log.debug("Наявність додаткової інформації для wizardId {}: {}", wizardId, hasInfo);
                return hasInfo;

            } catch (Exception e) {
                log.error("Помилка при перевірці наявності додаткової інформації: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    /**
     * Перевіряє чи перевищує загальна довжина тексту допустимі межі.
     */
    public Guard<OrderState, OrderEvent> isTextLengthWithinLimits() {
        return context -> {
            try {
                String wizardId = getWizardIdFromContext(context);
                if (wizardId == null) {
                    return false;
                }

                OrderAdditionalInfoDTO dto = stepService.loadAdditionalInfoStep(wizardId);
                Integer totalLength = dto.getTotalCharacterCount();
                int maxLength = OrderAdditionalInfoValidator.getMaxTotalCharacterCount();

                boolean withinLimits = totalLength <= maxLength;

                if (!withinLimits) {
                    log.warn("Перевищено ліміт символів для wizardId {}: {}/{}", wizardId, totalLength, maxLength);
                }

                return withinLimits;

            } catch (Exception e) {
                log.error("Помилка при перевірці довжини тексту: {}", e.getMessage(), e);
                return false;
            }
        };
    }

    // Допоміжні методи

    /**
     * Витягує wizardId з контексту state machine.
     */
    private String getWizardIdFromContext(StateContext<OrderState, OrderEvent> context) {
        try {
            if (context == null || context.getExtendedState() == null) {
                return null;
            }

            Object wizardIdObj = context.getExtendedState().getVariables().get("wizardId");
            return wizardIdObj != null ? wizardIdObj.toString() : null;

        } catch (Exception e) {
            log.error("Помилка при витягуванні wizardId з контексту: {}", e.getMessage(), e);
            return null;
        }
    }
}
