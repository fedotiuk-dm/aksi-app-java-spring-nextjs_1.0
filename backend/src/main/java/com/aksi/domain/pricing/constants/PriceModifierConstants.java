package com.aksi.domain.pricing.constants;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

/**
 * Константи для модифікаторів цін і коефіцієнтів.
 * Містить коефіцієнти для розрахунку знижок та надбавок.
 */
@Slf4j
public final class PriceModifierConstants {
    
    private PriceModifierConstants() {
        // Приватний конструктор для запобігання створення екземплярів
    }
    
    /**
     * Мінімальне значення ціни для уникнення від'ємних значень.
     */
    public static final BigDecimal MIN_PRICE = BigDecimal.ONE;
    
    /**
     * Базовий інтерфейс для модифікаторів ціни.
     */
    public interface PriceModifier {
        /**
         * Отримати ID модифікатора.
         * 
         * @return ID модифікатора
         */
        String getId();
        
        /**
         * Отримати назву модифікатора.
         * 
         * @return Назва модифікатора
         */
        String getName();
        
        /**
         * Отримати опис модифікатора.
         * 
         * @return Опис модифікатора
         */
        String getDescription();
        
        /**
         * Застосувати модифікатор до ціни.
         * 
         * @param price Початкова ціна
         * @return Модифікована ціна
         */
        BigDecimal apply(BigDecimal price);
        
        /**
         * Перевірити, чи модифікатор застосовується до категорії.
         * 
         * @param categoryCode Код категорії
         * @return true, якщо модифікатор можна застосувати до категорії
         */
        boolean isApplicableToCategory(String categoryCode);
        
        /**
         * Отримати опис змін, які модифікатор застосовує до ціни.
         * 
         * @return Опис змін (наприклад, "+20%", "-30%", тощо)
         */
        String getChangeDescription();
        
        /**
         * Отримати тип модифікатора: загальний чи категорійний.
         * 
         * @return Тип модифікатора
         */
        default ModifierType getType() {
            return ModifierType.GENERAL;
        }
    }
    
    /**
     * Типи модифікаторів.
     */
    public enum ModifierType {
        /**
         * Загальний модифікатор, який можна застосувати до будь-якої категорії.
         */
        GENERAL,
        
        /**
         * Модифікатор для текстильних виробів.
         */
        TEXTILE,
        
        /**
         * Модифікатор для шкіряних виробів.
         */
        LEATHER
    }
    
    /**
     * Абстрактна реалізація модифікатора ціни зі спільною логікою.
     */
    public abstract static class AbstractPriceModifier implements PriceModifier {
        private final String id;
        private final String name;
        private final String description;
        private final ModifierType type;
        private final Set<String> applicableCategories;
        
        protected AbstractPriceModifier(String id, String name, String description, ModifierType type, Set<String> applicableCategories) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.type = type;
            this.applicableCategories = applicableCategories != null ? applicableCategories : Collections.emptySet();
        }
        
        @Override
        public String getId() {
            return id;
        }
        
        @Override
        public String getName() {
            return name;
        }
        
        @Override
        public String getDescription() {
            return description;
        }
        
        @Override
        public ModifierType getType() {
            return type;
        }
        
