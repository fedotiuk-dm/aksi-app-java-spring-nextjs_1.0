package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.pricing.entity.AbstractItemIssueEntity;
import com.aksi.domain.pricing.enums.RiskLevel;

/**
 * Абстрактний базовий сервіс для типів проблем з предметами (дефекти, плями тощо).
 * Реалізує спільну бізнес-логіку для всіх типів проблем.
 *
 * @param <T> тип сутності, що успадковується від AbstractItemIssueEntity
 * @param <R> тип репозиторію для сутності
 */
public abstract class AbstractItemIssueService<T extends AbstractItemIssueEntity, R extends JpaRepository<T, UUID>> {

    protected final R repository;

    protected AbstractItemIssueService(R repository) {
        this.repository = repository;
    }

    /**
     * Отримати всі активні записи.
     *
     * @return список всіх активних записів
     */
    @Transactional(readOnly = true)
    public List<T> findAllActive() {
        return repository.findAll().stream()
                .filter(AbstractItemIssueEntity::isActive)
                .toList();
    }

    /**
     * Отримати всі записи з пагінацією.
     *
     * @param pageable параметри пагінації
     * @return сторінка записів
     */
    @Transactional(readOnly = true)
    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    /**
     * Отримати запис за ідентифікатором.
     *
     * @param id ідентифікатор
     * @return запис або пусто, якщо не знайдено
     */
    @Transactional(readOnly = true)
    public Optional<T> findById(UUID id) {
        return repository.findById(id);
    }

    /**
     * Зберегти новий запис.
     *
     * @param entity новий запис
     * @return збережений запис
     */
    @Transactional
    public T save(T entity) {
        return repository.save(entity);
    }

    /**
     * Оновити існуючий запис.
     *
     * @param id ідентифікатор
     * @param entity оновлений запис
     * @return оновлений запис або пусто, якщо не знайдено
     */
    @Transactional
    public Optional<T> update(UUID id, T entity) {
        return repository.findById(id)
                .map(existing -> {
                    entity.setId(id);
                    return repository.save(entity);
                });
    }

    /**
     * Деактивувати запис.
     *
     * @param id ідентифікатор
     * @return true, якщо деактивовано, false - якщо не знайдено
     */
    @Transactional
    public boolean deactivate(UUID id) {
        return repository.findById(id)
                .map(entity -> {
                    entity.setActive(false);
                    repository.save(entity);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Активувати запис.
     *
     * @param id ідентифікатор
     * @return true, якщо активовано, false - якщо не знайдено
     */
    @Transactional
    public boolean activate(UUID id) {
        return repository.findById(id)
                .map(entity -> {
                    entity.setActive(true);
                    repository.save(entity);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Отримати всі записи з вказаним рівнем ризику.
     *
     * @param riskLevel рівень ризику
     * @return список записів з вказаним рівнем ризику
     */
    @Transactional(readOnly = true)
    public List<T> findByRiskLevel(RiskLevel riskLevel) {
        return repository.findAll().stream()
                .filter(entity -> entity.getRiskLevel() == riskLevel && entity.isActive())
                .toList();
    }

    /**
     * Отримати зареєстровані записи за списком кодів.
     *
     * @param codes список кодів
     * @return список знайдених записів
     */
    @Transactional(readOnly = true)
    public List<T> findByCodes(List<String> codes) {
        return repository.findAll().stream()
                .filter(entity -> entity.isActive() && codes.contains(entity.getCode()))
                .toList();
    }

    /**
     * Отримати зареєстровані записи за списком назв.
     *
     * @param names список назв
     * @return список знайдених записів
     */
    @Transactional(readOnly = true)
    public List<T> findByNames(List<String> names) {
        return repository.findAll().stream()
                .filter(entity -> entity.isActive() && names.contains(entity.getName()))
                .toList();
    }
}
