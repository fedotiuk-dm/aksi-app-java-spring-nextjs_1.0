package com.aksi.domain.order;

import java.time.Instant;

import com.aksi.api.order.dto.PhotoType;
import com.aksi.domain.common.BaseEntity;
import com.aksi.domain.user.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Item photo entity for storing photo metadata for order items */
@Entity
@Table(
    name = "item_photos",
    indexes = {
      @Index(name = "idx_item_photo_order_item", columnList = "order_item_id"),
      @Index(name = "idx_item_photo_type", columnList = "photo_type"),
      @Index(name = "idx_item_photo_uploaded_at", columnList = "uploaded_at")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemPhotoEntity extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "order_item_id", nullable = false)
  private OrderItemEntity orderItemEntity;

  @Column(name = "url", nullable = false, length = 500)
  private String url;

  @Enumerated(EnumType.STRING)
  @Column(name = "photo_type", nullable = false, length = 20)
  private PhotoType type = PhotoType.GENERAL;

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "uploaded_at", nullable = false)
  private Instant uploadedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "uploaded_by")
  private UserEntity uploadedBy;

  @Column(name = "file_size")
  private Long fileSize;

  @Column(name = "content_type", length = 100)
  private String contentType;

  @Column(name = "original_filename")
  private String originalFilename;
}
