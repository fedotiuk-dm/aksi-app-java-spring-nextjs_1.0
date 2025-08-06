package com.aksi.service.order;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.order.dto.AddPaymentRequest;
import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.api.order.dto.PhotoType;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;
import com.aksi.api.pricing.dto.GlobalPriceModifiers;
import com.aksi.api.pricing.dto.PriceCalculationItem;
import com.aksi.api.pricing.dto.PriceCalculationRequest;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.domain.branch.BranchEntity;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
import com.aksi.domain.cart.CartItemModifierEntity;
import com.aksi.domain.order.ItemCharacteristicsEntity;
import com.aksi.domain.order.ItemDefectEntity;
import com.aksi.domain.order.ItemPhotoEntity;
import com.aksi.domain.order.ItemRiskEntity;
import com.aksi.domain.order.ItemStainEntity;
import com.aksi.domain.order.OrderEntity;
import com.aksi.domain.order.OrderItemEntity;
import com.aksi.domain.order.OrderPaymentEntity;
import com.aksi.domain.user.UserEntity;
import com.aksi.exception.BusinessValidationException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.OrderMapper;
import com.aksi.repository.BranchRepository;
import com.aksi.repository.CartRepository;
import com.aksi.repository.CustomerRepository;
import com.aksi.repository.OrderRepository;
import com.aksi.repository.OrderSpecification;
import com.aksi.repository.UserRepository;
import com.aksi.security.SecurityUtils;
import com.aksi.service.pricing.PricingService;

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
    CartEntity cartEntity =
        cartRepository
            .findById(request.getCartId())
            .orElseThrow(() -> new NotFoundException("Cart not found: " + request.getCartId()));

    if (cartEntity.isExpired()) {
      throw new BusinessValidationException("Cart has expired");
    }

    if (cartEntity.getItems().isEmpty()) {
      throw new BusinessValidationException("Cannot create order from empty cart");
    }

    // Validate branch
    BranchEntity branchEntity =
        branchRepository
            .findById(request.getBranchId())
            .orElseThrow(() -> new NotFoundException("Branch not found: " + request.getBranchId()));

    if (!branchEntity.isActive()) {
      throw new BusinessValidationException("Branch is not active");
    }

    // Get current user
    UserEntity currentUserEntity = getCurrentUser();

    // Calculate pricing
    PriceCalculationResponse pricing = calculateCartPricing(cartEntity);

    // Create order
    OrderEntity orderEntity = new OrderEntity();
    orderEntity.setOrderNumber(generateOrderNumber());
    orderEntity.setCustomerEntity(cartEntity.getCustomerEntity());
    orderEntity.setBranchEntity(branchEntity);
    orderEntity.setUniqueLabel(request.getUniqueLabel());
    orderEntity.setStatus(OrderEntity.OrderStatus.PENDING);
    orderEntity.setNotes(request.getNotes());
    orderEntity.setCustomerSignature(request.getCustomerSignature());
    orderEntity.setCreatedBy(currentUserEntity);
    orderEntity.setTermsAccepted(
        request.getTermsAccepted() != null ? request.getTermsAccepted() : false);
    orderEntity.setExpectedCompletionDate(calculateExpectedCompletionDate(cartEntity));

    // Set pricing snapshot
    orderEntity.setItemsSubtotal(pricing.getTotals().getItemsSubtotal());
    orderEntity.setUrgencyAmount(pricing.getTotals().getUrgencyAmount());
    orderEntity.setDiscountAmount(pricing.getTotals().getDiscountAmount());
    orderEntity.setDiscountApplicableAmount(pricing.getTotals().getDiscountApplicableAmount());
    orderEntity.setTotalAmount(pricing.getTotals().getTotal());

    // Convert cart items to order items
    for (CartItem cartItem : cartEntity.getItems()) {
      OrderItemEntity orderItemEntity = convertCartItemToOrderItem(cartItem, orderEntity, pricing);
      orderEntity.addItem(orderItemEntity);
    }

    // Save order
    orderEntity = orderRepository.save(orderEntity);

    // Clear cart after successful order creation
    cartRepository.delete(cartEntity);

    log.info(
        "Created order {} for customer {}",
        orderEntity.getOrderNumber(),
        orderEntity.getCustomerEntity().getId());
    return orderMapper.toOrderInfo(orderEntity);
  }

  @Override
  public OrderInfo getOrder(UUID orderId) {
    OrderEntity orderEntity =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
    return orderMapper.toOrderInfo(orderEntity);
  }

  @Override
  public OrderInfo getOrderByNumber(String orderNumber) {
    OrderEntity orderEntity =
        orderRepository
            .findByOrderNumber(orderNumber)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderNumber));
    return orderMapper.toOrderInfo(orderEntity);
  }

  @Override
  public Page<OrderInfo> listOrders(
      UUID customerId,
      OrderEntity.OrderStatus status,
      UUID branchId,
      Instant dateFrom,
      Instant dateTo,
      String search,
      Pageable pageable) {

    var specification =
        OrderSpecification.searchOrders(customerId, branchId, status, dateFrom, dateTo, search);

    return orderRepository.findAll(specification, pageable).map(orderMapper::toOrderInfo);
  }

  @Override
  @Transactional
  public OrderInfo updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
    OrderEntity orderEntity =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    OrderEntity.OrderStatus oldStatus = orderEntity.getStatus();
    OrderEntity.OrderStatus newStatus = OrderEntity.OrderStatus.valueOf(request.getStatus().name());

    validateStatusTransition(oldStatus, newStatus);

    orderEntity.setStatus(newStatus);

    if (newStatus == OrderEntity.OrderStatus.COMPLETED
        && orderEntity.getActualCompletionDate() == null) {
      orderEntity.setActualCompletionDate(Instant.now());
    }

    orderEntity = orderRepository.save(orderEntity);

    log.info(
        "Updated order {} status from {} to {}",
        orderEntity.getOrderNumber(),
        oldStatus,
        newStatus);
    return orderMapper.toOrderInfo(orderEntity);
  }

  @Override
  @Transactional
  public OrderItemInfo updateItemCharacteristics(
      UUID orderId, UUID itemId, UpdateItemCharacteristicsRequest request) {

    OrderEntity orderEntity =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    if (!orderEntity.canBeModified()) {
      throw new BusinessValidationException("Order cannot be modified in current status");
    }

    OrderItemEntity orderItemEntity =
        orderEntity.getItems().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Order item not found: " + itemId));

    // Update characteristics
    if (request.getCharacteristics() != null) {
      updateOrderItemCharacteristics(orderItemEntity, request.getCharacteristics());
    }

    // Update stains
    if (request.getStains() != null) {
      updateOrderItemStains(orderItemEntity, request.getStains());
    }

    // Update defects
    if (request.getDefects() != null) {
      updateOrderItemDefects(orderItemEntity, request.getDefects());
    }

    // Update risks
    if (request.getRisks() != null) {
      updateOrderItemRisks(orderItemEntity, request.getRisks());
    }

    orderRepository.save(orderEntity);

    log.info(
        "Updated characteristics for order item {} in order {}",
        itemId,
        orderEntity.getOrderNumber());
    return orderMapper.toOrderItemInfo(orderItemEntity);
  }

  @Override
  @Transactional
  public ItemPhotoInfo uploadItemPhoto(
      UUID orderId, UUID itemId, MultipartFile file, PhotoType photoType, String photoDescription) {
    OrderEntity orderEntity =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    OrderItemEntity orderItemEntity =
        orderEntity.getItems().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Order item not found: " + itemId));

    // TODO: Implement file upload logic
    // For now, create a placeholder photo
    ItemPhotoEntity photo = new ItemPhotoEntity();
    photo.setOrderItemEntity(orderItemEntity);
    photo.setUrl("/photos/" + UUID.randomUUID() + ".jpg"); // Placeholder URL
    photo.setType(
        photoType != null
            ? ItemPhotoEntity.PhotoType.valueOf(photoType.name())
            : ItemPhotoEntity.PhotoType.GENERAL);
    photo.setDescription(photoDescription != null ? photoDescription : "Uploaded photo");
    photo.setUploadedBy(getCurrentUser());
    photo.setUploadedAt(Instant.now());
    photo.setOriginalFilename("uploaded-photo.jpg"); // TODO: Get from request
    photo.setContentType("image/jpeg"); // TODO: Get from request
    photo.setFileSize(1024L); // TODO: Get from request

    orderItemEntity.addPhoto(photo);
    orderRepository.save(orderEntity);

    log.info("Uploaded photo for order item {} in order {}", itemId, orderEntity.getOrderNumber());
    return orderMapper.toItemPhotoInfo(photo);
  }

  @Override
  @Transactional
  public void deleteItemPhoto(UUID orderId, UUID itemId, UUID photoId) {
    OrderEntity orderEntity =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    OrderItemEntity orderItemEntity =
        orderEntity.getItems().stream()
            .filter(item -> item.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Order item not found: " + itemId));

    ItemPhotoEntity photo =
        orderItemEntity.getPhotos().stream()
            .filter(p -> p.getId().equals(photoId))
            .findFirst()
            .orElseThrow(() -> new NotFoundException("Photo not found: " + photoId));

    orderItemEntity.removePhoto(photo);
    orderRepository.save(orderEntity);

    log.info(
        "Deleted photo {} from order item {} in order {}",
        photoId,
        itemId,
        orderEntity.getOrderNumber());
  }

  @Override
  public byte[] getOrderReceipt(UUID orderId) {
    OrderEntity orderEntity =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    // TODO: Implement PDF generation
    log.info("Generating receipt for order {}", orderEntity.getOrderNumber());
    return "PDF content placeholder".getBytes();
  }

  @Override
  @Transactional
  public PaymentInfo addOrderPayment(UUID orderId, AddPaymentRequest request) {
    OrderEntity orderEntity =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

    if (orderEntity.isCancelled()) {
      throw new BusinessValidationException("Cannot add payment to cancelled order");
    }

    Integer remainingBalance = orderEntity.getBalanceDue();
    if (request.getAmount() > remainingBalance) {
      throw new BusinessValidationException(
          String.format(
              "Payment amount (%d) exceeds remaining balance (%d)",
              request.getAmount(), remainingBalance));
    }

    OrderPaymentEntity payment = new OrderPaymentEntity();
    payment.setOrderEntity(orderEntity);
    payment.setAmount(request.getAmount());
    payment.setMethod(OrderPaymentEntity.PaymentMethod.valueOf(request.getMethod().name()));
    payment.setPaidBy(getCurrentUser());
    payment.setPaidAt(Instant.now());

    orderEntity.addPayment(payment);
    orderRepository.save(orderEntity);

    log.info("Added payment of {} to order {}", request.getAmount(), orderEntity.getOrderNumber());
    return orderMapper.toPaymentInfo(payment);
  }

  @Override
  public boolean existsById(UUID orderId) {
    return orderRepository.existsById(orderId);
  }

  @Override
  public String generateOrderNumber() {
    // Use epoch seconds for timestamp
    long timestamp = Instant.now().getEpochSecond();
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
    return orderRepository.findById(orderId).map(OrderEntity::canBeModified).orElse(false);
  }

  @Override
  public Integer calculateOrderTotal(UUID orderId) {
    return orderRepository
        .findById(orderId)
        .map(OrderEntity::getTotalAmount)
        .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
  }

  @Override
  public Page<OrderInfo> getCustomerOrderHistory(UUID customerId, Pageable pageable) {
    return orderRepository
        .findByCustomerEntityIdOrderByCreatedAtDesc(customerId, pageable)
        .map(orderMapper::toOrderInfo);
  }

  @Override
  public Page<OrderInfo> getOrdersDueForCompletion(int days, Pageable pageable) {
    Instant targetDate = Instant.now().plusSeconds((long) days * 24 * 60 * 60);
    return orderRepository
        .findOrdersDueForCompletion(targetDate, pageable)
        .map(orderMapper::toOrderInfo);
  }

  @Override
  public Page<OrderInfo> getOverdueOrders(Pageable pageable) {
    return orderRepository.findOverdueOrders(Instant.now(), pageable).map(orderMapper::toOrderInfo);
  }

  // Private helper methods

  private UserEntity getCurrentUser() {
    try {
      UUID userId = SecurityUtils.getCurrentUserId();
      return userRepository.findById(userId).orElse(null); // Allow null for system operations
    } catch (Exception e) {
      log.warn("Could not get current user: {}", e.getMessage());
      return null;
    }
  }

  private PriceCalculationResponse calculateCartPricing(CartEntity cartEntity) {
    PriceCalculationRequest pricingRequest = new PriceCalculationRequest();

    // Convert cart items to pricing calculation items
    List<PriceCalculationItem> pricingItems = new ArrayList<>();
    for (CartItem cartItem : cartEntity.getItems()) {
      PriceCalculationItem pricingItem = new PriceCalculationItem();
      pricingItem.setPriceListItemId(cartItem.getPriceListItemEntity().getId());
      pricingItem.setQuantity(cartItem.getQuantity());

      // Add characteristics if present
      if (cartItem.getCharacteristics() != null) {
        com.aksi.api.pricing.dto.ItemCharacteristics characteristics =
            new com.aksi.api.pricing.dto.ItemCharacteristics();
        characteristics.setMaterial(cartItem.getCharacteristics().getMaterial());
        characteristics.setColor(cartItem.getCharacteristics().getColor());
        // Note: filler and fillerCondition not supported in pricing DTO
        if (cartItem.getCharacteristics().getWearLevel() != null) {
          try {
            characteristics.setWearLevel(
                com.aksi.api.pricing.dto.ItemCharacteristics.WearLevelEnum.fromValue(
                    cartItem.getCharacteristics().getWearLevel()));
          } catch (IllegalArgumentException e) {
            log.warn("Invalid wear level: {}", cartItem.getCharacteristics().getWearLevel());
          }
        }
        pricingItem.setCharacteristics(characteristics);
      }

      // Add modifiers
      List<String> modifierCodes = new ArrayList<>();
      for (CartItemModifierEntity modifier : cartItem.getModifiers()) {
        modifierCodes.add(modifier.getCode());
      }
      pricingItem.setModifierCodes(modifierCodes);

      pricingItems.add(pricingItem);
    }
    pricingRequest.setItems(pricingItems);

    // Set global modifiers
    GlobalPriceModifiers globalModifiers = new GlobalPriceModifiers();

    // Set urgency type
    if (cartEntity.getUrgencyType() != null) {
      try {
        globalModifiers.setUrgencyType(
            GlobalPriceModifiers.UrgencyTypeEnum.fromValue(cartEntity.getUrgencyType()));
      } catch (IllegalArgumentException e) {
        log.warn("Invalid urgency type: {}, using NORMAL", cartEntity.getUrgencyType());
        globalModifiers.setUrgencyType(GlobalPriceModifiers.UrgencyTypeEnum.NORMAL);
      }
    }

    // Set discount type
    if (cartEntity.getDiscountType() != null) {
      try {
        globalModifiers.setDiscountType(
            GlobalPriceModifiers.DiscountTypeEnum.fromValue(cartEntity.getDiscountType()));
        globalModifiers.setDiscountPercentage(cartEntity.getDiscountPercentage());
      } catch (IllegalArgumentException e) {
        log.warn("Invalid discount type: {}, using NONE", cartEntity.getDiscountType());
        globalModifiers.setDiscountType(GlobalPriceModifiers.DiscountTypeEnum.NONE);
      }
    }

    pricingRequest.setGlobalModifiers(globalModifiers);

    return pricingService.calculatePrice(pricingRequest);
  }

  private Instant calculateExpectedCompletionDate(CartEntity cartEntity) {
    Instant baseDate = Instant.now().plusSeconds((long) defaultCompletionHours * 3600);

    // Adjust based on urgency
    if ("EXPRESS_24H".equals(cartEntity.getUrgencyType())) {
      return Instant.now().plusSeconds(24 * 3600);
    } else if ("EXPRESS_48H".equals(cartEntity.getUrgencyType())) {
      return Instant.now().plusSeconds(48 * 3600);
    }

    return baseDate;
  }

  private OrderItemEntity convertCartItemToOrderItem(
      CartItem cartItem, OrderEntity orderEntity, PriceCalculationResponse pricing) {
    OrderItemEntity orderItemEntity = new OrderItemEntity();
    orderItemEntity.setOrderEntity(orderEntity);
    orderItemEntity.setPriceListItemEntity(cartItem.getPriceListItemEntity());
    orderItemEntity.setQuantity(cartItem.getQuantity());

    // Find the corresponding calculated price
    var calculatedPrice =
        pricing.getItems().stream()
            .filter(
                item -> item.getPriceListItemId().equals(cartItem.getPriceListItemEntity().getId()))
            .findFirst()
            .orElseThrow(
                () ->
                    new IllegalStateException(
                        "No pricing found for item: " + cartItem.getPriceListItemEntity().getId()));

    // Map pricing details
    orderItemEntity.setBasePrice(calculatedPrice.getBasePrice());
    orderItemEntity.setModifiersTotalAmount(
        calculatedPrice.getCalculations().getModifiersTotal() != null
            ? calculatedPrice.getCalculations().getModifiersTotal()
            : 0);
    orderItemEntity.setSubtotal(calculatedPrice.getCalculations().getSubtotal());
    orderItemEntity.setUrgencyAmount(
        calculatedPrice.getCalculations().getUrgencyModifier().getAmount());
    orderItemEntity.setDiscountAmount(
        calculatedPrice.getCalculations().getDiscountModifier().getAmount());
    orderItemEntity.setTotalAmount(calculatedPrice.getTotal());
    orderItemEntity.setDiscountEligible(
        calculatedPrice.getCalculations().getDiscountEligible() != null
            ? calculatedPrice.getCalculations().getDiscountEligible()
            : true);

    // Map characteristics if present
    if (cartItem.getCharacteristics() != null) {
      ItemCharacteristicsEntity characteristics = new ItemCharacteristicsEntity();
      characteristics.setOrderItemEntity(orderItemEntity);
      characteristics.setMaterial(cartItem.getCharacteristics().getMaterial());
      characteristics.setColor(cartItem.getCharacteristics().getColor());
      characteristics.setFiller(cartItem.getCharacteristics().getFiller());
      if (cartItem.getCharacteristics().getFillerCondition() != null) {
        characteristics.setFillerCondition(
            ItemCharacteristicsEntity.FillerCondition.valueOf(
                cartItem.getCharacteristics().getFillerCondition()));
      }
      characteristics.setWearLevel(cartItem.getCharacteristics().getWearLevel());
      orderItemEntity.setCharacteristics(characteristics);
    }

    return orderItemEntity;
  }

  private void validateStatusTransition(OrderEntity.OrderStatus from, OrderEntity.OrderStatus to) {
    // Define valid transitions
    boolean isValidTransition =
        switch (from) {
          case PENDING ->
              to == OrderEntity.OrderStatus.ACCEPTED || to == OrderEntity.OrderStatus.CANCELLED;
          case ACCEPTED ->
              to == OrderEntity.OrderStatus.IN_PROGRESS || to == OrderEntity.OrderStatus.CANCELLED;
          case IN_PROGRESS ->
              to == OrderEntity.OrderStatus.READY || to == OrderEntity.OrderStatus.CANCELLED;
          case READY -> to == OrderEntity.OrderStatus.COMPLETED;
          case COMPLETED, CANCELLED -> false; // Terminal states
        };

    if (!isValidTransition) {
      throw new BusinessValidationException(
          String.format("Invalid status transition from %s to %s", from, to));
    }
  }

  private void updateOrderItemCharacteristics(
      OrderItemEntity orderItemEntity, com.aksi.api.order.dto.ItemCharacteristics characteristics) {
    if (orderItemEntity.getCharacteristics() == null) {
      orderItemEntity.setCharacteristics(new ItemCharacteristicsEntity());
      orderItemEntity.getCharacteristics().setOrderItemEntity(orderItemEntity);
    }

    ItemCharacteristicsEntity itemChar = orderItemEntity.getCharacteristics();
    itemChar.setMaterial(characteristics.getMaterial());
    itemChar.setColor(characteristics.getColor());
    itemChar.setFiller(characteristics.getFiller());

    if (characteristics.getFillerCondition() != null) {
      itemChar.setFillerCondition(
          ItemCharacteristicsEntity.FillerCondition.valueOf(
              characteristics.getFillerCondition().name()));
    }

    if (characteristics.getWearLevel() != null) {
      itemChar.setWearLevel(characteristics.getWearLevel().getValue());
    }
  }

  private void updateOrderItemStains(
      OrderItemEntity orderItemEntity, List<com.aksi.api.order.dto.ItemStain> stains) {
    // Clear existing stains
    orderItemEntity.getStains().clear();

    // Add new stains
    for (var stainDto : stains) {
      ItemStainEntity stain = new ItemStainEntity();
      stain.setOrderItemEntity(orderItemEntity);
      stain.setType(ItemStainEntity.StainType.valueOf(stainDto.getType().name()));
      stain.setDescription(stainDto.getDescription());
      orderItemEntity.addStain(stain);
    }
  }

  private void updateOrderItemDefects(
      OrderItemEntity orderItemEntity, List<com.aksi.api.order.dto.ItemDefect> defects) {
    // Clear existing defects
    orderItemEntity.getDefects().clear();

    // Add new defects
    for (var defectDto : defects) {
      ItemDefectEntity defect = new ItemDefectEntity();
      defect.setOrderItemEntity(orderItemEntity);
      defect.setType(ItemDefectEntity.DefectType.valueOf(defectDto.getType().name()));
      defect.setDescription(defectDto.getDescription());
      orderItemEntity.addDefect(defect);
    }
  }

  private void updateOrderItemRisks(
      OrderItemEntity orderItemEntity, List<com.aksi.api.order.dto.ItemRisk> risks) {
    // Clear existing risks
    orderItemEntity.getRisks().clear();

    // Add new risks
    for (var riskDto : risks) {
      ItemRiskEntity risk = new ItemRiskEntity();
      risk.setOrderItemEntity(orderItemEntity);
      risk.setType(ItemRiskEntity.RiskType.valueOf(riskDto.getType().name()));
      risk.setDescription(riskDto.getDescription());
      orderItemEntity.addRisk(risk);
    }
  }
}
