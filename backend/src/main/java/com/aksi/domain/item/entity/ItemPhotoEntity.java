package com.aksi.domain.item.entity;

import java.util.UUID;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity for storing item photos */
@Entity
@Table(
    name = "item_photos",
    indexes = @Index(name = "idx_photo_order_item", columnList = "order_item_id"))
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemPhotoEntity extends BaseEntity {

  @Column(name = "order_item_id", nullable = false)
  private UUID orderItemId;

  @Column(name = "file_name", nullable = false)
  private String fileName;

  @Column(name = "file_type", nullable = false, length = 50)
  private String fileType;

  @Column(name = "file_size", nullable = false)
  private Long fileSize;

  @Column(name = "storage_path", nullable = false)
  private String storagePath;

  @Column(name = "thumbnail_path")
  private String thumbnailPath;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "uploaded_by", nullable = false)
  private UUID uploadedBy;
}
