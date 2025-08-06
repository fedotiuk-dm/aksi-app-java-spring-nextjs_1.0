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
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.CustomerMapper;
import com.aksi.repository.CustomerRepository;
import com.aksi.repository.CustomerSpecification;
import com.aksi.validator.CustomerValidator;

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
  private final CustomerDuplicationChecker duplicationChecker;
  private final CustomerValidator customerValidator;

  @Override
  @Transactional
  public CustomerInfo createCustomer(CreateCustomerRequest request) {
    log.debug("Creating new customer: {} {}", request.getFirstName(), request.getLastName());

    // Validate request
    customerValidator.validateCreateRequest(request);

    // Check for duplicates
    duplicationChecker.checkForCreate(
        request.getPhonePrimary(), request.getEmail(), request.getDiscountCardNumber());

    CustomerEntity customerEntity = customerMapper.toEntity(request);
    customerEntity = customerRepository.save(customerEntity);

    log.info("Created customer with ID: {}", customerEntity.getId());
    return customerMapper.toCustomerInfo(customerEntity);
  }

  @Override
  public CustomerInfo getCustomer(UUID customerId) {
    log.debug("Getting customer by ID: {}", customerId);

    CustomerEntity customerEntity = findCustomerById(customerId);
    return customerMapper.toCustomerInfo(customerEntity);
  }

  @Override
  @Transactional
  public CustomerInfo updateCustomer(UUID customerId, UpdateCustomerRequest request) {
    log.debug("Updating customer: {}", customerId);

    CustomerEntity customerEntity = findCustomerById(customerId);

    // Validate request
    customerValidator.validateUpdateRequest(request);

    // Check for duplicates
    duplicationChecker.checkForUpdate(
        customerEntity,
        request.getPhonePrimary(),
        request.getEmail(),
        request.getDiscountCardNumber());

    customerMapper.updateEntityFromRequest(request, customerEntity);
    customerEntity = customerRepository.save(customerEntity);

    log.info("Updated customer: {}", customerId);
    return customerMapper.toCustomerInfo(customerEntity);
  }

  @Override
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

  @Override
  public boolean existsById(UUID customerId) {
    return customerRepository.existsById(customerId);
  }

  private CustomerEntity findCustomerById(UUID customerId) {
    return customerRepository
        .findById(customerId)
        .orElseThrow(() -> new NotFoundException("Customer not found: " + customerId));
  }
}
