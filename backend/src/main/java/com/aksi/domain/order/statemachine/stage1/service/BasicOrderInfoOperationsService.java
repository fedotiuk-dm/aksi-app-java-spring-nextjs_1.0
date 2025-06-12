package com.aksi.domain.order.statemachine.stage1.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.service.BranchLocationService;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.domain.order.service.ReceiptNumberGenerator;

/**
 * Сервіс операцій для базової інформації замовлення в етапі 1.3.
 * Тонка обгортка над доменними сервісами без власної бізнес-логіки.
 */
@Service
public class BasicOrderInfoOperationsService {

    private static final Logger logger = LoggerFactory.getLogger(BasicOrderInfoOperationsService.class);

    private final BranchLocationService branchLocationService;
    private final ReceiptNumberGenerator receiptNumberGenerator;
    private final OrderRepository orderRepository;

    public BasicOrderInfoOperationsService(BranchLocationService branchLocationService,
                                         ReceiptNumberGenerator receiptNumberGenerator,
                                         OrderRepository orderRepository) {
        this.branchLocationService = branchLocationService;
        this.receiptNumberGenerator = receiptNumberGenerator;
        this.orderRepository = orderRepository;

        logger.info("✅ BasicOrderInfoOperationsService initialized with services: BranchLocationService={}, ReceiptNumberGenerator={}, OrderRepository={}",
            branchLocationService != null ? "OK" : "NULL",
            receiptNumberGenerator != null ? "OK" : "NULL",
            orderRepository != null ? "OK" : "NULL");
    }

    /**
     * Генерує унікальний номер квитанції через ReceiptNumberGenerator.
     * Формат: AKSI-[BRANCH_CODE]-YYYYMMDD-HHMMSS-ХХХ
     */
    public String generateReceiptNumber() {
        return receiptNumberGenerator.generate(null); // Без коду філії - буде використано DEFAULT
    }

    /**
     * Генерує унікальний номер квитанції з кодом філії.
     * Формат: AKSI-[BRANCH_CODE]-YYYYMMDD-HHMMSS-ХХХ
     */
    public String generateReceiptNumber(String branchCode) {
        return receiptNumberGenerator.generate(branchCode);
    }

    /**
     * Генерує унікальний номер квитанції для філії за ID.
     * Витягує код філії та генерує номер у форматі: AKSI-[BRANCH_CODE]-YYYYMMDD-HHMMSS-ХХХ
     */
    public String generateReceiptNumberForBranch(UUID branchId) {
        if (branchId == null) {
            return receiptNumberGenerator.generate(null);
        }

        BranchLocationDTO branch = branchLocationService.getBranchLocationById(branchId);
        String branchCode = branch != null ? branch.getCode() : null;
        return receiptNumberGenerator.generate(branchCode);
    }

    /**
     * Генерує гарантовано унікальний номер квитанції.
     * Формат: AKSI-[BRANCH_CODE]-YYYYMMDD-HHMMSS-ХХХ
     */
    public String generateUniqueReceiptNumber(String branchCode) {
        return receiptNumberGenerator.generateUnique(branchCode);
    }

    /**
     * Генерує гарантовано унікальний номер квитанції для філії за ID.
     */
    public String generateUniqueReceiptNumberForBranch(UUID branchId) {
        if (branchId == null) {
            return receiptNumberGenerator.generateUnique(null);
        }

        BranchLocationDTO branch = branchLocationService.getBranchLocationById(branchId);
        String branchCode = branch != null ? branch.getCode() : null;
        return receiptNumberGenerator.generateUnique(branchCode);
    }

    /**
     * Генерує унікальну мітку.
     */
    public String generateUniqueTag() {
        // Генеруємо базову мітку
        String baseTag;
        int attempts = 0;
        do {
            String uuid = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
            baseTag = "TAG-" + uuid;
            attempts++;
        } while (!isUniqueTagUnique(baseTag) && attempts < 10);

        return baseTag;
    }

    /**
     * Перевіряє унікальність номера квитанції через ReceiptNumberGenerator.
     */
    public boolean isReceiptNumberUnique(String receiptNumber) {
        return receiptNumberGenerator.isUniqueReceiptNumber(receiptNumber);
    }

    /**
     * Перевіряє унікальність мітки через OrderRepository.
     */
    public boolean isUniqueTagUnique(String uniqueTag) {
        if (uniqueTag == null || uniqueTag.trim().isEmpty()) {
            return false;
        }
        return !orderRepository.existsByTagNumber(uniqueTag.trim());
    }

