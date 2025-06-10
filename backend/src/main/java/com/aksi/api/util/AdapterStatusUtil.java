package com.aksi.api.util;

import org.springframework.stereotype.Component;

import com.aksi.domain.order.statemachine.adapter.OrderWizardAdapter;
import com.aksi.domain.order.statemachine.stage1.adapter.BasicOrderInfoAdapter;
import com.aksi.domain.order.statemachine.stage1.adapter.ClientSearchAdapter;
import com.aksi.domain.order.statemachine.stage1.adapter.NewClientFormAdapter;
import com.aksi.domain.order.statemachine.stage2.adapter.Stage2StateMachineAdapter;
import com.aksi.domain.order.statemachine.stage2.substep1.adapter.ItemBasicInfoAdapter;
import com.aksi.domain.order.statemachine.stage2.substep2.adapter.ItemCharacteristicsStateMachineAdapter;
import com.aksi.domain.order.statemachine.stage2.substep3.adapter.StainsDefectsAdapter;
import com.aksi.domain.order.statemachine.stage2.substep4.adapter.PriceDiscountAdapter;
import com.aksi.domain.order.statemachine.stage2.substep5.adapter.PhotoDocumentationAdapter;
import com.aksi.domain.order.statemachine.stage3.adapter.Stage3StateMachineAdapter;
import com.aksi.domain.order.statemachine.stage4.adapter.Stage4StateMachineAdapter;

/**
 * Utility клас для роботи зі статусами адаптерів Order Wizard.
 *
 * Дотримуємось принципу Single Responsibility - цей клас відповідає тільки
 * за перевірку статусів та підрахунок адаптерів.
 */
@Component
public class AdapterStatusUtil {

    /**
     * Перевіряє чи всі адаптери готові до роботи
     */
    public boolean areAllAdaptersReady(
            OrderWizardAdapter orderWizardAdapter,
            ClientSearchAdapter clientSearchAdapter,
            NewClientFormAdapter newClientFormAdapter,
            BasicOrderInfoAdapter basicOrderInfoAdapter,
            Stage2StateMachineAdapter stage2Adapter,
            ItemBasicInfoAdapter itemBasicInfoAdapter,
            ItemCharacteristicsStateMachineAdapter itemCharacteristicsAdapter,
            StainsDefectsAdapter stainsDefectsAdapter,
            PriceDiscountAdapter priceDiscountAdapter,
            PhotoDocumentationAdapter photoDocumentationAdapter,
            Stage3StateMachineAdapter stage3Adapter,
            Stage4StateMachineAdapter stage4Adapter) {

        return orderWizardAdapter != null &&
               clientSearchAdapter != null &&
               newClientFormAdapter != null &&
               basicOrderInfoAdapter != null &&
               stage2Adapter != null &&
               itemBasicInfoAdapter != null &&
               itemCharacteristicsAdapter != null &&
               stainsDefectsAdapter != null &&
               priceDiscountAdapter != null &&
               photoDocumentationAdapter != null &&
               stage3Adapter != null &&
               stage4Adapter != null;
    }

    /**
     * Підраховує загальну кількість готових адаптерів
     */
    public int countReadyAdapters(
            OrderWizardAdapter orderWizardAdapter,
            ClientSearchAdapter clientSearchAdapter,
            NewClientFormAdapter newClientFormAdapter,
            BasicOrderInfoAdapter basicOrderInfoAdapter,
            Stage2StateMachineAdapter stage2Adapter,
            ItemBasicInfoAdapter itemBasicInfoAdapter,
            ItemCharacteristicsStateMachineAdapter itemCharacteristicsAdapter,
            StainsDefectsAdapter stainsDefectsAdapter,
            PriceDiscountAdapter priceDiscountAdapter,
            PhotoDocumentationAdapter photoDocumentationAdapter,
            Stage3StateMachineAdapter stage3Adapter,
            Stage4StateMachineAdapter stage4Adapter) {

        int count = 0;
        if (orderWizardAdapter != null) count++;
        if (clientSearchAdapter != null) count++;
        if (newClientFormAdapter != null) count++;
        if (basicOrderInfoAdapter != null) count++;
        if (stage2Adapter != null) count++;
        if (itemBasicInfoAdapter != null) count++;
        if (itemCharacteristicsAdapter != null) count++;
        if (stainsDefectsAdapter != null) count++;
        if (priceDiscountAdapter != null) count++;
        if (photoDocumentationAdapter != null) count++;
        if (stage3Adapter != null) count++;
        if (stage4Adapter != null) count++;
        return count;
    }

    /**
     * Статус конкретного етапу з деталями
     */
    public static class StageStatus {
        public final String status;
        public final int adaptersCount;
        public final String description;
        public final boolean isReady;

        public StageStatus(String status, int adaptersCount, String description, boolean isReady) {
            this.status = status;
            this.adaptersCount = adaptersCount;
            this.description = description;
            this.isReady = isReady;
        }
    }

    /**
     * Отримує статус конкретного етапу
     */
    public StageStatus getStageStatus(int stageNumber, Object... adapters) {
        return switch (stageNumber) {
            case 0 -> { // Основний адаптер
                boolean mainReady = adapters.length > 0 && adapters[0] != null;
                yield new StageStatus(
                    mainReady ? "✅ Готовий" : "❌ Не готовий",
                    mainReady ? 1 : 0,
                    "OrderWizardAdapter - основний контролер",
                    mainReady
                );
            }
            case 1 -> { // Stage 1
                int stage1Count = 0;
                for (int i = 1; i <= 3 && i < adapters.length; i++) {
                    if (adapters[i] != null) stage1Count++;
                }
                yield new StageStatus(
                    stage1Count == 3 ? "✅ Готовий" : "⚠️ Частково готовий",
                    stage1Count,
                    "ClientSearch, NewClientForm, BasicOrderInfo",
                    stage1Count == 3
                );
            }
            case 2 -> { // Stage 2
                int stage2Count = 0;
                for (int i = 4; i <= 9 && i < adapters.length; i++) {
                    if (adapters[i] != null) stage2Count++;
                }
                yield new StageStatus(
                    stage2Count == 6 ? "✅ Готовий" : "⚠️ Частково готовий",
                    stage2Count,
                    "Головний + 5 підетапів - всі адаптери",
                    stage2Count == 6
                );
            }
            case 3 -> { // Stage 3
                boolean stage3Ready = adapters.length > 10 && adapters[10] != null;
                yield new StageStatus(
                    stage3Ready ? "✅ Готовий" : "❌ Не готовий",
                    stage3Ready ? 1 : 0,
                    "Параметри виконання, знижки, оплата",
                    stage3Ready
                );
            }
            case 4 -> { // Stage 4
                boolean stage4Ready = adapters.length > 11 && adapters[11] != null;
                yield new StageStatus(
                    stage4Ready ? "✅ Готовий" : "❌ Не готовий",
                    stage4Ready ? 1 : 0,
                    "Підтвердження, квитанція",
                    stage4Ready
                );
            }
            default -> new StageStatus("❌ Невідомий етап", 0, "Етап не знайдено", false);
        };
    }

    /**
     * Константи для підрахунку адаптерів
     */
    public static final int TOTAL_ADAPTERS = 12;
    public static final int TOTAL_STAGES = 4;
}
