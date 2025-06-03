package com.aksi.ui.wizard.step3.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Domain Model для стану параметрів замовлення.
 * Відповідає за бізнес-логіку обчислення термінів, знижок та фінансів.
 */
@Data
@Builder(toBuilder = true)
@Slf4j
public class OrderParametersState {

    // Константи бізнес-логіки
    public static final int STANDARD_PROCESSING_DAYS = 2;
    public static final int LEATHER_PROCESSING_DAYS = 14;
    public static final Set<String> LEATHER_CATEGORIES = Set.of(
        "LEATHER_CLEANING", "LEATHER_REPAIR", "SHEEPSKIN_COAT"
    );
    public static final Set<String> NON_DISCOUNTABLE_CATEGORIES = Set.of(
        "IRONING", "LAUNDRY", "TEXTILE_DYEING"
    );

    // Параметри виконання
    private final LocalDate expectedCompletionDate;
    private final UrgencyOption urgencyOption;
    private final LocalDate calculatedStandardDate;
    private final int standardProcessingDays;
    private final boolean hasLeatherItems;

    // Знижки
    private final DiscountType discountType;
    private final BigDecimal customDiscountPercent;
    private final boolean hasNonDiscountableItems;
    private final List<String> discountWarnings;

    // Фінансові дані
    private final PaymentMethod paymentMethod;
    private final BigDecimal totalAmount;
    private final BigDecimal paidAmount;
    private final BigDecimal debtAmount;

    // Додаткова інформація
    private final String orderNotes;
    private final String clientRequirements;

    // Стан валідності
    private final boolean isValid;
    private final List<String> validationMessages;

    // UI стан
    private final boolean canProceedToNext;
    private final String processingInfoText;
    private final boolean showCustomDiscountField;
    private final boolean showDiscountWarning;

    /**
     * Створює початковий стан параметрів замовлення.
     */
    public static OrderParametersState createInitial(List<ItemInfo> items, BigDecimal totalAmount) {
        log.debug("Створення початкового стану для {} предметів", items.size());

        boolean hasLeatherItems = detectLeatherItems(items);
        boolean hasNonDiscountableItems = detectNonDiscountableItems(items);
        int processingDays = hasLeatherItems ? LEATHER_PROCESSING_DAYS : STANDARD_PROCESSING_DAYS;
        LocalDate calculatedDate = calculateBusinessDate(LocalDate.now(), processingDays);

        return builder()
            .expectedCompletionDate(calculatedDate)
            .urgencyOption(UrgencyOption.STANDARD)
            .calculatedStandardDate(calculatedDate)
            .standardProcessingDays(processingDays)
            .hasLeatherItems(hasLeatherItems)
            .discountType(DiscountType.NONE)
            .customDiscountPercent(BigDecimal.ZERO)
            .hasNonDiscountableItems(hasNonDiscountableItems)
            .discountWarnings(generateDiscountWarnings(hasNonDiscountableItems, DiscountType.NONE))
            .paymentMethod(PaymentMethod.TERMINAL)
            .totalAmount(totalAmount)
            .paidAmount(BigDecimal.ZERO)
            .debtAmount(totalAmount)
            .orderNotes("")
            .clientRequirements("")
            .isValid(true)
            .validationMessages(List.of())
            .canProceedToNext(true)
            .processingInfoText(generateProcessingInfoText(items.size(), processingDays, hasLeatherItems))
            .showCustomDiscountField(false)
            .showDiscountWarning(false)
            .build();
    }

    /**
     * Оновлює дату виконання та перераховує терміновість.
     */
    public OrderParametersState withExpectedDate(LocalDate newDate) {
        UrgencyOption newUrgency = calculateUrgencyForDate(newDate, calculatedStandardDate);

        return toBuilder()
            .expectedCompletionDate(newDate)
            .urgencyOption(newUrgency)
            .isValid(validateExpectedDate(newDate))
            .validationMessages(generateValidationMessages(newDate, discountType, paidAmount, totalAmount))
            .canProceedToNext(validateExpectedDate(newDate) && validateFinancials(paidAmount, totalAmount))
            .build()
            .withRecalculatedTotal();
    }

