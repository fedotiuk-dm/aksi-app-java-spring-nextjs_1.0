package com.aksi.domain.order.statemachine.stage2.substep3.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.validator.DefectsStainsValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Guard для перевірки валідності підетапу 2.3: Дефекти та плями
 *
 * Відповідає за:
 * - Перевірку наявності збережених даних про дефекти та плями
 * - Валідацію готовності до переходу на наступний крок
 * - Перевірку обов'язкових полів та бізнес-правил
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DefectsStainsValidGuard implements Guard<OrderState, OrderEvent> {

    private final DefectsStainsValidator validator;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        log.debug("Перевірка валідності дефектів та плям");

        try {
            // Отримуємо збережені валідовані дані
            DefectsStainsDTO defectsStains = getValidatedDefectsStains(context);

            if (defectsStains == null) {
                log.warn("Валідовані дані про дефекти та плями відсутні в контексті");
                return false;
            }

            // Перевіряємо готовність до наступного кроку
            boolean isReady = validator.isReadyForNextStep(defectsStains);
            log.debug("Результат перевірки готовності: {}", isReady);

            // Додаткові перевірки
            boolean hasValidData = defectsStains.getIsValid() == Boolean.TRUE;
            boolean hasMinimalRequirements = checkMinimalRequirements(defectsStains);

            boolean canProceed = isReady && hasValidData && hasMinimalRequirements;

            log.info("DefectsStainsValidGuard: canProceed={}, isReady={}, hasValidData={}, hasMinimalRequirements={}",
                    canProceed, isReady, hasValidData, hasMinimalRequirements);

            return canProceed;

        } catch (Exception e) {
            log.error("Помилка при перевірці валідності дефектів та плям", e);
            return false;
        }
    }

    /**
     * Отримує валідовані дані з контексту
     */
    private DefectsStainsDTO getValidatedDefectsStains(StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("defectsStainsValidated");
        return data instanceof DefectsStainsDTO ? (DefectsStainsDTO) data : null;
    }

    /**
     * Перевіряє мінімальні вимоги для переходу
     */
    private boolean checkMinimalRequirements(DefectsStainsDTO defectsStains) {
        // Має бути хоча б щось вибрано або зазначено "Без гарантій"
        boolean hasSelection = defectsStains.hasStains() ||
                              defectsStains.hasDefects() ||
                              defectsStains.hasRisks();

        // Якщо вибрано "Без гарантій", має бути вказана причина
        if (Boolean.TRUE.equals(defectsStains.getNoWarranty())) {
            return defectsStains.getNoWarrantyReason() != null &&
                   !defectsStains.getNoWarrantyReason().trim().isEmpty();
        }

        return hasSelection;
    }
}
