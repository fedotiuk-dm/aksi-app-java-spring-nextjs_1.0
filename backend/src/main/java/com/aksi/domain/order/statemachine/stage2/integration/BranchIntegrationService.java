package com.aksi.domain.order.statemachine.stage2.integration;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.service.BranchLocationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс інтеграції з Branch Domain для етапу 2 Order Wizard
 *
 * Інкапсулює взаємодію з доменом філій/пунктів прийому для:
 * - Отримання поточного пункту прийому
 * - Перевірка активності пункту прийому
 * - Отримання списку активних пунктів прийому
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BranchIntegrationService {

    private final BranchLocationService branchLocationService;

    /**
     * Отримує поточний пункт прийому за ID
     */
    public BranchLocationDTO getCurrentBranchLocation(UUID branchLocationId) {
        log.debug("Отримання пункту прийому з ID: {}", branchLocationId);

        try {
            BranchLocationDTO branch = branchLocationService.getBranchLocationById(branchLocationId);
            log.debug("✅ Отримано пункт прийому: {}", branch.getName());
            return branch;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні пункту прийому з ID {}: {}", branchLocationId, e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати пункт прийому", e);
        }
    }

    /**
     * Отримує пункт прийому за кодом
     */
    public BranchLocationDTO getBranchLocationByCode(String code) {
        log.debug("Отримання пункту прийому за кодом: {}", code);

        try {
            BranchLocationDTO branch = branchLocationService.getBranchLocationByCode(code);
            log.debug("✅ Отримано пункт прийому: {}", branch.getName());
            return branch;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні пункту прийому з кодом {}: {}", code, e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати пункт прийому з кодом " + code, e);
        }
    }

    /**
     * Перевіряє чи пункт прийому активний
     */
    public boolean isBranchLocationActive(UUID branchLocationId) {
        log.debug("Перевірка активності пункту прийому: {}", branchLocationId);

        try {
            BranchLocationDTO branch = getCurrentBranchLocation(branchLocationId);
            boolean isActive = branch != null && Boolean.TRUE.equals(branch.getActive());

            log.debug("✅ Пункт прийому {} {}", branchLocationId, isActive ? "активний" : "неактивний");
            return isActive;

        } catch (Exception e) {
            log.debug("Пункт прийому {} не активний: {}", branchLocationId, e.getMessage());
            return false;
        }
    }

    /**
     * Отримує список активних пунктів прийому
     */
    public List<BranchLocationDTO> getActiveBranchLocations() {
        log.debug("Отримання списку активних пунктів прийому");

        try {
            List<BranchLocationDTO> branches = branchLocationService.getActiveBranchLocations();
            log.debug("✅ Отримано {} активних пунктів прийому", branches.size());
            return branches;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні активних пунктів прийому: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати активні пункти прийому", e);
        }
    }

    /**
     * Отримує всі пункти прийому
     */
    public List<BranchLocationDTO> getAllBranchLocations() {
        log.debug("Отримання списку всіх пунктів прийому");

        try {
            List<BranchLocationDTO> branches = branchLocationService.getAllBranchLocations();
            log.debug("✅ Отримано {} пунктів прийому", branches.size());
            return branches;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні всіх пунктів прийому: {}", e.getMessage(), e);
            throw new RuntimeException("Не вдалося отримати пункти прийому", e);
        }
    }

    /**
     * Перевіряє чи надає пункт прийому певну послугу
     */
    public boolean doesBranchLocationProvideService(UUID branchLocationId, String serviceCode) {
        log.debug("Перевірка надання послуги {} пунктом прийому: {}", serviceCode, branchLocationId);

        try {
            BranchLocationDTO branch = getCurrentBranchLocation(branchLocationId);
            // Поки що вважаємо, що всі активні пункти прийому надають всі послуги
            // В майбутньому можна додати спеціалізацію пунктів прийому
            boolean provides = branch != null && Boolean.TRUE.equals(branch.getActive());

            log.debug("✅ Пункт прийому {} {} послугу {}", branchLocationId,
                     provides ? "надає" : "не надає", serviceCode);
            return provides;

        } catch (Exception e) {
            log.debug("Пункт прийому {} не надає послугу {}: {}", branchLocationId, serviceCode, e.getMessage());
            return false;
        }
    }

    /**
     * Отримує інформацію про пункт прийому
     */
    public String getBranchLocationInfo(UUID branchLocationId) {
        log.debug("Отримання інформації про пункт прийому: {}", branchLocationId);

        try {
            BranchLocationDTO branch = getCurrentBranchLocation(branchLocationId);
            String branchInfo = String.format("%s - %s",
                branch.getName(), branch.getAddress());

            log.debug("✅ Інформація про пункт прийому: {}", branchInfo);
            return branchInfo;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні інформації про пункт прийому: {}", e.getMessage(), e);
            return "Невідомий пункт прийому";
        }
    }

    /**
     * Перевіряє доступність пункту прийому за кодом
     */
    public boolean isBranchLocationAvailable(String code) {
        log.debug("Перевірка доступності пункту прийому з кодом: {}", code);

        try {
            BranchLocationDTO branch = getBranchLocationByCode(code);
            return branch != null && Boolean.TRUE.equals(branch.getActive());

        } catch (Exception e) {
            log.debug("Пункт прийому з кодом {} недоступний: {}", code, e.getMessage());
            return false;
        }
    }

    /**
     * Отримує код пункту прийому
     */
    public String getBranchLocationCode(UUID branchLocationId) {
        log.debug("Отримання коду пункту прийому: {}", branchLocationId);

        try {
            BranchLocationDTO branch = getCurrentBranchLocation(branchLocationId);
            String code = branch.getCode();

            log.debug("✅ Код пункту прийому: {}", code);
            return code;

        } catch (Exception e) {
            log.error("❌ Помилка при отриманні коду пункту прийому: {}", e.getMessage(), e);
            return "UNKNOWN";
        }
    }
}
