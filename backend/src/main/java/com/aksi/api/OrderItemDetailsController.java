package com.aksi.api;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.domain.order.entity.DefectType;
import com.aksi.domain.order.entity.StainType;
import com.aksi.dto.order.OrderItemDefectDto;
import com.aksi.dto.order.OrderItemStainDto;
import com.aksi.service.order.OrderItemDetailsService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for managing order item details like stains, defects and risks.
 */
@RestController
@RequestMapping("/order-items")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Order Item Details", description = "API для управління деталями замовлення в системі хімчистки")
public class OrderItemDetailsController {

    private final OrderItemDetailsService orderItemDetailsService;

    /**
     * GET: Get all available stain types
     */
    @GetMapping("/stain-types")
    public ResponseEntity<List<Map<String, String>>> getAllStainTypes() {
        return ResponseEntity.ok(
                Arrays.stream(StainType.values())
                        .map(type -> Map.of(
                                "id", type.name(),
                                "name", getStainTypeName(type),
                                "description", getStainTypeDescription(type)
                        ))
                        .toList()
        );
    }

    /**
     * GET: Get all available defect types
     */
    @GetMapping("/defect-types")
    public ResponseEntity<List<Map<String, String>>> getAllDefectTypes() {
        return ResponseEntity.ok(
                Arrays.stream(DefectType.values())
                        .map(type -> {
                            Map<String, String> map = new HashMap<>();
                            map.put("id", type.name());
                            map.put("name", getDefectTypeName(type));
                            map.put("description", getDefectTypeDescription(type));
                            map.put("requiresPhoto", String.valueOf(isPhotoRequired(type)));
                            map.put("requiresExplanation", String.valueOf(isExplanationRequired(type)));
                            return map;
                        })
                        .toList()
        );
    }

    /**
     * POST: Add a stain to an order item
     */
    @PostMapping("/{itemId}/stains")
    public ResponseEntity<OrderItemStainDto> addStainToItem(
            @PathVariable UUID itemId,
            @RequestBody OrderItemStainDto stainDto) {
        stainDto.setOrderItemId(itemId);
        return ResponseEntity.ok(orderItemDetailsService.addStainToItem(stainDto));
    }

    /**
     * POST: Add a defect to an order item
     */
    @PostMapping("/{itemId}/defects")
    public ResponseEntity<OrderItemDefectDto> addDefectToItem(
            @PathVariable UUID itemId,
            @RequestBody OrderItemDefectDto defectDto) {
        defectDto.setOrderItemId(itemId);
        return ResponseEntity.ok(orderItemDetailsService.addDefectToItem(defectDto));
    }

    /**
     * PUT: Update defect notes for an order item
     */
    @PutMapping("/{itemId}/defect-notes")
    public ResponseEntity<Void> updateDefectNotes(
            @PathVariable UUID itemId,
            @RequestBody Map<String, String> request) {
        orderItemDetailsService.updateDefectNotes(itemId, request.get("notes"));
        return ResponseEntity.ok().build();
    }

    /**
     * PUT: Update no warranty status and reason for an order item
     */
    @PutMapping("/{itemId}/no-warranty")
    public ResponseEntity<Void> updateNoWarrantyStatus(
            @PathVariable UUID itemId,
            @RequestBody Map<String, Object> request) {
        Boolean noWarranty = (Boolean) request.get("noWarranty");
        String reason = (String) request.get("reason");
        orderItemDetailsService.updateNoWarrantyStatus(itemId, noWarranty, reason);
        return ResponseEntity.ok().build();
    }

    // Utility methods for stain types
    private String getStainTypeName(StainType type) {
        return switch (type) {
            case GREASE -> "Жир";
            case BLOOD -> "Кров";
            case PROTEIN -> "Білок";
            case WINE -> "Вино";
            case COFFEE -> "Кава";
            case GRASS -> "Трава";
            case INK -> "Чорнило";
            case COSMETICS -> "Косметика";
            case OTHER -> "Інше";
        };
    }

    private String getStainTypeDescription(StainType type) {
        return switch (type) {
            case GREASE -> "Плями від олії, жиру, масла";
            case BLOOD -> "Плями крові будь-якого походження";
            case PROTEIN -> "Плями білкового походження";
            case WINE -> "Плями від вина, алкогольних напоїв";
            case COFFEE -> "Плями від кави, чаю, какао";
            case GRASS -> "Плями від трави, листя, рослин";
            case INK -> "Плями від чорнила, ручки, маркера";
            case COSMETICS -> "Плями від косметики, помади, тонального крему";
            case OTHER -> "Інші типи плям";
        };
    }

    // Utility methods for defect types
    private String getDefectTypeName(DefectType type) {
        return switch (type) {
            case WORN -> "Потертості";
            case TORN -> "Порване";
            case MISSING_ACCESSORIES -> "Відсутність фурнітури";
            case DAMAGED_ACCESSORIES -> "Пошкодження фурнітури";
            case COLOR_CHANGE_RISK -> "Ризики зміни кольору";
            case DEFORMATION_RISK -> "Ризики деформації";
            case OTHER -> "Без гарантій (потрібне пояснення)";
        };
    }

    private String getDefectTypeDescription(DefectType type) {
        return switch (type) {
            case WORN -> "Видимі ознаки зносу, потертості на поверхні";
            case TORN -> "Наявність розривів, дірок або пошкоджень тканини";
            case MISSING_ACCESSORIES -> "Відсутні ґудзики, застібки, декоративні елементи";
            case DAMAGED_ACCESSORIES -> "Пошкоджені застібки, блискавки, гачки";
            case COLOR_CHANGE_RISK -> "При чищенні може змінитись колір виробу";
            case DEFORMATION_RISK -> "Можлива деформація або усадка після обробки";
            case OTHER -> "Інші види дефектів, що потребують пояснення";
        };
    }

    private boolean isPhotoRequired(DefectType type) {
        return type == DefectType.TORN || 
               type == DefectType.DAMAGED_ACCESSORIES || 
               type == DefectType.OTHER;
    }

    private boolean isExplanationRequired(DefectType type) {
        return type == DefectType.OTHER;
    }
}
