package com.aksi.repository.customer;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.customer.Customer;

/** Repository interface for Customer entity. */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

  Optional<Customer> findByPhonePrimary(String phone);

  Optional<Customer> findByEmail(String email);

  Optional<Customer> findByDiscountCardNumber(String cardNumber);

  @Query(
      "SELECT c FROM Customer c WHERE "
          + "(LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR "
          + "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR "
          + "c.phonePrimary LIKE CONCAT('%', :search, '%') OR "
          + "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND "
          + "c.active = true")
  Page<Customer> searchCustomers(@Param("search") String search, Pageable pageable);

  @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.phones WHERE c.id = :id")
  Optional<Customer> findByIdWithPhones(@Param("id") UUID id);

  @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.addresses WHERE c.id = :id")
  Optional<Customer> findByIdWithAddresses(@Param("id") UUID id);

  @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.preferences WHERE c.id = :id")
  Optional<Customer> findByIdWithPreferences(@Param("id") UUID id);

  Page<Customer> findByActiveTrue(Pageable pageable);

  Page<Customer> findByBlacklistedTrue(Pageable pageable);
}
