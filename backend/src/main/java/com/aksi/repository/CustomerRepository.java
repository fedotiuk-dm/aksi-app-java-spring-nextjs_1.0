package com.aksi.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.aksi.domain.customer.Customer;

/** Repository interface for Customer entity. */
@Repository
public interface CustomerRepository
    extends JpaRepository<Customer, UUID>, JpaSpecificationExecutor<Customer> {}
