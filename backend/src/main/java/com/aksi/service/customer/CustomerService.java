package com.aksi.service.customer;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.aksi.api.customer.dto.CreateCustomerRequest;
import com.aksi.api.customer.dto.CustomerInfo;
import com.aksi.api.customer.dto.CustomerListResponse;
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
   * @param email Email filter (optional)
   * @param discountCard Discount card filter (optional)
   * @param pageable Pagination parameters
   * @return Page of customers
   */
  Page<CustomerInfo> searchCustomers(
      String search, String phone, String email, String discountCard, Pageable pageable);

  /**
   * List customers with offset/limit parameters following the API contract. Intended for thin
   * controllers: converts offset/limit to page internally and returns a paginated response with
   * metadata and data payload.
   *
   * @param search Search query (optional)
   * @param phone Phone filter (optional)
   * @param email Email filter (optional)
   * @param discountCard Discount card filter (optional)
   * @param offset Number of items to skip (0-based)
   * @param limit Number of items to return (page size)
   * @return CustomerListResponse with pagination metadata and list of customers
   */
  CustomerListResponse listCustomers(
      String search,
      String phone,
      String email,
      String discountCard,
      Integer offset,
      Integer limit);

  /**
   * Check if customer exists
   *
   * @param customerId Customer ID
   * @return true if exists
   */
  boolean existsById(UUID customerId);
}
