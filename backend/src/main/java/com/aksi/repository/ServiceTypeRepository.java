package com.aksi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.game.ServiceTypeEntity;

@Repository
public interface ServiceTypeRepository
    extends JpaRepository<ServiceTypeEntity, java.util.UUID>,
        JpaSpecificationExecutor<ServiceTypeEntity> {

  Optional<ServiceTypeEntity> findByCode(String code);

  boolean existsByCode(String code);

  List<ServiceTypeEntity> findByActiveTrue();

  @Query(
      "SELECT st FROM ServiceTypeEntity st JOIN st.game g WHERE st.active = true AND g.category = :category ORDER BY st.sortOrder ASC")
  List<ServiceTypeEntity> findActiveByCategoryOrderBySortOrder(@Param("category") String category);

  @Query(
      "SELECT DISTINCT g.category FROM ServiceTypeEntity st JOIN st.game g WHERE st.active = true ORDER BY g.category")
  List<String> findDistinctCategories();

  @Query(
      "SELECT st FROM ServiceTypeEntity st WHERE st.active = true AND LOWER(st.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY st.sortOrder ASC")
  List<ServiceTypeEntity> searchByName(@Param("searchTerm") String searchTerm);

  /** Find active service types by game ID. */
  List<ServiceTypeEntity> findByGameIdAndActiveTrue(UUID gameId);

  /** Check if service type exists by code and ID not equal. */
  boolean existsByCodeAndIdNot(String code, UUID id);

  /** Check if service type exists by game ID and code. */
  boolean existsByGameIdAndCode(UUID gameId, String code);

  /** Find service type by game ID and code. */
  Optional<ServiceTypeEntity> findByGameIdAndCode(UUID gameId, String code);

  /** Find service types with search and pagination. */
  @Query(
      "SELECT st FROM ServiceTypeEntity st WHERE "
          + "(:active IS NULL OR st.active = :active) AND "
          + "(:gameId IS NULL OR st.game.id = :gameId) AND "
          + "(:searchTerm IS NULL OR LOWER(st.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
          + " LOWER(st.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
          + " LOWER(st.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
  Page<ServiceTypeEntity> findServiceTypesWithSearch(
      @Param("active") Boolean active,
      @Param("gameId") UUID gameId,
      @Param("searchTerm") String searchTerm,
      Pageable pageable);

  /** Check if service type has active price configurations. */
  @Query(
      "SELECT COUNT(pc) > 0 FROM PriceConfigurationEntity pc WHERE pc.serviceType.id = :serviceTypeId AND pc.active = true")
  boolean hasActivePriceConfigurations(@Param("serviceTypeId") UUID serviceTypeId);

  /** Find active service types ordered by sort order. */
  List<ServiceTypeEntity> findByActiveTrueOrderBySortOrderAsc();
}
