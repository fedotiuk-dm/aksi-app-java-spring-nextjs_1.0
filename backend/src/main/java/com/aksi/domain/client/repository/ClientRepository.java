package com.aksi.domain.client.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.enums.CommunicationMethodType;

/**
 * Repository для роботи з клієнтами
 * Підтримує всі типи пошуку згідно OpenAPI
 */
@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {

    // === ОСНОВНІ CRUD ОПЕРАЦІЇ ===

    /**
     * Пошук активного клієнта за UUID
     */
    Optional<ClientEntity> findByUuidAndIsActiveTrue(UUID uuid);

    /**
     * Пошук клієнта за телефоном (для перевірки унікальності)
     */
    Optional<ClientEntity> findByPhoneAndIsActiveTrue(String phone);

    /**
     * Всі активні клієнти з сортуванням
     */
    Page<ClientEntity> findByIsActiveTrueOrderByLastNameAscFirstNameAsc(Pageable pageable);

    // === ШВИДКИЙ ПОШУК (для Order Wizard) ===

    /**
     * Швидкий пошук клієнтів за ім'ям, прізвищем, телефоном, email
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE c.isActive = true
        AND (
            LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR
            LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR
            LOWER(CONCAT(c.lastName, ' ', c.firstName)) LIKE LOWER(CONCAT('%', :query, '%')) OR
            c.phone LIKE CONCAT('%', :query, '%') OR
            LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        ORDER BY c.lastName ASC, c.firstName ASC
        """)
    List<ClientEntity> quickSearch(@Param("query") String query, Pageable pageable);

    // === РОЗШИРЕНИЙ ПОШУК ===

    /**
     * Пошук за ім'ям (часткове співпадіння)
     */
    Page<ClientEntity> findByIsActiveTrueAndFirstNameContainingIgnoreCase(String firstName, Pageable pageable);

    /**
     * Пошук за прізвищем (часткове співпадіння)
     */
    Page<ClientEntity> findByIsActiveTrueAndLastNameContainingIgnoreCase(String lastName, Pageable pageable);

    /**
     * Пошук за email (часткове співпадіння)
     */
    Page<ClientEntity> findByIsActiveTrueAndEmailContainingIgnoreCase(String email, Pageable pageable);

    /**
     * Пошук за джерелом надходження
     */
    Page<ClientEntity> findByIsActiveTrueAndSourceType(ClientSourceType sourceType, Pageable pageable);

    /**
     * Пошук за способом зв'язку
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE c.isActive = true
        AND :communicationMethod MEMBER OF c.communicationMethods
        """)
    Page<ClientEntity> findByIsActiveTrueAndCommunicationMethodsContaining(
        @Param("communicationMethod") CommunicationMethodType communicationMethod,
        Pageable pageable);

    /**
     * Пошук за періодом реєстрації
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE c.isActive = true
        AND DATE(c.createdAt) BETWEEN :dateFrom AND :dateTo
        """)
    Page<ClientEntity> findByIsActiveTrueAndCreatedAtBetween(
        @Param("dateFrom") LocalDate dateFrom,
        @Param("dateTo") LocalDate dateTo,
        Pageable pageable);

    // === СТАТИСТИКА ===

    /**
     * Кількість активних клієнтів
     */
    long countByIsActiveTrue();

    /**
     * Кількість клієнтів за джерелом
     */
    long countByIsActiveTrueAndSourceType(ClientSourceType sourceType);

    /**
     * Клієнти зареєстровані за сьогодні
     */
    @Query("""
        SELECT COUNT(c) FROM ClientEntity c
        WHERE c.isActive = true
        AND DATE(c.createdAt) = CURRENT_DATE
        """)
    long countRegisteredToday();
}
