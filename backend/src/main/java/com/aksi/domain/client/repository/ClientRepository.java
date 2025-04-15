package com.aksi.domain.client.repository;

import com.aksi.domain.client.entity.Client;
import com.aksi.domain.client.entity.ClientStatus;
import com.aksi.domain.client.entity.LoyaltyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Репозиторій для роботи з клієнтами
 */
@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {
    
    /**
     * Пошук клієнтів за ключовим словом (ім'я, телефон, email)
     * @param keyword ключове слово для пошуку
     * @param pageable параметри сторінки
     * @return сторінка з клієнтами
     */
    @Query("SELECT c FROM Client c WHERE " +
           "LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.phone LIKE CONCAT('%', :keyword, '%') OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Client> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    /**
     * Перевірка чи існує клієнт з вказаним телефоном
     * @param phone телефон
     * @return true, якщо існує
     */
    boolean existsByPhone(String phone);
    
    /**
     * Перевірка чи існує клієнт з вказаним email
     * @param email електронна пошта
     * @return true, якщо існує
     */
    boolean existsByEmail(String email);
    
    /**
     * Пошук клієнтів з вказаним статусом
     * @param status статус клієнта
     * @param pageable параметри сторінки
     * @return сторінка з клієнтами
     */
    Page<Client> findByStatus(ClientStatus status, Pageable pageable);
    
    /**
     * Пошук клієнтів з вказаним рівнем лояльності
     * @param loyaltyLevel рівень лояльності
     * @param pageable параметри сторінки
     * @return сторінка з клієнтами
     */
    Page<Client> findByLoyaltyLevel(LoyaltyLevel loyaltyLevel, Pageable pageable);
    
    /**
     * Пошук клієнтів з найвищим рівнем лояльності
     * @param pageable параметри сторінки
     * @return список клієнтів
     */
    @Query("SELECT c FROM Client c WHERE c.status = 'ACTIVE' ORDER BY c.loyaltyLevel DESC, c.totalSpent DESC")
    List<Client> findTopLoyalClients(Pageable pageable);
    
    /**
     * Пошук клієнтів з найбільшою сумою замовлень
     * @param pageable параметри сторінки
     * @return список клієнтів
     */
    @Query("SELECT c FROM Client c WHERE c.status = 'ACTIVE' ORDER BY c.totalSpent DESC")
    List<Client> findTopSpendingClients(Pageable pageable);
} 