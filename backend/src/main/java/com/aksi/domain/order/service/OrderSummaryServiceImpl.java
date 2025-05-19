package com.aksi.domain.order.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.branch.mapper.BranchLocationMapper;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.order.dto.OrderDetailedSummaryResponse;
import com.aksi.domain.order.dto.OrderItemDetailedDTO;
import com.aksi.domain.order.dto.OrderItemPhotoDTO;
import com.aksi.domain.order.dto.PriceModifierDTO;
import com.aksi.domain.order.entity.OrderEntity;
import com.aksi.domain.order.entity.OrderItemEntity;
import com.aksi.domain.order.entity.OrderItemPhotoEntity;
import com.aksi.domain.order.entity.OrderItemPriceModifierEntity;
import com.aksi.domain.order.mapper.OrderItemPhotoMapper;
import com.aksi.domain.order.mapper.OrderItemPriceModifierMapper;
import com.aksi.domain.order.model.ExpediteType;
import com.aksi.domain.order.model.ModifierType;
import com.aksi.domain.order.repository.OrderItemPhotoRepository;
import com.aksi.domain.order.repository.OrderRepository;
import com.aksi.domain.order.repository.PriceModifierRepository;
import com.aksi.domain.pricing.constants.PriceCalculationConstants;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для отримання детального підсумку замовлення.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderSummaryServiceImpl implements OrderSummaryService {

    private final OrderRepository orderRepository;
    private final OrderItemPhotoRepository orderItemPhotoRepository;
    private final PriceModifierRepository priceModifierRepository;
    private final ClientMapper clientMapper;
    private final BranchLocationMapper branchLocationMapper;
    private final OrderItemPhotoMapper orderItemPhotoMapper;
    private final OrderItemPriceModifierMapper priceModifierMapper;

    /**
     * {@inheritDoc}.
     */
    @Override
    @Transactional(readOnly = true)
    public OrderDetailedSummaryResponse getOrderDetailedSummary(UUID orderId) {
        log.debug("Отримання детального підсумку замовлення з ID: {}", orderId);

        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Замовлення", "id", orderId.toString()));

        List<OrderItemDetailedDTO> detailedItems = mapOrderItems(order.getItems());

        // Розрахунок суми надбавки за терміновість
        ExpediteType expediteType = order.getExpediteType();
        BigDecimal expediteSurchargeAmount = PriceCalculationConstants.calculatePercentage(
                order.getTotalAmount(), expediteType.getSurchargePercentage());

        // Округлення до 2 знаків після коми
        expediteSurchargeAmount = expediteSurchargeAmount.setScale(
                PriceCalculationConstants.SCALE, PriceCalculationConstants.ROUNDING_MODE);

        // Створення DTO відповіді
        return OrderDetailedSummaryResponse.builder()
                .id(order.getId())
                .receiptNumber(order.getReceiptNumber())
                .tagNumber(order.getTagNumber())
                .client(clientMapper.toClientResponse(order.getClient()))
                .branchLocation(branchLocationMapper.toDto(order.getBranchLocation()))
                .items(detailedItems)
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .expediteSurchargeAmount(expediteSurchargeAmount)
                .finalAmount(order.getFinalAmount())
                .prepaymentAmount(order.getPrepaymentAmount())
                .balanceAmount(order.getBalanceAmount())
                .expediteType(order.getExpediteType())
                .expectedCompletionDate(order.getExpectedCompletionDate())
                .createdDate(order.getCreatedDate())
                .customerNotes(order.getCustomerNotes())
                .discountType(order.getDiscountType().name())
                .discountPercentage(order.getDiscountPercentage())
                .build();
    }

    /**
     * Перетворює список сутностей елементів замовлення у список детальних DTO елементів.
     *
     * @param items список сутностей елементів замовлення
     * @return список детальних DTO елементів
     */
    private List<OrderItemDetailedDTO> mapOrderItems(List<OrderItemEntity> items) {
        List<OrderItemDetailedDTO> result = new ArrayList<>();

        for (OrderItemEntity item : items) {
            // Отримання фотографій предмета
            List<OrderItemPhotoEntity> photos = orderItemPhotoRepository.findByOrderItemId(item.getId());
            List<OrderItemPhotoDTO> photoDTOs = photos.stream()
                    .map(orderItemPhotoMapper::toDto)
                    .collect(Collectors.toList());

            // Отримання модифікаторів ціни з бази даних
            List<OrderItemPriceModifierEntity> modifierEntities = priceModifierRepository.findByOrderItemId(item.getId());
            List<PriceModifierDTO> priceModifiers;

            // Якщо в базі даних є модифікатори, використовуємо їх, інакше створюємо модельні
            if (!modifierEntities.isEmpty()) {
                priceModifiers = priceModifierMapper.toDtoList(modifierEntities);
            } else {
                // Для зворотної сумісності зі старими даними, створюємо модельні модифікатори
                priceModifiers = createSamplePriceModifiers(item);

                // Записуємо їх в базу даних для майбутнього використання
                if (!priceModifiers.isEmpty()) {
                    saveModifiersToDatabase(item, priceModifiers);
                }
            }

            List<String> stains = parseListField(item.getStains());
            List<String> defects = parseListField(item.getDefectsAndRisks());

            OrderItemDetailedDTO detailedItem = OrderItemDetailedDTO.builder()
                    .id(item.getId())
                    .name(item.getName())
                    .category(item.getCategory())
                    .quantity(new BigDecimal(item.getQuantity()))
                    .unitOfMeasure(item.getUnitOfMeasure())
                    .material(item.getMaterial())
                    .color(item.getColor())
                    .filler(item.getFillerType())
                    .fillerClumped(Boolean.TRUE.equals(item.getFillerCompressed()))
                    .wearPercentage(parseWearDegree(item.getWearDegree()))
                    .stains(stains)
                    .defects(defects)
                    .defectNotes(item.getDefectsNotes())
                    .basePrice(item.getUnitPrice())
                    .priceModifiers(priceModifiers)
                    .finalPrice(item.getTotalPrice())
                    .photos(photoDTOs)
                    .build();

            result.add(detailedItem);
        }

        return result;
    }

    /**
     * Зберігає модифікатори ціни в базу даних для майбутнього використання.
     *
     * @param item предмет замовлення
     * @param modifiers модифікатори ціни
     */
    private void saveModifiersToDatabase(OrderItemEntity item, List<PriceModifierDTO> modifiers) {
        List<OrderItemPriceModifierEntity> entities = priceModifierMapper.toEntityList(modifiers);

        // Встановлюємо відношення до предмета замовлення
        entities.forEach(entity -> entity.setOrderItem(item));

        priceModifierRepository.saveAll(entities);
    }

    /**
     * Створює приклад модифікаторів ціни для предмета замовлення.
     * У реальній системі ці дані повинні зберігатися в БД або розраховуватися на основі
     * додаткових характеристик товару.
     *
     * @param item предмет замовлення
     * @return список модифікаторів ціни
     */
    private List<PriceModifierDTO> createSamplePriceModifiers(OrderItemEntity item) {
        List<PriceModifierDTO> modifiers = new ArrayList<>();
        BigDecimal basePrice = item.getUnitPrice();

        // Модифікатори в залежності від матеріалу
        if ("Шовк".equals(item.getMaterial())) {
            BigDecimal percentage = new BigDecimal("50");
            BigDecimal amount = PriceCalculationConstants.calculatePercentage(basePrice, percentage);

            modifiers.add(PriceModifierDTO.builder()
                    .name("Натуральний шовк")
                    .description("Надбавка за особливий матеріал")
                    .type(ModifierType.PERCENTAGE)
                    .value(percentage)
                    .amount(amount)
                    .build());
        } else if ("Натуральна шкіра".equals(item.getMaterial())) {
            BigDecimal percentage = new BigDecimal("30");
            BigDecimal amount = PriceCalculationConstants.calculatePercentage(basePrice, percentage);

            modifiers.add(PriceModifierDTO.builder()
                    .name("Натуральна шкіра")
                    .description("Надбавка за особливий матеріал")
                    .type(ModifierType.PERCENTAGE)
                    .value(percentage)
                    .amount(amount)
                    .build());
        }

        // Модифікатори для дитячих речей
        if (item.getDescription() != null && item.getDescription().toLowerCase().contains("дитяч")) {
            BigDecimal percentage = PriceCalculationConstants.KIDS_ITEMS_PERCENTAGE;
            BigDecimal amount = PriceCalculationConstants.calculatePercentage(basePrice, percentage);

            modifiers.add(PriceModifierDTO.builder()
                    .name("Дитячі речі")
                    .description("Знижка на дитячі речі (до 30 розміру)")
                    .type(ModifierType.PERCENTAGE)
                    .value(percentage)
                    .amount(amount)
                    .build());
        }

        // Модифікатори для ручної чистки
        if (item.getSpecialInstructions() != null &&
                item.getSpecialInstructions().toLowerCase().contains("ручн")) {
            BigDecimal percentage = PriceCalculationConstants.MANUAL_CLEANING_PERCENTAGE;
            BigDecimal amount = PriceCalculationConstants.calculatePercentage(basePrice, percentage);

            modifiers.add(PriceModifierDTO.builder()
                    .name("Ручна чистка")
                    .description("Надбавка за ручну чистку")
                    .type(ModifierType.PERCENTAGE)
                    .value(percentage)
                    .amount(amount)
                    .build());
        }

        return modifiers;
    }

    /**
     * Перетворює рядок зі ступенем зносу у відповідний відсоток.
     *
     * @param wearDegree рядок зі ступенем зносу
     * @return відсоток зносу
     */
    private Integer parseWearDegree(String wearDegree) {
        if (wearDegree == null || wearDegree.isBlank()) {
            return null;
        }

        // Очищаємо від нечислових символів
        String cleanValue = wearDegree.replaceAll("[^0-9]", "");

        if (cleanValue.isBlank()) {
            return null;
        }

        return cleanValue.matches("\\d+") ? Integer.valueOf(cleanValue) : null;
    }

    /**
     * Перетворює рядок зі списком значень (через кому) у список рядків.
     *
     * @param listField рядок зі списком значень
     * @return список рядків
     */
    private List<String> parseListField(String listField) {
        if (listField == null || listField.isBlank()) {
            return new ArrayList<>();
        }

        // Розділяємо за комою та прибираємо зайві пробіли
        return Arrays.stream(listField.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
