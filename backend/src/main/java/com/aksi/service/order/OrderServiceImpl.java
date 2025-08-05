package com.aksi.service.order;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.order.dto.AddPaymentRequest;
import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;
import com.aksi.api.order.dto.UploadItemPhotoRequest;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.domain.branch.Branch;
import com.aksi.domain.cart.Cart;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.order.ItemCharacteristics;
import com.aksi.domain.order.ItemDefect;
import com.aksi.domain.order.ItemPhoto;
import com.aksi.domain.order.ItemRisk;
import com.aksi.domain.order.ItemStain;
import com.aksi.domain.order.Order;
import com.aksi.domain.order.OrderItem;
import com.aksi.domain.order.OrderPayment;
import com.aksi.domain.user.User;
import com.aksi.exception.BusinessValidationException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.OrderMapper;
import com.aksi.repository.BranchRepository;
import com.aksi.repository.CartRepository;
import com.aksi.repository.CustomerRepository;
import com.aksi.repository.OrderRepository;
import com.aksi.repository.OrderSpecification;
import com.aksi.repository.UserRepository;
import com.aksi.service.pricing.PricingService;
import com.aksi.util.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of OrderService with comprehensive order management */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class OrderServiceImpl implements OrderService {

  private final OrderRepository orderRepository;
  private final CartRepository cartRepository;
  private final CustomerRepository customerRepository;
  private final BranchRepository branchRepository;
  private final UserRepository userRepository;
  private final PricingService pricingService;
  private final OrderMapper orderMapper;

  @Value("${app.order.number-prefix:ORD}")
  private String orderNumberPrefix;

  @Value("${app.order.default-completion-hours:72}")
  private int defaultCompletionHours;

  @Override
  @Transactional
  public OrderInfo createOrder(CreateOrderRequest request) {
    log.debug("Creating order from cart: {}", request.getCartId());

    // Validate and get cart
    Cart cart =
        cartRepository
            .findById(request.getCartId())
            .orElseThrow(() -> new NotFoundException("Cart not found: " + request.getCartId()));

    if (cart.isExpired()) {
      throw new BusinessValidationException("Cart has expired");
    }

    if (cart.getItems().isEmpty()) {
      throw new BusinessValidationException("Cannot create order from empty cart");
    }

    // Validate branch
    Branch branch =
        branchRepository
            .findById(request.getBranchId())
            .orElseThrow(() -> new NotFoundException("Branch not found: " + request.getBranchId()));

    if (!branch.isActive()) {
      throw new BusinessValidationException("Branch is not active");
    }

    // Get current user
    User currentUser = getCurrentUser();

    // Calculate pricing
    PriceCalculationResponse pricing = calculateCartPricing(cart);

    // Create order
    Order order = new Order();
    order.setOrderNumber(generateOrderNumber());
    order.setCustomer(cart.getCustomer());
    order.setBranch(branch);
    order.setUniqueLabel(request.getUniqueLabel());
    order.setStatus(Order.OrderStatus.PENDING);
    order.setNotes(request.getNotes());
    order.setCustomerSignature(request.getCustomerSignature());
    order.setCreatedBy(currentUser);
    order.setTermsAccepted(request.getTermsAccepted() != null ? request.getTermsAccepted() : false);
    order.setExpectedCompletionDate(calculateExpectedCompletionDate(cart));

    // Set pricing snapshot
    order.setItemsSubtotal(pricing.getTotals().getItemsSubtotal());
    order.setUrgencyAmount(pricing.getTotals().getUrgencyAmount());
    order.setDiscountAmount(pricing.getTotals().getDiscountAmount());
    order.setDiscountApplicableAmount(pricing.getTotals().getDiscountApplicableAmount());
    order.setTotalAmount(pricing.getTotals().getTotal());

    // Convert cart items to order items
    for (CartItem cartItem : cart.getItems()) {
      OrderItem orderItem = convertCartItemToOrderItem(cartItem, order, pricing);
      order.addItem(orderItem);
    }

    // Save order
    order = orderRepository.save(order);

    // Clear cart after successful order creation
    cartRepository.delete(cart);

    log.info(
        "Created order {} for customer {}", order.getOrderNumber(), order.getCustomer().getId());
    return orderMapper.toOrderInfo(order);
  }

  @Override
  public OrderInfo getOrder(UUID orderId) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
    return orderMapper.toOrderInfo(order);
  }

  @Override
  public OrderInfo getOrderByNumber(String orderNumber) {
    Order order =
        orderRepository
            .findByOrderNumber(orderNumber)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderNumber));
    return orderMapper.toOrderInfo(order);
  }

  @Override
  public Page<OrderInfo> listOrders(
      UUID customerId,
      Order.OrderStatus status,
      UUID branchId,
      LocalDate dateFrom,
      LocalDate dateTo,
      String search,
      Pageable pageable) {

    var specification =
        OrderSpecification.searchOrders(customerId, branchId, status, dateFrom, dateTo, search);

    return orderRepository.findAll(specification, pageable).map(orderMapper::toOrderInfo);
  }

  @Override
  @Transactional
  public OrderInfo updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    Order.OrderStatus oldStatus = order.getStatus();
    Order.OrderStatus newStatus = request.getStatus();

    validateStatusTransition(oldStatus, newStatus);

    order.setStatus(newStatus);

    if (newStatus == Order.OrderStatus.COMPLETED && order.getActualCompletionDate() == null) {
      order.setActualCompletionDate(Instant.now());
    }

    order = orderRepository.save(order);

    log.info("Updated order {} status from {} to {}", order.getOrderNumber(), oldStatus, newStatus);
    return orderMapper.toOrderInfo(order);
  }

  @Override
  @Transactional
  public OrderItemInfo updateItemCharacteristics(
      UUID orderId, UUID itemId, UpdateItemCharacteristicsRequest request) {

    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    if (!order.canBeModified()) {
      throw new BusinessValidationException("Order cannot be modified in current status");
    }

    OrderItem orderItem =
        order.getItems().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Order item not found: " + itemId));

    // Update characteristics
    if (request.getCharacteristics() != null) {
      updateOrderItemCharacteristics(orderItem, request.getCharacteristics());
    }

    // Update stains
    if (request.getStains() != null) {
      updateOrderItemStains(orderItem, request.getStains());
    }

    // Update defects
    if (request.getDefects() != null) {
      updateOrderItemDefects(orderItem, request.getDefects());
    }

    // Update risks
    if (request.getRisks() != null) {
      updateOrderItemRisks(orderItem, request.getRisks());
    }

    orderRepository.save(order);

    log.info(
        "Updated characteristics for order item {} in order {}", itemId, order.getOrderNumber());
    return orderMapper.toOrderItemInfo(orderItem);
  }

  @Override
  @Transactional
  public ItemPhotoInfo uploadItemPhoto(UUID orderId, UUID itemId, UploadItemPhotoRequest request) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    OrderItem orderItem =
        order.getItems().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Order item not found: " + itemId));

    // TODO: Implement file upload logic
    // For now, create a placeholder photo
    ItemPhoto photo = new ItemPhoto();
    photo.setOrderItem(orderItem);
    photo.setUrl("/photos/" + UUID.randomUUID() + ".jpg"); // Placeholder URL
    photo.setType(
        request.getPhotoType() != null
            ? ItemPhoto.PhotoType.valueOf(request.getPhotoType().name())
            : ItemPhoto.PhotoType.GENERAL);
    photo.setDescription(request.getPhotoDescription());
    photo.setUploadedBy(getCurrentUser());
    photo.setUploadedAt(Instant.now());
    photo.setOriginalFilename("uploaded-photo.jpg"); // TODO: Get from request
    photo.setContentType("image/jpeg"); // TODO: Get from request
    photo.setFileSize(1024L); // TODO: Get from request

    orderItem.addPhoto(photo);
    orderRepository.save(order);

    log.info("Uploaded photo for order item {} in order {}", itemId, order.getOrderNumber());
    return orderMapper.toItemPhotoInfo(photo);
  }

  @Override
  @Transactional
  public void deleteItemPhoto(UUID orderId, UUID itemId, UUID photoId) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    OrderItem orderItem =
        order.getItems().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Order item not found: " + itemId));

    ItemPhoto photo =
        orderItem.getPhotos().stream()
            .filter(p -> p.getId().equals(photoId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Photo not found: " + photoId));

    orderItem.removePhoto(photo);
    orderRepository.save(order);

    log.info(
        "Deleted photo {} from order item {} in order {}", photoId, itemId, order.getOrderNumber());
  }

  @Override
  public byte[] getOrderReceipt(UUID orderId) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    // TODO: Implement PDF generation
    log.info("Generating receipt for order {}", order.getOrderNumber());
    return "PDF content placeholder".getBytes();
  }

  @Override
  @Transactional
  public PaymentInfo addOrderPayment(UUID orderId, AddPaymentRequest request) {
    Order order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    if (order.isCancelled()) {
      throw new BusinessValidationException("Cannot add payment to cancelled order");
    }

    Integer remainingBalance = order.getBalanceDue();
    if (request.getAmount() > remainingBalance) {
      throw new BusinessValidationException(
          String.format(
              "Payment amount (%d) exceeds remaining balance (%d)",
              request.getAmount(), remainingBalance));
    }

    OrderPayment payment = new OrderPayment();
    payment.setOrder(order);
    payment.setAmount(request.getAmount());
    payment.setMethod(OrderPayment.PaymentMethod.valueOf(request.getMethod().name()));
    payment.setPaidBy(getCurrentUser());
    payment.setPaidAt(Instant.now());

    order.addPayment(payment);
    orderRepository.save(order);

    log.info("Added payment of {} to order {}", request.getAmount(), order.getOrderNumber());
    return orderMapper.toPaymentInfo(payment);
  }

  @Override
  public boolean existsById(UUID orderId) {
    return orderRepository.existsById(orderId);
  }

  @Override
  public String generateOrderNumber() {
    String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    String orderNumber;

    do {
      orderNumber =
          orderNumberPrefix
              + "-"
              + timestamp
              + "-"
              + String.format("%03d", (int) (Math.random() * 1000));
    } while (orderRepository.existsByOrderNumber(orderNumber));

    return orderNumber;
  }

  @Override
  public boolean canModifyOrder(UUID orderId) {
    return orderRepository.findById(orderId).map(Order::canBeModified).orElse(false);
  }

  @Override
  public Integer calculateOrderTotal(UUID orderId) {
    return orderRepository
        .findById(orderId)
        .map(Order::getTotalAmount)
        .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
  }

  @Override
  public Page<OrderInfo> getCustomerOrderHistory(UUID customerId, Pageable pageable) {
    return orderRepository
        .findByCustomerIdOrderByCreatedAtDesc(customerId, pageable)
        .map(orderMapper::toOrderInfo);
  }

  @Override
  public Page<OrderInfo> getOrdersDueForCompletion(int days, Pageable pageable) {
    Instant targetDate = Instant.now().plusSeconds(days * 24 * 60 * 60);
    List<Order> orders = orderRepository.findOrdersDueForCompletion(targetDate);
    // TODO: Convert to Page
    return Page.empty();
  }

  @Override
  public Page<OrderInfo> getOverdueOrders(Pageable pageable) {
    List<Order> orders = orderRepository.findOverdueOrders(Instant.now());
    // TODO: Convert to Page
    return Page.empty();
  }

  // Private helper methods

  private User getCurrentUser() {
    try {
      UUID userId = SecurityUtils.getCurrentUserId();
      return userRepository.findById(userId).orElse(null); // Allow null for system operations
    } catch (Exception e) {
      log.warn("Could not get current user: {}", e.getMessage());
      return null;
    }
  }

  private PriceCalculationResponse calculateCartPricing(Cart cart) {
    // TODO: Implement proper cart to pricing calculation conversion
    // This is a placeholder that would integrate with PricingService
    PriceCalculationRequest pricingRequest = new PriceCalculationRequest();
    // Convert cart items to pricing items
    return pricingService.calculatePrice(pricingRequest);
  }

  private Instant calculateExpectedCompletionDate(Cart cart) {
    Instant baseDate = Instant.now().plusSeconds(defaultCompletionHours * 3600);

    // Adjust based on urgency
    if ("EXPRESS_24H".equals(cart.getUrgencyType())) {
      return Instant.now().plusSeconds(24 * 3600);
    } else if ("EXPRESS_48H".equals(cart.getUrgencyType())) {
      return Instant.now().plusSeconds(48 * 3600);
    }

    return baseDate;
  }

  private OrderItem convertCartItemToOrderItem(
      CartItem cartItem, Order order, PriceCalculationResponse pricing) {
    OrderItem orderItem = new OrderItem();
    orderItem.setOrder(order);
    orderItem.setPriceListItem(cartItem.getPriceListItem());
    orderItem.setQuantity(cartItem.getQuantity());

    // TODO: Map pricing details from pricing response
    orderItem.setBasePrice(0); // TODO: Get from pricing
    orderItem.setModifiersTotalAmount(0); // TODO: Get from pricing
    orderItem.setSubtotal(0); // TODO: Calculate
    orderItem.setUrgencyAmount(0); // TODO: Get from pricing
    orderItem.setDiscountAmount(0); // TODO: Get from pricing
    orderItem.setTotalAmount(0); // TODO: Calculate
    orderItem.setDiscountEligible(true); // TODO: Determine from pricing

    return orderItem;
  }

  private void validateStatusTransition(Order.OrderStatus from, Order.OrderStatus to) {
    // Define valid transitions
    boolean isValidTransition =
        switch (from) {
          case PENDING -> to == Order.OrderStatus.ACCEPTED || to == Order.OrderStatus.CANCELLED;
          case ACCEPTED -> to == Order.OrderStatus.IN_PROGRESS || to == Order.OrderStatus.CANCELLED;
          case IN_PROGRESS -> to == Order.OrderStatus.READY || to == Order.OrderStatus.CANCELLED;
          case READY -> to == Order.OrderStatus.COMPLETED;
          case COMPLETED, CANCELLED -> false; // Terminal states
        };

    if (!isValidTransition) {
      throw new BusinessValidationException(
          String.format("Invalid status transition from %s to %s", from, to));
    }
  }

  private void updateOrderItemCharacteristics(
      OrderItem orderItem, com.aksi.api.order.dto.ItemCharacteristics characteristics) {
    if (orderItem.getCharacteristics() == null) {
      orderItem.setCharacteristics(new ItemCharacteristics());
      orderItem.getCharacteristics().setOrderItem(orderItem);
    }

    ItemCharacteristics itemChar = orderItem.getCharacteristics();
    itemChar.setMaterial(characteristics.getMaterial());
    itemChar.setColor(characteristics.getColor());
    itemChar.setFiller(characteristics.getFiller());

    if (characteristics.getFillerCondition() != null) {
      itemChar.setFillerCondition(
          ItemCharacteristics.FillerCondition.valueOf(characteristics.getFillerCondition().name()));
    }

    itemChar.setWearLevel(characteristics.getWearLevel());
  }

  private void updateOrderItemStains(
      OrderItem orderItem, List<com.aksi.api.order.dto.ItemStain> stains) {
    // Clear existing stains
    orderItem.getStains().clear();

    // Add new stains
    for (var stainDto : stains) {
      ItemStain stain = new ItemStain();
      stain.setOrderItem(orderItem);
      stain.setType(ItemStain.StainType.valueOf(stainDto.getType().name()));
      stain.setDescription(stainDto.getDescription());
      orderItem.addStain(stain);
    }
  }

  private void updateOrderItemDefects(
      OrderItem orderItem, List<com.aksi.api.order.dto.ItemDefect> defects) {
    // Clear existing defects
    orderItem.getDefects().clear();

    // Add new defects
    for (var defectDto : defects) {
      ItemDefect defect = new ItemDefect();
      defect.setOrderItem(orderItem);
      defect.setType(ItemDefect.DefectType.valueOf(defectDto.getType().name()));
      defect.setDescription(defectDto.getDescription());
      orderItem.addDefect(defect);
    }
  }

  private void updateOrderItemRisks(
      OrderItem orderItem, List<com.aksi.api.order.dto.ItemRisk> risks) {
    // Clear existing risks
    orderItem.getRisks().clear();

    // Add new risks
    for (var riskDto : risks) {
      ItemRisk risk = new ItemRisk();
      risk.setOrderItem(orderItem);
      risk.setType(ItemRisk.RiskType.valueOf(riskDto.getType().name()));
      risk.setDescription(riskDto.getDescription());
      orderItem.addRisk(risk);
    }
  }
}
