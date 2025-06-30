package com.aksi.api.branch;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.branch.dto.BranchComparisonResponse;
import com.aksi.api.branch.dto.BranchStatisticsResponse;
import com.aksi.domain.branch.service.BranchService;

import lombok.RequiredArgsConstructor;

/**
 * HTTP контролер для статистики філій Відповідальність: тільки HTTP логіка
 *
 * <p>НЕ РЕАЛІЗОВАНО: Branch Statistics поки що не потрібна
 */
@RestController
@RequiredArgsConstructor
public class BranchStatisticsApiController implements BranchStatisticsApi {

  private final BranchService branchService;

  @Override
  public ResponseEntity<BranchStatisticsResponse> getBranchStatistics(
      UUID branchId, LocalDate startDate, LocalDate endDate) {
    BranchStatisticsResponse response =
        branchService.getBranchStatistics(branchId, startDate, endDate);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<List<BranchComparisonResponse>> compareBranchStatistics(
      LocalDate startDate, LocalDate endDate, String city, String sortBy, String order) {
    List<BranchComparisonResponse> response =
        branchService.compareBranchStatistics(startDate, endDate, city, sortBy, order);
    return ResponseEntity.ok(response);
  }
}
