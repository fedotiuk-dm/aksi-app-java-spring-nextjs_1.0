package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.game.BoostersApi;
import com.aksi.api.game.dto.Booster;
import com.aksi.api.game.dto.BoosterListResponse;
import com.aksi.api.game.dto.CreateBoosterRequest;
import com.aksi.api.game.dto.UpdateBoosterRequest;
import com.aksi.service.game.BoosterService;

import lombok.RequiredArgsConstructor;

/** REST controller for booster operations */
@RestController
@RequiredArgsConstructor
public class BoostersController implements BoostersApi {

  private final BoosterService boosterService;

  @Override
  public ResponseEntity<Booster> createBooster(CreateBoosterRequest createBoosterRequest) {
    Booster result = boosterService.createBooster(createBoosterRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(result);
  }

  @Override
  public ResponseEntity<Void> deleteBooster(UUID boosterId) {
    boosterService.deleteBooster(boosterId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Booster> getBoosterById(UUID boosterId) {
    Booster result = boosterService.getBoosterById(boosterId);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<BoosterListResponse> listBoosters(
      Integer page, Integer size, @Nullable String search, @Nullable Boolean active) {

    BoosterListResponse result = boosterService.listBoosters(page, size, null, null, active);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<Booster> updateBooster(
      UUID boosterId, UpdateBoosterRequest updateBoosterRequest) {

    Booster result = boosterService.updateBooster(boosterId, updateBoosterRequest);
    return ResponseEntity.ok(result);
  }
}
