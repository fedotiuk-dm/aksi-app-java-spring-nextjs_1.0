package com.aksi.domain.branch.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.domain.branch.enums.BranchStatus;

/**
 * Repository для роботи з філіями. Використовує JpaSpecificationExecutor для композиційних запитів.
 */
@Repository
public interface BranchRepository
    extends JpaRepository<BranchEntity, UUID>, JpaSpecificationExecutor<BranchEntity> {

  // Основні пошукові методи (прості Spring Data методи)

  /** Знаходить філію за кодом */
  Optional<BranchEntity> findByCode(String code);

  /** Перевіряє чи існує філія з таким кодом */
  boolean existsByCode(String code);

  /** Знаходить всі філії за статусом */
  List<BranchEntity> findByStatus(BranchStatus status);

  /** Знаходить філії в конкретному місті */
  List<BranchEntity> findByCityIgnoreCase(String city);

  // Статистичні методи (залишаємо прості @Query)

  /** Підраховує кількість філій за статусом */
  long countByStatus(BranchStatus status);

  /** Підраховує активні філії */
  @Query("SELECT COUNT(b) FROM BranchEntity b WHERE b.status = 'ACTIVE'")
  long countActive();

  /** Знаходить міста з філіями */
  @Query("SELECT DISTINCT b.city FROM BranchEntity b WHERE b.city IS NOT NULL ORDER BY b.city")
  List<String> findAllCities();

  // Операції з лічильником квитанцій

  /** Оновлює лічильник квитанцій для філії */
  @Modifying
  @Query("UPDATE BranchEntity b SET b.receiptCounter = :counter WHERE b.id = :branchId")
  void updateReceiptCounter(@Param("branchId") UUID branchId, @Param("counter") Long counter);

  /** Інкрементує лічильник квитанцій */
  @Modifying
  @Query("UPDATE BranchEntity b SET b.receiptCounter = b.receiptCounter + 1 WHERE b.id = :branchId")
  void incrementReceiptCounter(@Param("branchId") UUID branchId);

  /** Отримує поточний лічильник квитанцій */
  @Query("SELECT b.receiptCounter FROM BranchEntity b WHERE b.id = :branchId")
  Optional<Long> getReceiptCounter(@Param("branchId") UUID branchId);

  // СКЛАДНІ ЗАПИТИ ПЕРЕНЕСЕНІ У BranchSpecification:
  // - findAllActive() -> BranchSpecification.isActive()
  // - findAllAvailableForCustomers() -> BranchSpecification.isAvailableForCustomers()
  // - findNearby() -> BranchSpecification.withinRadius()
  // - findNearbyWithDistance() -> BranchSpecification.withinRadius() + custom projection
  // - quickSearch() -> BranchSpecification.containsText()
  // - searchBranches() -> BranchSpecification.searchWithFilters()
}
