package com.aksi.domain.client.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
 * Spring Data JPA репозиторій для роботи з клієнтами.
 * Надає методи для CRUD операцій та спеціалізованого пошуку.
 */
@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {

    /**
     * Пошук клієнта за номером телефону
     */
    Optional<ClientEntity> findByPhone(String phone);

    /**
     * Пошук клієнта за email
     */
    Optional<ClientEntity> findByEmail(String email);

    /**
     * Перевірка існування клієнта з таким телефоном
     */
    boolean existsByPhone(String phone);

    /**
     * Перевірка існування клієнта з таким email
     */
    boolean existsByEmail(String email);

    /**
     * Пошук активних клієнтів
     */
    Page<ClientEntity> findByIsActiveTrue(Pageable pageable);

    /**
     * Пошук клієнтів за джерелом
     */
    Page<ClientEntity> findBySourceTypeAndIsActiveTrue(ClientSourceType sourceType, Pageable pageable);

    /**
     * Швидкий пошук клієнтів для OrderWizard - НАЙГОЛОВНІШИЙ МЕТОД
     * Пошук за прізвищем, ім'ям, телефоном, email з автозаповненням
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE c.isActive = true
        AND (
            LOWER(c.firstName) LIKE LOWER(CONCAT(:query, '%')) OR
            LOWER(c.lastName) LIKE LOWER(CONCAT(:query, '%')) OR
            LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :query, '%')) OR
            LOWER(CONCAT(c.lastName, ' ', c.firstName)) LIKE LOWER(CONCAT('%', :query, '%')) OR
            c.phone LIKE CONCAT('%', :query, '%') OR
            LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        ORDER BY
            CASE
                WHEN LOWER(c.lastName) LIKE LOWER(CONCAT(:query, '%')) THEN 1
                WHEN LOWER(c.firstName) LIKE LOWER(CONCAT(:query, '%')) THEN 2
                WHEN c.phone LIKE CONCAT(:query, '%') THEN 3
                ELSE 4
            END,
            c.lastName, c.firstName
        """)
    List<ClientEntity> quickSearch(@Param("query") String query, Pageable pageable);

    /**
     * Розширений пошук клієнтів з фільтрами
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE c.isActive = true
        AND (:firstName IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')))
        AND (:lastName IS NULL OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :lastName, '%')))
        AND (:phone IS NULL OR c.phone LIKE CONCAT('%', :phone, '%'))
        AND (:email IS NULL OR LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%')))
        AND (:city IS NULL OR LOWER(c.address.city) LIKE LOWER(CONCAT('%', :city, '%')))
        AND (:sourceType IS NULL OR c.sourceType = :sourceType)
        AND (:registrationDateFrom IS NULL OR c.createdAt >= :registrationDateFrom)
        AND (:registrationDateTo IS NULL OR c.createdAt <= :registrationDateTo)
        AND (:isVip IS NULL OR
             (:isVip = true AND (c.totalOrders >= 10 OR c.totalSpent >= 5000.0)) OR
             (:isVip = false AND (c.totalOrders < 10 AND c.totalSpent < 5000.0)))
        """)
    Page<ClientEntity> advancedSearch(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("city") String city,
            @Param("sourceType") ClientSourceType sourceType,
            @Param("registrationDateFrom") LocalDateTime registrationDateFrom,
            @Param("registrationDateTo") LocalDateTime registrationDateTo,
            @Param("isVip") Boolean isVip,
            Pageable pageable);

    /**
     * Пошук клієнтів з певним способом зв'язку
     */
    @Query("SELECT c FROM ClientEntity c JOIN c.communicationMethods cm WHERE cm = :method AND c.isActive = true")
    List<ClientEntity> findByCommunicationMethod(@Param("method") CommunicationMethodType method);

    /**
     * Пошук VIP клієнтів
     */
    @Query("SELECT c FROM ClientEntity c WHERE c.isActive = true AND (c.totalOrders >= 10 OR c.totalSpent >= 5000.0)")
    Page<ClientEntity> findVipClients(Pageable pageable);

    /**
     * Пошук неактивних клієнтів (давно не робили замовлення)
     */
    @Query("SELECT c FROM ClientEntity c WHERE c.isActive = true AND (c.lastOrderDate IS NULL OR c.lastOrderDate < :cutoffDate)")
    Page<ClientEntity> findInactiveClients(@Param("cutoffDate") LocalDateTime cutoffDate, Pageable pageable);

    /**
     * Підрахунок загальної кількості активних клієнтів
     */
    long countByIsActiveTrue();

    /**
     * Підрахунок клієнтів за джерелом
     */
    long countBySourceTypeAndIsActiveTrue(ClientSourceType sourceType);

    /**
     * Топ клієнти за сумою витрат
     */
    @Query("SELECT c FROM ClientEntity c WHERE c.isActive = true ORDER BY c.totalSpent DESC")
    Page<ClientEntity> findTopClientsBySpending(Pageable pageable);

    /**
     * Клієнти зареєстровані за період
     */
    @Query("SELECT c FROM ClientEntity c WHERE c.isActive = true AND c.createdAt BETWEEN :startDate AND :endDate")
    Page<ClientEntity> findClientsByRegistrationPeriod(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);
}
