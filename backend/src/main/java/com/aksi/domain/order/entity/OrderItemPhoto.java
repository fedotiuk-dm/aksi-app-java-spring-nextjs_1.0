package com.aksi.domain.order.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entity representing a photo of an order item.
 */
@Entity
@Table(name = "order_item_photos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    /**
     * The order item this photo belongs to.
     */
    @ManyToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    /**
     * The filename of the photo stored in the file system.
     */
    @Column(name = "file_name", nullable = false)
    private String fileName;

    /**
     * URL or path to access the photo.
     */
    @Column(nullable = false)
    private String url;

    /**
     * MIME type of the photo (e.g., image/jpeg, image/png).
     */
    @Column(name = "content_type", nullable = false)
    private String contentType;

    /**
     * Size of the photo in bytes.
     */
    @Column(nullable = false)
    private Long size;

    /**
     * Optional description or notes about the photo.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Coordinates of annotations on the photo, stored as JSON.
     */
    @Column(name = "annotation_data", columnDefinition = "TEXT")
    private String annotationData;

    /**
     * Date and time when the photo was uploaded.
     */
    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;
}
