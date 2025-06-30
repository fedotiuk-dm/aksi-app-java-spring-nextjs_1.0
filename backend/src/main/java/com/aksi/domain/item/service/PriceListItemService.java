package com.aksi.domain.item.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.item.dto.CreatePriceListItemRequest;
import com.aksi.api.item.dto.PriceListItemResponse;
import com.aksi.api.item.dto.UpdatePriceListItemRequest;
import com.aksi.domain.item.entity.PriceListItemEntity;
import com.aksi.domain.item.exception.PriceListItemAlreadyExistsException;
import com.aksi.domain.item.exception.PriceListItemNotFoundException;
import com.aksi.domain.item.mapper.PriceListItemMapper;
import com.aksi.domain.item.repository.PriceListItemRepository;
import com.aksi.domain.item.repository.ServiceCategoryRepository;

import lombok.RequiredArgsConstructor;

/**
 * Сервіс для управління позиціями прайс-листа.
 *
 * <p>Архітектура: - API методи (public) - працюють з DTO для контролерів - Entity методи
 * (package-private) - працюють з Entity для внутрішньої логіки - Business logic + validation +
 * transaction management
 */
@Service
@Transactional
@RequiredArgsConstructor
public class PriceListItemService {

  private final PriceListItemRepository repository;
  private final ServiceCategoryRepository categoryRepository;
  private final PriceListItemMapper mapper;

  // ========== API МЕТОДИ (для контролерів) - DTO ↔ DTO ==========

  /** Створити нову позицію прайс-листа */
  public PriceListItemResponse createPriceListItem(CreatePriceListItemRequest request) {
    validateUniqueCatalogNumber(request.getCatalogNumber());
    validateCategoryExists(request.getCategoryId());

    var entity = mapper.toEntity(request);
    entity.setUuid(UUID.randomUUID());

    var savedEntity = repository.save(entity);
    return enrichAndMapToResponse(savedEntity);
  }

  /** Отримати позицію за UUID */
  @Transactional(readOnly = true)
  public PriceListItemResponse getPriceListItemById(UUID uuid) {
    var entity = findByUuid(uuid);
    return enrichAndMapToResponse(entity);
  }

  /** Оновити позицію прайс-листа */
  public PriceListItemResponse updatePriceListItem(UUID uuid, UpdatePriceListItemRequest request) {
    var entity = findByUuid(uuid);

    mapper.updateEntityFromRequest(request, entity);
    var savedEntity = repository.save(entity);
    return enrichAndMapToResponse(savedEntity);
  }

  /** Видалити позицію прайс-листа */
  public void deletePriceListItem(UUID uuid) {
    var entity = findByUuid(uuid);
    repository.delete(entity);
  }

  /** Отримати всі позиції з пагінацією */
  @Transactional(readOnly = true)
  public Page<PriceListItemResponse> getPriceListItems(Pageable pageable) {
    var entityPage = repository.findAll(pageable);
    return entityPage.map(this::enrichAndMapToResponse);
  }

  /** Отримати позиції за категорією */
  @Transactional(readOnly = true)
  public List<PriceListItemResponse> getPriceListItemsByCategory(UUID categoryUuid) {
    var entities = repository.findByCategoryId(categoryUuid);
    return entities.stream().map(this::enrichAndMapToResponse).toList();
  }

  /** Отримати позиції за категорією з пагінацією */
  @Transactional(readOnly = true)
  public Page<PriceListItemResponse> getPriceListItemsByCategory(
      UUID categoryUuid, Pageable pageable) {
    var entityPage = repository.findByCategoryId(categoryUuid, pageable);
    return entityPage.map(this::enrichAndMapToResponse);
  }

  /** Отримати активні позиції */
  @Transactional(readOnly = true)
  public List<PriceListItemResponse> getActivePriceListItems() {
    var entities = repository.findByIsActiveTrue();
    return entities.stream().map(this::enrichAndMapToResponse).toList();
  }

  /** Отримати активні позиції з пагінацією */
  @Transactional(readOnly = true)
  public Page<PriceListItemResponse> getActivePriceListItems(Pageable pageable) {
    var entityPage = repository.findByIsActiveTrue(pageable);
    return entityPage.map(this::enrichAndMapToResponse);
  }

  /** Пошук позицій прайс-листа */
  @Transactional(readOnly = true)
  public List<PriceListItemResponse> searchPriceListItems(
      String query, UUID categoryId, Integer limit) {
    List<PriceListItemEntity> entities;

    if (categoryId != null) {
      // Пошук в межах категорії
      entities = repository.findByCategoryIdAndNameContainingIgnoreCase(categoryId, query);
    } else {
      // Загальний пошук
      entities = repository.findByNameContainingIgnoreCase(query);
    }

    // Обмежуємо результати якщо вказаний ліміт
    if (limit != null && limit > 0) {
      entities = entities.stream().limit(limit).toList();
    }

    return entities.stream().map(this::enrichAndMapToResponse).toList();
  }

  /** Отримати прайс-лист з пагінацією та фільтрацією (для API) */
  @Transactional(readOnly = true)
  public com.aksi.api.item.dto.PriceListPageResponse getPriceListWithPagination(
      Integer page, Integer size, String sort, UUID categoryId, String search, Boolean active) {
    var pageable =
        PageRequest.of(
            page != null ? page : 0,
            size != null ? size : 20,
            sort != null ? Sort.by(sort) : Sort.by("catalogNumber"));

    Page<PriceListItemResponse> pageResult;

    if (categoryId != null) {
      pageResult = getPriceListItemsByCategory(categoryId, pageable);
    } else if (Boolean.TRUE.equals(active)) {
      pageResult = getActivePriceListItems(pageable);
    } else {
      pageResult = getPriceListItems(pageable);
    }

    // Сервіс використовує mapper для конвертації
    return mapper.toPageResponse(pageResult);
  }

  // ========== HELPER МЕТОДИ ==========

  /** Знайти позицію за UUID (internal helper) */
  private PriceListItemEntity findByUuid(UUID uuid) {
    return repository.findByUuid(uuid).orElseThrow(() -> new PriceListItemNotFoundException(uuid));
  }

  /** Валідація унікальності каталогового номера */
  private void validateUniqueCatalogNumber(Integer catalogNumber) {
    if (repository.existsByCatalogNumber(catalogNumber)) {
      throw new PriceListItemAlreadyExistsException(
          "Позиція з каталоговим номером " + catalogNumber + " вже існує");
    }
  }

  /** Валідація існування категорії */
  private void validateCategoryExists(UUID categoryUuid) {
    if (categoryRepository.findByUuid(categoryUuid).isEmpty()) {
      throw new IllegalArgumentException("Категорія з UUID " + categoryUuid + " не існує");
    }
  }

  /** Збагатити entity додатковими даними та змапити до Response */
  private PriceListItemResponse enrichAndMapToResponse(PriceListItemEntity entity) {
    var response = mapper.toResponse(entity);

    // Збагачуємо інформацією про категорію
    categoryRepository
        .findByUuid(entity.getCategoryId())
        .ifPresent(
            category -> {
              response.setCategoryInfo(
                  new com.aksi.api.item.dto.ServiceCategorySummary()
                      .id(category.getUuid())
                      .name(category.getName())
                      .code(category.getCode()));
            });

    return response;
  }
}
