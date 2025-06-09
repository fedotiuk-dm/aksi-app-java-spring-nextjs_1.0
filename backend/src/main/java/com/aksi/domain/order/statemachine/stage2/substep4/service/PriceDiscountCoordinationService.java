package com.aksi.domain.order.statemachine.stage2.substep4.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.ItemBasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep2.dto.ItemCharacteristicsDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.StainsDefectsDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.PriceDiscountDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.dto.SubstepResultDTO;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountEvent;
import com.aksi.domain.order.statemachine.stage2.substep4.enums.PriceDiscountState;
import com.aksi.domain.order.statemachine.stage2.substep4.service.PriceDiscountValidationService.GuardValidationType;
import com.aksi.domain.order.statemachine.stage2.substep4.validator.ValidationResult;
import com.aksi.domain.pricing.dto.PriceCalculationResponseDTO;
import com.aksi.domain.pricing.dto.PriceModifierDTO;

/**
 * Координаційний сервіс для підетапу 2.4: Знижки та надбавки (калькулятор ціни).
 * Головний делегатор між усіма сервісами для роботи з калькулятором ціни.
 */
@Service
public class PriceDiscountCoordinationService {

    private final PriceDiscountValidationService validationService;
    private final PriceDiscountWorkflowService workflowService;
    private final PriceDiscountStateService stateService;
    private final PriceDiscountOperationsService operationsService;

    public PriceDiscountCoordinationService(
            PriceDiscountValidationService validationService,
            PriceDiscountWorkflowService workflowService,
            PriceDiscountStateService stateService,
            PriceDiscountOperationsService operationsService) {
        this.validationService = validationService;
        this.workflowService = workflowService;
        this.stateService = stateService;
        this.operationsService = operationsService;
    }

    // ========== Делегування до WorkflowService ==========

    public SubstepResultDTO initializeSubstep(UUID sessionId,
                                            ItemBasicInfoDTO basicInfo,
                                            ItemCharacteristicsDTO characteristics,
                                            StainsDefectsDTO stainsDefects) {
        return workflowService.initializeSubstep(sessionId, basicInfo, characteristics, stainsDefects);
    }

    public SubstepResultDTO calculateBasePrice(UUID sessionId) {
        return workflowService.calculateBasePrice(sessionId);
    }

    public SubstepResultDTO addModifier(UUID sessionId, String modifierId) {
        return workflowService.addModifier(sessionId, modifierId);
    }

    public SubstepResultDTO removeModifier(UUID sessionId, String modifierId) {
        return workflowService.removeModifier(sessionId, modifierId);
    }

    public SubstepResultDTO calculateFinalPrice(UUID sessionId) {
        return workflowService.calculateFinalPrice(sessionId);
    }

    public SubstepResultDTO confirmCalculation(UUID sessionId) {
        return workflowService.confirmCalculation(sessionId);
    }

    public SubstepResultDTO resetCalculation(UUID sessionId) {
        return workflowService.resetCalculation(sessionId);
    }

    public SubstepResultDTO handleError(UUID sessionId, String errorMessage) {
        return workflowService.handleError(sessionId, errorMessage);
    }

    public SubstepResultDTO getCurrentState(UUID sessionId) {
        return workflowService.getCurrentState(sessionId);
    }

    public List<PriceDiscountEvent> getAvailableEvents(UUID sessionId) {
        return workflowService.getAvailableEvents(sessionId);
    }

    public boolean isCurrentStateValid(UUID sessionId) {
        return workflowService.isCurrentStateValid(sessionId);
    }

    // ========== Делегування до ValidationService ==========

    public ValidationResult validateBasicCalculationData(PriceDiscountDTO data) {
        return validationService.validateBasicCalculationData(data);
    }

    public ValidationResult validateModifiers(PriceDiscountDTO data) {
        return validationService.validateModifiers(data);
    }

    public ValidationResult validateCalculationResult(PriceDiscountDTO data) {
        return validationService.validateCalculationResult(data);
    }

    public ValidationResult validateAll(PriceDiscountDTO data) {
        return validationService.validateAll(data);
    }

    public SubstepResultDTO validateBasicDataWithResult(UUID sessionId) {
        return validationService.validateBasicDataWithResult(sessionId);
    }

