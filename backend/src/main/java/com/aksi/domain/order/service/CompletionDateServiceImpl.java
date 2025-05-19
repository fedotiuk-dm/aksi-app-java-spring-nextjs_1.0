package com.aksi.domain.order.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.NonExpeditableCategory;
import com.aksi.domain.pricing.entity.ServiceCategoryEntity;
import com.aksi.domain.pricing.repository.ServiceCategoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Імплементація сервісу для розрахунку дати завершення замовлення
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompletionDateServiceImpl implements CompletionDateService {

    private final ServiceCategoryRepository serviceCategoryRepository;
    
    // Стандартний час видачі замовлень - після 14:00
    private static final LocalTime COMPLETION_TIME = LocalTime.of(14, 0);
    
    @Override
    @Transactional(readOnly = true)
    public CompletionDateResponse calculateExpectedCompletionDate(CompletionDateCalculationRequest request) {
        log.info("Calculating expected completion date for request: {}", request);
        
        // Знаходимо всі категорії послуг у замовленні
        List<ServiceCategoryEntity> categories = serviceCategoryRepository.findAllById(request.getServiceCategoryIds());
        
        if (categories.isEmpty()) {
            log.warn("No service categories found for IDs: {}", request.getServiceCategoryIds());
            throw new IllegalArgumentException("Не знайдено жодної категорії послуг для розрахунку");
        }
        
        // Перевіряємо, чи всі категорії можуть мати терміновість
        boolean hasNonExpeditableCategories = categories.stream()
                .anyMatch(category -> NonExpeditableCategory.isNonExpeditable(category.getCode()));
        
        // Якщо є категорії, що не підлягають терміновості, і запитано терміновий тип виконання,
        // тоді потрібно розділити категорії на дві групи і розрахувати окремо
        ExpediteType effectiveExpediteType = request.getExpediteType();
        
        if (hasNonExpeditableCategories && 
                (effectiveExpediteType == ExpediteType.EXPRESS_24H || effectiveExpediteType == ExpediteType.EXPRESS_48H)) {
            log.info("Order contains non-expeditable categories. Will calculate separate dates.");
            
            // Розділяємо категорії на ті, що можуть і не можуть мати терміновість
            List<ServiceCategoryEntity> expeditableCategories = categories.stream()
                    .filter(category -> !NonExpeditableCategory.isNonExpeditable(category.getCode()))
                    .collect(Collectors.toList());
            
            List<ServiceCategoryEntity> nonExpeditableCategories = categories.stream()
                    .filter(category -> NonExpeditableCategory.isNonExpeditable(category.getCode()))
                    .collect(Collectors.toList());
            
            // Знаходимо максимальний час обробки для категорій з терміновістю
            int expeditableMaxProcessingDays = 0;
            if (!expeditableCategories.isEmpty()) {
                expeditableMaxProcessingDays = expeditableCategories.stream()
                        .mapToInt(ServiceCategoryEntity::getStandardProcessingDays)
                        .max()
                        .orElse(2);
            }
            
            // Знаходимо максимальний час обробки для категорій без терміновості
            int nonExpeditableMaxProcessingDays = 0;
            if (!nonExpeditableCategories.isEmpty()) {
                nonExpeditableMaxProcessingDays = nonExpeditableCategories.stream()
                        .mapToInt(ServiceCategoryEntity::getStandardProcessingDays)
                        .max()
                        .orElse(2);
            }
            
            // Визначаємо скорочений час виконання для категорій з терміновістю
            int expeditedProcessingHours = switch (effectiveExpediteType) {
                case EXPRESS_24H -> 24;
                case EXPRESS_48H -> 48;
                case STANDARD -> expeditableMaxProcessingDays * 24;
            };
            
            // Для категорій без терміновості завжди використовуємо стандартний час
            int nonExpeditableProcessingHours = nonExpeditableMaxProcessingDays * 24;
            
            // Вибираємо максимальний час виконання з цих двох
            int maxProcessingHours = Math.max(expeditedProcessingHours, nonExpeditableProcessingHours);
            
            // Розраховуємо очікувану дату завершення
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expectedDate = now.plusHours(maxProcessingHours);
            
            // Встановлюємо час на 14:00
            expectedDate = expectedDate.with(COMPLETION_TIME);
            
            // Якщо дата випадає на неділю, переносимо на понеділок
            if (expectedDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
                expectedDate = expectedDate.plusDays(1);
            }
            
            log.info("Calculated expected completion date: {}, with max processing hours: {}", 
                    expectedDate, maxProcessingHours);
            
            return CompletionDateResponse.builder()
                    .expectedCompletionDate(expectedDate)
                    .standardProcessingHours(Math.max(expeditableMaxProcessingDays, nonExpeditableMaxProcessingDays) * 24)
                    .expeditedProcessingHours(maxProcessingHours)
                    .build();
        } else {
            // Стандартний розрахунок, якщо всі категорії можуть мати терміновість або не вимагається терміновість
            // Знаходимо максимальну кількість днів обробки серед усіх категорій
            int maxProcessingDays = categories.stream()
                    .mapToInt(ServiceCategoryEntity::getStandardProcessingDays)
                    .max()
                    .orElse(2); // За замовчуванням - 2 дні
            
            log.debug("Maximum processing days among categories: {}", maxProcessingDays);
            
            // Визначаємо скорочений час виконання на основі типу терміновості
            int expeditedProcessingHours = switch (effectiveExpediteType) {
                case EXPRESS_24H -> 24;
                case EXPRESS_48H -> 48;
                case STANDARD -> maxProcessingDays * 24; // Для стандартного типу використовуємо кількість днів * 24 години
            };
            
            // Розраховуємо очікувану дату завершення
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expectedDate = now.plusHours(expeditedProcessingHours);
            
            // Встановлюємо час на 14:00
            expectedDate = expectedDate.with(COMPLETION_TIME);
            
            // Якщо дата випадає на неділю, переносимо на понеділок
            if (expectedDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
                expectedDate = expectedDate.plusDays(1);
            }
            
            log.info("Calculated expected completion date: {}, with expedited hours: {}", 
                    expectedDate, expeditedProcessingHours);
            
            return CompletionDateResponse.builder()
                    .expectedCompletionDate(expectedDate)
                    .standardProcessingHours(maxProcessingDays * 24)
                    .expeditedProcessingHours(expeditedProcessingHours)
                    .build();
        }
    }
} 
