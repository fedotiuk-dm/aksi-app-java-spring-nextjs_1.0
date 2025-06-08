package com.aksi.domain.order.statemachine.stage2.service.coordination;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.statemachine.stage2.substep1.dto.BasicInfoDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.PriceListItemDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.dto.ServiceCategoryDTO;
import com.aksi.domain.order.statemachine.stage2.substep1.service.BasicInfoStepService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Координатор для підетапу 2.1: Основна інформація про предмет.
 *
 * Відповідальності:
 * - Координація роботи з BasicInfoStepService
 * - Управління категоріями послуг та прайс-листом
 * - Розрахунок базової ціни предметів
 * - Валідація основної інформації
 *
 * Принцип: один файл = одна логіка координації основної інформації.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class Step1BasicInfoCoordinator {

    private final BasicInfoStepService basicInfoStepService;

    /**
     * Отримує список доступних категорій послуг.
     */
    public List<ServiceCategoryDTO> getAvailableCategories() {
        log.debug("Координація отримання доступних категорій");
        return basicInfoStepService.getAvailableCategories();
    }

    /**
     * Отримує категорію за кодом.
     */
    public ServiceCategoryDTO getCategoryByCode(String categoryCode) {
        log.debug("Координація отримання категорії за кодом: {}", categoryCode);
        return basicInfoStepService.getCategoryByCode(categoryCode);
    }

    /**
     * Отримує предмети з прайс-листа для категорії.
     */
    public List<PriceListItemDTO> getItemsByCategory(String categoryCode) {
        log.debug("Координація отримання предметів для категорії: {}", categoryCode);
        return basicInfoStepService.getItemsByCategory(categoryCode);
    }

    /**
     * Отримує предмет за ID.
     */
    public PriceListItemDTO getItemById(String itemId) {
        log.debug("Координація отримання предмета за ID: {}", itemId);
        return basicInfoStepService.getItemById(itemId);
    }

    /**
     * Отримує рекомендовану одиницю виміру для категорії.
     */
    public String getRecommendedUnitOfMeasure(String categoryCode) {
        log.debug("Координація отримання одиниці виміру для категорії: {}", categoryCode);
        return basicInfoStepService.getRecommendedUnitOfMeasure(categoryCode);
    }

    /**
     * Розраховує базову ціну для предмета.
     */
    public BigDecimal getBasePrice(String categoryCode, String itemName, String color) {
        log.debug("Координація розрахунку базової ціни: category={}, item={}, color={}",
                  categoryCode, itemName, color);
        return basicInfoStepService.getBasePrice(categoryCode, itemName, color);
    }

    /**
     * Валідує основну інформацію про предмет.
     */
    public BasicInfoDTO validateBasicInfo(BasicInfoDTO basicInfo) {
        log.debug("Координація валідації основної інформації");
        return basicInfoStepService.validateBasicInfo(basicInfo);
    }

    /**
     * Автоматично заповнює дані на основі вибраного предмета з прайс-листа.
     */
    public BasicInfoDTO autoFillFromPriceListItem(BasicInfoDTO basicInfo, String selectedItemId) {
        log.debug("Координація автозаповнення для предмета: {}", selectedItemId);
        return basicInfoStepService.autoFillFromPriceListItem(basicInfo, selectedItemId);
    }

    /**
     * Розраховує ціну для основної інформації.
     */
    public BasicInfoDTO calculatePrice(BasicInfoDTO basicInfo) {
        log.debug("Координація розрахунку ціни для основної інформації");
        return basicInfoStepService.calculatePrice(basicInfo);
    }

    /**
     * Зберігає основну інформацію в сесії wizard.
     */
    public BasicInfoDTO saveBasicInfo(String wizardId, BasicInfoDTO basicInfo) {
        log.debug("Координація збереження основної інформації для wizardId: {}", wizardId);
        return basicInfoStepService.saveBasicInfo(wizardId, basicInfo);
    }

    /**
     * Завантажує основну інформацію з сесії wizard.
     */
    public BasicInfoDTO loadBasicInfo(String wizardId) {
        log.debug("Координація завантаження основної інформації для wizardId: {}", wizardId);
        return basicInfoStepService.loadBasicInfo(wizardId);
    }

    /**
     * Перевіряє чи доступна категорія.
     */
    public boolean isCategoryAvailable(String categoryCode) {
        log.debug("Координація перевірки доступності категорії: {}", categoryCode);
        return basicInfoStepService.isCategoryAvailable(categoryCode);
    }

    /**
     * Перевіряє чи доступний предмет в категорії.
     */
    public boolean isItemAvailable(String categoryCode, String itemId) {
        log.debug("Координація перевірки доступності предмета {} в категорії {}", itemId, categoryCode);
        return basicInfoStepService.isItemAvailable(categoryCode, itemId);
    }

    /**
     * Перевіряє готовність для переходу до наступного кроку.
     */
    public boolean isReadyForNextStep(BasicInfoDTO basicInfo) {
        log.debug("Координація перевірки готовності для наступного кроку");
        return basicInfoStepService.isReadyForNextStep(basicInfo);
    }

    /**
     * Отримує статус завершення підетапу.
     */
    public String getCompletionStatus(BasicInfoDTO basicInfo) {
        log.debug("Координація отримання статусу завершення");
        return basicInfoStepService.getCompletionStatus(basicInfo);
    }
}
