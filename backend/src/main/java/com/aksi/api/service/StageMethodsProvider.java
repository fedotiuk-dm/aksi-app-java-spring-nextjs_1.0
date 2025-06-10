package com.aksi.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

/**
 * Сервіс для надання інформації про методи різних етапів Order Wizard.
 *
 * Винесений в окремий клас згідно з принципом Single Responsibility.
 * Легко тестується та підтримується.
 */
@Service
public class StageMethodsProvider {

    /**
     * Отримує методи для конкретного етапу
     *
     * @param stageNumber номер етапу (0 - основний адаптер, 1-4 - етапи)
     * @return список методів
     */
    public List<MethodInfo> getMethodsForStage(int stageNumber) {
        return switch (stageNumber) {
            case 0 -> List.of( // Основний адаптер
                new MethodInfo("POST", "/order-wizard/initialize", "Ініціалізація Order Wizard"),
                new MethodInfo("GET", "/order-wizard/{sessionId}/status", "Статус сесії"),
                new MethodInfo("POST", "/order-wizard/{sessionId}/transition", "Перехід між етапами")
            );
            case 1 -> getStage1Methods();
            case 2 -> getStage2Methods();
            case 3 -> getStage3Methods();
            case 4 -> getStage4Methods();
            default -> List.of();
        };
    }

    private List<MethodInfo> getStage1Methods() {
        return List.of(
            new MethodInfo("POST", "/order-wizard/stage1/client-search/initialize", "Початок пошуку клієнта"),
            new MethodInfo("POST", "/order-wizard/stage1/client-search/{sessionId}/search", "Пошук клієнтів"),
            new MethodInfo("POST", "/order-wizard/stage1/new-client-form/initialize", "Форма нового клієнта"),
            new MethodInfo("POST", "/order-wizard/stage1/basic-order-info/initialize", "Базова інформація")
        );
    }

    private List<MethodInfo> getStage2Methods() {
        return List.of(
            new MethodInfo("POST", "/order-wizard/stage2/initialize", "Початок менеджера предметів"),
            new MethodInfo("POST", "/order-wizard/stage2/substep1/initialize", "Основна інформація предмета"),
            new MethodInfo("POST", "/order-wizard/stage2/substep2/initialize", "Характеристики предмета"),
            new MethodInfo("POST", "/order-wizard/stage2/substep3/initialize", "Плями та дефекти"),
            new MethodInfo("POST", "/order-wizard/stage2/substep4/initialize", "Ціна та знижки"),
            new MethodInfo("POST", "/order-wizard/stage2/substep5/initialize", "Фотодокументація")
        );
    }

    private List<MethodInfo> getStage3Methods() {
        return List.of(
            new MethodInfo("POST", "/order-wizard/stage3/initialize", "Параметри замовлення"),
            new MethodInfo("PUT", "/order-wizard/stage3/{sessionId}/execution-date", "Дата виконання"),
            new MethodInfo("PUT", "/order-wizard/stage3/{sessionId}/discount", "Застосування знижки"),
            new MethodInfo("PUT", "/order-wizard/stage3/{sessionId}/payment", "Спосіб оплати")
        );
    }

    private List<MethodInfo> getStage4Methods() {
        return List.of(
            new MethodInfo("POST", "/order-wizard/stage4/initialize", "Підтвердження замовлення"),
            new MethodInfo("GET", "/order-wizard/stage4/{sessionId}/review", "Перегляд замовлення"),
            new MethodInfo("POST", "/order-wizard/stage4/{sessionId}/confirm", "Підтвердження"),
            new MethodInfo("POST", "/order-wizard/stage4/{sessionId}/generate-receipt", "Генерація квитанції")
        );
    }

    /**
     * Інформація про HTTP метод endpoints
     */
    public static class MethodInfo {
        public final String httpMethod;
        public final String endpoint;
        public final String description;

        public MethodInfo(String httpMethod, String endpoint, String description) {
            this.httpMethod = httpMethod;
            this.endpoint = endpoint;
            this.description = description;
        }
    }

    /**
     * DTO для відповіді з методами етапу
     */
    public static class StageMethods {
        public final int stageNumber;
        public final List<MethodInfo> methods;

        public StageMethods(int stageNumber, List<MethodInfo> methods) {
            this.stageNumber = stageNumber;
            this.methods = methods;
        }
    }
}
