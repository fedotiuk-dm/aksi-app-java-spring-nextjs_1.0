package com.aksi.domain.client.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;

/**
 * Repository для роботи з клієнтами Використовує JpaSpecificationExecutor для type-safe dynamic
 * queries
 *
 * <p>ПРИНЦИПИ: 1. Складні динамічні запити → ClientSpecification 2. Прості запити → derived methods
 * (findBy*, countBy*, existsBy*) 3. Специфічні запити → @Query (тільки коли необхідно, як
 * quickSearch)
 */
@Repository
public interface ClientRepository
    extends JpaRepository<ClientEntity, UUID>, JpaSpecificationExecutor<ClientEntity> {

  // ==============================
  // БАЗОВІ МЕТОДИ ПОШУКУ (Derived Methods)
  // ==============================

  // findById(UUID) та existsById(UUID) успадковані з JpaRepository

  /** Пошук клієнта за номером телефону. */
  Optional<ClientEntity> findByPhone(String phone);

  /** Перевірка існування клієнта з таким телефоном. */
  boolean existsByPhone(String phone);

  /** Пошук клієнта за email. */
  Optional<ClientEntity> findByEmail(String email);

  /** Перевірка існування клієнта з таким email. */
  boolean existsByEmail(String email);

  /** Пошук клієнтів за ім'ям та прізвищем. */
  List<ClientEntity> findByFirstNameAndLastName(String firstName, String lastName);

  /** Пошук клієнтів за джерелом надходження. */
  List<ClientEntity> findBySourceType(ClientSourceType sourceType);

  // ==============================
  // СТАТИСТИЧНІ МЕТОДИ (Derived Methods)
  // ==============================

  /** Підрахунок VIP клієнтів (замість @Query). */
  long countByIsVipTrue();

  /** Підрахунок клієнтів за джерелом. */
  long countBySourceType(ClientSourceType sourceType);

  /** Перевірка чи є VIP клієнти. */
  boolean existsByIsVipTrue();

  // ==============================
  // СПЕЦІАЛЬНІ @QUERY МЕТОДИ
  // ==============================

  @Query(
      """
        SELECT c FROM ClientEntity c
        WHERE :query IS NOT NULL AND :query != '' AND (
            LOWER(CONCAT(COALESCE(c.firstName, ''), ' ', COALESCE(c.lastName, ''))) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(COALESCE(c.phone, '')) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(COALESCE(c.email, '')) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        ORDER BY c.lastName, c.firstName
        """)
  List<ClientEntity> quickSearch(@Param("query") String query, Pageable pageable);
}
