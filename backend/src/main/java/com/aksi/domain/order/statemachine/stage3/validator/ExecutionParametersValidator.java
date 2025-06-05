package com.aksi.domain.order.statemachine.stage3.validator;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.statemachine.stage3.dto.ExecutionParametersDTO;

import lombok.extern.slf4j.Slf4j;

/**
 * Валідатор для підетапу 3.1 "Параметри виконання".
 *
 * Відповідає за перевірку:
 * - Дати виконання (не в минулому, мінімальні терміни)
 * - Терміновості (можливість застосування до категорій)
 * - Бізнес-правил (терміни для шкіряних виробів)
 */
@Component
@Slf4j
public class ExecutionParametersValidator {

    // Константи валідації
    private static final int MIN_STANDARD_HOURS = 48; // 2 дні мінімум
    private static final int MIN_LEATHER_HOURS = 336; // 14 днів для шкіри
    private static final int EXPEDITE_24H_HOURS = 24;
    private static final int EXPEDITE_48H_HOURS = 48;

    /**
     * Валідація параметрів виконання.
     */
    public List<String> validate(ExecutionParametersDTO dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Дані параметрів виконання відсутні");
            return errors;
        }

        validateCompletionDate(dto, errors);
        validateExpediteType(dto, errors);
        validateBusinessRules(dto, errors);
        validateCalculations(dto, errors);

