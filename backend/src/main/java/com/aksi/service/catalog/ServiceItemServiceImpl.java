package com.aksi.service.catalog;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.service.dto.CreateServiceItemInfoRequest;
import com.aksi.api.service.dto.ListServiceItemsResponse;
import com.aksi.api.service.dto.ServiceItemInfo;
import com.aksi.api.service.dto.UpdateServiceItemInfoRequest;
import com.aksi.domain.catalog.ItemCatalog;
import com.aksi.domain.catalog.ServiceCatalog;
import com.aksi.domain.catalog.ServiceItem;
import com.aksi.exception.ConflictException;
import com.aksi.exception.NotFoundException;
import com.aksi.mapper.catalog.ServiceItemMapper;
import com.aksi.repository.catalog.ItemRepository;
import com.aksi.repository.catalog.ServiceItemRepository;
import com.aksi.repository.catalog.ServiceRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Implementation of ServiceItemService */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ServiceItemServiceImpl implements ServiceItemService {

  private final ServiceItemRepository serviceItemRepository;
  private final ServiceRepository serviceRepository;
  private final ItemRepository itemRepository;
  private final ServiceItemMapper serviceItemMapper;

  private Page<ServiceItemInfo> listServiceItems(
      UUID serviceId, UUID itemId, UUID branchId, Boolean active, Pageable pageable) {
    log.debug(
        "Listing service-items with serviceId: {}, itemId: {}, branchId: {}, active: {}",
        serviceId,
        itemId,
        branchId,
        active);

    Page<ServiceItem> page;

    if (serviceId != null && itemId != null) {
      page = serviceItemRepository.findByServiceIdAndItemId(serviceId, itemId, pageable);
    } else if (serviceId != null) {
      page = serviceItemRepository.findByServiceCatalogId(serviceId, pageable);
    } else if (itemId != null) {
      page = serviceItemRepository.findByItemCatalogId(itemId, pageable);
    } else if (active != null && active) {
      page = serviceItemRepository.findByActiveTrue(pageable);
    } else {
      page = serviceItemRepository.findAll(pageable);
    }

    List<ServiceItemInfo> dtos =
        page.getContent().stream().map(this::mapToServiceItemInfo).collect(Collectors.toList());

    return new PageImpl<>(dtos, pageable, page.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public ServiceItemInfo getServiceItemById(UUID serviceItemId, UUID branchId) {
    log.debug("Getting service-item by id: {}, branchId: {}", serviceItemId, branchId);

    ServiceItem serviceItem =
        serviceItemRepository
            .findById(serviceItemId)
            .orElseThrow(
                () -> new NotFoundException("ServiceItem not found with id: " + serviceItemId));

    return mapToServiceItemInfo(serviceItem);
  }

  @Override
  public ServiceItemInfo createServiceItem(CreateServiceItemInfoRequest request) {
    log.debug(
        "Creating new service-item for service: {} and item: {}",
        request.getServiceId(),
        request.getItemId());

    // Check if combination already exists
    if (serviceItemRepository.existsByServiceCatalogIdAndItemCatalogId(
        request.getServiceId(), request.getItemId())) {
      throw new ConflictException("Service-item combination already exists");
    }

    // Verify service exists
    ServiceCatalog serviceCatalog =
        serviceRepository
            .findById(request.getServiceId())
            .orElseThrow(
                () ->
                    new NotFoundException("Service not found with id: " + request.getServiceId()));

    // Verify item exists
    ItemCatalog itemCatalog =
        itemRepository
            .findById(request.getItemId())
            .orElseThrow(
                () -> new NotFoundException("Item not found with id: " + request.getItemId()));

    ServiceItem serviceItem = serviceItemMapper.toEntity(request);
    serviceItem.setServiceCatalog(serviceCatalog);
    serviceItem.setItemCatalog(itemCatalog);
    serviceItem.setActive(true);
    serviceItem.setAvailableForOrder(true);

    ServiceItem saved = serviceItemRepository.save(serviceItem);
    log.info("Created new service-item with id: {}", saved.getId());

    return serviceItemMapper.toServiceItemResponse(saved);
  }

  @Override
  public ServiceItemInfo updateServiceItem(
      UUID serviceItemId, UpdateServiceItemInfoRequest request) {
    log.debug("Updating service-item with id: {}", serviceItemId);

    ServiceItem serviceItem =
        serviceItemRepository
            .findById(serviceItemId)
            .orElseThrow(
                () -> new NotFoundException("ServiceItem not found with id: " + serviceItemId));

    serviceItemMapper.updateEntityFromDto(request, serviceItem);

    ServiceItem updated = serviceItemRepository.save(serviceItem);
    log.info("Updated service-item with id: {}", updated.getId());

    return serviceItemMapper.toServiceItemResponse(updated);
  }

  @Override
  @Transactional(readOnly = true)
  public ListServiceItemsResponse listServiceItems(
      UUID serviceId, UUID itemId, UUID branchId, Boolean active, Integer offset, Integer limit) {
    int pageNumber = (offset != null && limit != null && limit > 0) ? offset / limit : 0;
    int pageSize = (limit != null && limit > 0) ? limit : 20;

    Page<ServiceItemInfo> page =
        listServiceItems(
            serviceId,
            itemId,
            branchId,
            active,
            PageRequest.of(pageNumber, pageSize, Sort.by("sortOrder").ascending()));

    ListServiceItemsResponse response = new ListServiceItemsResponse();
    response.setServiceItems(page.getContent());
    response.setTotalCount((int) page.getTotalElements());
    return response;
  }

  @Override
  @Transactional(readOnly = true)
  public List<ServiceItemInfo> getServiceItemsByService(UUID serviceId) {
    log.debug("Getting service-items by service: {}", serviceId);

    Page<ServiceItem> items =
        serviceItemRepository.findByServiceCatalogIdAndActiveTrue(serviceId, Pageable.unpaged());

    return items.stream()
        .map(serviceItemMapper::toServiceItemResponse)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<ServiceItemInfo> getServiceItemsByItem(UUID itemId) {
    log.debug("Getting service-items by item: {}", itemId);

    Page<ServiceItem> items =
        serviceItemRepository.findByItemCatalogIdAndActiveTrue(itemId, Pageable.unpaged());

    return items.stream()
        .map(serviceItemMapper::toServiceItemResponse)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<ServiceItemInfo> getAvailableItemsForService(UUID serviceId) {
    log.debug("Getting available items for service: {}", serviceId);

    Page<ServiceItem> items =
        serviceItemRepository.findByServiceCatalogIdAndActiveTrueAndAvailableForOrderTrue(
            serviceId, Pageable.unpaged());

    return items.stream()
        .map(serviceItemMapper::toServiceItemResponse)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public boolean updateServiceItemPrices(
      UUID serviceItemId, Integer basePrice, Integer priceBlack, Integer priceColor) {
    log.debug(
        "Updating service item {} prices: base={}, black={}, color={}",
        serviceItemId,
        basePrice,
        priceBlack,
        priceColor);

    ServiceItem serviceItem = serviceItemRepository.findById(serviceItemId).orElse(null);
    if (serviceItem == null) {
      log.warn("Service item not found: {}", serviceItemId);
      return false;
    }

    boolean updated = false;

    // Update base price
    if (basePrice != null && !basePrice.equals(serviceItem.getBasePrice())) {
      serviceItem.setBasePrice(basePrice);
      updated = true;
    }

    // Update black price
    if (priceBlack != null && !priceBlack.equals(serviceItem.getPriceBlack())) {
      serviceItem.setPriceBlack(priceBlack);
      updated = true;
    }

    // Update color price
    if (priceColor != null && !priceColor.equals(serviceItem.getPriceColor())) {
      serviceItem.setPriceColor(priceColor);
      updated = true;
    }

    if (updated) {
      serviceItemRepository.save(serviceItem);
      log.debug("Updated prices for service item: {}", serviceItemId);
    }

    return updated;
  }

  // Helper method for mapping
  private ServiceItemInfo mapToServiceItemInfo(ServiceItem serviceItem) {
    return serviceItemMapper.toServiceItemResponse(serviceItem);
  }
}
