package com.aksi.api.dto;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * DTO класи для OrderWizardMainController API
 *
 * Винесені в окремий файл для покращення читабельності та підтримки.
 * Дотримуємось принципу Single Responsibility - кожен клас має одну відповідальність.
 */
public class OrderWizardApiDto {

    /**
     * Статус здоров'я системи
     */
    public static class HealthStatus {
        public final String status = "🎯 Order Wizard API повністю готовий";
        public final String version = "1.0.0";
        public final boolean allStagesReady = true;
        public final int totalStages = 4;
        public final int totalSubsteps = 5; // у Stage2
        public final int totalAdapters = 12; // всі адаптери
        public final String architecture = "DDD + Spring State Machine";
    }

    /**
     * Повна мапа API endpoints
     */
    public static class CompleteApiMap {
        public final MainApi main = new MainApi();
        public final Stage1Api stage1 = new Stage1Api();
        public final Stage2Api stage2 = new Stage2Api();
        public final Stage3Api stage3 = new Stage3Api();
        public final Stage4Api stage4 = new Stage4Api();
        public final String baseUrl = "/order-wizard";
        public final String documentation = "Всі endpoints готові для використання";

        public static class MainApi {
            public final String description = "Основний адаптер Order Wizard";
            public final String endpoint = "/order-wizard";
            public final String adapterClass = "OrderWizardAdapter";
        }

        public static class Stage1Api {
            public final String description = "Клієнт та базова інформація замовлення";
            public final String clientSearch = "/order-wizard/stage1/client-search (ClientSearchAdapter)";
            public final String newClientForm = "/order-wizard/stage1/new-client-form (NewClientFormAdapter)";
            public final String basicOrderInfo = "/order-wizard/stage1/basic-order-info (BasicOrderInfoAdapter)";
            public final List<String> operations = List.of(
                "initialize", "search", "select", "create", "validate", "complete"
            );
        }

        public static class Stage2Api {
            public final String description = "Менеджер предметів (5 підетапів)";
            public final String main = "/order-wizard/stage2 (Stage2StateMachineAdapter)";
            public final Substeps substeps = new Substeps();
            public final List<String> operations = List.of(
                "initialize", "addItem", "editItem", "deleteItem", "calculatePrice", "complete"
            );

            public static class Substeps {
                public final String substep1 = "/order-wizard/stage2/substep1 (ItemBasicInfoAdapter)";
                public final String substep2 = "/order-wizard/stage2/substep2 (ItemCharacteristicsStateMachineAdapter)";
                public final String substep3 = "/order-wizard/stage2/substep3 (StainsDefectsAdapter)";
                public final String substep4 = "/order-wizard/stage2/substep4 (PriceDiscountAdapter)";
                public final String substep5 = "/order-wizard/stage2/substep5 (PhotoDocumentationAdapter)";
            }
        }

        public static class Stage3Api {
            public final String description = "Загальні параметри замовлення";
            public final String main = "/order-wizard/stage3 (Stage3StateMachineAdapter)";
            public final List<String> operations = List.of(
                "initialize", "setExecutionDate", "applyDiscount", "setPayment", "complete"
            );
        }

        public static class Stage4Api {
            public final String description = "Підтвердження та завершення";
            public final String main = "/order-wizard/stage4 (Stage4StateMachineAdapter)";
            public final List<String> operations = List.of(
                "initialize", "review", "confirm", "generateReceipt", "complete"
            );
        }
    }

    /**
     * Інформація про конкретний етап
     */
    public static class StageInfo {
        public final int stageNumber;
        public final String title;
        public final String description;
        public final List<String> substeps;
        public final String adapterClass;
        public final boolean isReady;

        public StageInfo(int stageNumber) {
            this.stageNumber = stageNumber;
            var stageData = switch (stageNumber) {
                case 1 -> new StageData(
                    "Клієнт та базова інформація",
                    "Пошук/створення клієнта, базова інформація замовлення",
                    List.of("ClientSearch", "NewClientForm", "BasicOrderInfo"),
                    "3 окремі адаптери",
                    true
                );
                case 2 -> new StageData(
                    "Менеджер предметів",
                    "Циклічне додавання предметів з 5 підетапами",
                    List.of("ItemBasicInfo", "ItemCharacteristics", "StainsDefects", "PriceDiscount", "PhotoDocumentation"),
                    "Stage2StateMachineAdapter + 5 substep адаптерів",
                    true
                );
                case 3 -> new StageData(
                    "Загальні параметри замовлення",
                    "Дата виконання, знижки, оплата",
                    List.of("ExecutionParams", "Discounts", "Payment", "AdditionalInfo"),
                    "Stage3StateMachineAdapter",
                    true
                );
                case 4 -> new StageData(
                    "Підтвердження та завершення",
                    "Перегляд, підтвердження, генерація квитанції",
                    List.of("Review", "LegalAspects", "ReceiptGeneration"),
                    "Stage4StateMachineAdapter",
                    true
                );
                default -> new StageData("Невідомий етап", "Етап не знайдено", List.of(), "None", false);
            };

            this.title = stageData.title;
            this.description = stageData.description;
            this.substeps = stageData.substeps;
            this.adapterClass = stageData.adapterClass;
            this.isReady = stageData.isReady;
        }

