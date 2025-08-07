package com.aksi.service.order;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.file.dto.FileUploadResponse;
import com.aksi.api.order.dto.AddPaymentRequest;
import com.aksi.api.order.dto.CreateOrderRequest;
import com.aksi.api.order.dto.ItemPhotoInfo;
import com.aksi.api.order.dto.OrderInfo;
import com.aksi.api.order.dto.OrderItemInfo;
import com.aksi.api.order.dto.PaymentInfo;
import com.aksi.api.order.dto.PhotoType;
import com.aksi.api.order.dto.UpdateItemCharacteristicsRequest;
import com.aksi.api.order.dto.UpdateOrderStatusRequest;
import com.aksi.api.pricing.dto.CalculatedItemPrice;
import com.aksi.api.pricing.dto.PriceCalculationResponse;
import com.aksi.domain.branch.BranchEntity;
import com.aksi.domain.cart.CartEntity;
import com.aksi.domain.cart.CartItem;
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
import com.aksi.repository.OrderRepository;
import com.aksi.repository.UserRepository;
import com.aksi.service.auth.AuthQueryService;
import com.aksi.service.storage.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for write operations on orders Follows CQRS pattern - handles all commands with
 * side effects
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderCommandService {

  private final OrderRepository orderRepository;
  private final CartRepository cartRepository;
  private final BranchRepository branchRepository;
  private final UserRepository userRepository;
  private final AuthQueryService authQueryService;
  private final FileStorageService fileStorageService;

  // Business logic components
  private final OrderNumberGenerator numberGenerator;
  private final OrderPricingCalculator pricingCalculator;
  private final OrderMapper orderMapper;

  /** Create new order from cart */
  public OrderInfo createOrder(CreateOrderRequest request) {
    log.info("Creating order from cart: {}", request.getCartId());

    // Get and validate cart
    CartEntity cartEntity = findAndValidateCart(request.getCartId());

    // Get and validate branch
    BranchEntity branchEntity = findAndValidateBranch(request.getBranchId());

    // Get current user
    UserEntity currentUserEntity = getCurrentUser();

    // Calculate pricing
    PriceCalculationResponse pricing = pricingCalculator.calculateCartPricing(cartEntity);

    // Build order entity
    OrderEntity orderEntity =
        buildOrderEntity(request, cartEntity, branchEntity, currentUserEntity);

    // Set pricing snapshot
    setPricingSnapshot(orderEntity, pricing);

    // Convert and add cart items
    convertCartItemsToOrderItems(cartEntity, orderEntity, pricing);

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

  /** Update order status */
  public OrderInfo updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
    log.info("Updating status for order: {}", orderId);

    OrderEntity orderEntity = findOrderById(orderId);

    OrderEntity.OrderStatus oldStatus = orderEntity.getStatus();
    OrderEntity.OrderStatus newStatus = OrderEntity.OrderStatus.valueOf(request.getStatus().name());

    validateStatusTransition(oldStatus, newStatus);

    orderEntity.setStatus(newStatus);

    if (shouldSetCompletionDate(newStatus, orderEntity.getActualCompletionDate())) {
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

  /** Update order item characteristics */
  public OrderItemInfo updateItemCharacteristics(
      UUID orderId, UUID itemId, UpdateItemCharacteristicsRequest request) {
    log.info("Updating characteristics for item {} in order {}", itemId, orderId);

    OrderEntity orderEntity = findOrderById(orderId);
    validateOrderCanBeModified(orderEntity);
    OrderItemEntity orderItemEntity = findOrderItemInOrder(orderEntity, itemId);

    // Update characteristics
    if (request.getCharacteristics() != null) {
      updateOrderItemCharacteristics(orderItemEntity, request.getCharacteristics());
    }

    // Update stains, defects, risks
    updateItemAttributes(orderItemEntity, request);

    orderRepository.save(orderEntity);

    log.info(
        "Updated characteristics for order item {} in order {}",
        itemId,
        orderEntity.getOrderNumber());
    return orderMapper.toOrderItemInfo(orderItemEntity);
  }

  /** Upload photo for order item */
  public ItemPhotoInfo uploadItemPhoto(
      UUID orderId, UUID itemId, MultipartFile file, PhotoType photoType, String photoDescription) {
    log.info("Uploading photo for item {} in order {}", itemId, orderId);

    OrderEntity orderEntity = findOrderById(orderId);
    OrderItemEntity orderItemEntity = findOrderItemInOrder(orderEntity, itemId);

    // Create photo entity (TODO: implement actual file upload)
    ItemPhotoEntity photo = createPhotoEntity(orderItemEntity, file, photoType, photoDescription);

    orderItemEntity.addPhoto(photo);
    orderRepository.save(orderEntity);

    log.info("Uploaded photo for order item {} in order {}", itemId, orderEntity.getOrderNumber());
    return orderMapper.toItemPhotoInfo(photo);
  }

  /** Delete photo from order item */
  public void deleteItemPhoto(UUID orderId, UUID itemId, UUID photoId) {
    log.info("Deleting photo {} from item {} in order {}", photoId, itemId, orderId);

    OrderEntity orderEntity = findOrderById(orderId);
    OrderItemEntity orderItemEntity = findOrderItemInOrder(orderEntity, itemId);
    ItemPhotoEntity photo = findPhotoInOrderItem(orderItemEntity, photoId);

    // Delete physical file if URL contains local path
    // Extract file path from URL if it's a local file
    String url = photo.getUrl();
    if (url != null && url.contains("/api/files/")) {
      String filePath = url.substring(url.indexOf("/api/files/") + 11);
      fileStorageService.deleteFile(filePath);
    }

    orderItemEntity.removePhoto(photo);
    orderRepository.save(orderEntity);

    log.info(
        "Deleted photo {} from order item {} in order {}",
        photoId,
        itemId,
        orderEntity.getOrderNumber());
  }

  /** Add payment to order */
  public PaymentInfo addOrderPayment(UUID orderId, AddPaymentRequest request) {
    log.info("Adding payment of {} to order {}", request.getAmount(), orderId);

    OrderEntity orderEntity = findOrderById(orderId);
    validateOrderNotCancelled(orderEntity);

    Integer remainingBalance = orderEntity.getBalanceDue();
    validatePaymentAmount(request.getAmount(), remainingBalance);

    OrderPaymentEntity payment = createPaymentEntity(orderEntity, request);

    orderEntity.addPayment(payment);
    orderRepository.save(orderEntity);

    log.info("Added payment of {} to order {}", request.getAmount(), orderEntity.getOrderNumber());
    return orderMapper.toPaymentInfo(payment);
  }

  /** Save customer signature */
  public OrderInfo saveCustomerSignature(UUID orderId, String signatureBase64) {
    log.info("Saving customer signature for order: {}", orderId);

    OrderEntity orderEntity = findOrderById(orderId);

    // Validate order status - can only add signature in certain states
    if (orderEntity.getStatus() != OrderEntity.OrderStatus.PENDING
        && orderEntity.getStatus() != OrderEntity.OrderStatus.READY
        && orderEntity.getStatus() != OrderEntity.OrderStatus.COMPLETED) {
      throw new BusinessValidationException(
          "Cannot add signature to order in status: " + orderEntity.getStatus());
    }

    // Save signature as base64 directly in the database
    orderEntity.setCustomerSignature(signatureBase64);
    orderEntity = orderRepository.save(orderEntity);

    log.info("Saved customer signature for order {}", orderEntity.getOrderNumber());
    return orderMapper.toOrderInfo(orderEntity);
  }

  // Private helper methods

  private void validatePhotoFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new BusinessValidationException("Photo file is required");
    }

    // Validate file size (max 10MB)
    if (file.getSize() > 10 * 1024 * 1024) {
      throw new BusinessValidationException("Photo file size must be less than 10MB");
    }

    // Validate content type
    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new BusinessValidationException("Only image files are allowed");
    }
  }

  private CartEntity findAndValidateCart(UUID cartId) {
    CartEntity cartEntity =
        cartRepository
            .findById(cartId)
            .orElseThrow(() -> new NotFoundException("Cart not found: " + cartId));

    validateCartForOrder(cartEntity);
    return cartEntity;
  }

  private BranchEntity findAndValidateBranch(UUID branchId) {
    BranchEntity branchEntity =
        branchRepository
            .findById(branchId)
            .orElseThrow(() -> new NotFoundException("Branch not found: " + branchId));

    validateBranchIsActive(branchEntity);
    return branchEntity;
  }

  private UserEntity getCurrentUser() {
    try {
      UUID userId = authQueryService.getCurrentUserIdFromContext();
      return userRepository.findById(userId).orElse(null);
    } catch (Exception e) {
      log.warn("Could not get current user: {}", e.getMessage());
      return null;
    }
  }

  private OrderEntity buildOrderEntity(
      CreateOrderRequest request,
      CartEntity cartEntity,
      BranchEntity branchEntity,
      UserEntity currentUserEntity) {
    OrderEntity orderEntity = new OrderEntity();
    orderEntity.setOrderNumber(numberGenerator.generateOrderNumber());
    orderEntity.setCustomerEntity(cartEntity.getCustomerEntity());
    orderEntity.setBranchEntity(branchEntity);
    orderEntity.setUniqueLabel(request.getUniqueLabel());
    orderEntity.setStatus(OrderEntity.OrderStatus.PENDING);
    orderEntity.setNotes(request.getNotes());
    orderEntity.setCustomerSignature(request.getCustomerSignature());
    orderEntity.setCreatedBy(currentUserEntity);
    orderEntity.setTermsAccepted(
        request.getTermsAccepted() != null ? request.getTermsAccepted() : false);
    orderEntity.setExpectedCompletionDate(
        pricingCalculator.calculateExpectedCompletionDate(cartEntity));
    return orderEntity;
  }

  private void setPricingSnapshot(OrderEntity orderEntity, PriceCalculationResponse pricing) {
    orderEntity.setItemsSubtotal(pricing.getTotals().getItemsSubtotal());
    orderEntity.setUrgencyAmount(pricing.getTotals().getUrgencyAmount());
    orderEntity.setDiscountAmount(pricing.getTotals().getDiscountAmount());
    orderEntity.setDiscountApplicableAmount(pricing.getTotals().getDiscountApplicableAmount());
    orderEntity.setTotalAmount(pricing.getTotals().getTotal());
  }

  private void convertCartItemsToOrderItems(
      CartEntity cartEntity, OrderEntity orderEntity, PriceCalculationResponse pricing) {
    for (CartItem cartItem : cartEntity.getItems()) {
      OrderItemEntity orderItemEntity = convertCartItemToOrderItem(cartItem, orderEntity, pricing);
      orderEntity.addItem(orderItemEntity);
    }
  }

  private void updateItemAttributes(
      OrderItemEntity orderItemEntity, UpdateItemCharacteristicsRequest request) {
    if (request.getStains() != null) {
      updateOrderItemStains(orderItemEntity, request.getStains());
    }
    if (request.getDefects() != null) {
      updateOrderItemDefects(orderItemEntity, request.getDefects());
    }
    if (request.getRisks() != null) {
      updateOrderItemRisks(orderItemEntity, request.getRisks());
    }
  }

  private ItemPhotoEntity createPhotoEntity(
      OrderItemEntity orderItemEntity,
      MultipartFile file,
      PhotoType photoType,
      String photoDescription) {
    // Validate file
    validatePhotoFile(file);

    // Generate directory path: orders/{orderId}/items/{itemId}/photos
    String directory =
        String.format(
            "orders/%s/items/%s/photos",
            orderItemEntity.getOrderEntity().getId(), orderItemEntity.getId());

    // Store file using new DTO approach
    FileUploadResponse uploadResponse = fileStorageService.storeFile(file, directory);
    String fileUrl = uploadResponse.getFileUrl();

    ItemPhotoEntity photo = new ItemPhotoEntity();
    photo.setOrderItemEntity(orderItemEntity);
    photo.setUrl(fileUrl);
    photo.setType(
        photoType != null
            ? ItemPhotoEntity.PhotoType.valueOf(photoType.name())
            : ItemPhotoEntity.PhotoType.GENERAL);
    photo.setDescription(photoDescription != null ? photoDescription : "Uploaded photo");
    photo.setUploadedBy(getCurrentUser());
    photo.setUploadedAt(Instant.now());
    photo.setOriginalFilename(file.getOriginalFilename());
    photo.setContentType(file.getContentType());
    photo.setFileSize(file.getSize());
    return photo;
  }

  private OrderPaymentEntity createPaymentEntity(
      OrderEntity orderEntity, AddPaymentRequest request) {
    OrderPaymentEntity payment = new OrderPaymentEntity();
    payment.setOrderEntity(orderEntity);
    payment.setAmount(request.getAmount());
    payment.setMethod(OrderPaymentEntity.PaymentMethod.valueOf(request.getMethod().name()));
    payment.setPaidBy(getCurrentUser());
    payment.setPaidAt(Instant.now());
    return payment;
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
      OrderItemEntity orderItemEntity, java.util.List<com.aksi.api.order.dto.ItemStain> stains) {
    orderItemEntity.getStains().clear();
    for (var stainDto : stains) {
      ItemStainEntity stain = new ItemStainEntity();
      stain.setOrderItemEntity(orderItemEntity);
      stain.setType(ItemStainEntity.StainType.valueOf(stainDto.getType().name()));
      stain.setDescription(stainDto.getDescription());
      orderItemEntity.addStain(stain);
    }
  }

  private void updateOrderItemDefects(
      OrderItemEntity orderItemEntity, java.util.List<com.aksi.api.order.dto.ItemDefect> defects) {
    orderItemEntity.getDefects().clear();
    for (var defectDto : defects) {
      ItemDefectEntity defect = new ItemDefectEntity();
      defect.setOrderItemEntity(orderItemEntity);
      defect.setType(ItemDefectEntity.DefectType.valueOf(defectDto.getType().name()));
      defect.setDescription(defectDto.getDescription());
      orderItemEntity.addDefect(defect);
    }
  }

  private void updateOrderItemRisks(
      OrderItemEntity orderItemEntity, java.util.List<com.aksi.api.order.dto.ItemRisk> risks) {
    orderItemEntity.getRisks().clear();
    for (var riskDto : risks) {
      ItemRiskEntity risk = new ItemRiskEntity();
      risk.setOrderItemEntity(orderItemEntity);
      risk.setType(ItemRiskEntity.RiskType.valueOf(riskDto.getType().name()));
      risk.setDescription(riskDto.getDescription());
      orderItemEntity.addRisk(risk);
    }
  }

  // Finder methods from OrderFinder

  /** Find order by ID with validation */
  private OrderEntity findOrderById(UUID orderId) {
    return orderRepository
        .findById(orderId)
        .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));
  }

  /** Find order item within order with validation */
  private OrderItemEntity findOrderItemInOrder(OrderEntity orderEntity, UUID itemId) {
    return orderEntity.getItems().stream()
        .filter(item -> item.getId().equals(itemId))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Order item not found: " + itemId));
  }

  /** Find photo within order item with validation */
  private ItemPhotoEntity findPhotoInOrderItem(OrderItemEntity orderItemEntity, UUID photoId) {
    return orderItemEntity.getPhotos().stream()
        .filter(photo -> photo.getId().equals(photoId))
        .findFirst()
        .orElseThrow(() -> new NotFoundException("Photo not found: " + photoId));
  }

  // Validation methods from OrderValidationHelper

  /** Validate cart is valid for order creation */
  private void validateCartForOrder(CartEntity cartEntity) {
    if (cartEntity.isExpired()) {
      throw new BusinessValidationException("Cart has expired");
    }
    if (cartEntity.getItems().isEmpty()) {
      throw new BusinessValidationException("Cannot create order from empty cart");
    }
  }

  /** Validate branch is active */
  private void validateBranchIsActive(BranchEntity branchEntity) {
    if (!branchEntity.isActive()) {
      throw new BusinessValidationException("Branch is not active");
    }
  }

  /** Validate order can be modified */
  private void validateOrderCanBeModified(OrderEntity orderEntity) {
    if (!orderEntity.canBeModified()) {
      throw new BusinessValidationException("Order cannot be modified in current status");
    }
  }

  /** Validate order is not cancelled */
  private void validateOrderNotCancelled(OrderEntity orderEntity) {
    if (orderEntity.isCancelled()) {
      throw new BusinessValidationException("Cannot perform operation on cancelled order");
    }
  }

  /** Validate payment amount against remaining balance */
  private void validatePaymentAmount(Integer paymentAmount, Integer remainingBalance) {
    if (paymentAmount > remainingBalance) {
      throw new BusinessValidationException(
          String.format(
              "Payment amount (%d) exceeds remaining balance (%d)",
              paymentAmount, remainingBalance));
    }
  }

  /** Validate status transition is allowed */
  private void validateStatusTransition(
      OrderEntity.OrderStatus fromStatus, OrderEntity.OrderStatus toStatus) {
    boolean isValidTransition =
        switch (fromStatus) {
          case PENDING ->
              toStatus == OrderEntity.OrderStatus.ACCEPTED
                  || toStatus == OrderEntity.OrderStatus.CANCELLED;
          case ACCEPTED ->
              toStatus == OrderEntity.OrderStatus.IN_PROGRESS
                  || toStatus == OrderEntity.OrderStatus.CANCELLED;
          case IN_PROGRESS ->
              toStatus == OrderEntity.OrderStatus.READY
                  || toStatus == OrderEntity.OrderStatus.CANCELLED;
          case READY -> toStatus == OrderEntity.OrderStatus.COMPLETED;
          case COMPLETED, CANCELLED -> false; // Terminal states
        };

    if (!isValidTransition) {
      throw new BusinessValidationException(
          String.format("Invalid status transition from %s to %s", fromStatus, toStatus));
    }
  }

  /** Check if order completion date should be set */
  private boolean shouldSetCompletionDate(
      OrderEntity.OrderStatus newStatus, Instant currentCompletionDate) {
    return newStatus == OrderEntity.OrderStatus.COMPLETED && currentCompletionDate == null;
  }

  // Cart item conversion logic from OrderItemConverter

  /** Convert cart item to order item with pricing information */
  private OrderItemEntity convertCartItemToOrderItem(
      CartItem cartItem, OrderEntity orderEntity, PriceCalculationResponse pricing) {

    log.debug("Converting cart item {} to order item", cartItem.getPriceListItemEntity().getId());

    OrderItemEntity orderItemEntity = new OrderItemEntity();
    orderItemEntity.setOrderEntity(orderEntity);
    orderItemEntity.setPriceListItemEntity(cartItem.getPriceListItemEntity());
    orderItemEntity.setQuantity(cartItem.getQuantity());

    // Find the corresponding calculated price
    var calculatedPrice = findCalculatedPriceForCartItem(cartItem, pricing);

    // Map pricing details
    mapPricingDetailsToOrderItem(orderItemEntity, calculatedPrice);

    // Map characteristics if present
    if (cartItem.getCharacteristics() != null) {
      mapCharacteristicsToOrderItem(orderItemEntity, cartItem);
    }

    log.debug("Successfully converted cart item to order item");
    return orderItemEntity;
  }

  /** Find calculated price for cart item in pricing response */
  private CalculatedItemPrice findCalculatedPriceForCartItem(
      CartItem cartItem, PriceCalculationResponse pricing) {

    return pricing.getItems().stream()
        .filter(item -> item.getPriceListItemId().equals(cartItem.getPriceListItemEntity().getId()))
        .findFirst()
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "No pricing found for item: " + cartItem.getPriceListItemEntity().getId()));
  }

  /** Map pricing details from calculated price to order item */
  private void mapPricingDetailsToOrderItem(
      OrderItemEntity orderItemEntity, CalculatedItemPrice calculatedPrice) {

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
  }

  /** Map characteristics from cart item to order item */
  private void mapCharacteristicsToOrderItem(OrderItemEntity orderItemEntity, CartItem cartItem) {
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

    log.debug("Mapped characteristics for order item");
  }
}
