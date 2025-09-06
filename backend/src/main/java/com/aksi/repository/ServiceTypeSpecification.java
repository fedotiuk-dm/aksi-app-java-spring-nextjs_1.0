package com.aksi.repository;

import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;

import com.aksi.domain.game.ServiceTypeEntity;

public class ServiceTypeSpecification {

  public static Specification<ServiceTypeEntity> hasActive(Boolean active) {
    return SpecificationUtils.hasActive(active);
  }

  public static Specification<ServiceTypeEntity> hasGameId(UUID gameId) {
    return SpecificationUtils.hasGameId(gameId);
  }

  public static Specification<ServiceTypeEntity> searchByNameOrCode(String search) {
    return SpecificationUtils.searchByNameOrCode(search);
  }

  public static Specification<ServiceTypeEntity> orderBySortOrder() {
    return SpecificationUtils.orderBySortOrder();
  }

  /** Creates a specification for finding active service types ordered by sort order. */
  public static Specification<ServiceTypeEntity> findActiveOrderedBySortOrder() {
    return Specification.allOf(hasActive(true), orderBySortOrder());
  }

  /** Creates a specification for finding active service types by game ID. */
  public static Specification<ServiceTypeEntity> findActiveByGameId(UUID gameId) {
    return Specification.allOf(hasActive(true), hasGameId(gameId), orderBySortOrder());
  }

  /** Creates a specification for finding all service types by game ID. */
  public static Specification<ServiceTypeEntity> findByGameId(UUID gameId) {
    return Specification.allOf(hasGameId(gameId), orderBySortOrder());
  }

  /** Creates a specification for filtering service types with search. */
  public static Specification<ServiceTypeEntity> filterServiceTypes(
      Boolean active, UUID gameId, String searchTerm) {

    return Specification.allOf(
        hasActive(active), hasGameId(gameId), searchByNameOrCode(searchTerm), orderBySortOrder());
  }

  /** Creates a specification for searching service types by name. */
  public static Specification<ServiceTypeEntity> searchByName(String searchTerm) {
    return Specification.allOf(
        hasActive(true), SpecificationUtils.searchByNameOrCode(searchTerm), orderBySortOrder());
  }

  /** Creates a specification for finding distinct game categories. */
  public static Specification<ServiceTypeEntity> findDistinctGameCategories() {
    return Specification.allOf(hasActive(true), SpecificationUtils.findDistinctGameCategories());
  }
}
