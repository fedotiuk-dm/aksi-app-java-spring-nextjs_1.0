package com.aksi.domain.order.statemachine.stage2.substep5.validator;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

/**
 * Конфігурація для валідатора фотодокументації.
 *
 * Принцип "один файл = одна відповідальність":
 * Централізоване управління налаштуваннями валідації фото.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "app.photos.validation")
public class PhotosValidatorConfig {

    /**
     * Максимальний розмір файлу в байтах (за замовчуванням 5MB)
     */
    private Long maxFileSize = 5 * 1024 * 1024L;

    /**
     * Максимальна кількість фото на предмет (за замовчуванням 5)
     */
    private Integer maxPhotosPerItem = 5;

    /**
     * Мінімальна довжина причини пропуску (за замовчуванням 5 символів)
     */
    private Integer minSkipReasonLength = 5;

    /**
     * Максимальна довжина причини пропуску (за замовчуванням 200 символів)
     */
    private Integer maxSkipReasonLength = 200;

    /**
     * Попередження при розмірі файлу більше цього значення (2MB)
     */
    private Long warningFileSize = 2 * 1024 * 1024L;

    /**
     * Рекомендована мінімальна кількість фото (за замовчуванням 2)
     */
    private Integer recommendedMinPhotos = 2;
}
