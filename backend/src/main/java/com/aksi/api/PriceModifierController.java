package com.aksi.api;

import com.aksi.dto.order.PriceModifierDto;
import com.aksi.service.order.PriceModifierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST контролер для доступу до модифікаторів цін (знижок та надбавок).
 */
@RestController
@RequestMapping("/price-modifiers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Price Modifiers API", description = "API для роботи з модифікаторами цін")
public class PriceModifierController {

    private final PriceModifierService priceModifierService;

    /**
     * Отримати всі доступні модифікатори цін
     *
     * @return Список всіх модифікаторів цін
     */
    @GetMapping
    @Operation(summary = "Отримати всі модифікатори цін", 
               description = "Повертає повний список всіх доступних модифікаторів цін")
    public ResponseEntity<List<PriceModifierDto>> getAllPriceModifiers() {
        log.debug("REST request to get all price modifiers");
        List<PriceModifierDto> modifiers = priceModifierService.getAllPriceModifiers();
        return ResponseEntity.ok(modifiers);
    }

    /**
     * Отримати модифікатори цін, застосовні до вказаної категорії
     *
     * @param categoryId ID категорії товарів
     * @return Список модифікаторів цін для вказаної категорії
     */
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Отримати модифікатори цін для категорії", 
               description = "Повертає список модифікаторів цін, застосовних до вказаної категорії товарів")
    public ResponseEntity<List<PriceModifierDto>> getPriceModifiersForCategory(
            @Parameter(description = "ID категорії товарів") 
            @PathVariable UUID categoryId) {
        
        log.debug("REST request to get price modifiers for category ID: {}", categoryId);
        List<PriceModifierDto> modifiers = priceModifierService.getPriceModifiersForCategory(categoryId);
        return ResponseEntity.ok(modifiers);
    }

    /**
     * Отримати загальні модифікатори цін
     *
     * @return Список загальних модифікаторів цін
     */
    @GetMapping("/general")
    @Operation(summary = "Отримати загальні модифікатори цін", 
               description = "Повертає список загальних модифікаторів цін, застосовних до всіх категорій")
    public ResponseEntity<List<PriceModifierDto>> getGeneralPriceModifiers() {
        log.debug("REST request to get general price modifiers");
        List<PriceModifierDto> modifiers = priceModifierService.getGeneralPriceModifiers();
        return ResponseEntity.ok(modifiers);
    }

    /**
     * Отримати модифікатори цін для текстильних виробів
     *
     * @return Список модифікаторів цін для текстилю
     */
    @GetMapping("/textile")
    @Operation(summary = "Отримати модифікатори цін для текстильних виробів", 
               description = "Повертає список модифікаторів цін, застосовних до текстильних виробів")
    public ResponseEntity<List<PriceModifierDto>> getTextilePriceModifiers() {
        log.debug("REST request to get textile price modifiers");
        List<PriceModifierDto> modifiers = priceModifierService.getTextilePriceModifiers();
        return ResponseEntity.ok(modifiers);
    }

    /**
     * Отримати модифікатори цін для шкіряних виробів
     *
     * @return Список модифікаторів цін для шкіри
     */
    @GetMapping("/leather")
    @Operation(summary = "Отримати модифікатори цін для шкіряних виробів", 
               description = "Повертає список модифікаторів цін, застосовних до шкіряних виробів")
    public ResponseEntity<List<PriceModifierDto>> getLeatherPriceModifiers() {
        log.debug("REST request to get leather price modifiers");
        List<PriceModifierDto> modifiers = priceModifierService.getLeatherPriceModifiers();
        return ResponseEntity.ok(modifiers);
    }
}
