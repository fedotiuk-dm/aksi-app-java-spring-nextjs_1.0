package com.aksi.domain.pricing.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.pricing.dto.ServiceCategoryDTO;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.mapper.PriceListMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з категоріями послуг.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ServiceCategoryServiceImpl implements ServiceCategoryService {

    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PriceListMapper priceListMapper;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<ServiceCategoryDTO> getAllActiveCategories() {
        log.debug("Отримання списку всіх активних категорій послуг");

        List<ServiceCategoryEntity> categories = serviceCategoryRepository.findByActiveIsTrueOrderBySortOrder();

        return priceListMapper.toCategoryDtoList(categories);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public ServiceCategoryDTO getCategoryById(UUID id) {
        log.debug("Отримання категорії послуг за ID: {}", id);

        ServiceCategoryEntity category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withId(id));

        return priceListMapper.toDto(category);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public ServiceCategoryDTO getCategoryByCode(String code) {
        log.debug("Отримання категорії послуг за кодом: {}", code);

        ServiceCategoryEntity category = serviceCategoryRepository.findByCode(code)
                .orElseThrow(() -> EntityNotFoundException.withMessage("Категорію послуг не знайдено за кодом: " + code));

        return priceListMapper.toDto(category);
    }
}
