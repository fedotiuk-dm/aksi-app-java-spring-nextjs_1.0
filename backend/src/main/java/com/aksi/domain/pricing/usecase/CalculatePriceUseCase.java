package com.aksi.domain.pricing.usecase;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.event.DomainEventPublisher;
import com.aksi.domain.pricing.event.PriceCalculatedEvent;
import com.aksi.domain.pricing.service.PriceCalculationService.FixedModifierQuantity;
import com.aksi.domain.pricing.service.PriceCalculationService.RangeModifierValue;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Use Case для розрахунку ціни з модифікаторами.
 * Реалізує основну бізнес-логіку розрахунку ціни згідно з DDD принципами.
 */
@Component
@RequiredArgsConstructor
@Validated
@Slf4j
public class CalculatePriceUseCase {

    private final GetBasePriceUseCase getBasePriceUseCase;
    private final ApplyModifiersUseCase applyModifiersUseCase;
    private final ApplyDiscountAndExpediteUseCase applyDiscountAndExpediteUseCase;
    private final DomainEventPublisher eventPublisher;

    /**
     * Виконати розрахунок ціни для предмету з усіма модифікаторами.
     *
     * @param request Запит на розрахунок ціни
     * @return Результат розрахунку ціни
     */
    public PriceCalculationResponseDTO execute(@NotNull PriceCalculationRequest request) {
        log.debug("Розпочинаємо розрахунок ціни для категорії {} та предмету {}",
                request.categoryCode(), request.itemName());

        // 1. Отримуємо базову ціну за одиницю
        BigDecimal baseUnitPrice = getBasePriceUseCase.execute(
                request.categoryCode(),
                request.itemName(),
                request.color()
        );

        // 2. Застосовуємо модифікатори до одиничної ціни
        ApplyModifiersUseCase.ModifiersResult modifiersResult = applyModifiersUseCase.execute(
                new ApplyModifiersUseCase.ModifiersRequest(
                        baseUnitPrice,
                        request.categoryCode(),
                        request.modifierCodes(),
                        request.rangeModifierValues(),
                        request.fixedModifierQuantities()
                )
        );

        // 3. Розраховуємо загальну ціну за кількість
        BigDecimal baseTotalPrice = baseUnitPrice.multiply(BigDecimal.valueOf(request.quantity()));
        BigDecimal subtotalPrice = modifiersResult.finalPrice().multiply(BigDecimal.valueOf(request.quantity()));

        // 4. Застосовуємо знижки та надбавки за терміновість
        ApplyDiscountAndExpediteUseCase.DiscountExpediteResult finalResult = applyDiscountAndExpediteUseCase.execute(
                new ApplyDiscountAndExpediteUseCase.DiscountExpediteRequest(
                        subtotalPrice,
                        request.isExpedited(),
                        request.expediteFactor(),
                        request.discountPercent()
                )
        );

        // 5. Створюємо результат
        PriceCalculationResponseDTO response = PriceCalculationResponseDTO.builder()
                .baseUnitPrice(baseUnitPrice)
                .quantity(request.quantity())
                .baseTotalPrice(baseTotalPrice)
                .unitOfMeasure("шт")
                .finalUnitPrice(modifiersResult.finalPrice())
                .finalTotalPrice(finalResult.finalPrice())
                .calculationDetails(modifiersResult.appliedModifiers())
                .build();

        // 6. Публікуємо доменну подію
        publishPriceCalculatedEvent(request, response, modifiersResult);

        log.debug("Завершено розрахунок ціни: базова {} -> фінальна {}",
                baseTotalPrice, finalResult.finalPrice());

        return response;
    }

    /**
     * Публікувати доменну подію про розрахунок ціни.
     */
    private void publishPriceCalculatedEvent(
            PriceCalculationRequest request,
            PriceCalculationResponseDTO response,
            ApplyModifiersUseCase.ModifiersResult modifiersResult) {

        // Збираємо коди застосованих модифікаторів
        List<String> appliedModifierCodes = modifiersResult.appliedModifiers().stream()
                .map(detail -> detail.getModifierCode())
                .collect(Collectors.toList());

        PriceCalculatedEvent event = PriceCalculatedEvent.builder()
                .eventId(java.util.UUID.randomUUID().toString())
                .timestamp(java.time.Instant.now())
                .categoryCode(request.categoryCode())
                .itemName(request.itemName())
                .color(request.color())
                .quantity(request.quantity())
                .baseUnitPrice(response.getBaseUnitPrice())
                .finalUnitPrice(response.getFinalUnitPrice())
                .finalTotalPrice(response.getFinalTotalPrice())
                .appliedModifierCodes(appliedModifierCodes)
                .isExpedited(request.isExpedited())
                .discountPercent(request.discountPercent())
                .unitOfMeasure(response.getUnitOfMeasure())
                .build();

        eventPublisher.publishPriceCalculatedEvent(event);
    }

    /**
     * Запит на розрахунок ціни.
     */
    public record PriceCalculationRequest(
            @NotBlank(message = "Код категорії не може бути порожнім")
            String categoryCode,

            @NotBlank(message = "Назва предмету не може бути порожньою")
            String itemName,

            String color,

            @Min(value = 1, message = "Кількість повинна бути більше 0")
            int quantity,

            List<String> modifierCodes,

            List<RangeModifierValue> rangeModifierValues,

            List<FixedModifierQuantity> fixedModifierQuantities,

            boolean isExpedited,

            @DecimalMin(value = "0.0", message = "Фактор терміновості не може бути від'ємним")
            @DecimalMax(value = "1000.0", message = "Фактор терміновості не може перевищувати 1000%")
            BigDecimal expediteFactor,

            @DecimalMin(value = "0.0", message = "Відсоток знижки не може бути від'ємним")
            @DecimalMax(value = "100.0", message = "Відсоток знижки не може перевищувати 100%")
            BigDecimal discountPercent
    ) {
        public PriceCalculationRequest {
            // Встановлюємо значення за замовчуванням
            if (expediteFactor == null) {
                expediteFactor = BigDecimal.ZERO;
            }
            if (discountPercent == null) {
                discountPercent = BigDecimal.ZERO;
            }
        }
    }
}
