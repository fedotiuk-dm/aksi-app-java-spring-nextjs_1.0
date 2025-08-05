package com.aksi.repository;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.aksi.domain.customer.Customer;

/** Specifications for Customer entity queries */
public class CustomerSpecification {

  private CustomerSpecification() {}

  /** Search by text in firstName, lastName, phonePrimary or email */
  public static Specification<Customer> searchByText(String search) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(search)) {
        return cb.conjunction();
      }

      String pattern = "%" + search.toLowerCase() + "%";

      return cb.or(
          cb.like(cb.lower(root.get("firstName")), pattern),
          cb.like(cb.lower(root.get("lastName")), pattern),
          cb.like(root.get("phonePrimary"), pattern),
          cb.like(cb.lower(root.get("email")), pattern));
    };
  }

  /** Filter by exact phone number */
  public static Specification<Customer> hasPhone(String phone) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(phone)) {
        return cb.conjunction();
      }
      return cb.equal(root.get("phonePrimary"), phone);
    };
  }

  /** Filter by exact email (case-insensitive) */
  public static Specification<Customer> hasEmail(String email) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(email)) {
        return cb.conjunction();
      }
      return cb.equal(cb.lower(root.get("email")), email.toLowerCase());
    };
  }

  /** Filter by exact discount card number */
  public static Specification<Customer> hasDiscountCard(String discountCard) {
    return (root, query, cb) -> {
      if (!StringUtils.hasText(discountCard)) {
        return cb.conjunction();
      }
      return cb.equal(root.get("discountCardNumber"), discountCard);
    };
  }

  /** Filter only active customers */
  public static Specification<Customer> isActive() {
    return (root, query, cb) -> cb.isTrue(root.get("active"));
  }

  /** Combine all search criteria */
  public static Specification<Customer> searchCustomers(
      String search, String phone, String email, String discountCard) {
    return Specification.allOf(
        isActive(),
        searchByText(search),
        hasPhone(phone),
        hasEmail(email),
        hasDiscountCard(discountCard));
  }
}
