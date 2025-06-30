package com.aksi.domain.item.entity;

import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import com.aksi.shared.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/** Entity для фотографій предметів */
@Entity
@Table(
    name = "item_photos",
    indexes = {
      @Index(name = "idx_item_photo_item", columnList = "item_id"),
      @Index(name = "idx_item_photo_order", columnList = "display_order"),
      @Index(name = "idx_item_photo_type", columnList = "photo_type")
    })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ItemPhotoEntity extends BaseEntity {

  @Column(name = "uuid", updatable = false, nullable = false, unique = true)
  @UuidGenerator
  private UUID uuid;

  @Column(name = "item_id", nullable = false)
  private UUID itemId; // посилання на предмет замовлення

  @Column(name = "file_path", nullable = false, length = 500)
  private String filePath;

  @Column(name = "file_name", nullable = false, length = 255)
  private String fileName;

  @Column(name = "original_name", length = 255)
  private String originalName;

  @Column(name = "content_type", nullable = false, length = 100)
  private String contentType;

  @Column(name = "file_size", nullable = false)
  private Long fileSize;

  @Column(name = "display_order", nullable = false)
  @Builder.Default
  private Integer displayOrder = 0;

  @Column(name = "photo_type", length = 50)
  @Builder.Default
  private String photoType = "GENERAL"; // GENERAL, STAIN, DEFECT, BEFORE, AFTER

  @Column(name = "description", columnDefinition = "TEXT")
  private String description;

  @Column(name = "is_primary", nullable = false)
  @Builder.Default
  private Boolean isPrimary = false;

  // Метадані для зображення
  @Column(name = "image_width")
  private Integer imageWidth;

  @Column(name = "image_height")
  private Integer imageHeight;

  @Column(name = "thumbnail_path", length = 500)
  private String thumbnailPath;

  // ===== BUSINESS МЕТОДИ =====

  /** Перевірити, чи є фото основним */
  public boolean isPrimaryPhoto() {
    return Boolean.TRUE.equals(isPrimary);
  }

  /** Перевірити, чи є файл зображенням */
  public boolean isImage() {
    return contentType != null && contentType.startsWith("image/");
  }

  /** Перевірити, чи є розмір файлу допустимим (до 10 МБ) */
  public boolean hasValidFileSize() {
    return fileSize != null && fileSize > 0 && fileSize <= 10_485_760; // 10 MB
  }

  /** Отримати розширення файлу */
  public String getFileExtension() {
    if (fileName == null) return "";
    int lastDot = fileName.lastIndexOf('.');
    return lastDot >= 0 ? fileName.substring(lastDot + 1).toLowerCase() : "";
  }

  /** Перевірити, чи є формат підтримуваним */
  public boolean isSupportedFormat() {
    String extension = getFileExtension();
    return "jpg".equals(extension)
        || "jpeg".equals(extension)
        || "png".equals(extension)
        || "gif".equals(extension)
        || "webp".equals(extension);
  }

  /** Перевірити, чи потрібен thumbnail */
  public boolean needsThumbnail() {
    return isImage()
        && (imageWidth == null || imageWidth > 300 || imageHeight == null || imageHeight > 300);
  }

  /** Встановити як основне фото */
  public void setAsPrimary() {
    this.isPrimary = true;
  }

  /** Зняти статус основного фото */
  public void unsetAsPrimary() {
    this.isPrimary = false;
  }

  /** Отримати форматований розмір файлу */
  public String getFormattedFileSize() {
    if (fileSize == null) return "0 B";

    if (fileSize < 1024) {
      return fileSize + " B";
    } else if (fileSize < 1048576) {
      return String.format("%.1f KB", fileSize / 1024.0);
    } else {
      return String.format("%.1f MB", fileSize / 1048576.0);
    }
  }

  /** Перевірити, чи має thumbnail */
  public boolean hasThumbnail() {
    return thumbnailPath != null && !thumbnailPath.trim().isEmpty();
  }

  /** Отримати відносний шлях до файлу */
  public String getRelativeFilePath() {
    if (filePath == null) return "";
    // Видаляємо базовий шлях якщо є
    return filePath.replaceFirst("^.*/uploads/", "/uploads/");
  }

  /** Отримати відносний шлях до thumbnail */
  public String getRelativeThumbnailPath() {
    if (thumbnailPath == null) return "";
    return thumbnailPath.replaceFirst("^.*/uploads/", "/uploads/");
  }

  /** Перевірити тип фото */
  public boolean isPhotoType(String type) {
    return type != null && type.equals(photoType);
  }

  /** Перевірити, чи є фото дефекту */
  public boolean isDefectPhoto() {
    return isPhotoType("DEFECT");
  }

  /** Перевірити, чи є фото плями */
  public boolean isStainPhoto() {
    return isPhotoType("STAIN");
  }

  /** Перевірити, чи є фото "до" обробки */
  public boolean isBeforePhoto() {
    return isPhotoType("BEFORE");
  }

  /** Перевірити, чи є фото "після" обробки */
  public boolean isAfterPhoto() {
    return isPhotoType("AFTER");
  }

  /** Отримати пріоритет для сортування */
  public int getSortPriority() {
    if (isPrimaryPhoto()) return 1;

    return switch (photoType) {
      case "BEFORE" -> 2;
      case "DEFECT" -> 3;
      case "STAIN" -> 4;
      case "GENERAL" -> 5;
      case "AFTER" -> 6;
      default -> 10;
    };
  }
}
