package com.aksi.domain.order.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Сутність для зберігання фотографій предметів замовлення.
 */
@Entity
@Table(name = "order_item_photos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemPhotoEntity {
    
    /**
     * Унікальний ідентифікатор фотографії.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    /**
     * Предмет замовлення, до якого відноситься фотографія.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private OrderItemEntity orderItem;
    
    /**
     * Шлях до файлу з фотографією.
     */
    @Column(name = "file_path", nullable = false)
    private String filePath;
    
    /**
     * Шлях до мініатюри фотографії.
     */
    @Column(name = "thumbnail_path")
    private String thumbnailPath;
    
    /**
     * JSON з анотаціями (маркуванням проблемних місць).
     */
    @Column(columnDefinition = "TEXT")
    private String annotations;
    
    /**
     * Текстовий опис до фотографії.
     */
    @Column(length = 100)
    private String description;
    
    /**
     * Дата і час створення фотографії.
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
