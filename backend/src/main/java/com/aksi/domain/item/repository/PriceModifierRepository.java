package com.aksi.domain.item.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.item.entity.PriceModifierEntity;

/**
 * Repository для управління модифікаторами цін з JPA Specification підтримкою.
 * Складні запити винесені в PriceModifierSpecification.
 */
@Repository
public interface PriceModifierRepository extends JpaRepository<PriceModifierEntity, Long>,
                                                JpaSpecificationExecutor<PriceModifierEntity> {

    // Basic queries
    Optional<PriceModifierEntity> findByUuid(UUID uuid);

    List<PriceModifierEntity> findByUuidIn(List<UUID> uuids);

    Optional<PriceModifierEntity> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByCodeAndUuidNot(String code, UUID uuid);

    // Active modifiers
    List<PriceModifierEntity> findByIsActiveTrue();

    Page<PriceModifierEntity> findByIsActiveTrue(Pageable pageable);

    // СКЛАДНІ ЗАПИТИ ПЕРЕНЕСЕНІ В PriceModifierSpecification
    // Приклади використання:
    // repository.findAll(PriceModifierSpecification.isActive())
    // repository.findAll(PriceModifierSpecification.isPercentage())
    // repository.findAll(PriceModifierSpecification.applicableToCategory(categoryId))

    // Залишаємо тільки прості методи без складної логіки
}
