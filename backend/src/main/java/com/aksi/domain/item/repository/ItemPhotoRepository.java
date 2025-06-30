package com.aksi.domain.item.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.item.entity.ItemPhotoEntity;

/**
 * Repository для управління фотографіями предметів з JPA Specification підтримкою. Складні запити
 * винесені в ItemPhotoSpecification.
 */
@Repository
public interface ItemPhotoRepository
    extends JpaRepository<ItemPhotoEntity, Long>, JpaSpecificationExecutor<ItemPhotoEntity> {

  // Basic queries
  Optional<ItemPhotoEntity> findByUuid(UUID uuid);

  List<ItemPhotoEntity> findByItemId(UUID itemId);

  Page<ItemPhotoEntity> findByItemId(UUID itemId, Pageable pageable);

  // Primary photo queries
  Optional<ItemPhotoEntity> findByItemIdAndIsPrimaryTrue(UUID itemId);

  List<ItemPhotoEntity> findByIsPrimaryTrue();

  // Photo type queries
  List<ItemPhotoEntity> findByItemIdAndPhotoType(UUID itemId, String photoType);

  // File management queries (прості методи залишаємо)
  Optional<ItemPhotoEntity> findByFilePath(String filePath);

  boolean existsByFilePath(String filePath);

  // Utility methods (залишаємо для Service шару)
  @Modifying
  @Query("UPDATE ItemPhotoEntity ip SET ip.isPrimary = false WHERE ip.itemId = :itemId")
  void resetPrimaryFlagForItem(@Param("itemId") UUID itemId);

  @Modifying
  @Query(
      "UPDATE ItemPhotoEntity ip SET ip.displayOrder = ip.displayOrder - 1 "
          + "WHERE ip.itemId = :itemId AND ip.displayOrder > :deletedOrder")
  void adjustDisplayOrderAfterDeletion(
      @Param("itemId") UUID itemId, @Param("deletedOrder") Integer deletedOrder);

  // СКЛАДНІ ЗАПИТИ ПЕРЕНЕСЕНІ В ItemPhotoSpecification
  // Приклади використання:
  // repository.findAll(ItemPhotoSpecification.belongsToItem(itemId))
  // repository.findAll(ItemPhotoSpecification.isPrimary())
  // repository.findAll(ItemPhotoSpecification.hasPhotoType("DEFECT"))

  // Залишаємо тільки прості методи та utility операції
}
