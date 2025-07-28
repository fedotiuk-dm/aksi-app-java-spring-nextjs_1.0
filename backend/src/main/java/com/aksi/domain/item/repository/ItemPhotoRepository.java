package com.aksi.domain.item.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.item.entity.ItemPhotoEntity;

/** Repository for ItemPhotoEntity */
@Repository
public interface ItemPhotoRepository extends JpaRepository<ItemPhotoEntity, UUID> {

  /**
   * Find all photos for a specific order item
   *
   * @param orderItemId the order item ID
   * @param sort the sort criteria
   * @return list of photos
   */
  List<ItemPhotoEntity> findByOrderItemId(UUID orderItemId, Sort sort);

  /**
   * Count photos for a specific order item
   *
   * @param orderItemId the order item ID
   * @return count of photos
   */
  long countByOrderItemId(UUID orderItemId);

  /**
   * Delete all photos for a specific order item
   *
   * @param orderItemId the order item ID
   */
  void deleteByOrderItemId(UUID orderItemId);

  /**
   * Get total size of photos for an order item
   *
   * @param orderItemId the order item ID
   * @return total size in bytes
   */
  @Query(
      "SELECT COALESCE(SUM(p.fileSize), 0) FROM ItemPhotoEntity p WHERE p.orderItemId = :orderItemId")
  Long getTotalSizeByOrderItemId(@Param("orderItemId") UUID orderItemId);
}
