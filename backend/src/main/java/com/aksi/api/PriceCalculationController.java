package com.aksi.api;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;
import com.aksi.domain.pricing.entity.PriceModifierDefinitionEntity.ModifierCategory;
import com.aksi.domain.pricing.service.CatalogPriceModifierService;
import com.aksi.domain.pricing.service.PriceCalculationService;
import com.aksi.domain.pricing.service.PriceCalculationService.FixedModifierQuantity;
import com.aksi.domain.pricing.service.PriceCalculationService.RangeModifierValue;
import com.aksi.util.ApiResponseUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для розрахунку цін з модифікаторами.
 */
@RestController
@RequestMapping("/price-calculation")
@Tag(name = "Price Calculation", description = "API для розрахунку цін з використанням модифікаторів з БД")
@RequiredArgsConstructor
@Slf4j
public class PriceCalculationController {

    private final PriceCalculationService priceCalculationService;
    private final CatalogPriceModifierService priceModifierService;

    /**
     * Отримати базову ціну для предмету з прайс-листа.
     *
     * @param categoryCode Код категорії
     * @param itemName Найменування предмету
     * @param color Колір предмету
     * @return Базова ціна предмету
     */
    @GetMapping("/base-price")
    @Operation(summary = "Отримати базову ціну для предмету з прайс-листа")
    public ResponseEntity<?> getBasePrice(
            @RequestParam String categoryCode,
            @RequestParam String itemName,
            @RequestParam(required = false) String color) {
        log.info("REST запит на отримання базової ціни для категорії {}, предмету {}, колір {}",
                categoryCode, itemName, color);

        try {
            BigDecimal basePrice = priceCalculationService.getBasePrice(categoryCode, itemName, color);
            return ApiResponseUtils.ok(basePrice, "Отримано базову ціну для категорії {}, предмету {}, колір {}",
                    categoryCode, itemName, color);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Предмет не знайдено в прайс-листі",
                    "Не вдалося знайти предмет в прайс-листі для категорії {}, предмету {}, колір {}. Причина: {}",
                    categoryCode, itemName, color, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні базової ціни",
                    "Виникла несподівана помилка при отриманні базової ціни для категорії {}, предмету {}, колір {}. Причина: {}",
                    categoryCode, itemName, color, e.getMessage());
        }
    }

    /**
     * Отримати доступні модифікатори для категорії.
     *
     * @param categoryCode Код категорії
     * @return Список кодів доступних модифікаторів
     */
    @GetMapping("/available-modifiers")
    @Operation(summary = "Отримати доступні модифікатори для категорії")
    public ResponseEntity<?> getAvailableModifiersForCategory(
            @RequestParam String categoryCode) {
        log.info("REST запит на отримання доступних модифікаторів для категорії {}", categoryCode);

        try {
            List<String> modifierCodes = priceCalculationService.getAvailableModifiersForCategory(categoryCode);
            return ApiResponseUtils.ok(modifierCodes, "Отримано {} доступних модифікаторів для категорії {}",
                    modifierCodes.size(), categoryCode);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію не знайдено",
                    "Не вдалося знайти категорію {}. Причина: {}",
                    categoryCode, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні доступних модифікаторів",
                    "Виникла несподівана помилка при отриманні доступних модифікаторів для категорії {}. Причина: {}",
                    categoryCode, e.getMessage());
        }
    }

    /**
     * Отримати всі модифікатори для конкретної категорії послуг.
     *
     * @param categoryCode Код категорії
     * @return Список модифікаторів
     */
    @GetMapping("/modifiers/by-category/{categoryCode}")
    @Operation(summary = "Отримати всі модифікатори для конкретної категорії послуг",
              description = "Повертає повні дані про модифікатори для вказаної категорії послуг")
    public ResponseEntity<?> getModifiersForServiceCategory(
            @PathVariable String categoryCode) {
        log.info("REST запит на отримання модифікаторів для категорії послуг {}", categoryCode);

        try {
            List<PriceModifierDTO> modifiers = priceModifierService.getModifiersForServiceCategory(categoryCode);
            return ApiResponseUtils.ok(modifiers, "Отримано {} модифікаторів для категорії послуг {}",
                    modifiers.size(), categoryCode);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Категорію не знайдено",
                    "Не вдалося знайти категорію {}. Причина: {}",
                    categoryCode, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні модифікаторів",
                    "Виникла несподівана помилка при отриманні модифікаторів для категорії послуг {}. Причина: {}",
                    categoryCode, e.getMessage());
        }
    }

    /**
     * Отримати модифікатори за типом (загальні, текстильні, шкіряні).
     *
     * @param category Тип модифікатора (GENERAL, TEXTILE, LEATHER)
     * @return Список модифікаторів
     */
    @GetMapping("/modifiers/by-type/{category}")
    @Operation(summary = "Отримати модифікатори за типом",
               description = "Повертає модифікатори за типом (загальні, текстильні, шкіряні)")
    public ResponseEntity<?> getModifiersByCategory(
            @PathVariable ModifierCategory category) {
        log.info("REST запит на отримання модифікаторів за типом {}", category);

        try {
            List<PriceModifierDTO> modifiers = priceModifierService.getModifiersByCategory(category);
            return ApiResponseUtils.ok(modifiers, "Отримано {} модифікаторів за типом {}",
                    modifiers.size(), category);
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні модифікаторів за типом",
                    "Виникла несподівана помилка при отриманні модифікаторів за типом {}. Причина: {}",
                    category, e.getMessage());
        }
    }

    /**
     * Отримати детальну інформацію про модифікатор за кодом.
     *
     * @param code Код модифікатора
     * @return Інформація про модифікатор
     */
    @GetMapping("/modifiers/{code}")
    @Operation(summary = "Отримати детальну інформацію про модифікатор",
               description = "Повертає повну інформацію про модифікатор за його кодом")
    public ResponseEntity<?> getModifierByCode(
            @PathVariable String code) {
        log.info("REST запит на отримання інформації про модифікатор {}", code);

        try {
            PriceModifierDTO modifier = priceModifierService.getModifierByCode(code);
            return ApiResponseUtils.ok(modifier, "Отримано інформацію про модифікатор {}", code);
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.notFound("Модифікатор не знайдено",
                    "Не вдалося знайти модифікатор з кодом {}. Причина: {}",
                    code, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні інформації про модифікатор",
                    "Виникла несподівана помилка при отриманні інформації про модифікатор {}. Причина: {}",
                    code, e.getMessage());
        }
    }

    /**
     * Отримати інформацію про кілька модифікаторів за їх кодами.
     *
     * @param codes Список кодів модифікаторів
     * @return Список модифікаторів
     */
    @PostMapping("/modifiers/batch")
    @Operation(summary = "Отримати інформацію про кілька модифікаторів",
               description = "Повертає інформацію про модифікатори за списком їх кодів")
    public ResponseEntity<?> getModifiersByCodes(
            @RequestBody List<String> codes) {
        log.info("REST запит на отримання інформації про модифікатори: {}", codes);

        try {
            List<PriceModifierDTO> modifiers = priceModifierService.getModifiersByCodes(codes);
            return ApiResponseUtils.ok(modifiers, "Отримано інформацію про {} модифікаторів", modifiers.size());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest("Неправильні коди модифікаторів",
                    "Деякі коди модифікаторів неправильні: {}. Причина: {}",
                    codes, e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні інформації про модифікатори",
                    "Виникла несподівана помилка при отриманні інформації про модифікатори: {}. Причина: {}",
                    codes, e.getMessage());
        }
    }

    /**
     * Розрахувати ціну з урахуванням вибраних модифікаторів.
     */
    @PostMapping("/calculate")
    @Operation(
        summary = "Розрахувати ціну з урахуванням вибраних модифікаторів",
        description = "Детальний розрахунок ціни з урахуванням базової ціни, модифікаторів, знижок та терміновості",
        responses = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "200",
                description = "Успішний розрахунок ціни",
                content = @io.swagger.v3.oas.annotations.media.Content(
                    mediaType = "application/json",
                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = PriceCalculationResponseDTO.class)
                )
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "400",
                description = "Неправильні вхідні дані"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "404",
                description = "Не знайдено предмет або категорію в прайс-листі"
            )
        }
    )
    public ResponseEntity<?> calculatePrice(
            @RequestBody PriceCalculationRequestDTO request) {
        log.info("REST запит на розрахунок ціни для категорії {} та предмету {} з {} модифікаторами",
                request.getCategoryCode(), request.getItemName(),
                request.getModifierCodes() != null ? request.getModifierCodes().size() : 0);

        try {
            PriceCalculationResponseDTO response = priceCalculationService.calculatePrice(
                    request.getCategoryCode(),
                    request.getItemName(),
                    request.getQuantity(),
                    request.getColor(),
                    request.getModifierCodes(),
                    request.getRangeModifierValues(),
                    request.getFixedModifierQuantities(),
                    request.isExpedited(),
                    request.getExpeditePercent(),
                    request.getDiscountPercent()
            );

            return ApiResponseUtils.ok(response, "Успішно розраховано ціну для категорії {} та предмету {}",
                    request.getCategoryCode(), request.getItemName());
        } catch (IllegalArgumentException e) {
            return ApiResponseUtils.badRequest("Неправильні параметри для розрахунку ціни",
                    "Помилка при розрахунку ціни для категорії {} та предмету {}. Причина: {}",
                    request.getCategoryCode(), request.getItemName(), e.getMessage());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при розрахунку ціни",
                    "Виникла несподівана помилка при розрахунку ціни для категорії {} та предмету {}. Причина: {}",
                    request.getCategoryCode(), request.getItemName(), e.getMessage());
        }
    }

    /**
     * DTO для запиту на розрахунок ціни.
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    @io.swagger.v3.oas.annotations.media.Schema(description = "Запит на розрахунок ціни для предмета")
    public static class PriceCalculationRequestDTO {
        /**
         * Код категорії послуги.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Код категорії послуги", example = "CLOTHING", required = true)
        private String categoryCode;

        /**
         * Найменування предмету з прайс-листа.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Найменування предмету з прайс-листа", example = "Піджак", required = true)
        private String itemName;

        /**
         * Колір предмету.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Колір предмету", example = "чорний")
        private String color;

        /**
         * Кількість предметів.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Кількість предметів", example = "1", required = true)
        private int quantity;

        /**
         * Список кодів модифікаторів.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Список кодів модифікаторів", example = "[\"manual_cleaning\", \"kids_items\"]")
        private List<String> modifierCodes;

        /**
         * Значення для модифікаторів з діапазоном.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Значення для модифікаторів з діапазоном", example = "[{\"modifierCode\": \"dirt_level\", \"value\": 30.0}]")
        private List<RangeModifierValue> rangeModifierValues;

        /**
         * Кількості для фіксованих модифікаторів.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Кількості для фіксованих модифікаторів", example = "[{\"modifierCode\": \"buttons\", \"quantity\": 5}]")
        private List<FixedModifierQuantity> fixedModifierQuantities;

        /**
         * Чи термінове замовлення.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Чи термінове замовлення", example = "false")
        private boolean expedited;

        /**
         * Відсоток надбавки за терміновість.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Відсоток надбавки за терміновість", example = "50.0")
        private BigDecimal expeditePercent;

        /**
         * Відсоток знижки.
         */
        @io.swagger.v3.oas.annotations.media.Schema(description = "Відсоток знижки", example = "10.0")
        private BigDecimal discountPercent;
    }

    /**
     * Отримати рекомендовані модифікатори на основі плям та дефектів.
     */
    @GetMapping("/recommended-modifiers")
    @Operation(summary = "Отримати рекомендовані модифікатори на основі плям та дефектів",
               description = "Повертає список рекомендованих модифікаторів для предмета на основі його плям, дефектів, категорії та матеріалу")
    public ResponseEntity<?> getRecommendedModifiers(
            @RequestParam(required = false) Set<String> stains,
            @RequestParam(required = false) Set<String> defects,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {
        log.info("REST запит на отримання рекомендованих модифікаторів для категорії {}, матеріалу {}, з {} плямами та {} дефектами",
                categoryCode, materialType,
                stains != null ? stains.size() : 0,
                defects != null ? defects.size() : 0);

        try {
            List<PriceModifierDTO> modifiers = priceCalculationService.getRecommendedModifiersForItem(stains, defects, categoryCode, materialType);
            return ApiResponseUtils.ok(modifiers, "Отримано {} рекомендованих модифікаторів", modifiers.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні рекомендованих модифікаторів",
                    "Виникла несподівана помилка при отриманні рекомендованих модифікаторів. Причина: {}",
                    e.getMessage());
        }
    }

    /**
     * Отримати попередження про ризики на основі плям та дефектів.
     */
    @GetMapping("/risk-warnings")
    @Operation(summary = "Отримати попередження про ризики",
               description = "Повертає список попереджень про ризики для предмета на основі його плям, дефектів, категорії та матеріалу")
    public ResponseEntity<?> getRiskWarnings(
            @RequestParam(required = false) Set<String> stains,
            @RequestParam(required = false) Set<String> defects,
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) String materialType) {
        log.info("REST запит на отримання попереджень про ризики для категорії {}, матеріалу {}, з {} плямами та {} дефектами",
                categoryCode, materialType,
                stains != null ? stains.size() : 0,
                defects != null ? defects.size() : 0);

        try {
            List<String> warnings = priceCalculationService.getRiskWarningsForItem(stains, defects, materialType, categoryCode);
            return ApiResponseUtils.ok(warnings, "Отримано {} попереджень про ризики", warnings.size());
        } catch (Exception e) {
            return ApiResponseUtils.internalServerError("Помилка при отриманні попереджень про ризики",
                    "Виникла несподівана помилка при отриманні попереджень про ризики. Причина: {}",
                    e.getMessage());
        }
    }
}
