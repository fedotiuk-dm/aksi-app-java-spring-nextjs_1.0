package com.aksi.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.game.DifficultyLevelsApi;
import com.aksi.api.game.dto.CreateDifficultyLevelRequest;
import com.aksi.api.game.dto.DifficultyLevel;
import com.aksi.api.game.dto.DifficultyLevelListResponse;
import com.aksi.api.game.dto.UpdateDifficultyLevelRequest;
import com.aksi.service.game.DifficultyLevelService;

import lombok.RequiredArgsConstructor;

/** REST controller for difficulty level operations */
@RestController
@RequiredArgsConstructor
public class DifficultyLevelsController implements DifficultyLevelsApi {

  private final DifficultyLevelService difficultyLevelService;

  @Override
  public ResponseEntity<DifficultyLevel> gamesCreateDifficultyLevel(
      CreateDifficultyLevelRequest createDifficultyLevelRequest) {

    DifficultyLevel result =
        difficultyLevelService.createDifficultyLevel(createDifficultyLevelRequest);
    return ResponseEntity.status(HttpStatus.CREATED).body(result);
  }

  @Override
  public ResponseEntity<Void> gamesDeleteDifficultyLevel(UUID difficultyLevelId) {
    difficultyLevelService.deleteDifficultyLevel(difficultyLevelId);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<DifficultyLevel> gamesGetDifficultyLevelById(UUID difficultyLevelId) {
    DifficultyLevel result = difficultyLevelService.getDifficultyLevelById(difficultyLevelId);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<DifficultyLevelListResponse> gamesListDifficultyLevels(
      Integer page, Integer size, @Nullable UUID gameId, @Nullable Boolean active) {

    DifficultyLevelListResponse result =
        difficultyLevelService.listDifficultyLevels(page, size, null, "asc", active, gameId, null);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<DifficultyLevel> gamesUpdateDifficultyLevel(
      UUID difficultyLevelId, UpdateDifficultyLevelRequest updateDifficultyLevelRequest) {

    DifficultyLevel result =
        difficultyLevelService.updateDifficultyLevel(
            difficultyLevelId, updateDifficultyLevelRequest);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<DifficultyLevel> gamesActivateDifficultyLevel(UUID difficultyLevelId) {
    DifficultyLevel result = difficultyLevelService.setActive(difficultyLevelId, true);
    return ResponseEntity.ok(result);
  }

  @Override
  public ResponseEntity<DifficultyLevel> gamesDeactivateDifficultyLevel(UUID difficultyLevelId) {
    DifficultyLevel result = difficultyLevelService.setActive(difficultyLevelId, false);
    return ResponseEntity.ok(result);
  }
}
