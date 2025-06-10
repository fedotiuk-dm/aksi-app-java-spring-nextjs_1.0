package com.aksi.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.dto.OrderWizardApiDto.AdaptersInfo;
import com.aksi.api.dto.OrderWizardApiDto.CompleteApiMap;
import com.aksi.api.dto.OrderWizardApiDto.HealthStatus;
import com.aksi.api.dto.OrderWizardApiDto.StageInfo;
import com.aksi.api.dto.OrderWizardApiDto.StagesStatus;
import com.aksi.api.dto.OrderWizardApiDto.SystemStats;
import com.aksi.api.dto.OrderWizardApiDto.WorkflowMap;
import com.aksi.api.service.StageMethodsProvider;
import com.aksi.api.service.StageMethodsProvider.StageMethods;
import com.aksi.api.util.AdapterStatusUtil;
import com.aksi.domain.order.statemachine.adapter.OrderWizardAdapter;
import com.aksi.domain.order.statemachine.stage1.adapter.BasicOrderInfoAdapter;
import com.aksi.domain.order.statemachine.stage1.adapter.ClientSearchAdapter;
import com.aksi.domain.order.statemachine.stage1.adapter.NewClientFormAdapter;
import com.aksi.domain.order.statemachine.stage2.adapter.Stage2StateMachineAdapter;
import com.aksi.domain.order.statemachine.stage2.substep1.adapter.ItemBasicInfoAdapter;
import com.aksi.domain.order.statemachine.stage2.substep2.adapter.ItemCharacteristicsStateMachineAdapter;
import com.aksi.domain.order.statemachine.stage2.substep3.adapter.StainsDefectsAdapter;
import com.aksi.domain.order.statemachine.stage2.substep4.adapter.PriceDiscountAdapter;
import com.aksi.domain.order.statemachine.stage2.substep5.adapter.PhotoDocumentationAdapter;
import com.aksi.domain.order.statemachine.stage3.adapter.Stage3StateMachineAdapter;
import com.aksi.domain.order.statemachine.stage4.adapter.Stage4StateMachineAdapter;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Головний API фасад для Order Wizard.
 *
 * Оптимізований відповідно до Spring Boot best practices:
 * - DTO винесені в окремі файли (OrderWizardApiDto)
 * - Бізнес-логіка винесена в сервіси (StageMethodsProvider)
 * - Утиліти винесені в окремі класи (AdapterStatusUtil)
 * - Контроллер залишається тонким та фокусується тільки на HTTP обробці
 * - Дотримання принципів SOLID та DRY
 *
 * Забезпечує централізовану інформацію про всі доступні етапи та підетапи,
 * але НЕ дублює логіку - всі операції виконуються через відповідні адаптери.
 */
@RestController
@RequestMapping("/order-wizard")
@Tag(name = "Order Wizard Main API", description = "Головний фасад з повною мапою API для всіх етапів Order Wizard")
public class OrderWizardMainController {

    // =================== ІНЖЕКЦІЯ ЗАЛЕЖНОСТЕЙ ===================

    private final StageMethodsProvider stageMethodsProvider;
    private final AdapterStatusUtil adapterStatusUtil;

    // Адаптери для перевірки готовності
    private final OrderWizardAdapter orderWizardAdapter;
    private final ClientSearchAdapter clientSearchAdapter;
    private final NewClientFormAdapter newClientFormAdapter;
    private final BasicOrderInfoAdapter basicOrderInfoAdapter;
    private final Stage2StateMachineAdapter stage2Adapter;
    private final ItemBasicInfoAdapter itemBasicInfoAdapter;
    private final ItemCharacteristicsStateMachineAdapter itemCharacteristicsAdapter;
    private final StainsDefectsAdapter stainsDefectsAdapter;
    private final PriceDiscountAdapter priceDiscountAdapter;
    private final PhotoDocumentationAdapter photoDocumentationAdapter;
    private final Stage3StateMachineAdapter stage3Adapter;
    private final Stage4StateMachineAdapter stage4Adapter;

    public OrderWizardMainController(
            StageMethodsProvider stageMethodsProvider,
            AdapterStatusUtil adapterStatusUtil,
            OrderWizardAdapter orderWizardAdapter,
            ClientSearchAdapter clientSearchAdapter,
            NewClientFormAdapter newClientFormAdapter,
            BasicOrderInfoAdapter basicOrderInfoAdapter,
            Stage2StateMachineAdapter stage2Adapter,
            ItemBasicInfoAdapter itemBasicInfoAdapter,
            ItemCharacteristicsStateMachineAdapter itemCharacteristicsAdapter,
            StainsDefectsAdapter stainsDefectsAdapter,
            PriceDiscountAdapter priceDiscountAdapter,
            PhotoDocumentationAdapter photoDocumentationAdapter,
            Stage3StateMachineAdapter stage3Adapter,
            Stage4StateMachineAdapter stage4Adapter) {

        this.stageMethodsProvider = stageMethodsProvider;
        this.adapterStatusUtil = adapterStatusUtil;
        this.orderWizardAdapter = orderWizardAdapter;
        this.clientSearchAdapter = clientSearchAdapter;
        this.newClientFormAdapter = newClientFormAdapter;
        this.basicOrderInfoAdapter = basicOrderInfoAdapter;
        this.stage2Adapter = stage2Adapter;
        this.itemBasicInfoAdapter = itemBasicInfoAdapter;
        this.itemCharacteristicsAdapter = itemCharacteristicsAdapter;
        this.stainsDefectsAdapter = stainsDefectsAdapter;
        this.priceDiscountAdapter = priceDiscountAdapter;
        this.photoDocumentationAdapter = photoDocumentationAdapter;
        this.stage3Adapter = stage3Adapter;
        this.stage4Adapter = stage4Adapter;
    }

