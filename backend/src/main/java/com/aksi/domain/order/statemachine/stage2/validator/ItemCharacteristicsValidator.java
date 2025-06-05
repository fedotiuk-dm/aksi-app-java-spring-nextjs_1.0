package com.aksi.domain.order.statemachine.stage2.validator;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.aksi.domain.order.constants.ItemCharacteristicsConstants;
import com.aksi.domain.order.statemachine.stage2.dto.ItemCharacteristicsDTO;

/**
 * Валідатор для підетапу 2.2 "Характеристики предмета".
 *
 * Перевіряє правильність заповнення всіх обов'язкових полів
 * та відповідність значень допустимим константам.
 */
@Component
public class ItemCharacteristicsValidator {

    private static final Logger logger = LoggerFactory.getLogger(ItemCharacteristicsValidator.class);

    /**
     * Перевіряє валідність характеристик предмета.
     *
     * @param dto DTO з характеристиками
     * @return true, якщо всі дані валідні
     */
    public boolean isValid(ItemCharacteristicsDTO dto) {
        if (dto == null) {
            return false;
        }

        List<String> errors = validate(dto);
        return errors.isEmpty();
    }

    /**
     * Виконує повну валідацію характеристик предмета.
     *
     * @param dto DTO з характеристиками
     * @return список помилок валідації (порожній, якщо помилок немає)
     */
    public List<String> validate(ItemCharacteristicsDTO dto) {
        List<String> errors = new ArrayList<>();

        if (dto == null) {
            errors.add("Дані характеристик відсутні");
            return errors;
        }

        logger.debug("Валідація характеристик предмета: {}", dto);

        // Валідація матеріалу
        validateMaterial(dto, errors);

        // Валідація кольору
        validateColor(dto, errors);

        // Валідація наповнювача (якщо секція відображається)
        if (dto.getShowFillerSection() != null && dto.getShowFillerSection()) {
            validateFiller(dto, errors);
        }

        // Валідація ступеня зносу
        validateWearDegree(dto, errors);

        if (errors.isEmpty()) {
            logger.debug("Валідація характеристик пройшла успішно");
        } else {
            logger.warn("Знайдено помилки валідації характеристик: {}", errors);
        }

        return errors;
    }

    /**
     * Перевіряє базову валідність (тільки обов'язкові поля).
     *
     * @param dto DTO з характеристиками
     * @return true, якщо основні поля заповнені
     */
    public boolean isBasicValidationPassed(ItemCharacteristicsDTO dto) {
        if (dto == null) {
            return false;
        }

        // Перевіряємо тільки обов'язкові поля
        return StringUtils.hasText(dto.getSelectedMaterial()) &&
               hasValidColor(dto) &&
               StringUtils.hasText(dto.getSelectedWearDegree());
    }

    /**
     * Валідує вибраний матеріал.
     */
    private void validateMaterial(ItemCharacteristicsDTO dto, List<String> errors) {
        String material = dto.getSelectedMaterial();

        if (!StringUtils.hasText(material)) {
            errors.add("Матеріал є обов'язковим полем");
            return;
        }

        // Перевіряємо відповідність матеріалу категорії
        if (StringUtils.hasText(dto.getCategoryCode())) {
            List<String> allowedMaterials = ItemCharacteristicsConstants.Materials
                    .getMaterialsByCategory(dto.getCategoryCode());

            if (!allowedMaterials.contains(material)) {
                errors.add("Вибраний матеріал '" + material + "' недоступний для цієї категорії");
            }
        } else {
            // Якщо категорія не вказана, перевіряємо загальний список
            List<String> allMaterials = ItemCharacteristicsConstants.Materials.getAllMaterials();
            if (!allMaterials.contains(material)) {
                errors.add("Невідомий тип матеріалу: " + material);
            }
        }
    }

    /**
     * Валідує вибраний колір.
     */
    private void validateColor(ItemCharacteristicsDTO dto, List<String> errors) {
        String selectedColor = dto.getSelectedColor();
        String customColor = dto.getCustomColor();

        if (!hasValidColor(dto)) {
            errors.add("Колір є обов'язковим полем");
            return;
        }

        // Якщо вибрано стандартний колір, перевіряємо його існування
        if (StringUtils.hasText(selectedColor)) {
            List<String> availableColors = ItemCharacteristicsConstants.Colors.getAllColors();
            if (!availableColors.contains(selectedColor) && !"Інший".equals(selectedColor)) {
                errors.add("Невідомий колір: " + selectedColor);
            }
        }

        // Якщо вибрано "Інший", перевіряємо наявність користувацького кольору
        if ("Інший".equals(selectedColor) && !StringUtils.hasText(customColor)) {
            errors.add("Для варіанту 'Інший' необхідно вказати конкретний колір");
        }

        // Валідація довжини користувацького кольору
        if (StringUtils.hasText(customColor)) {
            if (customColor.trim().length() < 2) {
                errors.add("Назва кольору повинна містити мінімум 2 символи");
            }
            String lengthError = validateTextLength(customColor, 50, "Назва кольору");
            if (lengthError != null) {
                errors.add(lengthError);
            }
            String charactersError = validateTextCharacters(customColor, "Назва кольору");
            if (charactersError != null) {
                errors.add(charactersError);
            }
        }
    }

