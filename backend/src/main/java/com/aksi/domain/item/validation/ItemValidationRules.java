package com.aksi.domain.item.validation;

import java.util.Optional;
import java.util.UUID;

import com.aksi.domain.item.entity.ItemPhotoEntity;
import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.entity.ServiceCategoryEntity;
import com.aksi.domain.item.repository.ItemPhotoRepository;
import com.aksi.domain.item.repository.PriceListItemRepository;
import com.aksi.domain.item.repository.PriceModifierRepository;
import com.aksi.domain.item.repository.ServiceCategoryRepository;
import com.aksi.shared.validation.CommonValidationRules;
import com.aksi.shared.validation.ValidationResult;
import com.aksi.shared.validation.Validator;

/**
 * Domain-specific функціональні правила валідації для Item Domain.
 * Використовує загальні правила з CommonValidationRules + специфічні для Item.
 */
public final class ItemValidationRules {

    // ==================== SERVICE CATEGORY RULES ====================

    /**
     * Перевірка унікальності коду категорії.
     * Використовує загальне правило uniqueField.
     */
    public static Validator<ServiceCategoryEntity> uniqueCode(ServiceCategoryRepository repository) {
        return CommonValidationRules.uniqueField(
            ServiceCategoryEntity::getCode,
            repository::existsByCode,
            "Код категорії"
        );
    }

    /**
     * Перевірка унікальності коду категорії при оновленні.
     */
    public static Validator<ServiceCategoryEntity> uniqueCodeForUpdate(ServiceCategoryRepository repository) {
        return CommonValidationRules.uniqueFieldForUpdate(
            ServiceCategoryEntity::getCode,
            ServiceCategoryEntity::getUuid,
            repository::existsByCodeAndUuidNot,
            "Код категорії"
        );
    }

    /**
     * Перевірка існування батьківської категорії.
     */
    public static Validator<ServiceCategoryEntity> validParentCategory(ServiceCategoryRepository repository) {
        return CommonValidationRules.relatedEntityExists(
            ServiceCategoryEntity::getParentId,
            repository::findByUuid,
            "Батьківська категорія"
        );
    }

    /**
     * Бізнес-правила для категорій.
     */
    public static Validator<ServiceCategoryEntity> categoryBusinessRules() {
        return Validator.from(
            category -> !Optional.ofNullable(category.getCode())
                .map(code -> code.startsWith("TEMP_"))
                .orElse(false),
            "Коди які починаються з 'TEMP_' заборонені для постійних категорій"
        );
    }

    /**
     * Перевірка циклічного посилання в ієрархії.
     */
    public static Validator<ServiceCategoryEntity> noCircularReference(ServiceCategoryRepository repository) {
        return entity -> {
            if (entity.getParentId() == null || entity.getUuid().equals(entity.getParentId())) {
                return ValidationResult.valid();
            }

            UUID currentParentId = entity.getParentId();
            int depth = 0;
            final int maxDepth = 10;

            while (currentParentId != null && depth < maxDepth) {
                if (currentParentId.equals(entity.getUuid())) {
                    return ValidationResult.invalid("Виявлено циклічне посилання в ієрархії категорій");
                }

                currentParentId = repository.findByUuid(currentParentId)
                    .map(ServiceCategoryEntity::getParentId)
                    .orElse(null);
                depth++;
            }

            return depth >= maxDepth
                ? ValidationResult.invalid("Ієрархія категорій занадто глибока (максимум " + maxDepth + " рівнів)")
                : ValidationResult.valid();
        };
    }

    /**
     * Перевірка що категорію можна видалити.
     */
    public static Validator<UUID> categoryCanBeDeleted(ServiceCategoryRepository repository) {
        return categoryUuid -> {
            long childrenCount = repository.findByParentIdAndIsActiveTrue(categoryUuid).size();
            return childrenCount > 0
                ? ValidationResult.invalid("Неможливо видалити категорію яка має дочірні категорії (" + childrenCount + ")")
                : ValidationResult.valid();
        };
    }

    // ==================== PRICE MODIFIER RULES ====================

    /**
     * Перевірка унікальності коду модифікатора.
     */
    public static Validator<PriceModifierEntity> uniqueModifierCode(PriceModifierRepository repository) {
        return CommonValidationRules.uniqueField(
            PriceModifierEntity::getCode,
            repository::existsByCode,
            "Код модифікатора"
        );
    }

    /**
     * Перевірка унікальності коду модифікатора при оновленні.
     */
    public static Validator<PriceModifierEntity> uniqueModifierCodeForUpdate(PriceModifierRepository repository) {
        return CommonValidationRules.uniqueFieldForUpdate(
            PriceModifierEntity::getCode,
            PriceModifierEntity::getUuid,
            repository::existsByCodeAndUuidNot,
            "Код модифікатора"
        );
    }

    /**
     * Валідація відсоткових модифікаторів.
     */
    public static Validator<PriceModifierEntity> validPercentageValue() {
        return entity -> {
            if (!entity.isPercentageModifier() || entity.getValue() == null) {
                return ValidationResult.valid();
            }

            double value = entity.getValue();
            if (value > 500.0) {
                return ValidationResult.invalid("Відсотковий модифікатор не може бути більше 500%");
            }
            if (value < -95.0) {
                return ValidationResult.invalid("Знижка не може бути більше 95%");
            }
            return ValidationResult.valid();
        };
    }

