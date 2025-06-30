package com.aksi.domain.item.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.item.entity.ItemPhotoEntity;

import jakarta.persistence.criteria.Predicate;

/**
 * JPA Specifications для ItemPhotoEntity. Замінює складні @Query методи на type-safe Criteria API.
 */
public class ItemPhotoSpecification {

  /** Фотографії певного предмета. */
  public static Specification<ItemPhotoEntity> belongsToItem(UUID itemId) {
    return (root, query, criteriaBuilder) -> {
      if (itemId == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("itemId"), itemId);
    };
  }

  /** Основні фотографії. */
  public static Specification<ItemPhotoEntity> isPrimary() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("isPrimary"));
  }

  /** Не основні фотографії. */
  public static Specification<ItemPhotoEntity> isNotPrimary() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isFalse(root.get("isPrimary"));
  }

  /** Фотографії за типом. */
  public static Specification<ItemPhotoEntity> hasPhotoType(String photoType) {
    return (root, query, criteriaBuilder) -> {
      if (photoType == null || photoType.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("photoType"), photoType);
    };
  }

  /** Фотографії за типами (список). */
  public static Specification<ItemPhotoEntity> hasPhotoTypeIn(List<String> photoTypes) {
    return (root, query, criteriaBuilder) -> {
      if (photoTypes == null || photoTypes.isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return root.get("photoType").in(photoTypes);
    };
  }

  /** Фотографії дефектів. */
  public static Specification<ItemPhotoEntity> isDefectPhoto() {
    return hasPhotoType("DEFECT");
  }

  /** Фотографії плям. */
  public static Specification<ItemPhotoEntity> isStainPhoto() {
    return hasPhotoType("STAIN");
  }

  /** Фотографії до обробки. */
  public static Specification<ItemPhotoEntity> isBeforePhoto() {
    return hasPhotoType("BEFORE_PROCESSING");
  }

  /** Фотографії після обробки. */
  public static Specification<ItemPhotoEntity> isAfterPhoto() {
    return hasPhotoType("AFTER_PROCESSING");
  }

  /** Фінальні фотографії результату. */
  public static Specification<ItemPhotoEntity> isFinalResultPhoto() {
    return hasPhotoType("FINAL_RESULT");
  }

  /** Фотографії за розміром файлу (діапазон). */
  public static Specification<ItemPhotoEntity> fileSizeBetween(Long minSize, Long maxSize) {
    return (root, query, criteriaBuilder) -> {
      if (minSize == null && maxSize == null) {
        return criteriaBuilder.conjunction();
      }
      if (minSize == null) {
        return criteriaBuilder.lessThanOrEqualTo(root.get("fileSize"), maxSize);
      }
      if (maxSize == null) {
        return criteriaBuilder.greaterThanOrEqualTo(root.get("fileSize"), minSize);
      }
      return criteriaBuilder.between(root.get("fileSize"), minSize, maxSize);
    };
  }

  /** Фотографії з великим розміром файлу (більше порогу). */
  public static Specification<ItemPhotoEntity> isLargeFile(Long sizeThreshold) {
    return (root, query, criteriaBuilder) -> {
      if (sizeThreshold == null) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.greaterThan(root.get("fileSize"), sizeThreshold);
    };
  }

  /** Фотографії за типом контенту. */
  public static Specification<ItemPhotoEntity> hasContentType(String contentType) {
    return (root, query, criteriaBuilder) -> {
      if (contentType == null || contentType.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("contentType"), contentType);
    };
  }

  /** Фотографії за типами контенту (список). */
  public static Specification<ItemPhotoEntity> hasContentTypeIn(List<String> contentTypes) {
    return (root, query, criteriaBuilder) -> {
      if (contentTypes == null || contentTypes.isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return root.get("contentType").in(contentTypes);
    };
  }

  /** JPEG фотографії. */
  public static Specification<ItemPhotoEntity> isJpegPhoto() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.or(
            criteriaBuilder.equal(root.get("contentType"), "image/jpeg"),
            criteriaBuilder.equal(root.get("contentType"), "image/jpg"));
  }

  /** PNG фотографії. */
  public static Specification<ItemPhotoEntity> isPngPhoto() {
    return hasContentType("image/png");
  }

  /** WebP фотографії. */
  public static Specification<ItemPhotoEntity> isWebpPhoto() {
    return hasContentType("image/webp");
  }

  /** Фотографії з описом (містить текст). */
  public static Specification<ItemPhotoEntity> descriptionContains(String searchText) {
    return (root, query, criteriaBuilder) -> {
      if (searchText == null || searchText.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.like(
          criteriaBuilder.lower(root.get("description")), "%" + searchText.toLowerCase() + "%");
    };
  }

  /** Фотографії з оригінальним іменем файлу (містить). */
  public static Specification<ItemPhotoEntity> originalNameContains(String nameFragment) {
    return (root, query, criteriaBuilder) -> {
      if (nameFragment == null || nameFragment.trim().isEmpty()) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.like(
          criteriaBuilder.lower(root.get("originalName")), "%" + nameFragment.toLowerCase() + "%");
    };
  }

  /** Фотографії з мініатюрами. */
  public static Specification<ItemPhotoEntity> hasThumbnail() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isNotNull(root.get("thumbnailPath"));
  }

  /** Фотографії без мініатюр. */
  public static Specification<ItemPhotoEntity> hasNoThumbnail() {
    return (root, query, criteriaBuilder) -> criteriaBuilder.isNull(root.get("thumbnailPath"));
  }

  /** Фотографії з розмірами зображення. */
  public static Specification<ItemPhotoEntity> hasImageDimensions() {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.and(
            criteriaBuilder.isNotNull(root.get("imageWidth")),
            criteriaBuilder.isNotNull(root.get("imageHeight")));
  }

  /** Фотографії з високою роздільністю. */
  public static Specification<ItemPhotoEntity> isHighResolution(
      Integer minWidth, Integer minHeight) {
    return (root, query, criteriaBuilder) -> {
      var predicates = new ArrayList<Predicate>();

      if (minWidth != null) {
        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("imageWidth"), minWidth));
      }
      if (minHeight != null) {
        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("imageHeight"), minHeight));
      }

      return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
    };
  }

  /** Сортування за порядком відображення. */
  public static Specification<ItemPhotoEntity> orderByDisplayOrder() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.asc(root.get("displayOrder")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за датою створення (нові першими). */
  public static Specification<ItemPhotoEntity> orderByCreatedAtDesc() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.desc(root.get("createdAt")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за розміром файлу (найбільші першими). */
  public static Specification<ItemPhotoEntity> orderByFileSizeDesc() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(criteriaBuilder.desc(root.get("fileSize")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Сортування за типом фотографії та порядком відображення. */
  public static Specification<ItemPhotoEntity> orderByTypeAndDisplayOrder() {
    return (root, query, criteriaBuilder) -> {
      if (query != null) {
        query.orderBy(
            criteriaBuilder.asc(root.get("photoType")),
            criteriaBuilder.asc(root.get("displayOrder")));
      }
      return criteriaBuilder.conjunction();
    };
  }

  /** Підрахунок фотографій за предметом та типом. */
  public static Specification<ItemPhotoEntity> countByItemAndType(UUID itemId, String photoType) {
    return belongsToItem(itemId).and(hasPhotoType(photoType));
  }
}
