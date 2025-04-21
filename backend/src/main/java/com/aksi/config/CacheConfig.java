package com.aksi.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Конфігурація кешування для оптимізації продуктивності.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Імена кешів, які використовуються в системі.
     */
    public static final String PRICE_LIST_CACHE = "priceListCache";
    public static final String CATEGORY_MATERIALS_CACHE = "categoryMaterialsCache";
    public static final String PRICE_CALCULATION_CACHE = "priceCalculationCache";

    /**
     * Налаштування менеджера кешування.
     *
     * @return менеджер кешів
     */
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
                PRICE_LIST_CACHE,
                CATEGORY_MATERIALS_CACHE,
                PRICE_CALCULATION_CACHE
        );
    }
}
