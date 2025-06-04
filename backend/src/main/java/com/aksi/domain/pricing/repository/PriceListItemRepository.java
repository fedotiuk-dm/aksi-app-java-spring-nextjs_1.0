package com.aksi.domain.pricing.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aksi.domain.pricing.entity.PriceListItemEntity;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;

@Repository
public interface PriceListItemRepository extends JpaRepository<PriceListItemEntity, UUID> {
    Optional<PriceListItemEntity> findByCatalogNumber(Integer catalogNumber);
    Optional<PriceListItemEntity> findByName(String name);
    Optional<PriceListItemEntity> findByNameAndCategory(String name, ServiceCategoryEntity category);
    List<PriceListItemEntity> findAllByCategory(ServiceCategoryEntity category);
    List<PriceListItemEntity> findAllByCategoryOrderByCatalogNumberAsc(ServiceCategoryEntity category);
    List<PriceListItemEntity> findAllByActiveTrue();

    /**
     * Знаходить елемент прайс-листа за категорією та назвою.
     * @param categoryId ідентифікатор
     * @param name ім'я
     * @return Елемент прайс-листа
     */
    Optional<PriceListItemEntity> findByCategoryIdAndName(UUID categoryId, String name);

    /**
     * Знаходить елемент прайс-листа за кодом категорії та назвою предмета.
     * @param categoryCode код категорії
     * @param itemName назва предмета
     * @return Елемент прайс-листа
     */
    @Query("SELECT pli FROM PriceListItemEntity pli WHERE pli.category.code = :categoryCode AND pli.name = :itemName")
    Optional<PriceListItemEntity> findByCategoryCodeAndItemName(
            @Param("categoryCode") String categoryCode,
            @Param("itemName") String itemName);

    /**
     * Знаходить максимальний номер в каталозі для вказаної категорії.
     * @param categoryId ID категорії
     * @return Максимальний номер в каталозі або null, якщо у категорії немає позицій
     */
    @Query("SELECT MAX(p.catalogNumber) FROM PriceListItemEntity p WHERE p.category.id = :categoryId")
    Optional<Integer> findMaxCatalogNumberByCategory(@Param("categoryId") UUID categoryId);
}