    /**
     * Валідація фіксованих модифікаторів.
     */
    public static Validator<PriceModifierEntity> validFixedAmountValue() {
        return entity -> {
            if (!entity.isFixedAmountModifier() || entity.getValue() == null) {
                return ValidationResult.valid();
            }

            double value = entity.getValue();
            if (value > 50000.0) {
                return ValidationResult.invalid("Фіксована сума не може бути більше 50000");
            }
            if (value < -10000.0) {
                return ValidationResult.invalid("Фіксована знижка не може бути більше 10000");
            }
            return ValidationResult.valid();
        };
    }

    /**
     * Валідація категорій для модифікатора.
     */
    public static Validator<PriceModifierEntity> validApplicableCategories(ServiceCategoryRepository categoryRepository) {
        return entity -> {
            var categories = entity.getApplicableTo();

            if (entity.isApplicableToAllCategories() || categories.isEmpty()) {
                return ValidationResult.valid();
            }

            if (categories.size() > 50) {
                return ValidationResult.invalid("Модифікатор не може застосовуватися до більше ніж 50 категорій");
            }

            var invalidCategories = categories.stream()
                .filter(categoryId -> categoryRepository.findByUuid(categoryId).isEmpty())
                .toList();

            if (!invalidCategories.isEmpty()) {
                return ValidationResult.invalid("Категорії не існують: " + invalidCategories);
            }

            var inactiveCategories = categories.stream()
                .map(categoryRepository::findByUuid)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(category -> !category.isActiveCategory())
                .map(ServiceCategoryEntity::getUuid)
                .toList();

            if (!inactiveCategories.isEmpty()) {
                return ValidationResult.invalid("Неактивні категорії: " + inactiveCategories);
            }

            return ValidationResult.valid();
        };
    }

    // ==================== PRICE LIST ITEM RULES ====================

    /**
     * Перевірка унікальності каталожного номера.
     */
    public static Validator<PriceListItemEntity> uniqueCatalogNumber(PriceListItemRepository repository) {
        return entity -> repository.existsByCatalogNumber(entity.getCatalogNumber())
            ? ValidationResult.invalid("Каталожний номер '" + entity.getCatalogNumber() + "' вже існує")
            : ValidationResult.valid();
    }

    /**
     * Перевірка унікальності каталожного номера при оновленні.
     */
    public static Validator<PriceListItemEntity> uniqueCatalogNumberForUpdate(PriceListItemRepository repository) {
        return entity -> repository.existsByCatalogNumberAndUuidNot(entity.getCatalogNumber(), entity.getUuid())
            ? ValidationResult.invalid("Каталожний номер '" + entity.getCatalogNumber() + "' вже існує")
            : ValidationResult.valid();
    }

    /**
     * Перевірка існування категорії для предмета.
     */
    public static Validator<PriceListItemEntity> validCategory(ServiceCategoryRepository categoryRepository) {
        return CommonValidationRules.relatedEntityExists(
            PriceListItemEntity::getCategoryId,
            categoryRepository::findByUuid,
            "Категорія"
        );
    }

    /**
     * Валідація цінових полів.
     */
    public static Validator<PriceListItemEntity> validPricing() {
        return entity -> {
            if (entity.getBasePrice() == null || entity.getBasePrice() <= 0) {
                return ValidationResult.invalid("Базова ціна повинна бути більше 0");
            }

            // Перевіряємо що чорна ціна не менше базової (якщо вказана)
            if (entity.getPriceBlack() != null && entity.getPriceBlack() < entity.getBasePrice()) {
                return ValidationResult.invalid("Ціна для чорних речей не може бути менше базової ціни");
            }

            return ValidationResult.valid();
        };
    }

    // ==================== ITEM PHOTO RULES ====================

    /**
     * Валідація розміру файлу фото.
     */
    public static Validator<ItemPhotoEntity> validFileSize() {
        return Validator.from(
            photo -> photo.hasValidFileSize(),
            "Розмір файлу перевищує максимально дозволений"
        );
    }

    /**
     * Валідація формату фото.
     */
    public static Validator<ItemPhotoEntity> validImageFormat() {
        return entity -> {
            if (entity.getContentType() == null) {
                return ValidationResult.invalid("Content-Type обов'язковий для фото");
            }

            if (!entity.getContentType().startsWith("image/")) {
                return ValidationResult.invalid("Файл повинен бути зображенням");
            }

            return ValidationResult.valid();
        };
    }

    /**
     * Валідація унікальності первинного фото.
     */
    public static Validator<ItemPhotoEntity> uniquePrimaryPhoto(ItemPhotoRepository repository) {
        return entity -> {
            if (!entity.isPrimaryPhoto()) {
                return ValidationResult.valid();
            }

            var existingPrimary = repository.findByItemIdAndIsPrimaryTrue(entity.getItemId());
            if (existingPrimary.isPresent() && !existingPrimary.get().getUuid().equals(entity.getUuid())) {
                return ValidationResult.invalid("Для предмета вже існує первинне фото");
            }

            return ValidationResult.valid();
        };
    }

    /**
     * Валідація максимальної кількості фото для предмета.
     */
    public static Validator<ItemPhotoEntity> maxPhotosPerItem(ItemPhotoRepository repository) {
        return entity -> {
            long photoCount = repository.findByItemId(entity.getItemId()).size();
            final int maxPhotos = 10;

            return photoCount >= maxPhotos
                ? ValidationResult.invalid("Максимум " + maxPhotos + " фото на предмет")
                : ValidationResult.valid();
        };
    }
}
