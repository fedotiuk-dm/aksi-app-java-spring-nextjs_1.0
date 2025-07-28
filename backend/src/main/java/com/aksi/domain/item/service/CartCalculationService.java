package com.aksi.domain.item.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.item.dto.AppliedModifierResponse;
import com.aksi.api.item.dto.CalculateOrderSummaryRequest;
import com.aksi.api.item.dto.DiscountDetailsResponse;
import com.aksi.api.item.dto.GlobalDiscountRequest;
import com.aksi.api.item.dto.ItemCalculationRequest;
import com.aksi.api.item.dto.ItemCalculationResponse;
import com.aksi.api.item.dto.ItemPricePreviewResponse;
import com.aksi.api.item.dto.OrderSummaryResponse;
import com.aksi.api.item.dto.OrderSummaryResponseSummary;
import com.aksi.api.item.dto.PriceBreakdownItem;
import com.aksi.domain.item.constant.ItemConstants;
import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.enums.UrgencyType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for calculating cart totals and item price previews. */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartCalculationService {

  private final ItemCalculationService itemCalculationService;
  private final PriceListItemService priceListItemService;
  private final ServiceCategoryBusinessRules categoryBusinessRules;

  /**
   * Calculate cart summary with global discount and urgency. This is used for temporary
   * calculations before creating final order.
   *
   * @param request cart calculation request
   * @return cart summary response
   */
  public OrderSummaryResponse calculateCartSummary(CalculateOrderSummaryRequest request) {
    log.debug("Calculating cart summary for {} items", request.getItems().size());

    // Calculate each item
    List<ItemCalculationResponse> itemCalculations =
        itemCalculationService.calculateMultipleItems(request.getItems());

    // Calculate subtotal (sum of all items)
    double subtotal =
        itemCalculations.stream().mapToDouble(ItemCalculationResponse::getFinalPrice).sum();

    // Apply urgency surcharge if provided
    double urgencySurcharge = 0.0;
    if (request.getUrgencyType() != null) {
      UrgencyType domainUrgency = UrgencyType.fromApiUrgency(request.getUrgencyType());
      urgencySurcharge =
          calculateUrgencySurcharge(BigDecimal.valueOf(subtotal), domainUrgency).doubleValue();
      log.debug("Applied urgency surcharge: {} for type: {}", urgencySurcharge, domainUrgency);
    }

    // Apply global discount if provided (with business rules validation)
    DiscountDetailsResponse discountDetails = null;
    double discountAmount = 0.0;
    if (request.getGlobalDiscount() != null) {
      GlobalDiscountRequest globalDiscount = request.getGlobalDiscount();
      if (globalDiscount.getValue() != null && globalDiscount.getValue() > 0) {
        // Calculate discount only for eligible items according to business rules
        double discountableAmount = 0.0;
        int applicableItemsCount = 0;
        
        for (int i = 0; i < itemCalculations.size(); i++) {
          ItemCalculationResponse itemCalc = itemCalculations.get(i);
          ItemCalculationRequest itemReq = request.getItems().get(i);
          
          // Get the price list item to check category
          PriceListItemEntity priceListItem = 
              priceListItemService.getPriceListItemEntityById(itemReq.getPriceListItemId());
          
          // Check if discount is applicable to this category using business rules
          if (categoryBusinessRules.isDiscountApplicable(priceListItem.getCategory().getCode())) {
            discountableAmount += itemCalc.getFinalPrice();
            applicableItemsCount++;
          } else {
            log.debug("Discount not applicable to item: {} in category: {}", 
                priceListItem.getName(), priceListItem.getCategory().getCode());
          }
        }
        
        discountAmount = discountableAmount * (globalDiscount.getValue() / 100);

        discountDetails = new DiscountDetailsResponse();
        discountDetails.setType(globalDiscount.getType().getValue());
        discountDetails.setPercentage(globalDiscount.getValue());
        discountDetails.setAmount(discountAmount);
        discountDetails.setApplicableItems(applicableItemsCount);

        // Log discount info
        log.debug("Applied discount: {}% = {} to {} out of {} items (discountable amount: {})", 
            globalDiscount.getValue(), discountAmount, applicableItemsCount, 
            itemCalculations.size(), discountableAmount);
      }
    }

    // Calculate total amount
    double totalAmount = subtotal + urgencySurcharge - discountAmount;

    // Create summary statistics
    OrderSummaryResponseSummary summary = new OrderSummaryResponseSummary();
    summary.setTotalItems(itemCalculations.size());
    summary.setTotalQuantity(
        itemCalculations.stream().mapToDouble(ItemCalculationResponse::getQuantity).sum());
    summary.setAverageItemPrice(
        itemCalculations.isEmpty() ? 0.0 : subtotal / itemCalculations.size());

    // Build response
    OrderSummaryResponse response = new OrderSummaryResponse();
    response.setItems(itemCalculations);
    response.setSubtotal(subtotal);
    response.setDiscount(discountDetails);
    response.setUrgencySurcharge(urgencySurcharge);
    response.setTotalAmount(totalAmount);
    response.setSummary(summary);

    // Calculate estimated completion date based on urgency and item categories
    if (request.getUrgencyType() != null) {
      UrgencyType domainUrgency = UrgencyType.fromApiUrgency(request.getUrgencyType());
      Instant estimatedDate = calculateEstimatedCompletionDate(domainUrgency, request.getItems());
      response.setEstimatedCompletionDate(estimatedDate);
    } else {
      // Calculate based on standard execution days for categories
      Instant estimatedDate = calculateEstimatedCompletionDate(null, request.getItems());
      response.setEstimatedCompletionDate(estimatedDate);
    }

    log.debug("Cart summary calculated: subtotal={}, total={}", subtotal, totalAmount);
    return response;
  }

  /**
   * Preview item price for interactive calculator. Used in cart UI for real-time price updates.
   *
   * @param request calculation request
   * @return preview response
   */
  public ItemPricePreviewResponse previewItemPrice(ItemCalculationRequest request) {
    log.debug("Previewing item price for item: {}", request.getPriceListItemId());

    // Use existing calculation logic
    ItemCalculationResponse fullCalculation = itemCalculationService.calculateItemPrice(request);

    // Create preview response
    ItemPricePreviewResponse preview = new ItemPricePreviewResponse();
    preview.setBasePrice(fullCalculation.getBasePrice());
    preview.setColorPrice(fullCalculation.getColorPrice());
    preview.setFinalPrice(fullCalculation.getFinalPrice());

    // Convert applied modifiers to price breakdown
    List<PriceBreakdownItem> breakdown = new ArrayList<>();

    // Add base price
    PriceBreakdownItem baseItem = new PriceBreakdownItem();
    baseItem.setType(PriceBreakdownItem.TypeEnum.BASE);
    baseItem.setLabel("Базова ціна");
    baseItem.setAmount(fullCalculation.getBasePrice());
    breakdown.add(baseItem);

    // Add modifiers if any
    if (fullCalculation.getAppliedModifiers() != null) {
      for (AppliedModifierResponse modifier : fullCalculation.getAppliedModifiers()) {
        PriceBreakdownItem modifierItem = new PriceBreakdownItem();
        modifierItem.setType(PriceBreakdownItem.TypeEnum.MODIFIER);
        modifierItem.setLabel(modifier.getName());
        modifierItem.setAmount(Math.abs(modifier.getImpact()));
        if (modifier.getType() == com.aksi.api.item.dto.ModifierType.PERCENTAGE) {
          modifierItem.setPercentage(
              modifier.getImpact() < 0 ? -modifier.getValue() : modifier.getValue());
        }
        breakdown.add(modifierItem);
      }
    }

    preview.setPriceBreakdown(breakdown);

    // Add warnings if any
    if (fullCalculation.getWarnings() != null) {
      preview.setWarnings(fullCalculation.getWarnings());
    }

    log.debug(
        "Preview calculated: base={}, final={}", preview.getBasePrice(), preview.getFinalPrice());
    return preview;
  }

  /** Calculate urgency surcharge based on urgency type */
  private BigDecimal calculateUrgencySurcharge(BigDecimal amount, UrgencyType urgencyType) {
    // Use price multiplier from enum and subtract 1 to get surcharge rate
    // For example: URGENT_48H has multiplier 1.5, so surcharge is 0.5 (50%)
    BigDecimal surchargeRate = urgencyType.getPriceMultiplier().subtract(BigDecimal.ONE);

    return amount
        .multiply(surchargeRate)
        .setScale(ItemConstants.PRICE_SCALE, java.math.RoundingMode.HALF_UP);
  }

  /** 
   * Calculate estimated completion date based on urgency type and item categories using business rules.
   * If urgency is provided, use urgency-based calculation, otherwise use standard execution days from categories.
   */
  private Instant calculateEstimatedCompletionDate(UrgencyType urgencyType, List<ItemCalculationRequest> items) {
    if (urgencyType != null) {
      // Use urgency-based calculation
      return Instant.now().plus(urgencyType.getHoursToComplete(), ChronoUnit.HOURS);
    }
    
    // Calculate based on standard execution days for categories
    int maxExecutionDays = 2; // default
    
    for (ItemCalculationRequest item : items) {
      PriceListItemEntity priceListItem = 
          priceListItemService.getPriceListItemEntityById(item.getPriceListItemId());
      
      // Use business rules to get standard execution days for category
      int categoryExecutionDays = 
          categoryBusinessRules.getStandardExecutionDays(priceListItem.getCategory().getCode());
      
      // Take the maximum execution days from all categories
      if (categoryExecutionDays > maxExecutionDays) {
        maxExecutionDays = categoryExecutionDays;
        log.debug("Updated max execution days to {} for category: {}", 
            categoryExecutionDays, priceListItem.getCategory().getCode());
      }
    }
    
    log.debug("Calculated estimated completion in {} days based on item categories", maxExecutionDays);
    return Instant.now().plus(maxExecutionDays, ChronoUnit.DAYS);
  }
}
