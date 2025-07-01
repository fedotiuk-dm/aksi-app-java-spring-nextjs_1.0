package com.aksi.shared.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.shared.BaseEntity;

/**
 * Базовий abstract клас для Service з загальними CRUD операціями. Зменшує дублювання коду в
 * доменних Service класах.
 *
 * @param <T> тип Entity
 * @param <ID> тип ID
 * @param <R> тип Repository
 */
@Transactional(readOnly = true)
public abstract class BaseService<
    T extends BaseEntity, ID, R extends JpaRepository<T, ID> & JpaSpecificationExecutor<T>> {

  protected final R repository;

  protected BaseService(R repository) {
    this.repository = repository;
  }

  /**
   * Знаходить entity за ID.
   *
   * @param id ID entity
   * @return Optional з entity
   */
  public Optional<T> findById(ID id) {
    return repository.findById(id);
  }

  /**
   * Знаходить всі entities.
   *
   * @return список всіх entities
   */
  public List<T> findAll() {
    return repository.findAll();
  }

  /**
   * Знаходить entities з пагінацією.
   *
   * @param pageable параметри пагінації
   * @return сторінка entities
   */
  public Page<T> findAll(Pageable pageable) {
    return repository.findAll(pageable);
  }

  /**
   * Знаходить entities за Specification.
   *
   * @param specification критерії пошуку
   * @return список entities
   */
  public List<T> findAll(Specification<T> specification) {
    return repository.findAll(specification);
  }

  /**
   * Знаходить entities за Specification з пагінацією.
   *
   * @param specification критерії пошуку
   * @param pageable параметри пагінації
   * @return сторінка entities
   */
  public Page<T> findAll(Specification<T> specification, Pageable pageable) {
    return repository.findAll(specification, pageable);
  }

  /**
   * Перевіряє чи існує entity за ID.
   *
   * @param id ID entity
   * @return true якщо існує
   */
  public boolean existsById(ID id) {
    return repository.existsById(id);
  }

  /**
   * Перевіряє чи існує entity за Specification.
   *
   * @param specification критерії пошуку
   * @return true якщо існує
   */
  public boolean exists(Specification<T> specification) {
    return repository.exists(specification);
  }

  /**
   * Підраховує кількість entities.
   *
   * @return кількість entities
   */
  public long count() {
    return repository.count();
  }

  /**
   * Підраховує кількість entities за Specification.
   *
   * @param specification критерії пошуку
   * @return кількість entities
   */
  public long count(Specification<T> specification) {
    return repository.count(specification);
  }

  /**
   * Зберігає entity.
   *
   * @param entity entity для збереження
   * @return збережене entity
   */
  @Transactional
  public T save(T entity) {
    return repository.save(entity);
  }

  /**
   * Зберігає список entities.
   *
   * @param entities список entities для збереження
   * @return список збережених entities
   */
  @Transactional
  public List<T> saveAll(List<T> entities) {
    return repository.saveAll(entities);
  }

  /**
   * Видаляє entity за ID.
   *
   * @param id ID entity
   */
  @Transactional
  public void deleteById(ID id) {
    repository.deleteById(id);
  }

  /**
   * Видаляє entity.
   *
   * @param entity entity для видалення
   */
  @Transactional
  public void delete(T entity) {
    repository.delete(entity);
  }

  /** Видаляє всі entities. */
  @Transactional
  public void deleteAll() {
    repository.deleteAll();
  }

  /**
   * Видаляє entities за списком ID.
   *
   * @param ids список ID для видалення
   */
  @Transactional
  public void deleteAllById(List<ID> ids) {
    repository.deleteAllById(ids);
  }
}
