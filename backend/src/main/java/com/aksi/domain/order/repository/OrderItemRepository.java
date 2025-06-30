package com.aksi.domain.order.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.enums.DefectType;
import com.aksi.domain.order.enums.ServiceCategory;
import com.aksi.domain.order.enums.StainType;

/** Repository для роботи з предметами замовлення */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemEntity, UUID> {

  /** Знаходить всі предмети замовлення */
  @Query("SELECT i FROM OrderItemEntity i WHERE i.order.id = :orderId")
  List<OrderItemEntity> findByOrderId(@Param("orderId") UUID orderId);

  /** Знаходить предмети за категорією послуги */
  List<OrderItemEntity> findByCategory(ServiceCategory category);

  /** Знаходить предмети за матеріалом */
  Page<OrderItemEntity> findByMaterialContainingIgnoreCase(String material, Pageable pageable);

  /** Знаходить предмети з певним типом плям */
  @Query("SELECT DISTINCT i FROM OrderItemEntity i JOIN i.stains s WHERE s = :stainType")
  List<OrderItemEntity> findByStainType(@Param("stainType") StainType stainType);

  /** Знаходить предмети з певним типом дефектів */
  @Query("SELECT DISTINCT i FROM OrderItemEntity i JOIN i.defects d WHERE d = :defectType")
  List<OrderItemEntity> findByDefectType(@Param("defectType") DefectType defectType);

  /** Знаходить предмети з критичними дефектами */
  @Query("SELECT DISTINCT i FROM OrderItemEntity i JOIN i.defects d WHERE d IN (:criticalDefects)")
  List<OrderItemEntity> findItemsWithCriticalDefects(
      @Param("criticalDefects") List<DefectType> criticalDefects);

  /** Знаходить предмети що потребують спеціальної обробки */
  @Query("SELECT DISTINCT i FROM OrderItemEntity i JOIN i.stains s WHERE s IN (:specialStains)")
  List<OrderItemEntity> findItemsRequiringSpecialTreatment(
      @Param("specialStains") List<StainType> specialStains);

  /** Знаходить предмети за діапазоном цін */
  @Query("SELECT i FROM OrderItemEntity i WHERE i.finalPrice BETWEEN :minPrice AND :maxPrice")
  Page<OrderItemEntity> findByPriceRange(
      @Param("minPrice") BigDecimal minPrice,
      @Param("maxPrice") BigDecimal maxPrice,
      Pageable pageable);

  /** Рахує кількість предметів у замовленні */
  @Query("SELECT COUNT(i) FROM OrderItemEntity i WHERE i.order.id = :orderId")
  long countByOrderId(@Param("orderId") UUID orderId);

  /** Рахує загальну кількість всіх предметів у замовленні (з урахуванням quantity) */
  @Query("SELECT SUM(i.quantity) FROM OrderItemEntity i WHERE i.order.id = :orderId")
  Integer sumQuantityByOrderId(@Param("orderId") UUID orderId);

  /** Знаходить найдорожчі предмети */
  @Query("SELECT i FROM OrderItemEntity i ORDER BY i.finalPrice DESC")
  List<OrderItemEntity> findMostExpensiveItems(Pageable pageable);

  /** Знаходить предмети з найбільшим ступенем зносу */
  @Query(
      "SELECT i FROM OrderItemEntity i WHERE i.wearDegree >= :minWearDegree ORDER BY i.wearDegree DESC")
  List<OrderItemEntity> findItemsByWearDegree(@Param("minWearDegree") Integer minWearDegree);

  /** Знаходить предмети за кольором */
  List<OrderItemEntity> findByColorContainingIgnoreCase(String color);

  /** Знаходить предмети з фото */
  @Query("SELECT i FROM OrderItemEntity i WHERE SIZE(i.photos) > 0")
  List<OrderItemEntity> findItemsWithPhotos();

  /** Знаходить предмети без фото */
  @Query("SELECT i FROM OrderItemEntity i WHERE SIZE(i.photos) = 0")
  List<OrderItemEntity> findItemsWithoutPhotos();

  /** Пошук предметів за назвою */
  Page<OrderItemEntity> findByItemNameContainingIgnoreCase(String itemName, Pageable pageable);

  /** Знаходить предмети з примітками про дефекти */
  @Query(
      "SELECT i FROM OrderItemEntity i WHERE i.defectNotes IS NOT NULL AND LENGTH(i.defectNotes) > 0")
  List<OrderItemEntity> findItemsWithDefectNotes();

  /** Статистика по категоріях предметів */
  @Query(
      "SELECT i.category, COUNT(i), AVG(i.finalPrice) FROM OrderItemEntity i GROUP BY i.category")
  List<Object[]> getCategoryStatistics();

  /** Статистика по матеріалах */
  @Query(
      "SELECT i.material, COUNT(i), AVG(i.finalPrice) FROM OrderItemEntity i "
          + "WHERE i.material IS NOT NULL GROUP BY i.material ORDER BY COUNT(i) DESC")
  List<Object[]> getMaterialStatistics();

  /** Знаходить предмети з множинними дефектами */
  @Query("SELECT i FROM OrderItemEntity i WHERE SIZE(i.defects) > 1")
  List<OrderItemEntity> findItemsWithMultipleDefects();

  /** Знаходить предмети з множинними плямами */
  @Query("SELECT i FROM OrderItemEntity i WHERE SIZE(i.stains) > 1")
  List<OrderItemEntity> findItemsWithMultipleStains();

  /** Знаходить предмети за комбінацією категорії та матеріалу */
  @Query(
      "SELECT i FROM OrderItemEntity i WHERE i.category = :category AND i.material LIKE %:material%")
  List<OrderItemEntity> findByCategoryAndMaterial(
      @Param("category") ServiceCategory category, @Param("material") String material);

  /** Знаходить дублікати предметів в замовленні (за назвою, матеріалом та кольором) */
  @Query(
      "SELECT i FROM OrderItemEntity i WHERE i.order.id = :orderId AND "
          + "EXISTS (SELECT i2 FROM OrderItemEntity i2 WHERE i2.order.id = :orderId AND i2.id != i.id AND "
          + "i2.itemName = i.itemName AND i2.material = i.material AND i2.color = i.color)")
  List<OrderItemEntity> findDuplicateItemsInOrder(@Param("orderId") UUID orderId);

  /** Знаходить предмети що потребують підтвердження клієнта */
  @Query(
      "SELECT DISTINCT i FROM OrderItemEntity i JOIN i.defects d WHERE d IN (:consentRequiredDefects)")
  List<OrderItemEntity> findItemsRequiringClientConsent(
      @Param("consentRequiredDefects") List<DefectType> consentRequiredDefects);
}
