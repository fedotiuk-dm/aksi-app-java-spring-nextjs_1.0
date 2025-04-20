package com.aksi.dto.order;

import com.aksi.dto.pricing.PriceListItemDto;
import com.aksi.dto.pricing.ServiceCategoryDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Data Transfer Object for OrderItem entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private UUID id;
    private UUID orderId;
    private ServiceCategoryDto serviceCategory;
    private PriceListItemDto priceListItem;
    private String name;
    private String unitOfMeasurement;
    private BigDecimal quantity;
    private String material;
    private String color;
    private String filler;
    private Boolean clumpedFiller;
    private Integer wearPercentage;
    private BigDecimal basePrice;
    private BigDecimal finalPrice;
    private String defectNotes;
    private Boolean noWarranty;
    private String noWarrantyReason;
    private Boolean manualCleaning;
    private Boolean heavilySoiled;
    private Integer heavilySoiledPercentage;
    private Boolean childSized;
    
    @Builder.Default
    private List<OrderItemModifierDto> modifiers = new ArrayList<>();
    
    @Builder.Default
    private List<OrderItemStainDto> stains = new ArrayList<>();
    
    @Builder.Default
    private List<OrderItemDefectDto> defects = new ArrayList<>();
    
    @Builder.Default
    private List<OrderItemPhotoDto> photos = new ArrayList<>();
}
