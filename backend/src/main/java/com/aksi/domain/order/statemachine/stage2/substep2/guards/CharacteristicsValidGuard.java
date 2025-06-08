package com.aksi.domain.order.statemachine.stage2.substep2.guards;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.validator.CharacteristicsValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Guard для перевірки валідності підетапу 2.2: Характеристики предмета
 *
 * Відповідає за:
 * - Перевірку наявності збережених даних характеристик
 * - Валідацію готовності до переходу на наступний крок
 * - Перевірку обов'язкових полів та бізнес-правил
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CharacteristicsValidGuard implements Guard<OrderState, OrderEvent> {

    private final CharacteristicsValidator validator;

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        log.debug("Перевірка валідності характеристик предмета");

        try {
            // Отримуємо збережені валідовані дані
            CharacteristicsDTO characteristics = getValidatedCharacteristics(context);

            if (characteristics == null) {
                log.warn("Валідовані дані характеристик відсутні в контексті");
                return false;
            }

            // Перевіряємо готовність до наступного кроку
            boolean isReady = validator.isReadyForNextStep(characteristics);
            log.debug("Результат перевірки готовності характеристик: {}", isReady);

            // Додаткові перевірки
            boolean hasValidData = characteristics.getIsValid() == Boolean.TRUE;
            boolean hasMinimalRequirements = checkMinimalRequirements(characteristics);

            boolean canProceed = isReady && hasValidData && hasMinimalRequirements;

            log.info("CharacteristicsValidGuard: canProceed={}, isReady={}, hasValidData={}, hasMinimalRequirements={}",
                    canProceed, isReady, hasValidData, hasMinimalRequirements);

            return canProceed;

        } catch (Exception e) {
            log.error("Помилка при перевірці валідності характеристик", e);
            return false;
        }
    }

    /**
     * Отримує валідовані дані з контексту
     */
    private CharacteristicsDTO getValidatedCharacteristics(StateContext<OrderState, OrderEvent> context) {
        Object data = context.getExtendedState().getVariables().get("characteristicsValidated");
        return data instanceof CharacteristicsDTO ? (CharacteristicsDTO) data : null;
    }

    /**
     * Перевіряє мінімальні вимоги для переходу
     */
    private boolean checkMinimalRequirements(CharacteristicsDTO characteristics) {
        // Перевіряємо обов'язкові поля
        boolean hasRequiredFields = characteristics.isComplete();

        // Перевіряємо сумісність матеріала з категорією (якщо доступна)
        boolean materialCompatible = true; // За замовчуванням вважаємо сумісним

        // Перевіряємо чи є критичний знос та чи користувач усвідомлює ризики
        boolean criticalWearHandled = !characteristics.hasCriticalWear() ||
                                    (characteristics.getNotes() != null && !characteristics.getNotes().trim().isEmpty());

        log.debug("Мінімальні вимоги характеристик: hasRequiredFields={}, materialCompatible={}, criticalWearHandled={}",
                hasRequiredFields, materialCompatible, criticalWearHandled);

        return hasRequiredFields && materialCompatible && criticalWearHandled;
    }
}
