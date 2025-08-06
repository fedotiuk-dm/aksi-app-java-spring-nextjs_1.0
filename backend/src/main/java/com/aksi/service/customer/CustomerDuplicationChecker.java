package com.aksi.service.customer;

import java.util.UUID;

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
   * Check for duplicate phone during creation
   *
   * @param phone Phone number to check
   * @throws ConflictException if phone already exists
   */
  public void checkPhoneForCreate(String phone) {
    customerRepository
        .findOne(CustomerSpecification.hasPhone(phone).and(CustomerSpecification.isActive()))
        .ifPresent(
            existing -> {
              throw new ConflictException("Customer with phone " + phone + " already exists");
            });
  }

  /**
   * Check for duplicate phone during update
   *
   * @param phone Phone number to check
   * @param excludeCustomerId Customer ID to exclude from check
   * @throws ConflictException if phone already exists for another customer
   */
  public void checkPhoneForUpdate(String phone, UUID excludeCustomerId) {
    customerRepository
        .findOne(CustomerSpecification.hasPhone(phone).and(CustomerSpecification.isActive()))
        .filter(existing -> !existing.getId().equals(excludeCustomerId))
        .ifPresent(
            existing -> {
              throw new ConflictException("Customer with phone " + phone + " already exists");
            });
  }

  /**
   * Check for duplicate email during creation
   *
   * @param email Email to check
   * @throws ConflictException if email already exists
   */
  public void checkEmailForCreate(String email) {
    if (email == null || email.trim().isEmpty()) {
      return;
    }

    customerRepository
        .findOne(CustomerSpecification.hasEmail(email).and(CustomerSpecification.isActive()))
        .ifPresent(
            existing -> {
              throw new ConflictException("Customer with email " + email + " already exists");
            });
  }

  /**
   * Check for duplicate email during update
   *
   * @param email Email to check
   * @param excludeCustomerId Customer ID to exclude from check
   * @throws ConflictException if email already exists for another customer
   */
  public void checkEmailForUpdate(String email, UUID excludeCustomerId) {
    if (email == null || email.trim().isEmpty()) {
      return;
    }

    customerRepository
        .findOne(CustomerSpecification.hasEmail(email).and(CustomerSpecification.isActive()))
        .filter(existing -> !existing.getId().equals(excludeCustomerId))
        .ifPresent(
            existing -> {
              throw new ConflictException("Customer with email " + email + " already exists");
            });
  }

  /**
   * Check for duplicate discount card during creation
   *
   * @param discountCardNumber Discount card number to check
   * @throws ConflictException if discount card already assigned
   */
  public void checkDiscountCardForCreate(String discountCardNumber) {
    if (discountCardNumber == null || discountCardNumber.trim().isEmpty()) {
      return;
    }

    customerRepository
        .findOne(
            CustomerSpecification.hasDiscountCard(discountCardNumber)
                .and(CustomerSpecification.isActive()))
        .ifPresent(
            existing -> {
              throw new ConflictException(
                  "Discount card " + discountCardNumber + " already assigned to another customer");
            });
  }

  /**
   * Check for duplicate discount card during update
   *
   * @param discountCardNumber Discount card number to check
   * @param excludeCustomerId Customer ID to exclude from check
   * @throws ConflictException if discount card already assigned to another customer
   */
  public void checkDiscountCardForUpdate(String discountCardNumber, UUID excludeCustomerId) {
    if (discountCardNumber == null || discountCardNumber.trim().isEmpty()) {
      return;
    }

    customerRepository
        .findOne(
            CustomerSpecification.hasDiscountCard(discountCardNumber)
                .and(CustomerSpecification.isActive()))
        .filter(existing -> !existing.getId().equals(excludeCustomerId))
        .ifPresent(
            existing -> {
              throw new ConflictException(
                  "Discount card " + discountCardNumber + " already assigned to another customer");
            });
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
    checkPhoneForCreate(phone);
    checkEmailForCreate(email);
    checkDiscountCardForCreate(discountCardNumber);
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
      checkPhoneForUpdate(newPhone, customerId);
    }

    // Check email if changed
    if (newEmail != null && !newEmail.equals(customerEntity.getEmail())) {
      checkEmailForUpdate(newEmail, customerId);
    }

    // Check discount card if changed
    if (newDiscountCard != null
        && !newDiscountCard.equals(customerEntity.getDiscountCardNumber())) {
      checkDiscountCardForUpdate(newDiscountCard, customerId);
    }
  }
}