    public SubstepResultDTO validateModifiersWithResult(UUID sessionId) {
        return validationService.validateModifiersWithResult(sessionId);
    }

    public SubstepResultDTO validateAllWithResult(UUID sessionId) {
        return validationService.validateAllWithResult(sessionId);
    }

    public boolean isValidForGuard(UUID sessionId, GuardValidationType validationType) {
        return validationService.isValidForGuard(sessionId, validationType);
    }

    public String getValidationErrorMessage(UUID sessionId) {
        return validationService.getValidationErrorMessage(sessionId);
    }

    // ========== Делегування до StateService ==========

    public void initializeContext(UUID sessionId, PriceDiscountDTO initialData) {
        stateService.initializeContext(sessionId, initialData);
    }

    public PriceDiscountStateService.PriceDiscountContext getContext(UUID sessionId) {
        return stateService.getContext(sessionId);
    }

    public void updateState(UUID sessionId, PriceDiscountState newState) {
        stateService.updateState(sessionId, newState);
    }

    public void updateData(UUID sessionId, PriceDiscountDTO updatedData) {
        stateService.updateData(sessionId, updatedData);
    }

    public PriceDiscountState getStateFromService(UUID sessionId) {
        return stateService.getCurrentState(sessionId);
    }

    public PriceDiscountDTO getData(UUID sessionId) {
        return stateService.getData(sessionId);
    }

    public boolean hasContext(UUID sessionId) {
        return stateService.hasContext(sessionId);
    }

    public void removeContext(UUID sessionId) {
        stateService.removeContext(sessionId);
    }

    // ========== Делегування до OperationsService ==========

    public PriceCalculationResponseDTO calculatePrice(PriceDiscountDTO data) {
        return operationsService.calculatePrice(data.getCalculationRequest());
    }

    public List<PriceModifierDTO> getAvailableModifiers(String categoryCode) {
        return operationsService.getAvailableModifiers(categoryCode);
    }

    public List<PriceModifierDTO> getAllActiveModifiers() {
        return operationsService.getAllActiveModifiers();
    }

    public PriceModifierDTO getModifierByCode(String modifierCode) {
        return operationsService.getModifierByCode(modifierCode);
    }

    public boolean modifierExists(String modifierCode) {
        return operationsService.modifierExists(modifierCode);
    }

    public boolean validateModifiers(List<String> modifierIds) {
        return operationsService.validateModifiers(modifierIds);
    }

    public List<PriceModifierDTO> getRecommendedModifiers(String categoryCode, String itemName) {
        return operationsService.getRecommendedModifiers(categoryCode, itemName);
    }

    // ========== Методи для Guards ==========

    /**
     * Перевіряє чи підетап готовий до ініціалізації через sessionId для Guards
     */
    public boolean canInitialize(UUID sessionId) {
        return !hasContext(sessionId);
    }

    /**
     * Перевіряє чи можна розрахувати базову ціну через sessionId для Guards
     */
    public boolean canCalculateBasePrice(UUID sessionId) {
        return isValidForGuard(sessionId, GuardValidationType.BASIC_CALCULATION);
    }

    /**
     * Перевіряє чи вибрані модифікатори валідні через sessionId для Guards
     */
    public boolean hasValidModifiers(UUID sessionId) {
        return isValidForGuard(sessionId, GuardValidationType.MODIFIERS_SELECTION);
    }

    /**
     * Перевіряє чи можна розрахувати фінальну ціну через sessionId для Guards
     */
    public boolean canCalculateFinalPrice(UUID sessionId) {
        return isValidForGuard(sessionId, GuardValidationType.FINAL_CALCULATION);
    }

    /**
     * Перевіряє чи розрахунок завершений через sessionId для Guards
     */
    public boolean isCalculationCompleted(UUID sessionId) {
        return isValidForGuard(sessionId, GuardValidationType.SUBSTEP_COMPLETION);
    }

    /**
     * Перевіряє чи немає помилок розрахунку через sessionId для Guards
     */
    public boolean hasNoCalculationErrors(UUID sessionId) {
        return isValidForGuard(sessionId, GuardValidationType.NO_CALCULATION_ERRORS);
    }

    /**
     * Перевіряє валідність даних через sessionId для Guards
     */
    public boolean isDataValid(UUID sessionId) {
        return isValidForGuard(sessionId, GuardValidationType.DATA_VALIDITY);
    }
}
