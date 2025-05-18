package com.aksi.domain.order.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
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
        
        // Знаходимо максимальну кількість днів обробки серед усіх категорій
        int maxProcessingDays = categories.stream()
                .mapToInt(ServiceCategoryEntity::getStandardProcessingDays)
                .max()
                .orElse(2); // За замовчуванням - 2 дні
        
        log.debug("Maximum processing days among categories: {}", maxProcessingDays);
        
        // Визначаємо скорочений час виконання на основі типу терміновості (використовуємо switch expression)
        int expeditedProcessingHours = switch (request.getExpediteType()) {
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