package com.aksi.domain.order.statemachine.stage4.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryDTO;
import com.aksi.domain.order.statemachine.stage4.dto.OrderSummaryPresentationDTO;
import com.aksi.domain.pricing.service.CurrencyFormattingService;

import lombok.RequiredArgsConstructor;

/**
 * Сервіс для форматування та презентації даних OrderSummary.
 * Винесена презентаційна логіка з DTO для дотримання SRP та DDD принципів.
 */
@Service
@RequiredArgsConstructor
public class OrderSummaryPresentationService {

    private final CurrencyFormattingService currencyFormatter;

    /**
     * Відформатована загальна вартість з валютою.
     */
    public String formatSubtotalAmount(BigDecimal amount) {
        return currencyFormatter.formatWithCurrency(amount);
    }

    /**
     * Відформатована фінальна сума з валютою.
     */
    public String formatFinalAmount(BigDecimal amount) {
        return currencyFormatter.formatWithCurrency(amount);
    }

    /**
     * Відформатована сума знижки з валютою.
     */
    public String formatDiscountAmount(BigDecimal amount) {
        return currencyFormatter.formatWithCurrency(amount);
    }

    /**
     * Відформатована сума надбавки з валютою.
     */
    public String formatExpediteAmount(BigDecimal amount) {
        return currencyFormatter.formatWithCurrency(amount);
    }

    /**
     * Відформатована сума передоплати з валютою.
     */
    public String formatPrepaymentAmount(BigDecimal amount) {
        return currencyFormatter.formatWithCurrency(amount);
    }

    /**
     * Відформатована сума боргу з валютою.
     */
    public String formatBalanceAmount(BigDecimal amount) {
        return currencyFormatter.formatWithCurrency(amount);
    }

    /**
     * Формує текстовий опис знижки з реальних enum значень.
     */
    public String formatDiscountDisplayText(OrderSummaryDTO summary) {
        if (!summary.hasDiscount()) {
            return "Без знижки";
        }

        StringBuilder sb = new StringBuilder();

        switch (summary.getDiscountType()) {
            case EVERCARD -> sb.append("Еверкард (").append(summary.getDiscountType().getDefaultPercentage()).append("%)");
            case SOCIAL_MEDIA -> sb.append("Соцмережі (").append(summary.getDiscountType().getDefaultPercentage()).append("%)");
            case MILITARY -> sb.append("ЗСУ (").append(summary.getDiscountType().getDefaultPercentage()).append("%)");
            case CUSTOM -> {
                sb.append("Інше");
                if (summary.getDiscountDescription() != null) {
                    sb.append(" - ").append(summary.getDiscountDescription());
                }
                if (summary.getDiscountPercentage() != null) {
                    sb.append(" (").append(summary.getDiscountPercentage()).append("%)");
                }
            }
            default -> sb.append("Знижка");
        }

        if (summary.getDiscountAmount() != null) {
            sb.append(" - ").append(formatDiscountAmount(summary.getDiscountAmount()));
        }

        return sb.toString();
    }

    /**
     * Формує текстовий опис надбавки за термінове виконання з реальних enum значень.
     */
    public String formatExpediteDisplayText(OrderSummaryDTO summary) {
        if (!summary.hasExpediteCharge()) {
            return "Звичайне виконання";
        }

        StringBuilder sb = new StringBuilder();

        switch (summary.getExpediteType()) {
            case EXPRESS_48H -> sb.append("Термінове за 48 год (+")
              .append(summary.getExpediteType().getSurchargePercentage())
              .append("%)");
            case EXPRESS_24H -> sb.append("Термінове за 24 год (+")
              .append(summary.getExpediteType().getSurchargePercentage())
              .append("%)");
            default -> {
                sb.append("Термінове виконання");
                if (summary.getExpeditePercentage() != null) {
                    sb.append(" (+").append(summary.getExpeditePercentage()).append("%)");
                }
            }
        }

        if (summary.getExpediteAmount() != null) {
            sb.append(" - ").append(currencyFormatter.formatDifferenceWithCurrency(summary.getExpediteAmount()));
        }

        return sb.toString();
    }

    /**
     * Символ валюти за замовчуванням для використання у фронтенді.
     */
    public String getCurrencySymbol() {
        return com.aksi.domain.pricing.constants.PricingConstants.DEFAULT_CURRENCY_SYMBOL;
    }

    /**
     * Комплексне форматування для повного відображення замовлення.
     */
    public OrderSummaryPresentationDTO formatFullSummary(OrderSummaryDTO summary) {
        return OrderSummaryPresentationDTO.builder()
            .formattedSubtotalAmount(formatSubtotalAmount(summary.getSubtotalAmount()))
            .formattedFinalAmount(formatFinalAmount(summary.getFinalAmount()))
            .formattedDiscountAmount(formatDiscountAmount(summary.getDiscountAmount()))
            .formattedExpediteAmount(formatExpediteAmount(summary.getExpediteAmount()))
            .formattedPrepaymentAmount(formatPrepaymentAmount(summary.getPrepaymentAmount()))
            .formattedBalanceAmount(formatBalanceAmount(summary.getBalanceAmount()))
            .discountDisplayText(formatDiscountDisplayText(summary))
            .expediteDisplayText(formatExpediteDisplayText(summary))
            .currencySymbol(getCurrencySymbol())
            .build();
    }
}
