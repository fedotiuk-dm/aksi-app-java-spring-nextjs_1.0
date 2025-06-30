package com.aksi.domain.item.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.item.entity.ServiceCategoryEntity;

/**
 * Repository для категорій послуг з JPA Specification підтримкою.
 * Складні запити винесені в ServiceCategorySpecification.
 */
@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategoryEntity, Long>,
                                                  JpaSpecificationExecutor<ServiceCategoryEntity> {

    /**
     * Знайти категорію за UUID
     */
    Optional<ServiceCategoryEntity> findByUuid(UUID uuid);

    /**
     * Знайти категорію за кодом
     */
    Optional<ServiceCategoryEntity> findByCode(String code);

    /**
     * Перевірити існування категорії за кодом
     */
    boolean existsByCode(String code);

    /**
     * Перевірити існування категорії за кодом (виключаючи вказану)
     */
    boolean existsByCodeAndUuidNot(String code, UUID uuid);

    /**
     * Знайти всі активні категорії
     */
    List<ServiceCategoryEntity> findByIsActiveTrue();

    /**
     * Знайти категорії за активністю
     */
    List<ServiceCategoryEntity> findByIsActive(Boolean isActive);

    /**
     * Знайти батьківські категорії (без parentId)
     */
    List<ServiceCategoryEntity> findByParentIdIsNull();

    /**
     * Знайти дочірні категорії по parentId
     */
    List<ServiceCategoryEntity> findByParentId(UUID parentId);

    /**
     * Знайти активні категорії з певним батьком
     */
    List<ServiceCategoryEntity> findByParentIdAndIsActiveTrue(UUID parentId);

    // СКЛАДНІ ЗАПИТИ ПЕРЕНЕСЕНІ В ServiceCategorySpecification
    // Використовувати: categoryRepository.findAll(ServiceCategorySpecification.isActive())

    // Залишаємо тільки прості методи без складної логіки
}
