package com.aksi.api;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
@Tag(name = "Order Wizard - Main API", description = "Головний фасад з повною мапою API для всіх етапів Order Wizard")
public class OrderWizardMainController {

    // Додаємо логер
    private static final Logger logger = LoggerFactory.getLogger(OrderWizardMainController.class);

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

        logger.info("OrderWizardMainController initialized with all adapters");
    }

    // =================== ІНФОРМАЦІЙНІ ENDPOINTS ===================

    @Operation(
        summary = "Перевірка готовності Order Wizard API",
        operationId = "orderWizardHealth",
        tags = {"Order Wizard - Main API", "System Health"}
    )
    @GetMapping("/health")
    public ResponseEntity<HealthStatus> health() {
        logger.debug("Health check requested");
        return ResponseEntity.ok(new HealthStatus());
    }

    @Operation(
        summary = "Повна мапа всіх доступних API endpoints",
        operationId = "orderWizardGetCompleteApiMap",
        tags = {"Order Wizard - Main API", "API Documentation"}
    )
    @GetMapping("/api-map")
    public ResponseEntity<CompleteApiMap> getCompleteApiMap() {
        return ResponseEntity.ok(new CompleteApiMap());
    }

    @Operation(
        summary = "Детальна інформація про конкретний етап",
        operationId = "orderWizardGetStageInfo",
        tags = {"Order Wizard - Main API", "Stage Information"}
    )
    @GetMapping("/stages/{stageNumber}/info")
    public ResponseEntity<StageInfo> getStageInfo(@PathVariable int stageNumber) {
        return ResponseEntity.ok(new StageInfo(stageNumber));
    }

    @Operation(
        summary = "Статуси готовності всіх етапів",
        operationId = "orderWizardGetStagesStatus",
        tags = {"Order Wizard - Main API", "System Status"}
    )
    @GetMapping("/stages/status")
    public ResponseEntity<StagesStatus> getStagesStatus() {
        return ResponseEntity.ok(new StagesStatus());
    }

    @Operation(
        summary = "Документація по методах конкретного етапу",
        operationId = "orderWizardGetStageMethods",
        tags = {"Order Wizard - Main API", "API Documentation"}
    )
    @GetMapping("/stages/{stageNumber}/methods")
    public ResponseEntity<StageMethods> getStageMethods(@PathVariable int stageNumber) {
        var methods = stageMethodsProvider.getMethodsForStage(stageNumber);
        return ResponseEntity.ok(new StageMethods(stageNumber, methods));
    }

    @Operation(
        summary = "Флоу-карта Order Wizard для фронтенду",
        operationId = "orderWizardGetWorkflow",
        tags = {"Order Wizard - Main API", "Workflow"}
    )
    @GetMapping("/workflow")
    public ResponseEntity<WorkflowMap> getWorkflow() {
        return ResponseEntity.ok(new WorkflowMap());
    }

    @Operation(
        summary = "Повна інформація про всі адаптери",
        operationId = "orderWizardGetAdaptersInfo",
        tags = {"Order Wizard - Main API", "System Information"}
    )
    @GetMapping("/adapters")
    public ResponseEntity<AdaptersInfo> getAdaptersInfo() {
        return ResponseEntity.ok(new AdaptersInfo());
    }

    @Operation(
        summary = "Детальний статус конкретного етапу",
        operationId = "orderWizardGetStageStatus",
        tags = {"Order Wizard - Main API", "Stage Status"}
    )
    @GetMapping("/stages/{stageNumber}/status")
    public ResponseEntity<AdapterStatusUtil.StageStatus> getStageStatus(@PathVariable int stageNumber) {
        Object[] adapters = getAllAdaptersArray();
        var stageStatus = adapterStatusUtil.getStageStatus(stageNumber, adapters);
        return ResponseEntity.ok(stageStatus);
    }

    @Operation(
        summary = "Загальна статистика системи",
        operationId = "orderWizardGetSystemStats",
        tags = {"Order Wizard - Main API", "System Statistics"}
    )
    @GetMapping("/stats")
    public ResponseEntity<SystemStats> getSystemStats() {
        boolean allReady = areAllAdaptersReady();
        int readyCount = countReadyAdapters();

        return ResponseEntity.ok(new SystemStats(allReady, readyCount, AdapterStatusUtil.TOTAL_ADAPTERS));
    }

    // =================== РОБОЧІ ENDPOINTS (ДЕЛЕГАЦІЯ ДО OrderWizardAdapter) ===================

    @Operation(
        summary = "Запускає новий Order Wizard",
        operationId = "orderWizardStart",
        tags = {"Order Wizard - Main API", "Workflow Operations"}
    )
    @PostMapping("/start")
    public ResponseEntity<com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO> startOrderWizard() {
        logger.info("🚀 Starting new Order Wizard session...");

        try {
            // Перевіряємо готовність адаптера
            if (orderWizardAdapter == null) {
                logger.error("❌ OrderWizardAdapter is null!");
                throw new IllegalStateException("OrderWizardAdapter not initialized");
            }

            logger.info("✅ OrderWizardAdapter is ready, calling startOrderWizard()...");

            ResponseEntity<com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO> response =
                orderWizardAdapter.startOrderWizard();

            if (response != null) {
                logger.info("✅ Response received: status={}, body={}",
                    response.getStatusCode(), response.getBody());

                var responseBody = response.getBody();
                if (responseBody != null) {
                    logger.info("📋 Response details: sessionId={}, state={}, success={}, message={}",
                        responseBody.getSessionId(),
                        responseBody.getCurrentState(),
                        responseBody.isSuccess(),
                        responseBody.getMessage());
                }
            } else {
                logger.error("❌ Response is null from OrderWizardAdapter!");
            }

            return response;

        } catch (RuntimeException e) {
            logger.error("💥 Exception in startOrderWizard: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Operation(
        summary = "Отримує поточний стан Order Wizard",
        operationId = "orderWizardGetCurrentState",
        tags = {"Order Wizard - Main API", "Session Management"}
    )
    @GetMapping("/session/{sessionId}/state")
    public ResponseEntity<com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO> getCurrentState(@PathVariable String sessionId) {
        return orderWizardAdapter.getCurrentState(sessionId);
    }

    @Operation(
        summary = "Отримує всі можливі переходи з поточного стану",
        operationId = "orderWizardGetAvailableTransitions",
        tags = {"Order Wizard - Main API", "Session Management"}
    )
    @GetMapping("/session/{sessionId}/available-transitions")
    public ResponseEntity<Map<String, Object>> getAvailableTransitions(@PathVariable String sessionId) {
        return orderWizardAdapter.getAvailableTransitions(sessionId);
    }

    @Operation(
        summary = "Перехід до наступного етапу з Stage1 до Stage2",
        operationId = "orderWizardCompleteStage1",
        tags = {"Order Wizard - Main API", "Stage Transitions"}
    )
    @PostMapping("/session/{sessionId}/complete-stage1")
    public ResponseEntity<com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO> completeStage1(@PathVariable String sessionId) {
        return orderWizardAdapter.completeStage1(sessionId);
    }

    @Operation(
        summary = "Перехід до Stage3 з Stage2",
        operationId = "orderWizardCompleteStage2",
        tags = {"Order Wizard - Main API", "Stage Transitions"}
    )
    @PostMapping("/session/{sessionId}/complete-stage2")
    public ResponseEntity<com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO> completeStage2(@PathVariable String sessionId) {
        return orderWizardAdapter.completeStage2(sessionId);
    }

    @Operation(
        summary = "Перехід до Stage4 з Stage3",
        operationId = "orderWizardCompleteStage3",
        tags = {"Order Wizard - Main API", "Stage Transitions"}
    )
    @PostMapping("/session/{sessionId}/complete-stage3")
    public ResponseEntity<com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO> completeStage3(@PathVariable String sessionId) {
        return orderWizardAdapter.completeStage3(sessionId);
    }

    @Operation(
        summary = "Завершення Order Wizard",
        operationId = "orderWizardCompleteOrder",
        tags = {"Order Wizard - Main API", "Order Completion"}
    )
    @PostMapping("/session/{sessionId}/complete-order")
    public ResponseEntity<com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO> completeOrder(@PathVariable String sessionId) {
        return orderWizardAdapter.completeOrder(sessionId);
    }

    @Operation(
        summary = "Скасування Order Wizard",
        operationId = "orderWizardCancelOrder",
        tags = {"Order Wizard - Main API", "Order Cancellation"}
    )
    @PostMapping("/session/{sessionId}/cancel")
    public ResponseEntity<com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO> cancelOrder(@PathVariable String sessionId) {
        return orderWizardAdapter.cancelOrder(sessionId);
    }

    @Operation(
        summary = "Повернення на попередній етап",
        operationId = "orderWizardGoBack",
        tags = {"Order Wizard - Main API", "Navigation"}
    )
    @PostMapping("/session/{sessionId}/go-back")
    public ResponseEntity<com.aksi.domain.order.statemachine.dto.OrderWizardResponseDTO> goBack(@PathVariable String sessionId) {
        return orderWizardAdapter.goBack(sessionId);
    }

    @Operation(
        summary = "Отримання детальної інформації про поточну сесію",
        operationId = "orderWizardGetSessionInfo",
        tags = {"Order Wizard - Main API", "Session Management"}
    )
    @GetMapping("/session/{sessionId}/info")
    public ResponseEntity<Map<String, Object>> getSessionInfo(@PathVariable String sessionId) {
        return orderWizardAdapter.getSessionInfo(sessionId);
    }

    @Operation(
        summary = "Очищення всіх активних сесій Order Wizard",
        operationId = "orderWizardClearAllSessions",
        tags = {"Order Wizard - Main API", "Session Management"}
    )
    @PostMapping("/clear-all-sessions")
    public ResponseEntity<Map<String, Object>> clearAllSessions() {
        logger.info("🧹 Clearing all Order Wizard sessions...");
        try {
            orderWizardAdapter.clearAllSessions();
            Map<String, Object> response = Map.of(
                "status", "success",
                "message", "All sessions cleared successfully",
                "timestamp", Long.valueOf(System.currentTimeMillis())
            );
            logger.info("✅ All sessions cleared successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Error clearing sessions: {}", e.getMessage(), e);
            Map<String, Object> response = Map.of(
                "status", "error",
                "message", "Failed to clear sessions: " + e.getMessage(),
                "timestamp", Long.valueOf(System.currentTimeMillis())
            );
            return ResponseEntity.status(500).body(response);
        }
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
