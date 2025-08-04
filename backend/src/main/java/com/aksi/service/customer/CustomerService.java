package com.aksi.service.customer;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aksi.api.customer.dto.CreateCustomerRequest;
import com.aksi.api.customer.dto.CustomerInfo;
import com.aksi.api.customer.dto.UpdateCustomerRequest;

/** Service interface for managing customers */
public interface CustomerService {

  /**
   * Create a new customer
   *
   * @param request Create customer request
   * @return Created customer info
   */
  CustomerInfo createCustomer(CreateCustomerRequest request);

  /**
   * Get customer by ID
   *
   * @param customerId Customer ID
   * @return Customer info
   */
  CustomerInfo getCustomer(UUID customerId);

  /**
   * Update customer
   *
   * @param customerId Customer ID
   * @param request Update customer request
   * @return Updated customer info
   */
  CustomerInfo updateCustomer(UUID customerId, UpdateCustomerRequest request);

  /**
   * Search customers
   *
   * @param search Search query (optional)
   * @param phone Phone filter (optional)
   * @param pageable Pagination parameters
   * @return Page of customers
   */
  Page<CustomerInfo> searchCustomers(String search, String phone, Pageable pageable);

  /**
   * Check if customer exists
   *
   * @param customerId Customer ID
   * @return true if exists
   */
  boolean existsById(UUID customerId);
}
