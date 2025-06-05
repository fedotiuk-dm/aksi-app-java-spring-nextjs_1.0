package com.aksi.domain.order.statemachine.stage4.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO для презентаційного відображення даних OrderSummary.
 * Містить відформатовані рядки замість сирих даних для прямого використання в UI.
 */
@Data
@Builder
public class OrderSummaryPresentationDTO {

    /**
     * Відформатована загальна вартість з валютою.
     */
    private String formattedSubtotalAmount;

    /**
     * Відформатована фінальна сума з валютою.
     */
    private String formattedFinalAmount;

    /**
     * Відформатована сума знижки з валютою.
     */
    private String formattedDiscountAmount;

    /**
     * Відформатована сума надбавки з валютою.
     */
    private String formattedExpediteAmount;

    /**
     * Відформатована сума передоплати з валютою.
     */
    private String formattedPrepaymentAmount;

    /**
     * Відформатована сума боргу з валютою.
     */
    private String formattedBalanceAmount;

    /**
     * Текстовий опис знижки.
     */
    private String discountDisplayText;

    /**
     * Текстовий опис надбавки за терміновість.
     */
    private String expediteDisplayText;

    /**
     * Символ валюти.
     */
    private String currencySymbol;
}
