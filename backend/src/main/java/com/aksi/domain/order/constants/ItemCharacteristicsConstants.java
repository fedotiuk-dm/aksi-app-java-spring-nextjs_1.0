package com.aksi.domain.order.constants;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Константи для характеристик предметів замовлення.
 * Містить списки можливих значень для різних характеристик.
 */
public final class ItemCharacteristicsConstants {

    private ItemCharacteristicsConstants() {
        // Приватний конструктор для запобігання створення екземплярів
    }

    /**
     * Доступні типи матеріалів.
     */
    public static final class Materials {
        private Materials() {
            // Приватний конструктор
        }

        public static final String COTTON = "Бавовна";
        public static final String WOOL = "Шерсть";
        public static final String SILK = "Шовк";
        public static final String SYNTHETIC = "Синтетика";
        public static final String SMOOTH_LEATHER = "Гладка шкіра";
        public static final String NUBUCK = "Нубук";
        public static final String SPLITOK = "Спілок";
        public static final String SUEDE = "Замша";

        /**
         * Отримати всі доступні матеріали.
         *
         * @return Список матеріалів
         */
        public static List<String> getAllMaterials() {
            return Arrays.asList(
                    COTTON, WOOL, SILK, SYNTHETIC,
                    SMOOTH_LEATHER, NUBUCK, SPLITOK, SUEDE
            );
        }

        /**
         * Отримати матеріали для певної категорії.
         *
         * @param category Категорія предмета
         * @return Список матеріалів для категорії
         */
        public static List<String> getMaterialsByCategory(String category) {
            if (category == null) {
                return getAllMaterials();
            }

            // Матеріали для шкіряних виробів
            if (category.toLowerCase().contains("шкір")) {
                return Arrays.asList(SMOOTH_LEATHER, NUBUCK, SPLITOK, SUEDE);
            }

            // Матеріали для текстилю та одягу
            return Arrays.asList(COTTON, WOOL, SILK, SYNTHETIC);
        }
    }

    /**
     * Доступні базові кольори.
     */
    public static final class Colors {
        private Colors() {
            // Приватний конструктор
        }

        public static final String BLACK = "Чорний";
        public static final String WHITE = "Білий";
        public static final String RED = "Червоний";
        public static final String BLUE = "Синій";
        public static final String GREEN = "Зелений";
        public static final String YELLOW = "Жовтий";
        public static final String BEIGE = "Бежевий";
        public static final String GRAY = "Сірий";
        public static final String BROWN = "Коричневий";

        /**
         * Отримати всі базові кольори.
         *
         * @return Список кольорів
         */
        public static List<String> getAllColors() {
            return Arrays.asList(
                    BLACK, WHITE, RED, BLUE, GREEN,
                    YELLOW, BEIGE, GRAY, BROWN
            );
        }
    }

    /**
     * Доступні типи наповнювачів.
     */
    public static final class FillerTypes {
        private FillerTypes() {
            // Приватний конструктор
        }

        public static final String DOWN = "Пух";
        public static final String SINTEPON = "Синтепон";
        public static final String OTHER = "Інше";

        /**
         * Отримати всі типи наповнювачів.
         *
         * @return Список типів наповнювачів
         */
        public static List<String> getAllFillerTypes() {
            return Arrays.asList(DOWN, SINTEPON, OTHER);
        }
    }

    /**
     * Доступні ступені зносу.
     */
    public static final class WearDegrees {
        private WearDegrees() {
            // Приватний конструктор
        }

        public static final String TEN_PERCENT = "10%";
        public static final String THIRTY_PERCENT = "30%";
        public static final String FIFTY_PERCENT = "50%";
        public static final String SEVENTY_FIVE_PERCENT = "75%";

        /**
         * Отримати всі ступені зносу.
         *
         * @return Список ступенів зносу
         */
        public static List<String> getAllWearDegrees() {
            return Arrays.asList(TEN_PERCENT, THIRTY_PERCENT, FIFTY_PERCENT, SEVENTY_FIVE_PERCENT);
        }

        /**
         * Отримати коефіцієнт зносу для розрахунку ціни.
         *
         * @param wearDegree Ступінь зносу у вигляді рядка (наприклад, "10%")
         * @return Коефіцієнт зносу як десяткове число (від 0 до 1)
         */
        public static double getWearFactor(String wearDegree) {
            Map<String, Double> factors = Map.of(
                    TEN_PERCENT, 0.1,
                    THIRTY_PERCENT, 0.3,
                    FIFTY_PERCENT, 0.5,
                    SEVENTY_FIVE_PERCENT, 0.75
            );

            return factors.getOrDefault(wearDegree, 0.0);
        }
    }



    /**
     * Категорії, для яких потрібно показувати секцію наповнювача.
     */
    public static final class FillerCategories {
        private FillerCategories() {
            // Приватний конструктор
        }

        // Ключові слова для категорій з наповнювачем
        private static final String[] FILLER_KEYWORDS = {
                "куртк", "пальт", "подушк", "ковдр", "жилет",
                "жакет", "пуховик", "парк", "плед", "одіял"
        };

        /**
         * Перевіряє чи потрібно показувати секцію наповнювача для категорії.
         *
         * @param categoryCode Код категорії
         * @return true, якщо потрібно показувати секцію наповнювача
         */
        public static boolean shouldShowFillerSection(String categoryCode) {
            if (categoryCode == null || categoryCode.trim().isEmpty()) {
                return false;
            }

            String category = categoryCode.toLowerCase();

            // Перевіряємо наявність ключових слів
            for (String keyword : FILLER_KEYWORDS) {
                if (category.contains(keyword)) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Отримати всі ключові слова для категорій з наповнювачем.
         *
         * @return Масив ключових слів
         */
        public static String[] getFillerKeywords() {
            return FILLER_KEYWORDS.clone();
        }
    }
}
