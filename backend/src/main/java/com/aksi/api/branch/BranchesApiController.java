package com.aksi.api.branch;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.branch.dto.BranchResponse;
import com.aksi.api.branch.dto.BranchWithDistanceResponse;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.domain.branch.service.BranchLocationService;
import com.aksi.domain.branch.service.BranchService;

import lombok.RequiredArgsConstructor;

/**
 * HTTP контролер для управління філіями
 * Відповідальність: тільки HTTP логіка
 */
@RestController
@RequiredArgsConstructor
public class BranchesApiController implements BranchesApi {

    private final BranchService branchService;
    private final BranchLocationService branchLocationService;

    @Override
    public ResponseEntity<List<BranchResponse>> getBranches(Boolean active, String city, Boolean includeInactive) {
        List<BranchResponse> response = branchService.getBranches(active, city, includeInactive);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<BranchResponse> createBranch(CreateBranchRequest createBranchRequest) {
        BranchResponse response = branchService.createBranch(createBranchRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<BranchResponse> getBranchById(UUID branchId) {
        BranchResponse response = branchService.getBranchById(branchId);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<BranchResponse> updateBranch(UUID branchId, UpdateBranchRequest updateBranchRequest) {
        BranchResponse response = branchService.updateBranch(branchId, updateBranchRequest);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> deleteBranch(UUID branchId) {
        branchService.deleteBranch(branchId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<BranchResponse> getBranchByCode(String code) {
        BranchResponse response = branchService.getBranchByCode(code);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<List<BranchWithDistanceResponse>> getNearbyBranches(
            Double latitude, Double longitude, Double radius, Integer limit) {
        List<BranchWithDistanceResponse> response = branchLocationService.getNearbyBranches(
            java.math.BigDecimal.valueOf(latitude),
            java.math.BigDecimal.valueOf(longitude),
            java.math.BigDecimal.valueOf(radius),
            limit);
        return ResponseEntity.ok(response);
    }
}
