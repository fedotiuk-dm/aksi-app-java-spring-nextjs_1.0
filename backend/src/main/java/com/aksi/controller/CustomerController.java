package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.customer.CustomerApi;
import com.aksi.api.customer.dto.CreateCustomerRequest;
import com.aksi.api.customer.dto.CustomerInfo;
import com.aksi.api.customer.dto.CustomerListResponse;
import com.aksi.api.customer.dto.UpdateCustomerRequest;
import com.aksi.service.customer.CustomerService;

import lombok.RequiredArgsConstructor;

/** REST controller for customer management */
@RestController
@RequiredArgsConstructor
public class CustomerController implements CustomerApi {

  private final CustomerService customerService;

  @Override
  public ResponseEntity<CustomerInfo> createCustomer(CreateCustomerRequest createCustomerRequest) {
    CustomerInfo customer = customerService.createCustomer(createCustomerRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(customer);
  }

  @Override
  public ResponseEntity<CustomerInfo> getCustomer(UUID customerId) {
    CustomerInfo customer = customerService.getCustomer(customerId);
    return ResponseEntity.ok(customer);
  }

  @Override
  public ResponseEntity<CustomerInfo> updateCustomer(
      UUID customerId, UpdateCustomerRequest updateCustomerRequest) {
    CustomerInfo customer = customerService.updateCustomer(customerId, updateCustomerRequest);
    return ResponseEntity.ok(customer);
  }

  @Override
  public ResponseEntity<CustomerListResponse> listCustomers(
      @Nullable String search,
      @Nullable String phone,
      @Nullable String email,
      @Nullable String discountCard,
      Integer offset,
      Integer limit) {
    return ResponseEntity.ok(
        customerService.listCustomers(search, phone, email, discountCard, offset, limit));
  }

  @Override
  public ResponseEntity<Void> checkCustomerExists(UUID customerId) {
    if (customerService.existsById(customerId)) {
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }
}