    /**
     * Валідує наповнювач.
     */
    private void validateFiller(ItemCharacteristicsDTO dto, List<String> errors) {
        String fillerType = dto.getSelectedFillerType();

        if (!StringUtils.hasText(fillerType)) {
            errors.add("Тип наповнювача є обов'язковим для цієї категорії");
            return;
        }

        // Перевіряємо відповідність доступним типам
        List<String> availableFillers = ItemCharacteristicsConstants.FillerTypes.getAllFillerTypes();
        if (!availableFillers.contains(fillerType)) {
            errors.add("Невідомий тип наповнювача: " + fillerType);
        }

        // Якщо вибрано "Інше", перевіряємо наявність опису
        if (ItemCharacteristicsConstants.FillerTypes.OTHER.equals(fillerType)) {
            // Тут може бути додаткова логіка для перевірки опису "іншого" наповнювача
            // Поки що залишаємо базову перевірку
        }
    }

    /**
     * Валідує ступінь зносу.
     */
    private void validateWearDegree(ItemCharacteristicsDTO dto, List<String> errors) {
        String wearDegree = dto.getSelectedWearDegree();

        if (!StringUtils.hasText(wearDegree)) {
            errors.add("Ступінь зносу є обов'язковим полем");
            return;
        }

        // Перевіряємо відповідність доступним значенням
        List<String> availableWearDegrees = ItemCharacteristicsConstants.WearDegrees.getAllWearDegrees();
        if (!availableWearDegrees.contains(wearDegree)) {
            errors.add("Невідомий ступінь зносу: " + wearDegree);
        }
    }

    /**
     * Перевіряє наявність валідного кольору (стандартний або користувацький).
     */
    private boolean hasValidColor(ItemCharacteristicsDTO dto) {
        String selectedColor = dto.getSelectedColor();
        String customColor = dto.getCustomColor();

        // Є стандартний колір (не "Інший") або є "Інший" колір + користувацький опис
        return (StringUtils.hasText(selectedColor) && !"Інший".equals(selectedColor)) ||
               ("Інший".equals(selectedColor) && StringUtils.hasText(customColor));
    }

    /**
     * Перевіряє чи відповідає матеріал обраній категорії.
     *
     * @param categoryCode код категорії
     * @param material обраний матеріал
     * @return true, якщо матеріал підходить для категорії
     */
    public boolean isMaterialValidForCategory(String categoryCode, String material) {
        if (!StringUtils.hasText(categoryCode) || !StringUtils.hasText(material)) {
            return false;
        }

        List<String> allowedMaterials = ItemCharacteristicsConstants.Materials
                .getMaterialsByCategory(categoryCode);

        return allowedMaterials.contains(material);
    }

    /**
     * Перевіряє чи потрібно заповнювати поле наповнювача для даної категорії.
     * Використовує константи замість хардкоду.
     *
     * @param categoryCode код категорії
     * @return true, якщо наповнювач обов'язковий
     */
    public boolean isFillerRequired(String categoryCode) {
        return ItemCharacteristicsConstants.FillerCategories.shouldShowFillerSection(categoryCode);
    }

    /**
     * Валідує довжину текстового поля.
     *
     * @param value значення для перевірки
     * @param maxLength максимальна довжина
     * @param fieldName назва поля для помилки
     * @return помилка валідації або null
     */
    private String validateTextLength(String value, int maxLength, String fieldName) {
        if (value != null && value.length() > maxLength) {
            return fieldName + " занадто довгий (максимум " + maxLength + " символів)";
        }
        return null;
    }

    /**
     * Валідує текст на недопустимі символи.
     *
     * @param value значення для перевірки
     * @param fieldName назва поля для помилки
     * @return помилка валідації або null
     */
    private String validateTextCharacters(String value, String fieldName) {
        if (value != null && !value.matches("^[\\p{L}\\p{N}\\s\\-,().]+$")) {
            return fieldName + " містить недопустимі символи";
        }
        return null;
    }
}
