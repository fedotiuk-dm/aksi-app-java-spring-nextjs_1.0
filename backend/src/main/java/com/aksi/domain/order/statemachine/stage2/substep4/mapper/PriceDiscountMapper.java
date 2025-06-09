package com.aksi.domain.order.statemachine.stage2.substep4.mapper;

import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;
import com.aksi.domain.pricing.dto.PriceCalculationRequestDTO;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * Mapper для підетапу 2.4: Знижки та надбавки.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PriceDiscountMapper {

    /**
     * Створення PriceCalculationRequestDTO на основі даних з попередніх підетапів.
     */
    public static PriceCalculationRequestDTO createCalculationRequest(
            ItemBasicInfoDTO basicInfo,
            ItemCharacteristicsDTO characteristics,
            StainsDefectsDTO stainsDefects,
            List<String> modifierIds) {

        // Отримуємо categoryCode з ServiceCategoryDTO
        String categoryCode = basicInfo.getServiceCategory() != null ?
                              basicInfo.getServiceCategory().getCode() : null;

        // Отримуємо itemName з PriceListItemDTO
        String itemName = basicInfo.getPriceListItem() != null ?
                          basicInfo.getPriceListItem().getName() : null;

        // Отримуємо color з OrderItemAddRequest
        String color = (characteristics.getCurrentItem() != null) ?
                       characteristics.getCurrentItem().getColor() : null;

        // Конвертуємо quantity з BigDecimal в Integer
        Integer quantity = basicInfo.getQuantity() != null ?
                           basicInfo.getQuantity().intValue() : null;

        return PriceCalculationRequestDTO.builder()
                .categoryCode(categoryCode)
                .itemName(itemName)
                .color(color)
                .quantity(quantity)
                .modifierIds(modifierIds != null ? modifierIds : new ArrayList<>())
                .expedited(false) // За замовчуванням не термінове
                .build();
    }

    /**
     * Створення базового PriceDiscountDTO з даними з попередніх підетапів.
     */
    public static PriceDiscountDTO createPriceDiscountDTO(
            ItemBasicInfoDTO basicInfo,
            ItemCharacteristicsDTO characteristics,
            StainsDefectsDTO stainsDefects) {

        PriceCalculationRequestDTO request = createCalculationRequest(
                basicInfo, characteristics, stainsDefects, new ArrayList<>());

        return PriceDiscountDTO.builder()
                .calculationRequest(request)
                .selectedModifierIds(new ArrayList<>())
                .rangeModifierValues(new ArrayList<>())
                .fixedModifierQuantities(new ArrayList<>())
                .calculationCompleted(false)
                .hasCalculationErrors(false)
                .build();
    }

    /**
     * Створення SubstepResultDTO з PriceDiscountDTO.
     */
    public static SubstepResultDTO toSubstepResult(PriceDiscountDTO priceDiscountDTO) {
        return SubstepResultDTO.builder()
                .currentState(priceDiscountDTO.isCalculationCompleted() && !priceDiscountDTO.isHasCalculationErrors()
                        ? PriceDiscountState.COMPLETED
                        : PriceDiscountState.CALCULATING_FINAL_PRICE)
                .basePrice(priceDiscountDTO.getBasePrice())
                .finalPrice(priceDiscountDTO.getFinalPrice())
                .quantity(priceDiscountDTO.getCalculationRequest() != null
                        ? priceDiscountDTO.getCalculationRequest().getQuantity() : null)
                .unitOfMeasure(priceDiscountDTO.getCalculationResponse() != null
                        ? priceDiscountDTO.getCalculationResponse().getUnitOfMeasure() : null)
                .appliedModifierIds(new ArrayList<>(priceDiscountDTO.getSelectedModifierIds()))
                .calculationDetails(priceDiscountDTO.getCalculationDetails())
                .completed(priceDiscountDTO.isCalculationCompleted())
                .valid(!priceDiscountDTO.isHasCalculationErrors())
                .errorMessage(priceDiscountDTO.getErrorMessage())
                .notes(priceDiscountDTO.getCalculationNotes())
                .build();
    }

    /**
     * Оновлення PriceCalculationRequestDTO з новими модифікаторами.
     */
    public static PriceCalculationRequestDTO updateCalculationRequest(
            PriceCalculationRequestDTO request,
            List<String> modifierIds,
            List<PriceCalculationRequestDTO.RangeModifierValueDTO> rangeValues,
            List<PriceCalculationRequestDTO.FixedModifierQuantityDTO> fixedQuantities) {

        return PriceCalculationRequestDTO.builder()
                .categoryCode(request.getCategoryCode())
                .itemName(request.getItemName())
                .color(request.getColor())
                .quantity(request.getQuantity())
                .modifierCodes(request.getModifierCodes())
                .modifierIds(modifierIds != null ? modifierIds : new ArrayList<>())
                .rangeModifierValues(rangeValues != null ? rangeValues : new ArrayList<>())
                .fixedModifierQuantities(fixedQuantities != null ? fixedQuantities : new ArrayList<>())
                .expedited(request.isExpedited())
                .expeditePercent(request.getExpeditePercent())
                .discountPercent(request.getDiscountPercent())
                .build();
    }

    /**
     * Перевірка чи всі обов'язкові дані для розрахунку присутні.
     */
    public static boolean hasRequiredDataForCalculation(PriceDiscountDTO priceDiscountDTO) {
        if (priceDiscountDTO == null || priceDiscountDTO.getCalculationRequest() == null) {
            return false;
        }

        PriceCalculationRequestDTO request = priceDiscountDTO.getCalculationRequest();
        return request.getCategoryCode() != null && !request.getCategoryCode().trim().isEmpty() &&
               request.getItemName() != null && !request.getItemName().trim().isEmpty() &&
               request.getQuantity() != null && request.getQuantity() > 0;
    }

    /**
     * Створення копії PriceDiscountDTO з оновленими даними.
     */
    public static PriceDiscountDTO copyWithUpdatedRequest(
            PriceDiscountDTO original,
            PriceCalculationRequestDTO updatedRequest) {

        return PriceDiscountDTO.builder()
                .calculationRequest(updatedRequest)
                .calculationResponse(null) // Скидаємо результат, бо запит змінився
                .selectedModifierIds(new ArrayList<>(original.getSelectedModifierIds()))
                .rangeModifierValues(new ArrayList<>(original.getRangeModifierValues()))
                .fixedModifierQuantities(new ArrayList<>(original.getFixedModifierQuantities()))
                .calculationNotes(original.getCalculationNotes())
                .calculationCompleted(false)
                .hasCalculationErrors(false)
                .errorMessage(null)
                .build();
    }
}
