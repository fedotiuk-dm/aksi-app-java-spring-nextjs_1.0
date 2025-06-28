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

/**
 * Repository для роботи з клієнтами
 * Базується на OpenAPI ClientSearchRequest схемі
 */
@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {

    // Базові методи пошуку

    /**
     * Пошук клієнта за UUID (для API сумісності)
     */
    Optional<ClientEntity> findByUuid(UUID uuid);

    /**
     * Перевірка існування клієнта за UUID
     */
    boolean existsByUuid(UUID uuid);

    /**
     * Пошук клієнта за номером телефону
     */
    Optional<ClientEntity> findByPhone(String phone);

    /**
     * Перевірка існування клієнта з таким телефоном
     */
    boolean existsByPhone(String phone);

    /**
     * Пошук клієнта за email
     */
    Optional<ClientEntity> findByEmail(String email);

    /**
     * Перевірка існування клієнта з таким email
     */
    boolean existsByEmail(String email);

    /**
     * Пошук клієнтів за ім'ям та прізвищем
     */
    List<ClientEntity> findByFirstNameAndLastName(String firstName, String lastName);

    // Швидкий пошук для OrderWizard

    /**
     * Швидкий пошук клієнтів за запитом (ім'я, прізвище, телефон, email)
     * Використовується в OrderWizard для автозаповнення
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))
        ORDER BY c.lastName, c.firstName
        """)
    List<ClientEntity> quickSearch(@Param("query") String query, Pageable pageable);

    // Розширений пошук на основі ClientSearchRequest

    /**
     * Розширений пошук клієнтів з фільтрами
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE (:query IS NULL OR
               LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :query, '%')) OR
               LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR
               LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%')))
          AND (:firstName IS NULL OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :firstName, '%')))
          AND (:lastName IS NULL OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :lastName, '%')))
          AND (:phone IS NULL OR c.phone LIKE CONCAT('%', :phone, '%'))
          AND (:email IS NULL OR LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%')))
          AND (:city IS NULL OR LOWER(c.address.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:sourceType IS NULL OR c.sourceType = :sourceType)
          AND (:registrationDateFrom IS NULL OR DATE(c.createdAt) >= :registrationDateFrom)
          AND (:registrationDateTo IS NULL OR DATE(c.createdAt) <= :registrationDateTo)
          AND (:isVip IS NULL OR c.isVip = :isVip)
        """)
    Page<ClientEntity> advancedSearch(
            @Param("query") String query,
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("city") String city,
            @Param("sourceType") ClientSourceType sourceType,
            @Param("registrationDateFrom") LocalDate registrationDateFrom,
            @Param("registrationDateTo") LocalDate registrationDateTo,
            @Param("isVip") Boolean isVip,
            Pageable pageable);

    // Статистичні запити

    /**
     * Підрахунок загальної кількості клієнтів
     */
    @Query("SELECT COUNT(c) FROM ClientEntity c")
    Long countTotalClients();

    /**
     * Підрахунок VIP клієнтів
     */
    @Query("SELECT COUNT(c) FROM ClientEntity c WHERE c.isVip = true")
    Long countVipClients();

    /**
     * Пошук клієнтів за джерелом надходження
     */
    List<ClientEntity> findBySourceType(ClientSourceType sourceType);

    /**
     * Пошук клієнтів зареєстрованих в певний період
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE DATE(c.createdAt) BETWEEN :fromDate AND :toDate
        ORDER BY c.createdAt DESC
        """)
    List<ClientEntity> findByRegistrationDateBetween(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);

    /**
     * Топ клієнти за кількістю замовлень
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE c.totalOrders > 0
        ORDER BY c.totalOrders DESC, c.totalSpent DESC
        """)
    List<ClientEntity> findTopClientsByOrders(Pageable pageable);

    /**
     * Топ клієнти за сумою витрат
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE c.totalSpent > 0
        ORDER BY c.totalSpent DESC, c.totalOrders DESC
        """)
    List<ClientEntity> findTopClientsBySpending(Pageable pageable);

    /**
     * Клієнти без замовлень (потенційні для реактивації)
     */
    @Query("SELECT c FROM ClientEntity c WHERE c.totalOrders = 0")
    List<ClientEntity> findClientsWithoutOrders();

    /**
     * Клієнти з останнім замовленням раніше заданої дати
     */
    @Query("""
        SELECT c FROM ClientEntity c
        WHERE c.lastOrderDate IS NOT NULL AND c.lastOrderDate < :cutoffDate
        ORDER BY c.lastOrderDate DESC
        """)
    List<ClientEntity> findInactiveClientsSince(@Param("cutoffDate") LocalDate cutoffDate);
}
