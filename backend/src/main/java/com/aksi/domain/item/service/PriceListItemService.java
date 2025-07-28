package com.aksi.domain.item.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.aksi.api.item.dto.PriceListItemListResponse;
import com.aksi.api.item.dto.PriceListItemResponse;
import com.aksi.api.item.dto.PriceListSearchRequest;
import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.exception.PriceListItemNotFoundException;
import com.aksi.domain.item.mapper.PriceListItemMapper;
import com.aksi.domain.item.repository.PriceListItemRepository;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for managing price list items. */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PriceListItemService {

  private final PriceListItemRepository priceListItemRepository;
  private final PriceListItemMapper priceListItemMapper;

  /**
   * Search price list items.
   *
   * @param searchRequest search parameters
   * @return list of price list items
   */
  public PriceListItemListResponse searchPriceListItems(PriceListSearchRequest searchRequest) {
    log.debug("Searching price list items with request: {}", searchRequest);

    // Create specification based on search criteria
    Specification<PriceListItemEntity> spec = createSpecification(searchRequest);

    // Create pageable if pagination is requested
    List<PriceListItemEntity> items;
    long total;

    if (searchRequest.getPage() != null && searchRequest.getSize() != null) {
      Pageable pageable =
          PageRequest.of(
              searchRequest.getPage(), searchRequest.getSize(), Sort.by("displayOrder", "name"));
      Page<PriceListItemEntity> page = priceListItemRepository.findAll(spec, pageable);
      items = page.getContent();
      total = page.getTotalElements();
    } else {
      items = priceListItemRepository.findAll(spec, Sort.by("displayOrder", "name"));
      total = items.size();
    }

    // Use mapper to create response
    PriceListItemListResponse response = priceListItemMapper.toListResponse(items, total);

    log.debug("Found {} price list items", response.getTotal());
    return response;
  }

  /**
   * Get price list item by ID.
   *
   * @param id item ID
   * @return price list item
   */
  public PriceListItemResponse getPriceListItemById(UUID id) {
    log.debug("Getting price list item by id: {}", id);

    PriceListItemEntity item =
        priceListItemRepository
            .findById(id)
            .orElseThrow(() -> new PriceListItemNotFoundException(id));

    // Use mapper to create response
    PriceListItemResponse response = priceListItemMapper.toItemResponse(item);

    log.debug("Found price list item: {}", item.getName());
    return response;
  }

  /**
   * Get price list item entity by ID. For internal use by other services.
   *
   * @param id item ID
   * @return price list item entity
   */
  public PriceListItemEntity getPriceListItemEntityById(UUID id) {
    return priceListItemRepository
        .findById(id)
        .orElseThrow(() -> new PriceListItemNotFoundException(id));
  }

  /**
   * Get price list items by category code.
   *
   * @param categoryCode category code
   * @param activeOnly whether to include only active items
   * @return list of price list items
   */
  public List<PriceListItemEntity> getItemsByCategoryCode(String categoryCode, boolean activeOnly) {
    if (activeOnly) {
      return priceListItemRepository.findByCategoryCategoryCodeAndActiveTrue(categoryCode);
    } else {
      return priceListItemRepository.findByCategoryCategoryCode(categoryCode);
    }
  }

  /** Create specification for price list item search. */
  private Specification<PriceListItemEntity> createSpecification(
      PriceListSearchRequest searchRequest) {
    return (root, query, criteriaBuilder) -> {
      List<Predicate> predicates = new ArrayList<>();

      // Filter by category code
      if (StringUtils.hasText(searchRequest.getCategoryCode())) {
        predicates.add(
            criteriaBuilder.equal(
                root.get("category").get("code"), searchRequest.getCategoryCode()));
      }

      // Filter by search term
      if (StringUtils.hasText(searchRequest.getSearchTerm())) {
        String searchPattern = "%" + searchRequest.getSearchTerm().toLowerCase() + "%";
        predicates.add(
            criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern),
                criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("description")), searchPattern)));
      }

      // Filter by price range
      if (searchRequest.getMinPrice() != null) {
        predicates.add(
            criteriaBuilder.greaterThanOrEqualTo(
                root.get("basePrice"), searchRequest.getMinPrice()));
      }
      if (searchRequest.getMaxPrice() != null) {
        predicates.add(
            criteriaBuilder.lessThanOrEqualTo(root.get("basePrice"), searchRequest.getMaxPrice()));
      }

      // Filter by unit of measure
      if (StringUtils.hasText(searchRequest.getUnitOfMeasure())) {
        predicates.add(
            criteriaBuilder.equal(root.get("unitOfMeasure"), searchRequest.getUnitOfMeasure()));
      }

      // Filter by active status
      if (searchRequest.getOnlyActive() == null || searchRequest.getOnlyActive()) {
        predicates.add(criteriaBuilder.isTrue(root.get("active")));
      }

      return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    };
  }

  /**
   * Get total count of price list items.
   *
   * @return total count of items
   */
  public long getTotalItemCount() {
    long count = priceListItemRepository.count();
    log.debug("Total price list items count: {}", count);
    return count;
  }
}