    /**
     * Оновлює терміновість та перераховує дату.
     */
    public OrderParametersState withUrgencyOption(UrgencyOption newUrgency) {
        LocalDate newDate = calculateDateForUrgency(newUrgency, calculatedStandardDate);

        return toBuilder()
            .expectedCompletionDate(newDate)
            .urgencyOption(newUrgency)
            .isValid(validateExpectedDate(newDate))
            .validationMessages(generateValidationMessages(newDate, discountType, paidAmount, totalAmount))
            .build()
            .withRecalculatedTotal();
    }

    /**
     * Оновлює тип знижки та відповідні параметри.
     */
    public OrderParametersState withDiscountType(DiscountType newDiscountType) {
        BigDecimal newCustomPercent = newDiscountType == DiscountType.CUSTOM
            ? customDiscountPercent
            : BigDecimal.valueOf(newDiscountType.getDefaultPercent());

        List<String> warnings = generateDiscountWarnings(hasNonDiscountableItems, newDiscountType);

        return toBuilder()
            .discountType(newDiscountType)
            .customDiscountPercent(newCustomPercent)
            .discountWarnings(warnings)
            .showCustomDiscountField(newDiscountType == DiscountType.CUSTOM)
            .showDiscountWarning(!warnings.isEmpty())
            .isValid(validateDiscount(newDiscountType, newCustomPercent))
            .validationMessages(generateValidationMessages(expectedCompletionDate, newDiscountType, paidAmount, totalAmount))
            .build()
            .withRecalculatedTotal();
    }

    /**
     * Оновлює кастомну знижку.
     */
    public OrderParametersState withCustomDiscountPercent(BigDecimal newPercent) {
        return toBuilder()
            .customDiscountPercent(newPercent)
            .isValid(validateDiscount(discountType, newPercent))
            .validationMessages(generateValidationMessages(expectedCompletionDate, discountType, paidAmount, totalAmount))
            .build()
            .withRecalculatedTotal();
    }

    /**
     * Оновлює спосіб оплати.
     */
    public OrderParametersState withPaymentMethod(PaymentMethod newPaymentMethod) {
        return toBuilder()
            .paymentMethod(newPaymentMethod)
            .build();
    }

    /**
     * Оновлює суму сплачено та перераховує борг.
     */
    public OrderParametersState withPaidAmount(BigDecimal newPaidAmount) {
        BigDecimal newDebtAmount = calculateDebtAmount(totalAmount, newPaidAmount);

        return toBuilder()
            .paidAmount(newPaidAmount)
            .debtAmount(newDebtAmount)
            .isValid(validateFinancials(newPaidAmount, totalAmount))
            .validationMessages(generateValidationMessages(expectedCompletionDate, discountType, newPaidAmount, totalAmount))
            .canProceedToNext(validateFinancials(newPaidAmount, totalAmount) && validateExpectedDate(expectedCompletionDate))
            .build();
    }

    /**
     * Оновлює примітки та вимоги.
     */
    public OrderParametersState withNotes(String orderNotes, String clientRequirements) {
        return toBuilder()
            .orderNotes(orderNotes != null ? orderNotes : "")
            .clientRequirements(clientRequirements != null ? clientRequirements : "")
            .build();
    }

