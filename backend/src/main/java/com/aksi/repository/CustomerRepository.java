package com.aksi.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.customer.Customer;

/** Repository interface for Customer entity */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

  /**
   * Find customer by phone number
   *
   * @param phone Phone number
   * @return Optional customer
   */
  Optional<Customer> findByPhonePrimary(String phone);

  /**
   * Find customer by email
   *
   * @param email Email address
   * @return Optional customer
   */
  Optional<Customer> findByEmail(String email);

  /**
   * Find customer by discount card number
   *
   * @param discountCardNumber Discount card number
   * @return Optional customer
   */
  Optional<Customer> findByDiscountCardNumber(String discountCardNumber);

  /**
   * Search customers by query
   *
   * @param search Search query (searches in name, phone, email)
   * @param pageable Pagination parameters
   * @return Page of customers
   */
  @Query(
      "SELECT c FROM Customer c WHERE "
          + "(:search IS NULL OR :search = '' OR "
          + "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR "
          + "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR "
          + "c.phonePrimary LIKE CONCAT('%', :search, '%') OR "
          + "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')))")
  Page<Customer> searchCustomers(@Param("search") String search, Pageable pageable);

  /**
   * Find customers by phone
   *
   * @param phone Phone number
   * @param pageable Pagination parameters
   * @return Page of customers
   */
  Page<Customer> findByPhonePrimaryContaining(String phone, Pageable pageable);
}
