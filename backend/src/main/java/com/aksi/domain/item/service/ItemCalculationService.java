package com.aksi.domain.item.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.item.dto.CalculateOrderSummaryRequest;
import com.aksi.api.item.dto.CalculationStep;
import com.aksi.api.item.dto.ItemCalculationRequest;
import com.aksi.api.item.dto.ItemCalculationResponse;
import com.aksi.api.item.dto.ItemPricePreviewResponse;
import com.aksi.api.item.dto.OrderSummaryResponse;
import com.aksi.api.item.dto.UrgencyType;
import com.aksi.domain.item.calculator.CalculationResult;
import com.aksi.domain.item.calculator.JexlCalculator;
import com.aksi.domain.item.calculator.SimpleCalculator;
import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.exception.ItemCalculationException;
import com.aksi.domain.item.exception.PriceListItemNotFoundException;
import com.aksi.domain.item.repository.PriceListItemRepository;
import com.aksi.domain.item.repository.PriceModifierRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * CLEAN ARCHITECTURE - Сервіс розрахунку цін з новою calculator архітектурою
 *
 * <p>SMART ENGINE: - 90% випадків: SimpleCalculator (% та фіксовані суми) - 10% випадків:
 * JexlCalculator (складні JEXL правила).
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ItemCalculationService {

  private final PriceListItemRepository priceListItemRepository;
  private final PriceModifierRepository priceModifierRepository;

  // НОВІ ЧИСТІ КАЛЬКУЛЯТОРИ
  private final SimpleCalculator simpleCalculator;
  private final JexlCalculator jexlCalculator;

  // ===== ОСНОВНІ API МЕТОДИ =====

  public ItemCalculationResponse calculateItemPrice(ItemCalculationRequest request) {
    log.debug("Clean calculating item price for: {}", request.getPriceListItemId());

    try {
      // 1. Отримати предмет з прайс-листа
      PriceListItemEntity priceListItem = findPriceListItem(request.getPriceListItemId());

      // 2. Розрахувати базову ціну з урахуванням кольору
      Double basePrice = calculateBasePriceWithColor(priceListItem, request);

      // 3. Отримати модифікатори
      List<PriceModifierEntity> modifiers = findApplicableModifiers(request);

      // 4. SMART ENGINE - вибір калькулятора
      CalculationResult result = calculateSmart(basePrice, modifiers);

      // 4. Терміновість
      Double urgencyCharge = calculateUrgencyCharge(result.getFinalPrice(), request.getUrgency());
      Double finalPrice = result.getFinalPrice() + urgencyCharge;

      // 5. Конвертувати в DTO response
      return convertToItemCalculationResponse(
          request, priceListItem, result, urgencyCharge, finalPrice);

    } catch (Exception e) {
      log.error(
          "Error calculating item price for {}: {}", request.getPriceListItemId(), e.getMessage());
      throw new ItemCalculationException("Помилка розрахунку ціни предмета", e);
    }
  }

  public ItemPricePreviewResponse previewItemPrice(ItemCalculationRequest request) {
    log.debug("Previewing item price for: {}", request.getPriceListItemId());

    // Отримати предмет з прайс-листа
    PriceListItemEntity priceListItem = findPriceListItem(request.getPriceListItemId());

    // Розрахувати базову ціну * кількість
    Double basePrice = priceListItem.getBasePrice();
    Integer quantity = request.getQuantity();
    Double estimatedPrice = basePrice * quantity;

    // Конвертувати у DTO
    var response = new ItemPricePreviewResponse();
    response.setBasePrice(basePrice);
    response.setTotalBasePrice(basePrice * quantity);
    response.setModifiersAmount(0.0); // Поки що без модифікаторів у preview
    response.setSubtotal(estimatedPrice);
    response.setUrgencyAmount(0.0); // Розрахуємо пізніше
    response.setFinalPrice(roundPrice(estimatedPrice));

    return response;
  }

  public OrderSummaryResponse calculateOrderSummary(CalculateOrderSummaryRequest request) {
    log.debug("Calculating order summary for {} items", request.getItems().size());

    // Розраховуємо кожен предмет окремо
    List<ItemCalculationResponse> itemCalculations =
        request.getItems().stream().map(this::calculateItemPrice).toList();

    // Розрахувати загальну суму предметів
    Double itemsTotal =
        itemCalculations.stream().mapToDouble(ItemCalculationResponse::getFinalPrice).sum();

    // Розрахувати доплату за терміновість
    Double urgencyCharge = calculateUrgencyCharge(itemsTotal, request.getUrgency());

    Double subtotal = itemsTotal + urgencyCharge;

    // Розрахувати знижку
    Double discountAmount = calculateDiscountAmount(itemCalculations, request.getDiscount());

    Double finalTotal = subtotal - discountAmount;

    // Створити response
    var response = new OrderSummaryResponse();
    response.setItemCalculations(itemCalculations);
    response.setItemsTotal(roundPrice(itemsTotal));
    response.setUrgencyCharge(roundPrice(urgencyCharge));
    response.setDiscountAmount(roundPrice(discountAmount));
    response.setFinalTotal(roundPrice(finalTotal));

    return response;
  }

  // ===== SMART ENGINE ЛОГІКА =====

  /** SMART ENGINE - розумний вибір калькулятора. */
  private CalculationResult calculateSmart(Double basePrice, List<PriceModifierEntity> modifiers) {

    // Розділити модифікатори на прості та складні
    List<PriceModifierEntity> simpleModifiers = new ArrayList<>();
    List<PriceModifierEntity> jexlModifiers = new ArrayList<>();

    for (PriceModifierEntity modifier : modifiers) {
      if (simpleCalculator.canHandle(modifier)) {
        simpleModifiers.add(modifier);
      } else if (jexlCalculator.canHandle(modifier)) {
        jexlModifiers.add(modifier);
      } else {
        log.warn("Unknown modifier type: {}", modifier.getCode());
      }
    }

    // Спочатку прості модифікатори (90% випадків)
    CalculationResult result = simpleCalculator.calculate(basePrice, simpleModifiers);

    // Потім складні JEXL модифікатори (10% випадків)
    if (!jexlModifiers.isEmpty()) {
      CalculationResult jexlResult =
          jexlCalculator.calculate(result.getFinalPrice(), jexlModifiers);

      // Об'єднати результати (ВИКОРИСТОВУЄМО DTO!)
      List<CalculationStep> allSteps = new ArrayList<>(result.getSteps());
      allSteps.addAll(jexlResult.getSteps());

      result =
          CalculationResult.builder()
              .basePrice(basePrice)
              .finalPrice(jexlResult.getFinalPrice())
              .totalModification(jexlResult.getFinalPrice() - basePrice)
              .steps(allSteps)
              .success(result.getSuccess() && jexlResult.getSuccess())
              .errorMessage(jexlResult.getErrorMessage())
              .build();
    }

    log.debug("Smart calculation completed: {} -> {}", basePrice, result.getFinalPrice());
    return result;
  }

  // ===== ПРИВАТНІ ДОПОМІЖНІ МЕТОДИ =====

  private PriceListItemEntity findPriceListItem(UUID priceListItemId) {
    return priceListItemRepository
        .findById(priceListItemId)
        .orElseThrow(() -> new PriceListItemNotFoundException(priceListItemId));
  }

  private List<PriceModifierEntity> findApplicableModifiers(ItemCalculationRequest request) {
    // Отримати модифікатори за їх UUID зі списку appliedModifiers
    if (request.getAppliedModifiers() == null || request.getAppliedModifiers().isEmpty()) {
      return new ArrayList<>();
    }

    return priceModifierRepository.findByIdIn(request.getAppliedModifiers()).stream()
        .filter(PriceModifierEntity::isActiveModifier)
        .toList();
  }

  private ItemCalculationResponse convertToItemCalculationResponse(
      ItemCalculationRequest request,
      PriceListItemEntity priceListItem,
      CalculationResult result,
      Double urgencyCharge,
      Double finalPrice) {
    ItemCalculationResponse response = new ItemCalculationResponse();

    // Основна інформація
    response.setPriceListItemId(request.getPriceListItemId());
    response.setItemName(priceListItem.getName());
    response.setQuantity(request.getQuantity());

    // Ціни з урахуванням кольору
    Double actualBasePrice = getActualBasePriceForResponse(priceListItem, request);
    response.setBasePrice(actualBasePrice);
    response.setTotalBasePrice(actualBasePrice * response.getQuantity());
    response.setModifiersTotal(result.getTotalModification());
    response.setSubtotal(result.getFinalPrice());

    // Терміновість
    response.setUrgencyCharge(urgencyCharge);
    response.setFinalPrice(roundPrice(finalPrice));

    // Кроки розрахунку (ПРЯМО DTO - БЕЗ КОНВЕРТАЦІЇ!)
    response.setCalculationSteps(result.getSteps());

    // Попередження щодо кольору (якщо є кольорове ціноутворення)
    List<String> warnings = addColorPricingWarnings(priceListItem, request);
    response.setWarnings(warnings);

    return response;
  }

  /** Отримати фактичну базову ціну для відображення в response. */
  private Double getActualBasePriceForResponse(
      PriceListItemEntity priceListItem, ItemCalculationRequest request) {
    String color = request.getCharacteristics().getColor().toLowerCase().trim();
    boolean isBlack = "чорний".equals(color);
    return priceListItem.getPriceByColor(isBlack);
  }

  private List<String> addColorPricingWarnings(
      PriceListItemEntity priceListItem, ItemCalculationRequest request) {
    List<String> warnings = new ArrayList<>();
    if (priceListItem.hasColorSpecificPricing()) {

      String color = request.getCharacteristics().getColor();
      warnings.add("Застосовано кольорове ціноутворення для кольору: " + color);

      if (priceListItem.getPriceBlack() != null) {
        warnings.add(
            "Доступна спеціальна ціна для чорного кольору: %.2f грн"
                .formatted(priceListItem.getPriceBlack()));
      }

      if (priceListItem.getPriceColor() != null) {
        warnings.add(
            "Доступна спеціальна ціна для кольорових виробів: "
                + priceListItem.getPriceColor()
                + " грн");
      }
    }
    return warnings;
  }

  private Double calculateUrgencyCharge(Double itemsTotal, UrgencyType urgency) {
    // Базова логіка доплати за терміновість
    if (urgency == null) {
      return 0.0;
    }

    return switch (urgency) {
      case NORMAL -> 0.0; // Без доплати
      case URGENT_48H -> itemsTotal * 0.5; // +50%
      case URGENT_24H -> itemsTotal * 1.0; // +100%
    };
  }

  private Double calculateDiscountAmount(
      List<ItemCalculationResponse> itemCalculations,
      com.aksi.api.item.dto.OrderDiscountInfo discount) {
    if (discount == null || discount.getValue() == null || discount.getValue() <= 0) {
      return 0.0;
    }

    // Розрахувати знижку на основі типу
    double totalEligibleAmount =
        itemCalculations.stream().mapToDouble(ItemCalculationResponse::getSubtotal).sum();

    return switch (Objects.requireNonNull(discount.getType())) {
      case NONE -> 0.0; // Без знижки
      case EVERCARD -> totalEligibleAmount * 0.10; // 10% знижка
      case SOCIAL_MEDIA -> totalEligibleAmount * 0.05; // 5% знижка
      case MILITARY -> totalEligibleAmount * 0.10; // 10% знижка для військових
      case OTHER -> totalEligibleAmount * (discount.getValue() / 100.0); // Кастомний відсоток
    };
  }

  /** Округлення ціни до 2 знаків після коми. */
  private Double roundPrice(Double price) {
    if (price == null) {
      return 0.0;
    }
    return BigDecimal.valueOf(price).setScale(2, RoundingMode.HALF_UP).doubleValue();
  }

  /** Розрахувати базову ціну з урахуванням кольору та кількості. */
  private Double calculateBasePriceWithColor(
      PriceListItemEntity priceListItem, ItemCalculationRequest request) {
    Integer quantity = request.getQuantity();

    // Отримати колір та визначити ціну
    String color = request.getCharacteristics().getColor().toLowerCase().trim();
    boolean isBlack = "чорний".equals(color);
    Double pricePerUnit = priceListItem.getPriceByColor(isBlack);

    log.debug(
        "Color pricing: item={}, color={}, isBlack={}, pricePerUnit={}",
        priceListItem.getName(),
        color,
        isBlack,
        pricePerUnit);

    return pricePerUnit * quantity;
  }
}