    /**
     * Перераховує загальну вартість на основі поточних параметрів.
     */
    public OrderParametersState withRecalculatedTotal() {
        // Базова сума предметів (без модифікаторів)
        BigDecimal baseAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;

        // Застосовуємо знижку
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (hasDiscount()) {
            BigDecimal discountPercent = getEffectiveDiscountPercent();
            discountAmount = baseAmount.multiply(discountPercent).divide(BigDecimal.valueOf(100));
        }

        // Застосовуємо надбавку за терміновість
        BigDecimal urgencyAmount = BigDecimal.ZERO;
        if (isUrgentOrder()) {
            BigDecimal urgencyPercent = BigDecimal.valueOf(urgencyOption.getSurchargePercent());
            urgencyAmount = baseAmount.multiply(urgencyPercent).divide(BigDecimal.valueOf(100));
        }

        // Розраховуємо фінальну суму
        BigDecimal calculatedTotal = baseAmount.subtract(discountAmount).add(urgencyAmount);

        // Перераховуємо борг
        BigDecimal newDebtAmount = calculateDebtAmount(calculatedTotal, paidAmount);

        return toBuilder()
            .totalAmount(calculatedTotal)
            .debtAmount(newDebtAmount)
            .build();
    }

    /**
     * Встановлює базову суму предметів та перераховує загальну вартість.
     */
    public OrderParametersState withBaseAmount(BigDecimal baseAmount) {
        return toBuilder()
            .totalAmount(baseAmount)
            .build()
            .withRecalculatedTotal();
    }

    // Бізнес-логіка

    private static boolean detectLeatherItems(List<ItemInfo> items) {
        return items.stream()
            .anyMatch(item -> LEATHER_CATEGORIES.contains(item.category()));
    }

    private static boolean detectNonDiscountableItems(List<ItemInfo> items) {
        return items.stream()
            .anyMatch(item -> NON_DISCOUNTABLE_CATEGORIES.contains(item.category()));
    }

    private static LocalDate calculateBusinessDate(LocalDate startDate, int businessDays) {
        LocalDate date = startDate;
        int addedDays = 0;

        while (addedDays < businessDays) {
            date = date.plusDays(1);
            if (date.getDayOfWeek().getValue() < 6) { // Понеділок-П'ятниця
                addedDays++;
            }
        }
        return date;
    }

    private static UrgencyOption calculateUrgencyForDate(LocalDate selectedDate, LocalDate standardDate) {
        if (selectedDate == null || standardDate == null) {
            return UrgencyOption.STANDARD;
        }

        long daysDifference = LocalDate.now().until(selectedDate).getDays();

        if (daysDifference <= 1) {
            return UrgencyOption.URGENT_24H;
        } else if (daysDifference <= 2) {
            return UrgencyOption.URGENT_48H;
        } else if (selectedDate.isBefore(standardDate)) {
            return UrgencyOption.URGENT_48H;
        }

        return UrgencyOption.STANDARD;
    }

    private static LocalDate calculateDateForUrgency(UrgencyOption urgency, LocalDate standardDate) {
        return switch (urgency) {
            case URGENT_24H -> LocalDate.now().plusDays(1);
            case URGENT_48H -> LocalDate.now().plusDays(2);
            case STANDARD -> standardDate;
        };
    }

    private static BigDecimal calculateDebtAmount(BigDecimal total, BigDecimal paid) {
        if (total == null || paid == null) {
            return BigDecimal.ZERO;
        }
        return total.subtract(paid).max(BigDecimal.ZERO);
    }

    private static String generateProcessingInfoText(int itemsCount, int processingDays, boolean hasLeatherItems) {
        String daysText = processingDays == 1 ? "день" : (processingDays < 5 ? "дні" : "днів");
        String leatherWarning = hasLeatherItems ? " | ⚠️ Є шкіряні вироби" : "";

        return String.format("📦 Предметів: %d | ⏱️ Термін: %d %s%s",
            itemsCount, processingDays, daysText, leatherWarning);
    }

    private static List<String> generateDiscountWarnings(boolean hasNonDiscountableItems, DiscountType discountType) {
        if (hasNonDiscountableItems && discountType != DiscountType.NONE) {
            return List.of("Знижки не діють на прасування, прання і фарбування текстилю");
        }
        return List.of();
    }

