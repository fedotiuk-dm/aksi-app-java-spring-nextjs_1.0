package com.aksi.domain.pricing.repository;

import com.aksi.domain.pricing.entity.PriceListItem;
import com.aksi.domain.pricing.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PriceListItemRepository extends JpaRepository<PriceListItem, UUID> {
    Optional<PriceListItem> findByCatalogNumber(Integer catalogNumber);
    List<PriceListItem> findAllByCategory(ServiceCategory category);
    List<PriceListItem> findAllByCategoryOrderByCatalogNumberAsc(ServiceCategory category);
    List<PriceListItem> findAllByActiveTrue();
    
    /**
     * Знаходить елемент прайс-листа за категорією та назвою
     */
    Optional<PriceListItem> findByCategoryIdAndName(UUID categoryId, String name);
    
    /**
     * Знаходить максимальний номер в каталозі для вказаної категорії
     * @param categoryId ID категорії
     * @return Максимальний номер в каталозі або null, якщо у категорії немає позицій
     */
    @Query("SELECT MAX(p.catalogNumber) FROM PriceListItem p WHERE p.category.id = :categoryId")
    Optional<Integer> findMaxCatalogNumberByCategory(@Param("categoryId") UUID categoryId);
}
