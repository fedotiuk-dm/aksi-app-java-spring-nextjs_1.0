package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.game.PriceConfigurationsApi;
import com.aksi.api.game.dto.CreatePriceConfigurationRequest;
import com.aksi.api.game.dto.PriceConfiguration;
import com.aksi.api.game.dto.PriceConfigurationListResponse;
import com.aksi.api.game.dto.UpdatePriceConfigurationRequest;
import com.aksi.service.game.PriceConfigurationService;

import lombok.RequiredArgsConstructor;

/** REST controller for price configuration operations */
@RestController
@RequiredArgsConstructor
public class PriceConfigurationsController implements PriceConfigurationsApi {

  private final PriceConfigurationService priceConfigurationService;

  @Override
  public ResponseEntity<PriceConfiguration> gamesCreatePriceConfiguration(
      CreatePriceConfigurationRequest createPriceConfigurationRequest) {

    PriceConfiguration result =
        priceConfigurationService.createPriceConfiguration(createPriceConfigurationRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(result);
  }

  @Override
  public ResponseEntity<Void> gamesDeletePriceConfiguration(UUID priceConfigurationId) {
    priceConfigurationService.deletePriceConfiguration(priceConfigurationId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<PriceConfiguration> gamesGetPriceConfigurationById(UUID priceConfigurationId) {
    PriceConfiguration result =
        priceConfigurationService.getPriceConfigurationById(priceConfigurationId);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<PriceConfigurationListResponse> gamesListPriceConfigurations(
      Integer page,
      Integer size,
      @Nullable UUID gameId,
      @Nullable UUID serviceTypeId,
      @Nullable UUID difficultyLevelId,
      @Nullable Boolean active) {
    PriceConfigurationListResponse result =
        priceConfigurationService.getPriceConfigurations(
            page, size, null, "asc", gameId, difficultyLevelId, serviceTypeId, active, null, null);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<PriceConfiguration> gamesUpdatePriceConfiguration(
      UUID priceConfigurationId, UpdatePriceConfigurationRequest updatePriceConfigurationRequest) {

    PriceConfiguration result =
        priceConfigurationService.updatePriceConfiguration(
            priceConfigurationId, updatePriceConfigurationRequest);
    return ResponseEntity.ok(result);
  }
}
