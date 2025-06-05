package com.aksi.domain.order.statemachine.stage2.actions;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.OrderEvent;
import com.aksi.domain.order.statemachine.OrderState;
import com.aksi.domain.order.statemachine.stage2.dto.ItemStainDefectDTO;
import com.aksi.domain.order.statemachine.stage2.service.ItemStainDefectStepService;

/**
 * Actions для підетапу 2.3 "Забруднення, дефекти та ризики".
 *
 * Відповідає за обробку подій стану машини для підетапу забруднень, дефектів та ризиків предмета.
 */
@Component
public class ItemStainDefectActions {

    private static final Logger logger = LoggerFactory.getLogger(ItemStainDefectActions.class);
    private static final String WIZARD_ID_KEY = "wizardId";
    private static final String ITEM_STAIN_DEFECT_KEY = "itemStainDefect";
    private static final String STAIN_DEFECT_VALID_KEY = "stainDefectValid";

    private final ItemStainDefectStepService stainDefectService;

    public ItemStainDefectActions(ItemStainDefectStepService stainDefectService) {
        this.stainDefectService = stainDefectService;
    }

    /**
     * Action для входу в підетап 2.3.
     * Завантажує доступні плями, дефекти та попередньо заповнені дані.
     */
    public Action<OrderState, OrderEvent> loadStainDefectAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.info("Завантаження плям та дефектів предмета для wizard: {}", wizardId);