    // =================== ІНФОРМАЦІЙНІ ENDPOINTS ===================

    @Operation(summary = "Перевірка готовності Order Wizard API")
    @GetMapping("/health")
    public ResponseEntity<HealthStatus> health() {
        return ResponseEntity.ok(new HealthStatus());
    }

    @Operation(summary = "Повна мапа всіх доступних API endpoints")
    @GetMapping("/api-map")
    public ResponseEntity<CompleteApiMap> getCompleteApiMap() {
        return ResponseEntity.ok(new CompleteApiMap());
    }

    @Operation(summary = "Детальна інформація про конкретний етап")
    @GetMapping("/stages/{stageNumber}/info")
    public ResponseEntity<StageInfo> getStageInfo(@PathVariable int stageNumber) {
        return ResponseEntity.ok(new StageInfo(stageNumber));
    }

    @Operation(summary = "Статуси готовності всіх етапів")
    @GetMapping("/stages/status")
    public ResponseEntity<StagesStatus> getStagesStatus() {
        return ResponseEntity.ok(new StagesStatus());
    }

    @Operation(summary = "Документація по методах конкретного етапу")
    @GetMapping("/stages/{stageNumber}/methods")
    public ResponseEntity<StageMethods> getStageMethods(@PathVariable int stageNumber) {
        var methods = stageMethodsProvider.getMethodsForStage(stageNumber);
        return ResponseEntity.ok(new StageMethods(stageNumber, methods));
    }

    @Operation(summary = "Флоу-карта Order Wizard для фронтенду")
    @GetMapping("/workflow")
    public ResponseEntity<WorkflowMap> getWorkflow() {
        return ResponseEntity.ok(new WorkflowMap());
    }

    @Operation(summary = "Повна інформація про всі адаптери")
    @GetMapping("/adapters")
    public ResponseEntity<AdaptersInfo> getAdaptersInfo() {
        return ResponseEntity.ok(new AdaptersInfo());
    }

    @Operation(summary = "Детальний статус конкретного етапу")
    @GetMapping("/stages/{stageNumber}/status")
    public ResponseEntity<AdapterStatusUtil.StageStatus> getStageStatus(@PathVariable int stageNumber) {
        Object[] adapters = getAllAdaptersArray();
        var stageStatus = adapterStatusUtil.getStageStatus(stageNumber, adapters);
        return ResponseEntity.ok(stageStatus);
    }

    @Operation(summary = "Загальна статистика системи")
    @GetMapping("/stats")
    public ResponseEntity<SystemStats> getSystemStats() {
        boolean allReady = areAllAdaptersReady();
        int readyCount = countReadyAdapters();

        return ResponseEntity.ok(new SystemStats(allReady, readyCount, AdapterStatusUtil.TOTAL_ADAPTERS));
    }

    // =================== ПРИВАТНІ МЕТОДИ ===================

    /**
     * Створює масив всіх адаптерів для передачі в утиліти
     */
    private Object[] getAllAdaptersArray() {
        return new Object[]{
            orderWizardAdapter,           // 0
            clientSearchAdapter,          // 1
            newClientFormAdapter,         // 2
            basicOrderInfoAdapter,        // 3
            stage2Adapter,                // 4
            itemBasicInfoAdapter,         // 5
            itemCharacteristicsAdapter,   // 6
            stainsDefectsAdapter,         // 7
            priceDiscountAdapter,         // 8
            photoDocumentationAdapter,    // 9
            stage3Adapter,                // 10
            stage4Adapter                 // 11
        };
    }

    /**
     * Перевіряє чи всі адаптери готові до роботи
     */
    private boolean areAllAdaptersReady() {
        return adapterStatusUtil.areAllAdaptersReady(
            orderWizardAdapter, clientSearchAdapter, newClientFormAdapter, basicOrderInfoAdapter,
            stage2Adapter, itemBasicInfoAdapter, itemCharacteristicsAdapter, stainsDefectsAdapter,
            priceDiscountAdapter, photoDocumentationAdapter, stage3Adapter, stage4Adapter
        );
    }

    /**
     * Підраховує загальну кількість готових адаптерів
     */
    private int countReadyAdapters() {
        return adapterStatusUtil.countReadyAdapters(
            orderWizardAdapter, clientSearchAdapter, newClientFormAdapter, basicOrderInfoAdapter,
            stage2Adapter, itemBasicInfoAdapter, itemCharacteristicsAdapter, stainsDefectsAdapter,
            priceDiscountAdapter, photoDocumentationAdapter, stage3Adapter, stage4Adapter
        );
    }

}
