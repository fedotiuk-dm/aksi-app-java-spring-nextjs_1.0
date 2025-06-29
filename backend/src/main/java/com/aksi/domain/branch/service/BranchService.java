package com.aksi.domain.branch.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.BranchComparisonResponse;
import com.aksi.api.branch.dto.BranchResponse;
import com.aksi.api.branch.dto.BranchStatisticsResponse;
import com.aksi.api.branch.dto.BranchSummaryResponse;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.domain.branch.enums.BranchStatus;
import com.aksi.domain.branch.exception.BranchNotFoundException;
import com.aksi.domain.branch.mapper.BranchMapper;
import com.aksi.domain.branch.repository.BranchRepository;
import com.aksi.domain.branch.validation.BranchValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для управління філіями
 * Відповідальність: CRUD операції з BranchEntity
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;
    private final BranchValidator branchValidator;
    private final BranchMapper branchMapper;

    // API методи (для контролерів) - працюють з DTO

    /**
     * Створити нову філію
     */
    public BranchResponse createBranch(CreateBranchRequest request) {
        log.debug("Creating branch from request: {}", request.getName());

        BranchEntity entity = branchMapper.toEntity(request);
        entity.setStatus(BranchStatus.ACTIVE); // default status

        branchValidator.validateForCreate(entity);

        BranchEntity savedEntity = create(entity);
        return branchMapper.toBranchResponse(savedEntity);
    }

    /**
     * Отримати філію за UUID
     */
    @Transactional(readOnly = true)
    public BranchResponse getBranchById(UUID uuid) {
        log.debug("Getting branch by UUID: {}", uuid);

        BranchEntity entity = findEntityById(uuid);
        return branchMapper.toBranchResponse(entity);
    }

    /**
     * Оновити філію
     */
    public BranchResponse updateBranch(UUID uuid, UpdateBranchRequest request) {
        log.debug("Updating branch {} with request: {}", uuid, request.getName());

        BranchEntity existingEntity = findEntityById(uuid);

        // Оновлюємо поля з request
        BranchEntity updatedEntity = branchMapper.toEntityForUpdate(request);
        updatedEntity.setId(existingEntity.getId());
        updatedEntity.setUuid(existingEntity.getUuid());
        updatedEntity.setReceiptCounter(existingEntity.getReceiptCounter());
        updatedEntity.setStatus(existingEntity.getStatus()); // зберігаємо поточний статус

        branchValidator.validateForUpdate(updatedEntity);

        BranchEntity savedEntity = update(updatedEntity);
        return branchMapper.toBranchResponse(savedEntity);
    }

    /**
     * Видалити філію
     */
    public void deleteBranch(UUID uuid) {
        log.debug("Deleting branch: {}", uuid);

        BranchEntity entity = findEntityById(uuid);
        branchValidator.validateForDeletion(entity);

        branchRepository.deleteById(uuid);
    }

    /**
     * Отримати всі філії (список)
     */
    @Transactional(readOnly = true)
    public List<BranchResponse> getAllBranches() {
        log.debug("Getting all branches");

        List<BranchEntity> entities = findAll();
        return branchMapper.toBranchResponseList(entities);
    }

    /**
     * Отримати короткий список філій
     */
    @Transactional(readOnly = true)
    public List<BranchSummaryResponse> getBranchesSummary() {
        log.debug("Getting branches summary");

        List<BranchEntity> entities = findAll();
        return branchMapper.toBranchSummaryResponseList(entities);
    }

    /**
     * Перевірити чи існує філія за кодом
     */
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return branchRepository.existsByCode(code);
    }

    /**
     * Активувати філію
     */
    public BranchResponse activateBranch(UUID uuid) {
        log.debug("Activating branch: {}", uuid);

        BranchEntity entity = findEntityById(uuid);
        entity.setStatus(BranchStatus.ACTIVE);

        BranchEntity savedEntity = update(entity);
        return branchMapper.toBranchResponse(savedEntity);
    }

    /**
     * Деактивувати філію
     */
    public BranchResponse deactivateBranch(UUID uuid) {
        log.debug("Deactivating branch: {}", uuid);

        BranchEntity entity = findEntityById(uuid);
        entity.setStatus(BranchStatus.INACTIVE);

        BranchEntity savedEntity = update(entity);
        return branchMapper.toBranchResponse(savedEntity);
    }

    /**
     * Отримати філії з фільтрами
     */
    @Transactional(readOnly = true)
    public List<BranchResponse> getBranches(Boolean active, String city, Boolean includeInactive) {
        log.debug("Getting branches with filters: active={}, city={}, includeInactive={}", active, city, includeInactive);

        List<BranchEntity> entities = branchRepository.findAll();

        // Фільтрація
        List<BranchEntity> filtered = entities.stream()
            .filter(branch -> includeInactive == null || includeInactive || branch.getStatus() == BranchStatus.ACTIVE)
            .filter(branch -> active == null || (active && branch.getStatus() == BranchStatus.ACTIVE) || (!active && branch.getStatus() != BranchStatus.ACTIVE))
            .filter(branch -> city == null || city.equalsIgnoreCase(branch.getCity()))
            .toList();

        return branchMapper.toBranchResponseList(filtered);
    }

    /**
     * Отримати філію за кодом
     */
    @Transactional(readOnly = true)
    public BranchResponse getBranchByCode(String code) {
        log.debug("Getting branch by code: {}", code);

        BranchEntity entity = branchRepository.findByCode(code)
            .orElseThrow(() -> BranchNotFoundException.withCode(code));
        return branchMapper.toBranchResponse(entity);
    }

    /**
     * Отримати статистику філії
     */
    @Transactional(readOnly = true)
    public BranchStatisticsResponse getBranchStatistics(UUID branchId, LocalDate startDate, LocalDate endDate) {
        log.debug("Getting branch statistics for: {} from {} to {}", branchId, startDate, endDate);

        // Перевіряємо що філія існує
        BranchEntity branch = findEntityById(branchId);

        // Для простоти повертаємо базову статистику
        // TODO: Реалізувати повну статистику на основі замовлень
        return branchMapper.toBranchStatisticsResponse(branch, startDate, endDate);
    }

    /**
     * Порівняти статистику філій
     */
    @Transactional(readOnly = true)
    public List<BranchComparisonResponse> compareBranchStatistics(
            LocalDate startDate, LocalDate endDate, String city, String sortBy, String order) {
        log.debug("Comparing branch statistics from {} to {} for city: {}", startDate, endDate, city);

        // Отримуємо філії з фільтром за містом якщо потрібно
        List<BranchEntity> branches = findAll().stream()
            .filter(branch -> city == null || city.equalsIgnoreCase(branch.getCity()))
            .filter(branch -> branch.getStatus() == BranchStatus.ACTIVE)
            .toList();

        // Для простоти повертаємо базове порівняння
        // TODO: Реалізувати повне порівняння на основі замовлень та доходів
        return branchMapper.toBranchComparisonResponseList(branches, startDate, endDate, sortBy, order);
    }

    // Entity методи (для внутрішньої логіки)

    /**
     * Створити entity
     */
    public BranchEntity create(BranchEntity entity) {
        branchValidator.validateUniqueness(entity);
        return branchRepository.save(entity);
    }

    /**
     * Знайти entity за UUID
     */
    @Transactional(readOnly = true)
    public BranchEntity findEntityById(UUID uuid) {
        return branchRepository.findById(uuid)
            .orElseThrow(() -> BranchNotFoundException.withUuid(uuid));
    }

    /**
     * Знайти entity за кодом
     */
    @Transactional(readOnly = true)
    public Optional<BranchEntity> findByCode(String code) {
        return branchRepository.findByCode(code);
    }

    /**
     * Знайти всі entities
     */
    @Transactional(readOnly = true)
    public List<BranchEntity> findAll() {
        return branchRepository.findAll();
    }

    /**
     * Оновити entity
     */
    public BranchEntity update(BranchEntity entity) {
        return branchRepository.save(entity);
    }

    /**
     * Перевірити чи може філія приймати замовлення
     */
    @Transactional(readOnly = true)
    public boolean canAcceptOrders(UUID uuid) {
        BranchEntity entity = findEntityById(uuid);
        return entity.canAcceptOrders();
    }
}