    /**
     * Отримує всі доступні філії.
     */
    public List<BranchLocationDTO> getAllBranches() {
        logger.info("🔍 [OPERATIONS] Запит на отримання всіх філій через branchLocationService");

        try {
            if (branchLocationService == null) {
                logger.error("❌ [OPERATIONS] BranchLocationService is NULL!");
                throw new IllegalStateException("BranchLocationService is not initialized");
            }

            List<BranchLocationDTO> branches = branchLocationService.getAllBranchLocations();
            logger.info("✅ [OPERATIONS] Отримано {} філій від branchLocationService",
                branches != null ? branches.size() : 0);

            if (branches != null && !branches.isEmpty()) {
                logger.info("📋 [OPERATIONS] Перші 2 філії:");
                for (int i = 0; i < Math.min(2, branches.size()); i++) {
                    BranchLocationDTO branch = branches.get(i);
                    logger.info("  - {} (ID: {}, Active: {})",
                        branch.getName(), branch.getId(), branch.getActive());
                }
            } else {
                logger.warn("⚠️ [OPERATIONS] Список філій порожній або null!");
            }

            return branches;
        } catch (RuntimeException e) {
            logger.error("❌ [OPERATIONS] Помилка при отриманні філій: {}", e.getMessage());
            logger.error("❌ [OPERATIONS] Exception type: {}", e.getClass().getSimpleName());
            logger.error("❌ [OPERATIONS] BranchLocationService: {}",
                branchLocationService != null ? "NOT NULL" : "NULL");
            logger.error("❌ [OPERATIONS] Full stack trace:", e);

            throw new RuntimeException("Failed to get branches from BranchLocationService: " + e.getMessage(), e);
        }
    }

    /**
     * Отримує філію за ID.
     */
    public BranchLocationDTO getBranchById(UUID branchId) {
        if (branchId == null) return null;
        return branchLocationService.getBranchLocationById(branchId);
    }

    /**
     * Перевіряє чи філія активна та доступна для прийому замовлень.
     */
    public boolean isBranchAvailable(UUID branchId) {
        if (branchId == null) return false;

        BranchLocationDTO branch = branchLocationService.getBranchLocationById(branchId);
        return branch != null && Boolean.TRUE.equals(branch.getActive());
    }

    /**
     * Отримує поточну дату та час.
     */
    public LocalDateTime getCurrentDateTime() {
        return LocalDateTime.now();
    }

    /**
     * Перевіряє чи дата валідна для створення замовлення.
     */
    public boolean isValidCreationDate(LocalDateTime creationDate) {
        if (creationDate == null) return false;

        LocalDateTime now = LocalDateTime.now();
        // Дата не може бути в майбутньому та не старша за 24 години
        return !creationDate.isAfter(now) &&
               !creationDate.isBefore(now.minusHours(24));
    }

        /**
     * Витягує код філії з номера квитанції.
     */
    public String extractBranchCodeFromReceiptNumber(String receiptNumber) {
        return receiptNumberGenerator.extractBranchCode(receiptNumber);
    }

    /**
     * Валідує формат номера квитанції через ReceiptNumberGenerator.
     * Перевіряє формат: AKSI-[BRANCH_CODE]-YYYYMMDD-HHMMSS-ХХХ
     */
    public boolean isValidReceiptNumberFormat(String receiptNumber) {
        return receiptNumberGenerator.isValidFormat(receiptNumber);
    }

    /**
     * Валідує формат унікальної мітки.
     */
    public boolean isValidUniqueTagFormat(String uniqueTag) {
        if (uniqueTag == null || uniqueTag.trim().isEmpty()) {
            return false;
        }

        String trimmedTag = uniqueTag.trim();
        return trimmedTag.length() >= 3 &&
               trimmedTag.length() <= 20 &&
               trimmedTag.matches("^[A-Za-z0-9-_]+$");
    }

    /**
     * Генерує та форматує поточний timestamp для логування.
     */
    public String getCurrentTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    /**
     * Перевіряє чи поточний час знаходиться в робочих годинах.
     */
    public boolean isWithinBusinessHours() {
        LocalDateTime now = LocalDateTime.now();
        int hour = now.getHour();

        // Припускаємо робочі години 8:00 - 20:00
        return hour >= 8 && hour < 20;
    }

    /**
     * Отримує інформацію про систему для налагодження.
     */
    public String getSystemInfo() {
        return String.format("BasicOrderInfoOperations - Timestamp: %s, BusinessHours: %s",
            getCurrentTimestamp(), isWithinBusinessHours());
    }
}
