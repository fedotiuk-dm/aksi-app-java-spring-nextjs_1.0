package com.aksi.service.customer;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.customer.dto.CreateCustomerRequest;
import com.aksi.api.customer.dto.CustomerInfo;
import com.aksi.api.customer.dto.UpdateCustomerRequest;
import com.aksi.domain.customer.CustomerEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Facade implementation of CustomerService. Provides a unified API while delegating to specialized
 * Query and Command services.
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CustomerServiceImpl implements CustomerService {

  private final CustomerQueryService queryService;
  private final CustomerCommandService commandService;

  @Override
  @Transactional
  public CustomerInfo createCustomer(CreateCustomerRequest request) {
    return commandService.createCustomer(request);
  }

  @Override
  @Transactional(readOnly = true)
  public CustomerInfo getCustomer(UUID customerId) {
    return queryService.getCustomer(customerId);
  }

  @Override
  @Transactional
  public CustomerInfo updateCustomer(UUID customerId, UpdateCustomerRequest request) {
    CustomerEntity customerEntity = queryService.getCustomerEntityById(customerId);
    return commandService.updateCustomer(customerEntity, request);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<CustomerInfo> searchCustomers(
      String search, String phone, String email, String discountCard, Pageable pageable) {
    return queryService.searchCustomers(search, phone, email, discountCard, pageable);
  }

  @Override
  @Transactional(readOnly = true)
  public boolean existsById(UUID customerId) {
    return queryService.existsById(customerId);
  }
}
