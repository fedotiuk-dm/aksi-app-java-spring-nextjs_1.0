package com.aksi.service.order;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.OrderInfo;
import com.aksi.domain.branch.BranchEntity;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.order.OrderEntity;
import com.aksi.domain.user.UserEntity;
import com.aksi.mapper.OrderMapper;
import com.aksi.repository.CartRepository;
import com.aksi.repository.OrderRepository;
import com.aksi.service.auth.UserContextService;
import com.aksi.service.order.factory.OrderFactory;
import com.aksi.service.order.guard.OrderGuard;
import com.aksi.service.order.validator.OrderValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of OrderCreationService Handles order creation from cart with pricing calculation
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderCreationServiceImpl implements OrderCreationService {

  private final OrderRepository orderRepository;
  private final CartRepository cartRepository;

  private final OrderGuard orderGuard;
  private final OrderValidator orderValidator;
  private final OrderFactory orderFactory;
  private final OrderPricingCalculator pricingCalculator;
  private final UserContextService userContextService;
  private final OrderMapper orderMapper;

  @Override
  public OrderInfo create(CreateOrderRequest request) {
    log.info("Creating order from cart: {}", request.getCartId());

    // Step 1: Load entities
    CartEntity cart = orderGuard.ensureCartExists(request.getCartId());
    BranchEntity branch = orderGuard.ensureBranchExists(request.getBranchId());
    UserEntity currentUser = userContextService.getCurrentUser();

    // Step 2: Validate
    orderValidator.validateCartForOrder(cart);
    orderValidator.validateBranchIsActive(branch);
    orderValidator.validateTermsAccepted(request.getTermsAccepted());

    // Step 3: Calculate pricing
    var pricing = pricingCalculator.calculateCartPricing(cart);

    // Step 4: Create order
    OrderEntity order = orderFactory.createOrder(request, cart, branch, currentUser, pricing);

    // Step 5: Persist
    order = orderRepository.save(order);
    cartRepository.delete(cart);

    log.info(
        "Created order {} for customer {}",
        order.getOrderNumber(),
        order.getCustomerEntity().getId());

    // Step 6: Map to DTO and enrich with calculated fields
    OrderInfo orderInfo = orderMapper.toOrderInfo(order);
    orderInfo.getPricing().setPaidAmount(0); // New order has no payments
    orderInfo.getPricing().setBalanceDue(order.getTotalAmount());
    return orderInfo;
  }
}
