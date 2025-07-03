package com.aksi.domain.item.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.item.entity.ItemColorEntity;

/** Repository для довідника кольорів предметів Надає методи для пошуку та отримання кольорів */
@Repository
public interface ItemColorRepository extends JpaRepository<ItemColorEntity, UUID> {

  /**
   * Знаходить колір за кодом
   *
   * @param code код кольору (наприклад, "BLACK", "WHITE")
   * @return колір або empty
   */
  Optional<ItemColorEntity> findByCode(String code);

  /**
   * Перевіряє чи існує колір з таким кодом
   *
   * @param code код кольору
   * @return true якщо існує
   */
  boolean existsByCode(String code);

  /**
   * Знаходить всі активні кольори, відсортовані за порядком
   *
   * @return список активних кольорів
   */
  @Query("SELECT c FROM ItemColorEntity c WHERE c.isActive = true ORDER BY c.sortOrder, c.nameUk")
  List<ItemColorEntity> findAllActiveOrderBySortOrder();

  /**
   * Знаходить кольори що впливають на ціну
   *
   * @return список кольорів з особливим ціноутворенням
   */
  @Query(
      "SELECT c FROM ItemColorEntity c WHERE c.affectsPrice = true AND c.isActive = true ORDER BY c.sortOrder")
  List<ItemColorEntity> findAllPriceAffectingColors();

  /**
   * Знаходить кольори за частиною назви (пошук)
   *
   * @param searchTerm частина назви для пошуку
   * @return список знайдених кольорів
   */
  @Query(
      "SELECT c FROM ItemColorEntity c WHERE c.isActive = true AND "
          + "(LOWER(c.nameUk) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
          + "LOWER(c.nameEn) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
          + "LOWER(c.code) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) "
          + "ORDER BY c.sortOrder")
  List<ItemColorEntity> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);

  /**
   * Знаходить кольори за списком кодів
   *
   * @param codes список кодів кольорів
   * @return список знайдених кольорів
   */
  @Query(
      "SELECT c FROM ItemColorEntity c WHERE c.code IN :codes AND c.isActive = true ORDER BY c.sortOrder")
  List<ItemColorEntity> findByCodes(@Param("codes") List<String> codes);

  /**
   * Отримує максимальний порядок сортування для додавання нового кольору
   *
   * @return максимальний sortOrder + 1
   */
  @Query("SELECT COALESCE(MAX(c.sortOrder), 0) + 1 FROM ItemColorEntity c")
  Integer getNextSortOrder();

  /**
   * Знаходить всі кольори без HEX коду (для адміністрування)
   *
   * @return список кольорів без HEX
   */
  @Query(
      "SELECT c FROM ItemColorEntity c WHERE c.hexColor IS NULL OR c.hexColor = '' ORDER BY c.sortOrder")
  List<ItemColorEntity> findColorsWithoutHex();
}
