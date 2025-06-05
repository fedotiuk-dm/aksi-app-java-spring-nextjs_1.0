package com.aksi.domain.order.statemachine.stage2.mapper;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.aksi.domain.order.statemachine.stage2.dto.ItemStainDefectDTO;
import com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO;

/**
 * Mapper для підетапу 2.3 "Забруднення, дефекти та ризики".
 *
 * Відповідає за перетворення між різними DTO:
 * - TempOrderItemDTO ↔ ItemStainDefectDTO
 * - Конвертацію між строковими та Set представленнями даних
 */
@Component
public class ItemStainDefectMapper {

    private static final String DELIMITER = ",";

    /**
     * Створює ItemStainDefectDTO на основі TempOrderItemDTO.
     *
     * @param tempItem тимчасові дані предмета
     * @return DTO з плямами та дефектами або null
     */
    public ItemStainDefectDTO fromTempOrderItem(TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            return null;
        }

        return ItemStainDefectDTO.builder()
                .selectedStains(parseToSet(tempItem.getStains()))
                .customStainDescription(tempItem.getOtherStains())
                .selectedDefectsAndRisks(parseToSet(tempItem.getDefectsAndRisks()))
                .defectNotes(tempItem.getDefectsNotes())
                .noGuaranteeReason(tempItem.getNoGuaranteeReason())
                .showCustomStainField(hasCustomStain(tempItem.getStains()))
                .showNoGuaranteeReasonField(hasNoGuarantee(tempItem.getDefectsAndRisks()))
                .build();
    }

    /**
     * Оновлює TempOrderItemDTO даними з ItemStainDefectDTO.
     *
     * @param tempItem тимчасові дані предмета для оновлення
     * @param stainDefect дані плям та дефектів
     */
    public void updateTempOrderItem(TempOrderItemDTO tempItem, ItemStainDefectDTO stainDefect) {
        if (tempItem == null || stainDefect == null) {
            return;
        }

        tempItem.setStains(setToString(stainDefect.getSelectedStains()));
        tempItem.setOtherStains(stainDefect.getCustomStainDescription());
        tempItem.setDefectsAndRisks(setToString(stainDefect.getSelectedDefectsAndRisks()));
        tempItem.setDefectsNotes(stainDefect.getDefectNotes());
        tempItem.setNoGuaranteeReason(stainDefect.getNoGuaranteeReason());
    }

    /**
     * Створює новий TempOrderItemDTO на основі плям та дефектів.
     *
     * @param stainDefect дані плям та дефектів
     * @return новий TempOrderItemDTO або null
     */
    public TempOrderItemDTO toTempOrderItem(ItemStainDefectDTO stainDefect) {
        if (stainDefect == null) {
            return null;
        }

        return TempOrderItemDTO.builder()
                .stains(setToString(stainDefect.getSelectedStains()))
                .otherStains(stainDefect.getCustomStainDescription())
                .defectsAndRisks(setToString(stainDefect.getSelectedDefectsAndRisks()))
                .defectsNotes(stainDefect.getDefectNotes())
                .noGuaranteeReason(stainDefect.getNoGuaranteeReason())
                .build();
    }

    /**
     * Копіює дані плям та дефектів з одного DTO в інший.
     *
     * @param source джерело
     * @param target ціль
     */
    public void copyStainDefectData(ItemStainDefectDTO source, ItemStainDefectDTO target) {
        if (source == null || target == null) {
            return;
        }

        target.setSelectedStains(copySet(source.getSelectedStains()));
        target.setCustomStainDescription(source.getCustomStainDescription());
        target.setSelectedDefectsAndRisks(copySet(source.getSelectedDefectsAndRisks()));
        target.setDefectNotes(source.getDefectNotes());
        target.setNoGuaranteeReason(source.getNoGuaranteeReason());
        target.setShowCustomStainField(source.getShowCustomStainField());
        target.setShowNoGuaranteeReasonField(source.getShowNoGuaranteeReasonField());
    }

    /**
     * Перевіряє, чи мають два DTO однакові дані плям та дефектів.
     *
     * @param first перший DTO
     * @param second другий DTO
     * @return true, якщо дані однакові
     */
    public boolean areStainDefectDataEqual(ItemStainDefectDTO first, ItemStainDefectDTO second) {
        if (first == null && second == null) {
            return true;
        }
        if (first == null || second == null) {
            return false;
        }

        return setsEqual(first.getSelectedStains(), second.getSelectedStains()) &&
               stringsEqual(first.getCustomStainDescription(), second.getCustomStainDescription()) &&
               setsEqual(first.getSelectedDefectsAndRisks(), second.getSelectedDefectsAndRisks()) &&
               stringsEqual(first.getDefectNotes(), second.getDefectNotes()) &&
               stringsEqual(first.getNoGuaranteeReason(), second.getNoGuaranteeReason());
    }

    /**
     * Створює підсумок плям та дефектів для тимчасового предмета.
     *
     * @param tempItem тимчасові дані предмета
     * @return підсумок у вигляді рядка
     */
    public String createStainDefectSummary(TempOrderItemDTO tempItem) {
        if (tempItem == null) {
            return "";
        }

        StringBuilder summary = new StringBuilder();

                // Додаємо плями
        if (StringUtils.hasText(tempItem.getStains())) {
            summary.append("Плями: ").append(tempItem.getStains());

            if (StringUtils.hasText(tempItem.getOtherStains())) {
                summary.append(" (").append(tempItem.getOtherStains()).append(")");
            }
        }

        // Додаємо дефекти
        if (StringUtils.hasText(tempItem.getDefectsAndRisks())) {
            if (summary.length() > 0) summary.append("; ");
            summary.append("Дефекти/Ризики: ").append(tempItem.getDefectsAndRisks());

            if (StringUtils.hasText(tempItem.getNoGuaranteeReason())) {
                summary.append(" (причина: ").append(tempItem.getNoGuaranteeReason()).append(")");
            }
        }

        // Додаємо примітки
        if (StringUtils.hasText(tempItem.getDefectsNotes())) {
            if (summary.length() > 0) summary.append("; ");
            summary.append("Примітки: ").append(tempItem.getDefectsNotes());
        }

        return summary.toString();
    }

    /**
     * Конвертує рядок у Set, розділяючи за комами.
     */
    private Set<String> parseToSet(String value) {
        if (!StringUtils.hasText(value)) {
            return Set.of();
        }

        return Stream.of(value.split(DELIMITER))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    /**
     * Конвертує Set у рядок, об'єднуючи через коми.
     */
    private String setToString(Set<String> set) {
        if (set == null || set.isEmpty()) {
            return null;
        }

        return set.stream()
                .sorted()
                .collect(Collectors.joining(DELIMITER + " "));
    }

    /**
     * Перевіряє, чи містить рядок "Інше" у плямах.
     */
    private boolean hasCustomStain(String stains) {
        return StringUtils.hasText(stains) && stains.contains("Інше");
    }

    /**
     * Перевіряє, чи містить рядок "Без гарантій".
     */
    private boolean hasNoGuarantee(String defects) {
        return StringUtils.hasText(defects) && defects.contains("Без гарантій");
    }

    /**
     * Копіює Set (створює новий екземпляр).
     */
    private Set<String> copySet(Set<String> source) {
        if (source == null) {
            return null;
        }
        return Set.copyOf(source);
    }

    /**
     * Утилітний метод для порівняння двох Set з урахуванням null.
     */
    private boolean setsEqual(Set<String> first, Set<String> second) {
        if (first == null && second == null) {
            return true;
        }
        if (first == null || second == null) {
            return false;
        }
        return first.equals(second);
    }

    /**
     * Утилітний метод для порівняння двох рядків з урахуванням null.
     */
    private boolean stringsEqual(String first, String second) {
        if (first == null && second == null) {
            return true;
        }
        if (first == null || second == null) {
            return false;
        }
        return first.equals(second);
    }

    /**
     * Перевіряє, чи має тимчасовий предмет критичні ризики.
     */
    public boolean hasCriticalRisks(TempOrderItemDTO tempItem) {
        if (tempItem == null || !StringUtils.hasText(tempItem.getDefectsAndRisks())) {
            return false;
        }

        String defects = tempItem.getDefectsAndRisks().toLowerCase();
        return defects.contains("ризики") || defects.contains("без гарантій");
    }

    /**
     * Отримує кількість вибраних плям.
     */
    public int getStainsCount(TempOrderItemDTO tempItem) {
        if (tempItem == null || !StringUtils.hasText(tempItem.getStains())) {
            return 0;
        }
        return parseToSet(tempItem.getStains()).size();
    }

    /**
     * Отримує кількість вибраних дефектів.
     */
    public int getDefectsCount(TempOrderItemDTO tempItem) {
        if (tempItem == null || !StringUtils.hasText(tempItem.getDefectsAndRisks())) {
            return 0;
        }
        return parseToSet(tempItem.getDefectsAndRisks()).size();
    }
}
