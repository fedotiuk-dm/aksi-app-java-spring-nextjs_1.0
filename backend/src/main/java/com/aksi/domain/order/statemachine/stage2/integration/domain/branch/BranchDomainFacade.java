package com.aksi.domain.order.statemachine.stage2.integration.domain.branch;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.service.BranchLocationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Фасад для інтеграції з Branch Domain.
 * Надає методи для роботи з філіями в рамках Stage 2.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BranchDomainFacade {

    private final BranchLocationService branchLocationService;

    /**
     * Отримує філію за ID
     */
    public BranchLocationDTO getBranchById(UUID branchId) {
        log.debug("Getting branch by id: {}", branchId);
        return branchLocationService.getBranchLocationById(branchId);
    }

    /**
     * Отримує всі активні філії
     */
    public List<BranchLocationDTO> getAllActiveBranches() {
        log.debug("Getting all active branches");
        return branchLocationService.getActiveBranchLocations();
    }

    /**
     * Отримує всі філії
     */
    public List<BranchLocationDTO> getAllBranches() {
        log.debug("Getting all branches");
        return branchLocationService.getAllBranchLocations();
    }

    /**
     * Перевіряє чи існує філія
     */
    public boolean branchExists(UUID branchId) {
        log.debug("Checking if branch exists: {}", branchId);
        try {
            BranchLocationDTO branch = getBranchById(branchId);
            return branch != null;
        } catch (Exception e) {
            log.warn("Branch not found: {}", branchId);
            return false;
        }
    }

    /**
     * Перевіряє чи філія активна
     */
    public boolean isBranchActive(UUID branchId) {
        log.debug("Checking if branch is active: {}", branchId);
        try {
            BranchLocationDTO branch = getBranchById(branchId);
            return branch != null && Boolean.TRUE.equals(branch.getActive());
        } catch (Exception e) {
            log.warn("Branch not found or inactive: {}", branchId);
            return false;
        }
    }

    /**
     * Отримує назву філії
     */
    public String getBranchName(UUID branchId) {
        log.debug("Getting branch name for id: {}", branchId);
        try {
            BranchLocationDTO branch = getBranchById(branchId);
            return branch != null ? branch.getName() : "Невідома філія";
        } catch (Exception e) {
            log.warn("Could not get branch name: {}", branchId);
            return "Невідома філія";
        }
    }

    /**
     * Отримує адресу філії
     */
    public String getBranchAddress(UUID branchId) {
        log.debug("Getting branch address for id: {}", branchId);
        try {
            BranchLocationDTO branch = getBranchById(branchId);
            return branch != null ? branch.getAddress() : "Невідома адреса";
        } catch (Exception e) {
            log.warn("Could not get branch address: {}", branchId);
            return "Невідома адреса";
        }
    }

    /**
     * Валідує ID філії для створення замовлення
     */
    public boolean validateBranchForOrder(UUID branchId) {
        log.debug("Validating branch for order: {}", branchId);

        if (branchId == null) {
            log.warn("Branch ID is null");
            return false;
        }

        if (!branchExists(branchId)) {
            log.warn("Branch does not exist: {}", branchId);
            return false;
        }

        if (!isBranchActive(branchId)) {
            log.warn("Branch is not active: {}", branchId);
            return false;
        }

        return true;
    }
}