        return errors;
    }

    /**
     * Перевіряє чи параметри виконання валідні.
     */
    public boolean isValid(ExecutionParametersDTO dto) {
        return validate(dto).isEmpty();
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     */
    public boolean canProceedToNext(ExecutionParametersDTO dto) {
        if (!isValid(dto)) {
            return false;
        }

        // Додаткові перевірки для переходу
        return dto.getCompletionDate() != null
               && dto.getExpediteType() != null
               && !dto.getHasErrors();
    }

    /**
     * Валідація дати виконання.
     */
    private void validateCompletionDate(ExecutionParametersDTO dto, List<String> errors) {
        LocalDate completionDate = dto.getCompletionDate();

        if (completionDate == null) {
            errors.add("Дата виконання обов'язкова");
            return;
        }

        LocalDate today = LocalDate.now();

        // Перевірка що дата не в минулому
        if (completionDate.isBefore(today)) {
            errors.add("Дата виконання не може бути в минулому");
        }

        // Перевірка мінімальних термінів
        validateMinimumDeadlines(dto, completionDate, today, errors);
    }

    /**
     * Валідація мінімальних термінів виконання.
     */
    private void validateMinimumDeadlines(ExecutionParametersDTO dto, LocalDate completionDate, LocalDate today, List<String> errors) {

        // Для шкіряних виробів мінімум 14 днів (336 годин)
        if (dto.getHasLeatherItems() && completionDate.isBefore(today.plusDays(MIN_LEATHER_HOURS / 24))) {
            errors.add("Для шкіряних виробів мінімальний термін виконання 14 днів");
        }

        // Для термінового виконання перевіряємо відповідні терміни
        ExpediteType expediteType = dto.getExpediteType();
        if (expediteType != null) {
            switch (expediteType) {
                case EXPRESS_24H:
                    if (completionDate.isAfter(today.plusDays(EXPEDITE_24H_HOURS / 24))) {
                        errors.add("Для термінового виконання 24 години дата не може бути пізніше завтра");
                    }
                    break;
                case EXPRESS_48H:
                    if (completionDate.isAfter(today.plusDays(EXPEDITE_48H_HOURS / 24))) {
                        errors.add("Для термінового виконання 48 годин дата не може бути пізніше післязавтра");
                    }
                    break;
                case STANDARD:
                    // Для стандартного виконання мінімум 2 дні (48 годин, якщо немає шкіри)
                    if (!dto.getHasLeatherItems() && completionDate.isBefore(today.plusDays(MIN_STANDARD_HOURS / 24))) {
                        errors.add("Мінімальний термін стандартного виконання 2 дні");
                    }
                    break;
            }
        }
    }

    /**
     * Валідація типу терміновості.
     */
    private void validateExpediteType(ExecutionParametersDTO dto, List<String> errors) {
        ExpediteType expediteType = dto.getExpediteType();

        if (expediteType == null) {
            errors.add("Тип виконання обов'язковий");
            return;
        }

        // Перевірка можливості застосування терміновості
        if (expediteType != ExpediteType.STANDARD) {
            validateExpediteApplicability(dto, expediteType, errors);
        }
    }

    /**
     * Валідація можливості застосування терміновості.
     */
    private void validateExpediteApplicability(ExecutionParametersDTO dto, ExpediteType expediteType, List<String> errors) {

        // Якщо є предмети що не можуть мати терміновість
        if (dto.getHasNonExpeditableItems()) {
            errors.add("Замовлення містить предмети, до яких не можна застосувати термінове виконання (прання, прасування, фарбування)");
        }

        // Для шкіряних виробів терміновість обмежена
        if (dto.getHasLeatherItems()) {
            if (expediteType == ExpediteType.EXPRESS_24H) {
                errors.add("Для шкіряних виробів неможливе виконання за 24 години");
            }
            if (expediteType == ExpediteType.EXPRESS_48H) {
                errors.add("Для шкіряних виробів неможливе виконання за 48 годин");
            }
        }

        // Перевірка категорій предметів
        if (dto.getOrderItemCategories() != null) {
            for (String categoryCode : dto.getOrderItemCategories()) {
                if (!expediteType.canBeAppliedToCategory(categoryCode)) {
                    errors.add("Терміновість не може бути застосована до категорії: " + categoryCode);
                }
            }
        }
    }

    /**
     * Валідація бізнес-правил.
     */
    private void validateBusinessRules(ExecutionParametersDTO dto, List<String> errors) {

        // Якщо обрана терміновість, але базова сума занадто мала
        if (dto.isExpedited() && dto.getBaseOrderTotal() != null) {
            // Можна додати мінімальну суму для термінового виконання
            // if (dto.getBaseOrderTotal().compareTo(new BigDecimal("100")) < 0) {
            //     errors.add("Мінімальна сума замовлення для термінового виконання 100 грн");
            // }
        }

        // Перевірка робочих годин
        if (dto.getWorkingHoursRequired() != null) {
            if (dto.getWorkingHoursRequired() < 1) {
                errors.add("Кількість робочих годин повинна бути більше 0");
            }

            // Для шкіряних виробів мінімум 336 годин (14 днів)
            if (dto.getHasLeatherItems() && dto.getWorkingHoursRequired() < MIN_LEATHER_HOURS) {
                errors.add("Для шкіряних виробів мінімум " + MIN_LEATHER_HOURS + " робочих годин (14 днів)");
            }

            // Для стандартного виконання мінімум 48 годин (2 дні)
            if (dto.getExpediteType() == ExpediteType.STANDARD &&
                !dto.getHasLeatherItems() &&
                dto.getWorkingHoursRequired() < MIN_STANDARD_HOURS) {
                errors.add("Для стандартного виконання мінімум " + MIN_STANDARD_HOURS + " робочих годин (2 дні)");
            }

            // Для експрес виконання максимальні терміни
            if (dto.getExpediteType() == ExpediteType.EXPRESS_24H && dto.getWorkingHoursRequired() > EXPEDITE_24H_HOURS) {
                errors.add("Для виконання за 24 години максимум " + EXPEDITE_24H_HOURS + " робочих годин");
            }

            if (dto.getExpediteType() == ExpediteType.EXPRESS_48H && dto.getWorkingHoursRequired() > EXPEDITE_48H_HOURS) {
                errors.add("Для виконання за 48 годин максимум " + EXPEDITE_48H_HOURS + " робочих годин");
            }
        }
    }

    /**
     * Валідація розрахунків.
     */
    private void validateCalculations(ExecutionParametersDTO dto, List<String> errors) {

        // Перевірка що розрахунки коректні
        if (dto.getBaseOrderTotal() != null && dto.getExpediteChargeAmount() != null && dto.getFinalOrderTotal() != null) {
            var expectedTotal = dto.getBaseOrderTotal().add(dto.getExpediteChargeAmount());

            if (dto.getFinalOrderTotal().compareTo(expectedTotal) != 0) {
                errors.add("Помилка в розрахунках загальної суми");
            }
        }

        // Перевірка що надбавка за терміновість розрахована правильно
        if (dto.isExpedited() && dto.getBaseOrderTotal() != null && dto.getExpediteChargeAmount() != null) {
            var expectedCharge = dto.getBaseOrderTotal().multiply(dto.getExpeditePercentage());

            if (dto.getExpediteChargeAmount().compareTo(expectedCharge) != 0) {
                log.warn("Розбіжність в розрахунку надбавки за терміновість. Очікувано: {}, Фактично: {}",
                        expectedCharge, dto.getExpediteChargeAmount());
            }
        }
    }
}
