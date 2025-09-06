package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.game.ModifiersApi;
import com.aksi.api.game.dto.CreateGameModifierRequest;
import com.aksi.api.game.dto.GameModifierInfo;
import com.aksi.api.game.dto.GameModifierOperation;
import com.aksi.api.game.dto.GameModifierType;
import com.aksi.api.game.dto.GameModifiersResponse;
import com.aksi.api.game.dto.SortOrder;
import com.aksi.api.game.dto.UpdateGameModifierRequest;
import com.aksi.service.game.GameModifierService;

import lombok.RequiredArgsConstructor;

/** REST controller for game modifier operations */
@RestController
@RequiredArgsConstructor
public class GameModifierController implements ModifiersApi {

  private final GameModifierService gameModifierService;

  @Override
  public ResponseEntity<GameModifiersResponse> listGameModifiers(
      Integer page, Integer size, @Nullable String sortBy, SortOrder sortOrder, @Nullable String search,
      @Nullable String gameCode, @Nullable GameModifierType type, @Nullable GameModifierOperation operation,
      @Nullable Boolean active, @Nullable String serviceTypeCode) {
    GameModifiersResponse response = gameModifierService.getAllGameModifiers(
        gameCode, type, serviceTypeCode, active, search, page, size, sortBy, sortOrder, operation);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<GameModifierInfo> createGameModifier(CreateGameModifierRequest request) {
    GameModifierInfo response = gameModifierService.createGameModifier(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  public ResponseEntity<GameModifierInfo> getGameModifier(UUID modifierId) {
    GameModifierInfo response = gameModifierService.getGameModifierById(modifierId);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<GameModifierInfo> updateGameModifier(
      UUID modifierId, UpdateGameModifierRequest request) {
    GameModifierInfo response = gameModifierService.updateGameModifier(modifierId, request);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<Void> deleteGameModifier(UUID modifierId) {
    gameModifierService.deleteGameModifier(modifierId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<GameModifierInfo> activateGameModifier(UUID modifierId) {
    GameModifierInfo response = gameModifierService.activateGameModifier(modifierId);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<GameModifierInfo> deactivateGameModifier(UUID modifierId) {
    GameModifierInfo response = gameModifierService.deactivateGameModifier(modifierId);
    return ResponseEntity.ok(response);
  }
}
