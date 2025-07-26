package com.aksi.domain.client.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.client.entity.ClientEntity;

/** Repository interface for client data access */
@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, UUID> {

  /** Find client by phone number */
  Optional<ClientEntity> findByPhone(String phone);

  /** Check if client exists by phone number */
  boolean existsByPhone(String phone);

  /** Search clients by query (case insensitive) Searches in firstName, lastName, phone, email */
  @Query(
      """
        SELECT c FROM ClientEntity c
        WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
           OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
           OR c.phone LIKE CONCAT('%', :query, '%')
           OR LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))
        ORDER BY c.lastName, c.firstName
        """)
  List<ClientEntity> searchClients(@Param("query") String query, Pageable pageable);

  /** Update client statistics after order creation */
  @Modifying
  @Query(
      """
        UPDATE ClientEntity c
        SET c.orderCount = c.orderCount + 1,
            c.totalSpent = c.totalSpent + :amount,
            c.lastOrderDate = :orderDate
        WHERE c.id = :clientId
        """)
  void updateStatistics(
      @Param("clientId") UUID clientId,
      @Param("amount") BigDecimal amount,
      @Param("orderDate") LocalDate orderDate);
}
