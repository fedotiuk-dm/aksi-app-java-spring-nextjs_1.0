package com.aksi.domain.client.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.client.dto.ClientProjection;
import com.aksi.domain.client.entity.ClientEntity;

/**
 * Репозиторій для роботи з клієнтами.
 */
@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, UUID> {

    /**
     * Пошук клієнта за номером телефону.
     * @param phone номер телефону
     * @return опціональний об'єкт клієнта
     */
    Optional<ClientEntity> findByPhone(String phone);

    /**
     * Пошук клієнта за email.
     * @param email email адреса
     * @return опціональний об'єкт клієнта
     */
    Optional<ClientEntity> findByEmail(String email);

    /**
     * Перевірка існування клієнта за номером телефону.
     * @param phone номер телефону
     * @return true, якщо клієнт існує
     */
    boolean existsByPhone(String phone);

    /**
     * Перевірка існування клієнта за email.
     * @param email email адреса
     * @return true, якщо клієнт існує
     */
    boolean existsByEmail(String email);

    /**
     * Пошук клієнтів за ключовим словом в імені, прізвищі, телефоні або email.
     * @param keyword ключове слово
     * @return список знайдених клієнтів
     */
    @Query("SELECT c FROM ClientEntity c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.phone LIKE CONCAT('%', :keyword, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ClientEntity> searchByKeyword(@Param("keyword") String keyword);

    /**
     * Пошук клієнтів за ключовим словом з пагінацією.
     *
     * @param keyword ключове слово для пошуку
     * @param pageable параметри пагінації
     * @return сторінка клієнтів
     */
    @Query("SELECT c FROM ClientEntity c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.phone LIKE CONCAT('%', :keyword, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ClientEntity> searchByKeywordPaged(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Розширений пошук клієнтів за всіма полями, включаючи адресу.
     *
     * @param keyword ключове слово для пошуку
     * @param pageable параметри пагінації
     * @return сторінка клієнтів
     */
    @Query("SELECT DISTINCT c FROM ClientEntity c LEFT JOIN c.address a WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.phone LIKE CONCAT('%', :keyword, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.street) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.building) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.fullAddress) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ClientEntity> fullTextSearch(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Оптимізований пошук клієнтів за всіма полями, включаючи ім'я.
     *
     * @param firstName ім'я або його частина
     * @param pageable параметри пагінації
     * @return сторінка клієнтів
     */
    @Query("SELECT c FROM ClientEntity c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))")
    Page<ClientEntity> findByFirstNameContainingIgnoreCase(@Param("firstName") String firstName, Pageable pageable);

    /**
     * Оптимізований пошук клієнтів за прізвищем для використання індексу.
     *
     * @param lastName прізвище або його частина
     * @param pageable параметри пагінації
     * @return сторінка клієнтів
     */
    @Query("SELECT c FROM ClientEntity c WHERE LOWER(c.lastName) LIKE LOWER(CONCAT('%', :lastName, '%'))")
    Page<ClientEntity> findByLastNameContainingIgnoreCase(@Param("lastName") String lastName, Pageable pageable);

    /**
     * Оптимізований пошук клієнтів за номером телефону для використання індексу.
     *
     * @param phone номер телефону або його частина
     * @param pageable параметри пагінації
     * @return сторінка клієнтів
     */
    @Query("SELECT c FROM ClientEntity c WHERE c.phone LIKE CONCAT('%', :phone, '%')")
    Page<ClientEntity> findByPhoneContaining(@Param("phone") String phone, Pageable pageable);

    /**
     * Оптимізований пошук клієнтів за email для використання індексу.
     *
     * @param email email або його частина
     * @param pageable параметри пагінації
     * @return сторінка клієнтів
     */
    @Query("SELECT c FROM ClientEntity c WHERE LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%'))")
    Page<ClientEntity> findByEmailContainingIgnoreCase(@Param("email") String email, Pageable pageable);

    /**
     * Оптимізований пошук клієнтів з використанням проекції для уникнення проблем lazy loading.
     * Повертає тільки необхідні поля клієнта без завантаження колекцій.
     *
     * @param keyword ключове слово для пошуку
     * @param pageable параметри пагінації
     * @return сторінка проекцій клієнтів
     */
    @Query("SELECT c.id as id, c.firstName as firstName, c.lastName as lastName, " +
           "c.phone as phone, c.email as email FROM ClientEntity c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.phone LIKE CONCAT('%', :keyword, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ClientProjection> searchClientsProjection(@Param("keyword") String keyword, Pageable pageable);

    /**
     * Розширений пошук клієнтів з використанням проекції, включаючи пошук за адресою.
     *
     * @param keyword ключове слово для пошуку
     * @param pageable параметри пагінації
     * @return сторінка проекцій клієнтів
     */
    @Query("SELECT c.id as id, c.firstName as firstName, c.lastName as lastName, " +
           "c.phone as phone, c.email as email FROM ClientEntity c LEFT JOIN c.address a WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.phone LIKE CONCAT('%', :keyword, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.city) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.street) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.building) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.fullAddress) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ClientProjection> fullTextSearchProjection(@Param("keyword") String keyword, Pageable pageable);
}
