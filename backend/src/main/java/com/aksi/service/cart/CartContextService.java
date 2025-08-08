package com.aksi.service.cart;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

/**
 * Stores/reads the active customer context in HTTP session to bind cart operations to a selected
 * customer. API-first: activation endpoint will set this value; cart endpoints will read it.
 */
@Service
public class CartContextService {

  private static final String ACTIVE_CUSTOMER_ID = "ACTIVE_CUSTOMER_ID";

  public void setActiveCustomerId(UUID customerId) {
    var attrs = RequestContextHolder.currentRequestAttributes();
    attrs.setAttribute(ACTIVE_CUSTOMER_ID, customerId, RequestAttributes.SCOPE_SESSION);
  }

  public Optional<UUID> getActiveCustomerId() {
    var attrs = RequestContextHolder.currentRequestAttributes();
    Object value = attrs.getAttribute(ACTIVE_CUSTOMER_ID, RequestAttributes.SCOPE_SESSION);
    if (value instanceof UUID id) {
      return Optional.of(id);
    }
    return Optional.empty();
  }

  public void clear() {
    var attrs = RequestContextHolder.currentRequestAttributes();
    attrs.removeAttribute(ACTIVE_CUSTOMER_ID, RequestAttributes.SCOPE_SESSION);
  }
}
