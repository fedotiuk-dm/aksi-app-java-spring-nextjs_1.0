package com.aksi.service.customer;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.customer.dto.CreateCustomerRequest;
import com.aksi.api.customer.dto.CustomerInfo;
import com.aksi.api.customer.dto.UpdateCustomerRequest;
import com.aksi.domain.customer.Customer;
import com.aksi.exception.ResourceNotFoundException;
import com.aksi.mapper.CustomerMapper;
import com.aksi.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of CustomerService */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CustomerServiceImpl implements CustomerService {

  private final CustomerRepository customerRepository;
  private final CustomerMapper customerMapper;

  @Override
  @Transactional
  public CustomerInfo createCustomer(CreateCustomerRequest request) {
    log.debug("Creating new customer: {} {}", request.getFirstName(), request.getLastName());

    Customer customer = customerMapper.toEntity(request);
    customer = customerRepository.save(customer);

    log.info("Created customer with ID: {}", customer.getId());
    return customerMapper.toCustomerInfo(customer);
  }

  @Override
  public CustomerInfo getCustomer(UUID customerId) {
    log.debug("Getting customer by ID: {}", customerId);

    Customer customer = findCustomerById(customerId);
    return customerMapper.toCustomerInfo(customer);
  }

  @Override
  @Transactional
  public CustomerInfo updateCustomer(UUID customerId, UpdateCustomerRequest request) {
    log.debug("Updating customer: {}", customerId);

    Customer customer = findCustomerById(customerId);
    customerMapper.updateEntityFromRequest(request, customer);
    customer = customerRepository.save(customer);

    log.info("Updated customer: {}", customerId);
    return customerMapper.toCustomerInfo(customer);
  }

  @Override
  public Page<CustomerInfo> searchCustomers(String search, String phone, Pageable pageable) {
    log.debug("Searching customers - search: {}, phone: {}", search, phone);

    Page<Customer> customers;
    if (phone != null && !phone.isEmpty()) {
      customers = customerRepository.findByPhonePrimaryContaining(phone, pageable);
    } else {
      customers = customerRepository.searchCustomers(search, pageable);
    }

    return customers.map(customerMapper::toCustomerInfo);
  }

  @Override
  public boolean existsById(UUID customerId) {
    return customerRepository.existsById(customerId);
  }

  private Customer findCustomerById(UUID customerId) {
    return customerRepository
        .findById(customerId)
        .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));
  }
}
