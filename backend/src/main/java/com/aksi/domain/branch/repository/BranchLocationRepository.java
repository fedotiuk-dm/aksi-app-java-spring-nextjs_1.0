package com.aksi.domain.branch.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.branch.entity.BranchLocationEntity;

/**
 * Репозиторій для роботи з пунктами прийому замовлень.
 */
@Repository
public interface BranchLocationRepository extends JpaRepository<BranchLocationEntity, UUID> {

    /**
     * Знаходить всі активні пункти прийому замовлень.
     *
     * @return список активних пунктів прийому
     */
    List<BranchLocationEntity> findByActiveTrue();

    /**
     * Знаходить пункт прийому за кодом.
     *
     * @param code код пункту прийому
     * @return опціональне значення пункту прийому
     */
    Optional<BranchLocationEntity> findByCode(String code);

    /**
     * Перевіряє, чи існує пункт прийому з заданим кодом.
     *
     * @param code код пункту прийому
     * @return true, якщо пункт з таким кодом існує
     */
    boolean existsByCode(String code);

    /**
     * Перевіряє, чи існує пункт прийому з заданим кодом, окрім вказаного ідентифікатора.
     * Використовується для перевірки унікальності коду при оновленні.
     *
     * @param code код пункту прийому
     * @param id ідентифікатор пункту прийому
     * @return true, якщо пункт з таким кодом існує
     */
    boolean existsByCodeAndIdNot(String code, UUID id);
}
