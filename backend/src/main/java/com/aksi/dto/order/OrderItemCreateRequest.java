package com.aksi.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Request DTO for creating a new order item.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemCreateRequest {
    /**
     * Service category ID.
     */
    @NotNull(message = "Service category ID is required")
    private UUID serviceCategoryId;
    
    /**
     * Price list item ID.
     */
    @NotNull(message = "Price list item ID is required")
    private UUID priceListItemId;
    
    /**
     * Name of the item.
     */
    @NotBlank(message = "Name is required")
    private String name;
    
    /**
     * Unit of measurement ('piece' or 'kilogram').
     */
    @NotBlank(message = "Unit of measurement is required")
    private String unitOfMeasurement;
    
    /**
     * Quantity of items or weight in kilograms.
     */
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantity;
    
    /**
     * Material of the item.
     */
    @NotBlank(message = "Material is required")
    private String material;
    
    /**
     * Color of the item.
     */
    @NotBlank(message = "Color is required")
    private String color;
    
    /**
     * Filler material (for applicable items like pillows, duvets, etc.).
     */
    private String filler;
    
    /**
     * Whether the filler is clumped.
     */
    private Boolean clumpedFiller;
    
    /**
     * Degree of wear as a percentage.
     */
    private Integer wearPercentage;
    
    /**
     * Notes about defects or special handling.
     */
    private String defectNotes;
    
    /**
     * Whether this item has no warranty for cleaning results.
     */
    private Boolean noWarranty;
    
    /**
     * Notes for "no warranty" cases explaining the reasons.
     */
    private String noWarrantyReason;
    
    /**
     * Whether manual cleaning is required.
     */
    private Boolean manualCleaning;
    
    /**
     * Whether the item is heavily soiled.
     */
    private Boolean heavilySoiled;
    
    /**
     * Extra charge percentage for heavily soiled items.
     */
    private Integer heavilySoiledPercentage;
    
    /**
     * Whether this is a child-sized item (under size 30).
     */
    private Boolean childSized;
    
    /**
     * List of modifiers to apply to this item.
     */
    @Valid
    @Builder.Default
    private List<OrderItemModifierCreateRequest> modifiers = new ArrayList<>();
    
    /**
     * List of stains on this item.
     */
    @Valid
    @Builder.Default
    private List<OrderItemStainCreateRequest> stains = new ArrayList<>();
    
    /**
     * List of defects on this item.
     */
    @Valid
    @Builder.Default
    private List<OrderItemDefectCreateRequest> defects = new ArrayList<>();
}
