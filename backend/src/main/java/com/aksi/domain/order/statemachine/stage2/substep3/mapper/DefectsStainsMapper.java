package com.aksi.domain.order.statemachine.stage2.substep3.mapper;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.util.StringUtils;

import com.aksi.domain.order.dto.OrderItemDTO;
import com.aksi.domain.order.statemachine.stage2.substep3.dto.DefectsStainsDTO;

/**
 * MapStruct маппер для трансформації даних підетапу 2.3
 *
 * Відповідає за:
 * - Збірку DefectsStainsDTO з Map<String, Object> (дані візарда)
 * - Мапінг DefectsStainsDTO в OrderItemDTO поля
 * - Зворотню трансформацію для режиму редагування
 */
@Mapper(componentModel = "spring")
public interface DefectsStainsMapper {

    /**
     * Збирає DefectsStainsDTO з Map<String, Object> контексту візарда
     */
    @Mapping(target = "selectedStains", source = "wizardData", qualifiedByName = "extractSelectedStains")
    @Mapping(target = "selectedDefects", source = "wizardData", qualifiedByName = "extractSelectedDefects")
    @Mapping(target = "selectedRisks", source = "wizardData", qualifiedByName = "extractSelectedRisks")
    @Mapping(target = "customStain", source = "wizardData", qualifiedByName = "extractCustomStain")
    @Mapping(target = "defectNotes", source = "wizardData", qualifiedByName = "extractDefectNotes")
    @Mapping(target = "noWarranty", source = "wizardData", qualifiedByName = "extractNoWarranty")
    @Mapping(target = "noWarrantyReason", source = "wizardData", qualifiedByName = "extractNoWarrantyReason")
    @Mapping(target = "recommendedModifiers", ignore = true)
    @Mapping(target = "riskWarnings", ignore = true)
    @Mapping(target = "processingRecommendations", ignore = true)
    @Mapping(target = "isValid", ignore = true)
    @Mapping(target = "validationErrors", ignore = true)
    DefectsStainsDTO fromWizardData(Map<String, Object> wizardData);

    /**
     * Мапить DefectsStainsDTO в OrderItemDTO поля
     */
    @Mapping(target = "stains", source = "defectsStains", qualifiedByName = "buildStainsString")
    @Mapping(target = "otherStains", source = "customStain")
    @Mapping(target = "defects", source = "defectsStains", qualifiedByName = "buildDefectsString")
    @Mapping(target = "defectsAndRisks", source = "defectsStains", qualifiedByName = "buildDefectsAndRisks")
    @Mapping(target = "noGuaranteeReason", source = "noWarrantyReason")
    @Mapping(target = "defectsNotes", source = "defectNotes")
    @Mapping(target = "specialInstructions", source = "defectsStains", qualifiedByName = "buildSpecialInstructions")
    // Всі інші поля ігноруємо - вони будуть заповнені з інших підетапів
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderId", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "quantity", ignore = true)
    @Mapping(target = "unitPrice", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "color", ignore = true)
    @Mapping(target = "material", ignore = true)
    @Mapping(target = "unitOfMeasure", ignore = true)
    @Mapping(target = "fillerType", ignore = true)
    @Mapping(target = "fillerCompressed", ignore = true)
    @Mapping(target = "wearDegree", ignore = true)
    OrderItemDTO toOrderItemFields(DefectsStainsDTO defectsStains);

    /**
     * Зворотня трансформація: OrderItemDTO -> DefectsStainsDTO (для редагування)
     */
    @Mapping(target = "selectedStains", source = "orderItem", qualifiedByName = "parseStainsString")
    @Mapping(target = "selectedDefects", source = "orderItem", qualifiedByName = "parseDefectsString")
    @Mapping(target = "selectedRisks", source = "orderItem", qualifiedByName = "parseRisksString")
    @Mapping(target = "customStain", source = "otherStains")
    @Mapping(target = "defectNotes", source = "defectsNotes")
    @Mapping(target = "noWarranty", source = "orderItem", qualifiedByName = "hasNoWarranty")
    @Mapping(target = "noWarrantyReason", source = "noGuaranteeReason")
    @Mapping(target = "recommendedModifiers", ignore = true)
    @Mapping(target = "riskWarnings", ignore = true)
    @Mapping(target = "processingRecommendations", ignore = true)
    @Mapping(target = "isValid", ignore = true)
    @Mapping(target = "validationErrors", ignore = true)
    DefectsStainsDTO fromOrderItem(OrderItemDTO orderItem);

    // ================================
    // Named методи для витягування даних з Map
    // ================================

    @Named("extractSelectedStains")
    default Set<String> extractSelectedStains(Map<String, Object> wizardData) {
        if (wizardData == null) return Set.of();

        Object stains = wizardData.get("selectedStains");
        if (stains instanceof Set) {
            return ((Set<?>) stains).stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .collect(Collectors.toSet());
        }
        if (stains instanceof List) {
            return ((List<?>) stains).stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .collect(Collectors.toSet());
        }
        return Set.of();
    }

    @Named("extractSelectedDefects")
    default Set<String> extractSelectedDefects(Map<String, Object> wizardData) {
        if (wizardData == null) return Set.of();

        Object defects = wizardData.get("selectedDefects");
        if (defects instanceof Set) {
            return ((Set<?>) defects).stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .collect(Collectors.toSet());
        }
        if (defects instanceof List) {
            return ((List<?>) defects).stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .collect(Collectors.toSet());
        }
        return Set.of();
    }

