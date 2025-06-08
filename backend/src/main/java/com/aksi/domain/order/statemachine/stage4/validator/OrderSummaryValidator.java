package com.aksi.domain.order.statemachine.stage4.validator;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO;

/**
 * Валідатор для підетапу 4.1 "Перегляд замовлення з детальним розрахунком".
 *
 * Перевіряє коректність та повноту даних підсумку замовлення.
 */
@Component
public class OrderSummaryValidator {

    /**
     * Валідує OrderSummaryDTO для збереження.
     */
    public List<String> validate(OrderSummaryDTO orderSummary) {
        List<String> errors = new ArrayList<>();

        if (orderSummary == null) {
            errors.add("Підсумок замовлення не може бути null");
            return errors;
        }

        // Перевіряємо базову інформацію
        validateBasicInfo(orderSummary, errors);

        // Перевіряємо клієнта
        validateClient(orderSummary, errors);

        // Перевіряємо предмети
        validateItems(orderSummary, errors);

        // Перевіряємо розрахунки
        validateCalculations(orderSummary, errors);

        // Перевіряємо дати
        validateDates(orderSummary, errors);

        return errors;
    }

    /**
     * Перевіряє чи можна перейти до наступного кроку.
     */
    public boolean canProceedToNext(OrderSummaryDTO orderSummary) {
        if (orderSummary == null) {
            return false;
        }

        // Має бути переглянуто
        if (!Boolean.TRUE.equals(orderSummary.getIsReviewed())) {
            return false;
        }

        // Не має бути помилок
        if (Boolean.TRUE.equals(orderSummary.getHasErrors())) {
            return false;
        }

        // Має бути валідним
        if (!orderSummary.isValid()) {
            return false;
        }

        // Основна валідація має пройти без помилок
        List<String> validationErrors = validate(orderSummary);
        return validationErrors.isEmpty();
    }

    private void validateBasicInfo(OrderSummaryDTO orderSummary, List<String> errors) {
        if (orderSummary.getReceiptNumber() == null || orderSummary.getReceiptNumber().trim().isEmpty()) {
            errors.add("Номер квитанції є обов'язковим");
        }

        if (orderSummary.getBranchLocation() == null) {
            errors.add("Пункт прийому замовлення є обов'язковим");
        }
    }

    private void validateClient(OrderSummaryDTO orderSummary, List<String> errors) {
        if (orderSummary.getClient() == null) {
            errors.add("Інформація про клієнта є обов'язковою");
            return;
        }

        // TODO: Додати валідацію формату телефону (регулярні вирази)
        // TODO: Додати валідацію формату email якщо присутній
        // TODO: Перевірити чи клієнт існує в базі даних
        // TODO: Валідувати довжину імені та прізвища (мін/макс символи)

        if (orderSummary.getClient().getFirstName() == null ||
            orderSummary.getClient().getFirstName().trim().isEmpty()) {
            errors.add("Ім'я клієнта є обов'язковим");
        }

        if (orderSummary.getClient().getLastName() == null ||
            orderSummary.getClient().getLastName().trim().isEmpty()) {
            errors.add("Прізвище клієнта є обов'язковим");
        }

        if (orderSummary.getClient().getPhone() == null ||
            orderSummary.getClient().getPhone().trim().isEmpty()) {
            errors.add("Телефон клієнта є обов'язковим");
        }
    }

    private void validateItems(OrderSummaryDTO orderSummary, List<String> errors) {
        if (orderSummary.getItems() == null || orderSummary.getItems().isEmpty()) {
            errors.add("Замовлення має містити принаймні один предмет");
            return;
        }

        // Перевіряємо кожен предмет
        for (int i = 0; i < orderSummary.getItems().size(); i++) {
            var item = orderSummary.getItems().get(i);

            if (item.getName() == null || item.getName().trim().isEmpty()) {
                errors.add("Назва предмету #" + (i + 1) + " є обов'язковою");
            }

            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                errors.add("Кількість предмету #" + (i + 1) + " має бути більше 0");
            }

            if (item.getUnitPrice() == null || item.getUnitPrice().signum() <= 0) {
                errors.add("Ціна за одиницю предмету #" + (i + 1) + " має бути більше 0");
            }

            if (item.getTotalPrice() == null || item.getTotalPrice().signum() <= 0) {
                errors.add("Загальна ціна предмету #" + (i + 1) + " має бути більше 0");
            }
        }
    }

    private void validateCalculations(OrderSummaryDTO orderSummary, List<String> errors) {
        // TODO: Додати детальну валідацію розрахунків з PricingService
        // TODO: Перевірити відповідність сум з актуальним прайс-листом
        // TODO: Валідувати правильність застосування знижок і модифікаторів
        // TODO: Перевірити математичну коректність: subtotal - discount + expedite = final

        if (orderSummary.getSubtotalAmount() == null ||
            orderSummary.getSubtotalAmount().signum() <= 0) {
            errors.add("Загальна сума предметів має бути більше 0");
        }

        if (orderSummary.getFinalAmount() == null ||
            orderSummary.getFinalAmount().signum() <= 0) {
            errors.add("Фінальна сума замовлення має бути більше 0");
        }

        // Перевіряємо логіку знижок
        if (orderSummary.hasDiscount()) {
            if (orderSummary.getDiscountAmount().signum() <= 0) {
                errors.add("Сума знижки має бути більше 0 якщо знижка застосовується");
            }
        }

        // Перевіряємо логіку надбавок за терміновість
        if (orderSummary.hasExpediteCharge()) {
            if (orderSummary.getExpediteAmount() == null ||
                orderSummary.getExpediteAmount().signum() <= 0) {
                errors.add("Сума надбавки за терміновість має бути більше 0");
            }
        }

        // Перевіряємо баланс оплати
        if (orderSummary.getPrepaymentAmount() != null && orderSummary.getFinalAmount() != null) {
            if (orderSummary.getPrepaymentAmount().compareTo(orderSummary.getFinalAmount()) > 0) {
                errors.add("Сума передоплати не може перевищувати загальну суму замовлення");
            }
        }
    }

    private void validateDates(OrderSummaryDTO orderSummary, List<String> errors) {
        if (orderSummary.getCreatedDate() == null) {
            errors.add("Дата створення замовлення є обов'язковою");
        }

        if (orderSummary.getExpectedCompletionDate() == null) {
            errors.add("Очікувана дата виконання є обов'язковою");
        }

        if (orderSummary.getCreatedDate() != null &&
            orderSummary.getExpectedCompletionDate() != null) {
            if (orderSummary.getExpectedCompletionDate().isBefore(orderSummary.getCreatedDate())) {
                errors.add("Дата виконання не може бути раніше дати створення замовлення");
            }
        }
    }
}
