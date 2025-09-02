package com.aksi.service.game.factory;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.BoosterListResponse;
import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;
import com.aksi.domain.game.BoosterEntity;
import com.aksi.mapper.BoosterMapper;
import com.aksi.service.game.util.EntityFactory;

import lombok.RequiredArgsConstructor;

/**
 * Factory for creating Booster entities and DTOs with common operations. Reduces code duplication
 * and provides consistent creation patterns.
 */
@Component
@RequiredArgsConstructor
public class BoosterFactory {

  private final BoosterMapper boosterMapper;

  /**
   * Create BoosterEntity from CreateBoosterRequest.
   *
   * @param request Create request
   * @return New BoosterEntity
   */
  public BoosterEntity createEntity(CreateBoosterRequest request) {
    BoosterEntity entity = boosterMapper.toBoosterEntity(request);
    // Set booster-specific defaults
    entity.setRating(0); // Default rating
    entity.setTotalOrders(0); // Default orders count
    // Apply common entity defaults
    return EntityFactory.applyCreationDefaults(entity);
  }

  /**
   * Update existing BoosterEntity with UpdateBoosterRequest data.
   *
   * @param entity Existing entity
   * @param request Update request
   * @return Updated entity
   */
  public BoosterEntity updateEntity(BoosterEntity entity, UpdateBoosterRequest request) {
    boosterMapper.updateBoosterFromDto(request, entity);
    // Update timestamp
    return EntityFactory.prepareForUpdate(entity);
  }

  /**
   * Convert BoosterEntity to Booster DTO.
   *
   * @param entity Entity to convert
   * @return Booster DTO
   */
  public Booster toDto(BoosterEntity entity) {
    return boosterMapper.toBoosterDto(entity);
  }

  /**
   * Convert list of BoosterEntity to list of Booster DTOs.
   *
   * @param entities Entities to convert
   * @return List of Booster DTOs
   */
  public List<Booster> toDtoList(List<BoosterEntity> entities) {
    return boosterMapper.toBoosterDtoList(entities);
  }

  /**
   * Create BoosterListResponse from Page object using generated DTO constructor.
   *
   * @param boosterPage Page of boosters
   * @return BoosterListResponse
   */
  public BoosterListResponse createListResponse(Page<BoosterEntity> boosterPage) {
    List<Booster> boosters = toDtoList(boosterPage.getContent());

    return new BoosterListResponse(
        boosters,
        boosterPage.getTotalElements(),
        boosterPage.getTotalPages(),
        boosterPage.getSize(),
        boosterPage.getNumber(),
        boosterPage.getNumberOfElements(),
        boosterPage.isFirst(),
        boosterPage.isLast(),
        boosterPage.isEmpty());
  }
}
