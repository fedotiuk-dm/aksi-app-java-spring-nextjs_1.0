package com.aksi.domain.order.statemachine.stage2.substep2.dto;

import java.util.List;

import com.aksi.domain.order.statemachine.stage2.substep2.enums.MaterialType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для опцій матеріалів з додатковою інформацією
 *
 * Використовується для відображення доступних матеріалів
 * з урахуванням категорії предмета та додаткової інформації
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialOptionDTO {

    /**
     * Тип матеріала
     */
    private MaterialType materialType;

    /**
     * Назва для відображення
     */
    private String displayName;

    /**
     * Код матеріала
     */
    private String code;

    /**
     * Опис матеріала
     */
    private String description;

    /**
     * Категорія матеріала (Текстиль/Шкіра)
     */
    private String category;

    /**
     * Чи доступний для поточної категорії предмета
     */
    @Builder.Default
    private Boolean isAvailable = true;

    /**
     * Чи рекомендований для поточної категорії
     */
    @Builder.Default
    private Boolean isRecommended = false;

    /**
     * Чи потребує особливого догляду
     */
    @Builder.Default
    private Boolean requiresSpecialCare = false;

    /**
     * Список рекомендованих кольорів для цього матеріала
     */
    @Builder.Default
    private List<String> recommendedColors = List.of();

    /**
     * Список застережень для цього матеріала
     */
    @Builder.Default
    private List<String> warnings = List.of();

    /**
     * Примітки щодо обробки
     */
    private String processingNotes;

    /**
     * Створює MaterialOptionDTO з MaterialType
     */
    public static MaterialOptionDTO fromMaterialType(MaterialType materialType) {
        return MaterialOptionDTO.builder()
                .materialType(materialType)
                .displayName(materialType.getDisplayName())
                .code(materialType.getCode())
                .category(materialType.getCategory().getDisplayName())
                .requiresSpecialCare(materialType.isLeather())
                .description(getDefaultDescription(materialType))
                .build();
    }

    /**
     * Отримує стандартний опис для типу матеріала
     */
    private static String getDefaultDescription(MaterialType materialType) {
        return switch (materialType) {
            case COTTON -> "Натуральний бавовняний матеріал";
            case WOOL -> "Натуральна шерсть, делікатна обробка";
            case SILK -> "Натуральний шовк, потребує особливого догляду";
            case SYNTHETIC -> "Синтетичний матеріал, стійкий до обробки";
            case SMOOTH_LEATHER -> "Гладка натуральна шкіра";
            case NUBUCK -> "Шліфована шкіра з оксамитовою поверхнею";
            case SPLIT_LEATHER -> "Спілок - розщеплена шкіра";
            case SUEDE -> "Замша - шкіра з ворсистою поверхнею";
        };
    }

    /**
     * Перевіряє чи є матеріал текстильним
     */
    public boolean isTextile() {
        return materialType != null && materialType.isTextile();
    }

    /**
     * Перевіряє чи є матеріал шкіряним
     */
    public boolean isLeather() {
        return materialType != null && materialType.isLeather();
    }
}
