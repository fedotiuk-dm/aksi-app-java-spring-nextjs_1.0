package com.aksi.domain.branch.service;

import java.util.List;
import java.util.UUID;

import com.aksi.domain.branch.dto.BranchLocationCreateRequest;
import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.dto.BranchLocationUpdateRequest;

/**
 * Сервіс для роботи з пунктами прийому замовлень.
 */
public interface BranchLocationService {

    /**
     * Отримує всі пункти прийому замовлень.
     *
     * @return список всіх пунктів прийому
     */
    List<BranchLocationDTO> getAllBranchLocations();

    /**
     * Отримує всі активні пункти прийому замовлень.
     *
     * @return список активних пунктів прийому
     */
    List<BranchLocationDTO> getActiveBranchLocations();

    /**
     * Отримує пункт прийому за ідентифікатором.
     *
     * @param id ідентифікатор пункту прийому
     * @return DTO пункту прийому
     * @throws com.aksi.exception.ResourceNotFoundException якщо пункт прийому не знайдено
     */
    BranchLocationDTO getBranchLocationById(UUID id);

    /**
     * Отримує пункт прийому за кодом.
     *
     * @param code код пункту прийому
     * @return DTO пункту прийому
     * @throws com.aksi.exception.ResourceNotFoundException якщо пункт прийому не знайдено
     */
    BranchLocationDTO getBranchLocationByCode(String code);

    /**
     * Створює новий пункт прийому замовлень.
     *
     * @param request запит на створення пункту прийому
     * @return створений DTO пункту прийому
     * @throws com.aksi.exception.DuplicateResourceException якщо пункт з таким кодом вже існує
     */
    BranchLocationDTO createBranchLocation(BranchLocationCreateRequest request);

    /**
     * Оновлює існуючий пункт прийому замовлень.
     *
     * @param id ідентифікатор пункту прийому
     * @param request запит на оновлення пункту прийому
     * @return оновлений DTO пункту прийому
     * @throws com.aksi.exception.ResourceNotFoundException якщо пункт прийому не знайдено
     * @throws com.aksi.exception.DuplicateResourceException якщо пункт з таким кодом вже існує
     */
    BranchLocationDTO updateBranchLocation(UUID id, BranchLocationUpdateRequest request);

    /**
     * Змінює статус активності пункту прийому.
     *
     * @param id ідентифікатор пункту прийому
     * @param active новий статус активності
     * @return оновлений DTO пункту прийому
     * @throws com.aksi.exception.ResourceNotFoundException якщо пункт прийому не знайдено
     */
    BranchLocationDTO setActive(UUID id, boolean active);

    /**
     * Видаляє пункт прийому замовлень.
     *
     * @param id ідентифікатор пункту прийому
     * @throws com.aksi.exception.ResourceNotFoundException якщо пункт прийому не знайдено
     */
    void deleteBranchLocation(UUID id);
}
