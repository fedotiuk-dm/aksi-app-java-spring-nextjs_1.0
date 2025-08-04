package com.aksi.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.customer.CustomerApi;
import com.aksi.api.customer.dto.CreateCustomerRequest;
import com.aksi.api.customer.dto.CustomerInfo;
import com.aksi.api.customer.dto.CustomersResponse;
import com.aksi.api.customer.dto.UpdateCustomerRequest;
import com.aksi.service.customer.CustomerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** REST controller for customer management */
@RestController
@RequiredArgsConstructor
@Slf4j
public class CustomerController implements CustomerApi {

  private final CustomerService customerService;

  @Override
  public ResponseEntity<CustomerInfo> createCustomer(CreateCustomerRequest createCustomerRequest) {
    log.info("Creating new customer");
    CustomerInfo customer = customerService.createCustomer(createCustomerRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(customer);
  }

  @Override
  public ResponseEntity<CustomerInfo> getCustomer(UUID customerId) {
    log.info("Getting customer: {}", customerId);
    CustomerInfo customer = customerService.getCustomer(customerId);
    return ResponseEntity.ok(customer);
  }

  @Override
  public ResponseEntity<CustomerInfo> updateCustomer(
      UUID customerId, UpdateCustomerRequest updateCustomerRequest) {
    log.info("Updating customer: {}", customerId);
    CustomerInfo customer = customerService.updateCustomer(customerId, updateCustomerRequest);
    return ResponseEntity.ok(customer);
  }

  @Override
  public ResponseEntity<CustomersResponse> listCustomers(
      String search, String phone, Integer offset, Integer limit) {
    log.info(
        "Listing customers - search: {}, phone: {}, offset: {}, limit: {}",
        search,
        phone,
        offset,
        limit);

    PageRequest pageRequest = PageRequest.of(offset / limit, limit);
    Page<CustomerInfo> page = customerService.searchCustomers(search, phone, pageRequest);

    CustomersResponse response = new CustomersResponse();
    response.setCustomers(page.getContent());
    response.setTotal((int) page.getTotalElements());
    response.setOffset(offset);
    response.setLimit(limit);

    return ResponseEntity.ok(response);
  }
}
