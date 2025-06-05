package com.aksi.domain.order.statemachine.service;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Основний координуючий сервіс для Order Wizard.
 * Реалізує pattern "Facade" для спрощення взаємодії з етапами.
 * Делегує всю логіку до відповідних Stage*DataMergeService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderWizardDataMergeService {

    private final Stage1DataMergeService stage1Service;
    private final Stage2DataMergeService stage2Service;
    private final Stage3DataMergeService stage3Service;
    private final Stage4DataMergeService stage4Service;

    /**
     * === ВАЛІДАЦІЯ ЕТАПІВ ===
     */

    /**
     * Перевірити готовність переходу на наступний етап.
     */
    public boolean canProceedToStage(Map<String, Object> contextVariables, int targetStage) {
        return switch (targetStage) {
            case 1 -> true; // Завжди можна почати
            case 2 -> stage1Service.isStage1Complete(contextVariables);
            case 3 -> stage2Service.isStage2Complete(contextVariables);
            case 4 -> stage3Service.isStage3Complete(contextVariables);
            default -> {
                log.warn("Невідомий етап: {}", targetStage);
                yield false;
            }
        };
    }

    /**
     * Перевірити чи всі етапи завершені.
     */
    public boolean isWizardComplete(Map<String, Object> contextVariables) {
        return stage1Service.isStage1Complete(contextVariables) &&
               stage2Service.isStage2Complete(contextVariables) &&
               stage3Service.isStage3Complete(contextVariables) &&
               stage4Service.isStage4Complete(contextVariables);
    }

    /**
     * === ПЕРЕХОДИ МІЖ ЕТАПАМИ ===
     */

    /**
     * Перейти з етапу 2 на етап 3 (злити суму предметів в оплату).
     */
    public boolean proceedStage2ToStage3(Map<String, Object> contextVariables) {
        if (!stage2Service.isStage2Complete(contextVariables)) {
            return false;
        }

        // Передаємо загальну суму предметів в етап 3
        BigDecimal itemsAmount = stage2Service.calculateTotalAmount(contextVariables);
        var payment = stage3Service.loadOrderPayment(contextVariables);
        var updatedPayment = stage3Service.mergeStage2AmountToPayment(contextVariables, itemsAmount, payment);
        stage3Service.saveOrderPayment(contextVariables, updatedPayment);

        log.debug("Перехід 2->3: передано суму {}", itemsAmount);
        return true;
    }

    /**
     * Перейти з етапу 3 на етап 4 (створити підсумок).
     */
    public boolean proceedStage3ToStage4(Map<String, Object> contextVariables) {
        if (!stage3Service.isStage3Complete(contextVariables)) {
            return false;
        }

        var orderSummary = stage4Service.createOrderSummary(contextVariables,
                                                            stage1Service, stage2Service, stage3Service);
        if (orderSummary != null) {
            stage4Service.saveOrderSummary(contextVariables, orderSummary);
            log.debug("Перехід 3->4: створено підсумок");
            return true;
        }

        log.error("Помилка створення підсумку при переході на етап 4");
        return false;
    }

    /**
     * === УПРАВЛІННЯ ДАНИМИ ===
     */

    /**
     * Очистити всі дані візарда.
     */
    public void clearAllData(Map<String, Object> contextVariables) {
        stage1Service.clearStage1Data(contextVariables);
        stage2Service.clearStage2Data(contextVariables);
        stage3Service.clearStage3Data(contextVariables);
        stage4Service.clearStage4Data(contextVariables);

        log.info("Всі дані Order Wizard очищено");
    }

    /**
     * Скинути візард до певного етапу.
     */
    public void resetToStage(Map<String, Object> contextVariables, int targetStage) {
        if (targetStage < 2) stage2Service.clearStage2Data(contextVariables);
        if (targetStage < 3) stage3Service.clearStage3Data(contextVariables);
        if (targetStage < 4) stage4Service.clearStage4Data(contextVariables);

        log.info("Візард скинуто до етапу {}", targetStage);
    }

    /**
     * === СТАТИСТИКА ===
     */

    /**
     * Отримати загальну статистику візарда.
     */
    public WizardStatistics getStatistics(Map<String, Object> contextVariables) {
        var stage2Stats = stage2Service.getItemsStatistics(contextVariables);

        // Підрахунок прогресу (25% на етап)
        int progress = 0;
        if (stage1Service.isStage1Complete(contextVariables)) progress += 25;
        if (stage2Service.isStage2Complete(contextVariables)) progress += 25;
        if (stage3Service.isStage3Complete(contextVariables)) progress += 25;
        if (stage4Service.isStage4Complete(contextVariables)) progress += 25;

        return new WizardStatistics(
            progress,
            stage2Stats.totalItems(),
            stage2Stats.totalAmount(),
            isWizardComplete(contextVariables)
        );
    }

    /**
     * === ПРЯМИЙ ДОСТУП ДО ЕТАПІВ (для Action класів) ===
     */

    public Stage1DataMergeService getStage1Service() { return stage1Service; }
    public Stage2DataMergeService getStage2Service() { return stage2Service; }
    public Stage3DataMergeService getStage3Service() { return stage3Service; }
    public Stage4DataMergeService getStage4Service() { return stage4Service; }

    /**
     * === ДОПОМІЖНІ КЛАСИ ===
     */

    /**
     * Статистика візарда.
     */
    public record WizardStatistics(
        int progressPercentage,
        int totalItems,
        BigDecimal totalAmount,
        boolean isCompleted
    ) {}
}
