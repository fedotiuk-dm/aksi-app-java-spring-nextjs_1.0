package com.aksi.domain.order.statemachine.stage2.substep2.actions;

import java.util.Map;

import org.springframework.statemachine.StateContext;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.CharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.FillingType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.MaterialType;
import com.aksi.domain.order.statemachine.stage2.substep2.enums.WearLevel;
import com.aksi.domain.order.statemachine.stage2.substep2.service.CharacteristicsStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * State Machine Action для збереження даних підетапу 2.2: Характеристики предмета
 *
 * Відповідає за:
 * - Витягування даних з контексту State Machine
 * - Валідацію через CharacteristicsStepService
 * - Збереження валідованих даних назад у контекст
 * - Встановлення прапору готовності до наступного кроку
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SaveCharacteristicsAction implements Action<OrderState, OrderEvent> {

    private final CharacteristicsStepService characteristicsStepService;

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        log.debug("Виконання SaveCharacteristicsAction");

        try {
            // Отримуємо ID визарда
            String wizardId = getWizardId(context);
            if (wizardId == null) {
                log.error("WizardId не знайдено в контексті State Machine");
                setActionError(context, "Відсутній ID візарда");
                return;
            }

            // Отримуємо дані з контексту
            Map<String, Object> wizardData = getWizardData(context, "characteristicsData");
            if (wizardData == null || wizardData.isEmpty()) {
                log.warn("Дані характеристик предмета відсутні в контексті для wizardId: {}", wizardId);
                setActionError(context, "Відсутні дані характеристик предмета");
                return;
            }

            // Створюємо CharacteristicsDTO з wizardData
            CharacteristicsDTO characteristicsDTO = createCharacteristicsFromWizardData(wizardData);
            log.debug("Створено CharacteristicsDTO з wizardData: {}", characteristicsDTO);

            // Валідуємо дані через сервіс
            CharacteristicsDTO validatedDTO = characteristicsStepService.validateCharacteristics(characteristicsDTO);
            log.debug("Валідація завершена: valid={}, errors={}",
                    validatedDTO.getIsValid(), validatedDTO.getValidationErrors());

            // Зберігаємо валідовані дані
            CharacteristicsDTO savedDTO = characteristicsStepService.saveCharacteristics(wizardId, validatedDTO);

            // Оновлюємо контекст
            updateContext(context, savedDTO);

            log.info("SaveCharacteristicsAction успішно виконано для wizardId: {}, isValid: {}",
                    wizardId, savedDTO.getIsValid());

        } catch (Exception e) {
            log.error("Помилка при виконанні SaveCharacteristicsAction", e);
            setActionError(context, "Внутрішня помилка при збереженні даних: " + e.getMessage());
        }
    }

    /**
     * Створює CharacteristicsDTO з мапа даних візарда
     */
    private CharacteristicsDTO createCharacteristicsFromWizardData(Map<String, Object> wizardData) {
        return CharacteristicsDTO.builder()
                .material(getMaterialType(wizardData.get("material")))
                .color((String) wizardData.get("color"))
                .isStandardColor((Boolean) wizardData.get("isStandardColor"))
                .filling(getFillingType(wizardData.get("filling")))
                .customFilling((String) wizardData.get("customFilling"))
                .isDamagedFilling((Boolean) wizardData.get("isDamagedFilling"))
                .wearLevel(getWearLevel(wizardData.get("wearLevel")))
                .notes((String) wizardData.get("notes"))
                .build();
    }

    /**
     * Перетворює об'єкт в MaterialType
     */
    private MaterialType getMaterialType(Object value) {
        if (value instanceof MaterialType) {
            return (MaterialType) value;
        }
        if (value instanceof String) {
            try {
                return MaterialType.valueOf((String) value);
            } catch (IllegalArgumentException e) {
                return MaterialType.fromCode((String) value);
            }
        }
        return null;
    }

    /**
     * Перетворює об'єкт в FillingType
     */
    private FillingType getFillingType(Object value) {
        if (value instanceof FillingType) {
            return (FillingType) value;
        }
        if (value instanceof String) {
            try {
                return FillingType.valueOf((String) value);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Перетворює об'єкт в WearLevel
     */
    private WearLevel getWearLevel(Object value) {
        if (value instanceof WearLevel) {
            return (WearLevel) value;
        }
        if (value instanceof String) {
            try {
                return WearLevel.valueOf((String) value);
            } catch (IllegalArgumentException e) {
                return WearLevel.fromDisplayValue((String) value);
            }
        }
        if (value instanceof Integer) {
            return WearLevel.fromPercentage((Integer) value);
        }
        return null;
    }

    /**
     * Отримує ID візарда з контексту
     */
    private String getWizardId(StateContext<OrderState, OrderEvent> context) {
        Object wizardId = context.getExtendedState().getVariables().get("wizardId");
        return wizardId instanceof String ? (String) wizardId : null;
    }

    /**
     * Отримує дані визарда з контексту
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> getWizardData(StateContext<OrderState, OrderEvent> context, String key) {
        Object data = context.getExtendedState().getVariables().get(key);
        return data instanceof Map ? (Map<String, Object>) data : null;
    }

    /**
     * Оновлює контекст збереженими даними
     */
    private void updateContext(StateContext<OrderState, OrderEvent> context, CharacteristicsDTO savedDTO) {
        // Зберігаємо валідовані дані
        context.getExtendedState().getVariables().put("characteristicsValidated", savedDTO);

        // Встановлюємо прапор готовності
        context.getExtendedState().getVariables().put("characteristicsReady", savedDTO.getIsValid());

        // Зберігаємо помилки валідації, якщо є
        if (!savedDTO.getIsValid()) {
            context.getExtendedState().getVariables().put("characteristicsErrors", savedDTO.getValidationErrors());
        } else {
            context.getExtendedState().getVariables().remove("characteristicsErrors");
        }

        // Зберігаємо важливі характеристики
        if (savedDTO.getMaterial() != null) {
            context.getExtendedState().getVariables().put("selectedMaterial", savedDTO.getMaterial());
        }

        if (savedDTO.getColor() != null) {
            context.getExtendedState().getVariables().put("selectedColor", savedDTO.getColor());
        }

        // Зберігаємо рекомендації та попередження
        if (savedDTO.requiresSpecialCare()) {
            context.getExtendedState().getVariables().put("requiresSpecialCare", true);
        }

        if (savedDTO.hasCriticalWear()) {
            context.getExtendedState().getVariables().put("hasCriticalWear", true);
        }

        // Оновлюємо загальний статус підвізарда
        updateItemWizardProgress(context, savedDTO.getIsValid());
    }

    /**
     * Оновлює прогрес підвізарда
     */
    @SuppressWarnings("unchecked")
    private void updateItemWizardProgress(StateContext<OrderState, OrderEvent> context, boolean stepCompleted) {
        // Отримуємо поточний прогрес
        Object progressObj = context.getExtendedState().getVariables().get("itemWizardProgress");
        Map<String, Boolean> progress = progressObj instanceof Map ?
            (Map<String, Boolean>) progressObj : new java.util.HashMap<>();

        // Оновлюємо статус кроку 2.2
        progress.put("characteristicsCompleted", stepCompleted);
        context.getExtendedState().getVariables().put("itemWizardProgress", progress);

        log.debug("Оновлено прогрес item wizard: characteristicsCompleted={}", stepCompleted);
    }

    /**
     * Встановлює помилку дії
     */
    private void setActionError(StateContext<OrderState, OrderEvent> context, String errorMessage) {
        context.getExtendedState().getVariables().put("actionError", errorMessage);
        context.getExtendedState().getVariables().put("characteristicsReady", false);
        log.error("SaveCharacteristicsAction error: {}", errorMessage);
    }
}