    @Named("extractSelectedRisks")
    default Set<String> extractSelectedRisks(Map<String, Object> wizardData) {
        if (wizardData == null) return Set.of();

        Object risks = wizardData.get("selectedRisks");
        if (risks instanceof Set) {
            return ((Set<?>) risks).stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .collect(Collectors.toSet());
        }
        if (risks instanceof List) {
            return ((List<?>) risks).stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .collect(Collectors.toSet());
        }
        return Set.of();
    }

    @Named("extractCustomStain")
    default String extractCustomStain(Map<String, Object> wizardData) {
        if (wizardData == null) return null;

        Object customStain = wizardData.get("customStain");
        return customStain instanceof String ? (String) customStain : null;
    }

    @Named("extractDefectNotes")
    default String extractDefectNotes(Map<String, Object> wizardData) {
        if (wizardData == null) return null;

        Object notes = wizardData.get("defectNotes");
        return notes instanceof String ? (String) notes : null;
    }

    @Named("extractNoWarranty")
    default Boolean extractNoWarranty(Map<String, Object> wizardData) {
        if (wizardData == null) return false;

        Object noWarranty = wizardData.get("noWarranty");
        if (noWarranty instanceof Boolean) return (Boolean) noWarranty;
        if (noWarranty instanceof String) return Boolean.parseBoolean((String) noWarranty);
        return false;
    }

    @Named("extractNoWarrantyReason")
    default String extractNoWarrantyReason(Map<String, Object> wizardData) {
        if (wizardData == null) return null;

        Object reason = wizardData.get("noWarrantyReason");
        return reason instanceof String ? (String) reason : null;
    }

    // ================================
    // Named методи для збірки OrderItemDTO полів
    // ================================

    @Named("buildStainsString")
    default String buildStainsString(DefectsStainsDTO defectsStains) {
        if (defectsStains == null || defectsStains.getSelectedStains().isEmpty()) {
            return null;
        }
        return String.join(", ", defectsStains.getSelectedStains());
    }

    @Named("buildDefectsString")
    default String buildDefectsString(DefectsStainsDTO defectsStains) {
        if (defectsStains == null || defectsStains.getSelectedDefects().isEmpty()) {
            return null;
        }
        return String.join(", ", defectsStains.getSelectedDefects());
    }

    @Named("buildDefectsAndRisks")
    default String buildDefectsAndRisks(DefectsStainsDTO defectsStains) {
        if (defectsStains == null) return null;

        List<String> allIssues = List.of();

        if (!defectsStains.getSelectedDefects().isEmpty()) {
            allIssues = List.of("Дефекти: " + String.join(", ", defectsStains.getSelectedDefects()));
        }

        if (!defectsStains.getSelectedRisks().isEmpty()) {
            String risks = "Ризики: " + String.join(", ", defectsStains.getSelectedRisks());
            allIssues = allIssues.isEmpty() ? List.of(risks) : List.of(allIssues.get(0), risks);
        }

        return allIssues.isEmpty() ? null : String.join("; ", allIssues);
    }

    @Named("buildSpecialInstructions")
    default String buildSpecialInstructions(DefectsStainsDTO defectsStains) {
        if (defectsStains == null) return null;

        List<String> instructions = List.of();

        if (!defectsStains.getRecommendedModifiers().isEmpty()) {
            instructions = List.of("Рекомендовані модифікатори: " +
                                   String.join(", ", defectsStains.getRecommendedModifiers()));
        }

        if (!defectsStains.getProcessingRecommendations().isEmpty()) {
            String recommendations = "Рекомендації: " +
                                   String.join(", ", defectsStains.getProcessingRecommendations());
            instructions = instructions.isEmpty() ? List.of(recommendations) :
                          List.of(instructions.get(0), recommendations);
        }

        return instructions.isEmpty() ? null : String.join("; ", instructions);
    }

    // ================================
    // Named методи для зворотної трансформації
    // ================================

    @Named("parseStainsString")
    default Set<String> parseStainsString(OrderItemDTO orderItem) {
        if (orderItem == null || !StringUtils.hasText(orderItem.getStains())) {
            return Set.of();
        }

        return Set.of(orderItem.getStains().split(",\\s*"));
    }

    @Named("parseDefectsString")
    default Set<String> parseDefectsString(OrderItemDTO orderItem) {
        if (orderItem == null || !StringUtils.hasText(orderItem.getDefects())) {
            return Set.of();
        }

        return Set.of(orderItem.getDefects().split(",\\s*"));
    }

    @Named("parseRisksString")
    default Set<String> parseRisksString(OrderItemDTO orderItem) {
        if (orderItem == null || !StringUtils.hasText(orderItem.getDefectsAndRisks())) {
            return Set.of();
        }

        // Витягуємо ризики з рядка типу "Дефекти: ...; Ризики: ..."
        String defectsAndRisks = orderItem.getDefectsAndRisks();
        if (defectsAndRisks.contains("Ризики:")) {
            String riskspart = defectsAndRisks.substring(defectsAndRisks.indexOf("Ризики:") + 7).trim();
            if (riskspart.contains(";")) {
                riskspart = riskspart.substring(0, riskspart.indexOf(";"));
            }
            return Set.of(riskspart.split(",\\s*"));
        }

        return Set.of();
    }

    @Named("hasNoWarranty")
    default Boolean hasNoWarranty(OrderItemDTO orderItem) {
        if (orderItem == null) return false;

        return StringUtils.hasText(orderItem.getNoGuaranteeReason());
    }
}