    private static boolean validateExpectedDate(LocalDate date) {
        return date != null && date.isAfter(LocalDate.now());
    }

    private static boolean validateDiscount(DiscountType discountType, BigDecimal customPercent) {
        if (discountType == DiscountType.CUSTOM) {
            return customPercent != null &&
                   customPercent.compareTo(BigDecimal.ZERO) >= 0 &&
                   customPercent.compareTo(BigDecimal.valueOf(50)) <= 0;
        }
        return true;
    }

    private static boolean validateFinancials(BigDecimal paid, BigDecimal total) {
        return paid != null && total != null &&
               paid.compareTo(BigDecimal.ZERO) >= 0 &&
               paid.compareTo(total) <= 0;
    }

    private static List<String> generateValidationMessages(LocalDate date, DiscountType discountType,
                                                          BigDecimal paid, BigDecimal total) {
        List<String> messages = new java.util.ArrayList<>();

        if (!validateExpectedDate(date)) {
            messages.add("Дата виконання повинна бути в майбутньому");
        }

        if (discountType == DiscountType.CUSTOM && (paid == null || paid.compareTo(BigDecimal.ZERO) < 0)) {
            messages.add("Відсоток знижки повинен бути від 0 до 50");
        }

        if (!validateFinancials(paid, total)) {
            messages.add("Сума оплати не може перевищувати загальну вартість");
        }

        return messages;
    }

    // Допоміжні класи та енуми

    public record ItemInfo(String category, String name) {}

    public enum UrgencyOption {
        STANDARD("Звичайне", 0),
        URGENT_48H("Терміново 48 год", 50),
        URGENT_24H("Терміново 24 год", 100);

        private final String label;
        private final int surchargePercent;

        UrgencyOption(String label, int surchargePercent) {
            this.label = label;
            this.surchargePercent = surchargePercent;
        }

        public String getLabel() { return label; }
        public int getSurchargePercent() { return surchargePercent; }

        @Override
        public String toString() {
            return label + (surchargePercent > 0 ? String.format(" (+%d%%)", surchargePercent) : "");
        }
    }

    public enum DiscountType {
        NONE("Без знижки", 0),
        EVERCARD("Еверкард", 10),
        SOCIAL_MEDIA("Соцмережі", 5),
        MILITARY("ЗСУ", 10),
        CUSTOM("Інше", 0);

        private final String label;
        private final int defaultPercent;

        DiscountType(String label, int defaultPercent) {
            this.label = label;
            this.defaultPercent = defaultPercent;
        }

        public String getLabel() { return label; }
        public int getDefaultPercent() { return defaultPercent; }

        @Override
        public String toString() {
            return defaultPercent > 0 ? String.format("%s (%d%%)", label, defaultPercent) : label;
        }
    }

    public enum PaymentMethod {
        TERMINAL("Термінал"),
        CASH("Готівка"),
        BANK_TRANSFER("На рахунок");

        private final String label;

        PaymentMethod(String label) { this.label = label; }
        public String getLabel() { return label; }

        @Override
        public String toString() { return label; }
    }

    // Геттери для зручного доступу

    public BigDecimal getEffectiveDiscountPercent() {
        return discountType == DiscountType.CUSTOM ? customDiscountPercent : BigDecimal.valueOf(discountType.getDefaultPercent());
    }

    public LocalDateTime getExpectedCompletionDateTime() {
        return expectedCompletionDate != null ? expectedCompletionDate.atTime(14, 0) : null;
    }

    public boolean isUrgentOrder() {
        return urgencyOption != UrgencyOption.STANDARD;
    }

    public boolean hasDiscount() {
        return discountType != DiscountType.NONE && getEffectiveDiscountPercent().compareTo(BigDecimal.ZERO) > 0;
    }

    public boolean isFullyPaid() {
        return debtAmount.compareTo(BigDecimal.ZERO) == 0;
    }
}
