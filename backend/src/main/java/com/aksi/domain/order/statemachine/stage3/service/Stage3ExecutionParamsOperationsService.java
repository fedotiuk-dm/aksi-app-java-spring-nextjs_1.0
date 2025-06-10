package com.aksi.domain.order.statemachine.stage3.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.CompletionDateCalculationRequest;
import com.aksi.domain.order.dto.CompletionDateResponse;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.service.CompletionDateService;

/**
 * Операційний сервіс для роботи з параметрами виконання Stage3.
 * Тонка обгортка навколо доменного сервісу CompletionDateService.
 *
 * ЕТАП 3.2: Operations Services (тонкі обгортки)
 * Дозволені імпорти: ТІЛЬКИ доменні сервіси, DTO, Spring аннотації, Java стандартні
 * Заборонено: Stage3 Services, Validators, Actions, Guards, Config
 */
@Service
public class Stage3ExecutionParamsOperationsService {

    private final CompletionDateService completionDateService;

    public Stage3ExecutionParamsOperationsService(CompletionDateService completionDateService) {
        this.completionDateService = completionDateService;
    }

    /**
     * Розраховує дату виконання замовлення
     */
    public CompletionDateResponse calculateExpectedCompletionDate(CompletionDateCalculationRequest request) {
        return completionDateService.calculateExpectedCompletionDate(request);
    }

        /**
     * Розраховує дату виконання для списку категорій із звичайним терміном
     */
    public CompletionDateResponse calculateStandardCompletion(List<UUID> serviceCategoryIds) {
        CompletionDateCalculationRequest request = CompletionDateCalculationRequest.builder()
                .serviceCategoryIds(serviceCategoryIds)
                .expediteType(ExpediteType.STANDARD)
                .build();

        return completionDateService.calculateExpectedCompletionDate(request);
    }

    /**
     * Розраховує дату виконання з терміновістю 48 годин
     */
    public CompletionDateResponse calculateExpress48Hours(List<UUID> serviceCategoryIds) {
        CompletionDateCalculationRequest request = CompletionDateCalculationRequest.builder()
                .serviceCategoryIds(serviceCategoryIds)
                .expediteType(ExpediteType.EXPRESS_48H)
                .build();

        return completionDateService.calculateExpectedCompletionDate(request);
    }

    /**
     * Розраховує дату виконання з терміновістю 24 години
     */
    public CompletionDateResponse calculateExpress24Hours(List<UUID> serviceCategoryIds) {
        CompletionDateCalculationRequest request = CompletionDateCalculationRequest.builder()
                .serviceCategoryIds(serviceCategoryIds)
                .expediteType(ExpediteType.EXPRESS_24H)
                .build();

        return completionDateService.calculateExpectedCompletionDate(request);
    }

    /**
     * Розраховує дати виконання для різних типів терміновості
     */
    public List<CompletionDateResponse> calculateAllExpediteOptions(List<UUID> serviceCategoryIds) {
        return List.of(
                calculateStandardCompletion(serviceCategoryIds),
                calculateExpress48Hours(serviceCategoryIds),
                calculateExpress24Hours(serviceCategoryIds)
        );
    }

    /**
     * Перевіряє чи підтримуються терміновість для заданих категорій
     */
    public boolean isExpediteSupported(List<UUID> serviceCategoryIds, ExpediteType expediteType) {
        try {
            CompletionDateCalculationRequest request = CompletionDateCalculationRequest.builder()
                    .serviceCategoryIds(serviceCategoryIds)
                    .expediteType(expediteType)
                    .build();

            CompletionDateResponse response = completionDateService.calculateExpectedCompletionDate(request);
            return response != null && response.getExpectedCompletionDate() != null;
        } catch (Exception e) {
            return false;
        }
    }
}
