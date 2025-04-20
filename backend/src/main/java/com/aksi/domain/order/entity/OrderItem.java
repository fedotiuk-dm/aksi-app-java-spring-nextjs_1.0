package com.aksi.domain.order.entity;

import com.aksi.domain.pricing.entity.PriceListItem;
import com.aksi.domain.pricing.entity.ServiceCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entity representing an item in an order in the dry cleaning system.
 */
@Entity
@Table(name = "order_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    /**
     * The order this item belongs to.
     */
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /**
     * The service category of this item.
     */
    @ManyToOne
    @JoinColumn(name = "service_category_id", nullable = false)
    private ServiceCategory serviceCategory;

    /**
     * The price list item associated with this order item.
     */
    @ManyToOne
    @JoinColumn(name = "price_list_item_id", nullable = false)
    private PriceListItem priceListItem;

    /**
     * Name of the item.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Unit of measurement ('piece' or 'kilogram').
     */
    @Column(name = "unit_of_measurement", nullable = false)
    private String unitOfMeasurement;

    /**
     * Quantity of items or weight in kilograms.
     */
    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;

    /**
     * Material of the item.
     */
    @Column(nullable = false)
    private String material;

    /**
     * Color of the item.
     */
    @Column(nullable = false)
    private String color;

    /**
     * Filler material (for applicable items like pillows, duvets, etc.).
     */
    @Column
    private String filler;

    /**
     * Whether the filler is clumped.
     */
    @Column(name = "clumped_filler")
    private Boolean clumpedFiller;

    /**
     * Degree of wear as a percentage.
     */
    @Column(name = "wear_percentage")
    private Integer wearPercentage;

    /**
     * Base price before any modifiers.
     */
    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    /**
     * Final price after all modifiers.
     */
    @Column(name = "final_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalPrice;

    /**
     * Notes about defects or special handling.
     */
    @Column(name = "defect_notes", columnDefinition = "TEXT")
    private String defectNotes;

    /**
     * Whether this item has no warranty for cleaning results.
     */
    @Column(name = "no_warranty")
    private Boolean noWarranty;

    /**
     * Notes for "no warranty" cases explaining the reasons.
     */
    @Column(name = "no_warranty_reason", columnDefinition = "TEXT")
    private String noWarrantyReason;

    /**
     * Whether manual cleaning is required.
     */
    @Column(name = "manual_cleaning")
    private Boolean manualCleaning;

    /**
     * Whether the item is heavily soiled.
     */
    @Column(name = "heavily_soiled")
    private Boolean heavilySoiled;

    /**
     * Extra charge percentage for heavily soiled items.
     */
    @Column(name = "heavily_soiled_percentage")
    private Integer heavilySoiledPercentage;

    /**
     * Whether this is a child-sized item (under size 30).
     */
    @Column(name = "child_sized")
    private Boolean childSized;

    /**
     * List of modifiers applied to this item.
     */
    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItemModifier> modifiers = new ArrayList<>();

    /**
     * List of stains on this item.
     */
    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItemStain> stains = new ArrayList<>();

    /**
     * List of defects on this item.
     */
    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItemDefect> defects = new ArrayList<>();

    /**
     * List of photos of this item.
     */
    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItemPhoto> photos = new ArrayList<>();

    /**
     * Add a modifier to this item.
     *
     * @param modifier The modifier to add
     */
    public void addModifier(OrderItemModifier modifier) {
        modifiers.add(modifier);
        modifier.setOrderItem(this);
    }

    /**
     * Remove a modifier from this item.
     *
     * @param modifier The modifier to remove
     */
    public void removeModifier(OrderItemModifier modifier) {
        modifiers.remove(modifier);
        modifier.setOrderItem(null);
    }

    /**
     * Add a stain to this item.
     *
     * @param stain The stain to add
     */
    public void addStain(OrderItemStain stain) {
        stains.add(stain);
        stain.setOrderItem(this);
    }

    /**
     * Remove a stain from this item.
     *
     * @param stain The stain to remove
     */
    public void removeStain(OrderItemStain stain) {
        stains.remove(stain);
        stain.setOrderItem(null);
    }

    /**
     * Add a defect to this item.
     *
     * @param defect The defect to add
     */
    public void addDefect(OrderItemDefect defect) {
        defects.add(defect);
        defect.setOrderItem(this);
    }

    /**
     * Remove a defect from this item.
     *
     * @param defect The defect to remove
     */
    public void removeDefect(OrderItemDefect defect) {
        defects.remove(defect);
        defect.setOrderItem(null);
    }

    /**
     * Add a photo to this item.
     *
     * @param photo The photo to add
     */
    public void addPhoto(OrderItemPhoto photo) {
        photos.add(photo);
        photo.setOrderItem(this);
    }

    /**
     * Remove a photo from this item.
     *
     * @param photo The photo to remove
     */
    public void removePhoto(OrderItemPhoto photo) {
        photos.remove(photo);
        photo.setOrderItem(null);
    }
}
