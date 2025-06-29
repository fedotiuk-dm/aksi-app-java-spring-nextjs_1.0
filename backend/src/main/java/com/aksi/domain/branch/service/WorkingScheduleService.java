package com.aksi.domain.branch.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.BranchOpenStatusResponse;
import com.aksi.api.branch.dto.NextWorkingDayResponse;
import com.aksi.api.branch.dto.UpdateWorkingScheduleRequest;
import com.aksi.api.branch.dto.WorkingDayRequest;
import com.aksi.api.branch.dto.WorkingDayResponse;
import com.aksi.api.branch.dto.WorkingScheduleRequest;
import com.aksi.api.branch.dto.WorkingScheduleResponse;
import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.domain.branch.entity.WorkingDayEntity;
import com.aksi.domain.branch.entity.WorkingScheduleEntity;
import com.aksi.domain.branch.exception.WorkingScheduleException;
import com.aksi.domain.branch.mapper.WorkingDayMapper;
import com.aksi.domain.branch.mapper.WorkingScheduleMapper;
import com.aksi.domain.branch.repository.WorkingDayRepository;
import com.aksi.domain.branch.repository.WorkingScheduleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для управління розкладом роботи філій
 * Відповідальність: WorkingScheduleEntity + WorkingDayEntity
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class WorkingScheduleService {

    private final WorkingScheduleRepository workingScheduleRepository;
    private final WorkingDayRepository workingDayRepository;
    private final WorkingScheduleMapper workingScheduleMapper;
    private final WorkingDayMapper workingDayMapper;
    private final BranchService branchService;

    // API методи (для контролерів) - працюють з DTO

    /**
     * Створити розклад роботи для філії
     */
    public WorkingScheduleResponse createWorkingSchedule(UUID branchId, WorkingScheduleRequest request) {
        log.debug("Creating working schedule for branch: {}", branchId);

        // Перевіримо що філія існує
        BranchEntity branch = branchService.findEntityById(branchId);

        WorkingScheduleEntity entity = workingScheduleMapper.toEntity(request);
        entity.setBranch(branch);

        WorkingScheduleEntity savedEntity = create(entity);
        return workingScheduleMapper.toResponse(savedEntity);
    }

    /**
     * Отримати розклад роботи філії
     */
    @Transactional(readOnly = true)
    public Optional<WorkingScheduleResponse> getWorkingScheduleByBranchId(UUID branchId) {
        log.debug("Getting working schedule for branch: {}", branchId);

        return findByBranchId(branchId)
            .map(workingScheduleMapper::toResponse);
    }

    /**
     * Оновити розклад роботи
     */
    public WorkingScheduleResponse updateWorkingSchedule(UUID scheduleId, UpdateWorkingScheduleRequest request) {
        log.debug("Updating working schedule: {}", scheduleId);

        WorkingScheduleEntity existingEntity = findEntityById(scheduleId);

        WorkingScheduleEntity updatedEntity = workingScheduleMapper.toEntityForUpdate(request);
        updatedEntity.setId(existingEntity.getId());
        updatedEntity.setBranch(existingEntity.getBranch());

        WorkingScheduleEntity savedEntity = update(updatedEntity);
        return workingScheduleMapper.toResponse(savedEntity);
    }

    /**
     * Видалити розклад роботи
     */
    public void deleteWorkingSchedule(UUID scheduleId) {
        log.debug("Deleting working schedule: {}", scheduleId);

        WorkingScheduleEntity entity = findEntityById(scheduleId); // перевіримо що існує
        workingScheduleRepository.deleteById(entity.getId());
    }

    /**
     * Додати робочий день до розкладу
     */
    public WorkingDayResponse addWorkingDay(UUID scheduleId, WorkingDayRequest request) {
        log.debug("Adding working day to schedule: {}", scheduleId);

        WorkingScheduleEntity schedule = findEntityById(scheduleId);

        WorkingDayEntity entity = workingDayMapper.toEntity(request);
        entity.setWorkingSchedule(schedule);

        WorkingDayEntity savedEntity = workingDayRepository.save(entity);
        return workingDayMapper.toResponse(savedEntity);
    }

    /**
     * Оновити робочий день
     */
    public WorkingDayResponse updateWorkingDay(UUID workingDayId, WorkingDayRequest request) {
        log.debug("Updating working day: {}", workingDayId);

        WorkingDayEntity existingEntity = findWorkingDayById(workingDayId);

        WorkingDayEntity updatedEntity = workingDayMapper.toEntity(request);
        updatedEntity.setId(existingEntity.getId());
        updatedEntity.setWorkingSchedule(existingEntity.getWorkingSchedule());

        WorkingDayEntity savedEntity = workingDayRepository.save(updatedEntity);
        return workingDayMapper.toResponse(savedEntity);
    }

    /**
     * Видалити робочий день
     */
    public void deleteWorkingDay(UUID workingDayId) {
        log.debug("Deleting working day: {}", workingDayId);

        WorkingDayEntity entity = findWorkingDayById(workingDayId);
        workingDayRepository.deleteById(entity.getId());
    }

    /**
     * Отримати робочі дні для розкладу
     */
    @Transactional(readOnly = true)
    public List<WorkingDayResponse> getWorkingDaysForSchedule(UUID scheduleId) {
        log.debug("Getting working days for schedule: {}", scheduleId);

        WorkingScheduleEntity schedule = findEntityById(scheduleId);
        List<WorkingDayEntity> entities = workingDayRepository.findByWorkingSchedule_Id(schedule.getId());
        return workingDayMapper.toResponseList(entities);
    }

    /**
     * Перевірити чи відкрита філія в конкретний час
     */
    @Transactional(readOnly = true)
    public boolean isBranchOpenAt(UUID branchId, LocalDateTime dateTime) {
        log.debug("Checking if branch {} is open at: {}", branchId, dateTime);

        return findByBranchId(branchId)
            .map(schedule -> schedule.isOpenAt(dateTime.toLocalDate(), dateTime.toLocalTime()))
            .orElse(false);
    }

    /**
     * Отримати розклад роботи філії (для API контролера)
     */
    @Transactional(readOnly = true)
    public WorkingScheduleResponse getBranchSchedule(UUID branchId) {
        log.debug("Getting branch schedule for: {}", branchId);

        return findByBranchId(branchId)
            .map(workingScheduleMapper::toResponse)
            .orElseThrow(() -> new RuntimeException("Working schedule not found for branch: " + branchId));
    }

    /**
     * Оновити розклад роботи філії (для API контролера)
     */
    public WorkingScheduleResponse updateBranchSchedule(UUID branchId, UpdateWorkingScheduleRequest request) {
        log.debug("Updating branch schedule for: {}", branchId);

        WorkingScheduleEntity schedule = findByBranchId(branchId)
            .orElseThrow(() -> new RuntimeException("Working schedule not found for branch: " + branchId));

        // Оновлюємо існуючий розклад
        WorkingScheduleEntity updatedEntity = workingScheduleMapper.toEntityForUpdate(request);
        updatedEntity.setId(schedule.getId());
        updatedEntity.setBranch(schedule.getBranch());

        WorkingScheduleEntity savedEntity = update(updatedEntity);
        return workingScheduleMapper.toResponse(savedEntity);
    }

    /**
     * Отримати статус відкриття філії (для API контролера)
     */
    @Transactional(readOnly = true)
    public BranchOpenStatusResponse getBranchOpenStatus(UUID branchId, OffsetDateTime dateTime) {
        log.debug("Getting branch open status for: {} at: {}", branchId, dateTime);

        // Якщо dateTime не вказана, використовуємо поточний час
        LocalDateTime checkDateTime = dateTime != null ? dateTime.toLocalDateTime() : LocalDateTime.now();

        boolean isOpen = isBranchOpenAt(branchId, checkDateTime);

        // Для простоти створюємо базову відповідь
        // TODO: В майбутньому додати більше деталей з розкладу
        return workingScheduleMapper.toBranchOpenStatusResponse(branchId, isOpen, checkDateTime);
    }

    /**
     * Отримати наступний робочий день філії (для API контролера)
     */
    @Transactional(readOnly = true)
    public NextWorkingDayResponse getBranchNextWorkingDay(UUID branchId, LocalDate fromDate) {
        log.debug("Getting next working day for: {} from: {}", branchId, fromDate);

        // Якщо fromDate не вказана, використовуємо поточну дату
        LocalDate searchDate = fromDate != null ? fromDate : LocalDate.now();

        // Для простоти повертаємо наступний день (якщо це робочий день)
        // TODO: Реалізувати повну логіку пошуку наступного робочого дня
        LocalDate nextWorkingDate = searchDate.plusDays(1);

        return workingScheduleMapper.toNextWorkingDayResponse(branchId, nextWorkingDate);
    }

    // Entity методи (для внутрішньої логіки)

    /**
     * Створити entity
     */
    public WorkingScheduleEntity create(WorkingScheduleEntity entity) {
        return workingScheduleRepository.save(entity);
    }

    /**
     * Знайти entity за UUID
     */
    @Transactional(readOnly = true)
    private WorkingScheduleEntity findEntityById(UUID uuid) {
        return workingScheduleRepository.findByUuid(uuid)
            .orElseThrow(() -> WorkingScheduleException.notFound(uuid));
    }

    /**
     * Знайти entity за ID філії
     */
    @Transactional(readOnly = true)
    public Optional<WorkingScheduleEntity> findByBranchId(UUID branchId) {
        return workingScheduleRepository.findByBranchUuid(branchId);
    }

    /**
     * Знайти робочий день за UUID
     */
    @Transactional(readOnly = true)
    private WorkingDayEntity findWorkingDayById(UUID uuid) {
        return workingDayRepository.findByUuid(uuid)
            .orElseThrow(() -> new RuntimeException("Working day not found: " + uuid));
    }

    /**
     * Оновити entity
     */
    public WorkingScheduleEntity update(WorkingScheduleEntity entity) {
        return workingScheduleRepository.save(entity);
    }

    /**
     * Знайти всі робочі дні філії
     */
    @Transactional(readOnly = true)
    public List<WorkingDayEntity> findWorkingDaysByBranch(UUID branchId) {
        // Спочатку знаходимо розклад філії, потім робочі дні цього розкладу
        return findByBranchId(branchId)
            .map(schedule -> workingDayRepository.findByWorkingSchedule_Id(schedule.getId()))
            .orElse(new ArrayList<>());
    }
}