        @Override
        public boolean isApplicableToCategory(String categoryCode) {
            // Якщо список категорій порожній, то модифікатор застосовується до всіх категорій
            return applicableCategories.isEmpty() || applicableCategories.contains(categoryCode);
        }
    }
    
    /**
     * Модифікатор ціни з відсотковою зміною.
     */
    public static class PercentageModifier extends AbstractPriceModifier {
        private final BigDecimal percentageModifier;
        
        protected PercentageModifier(String id, String name, String description, BigDecimal percentageModifier, ModifierType type, Set<String> applicableCategories) {
            super(id, name, description, type, applicableCategories);
            this.percentageModifier = percentageModifier;
        }
        
        @Override
        public BigDecimal apply(BigDecimal price) {
            if (price == null) {
                return MIN_PRICE;
            }
            
            BigDecimal modifiedPrice = price.add(price.multiply(percentageModifier).divide(BigDecimal.valueOf(100)));
            
            // Ціна не може бути менше мінімальної
            return modifiedPrice.compareTo(MIN_PRICE) < 0 ? MIN_PRICE : modifiedPrice;
        }
        
        @Override
        public String getChangeDescription() {
            if (percentageModifier.compareTo(BigDecimal.ZERO) > 0) {
                return "+" + percentageModifier + "%";
            } else {
                return percentageModifier + "%";
            }
        }
    }
    
    /**
     * Модифікатор ціни з фіксованою вартістю.
     */
    public static class FixedPriceModifier extends AbstractPriceModifier {
        private final BigDecimal fixedPrice;
        
        protected FixedPriceModifier(String id, String name, String description, BigDecimal fixedPrice, ModifierType type, Set<String> applicableCategories) {
            super(id, name, description, type, applicableCategories);
            this.fixedPrice = fixedPrice;
        }
        
        @Override
        public BigDecimal apply(BigDecimal price) {
            // Повернути фіксовану ціну, незалежно від вхідної ціни
            return fixedPrice != null ? fixedPrice : MIN_PRICE;
        }
        
        @Override
        public String getChangeDescription() {
            return "Фіксована ціна: " + fixedPrice + " грн";
        }
    }
    
    /**
     * Модифікатор ціни з діапазоном відсоткових значень.
     */
    public static class RangePercentageModifier extends AbstractPriceModifier {
        private final BigDecimal minPercentage;
        private final BigDecimal maxPercentage;
        
        protected RangePercentageModifier(String id, String name, String description, BigDecimal minPercentage, BigDecimal maxPercentage, ModifierType type, Set<String> applicableCategories) {
            super(id, name, description, type, applicableCategories);
            this.minPercentage = minPercentage;
            this.maxPercentage = maxPercentage;
        }
        
        @Override
        public BigDecimal apply(BigDecimal price) {
            if (price == null) {
                return MIN_PRICE;
            }
            
            // За замовчуванням використовуємо середнє значення діапазону
            BigDecimal percentageToUse = minPercentage.add(maxPercentage).divide(BigDecimal.valueOf(2));
            BigDecimal modifiedPrice = price.add(price.multiply(percentageToUse).divide(BigDecimal.valueOf(100)));
            
            // Ціна не може бути менше мінімальної
            return modifiedPrice.compareTo(MIN_PRICE) < 0 ? MIN_PRICE : modifiedPrice;
        }
        
        /**
         * Застосувати модифікатор з конкретним відсотком з діапазону.
         * 
         * @param price Початкова ціна
         * @param percentage Відсоток у діапазоні від мінімального до максимального
         * @return Модифікована ціна
         */
        public BigDecimal applyWithPercentage(BigDecimal price, BigDecimal percentage) {
            if (price == null) {
                return MIN_PRICE;
            }
            
            // Перевіряємо, що відсоток знаходиться в межах діапазону
            BigDecimal validPercentage = percentage;
            if (percentage.compareTo(minPercentage) < 0) {
                validPercentage = minPercentage;
                log.warn("Specified percentage {} is less than minimum {}. Using minimum.", percentage, minPercentage);
            } else if (percentage.compareTo(maxPercentage) > 0) {
                validPercentage = maxPercentage;
                log.warn("Specified percentage {} is greater than maximum {}. Using maximum.", percentage, maxPercentage);
            }
            
            BigDecimal modifiedPrice = price.add(price.multiply(validPercentage).divide(BigDecimal.valueOf(100)));
            
            // Ціна не може бути менше мінімальної
            return modifiedPrice.compareTo(MIN_PRICE) < 0 ? MIN_PRICE : modifiedPrice;
        }
        
        @Override
        public String getChangeDescription() {
            return "+" + minPercentage + "% до +" + maxPercentage + "%";
        }
    }
    
    /**
     * Модифікатор ціни з фіксованою надбавкою до базової вартості.
     */
    public static class AdditionModifier extends AbstractPriceModifier {
        private final BigDecimal additionAmount;
        
        protected AdditionModifier(String id, String name, String description, BigDecimal additionAmount, ModifierType type, Set<String> applicableCategories) {
            super(id, name, description, type, applicableCategories);
            this.additionAmount = additionAmount;
        }
        
        @Override
        public BigDecimal apply(BigDecimal price) {
            if (price == null) {
                return additionAmount != null ? additionAmount : MIN_PRICE;
            }
            
            BigDecimal modifiedPrice = price.add(additionAmount);
            
            // Ціна не може бути менше мінімальної
            return modifiedPrice.compareTo(MIN_PRICE) < 0 ? MIN_PRICE : modifiedPrice;
        }
        
        @Override
        public String getChangeDescription() {
            return "+" + additionAmount + " грн";
        }
    }
    
    /**
     * Константи для загальних модифікаторів, які застосовуються до всіх категорій.
     */
    public static final class GeneralModifiers {
        private GeneralModifiers() {
            // Приватний конструктор
        }
        
        // Загальні коефіцієнти (доступні для всіх категорій)
        public static final PriceModifier KIDS_ITEMS = new PercentageModifier(
                "kids_items",
                "Дитячі речі (до 30 розміру)",
                "30% від вартості для дитячих речей до 30 розміру",
                BigDecimal.valueOf(-30), // знижка 30%
                ModifierType.GENERAL,
                null
        );
        
        public static final PriceModifier MANUAL_CLEANING = new PercentageModifier(
                "manual_cleaning",
                "Ручна чистка",
                "+20% до вартості за ручну чистку",
                BigDecimal.valueOf(20),
                ModifierType.GENERAL,
                null
        );
        
        public static final PriceModifier VERY_DIRTY_ITEMS = new RangePercentageModifier(
                "very_dirty_items",
                "Дуже забруднені речі",
                "Від +20% до +100% до вартості за дуже забруднені речі",
                BigDecimal.valueOf(20),
                BigDecimal.valueOf(100),
                ModifierType.GENERAL,
                null
        );
        
        public static final PriceModifier URGENT_CLEANING = new RangePercentageModifier(
                "urgent_cleaning",
                "Термінова чистка",
                "Від +50% до +100% до вартості за термінову чистку",
                BigDecimal.valueOf(50),
                BigDecimal.valueOf(100),
                ModifierType.GENERAL,
                null
        );
        
        /**
         * Отримати всі загальні модифікатори.
         * 
         * @return Список загальних модифікаторів
         */
        public static List<PriceModifier> getAllGeneralModifiers() {
            return Arrays.asList(KIDS_ITEMS, MANUAL_CLEANING, VERY_DIRTY_ITEMS, URGENT_CLEANING);
        }
    }
    
    /**
     * Константи для модифікаторів текстильних виробів.
     */
    public static final class TextileModifiers {
        private TextileModifiers() {
            // Приватний конструктор
        }
        
        // Коди категорій текстильних виробів
        private static final Set<String> TEXTILE_CATEGORIES = Set.of(
                "odiah", "prania_bilyzny", "prasuvanya", "farbuvannia" // Реальні коди текстильних категорій
        );
        
        // Модифікатори для текстильних виробів
        public static final PriceModifier FUR_COLLARS = new PercentageModifier(
                "fur_collars",
                "Чистка виробів з хутряними комірами та манжетами",
                "+30% до вартості чистки за вироби з хутряними комірами та манжетами",
                BigDecimal.valueOf(30),
                ModifierType.TEXTILE,
                TEXTILE_CATEGORIES
        );
        
        public static final PriceModifier WATER_REPELLENT = new PercentageModifier(
                "water_repellent",
                "Нанесення водовідштовхуючого покриття",
                "+30% до вартості за нанесення водовідштовхуючого покриття",
                BigDecimal.valueOf(30),
                ModifierType.TEXTILE,
                TEXTILE_CATEGORIES
        );
        
        public static final PriceModifier SILK_PRODUCTS = new PercentageModifier(
                "silk_products",
                "Чистка виробів із натурального шовку, атласу, шифону",
                "+50% до вартості за чистку виробів із натурального шовку, атласу, шифону",
                BigDecimal.valueOf(50),
                ModifierType.TEXTILE,
                TEXTILE_CATEGORIES
        );
        
        public static final PriceModifier COMBINED_PRODUCTS = new PercentageModifier(
                "combined_products",
                "Чистка комбінованих виробів (шкіра+текстиль)",
                "+100% до вартості чистки текстилю для комбінованих виробів",
                BigDecimal.valueOf(100),
                ModifierType.TEXTILE,
                TEXTILE_CATEGORIES
        );
        
        public static final PriceModifier LARGE_TOYS = new PercentageModifier(
                "large_toys",
                "Ручна чистка великих м'яких іграшок",
                "+100% до вартості чистки для великих м'яких іграшок",
                BigDecimal.valueOf(100),
                ModifierType.TEXTILE,
                TEXTILE_CATEGORIES
        );
        
        public static final PriceModifier SEWING_BUTTONS = new FixedPriceModifier(
                "sewing_buttons",
                "Пришивання гудзиків",
                "Фіксована вартість за пришивання одного гудзика",
                BigDecimal.valueOf(10), // фіксована ціна за один гудзик
                ModifierType.TEXTILE,
                TEXTILE_CATEGORIES
        );
        
        public static final PriceModifier BLACK_LIGHT_COLORS = new PercentageModifier(
                "black_light_colors",
                "Чистка виробів чорного та світлих тонів",
                "+20% до вартості за чистку виробів чорного та світлих тонів",
                BigDecimal.valueOf(20),
                ModifierType.TEXTILE,
                TEXTILE_CATEGORIES
        );
        
        public static final PriceModifier WEDDING_DRESS = new PercentageModifier(
                "wedding_dress",
                "Чистка весільної сукні зі шлейфом",
                "+30% до вартості за чистку весільної сукні зі шлейфом",
                BigDecimal.valueOf(30),
                ModifierType.TEXTILE,
                TEXTILE_CATEGORIES
        );
        
        /**
         * Отримати всі модифікатори для текстильних виробів.
         * 
         * @return Список модифікаторів для текстильних виробів
         */
        public static List<PriceModifier> getAllTextileModifiers() {
            return Arrays.asList(
                    FUR_COLLARS, WATER_REPELLENT, SILK_PRODUCTS, COMBINED_PRODUCTS,
                    LARGE_TOYS, SEWING_BUTTONS, BLACK_LIGHT_COLORS, WEDDING_DRESS
            );
        }
    }
    
    /**
     * Константи для модифікаторів шкіряних виробів.
     */
    public static final class LeatherModifiers {
        private LeatherModifiers() {
            // Приватний конструктор
        }
        
        // Коди категорій шкіряних виробів
        private static final Set<String> LEATHER_CATEGORIES = Set.of(
                "shkiriani_vyroby", "dublyanky", "hutriani_vyroby" // Реальні коди категорій шкіряних виробів
        );
        
        // Модифікатори для шкіряних виробів
        public static final PriceModifier LEATHER_IRONING = new PercentageModifier(
                "leather_ironing",
                "Прасування шкіряних виробів",
                "70% від вартості чистки за прасування шкіряних виробів",
                BigDecimal.valueOf(70), // тут не знижка, а окрема послуга
                ModifierType.LEATHER,
                LEATHER_CATEGORIES
        );
        
        public static final PriceModifier LEATHER_WATER_REPELLENT = new PercentageModifier(
                "leather_water_repellent",
                "Нанесення водовідштовхуючого покриття",
                "+30% до вартості послуги за нанесення водовідштовхуючого покриття",
                BigDecimal.valueOf(30),
                ModifierType.LEATHER,
                LEATHER_CATEGORIES
        );
        
        public static final PriceModifier LEATHER_COLORING_AFTER_OUR_CLEANING = new PercentageModifier(
                "leather_coloring_after_our_cleaning",
                "Фарбування (після нашої чистки)",
                "+50% до вартості послуги за фарбування після нашої чистки",
                BigDecimal.valueOf(50),
                ModifierType.LEATHER,
                LEATHER_CATEGORIES
        );
        
        public static final PriceModifier LEATHER_COLORING_AFTER_OTHER_CLEANING = new PercentageModifier(
                "leather_coloring_after_other_cleaning",
                "Фарбування (після чистки деінде)",
                "100% вартість чистки за фарбування після чистки деінде",
                BigDecimal.valueOf(100),
                ModifierType.LEATHER,
                LEATHER_CATEGORIES
        );
        
        public static final PriceModifier LEATHER_WITH_INSERTS = new PercentageModifier(
                "leather_with_inserts",
                "Чистка шкіряних виробів із вставками",
                "+30% до вартості за чистку шкіряних виробів із вставками",
                BigDecimal.valueOf(30),
                ModifierType.LEATHER,
                LEATHER_CATEGORIES
        );
        
        public static final PriceModifier PEARL_COATING = new PercentageModifier(
                "pearl_coating",
                "Нанесення перламутрового покриття",
                "+30% до вартості послуги за нанесення перламутрового покриття",
                BigDecimal.valueOf(30),
                ModifierType.LEATHER,
                LEATHER_CATEGORIES
        );
        
        public static final PriceModifier NATURAL_SHEEPSKIN = new PercentageModifier(
                "natural_sheepskin",
                "Чистка натуральних дублянок на штучному хутрі",
                "-20% від вартості за чистку натуральних дублянок на штучному хутрі",
                BigDecimal.valueOf(-20),
                ModifierType.LEATHER,
                LEATHER_CATEGORIES
        );
        
        public static final PriceModifier LEATHER_SEWING_BUTTONS = new FixedPriceModifier(
                "leather_sewing_buttons",
                "Пришивання гудзиків",
                "Фіксована вартість за пришивання одного гудзика",
                BigDecimal.valueOf(10),
                ModifierType.LEATHER,
                LEATHER_CATEGORIES
        );
        
        public static final PriceModifier MANUAL_LEATHER_CLEANING = new PercentageModifier(
                "manual_leather_cleaning",
                "Ручна чистка виробів зі шкіри",
                "+30% до вартості чистки за ручну чистку виробів зі шкіри",
                BigDecimal.valueOf(30),
                ModifierType.LEATHER,
                LEATHER_CATEGORIES
        );
        
        /**
         * Отримати всі модифікатори для шкіряних виробів.
         * 
         * @return Список модифікаторів для шкіряних виробів
         */
        public static List<PriceModifier> getAllLeatherModifiers() {
            return Arrays.asList(
                    LEATHER_IRONING, LEATHER_WATER_REPELLENT, LEATHER_COLORING_AFTER_OUR_CLEANING,
                    LEATHER_COLORING_AFTER_OTHER_CLEANING, LEATHER_WITH_INSERTS, PEARL_COATING,
                    NATURAL_SHEEPSKIN, LEATHER_SEWING_BUTTONS, MANUAL_LEATHER_CLEANING
            );
        }
    }
    
    /**
     * Отримати всі доступні модифікатори.
     * 
     * @return Список всіх модифікаторів
     */
    public static List<PriceModifier> getAllModifiers() {
        List<PriceModifier> modifiers = new ArrayList<>();
        modifiers.addAll(GeneralModifiers.getAllGeneralModifiers());
        modifiers.addAll(TextileModifiers.getAllTextileModifiers());
        modifiers.addAll(LeatherModifiers.getAllLeatherModifiers());
        return modifiers;
    }
    
    /**
     * Отримати модифікатори для конкретної категорії.
     * 
     * @param categoryCode Код категорії
     * @return Список модифікаторів для категорії
     */
    public static List<PriceModifier> getModifiersForCategory(String categoryCode) {
        return getAllModifiers().stream()
                .filter(modifier -> modifier.isApplicableToCategory(categoryCode))
                .collect(Collectors.toList());
    }
    
    /**
     * Знайти модифікатор за його ID.
     * 
     * @param modifierId ID модифікатора
     * @return Модифікатор ціни або null, якщо не знайдено
     */
    public static PriceModifier findModifierById(String modifierId) {
        return getAllModifiers().stream()
                .filter(modifier -> modifier.getId().equals(modifierId))
                .findFirst()
                .orElse(null);
    }
    
    /**
     * Групування модифікаторів за типами.
     * 
     * @return Мапа модифікаторів за типами
     */
    public static Map<ModifierType, List<PriceModifier>> groupModifiersByType() {
        return getAllModifiers().stream()
                .collect(Collectors.groupingBy(PriceModifier::getType));
    }
}
