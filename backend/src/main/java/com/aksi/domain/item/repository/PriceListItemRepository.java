package com.aksi.domain.item.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.item.entity.PriceListItemEntity;

/**
 * Repository для предметів прайс-листа з JPA Specification підтримкою. Складні запити винесені в
 * PriceListItemSpecification.
 */
@Repository
public interface PriceListItemRepository
    extends JpaRepository<PriceListItemEntity, Long>,
        JpaSpecificationExecutor<PriceListItemEntity> {

  /** Знайти предмет за UUID */
  Optional<PriceListItemEntity> findByUuid(UUID uuid);

  /** Знайти предмети за категорією */
  List<PriceListItemEntity> findByCategoryId(UUID categoryId);

  /** Знайти активні предмети за категорією */
  List<PriceListItemEntity> findByCategoryIdAndIsActiveTrue(UUID categoryId);

  /** Знайти предмети за категорією з пагінацією */
  Page<PriceListItemEntity> findByCategoryId(UUID categoryId, Pageable pageable);

  /** Знайти активні предмети за категорією з пагінацією */
  Page<PriceListItemEntity> findByCategoryIdAndIsActiveTrue(UUID categoryId, Pageable pageable);

  /** Знайти предмет за каталоговим номером */
  Optional<PriceListItemEntity> findByCatalogNumber(Integer catalogNumber);

  /** Перевірити існування предмета за каталоговим номером */
  boolean existsByCatalogNumber(Integer catalogNumber);

  /** Перевірити існування предмета за каталоговим номером (виключаючи вказаний) */
  boolean existsByCatalogNumberAndUuidNot(Integer catalogNumber, UUID uuid);

  /** Знайти всі активні предмети */
  List<PriceListItemEntity> findByIsActiveTrue();

  /** Знайти всі активні предмети з пагінацією */
  Page<PriceListItemEntity> findByIsActiveTrue(Pageable pageable);

  /** Знайти предмети за активністю */
  List<PriceListItemEntity> findByIsActive(Boolean isActive);

  /** Знайти предмети за активністю з пагінацією */
  Page<PriceListItemEntity> findByIsActive(Boolean isActive, Pageable pageable);

  /** Знайти предмети за одиницею виміру */
  List<PriceListItemEntity> findByUnitOfMeasure(String unitOfMeasure);

  /** Пошук предметів за назвою (регістронезалежний) */
  List<PriceListItemEntity> findByNameContainingIgnoreCase(String name);

  /** Пошук предметів за назвою в межах категорії (регістронезалежний) */
  List<PriceListItemEntity> findByCategoryIdAndNameContainingIgnoreCase(
      UUID categoryId, String name);

  // СКЛАДНІ ЗАПИТИ ПЕРЕНЕСЕНІ В PriceListItemSpecification
  // Приклади використання:
  // repository.findAll(PriceListItemSpecification.isActive())
  // repository.findAll(PriceListItemSpecification.nameContains("сорочка"))
  // repository.findAll(PriceListItemSpecification.quickSearch(categoryId, searchTerm))

  // Залишаємо тільки прості методи без складної логіки
}
