package com.aksi.domain.order.statemachine.stage2.substep3.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.aksi.domain.order.dto.OrderItemAddRequest;
import com.aksi.domain.order.service.OrderService;

/**
 * Operations Service для підетапу 2.3 "Забруднення, дефекти та ризики".
 * Тонка обгортка для роботи з доменними сервісами (згідно архітектурних правил).
 */
@Service
public class StainsDefectsOperationsService {

    private final OrderService orderService;

    public StainsDefectsOperationsService(final OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Отримує доступні типи плям.
     *
     * @return список типів плям
     */
    public List<String> getAvailableStainTypes() {
        return List.of(
            "Жир",
            "Кров",
            "Білок",
            "Вино",
            "Кава",
            "Трава",
            "Чорнило",
            "Косметика",
            "Інше"
        );
    }

    /**
     * Отримує доступні типи дефектів та ризиків.
     *
     * @return список типів дефектів
     */
    public List<String> getAvailableDefectTypes() {
        return List.of(
            "Потертості",
            "Порване",
            "Відсутність фурнітури",
            "Пошкодження фурнітури",
            "Ризики зміни кольору",
            "Ризики деформації",
            "Без гарантій"
        );
    }

        /**
     * Зберігає інформацію про плями для предмета.
     *
     * @param itemRequest запит з інформацією про предмет
     * @param stains плями
     * @param otherStains інші плями (текст)
     * @return оновлений запит
     */
    public OrderItemAddRequest saveStains(final OrderItemAddRequest itemRequest,
                                        final String stains,
                                        final String otherStains) {
        // Створюємо новий builder з існуючих даних
        final OrderItemAddRequest.OrderItemAddRequestBuilder builder = OrderItemAddRequest.builder()
            .id(itemRequest.getId())
            .orderId(itemRequest.getOrderId())
            .description(itemRequest.getDescription())
            .quantity(itemRequest.getQuantity())
            .unitPrice(itemRequest.getUnitPrice())
            .totalPrice(itemRequest.getTotalPrice())
            .category(itemRequest.getCategory())
            .color(itemRequest.getColor())
            .material(itemRequest.getMaterial())
            .unitOfMeasure(itemRequest.getUnitOfMeasure())
            .defects(itemRequest.getDefects())
            .specialInstructions(itemRequest.getSpecialInstructions())
            .fillerType(itemRequest.getFillerType())
            .fillerCompressed(itemRequest.getFillerCompressed())
            .wearDegree(itemRequest.getWearDegree())
            .defectsAndRisks(itemRequest.getDefectsAndRisks())
            .noGuaranteeReason(itemRequest.getNoGuaranteeReason())
            .defectsNotes(itemRequest.getDefectsNotes());

        if (stains != null) {
            builder.stains(stains);
        } else {
            builder.stains(itemRequest.getStains());
        }

        if (otherStains != null) {
            builder.otherStains(otherStains);
        } else {
            builder.otherStains(itemRequest.getOtherStains());
        }

        return builder.build();
    }

    /**
     * Зберігає інформацію про дефекти та ризики для предмета.
     *
     * @param itemRequest запит з інформацією про предмет
     * @param defectsAndRisks дефекти та ризики
     * @param noGuaranteeReason причина відмови від гарантій
     * @return оновлений запит
     */
    public OrderItemAddRequest saveDefectsAndRisks(final OrderItemAddRequest itemRequest,
                                                 final String defectsAndRisks,
                                                 final String noGuaranteeReason) {
        // Створюємо новий builder з існуючих даних
        final OrderItemAddRequest.OrderItemAddRequestBuilder builder = OrderItemAddRequest.builder()
            .id(itemRequest.getId())
            .orderId(itemRequest.getOrderId())
            .description(itemRequest.getDescription())
            .quantity(itemRequest.getQuantity())
            .unitPrice(itemRequest.getUnitPrice())
            .totalPrice(itemRequest.getTotalPrice())
            .category(itemRequest.getCategory())
            .color(itemRequest.getColor())
            .material(itemRequest.getMaterial())
            .unitOfMeasure(itemRequest.getUnitOfMeasure())
            .defects(itemRequest.getDefects())
            .specialInstructions(itemRequest.getSpecialInstructions())
            .fillerType(itemRequest.getFillerType())
            .fillerCompressed(itemRequest.getFillerCompressed())
            .wearDegree(itemRequest.getWearDegree())
            .stains(itemRequest.getStains())
            .otherStains(itemRequest.getOtherStains())
            .defectsNotes(itemRequest.getDefectsNotes());

        if (defectsAndRisks != null) {
            builder.defectsAndRisks(defectsAndRisks);
        } else {
            builder.defectsAndRisks(itemRequest.getDefectsAndRisks());
        }

        if (noGuaranteeReason != null) {
            builder.noGuaranteeReason(noGuaranteeReason);
        } else {
            builder.noGuaranteeReason(itemRequest.getNoGuaranteeReason());
        }

        return builder.build();
    }

    /**
     * Зберігає загальні примітки про дефекти.
     *
     * @param itemRequest запит з інформацією про предмет
     * @param defectNotes примітки про дефекти
     * @return оновлений запит
     */
    public OrderItemAddRequest saveDefectNotes(final OrderItemAddRequest itemRequest,
                                             final String defectNotes) {
        // Створюємо новий builder з існуючих даних
        final OrderItemAddRequest.OrderItemAddRequestBuilder builder = OrderItemAddRequest.builder()
            .id(itemRequest.getId())
            .orderId(itemRequest.getOrderId())
            .description(itemRequest.getDescription())
            .quantity(itemRequest.getQuantity())
            .unitPrice(itemRequest.getUnitPrice())
            .totalPrice(itemRequest.getTotalPrice())
            .category(itemRequest.getCategory())
            .color(itemRequest.getColor())
            .material(itemRequest.getMaterial())
            .unitOfMeasure(itemRequest.getUnitOfMeasure())
            .defects(itemRequest.getDefects())
            .specialInstructions(itemRequest.getSpecialInstructions())
            .fillerType(itemRequest.getFillerType())
            .fillerCompressed(itemRequest.getFillerCompressed())
            .wearDegree(itemRequest.getWearDegree())
            .stains(itemRequest.getStains())
            .otherStains(itemRequest.getOtherStains())
            .defectsAndRisks(itemRequest.getDefectsAndRisks())
            .noGuaranteeReason(itemRequest.getNoGuaranteeReason());

        if (defectNotes != null) {
            builder.defectsNotes(defectNotes);
        } else {
            builder.defectsNotes(itemRequest.getDefectsNotes());
        }

        return builder.build();
    }

    /**
     * Перевіряє, чи існує замовлення для подальших операцій.
     *
     * @param orderId ідентифікатор замовлення
     * @return true, якщо замовлення існує
     */
    public boolean validateOrderExists(final UUID orderId) {
        try {
            return orderService.getOrderById(orderId) != null;
        } catch (Exception e) {
            return false;
        }
    }
}
