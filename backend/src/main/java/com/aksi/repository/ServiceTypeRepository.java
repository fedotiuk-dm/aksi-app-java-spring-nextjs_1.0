package com.aksi.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.api.game.dto.Game.CategoryEnum;
import com.aksi.domain.game.ServiceTypeEntity;

@Repository
public interface ServiceTypeRepository
    extends JpaRepository<ServiceTypeEntity, UUID>, JpaSpecificationExecutor<ServiceTypeEntity> {

  Optional<ServiceTypeEntity> findByCode(String code);

  boolean existsByCode(String code);

  /**
   * Find distinct game categories from active service types using specifications. Used in
   * ServiceTypeQueryService.
   */
  default List<CategoryEnum> findDistinctCategories() {
    return findAll(ServiceTypeSpecification.findDistinctGameCategories()).stream()
        .map(serviceType -> serviceType.getGame().getCategory())
        .distinct()
        .sorted()
        .toList();
  }

  /** Search service types by name using specifications. Used in ServiceTypeQueryService. */
  default List<ServiceTypeEntity> searchByName(String searchTerm) {
    return findAll(ServiceTypeSpecification.searchByName(searchTerm));
  }

  /** Find active service types by game ID using specifications. */
  default List<ServiceTypeEntity> findByGameIdAndActiveTrue(UUID gameId) {
    return findAll(ServiceTypeSpecification.findActiveByGameId(gameId));
  }

  /** Find all service types by game ID. */
  default List<ServiceTypeEntity> findByGameId(UUID gameId) {
    return findAll(ServiceTypeSpecification.findByGameId(gameId));
  }

  /** Check if service type exists by code and ID not equal. */
  boolean existsByCodeAndIdNot(String code, UUID id);

  /** Find service types with search and pagination using specifications. */
  default Page<ServiceTypeEntity> findServiceTypesWithSearch(
      Boolean active, UUID gameId, String searchTerm, Pageable pageable) {

    return findAll(
        ServiceTypeSpecification.filterServiceTypes(active, gameId, searchTerm), pageable);
  }

  /**
   * Check if service type has active price configurations. This method requires a @Query since it
   * involves cross-entity relationship. Used in ServiceTypeValidationService.
   */
  @Query(
      "SELECT CASE WHEN COUNT(pc) > 0 THEN true ELSE false END "
          + "FROM PriceConfigurationEntity pc "
          + "WHERE pc.serviceType.id = :serviceTypeId AND pc.active = true")
  boolean hasActivePriceConfigurations(@Param("serviceTypeId") UUID serviceTypeId);

  /** Find active service types ordered by sort order using specifications. */
  default List<ServiceTypeEntity> findByActiveTrueOrderBySortOrderAsc() {
    return findAll(ServiceTypeSpecification.findActiveOrderedBySortOrder());
  }

  /** Find service type by game ID and code using specifications. */
  default Optional<ServiceTypeEntity> findByGameIdAndCode(UUID gameId, String code) {
    return findAll(
            Specification.allOf(
                ServiceTypeSpecification.findActiveByGameId(gameId),
                SpecificationUtils.hasCode(code)))
        .stream()
        .findFirst();
  }
}