            try {
                // Завантажуємо дані плям та дефектів
                ItemStainDefectDTO dto = stainDefectService.loadStainDefectData(wizardId);

                // Якщо немає збережених даних, спробуємо завантажити контекст з попереднього кроку
                if (!dto.hasAvailableOptions() || dto.getCompletionPercentage() == 0) {
                    // Отримуємо дані з тимчасового предмета (підетапи 2.1, 2.2)
                    Object tempItemObj = context.getExtendedState().getVariables().get("tempOrderItem");
                    if (tempItemObj != null) {
                        // Реалізуємо логіку зливання даних з попереднього кроку
                        mergeDataFromPreviousStep(dto, tempItemObj);
                        logger.debug("Дані з попереднього кроку злиті для wizard: {}", wizardId);
                    }
                }

                // Зберігаємо DTO в контекст
                context.getExtendedState().getVariables().put(ITEM_STAIN_DEFECT_KEY, dto);

                logger.debug("Плями та дефекти успішно завантажено для wizard: {}", wizardId);

            } catch (Exception e) {
                logger.error("Помилка завантаження плям та дефектів для wizard {}: {}", wizardId, e.getMessage(), e);
                // Створюємо порожнє DTO з помилкою
                ItemStainDefectDTO errorDto = ItemStainDefectDTO.builder()
                        .hasErrors(true)
                        .errorMessage("Не вдалося завантажити плями та дефекти предмета")
                        .build();
                context.getExtendedState().getVariables().put(ITEM_STAIN_DEFECT_KEY, errorDto);
            }
        };
    }

    /**
     * Action для збереження плям та дефектів предмета.
     */
    public Action<OrderState, OrderEvent> saveStainDefectAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.info("Збереження плям та дефектів предмета для wizard: {}", wizardId);

            try {
                // Отримуємо DTO з контексту
                ItemStainDefectDTO dto = (ItemStainDefectDTO) context.getExtendedState()
                        .getVariables().get(ITEM_STAIN_DEFECT_KEY);

                if (dto == null) {
                    logger.warn("Не знайдено дані плям та дефектів для збереження в wizard: {}", wizardId);
                    return;
                }

                // Зберігаємо плями та дефекти
                ItemStainDefectDTO savedDto = stainDefectService.saveStainDefectData(wizardId, dto);

                // Оновлюємо контекст
                context.getExtendedState().getVariables().put(ITEM_STAIN_DEFECT_KEY, savedDto);

                logger.debug("Плями та дефекти успішно збережено для wizard: {}", wizardId);

            } catch (Exception e) {
                logger.error("Помилка збереження плям та дефектів для wizard {}: {}", wizardId, e.getMessage(), e);
            }
        };
    }

    /**
     * Action для валідації плям та дефектів перед переходом до наступного кроку.
     */
    public Action<OrderState, OrderEvent> validateStainDefectAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.info("Валідація плям та дефектів предмета для wizard: {}", wizardId);

            try {
                boolean canProceed = stainDefectService.canProceedToNextStep(wizardId);

                // Зберігаємо результат валідації в контекст
                context.getExtendedState().getVariables().put(STAIN_DEFECT_VALID_KEY, canProceed);

                if (canProceed) {
                    logger.debug("Валідація плям та дефектів пройшла успішно для wizard: {}", wizardId);
                } else {
                    logger.warn("Валідація плям та дефектів не пройшла для wizard: {}", wizardId);
                }

            } catch (Exception e) {
                logger.error("Помилка валідації плям та дефектів для wizard {}: {}", wizardId, e.getMessage(), e);
                context.getExtendedState().getVariables().put(STAIN_DEFECT_VALID_KEY, false);
            }
        };
    }

    /**
     * Action для скидання плям та дефектів.
     */
    public Action<OrderState, OrderEvent> resetStainDefectAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.info("Скидання плям та дефектів предмета для wizard: {}", wizardId);

            try {
                stainDefectService.resetStainDefectData(wizardId);

                // Очищуємо дані з контексту
                context.getExtendedState().getVariables().remove(ITEM_STAIN_DEFECT_KEY);
                context.getExtendedState().getVariables().remove(STAIN_DEFECT_VALID_KEY);

                logger.debug("Плями та дефекти успішно скинуто для wizard: {}", wizardId);

            } catch (Exception e) {
                logger.error("Помилка скидання плям та дефектів для wizard {}: {}", wizardId, e.getMessage(), e);
            }
        };
    }

    /**
     * Action для оновлення вибору плям.
     */
    public Action<OrderState, OrderEvent> updateStainsAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            @SuppressWarnings("unchecked")
            Set<String> selectedStains = (Set<String>) context.getExtendedState().getVariables().get("selectedStains");
            String customStainDescription = (String) context.getExtendedState().getVariables().get("customStainDescription");

            logger.debug("Оновлення плям для wizard: {}", wizardId);

            try {
                // Отримуємо поточні дані
                ItemStainDefectDTO dto = (ItemStainDefectDTO) context.getExtendedState()
                        .getVariables().get(ITEM_STAIN_DEFECT_KEY);

                if (dto != null) {
                    if (selectedStains != null) {
                        dto.setSelectedStains(selectedStains);
                    }
                    if (customStainDescription != null) {
                        dto.setCustomStainDescription(customStainDescription);
                    }
                    dto.clearErrors(); // Очищуємо помилки при зміні

                    // Зберігаємо оновлені дані
                    context.getExtendedState().getVariables().put(ITEM_STAIN_DEFECT_KEY, dto);
                }

            } catch (Exception e) {
                logger.error("Помилка оновлення плям для wizard {}: {}", wizardId, e.getMessage(), e);
            }
        };
    }

    /**
     * Action для оновлення вибору дефектів та ризиків.
     */
    public Action<OrderState, OrderEvent> updateDefectsAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            @SuppressWarnings("unchecked")
            Set<String> selectedDefects = (Set<String>) context.getExtendedState().getVariables().get("selectedDefects");
            String defectNotes = (String) context.getExtendedState().getVariables().get("defectNotes");
            String noGuaranteeReason = (String) context.getExtendedState().getVariables().get("noGuaranteeReason");

            logger.debug("Оновлення дефектів та ризиків для wizard: {}", wizardId);

            try {
                // Отримуємо поточні дані
                ItemStainDefectDTO dto = (ItemStainDefectDTO) context.getExtendedState()
                        .getVariables().get(ITEM_STAIN_DEFECT_KEY);

                if (dto != null) {
                    if (selectedDefects != null) {
                        dto.setSelectedDefectsAndRisks(selectedDefects);
                    }
                    if (defectNotes != null) {
                        dto.setDefectNotes(defectNotes);
                    }
                    if (noGuaranteeReason != null) {
                        dto.setNoGuaranteeReason(noGuaranteeReason);
                    }
                    dto.clearErrors(); // Очищуємо помилки при зміні

                    // Зберігаємо оновлені дані
                    context.getExtendedState().getVariables().put(ITEM_STAIN_DEFECT_KEY, dto);
                }

            } catch (Exception e) {
                logger.error("Помилка оновлення дефектів та ризиків для wizard {}: {}", wizardId, e.getMessage(), e);
            }
        };
    }

    /**
     * Action для детектування критичних ризиків.
     * Викликається при оновленні дефектів для перевірки наявності критичних ризиків.
     */
    public Action<OrderState, OrderEvent> detectCriticalRisksAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.debug("Детектування критичних ризиків для wizard: {}", wizardId);

            try {
                // Отримуємо поточні дані
                ItemStainDefectDTO dto = (ItemStainDefectDTO) context.getExtendedState()
                        .getVariables().get(ITEM_STAIN_DEFECT_KEY);

                if (dto != null && dto.getSelectedDefectsAndRisks() != null) {
                    boolean hasCriticalRisks = dto.getSelectedDefectsAndRisks().contains("Ризики зміни кольору") ||
                                            dto.getSelectedDefectsAndRisks().contains("Ризики деформації") ||
                                            dto.getSelectedDefectsAndRisks().contains("Без гарантій");

                    // Зберігаємо інформацію про критичні ризики в контекст
                    context.getExtendedState().getVariables().put("hasCriticalRisks", hasCriticalRisks);

                    if (hasCriticalRisks) {
                        logger.info("Виявлено критичні ризики для wizard: {}", wizardId);
                    }
                }

            } catch (Exception e) {
                logger.error("Помилка детектування критичних ризиків для wizard {}: {}", wizardId, e.getMessage(), e);
            }
        };
    }

    /**
     * Action для автоматичного збереження при зміні плям або дефектів.
     */
    public Action<OrderState, OrderEvent> autoSaveStainDefectAction() {
        return context -> {
            String wizardId = (String) context.getExtendedState().getVariables().get(WIZARD_ID_KEY);
            logger.debug("Автоматичне збереження плям та дефектів для wizard: {}", wizardId);

            try {
                // Отримуємо поточні дані
                ItemStainDefectDTO dto = (ItemStainDefectDTO) context.getExtendedState()
                        .getVariables().get(ITEM_STAIN_DEFECT_KEY);

                if (dto != null) {
                    // Автоматично зберігаємо зміни
                    stainDefectService.saveStainDefectData(wizardId, dto);
                    logger.debug("Автоматичне збереження успішно виконано для wizard: {}", wizardId);
                }

            } catch (Exception e) {
                logger.warn("Помилка автоматичного збереження для wizard {}: {}", wizardId, e.getMessage());
                // Не кидаємо виключення для автоматичного збереження
            }
        };
    }

    /**
     * Допоміжний метод для злиття даних з попереднього кроку.
     * Використовується для передачі контексту між підетапами.
     *
     * @param current поточні дані плям та дефектів
     * @param tempItem дані тимчасового предмета з попередніх кроків
     */
        private void mergeDataFromPreviousStep(ItemStainDefectDTO current, Object tempItem) {
        try {
            if (tempItem instanceof com.aksi.domain.order.statemachine.stage2.dto.TempOrderItemDTO tempOrderItem) {
                logger.debug("Зливання даних TempOrderItemDTO в ItemStainDefectDTO");

                // 1. Попереднє заповнення плям з попереднього кроку
                if (tempOrderItem.getStains() != null && !tempOrderItem.getStains().trim().isEmpty()) {
                    logger.info("Знайдено попередні дані про плями: {}", tempOrderItem.getStains());
                    // Можна додати логіку парсингу та заповнення selectedStains
                }

                // 2. Попереднє заповнення дефектів з попереднього кроку
                if (tempOrderItem.getDefectsAndRisks() != null && !tempOrderItem.getDefectsAndRisks().trim().isEmpty()) {
                    logger.info("Знайдено попередні дані про дефекти: {}", tempOrderItem.getDefectsAndRisks());
                    // Можна додати логіку парсингу та заповнення selectedDefectsAndRisks
                }

                // 3. Особливості на основі матеріалу
                if (tempOrderItem.getMaterial() != null) {
                    logMaterialSpecificInfo(tempOrderItem.getMaterial());
                }

                // 4. Особливості на основі категорії
                if (tempOrderItem.getCategory() != null) {
                    logCategorySpecificInfo(tempOrderItem.getCategory());
                }

                // 5. Попереднє заповнення примітки дефектів якщо є
                if (tempOrderItem.getDefectsNotes() != null && !tempOrderItem.getDefectsNotes().trim().isEmpty()) {
                    current.setDefectNotes(tempOrderItem.getDefectsNotes());
                    logger.debug("Перенесено примітки дефектів з попереднього кроку");
                }

                // 6. Попереднє заповнення причини відсутності гарантій
                if (tempOrderItem.getNoGuaranteeReason() != null && !tempOrderItem.getNoGuaranteeReason().trim().isEmpty()) {
                    current.setNoGuaranteeReason(tempOrderItem.getNoGuaranteeReason());
                    current.setShowNoGuaranteeReasonField(true);
                    logger.debug("Перенесено причину відсутності гарантій з попереднього кроку");
                }

                logger.debug("Злиття даних з TempOrderItemDTO завершено успішно");

            } else if (tempItem != null) {
                logger.warn("Невідомий тип tempItem для злиття: {}", tempItem.getClass().getSimpleName());
            } else {
                logger.debug("tempItem є null, пропускаємо злиття даних");
            }
        } catch (Exception e) {
            logger.error("Помилка злиття даних з попереднього кроку: {}", e.getMessage(), e);
        }
    }

    /**
     * Логування специфічних для матеріалу рекомендацій.
     */
    private void logMaterialSpecificInfo(String material) {
        switch (material.toLowerCase()) {
            case "шерсть" -> logger.info("Шерстяні вироби: особлива увага до деформацій та усадки");
            case "шовк" -> logger.info("Шовкові вироби: дуже делікатні, висока імовірність ризиків");
            case "шкіра", "нубук", "замша" -> logger.info("Шкіряні вироби: особливі вимоги до обробки плям та дефектів");
            case "синтетика" -> logger.info("Синтетичні матеріали: зазвичай менше ризиків");
        }
    }

    /**
     * Логування специфічних для категорії рекомендацій.
     */
    private void logCategorySpecificInfo(String category) {
        switch (category.toLowerCase()) {
            case "чистка та відновлення шкіряних виробів", "дублянки" ->
                logger.info("Шкіряні послуги: важливо документувати всі дефекти");
            case "вироби із натурального хутра" ->
                logger.info("Хутряні вироби: особлива увага до стану хутра");
            case "фарбування текстильних виробів" ->
                logger.info("Фарбування: критично важливо зазначити всі плями");
        }
    }
}
