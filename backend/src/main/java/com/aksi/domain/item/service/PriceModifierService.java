package com.aksi.domain.item.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.item.dto.CreatePriceModifierRequest;
import com.aksi.api.item.dto.PriceModifierResponse;
import com.aksi.api.item.dto.UpdatePriceModifierRequest;
import com.aksi.domain.item.entity.PriceModifierEntity;
import com.aksi.domain.item.exception.PriceModifierAlreadyExistsException;
import com.aksi.domain.item.exception.PriceModifierNotFoundException;
import com.aksi.domain.item.mapper.PriceModifierMapper;
import com.aksi.domain.item.repository.PriceModifierRepository;
import com.aksi.shared.service.BaseService;

/**
 * Сервіс для управління модифікаторами цін. Розширює BaseService для уникнення дублювання CRUD
 * логіки.
 */
@Service
@Transactional
public class PriceModifierService
    extends BaseService<PriceModifierEntity, PriceModifierRepository> {

  private final PriceModifierMapper mapper;

  public PriceModifierService(PriceModifierRepository repository, PriceModifierMapper mapper) {
    super(repository);
    this.mapper = mapper;
  }

  // ========== API МЕТОДИ (для контролерів) - DTO ↔ DTO ==========

  /** Створити новий модифікатор ціни. */
  public PriceModifierResponse createPriceModifier(CreatePriceModifierRequest request) {
    validateUniqueCode(request.getCode());

    var entity = mapper.toEntity(request);
    // UUID генерується автоматично через @UuidGenerator в BaseEntity

    var savedEntity = save(entity);
    return mapper.toResponse(savedEntity);
  }

  /** Отримати модифікатор за ID. */
  @Transactional(readOnly = true)
  public PriceModifierResponse getPriceModifierById(UUID id) {
    var entity = findByIdOrThrow(id);
    return mapper.toResponse(entity);
  }

  /** Оновити модифікатор ціни. */
  public PriceModifierResponse updatePriceModifier(UUID id, UpdatePriceModifierRequest request) {
    var entity = findByIdOrThrow(id);

    mapper.updateEntityFromRequest(request, entity);
    var savedEntity = save(entity);
    return mapper.toResponse(savedEntity);
  }

  /** Видалити модифікатор ціни. */
  public void deletePriceModifier(UUID id) {
    var entity = findByIdOrThrow(id);
    delete(entity);
  }

  /** Отримати всі модифікатори з пагінацією. */
  @Transactional(readOnly = true)
  public Page<PriceModifierResponse> getPriceModifiers(Pageable pageable) {
    var entityPage = findAll(pageable);
    return entityPage.map(mapper::toResponse);
  }

  /** Отримати активні модифікатори. */
  @Transactional(readOnly = true)
  public List<PriceModifierResponse> getActivePriceModifiers() {
    var entities = repository.findByIsActiveTrue();
    return entities.stream().map(mapper::toResponse).toList();
  }

  /** Отримати модифікатор за кодом. */
  @Transactional(readOnly = true)
  public PriceModifierResponse getPriceModifierByCode(String code) {
    var entity =
        repository
            .findByCode(code)
            .orElseThrow(
                () ->
                    new PriceModifierNotFoundException(
                        "Модифікатор з кодом '" + code + "' не знайдений"));
    return mapper.toResponse(entity);
  }

  // ========== HELPER МЕТОДИ ==========

  /** Знайти модифікатор за ID з винятком. */
  private PriceModifierEntity findByIdOrThrow(UUID id) {
    return repository.findById(id).orElseThrow(() -> new PriceModifierNotFoundException(id));
  }

  /** Валідація унікальності коду. */
  private void validateUniqueCode(String code) {
    if (repository.existsByCode(code)) {
      throw new PriceModifierAlreadyExistsException("Модифікатор з кодом '" + code + "' вже існує");
    }
  }
}