        private record StageData(String title, String description, List<String> substeps, String adapterClass, boolean isReady) {}
    }

    /**
     * Статуси всіх етапів
     */
    public static class StagesStatus {
        public final Map<String, StageStatusInfo> stages = Map.of(
            "main", new StageStatusInfo("✅ Готовий", 1, "OrderWizardAdapter - основний контролер"),
            "stage1", new StageStatusInfo("✅ Готовий", 3, "ClientSearch, NewClientForm, BasicOrderInfo"),
            "stage2", new StageStatusInfo("✅ Готовий", 6, "Головний + 5 підетапів - всі адаптери готові"),
            "stage3", new StageStatusInfo("✅ Готовий", 1, "Параметри виконання, знижки, оплата"),
            "stage4", new StageStatusInfo("✅ Готовий", 1, "Підтвердження, квитанція")
        );
        public final String overall = "✅ Всі етапи готові до роботи";
        public final int totalReadyStages = 4;
        public final int totalStages = 4;
        public final int totalAdapters = 12;

        public static class StageStatusInfo {
            public final String status;
            public final int adaptersCount;
            public final String description;

            public StageStatusInfo(String status, int adaptersCount, String description) {
                this.status = status;
                this.adaptersCount = adaptersCount;
                this.description = description;
            }
        }
    }

    /**
     * Флоу-карта для фронтенду
     */
    public static class WorkflowMap {
        public final String description = "Послідовність роботи з Order Wizard";
        public final List<WorkflowStep> steps = List.of(
            new WorkflowStep(1, "Клієнт", "Пошук або створення клієнта + базова інформація", true),
            new WorkflowStep(2, "Предмети", "Додавання предметів через 5 підетапів (циклічно)", true),
            new WorkflowStep(3, "Параметри", "Дата, знижки, оплата, додаткова інформація", true),
            new WorkflowStep(4, "Завершення", "Підтвердження, підпис, генерація квитанції", true)
        );
        public final String note = "Етап 2 може повторюватися для додавання кількох предметів";

        public static class WorkflowStep {
            public final int step;
            public final String title;
            public final String description;
            public final boolean isReady;

            public WorkflowStep(int step, String title, String description, boolean isReady) {
                this.step = step;
                this.title = title;
                this.description = description;
                this.isReady = isReady;
            }
        }
    }

    /**
     * Інформація про всі адаптери
     */
    public static class AdaptersInfo {
        public final String title = "🔧 Order Wizard Adapters Information";
        public final Map<String, String> adapters;
        public final String description = "Всі адаптери Order Wizard з описом функціональності";

        public AdaptersInfo() {
            Map<String, String> adapterMap = new LinkedHashMap<>();
            adapterMap.put("OrderWizardAdapter", "Головний адаптер Order Wizard");
            adapterMap.put("ClientSearchAdapter", "Stage1: Пошук клієнтів");
            adapterMap.put("NewClientFormAdapter", "Stage1: Форма нового клієнта");
            adapterMap.put("BasicOrderInfoAdapter", "Stage1: Базова інформація замовлення");
            adapterMap.put("Stage2StateMachineAdapter", "Stage2: Управління предметами");
            adapterMap.put("ItemBasicInfoAdapter", "Stage2.1: Основна інформація предмета");
            adapterMap.put("ItemCharacteristicsAdapter", "Stage2.2: Характеристики предмета");
            adapterMap.put("StainsDefectsAdapter", "Stage2.3: Забруднення та дефекти");
            adapterMap.put("PriceDiscountAdapter", "Stage2.4: Ціни та знижки");
            adapterMap.put("PhotoDocumentationAdapter", "Stage2.5: Фотодокументація");
            adapterMap.put("Stage3StateMachineAdapter", "Stage3: Загальні параметри");
            adapterMap.put("Stage4StateMachineAdapter", "Stage4: Підтвердження та квитанція");
            this.adapters = Collections.unmodifiableMap(adapterMap);
        }
    }

    /**
     * Загальна статистика системи
     */
    public static class SystemStats {
        public final boolean allAdaptersReady;
        public final int readyAdaptersCount;
        public final int totalAdapters;
        public final double readinessPercentage;
        public final String status;
        public final String timestamp;

        public SystemStats(boolean allReady, int readyCount, int totalAdapters) {
            this.allAdaptersReady = allReady;
            this.readyAdaptersCount = readyCount;
            this.totalAdapters = totalAdapters;
            this.readinessPercentage = (double) readyCount / totalAdapters * 100;
            this.status = allReady ? "🎯 Система повністю готова" :
                         readyCount > 8 ? "⚠️ Система частково готова" : "❌ Система не готова";
            this.timestamp = java.time.LocalDateTime.now().toString();
        }
    }
}
