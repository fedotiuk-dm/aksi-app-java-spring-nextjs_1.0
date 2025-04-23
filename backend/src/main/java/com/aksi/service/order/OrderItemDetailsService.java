package com.aksi.service.order;

import com.aksi.dto.order.OrderItemDefectDto;
import com.aksi.dto.order.OrderItemStainDto;

import java.util.UUID;

/**
 * Service interface for managing order item details like stains, defects, and risks.
 */
public interface OrderItemDetailsService {

    /**
     * Add a stain to an order item
     *
     * @param stainDto The stain details to add
     * @return The created OrderItemStainDto with assigned ID
     */
    OrderItemStainDto addStainToItem(OrderItemStainDto stainDto);

    /**
     * Add a defect to an order item
     *
     * @param defectDto The defect details to add
     * @return The created OrderItemDefectDto with assigned ID
     */
    OrderItemDefectDto addDefectToItem(OrderItemDefectDto defectDto);

    /**
     * Update defect notes for an order item
     *
     * @param itemId Order item ID
     * @param notes  Defect notes to set
     */
    void updateDefectNotes(UUID itemId, String notes);

    /**
     * Update no warranty status and reason for an order item
     *
     * @param itemId     Order item ID
     * @param noWarranty Whether the item has no warranty
     * @param reason     Reason for no warranty
     */
    void updateNoWarrantyStatus(UUID itemId, Boolean noWarranty, String reason);
}
