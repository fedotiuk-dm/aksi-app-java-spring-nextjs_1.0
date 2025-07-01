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
import com.aksi.shared.service.EntityCreationHelper;

/**
 * Сервіс для управління модифікаторами цін. Розширює BaseService для уникнення дублювання CRUD
 * логіки.
 */
@Service
@Transactional
public class PriceModifierService
    extends BaseService<PriceModifierEntity, Long, PriceModifierRepository> {

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
    EntityCreationHelper.setRandomUuid(entity);

    var savedEntity = save(entity);
    return mapper.toResponse(savedEntity);
  }

  /** Отримати модифікатор за UUID. */
  @Transactional(readOnly = true)
  public PriceModifierResponse getPriceModifierById(UUID uuid) {
    var entity = findByUuidOrThrow(uuid);
    return mapper.toResponse(entity);
  }

  /** Оновити модифікатор ціни. */
  public PriceModifierResponse updatePriceModifier(UUID uuid, UpdatePriceModifierRequest request) {
    var entity = findByUuidOrThrow(uuid);

    mapper.updateEntityFromRequest(request, entity);
    var savedEntity = save(entity);
    return mapper.toResponse(savedEntity);
  }

  /** Видалити модифікатор ціни. */
  public void deletePriceModifier(UUID uuid) {
    var entity = findByUuidOrThrow(uuid);
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

  /** Знайти модифікатор за UUID з винятком. */
  private PriceModifierEntity findByUuidOrThrow(UUID uuid) {
    return repository.findByUuid(uuid).orElseThrow(() -> new PriceModifierNotFoundException(uuid));
  }

  /** Валідація унікальності коду. */
  private void validateUniqueCode(String code) {
    if (repository.existsByCode(code)) {
      throw new PriceModifierAlreadyExistsException("Модифікатор з кодом '" + code + "' вже існує");
    }
  }
}
