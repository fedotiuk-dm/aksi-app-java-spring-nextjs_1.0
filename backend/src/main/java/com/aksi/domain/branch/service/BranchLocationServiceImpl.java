package com.aksi.domain.branch.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.branch.dto.BranchLocationCreateRequest;
import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.dto.BranchLocationUpdateRequest;
import com.aksi.domain.branch.entity.BranchLocationEntity;
import com.aksi.domain.branch.mapper.BranchLocationMapper;
import com.aksi.domain.branch.repository.BranchLocationRepository;
import com.aksi.exception.DuplicateResourceException;
import com.aksi.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для роботи з пунктами прийому замовлень.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BranchLocationServiceImpl implements BranchLocationService {

    private final BranchLocationRepository branchLocationRepository;
    private final BranchLocationMapper branchLocationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BranchLocationDTO> getAllBranchLocations() {
        log.debug("Отримання всіх пунктів прийому замовлень");
        return branchLocationRepository.findAll().stream()
                .map(branchLocationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchLocationDTO> getActiveBranchLocations() {
        log.debug("Отримання активних пунктів прийому замовлень");
        return branchLocationRepository.findByActiveTrue().stream()
                .map(branchLocationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BranchLocationDTO getBranchLocationById(UUID id) {
        log.debug("Отримання пункту прийому замовлень за ID: {}", id);
        BranchLocationEntity entity = findEntityById(id);
        return branchLocationMapper.toDto(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public BranchLocationDTO getBranchLocationByCode(String code) {
        log.debug("Отримання пункту прийому замовлень за кодом: {}", code);
        BranchLocationEntity entity = branchLocationRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Пункт прийому з кодом " + code + " не знайдено"));
        return branchLocationMapper.toDto(entity);
    }

    @Override
    @Transactional
    public BranchLocationDTO createBranchLocation(BranchLocationCreateRequest request) {
        log.debug("Створення нового пункту прийому замовлень: {}", request);

        // Перевірка унікальності коду
        if (branchLocationRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Пункт прийому з кодом " + request.getCode() + " вже існує");
        }

        BranchLocationEntity entity = branchLocationMapper.toEntity(request);
        BranchLocationEntity savedEntity = branchLocationRepository.save(entity);

        log.info("Створено новий пункт прийому замовлень з ID: {}", savedEntity.getId());
        return branchLocationMapper.toDto(savedEntity);
    }

    @Override
    @Transactional
    public BranchLocationDTO updateBranchLocation(UUID id, BranchLocationUpdateRequest request) {
        log.debug("Оновлення пункту прийому замовлень з ID: {}, дані: {}", id, request);

        BranchLocationEntity entity = findEntityById(id);

        // Перевірка унікальності коду, якщо він змінюється
        if (!entity.getCode().equals(request.getCode()) &&
            branchLocationRepository.existsByCodeAndIdNot(request.getCode(), id)) {
            throw new DuplicateResourceException("Пункт прийому з кодом " + request.getCode() + " вже існує");
        }

        branchLocationMapper.updateEntity(request, entity);
        BranchLocationEntity updatedEntity = branchLocationRepository.save(entity);

        log.info("Оновлено пункт прийому замовлень з ID: {}", id);
        return branchLocationMapper.toDto(updatedEntity);
    }

    @Override
    @Transactional
    public BranchLocationDTO setActive(UUID id, boolean active) {
        log.debug("Зміна статусу активності пункту прийому замовлень з ID: {} на: {}", id, active);

        BranchLocationEntity entity = findEntityById(id);
        entity.setActive(active);
        BranchLocationEntity updatedEntity = branchLocationRepository.save(entity);

        log.info("Змінено статус активності пункту прийому замовлень з ID: {} на: {}", id, active);
        return branchLocationMapper.toDto(updatedEntity);
    }

    @Override
    @Transactional
    public void deleteBranchLocation(UUID id) {
        log.debug("Видалення пункту прийому замовлень з ID: {}", id);

        BranchLocationEntity entity = findEntityById(id);
        branchLocationRepository.delete(entity);

        log.info("Видалено пункт прийому замовлень з ID: {}", id);
    }

    /**
     * Знаходить сутність пункту прийому за ідентифікатором.
     *
     * @param id ідентифікатор пункту прийому
     * @return сутність пункту прийому
     * @throws ResourceNotFoundException якщо пункт прийому не знайдено
     */
    private BranchLocationEntity findEntityById(UUID id) {
        return branchLocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пункт прийому з ID " + id + " не знайдено"));
    }
}
