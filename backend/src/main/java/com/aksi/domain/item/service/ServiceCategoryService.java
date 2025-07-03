package com.aksi.domain.item.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.item.dto.CreateServiceCategoryRequest;
import com.aksi.api.item.dto.ServiceCategoryResponse;
import com.aksi.api.item.dto.UpdateServiceCategoryRequest;
import com.aksi.domain.item.entity.ServiceCategoryEntity;
import com.aksi.domain.item.exception.ServiceCategoryAlreadyExistsException;
import com.aksi.domain.item.exception.ServiceCategoryNotFoundException;
import com.aksi.domain.item.mapper.ServiceCategoryMapper;
import com.aksi.domain.item.repository.ServiceCategoryRepository;
import com.aksi.shared.service.BaseService;

/**
 * Сервіс для управління категоріями послуг. Розширює BaseService для уникнення дублювання CRUD
 * логіки.
 */
@Service
@Transactional
public class ServiceCategoryService
    extends BaseService<ServiceCategoryEntity, ServiceCategoryRepository> {

  private final ServiceCategoryMapper mapper;

  public ServiceCategoryService(
      ServiceCategoryRepository repository, ServiceCategoryMapper mapper) {
    super(repository);
    this.mapper = mapper;
  }

  // ========== API МЕТОДИ (для контролерів) - DTO ↔ DTO ==========

  /** Створити нову категорію послуг. */
  public ServiceCategoryResponse createServiceCategory(CreateServiceCategoryRequest request) {
    validateUniqueCode(request.getCode());

    var entity = mapper.toEntity(request);
    // UUID генерується автоматично через @UuidGenerator в BaseEntity

    var savedEntity = save(entity);
    return mapper.toResponse(savedEntity);
  }

  /** Отримати категорію за ID. */
  @Transactional(readOnly = true)
  public ServiceCategoryResponse getServiceCategoryById(UUID id) {
    var entity = findByIdOrThrow(id);
    return mapper.toResponse(entity);
  }

  /** Оновити категорію послуг. */
  public ServiceCategoryResponse updateServiceCategory(
      UUID id, UpdateServiceCategoryRequest request) {
    var entity = findByIdOrThrow(id);

    mapper.updateEntityFromRequest(request, entity);
    var savedEntity = save(entity);
    return mapper.toResponse(savedEntity);
  }

  /** Видалити категорію послуг. */
  public void deleteServiceCategory(UUID id) {
    var entity = findByIdOrThrow(id);

    // Перевірити чи немає дочірніх категорій
    var childCategories = repository.findByParentId(id);
    if (!childCategories.isEmpty()) {
      throw new IllegalStateException("Неможливо видалити категорію з дочірніми категоріями");
    }

    delete(entity);
  }

  /** Отримати список активних категорій. */
  @Transactional(readOnly = true)
  public List<ServiceCategoryResponse> getActiveServiceCategories() {
    var entities = repository.findByIsActiveTrue();
    return mapper.toResponseList(entities);
  }

  /** Отримати всі категорії з пагінацією. */
  @Transactional(readOnly = true)
  public Page<ServiceCategoryResponse> getServiceCategories(Pageable pageable) {
    var entityPage = findAll(pageable);
    return entityPage.map(mapper::toResponse);
  }

  /** Отримати дочірні категорії. */
  @Transactional(readOnly = true)
  public List<ServiceCategoryResponse> getChildCategories(UUID parentUuid) {
    var entities = repository.findByParentId(parentUuid);
    return mapper.toResponseList(entities);
  }

  // ========== HELPER МЕТОДИ ==========

  /** Знайти категорію за ID з винятком. */
  private ServiceCategoryEntity findByIdOrThrow(UUID id) {
    return repository.findById(id).orElseThrow(() -> new ServiceCategoryNotFoundException(id));
  }

  /** Валідація унікальності коду. */
  private void validateUniqueCode(String code) {
    if (repository.existsByCode(code)) {
      throw ServiceCategoryAlreadyExistsException.byCode(code);
    }
  }
}
