package com.aksi.domain.order.entity;

import com.aksi.domain.client.entity.Client;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing a draft (temporary save) of an order in the dry cleaning system.
 */
@Entity
@Table(name = "order_drafts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDraft {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    /**
     * The client associated with this draft order.
     */
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
    
    /**
     * Date and time when the draft was created.
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    /**
     * Date and time when the draft was last updated.
     */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * JSON data containing all order information in draft state.
     */
    @Column(name = "draft_data", columnDefinition = "TEXT", nullable = false)
    private String draftData;
    
    /**
     * The user who created/owns this draft.
     */
    @Column(name = "created_by", nullable = false)
    private String createdBy;
    
    /**
     * Indicates whether this draft was converted to an actual order.
     */
    @Column(name = "converted_to_order")
    private boolean convertedToOrder;
    
    /**
     * Optional reference to the order ID if this draft was converted to an order.
     */
    @Column(name = "order_id")
    private UUID orderId;
    
    /**
     * A brief description or name for this draft.
     */
    @Column(name = "draft_name")
    private String draftName;
}
