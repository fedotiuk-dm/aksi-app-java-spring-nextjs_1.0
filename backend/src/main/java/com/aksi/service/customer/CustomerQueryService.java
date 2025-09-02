package com.aksi.service.customer;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.customer.dto.CustomerInfo;
import com.aksi.api.customer.dto.CustomerListResponse;
import com.aksi.domain.customer.CustomerEntity;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.CustomerMapper;
import com.aksi.repository.CustomerRepository;
import com.aksi.repository.CustomerSpecification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for customer read operations. All methods are read-only and optimized for queries.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class CustomerQueryService {

  private final CustomerRepository customerRepository;
  private final CustomerMapper customerMapper;

  /**
   * Get customer entity by ID or throw exception.
   *
   * @param customerId Customer ID
   * @return Customer entity
   * @throws NotFoundException if not found
   */
  public CustomerEntity getCustomerEntityById(UUID customerId) {
    return customerRepository
        .findById(customerId)
        .orElseThrow(() -> new NotFoundException("Customer not found: " + customerId));
  }

  /**
   * Get customer info by ID.
   *
   * @param customerId Customer ID
   * @return Customer info
   */
  public CustomerInfo getCustomer(UUID customerId) {
    log.debug("Getting customer by ID: {}", customerId);
    CustomerEntity customerEntity = getCustomerEntityById(customerId);
    return customerMapper.toCustomerInfo(customerEntity);
  }

  /**
   * Search customers with filters and pagination.
   *
   * @param search Search query (optional)
   * @param phone Phone filter (optional)
   * @param email Email filter (optional)
   * @param discountCard Discount card filter (optional)
   * @param pageable Pagination parameters
   * @return Page of customers
   */
  public Page<CustomerInfo> searchCustomers(
      String search, String phone, String email, String discountCard, Pageable pageable) {
    log.debug(
        "Searching customers - search: {}, phone: {}, email: {}, discountCard: {}",
        search,
        phone,
        email,
        discountCard);

    return customerRepository
        .findAll(
            CustomerSpecification.searchCustomers(search, phone, email, discountCard), pageable)
        .map(customerMapper::toCustomerInfo);
  }

  /** List customers with offset/limit API contract and return PaginatedResponse model */
  public CustomerListResponse listCustomers(
      String search,
      String phone,
      String email,
      String discountCard,
      Integer offset,
      Integer limit) {
    PageRequest pageRequest = PageRequest.of(offset / limit, limit);
    Page<CustomerInfo> page = searchCustomers(search, phone, email, discountCard, pageRequest);

    return new CustomerListResponse(
        page.getContent(),
        page.getTotalElements(),
        page.getTotalPages(),
        page.getSize(),
        page.getNumber(),
        page.getNumberOfElements(),
        page.isFirst(),
        page.isLast(),
        page.isEmpty());
  }

  /**
   * Check if customer exists by ID.
   *
   * @param customerId Customer ID
   * @return true if exists
   */
  public boolean existsById(UUID customerId) {
    return customerRepository.existsById(customerId);
  }
}
