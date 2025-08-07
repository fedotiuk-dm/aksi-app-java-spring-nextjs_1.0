package com.aksi.service.customer;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.customer.dto.CreateCustomerRequest;
import com.aksi.api.customer.dto.CustomerInfo;
import com.aksi.api.customer.dto.UpdateCustomerRequest;
import com.aksi.domain.customer.CustomerEntity;
import com.aksi.mapper.CustomerMapper;
import com.aksi.repository.CustomerRepository;
import com.aksi.validator.CustomerValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for customer write operations.
 * All methods are transactional and handle state changes.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CustomerCommandService {

  private final CustomerRepository customerRepository;
  private final CustomerMapper customerMapper;
  private final CustomerDuplicationChecker duplicationChecker;
  private final CustomerValidator customerValidator;

  /**
   * Create a new customer.
   *
   * @param request Create customer request
   * @return Created customer info
   */
  public CustomerInfo createCustomer(CreateCustomerRequest request) {
    log.debug("Creating new customer: {} {}", request.getFirstName(), request.getLastName());

    // Validate request
    customerValidator.validateCreateRequest(request);

    // Check for duplicates
    duplicationChecker.checkForCreate(
        request.getPhonePrimary(), request.getEmail(), request.getDiscountCardNumber());

    // Create and save entity
    CustomerEntity customerEntity = customerMapper.toEntity(request);
    customerEntity = customerRepository.save(customerEntity);

    log.info("Created customer with ID: {}", customerEntity.getId());
    return customerMapper.toCustomerInfo(customerEntity);
  }

  /**
   * Update existing customer.
   *
   * @param customerEntity Existing customer entity
   * @param request Update customer request
   * @return Updated customer info
   */
  public CustomerInfo updateCustomer(CustomerEntity customerEntity, UpdateCustomerRequest request) {
    UUID customerId = customerEntity.getId();
    log.debug("Updating customer: {}", customerId);

    // Validate request
    customerValidator.validateUpdateRequest(request);

    // Check for duplicates
    duplicationChecker.checkForUpdate(
        customerEntity,
        request.getPhonePrimary(),
        request.getEmail(),
        request.getDiscountCardNumber());

    // Update and save entity
    customerMapper.updateEntityFromRequest(request, customerEntity);
    customerEntity = customerRepository.save(customerEntity);

    log.info("Updated customer: {}", customerId);
    return customerMapper.toCustomerInfo(customerEntity);
  }

  /**
   * Save customer entity.
   *
   * @param customerEntity Customer entity to save
   * @return Saved customer entity
   */
  public CustomerEntity save(CustomerEntity customerEntity) {
    return customerRepository.save(customerEntity);
  }
}