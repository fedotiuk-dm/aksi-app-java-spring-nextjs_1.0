package com.aksi.domain.pricing.usecase;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import com.aksi.domain.pricing.service.PriceCalculationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Use Case для отримання попереджень про ризики обробки предмету.
 * Реалізує бізнес-логіку аналізу ризиків на основі плям, дефектів та матеріалу.
 */
@Component
@RequiredArgsConstructor
@Validated
@Slf4j
public class GetRiskWarningsUseCase {

    private final PriceCalculationService priceCalculationService;

    /**
     * Виконати отримання попереджень про ризики для предмету.
     *
     * @param request Запит на отримання попереджень
     * @return Список попереджень про ризики
     */
    public List<String> execute(RiskWarningRequest request) {
        log.debug("Отримуємо попередження про ризики для категорії {}, матеріалу {}, з {} плямами та {} дефектами",
                request.categoryCode(), request.materialType(),
                request.stains() != null ? request.stains().size() : 0,
                request.defects() != null ? request.defects().size() : 0);

        try {
            List<String> warnings = priceCalculationService.getRiskWarningsForItem(
                    request.stains(),
                    request.defects(),
                    request.materialType(),
                    request.categoryCode()
            );

            log.debug("Знайдено {} попереджень про ризики", warnings.size());
            return warnings;

        } catch (Exception e) {
            log.error("Помилка при отриманні попереджень про ризики: {}", e.getMessage());
            throw new IllegalArgumentException("Не вдалося отримати попередження про ризики", e);
        }
    }

    /**
     * Запит на отримання попереджень про ризики.
     */
    public record RiskWarningRequest(
            Set<String> stains,
            Set<String> defects,
            String categoryCode,
            String materialType
    ) {}
}
