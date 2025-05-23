package com.aksi.domain.pricing.usecase;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.service.PriceCalculationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Use Case для отримання рекомендованих модифікаторів на основі плям та дефектів.
 * Реалізує бізнес-логіку аналізу проблем предмету та рекомендації відповідних модифікаторів.
 */
@Component
@RequiredArgsConstructor
@Validated
@Slf4j
public class GetRecommendedModifiersUseCase {

    private final PriceCalculationService priceCalculationService;

    /**
     * Виконати отримання рекомендованих модифікаторів для предмету.
     *
     * @param request Запит на отримання рекомендацій
     * @return Список рекомендованих модифікаторів
     */
    public List<PriceModifierDTO> execute(RecommendationRequest request) {
        log.debug("Отримуємо рекомендовані модифікатори для категорії {}, матеріалу {}, з {} плямами та {} дефектами",
                request.categoryCode(), request.materialType(),
                request.stains() != null ? request.stains().size() : 0,
                request.defects() != null ? request.defects().size() : 0);

        try {
            List<PriceModifierDTO> recommendations = priceCalculationService.getRecommendedModifiersForItem(
                    request.stains(),
                    request.defects(),
                    request.categoryCode(),
                    request.materialType()
            );

            log.debug("Знайдено {} рекомендованих модифікаторів", recommendations.size());
            return recommendations;

        } catch (Exception e) {
            log.error("Помилка при отриманні рекомендованих модифікаторів: {}", e.getMessage());
            throw new IllegalArgumentException("Не вдалося отримати рекомендовані модифікатори", e);
        }
    }

    /**
     * Запит на отримання рекомендованих модифікаторів.
     */
    public record RecommendationRequest(
            Set<String> stains,
            Set<String> defects,
            String categoryCode,
            String materialType
    ) {}
}
