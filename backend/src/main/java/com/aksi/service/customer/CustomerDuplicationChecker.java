package com.aksi.service.customer;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import com.aksi.domain.customer.CustomerEntity;
import com.aksi.exception.ConflictException;
import com.aksi.repository.CustomerRepository;
import com.aksi.repository.CustomerSpecification;

import lombok.RequiredArgsConstructor;

/** Component for checking customer duplication */
@Component
@RequiredArgsConstructor
public class CustomerDuplicationChecker {

  private final CustomerRepository customerRepository;

  /**
   * Generic method to check for duplicate values.
   *
   * @param specification Specification to find duplicates
   * @param excludeCustomerId Customer ID to exclude (optional)
   * @param errorMessage Error message if duplicate found
   * @throws ConflictException if duplicate found
   */
  private void checkDuplicate(
      Specification<CustomerEntity> specification,
      UUID excludeCustomerId,
      String errorMessage) {
    Optional<CustomerEntity> existing = customerRepository.findOne(specification);
    
    if (excludeCustomerId != null) {
      existing = existing.filter(e -> !e.getId().equals(excludeCustomerId));
    }
    
    existing.ifPresent(e -> {
      throw new ConflictException(errorMessage);
    });
  }

  /**
   * Check for duplicate phone.
   *
   * @param phone Phone number to check
   * @param excludeCustomerId Customer ID to exclude (null for create)
   * @throws ConflictException if phone already exists
   */
  public void checkPhone(String phone, UUID excludeCustomerId) {
    checkDuplicate(
        CustomerSpecification.hasPhone(phone).and(CustomerSpecification.isActive()),
        excludeCustomerId,
        "Customer with phone " + phone + " already exists"
    );
  }

  /**
   * Check for duplicate email.
   *
   * @param email Email to check
   * @param excludeCustomerId Customer ID to exclude (null for create)
   * @throws ConflictException if email already exists
   */
  public void checkEmail(String email, UUID excludeCustomerId) {
    if (email == null || email.trim().isEmpty()) {
      return;
    }
    
    checkDuplicate(
        CustomerSpecification.hasEmail(email).and(CustomerSpecification.isActive()),
        excludeCustomerId,
        "Customer with email " + email + " already exists"
    );
  }

  /**
   * Check for duplicate discount card.
   *
   * @param discountCardNumber Discount card number to check
   * @param excludeCustomerId Customer ID to exclude (null for create)
   * @throws ConflictException if discount card already assigned
   */
  public void checkDiscountCard(String discountCardNumber, UUID excludeCustomerId) {
    if (discountCardNumber == null || discountCardNumber.trim().isEmpty()) {
      return;
    }
    
    checkDuplicate(
        CustomerSpecification.hasDiscountCard(discountCardNumber)
            .and(CustomerSpecification.isActive()),
        excludeCustomerId,
        "Discount card " + discountCardNumber + " already assigned to another customer"
    );
  }

  /**
   * Check all duplicates for create operation
   *
   * @param phone Phone number
   * @param email Email (optional)
   * @param discountCardNumber Discount card number (optional)
   * @throws ConflictException if any duplicate found
   */
  public void checkForCreate(String phone, String email, String discountCardNumber) {
    checkPhone(phone, null);
    checkEmail(email, null);
    checkDiscountCard(discountCardNumber, null);
  }

  /**
   * Check all duplicates for update operation
   *
   * @param customerEntity Existing customer
   * @param newPhone New phone number (optional)
   * @param newEmail New email (optional)
   * @param newDiscountCard New discount card number (optional)
   * @throws ConflictException if any duplicate found
   */
  public void checkForUpdate(
      CustomerEntity customerEntity, String newPhone, String newEmail, String newDiscountCard) {
    UUID customerId = customerEntity.getId();

    // Check phone if changed
    if (newPhone != null && !newPhone.equals(customerEntity.getPhonePrimary())) {
      checkPhone(newPhone, customerId);
    }

    // Check email if changed
    if (newEmail != null && !newEmail.equals(customerEntity.getEmail())) {
      checkEmail(newEmail, customerId);
    }

    // Check discount card if changed
    if (newDiscountCard != null
        && !newDiscountCard.equals(customerEntity.getDiscountCardNumber())) {
      checkDiscountCard(newDiscountCard, customerId);
    }
  }
}
