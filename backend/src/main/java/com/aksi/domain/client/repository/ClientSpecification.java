package com.aksi.domain.client.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSourceType;
import com.aksi.domain.client.enums.CommunicationMethodType;

import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * JPA Specifications для ClientEntity
 * Type-safe та композиційні запити
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ClientSpecification {

    // Константи для уникнення magic strings
    private static final String FIRST_NAME_FIELD = "firstName";
    private static final String LAST_NAME_FIELD = "lastName";
    private static final String PHONE_FIELD = "phone";
    private static final String EMAIL_FIELD = "email";
    private static final String ADDRESS_FIELD = "address";
    private static final String CITY_FIELD = "city";
    private static final String SOURCE_TYPE_FIELD = "sourceType";
    private static final String COMMUNICATION_METHODS_FIELD = "communicationMethods";
    private static final String CREATED_AT_FIELD = "createdAt";
    private static final String IS_VIP_FIELD = "isVip";
    private static final String TOTAL_ORDERS_FIELD = "totalOrders";
    private static final String TOTAL_SPENT_FIELD = "totalSpent";
    private static final String LAST_ORDER_DATE_FIELD = "lastOrderDate";

    /**
     * Helper метод для створення LIKE запитів з null check
     */
    private static Specification<ClientEntity> createLikeSpecification(String field, String value) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (!StringUtils.hasText(value)) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                criteriaBuilder.lower(root.get(field)),
                "%" + value.toLowerCase() + "%"
            );
        };
    }

    /**
     * Helper метод для створення LIKE запитів без lowercase
     */
    private static Specification<ClientEntity> createSimpleLikeSpecification(String field, String value) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (!StringUtils.hasText(value)) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(root.get(field), "%" + value + "%");
        };
    }

    /**
     * Helper метод для створення EQUAL запитів з null check
     */
    private static <T> Specification<ClientEntity> createEqualSpecification(String field, T value) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (value == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get(field), value);
        };
    }

    /**
     * Загальний пошук по імені, прізвищу, телефону, email
     */
    public static Specification<ClientEntity> generalSearch(String query) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (!StringUtils.hasText(query)) {
                return criteriaBuilder.conjunction();
            }

            String searchPattern = "%" + query.toLowerCase() + "%";

            return criteriaBuilder.or(
                criteriaBuilder.like(
                    criteriaBuilder.lower(
                        criteriaBuilder.concat(
                            criteriaBuilder.concat(root.get(FIRST_NAME_FIELD), " "),
                            root.get(LAST_NAME_FIELD)
                        )
                    ),
                    searchPattern
                ),
                criteriaBuilder.like(criteriaBuilder.lower(root.get(PHONE_FIELD)), searchPattern),
                criteriaBuilder.like(criteriaBuilder.lower(root.get(EMAIL_FIELD)), searchPattern)
            );
        };
    }

    /**
     * Пошук за ім'ям (частковий збіг)
     */
    public static Specification<ClientEntity> firstNameContains(String firstName) {
        return createLikeSpecification(FIRST_NAME_FIELD, firstName);
    }

    /**
     * Пошук за прізвищем (частковий збіг)
     */
    public static Specification<ClientEntity> lastNameContains(String lastName) {
        return createLikeSpecification(LAST_NAME_FIELD, lastName);
    }

    /**
     * Пошук за телефоном (частковий збіг)
     */
    public static Specification<ClientEntity> phoneContains(String phone) {
        return createSimpleLikeSpecification(PHONE_FIELD, phone);
    }

    /**
     * Пошук за email (частковий збіг)
     */
    public static Specification<ClientEntity> emailContains(String email) {
        return createLikeSpecification(EMAIL_FIELD, email);
    }

    /**
     * Пошук за містом (через адресу)
     */
    public static Specification<ClientEntity> cityContains(String city) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (!StringUtils.hasText(city)) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(
                criteriaBuilder.lower(root.get(ADDRESS_FIELD).get(CITY_FIELD)),
                "%" + city.toLowerCase() + "%"
            );
        };
    }

    /**
     * Фільтр за джерелом надходження
     */
    public static Specification<ClientEntity> hasSourceType(ClientSourceType sourceType) {
        return createEqualSpecification(SOURCE_TYPE_FIELD, sourceType);
    }

    /**
     * Фільтр за способами зв'язку
     */
    public static Specification<ClientEntity> hasCommunicationMethods(List<CommunicationMethodType> methods) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (methods == null || methods.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();
            for (CommunicationMethodType method : methods) {
                predicates.add(criteriaBuilder.isMember(method, root.get(COMMUNICATION_METHODS_FIELD)));
            }

            return criteriaBuilder.or(predicates.toArray(Predicate[]::new));
        };
    }

    /**
     * Фільтр за датою реєстрації (від)
     */
    public static Specification<ClientEntity> registeredAfter(LocalDate fromDate) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (fromDate == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.greaterThanOrEqualTo(
                criteriaBuilder.function("DATE", LocalDate.class, root.get(CREATED_AT_FIELD)),
                fromDate
            );
        };
    }

    /**
     * Фільтр за датою реєстрації (до)
     */
    public static Specification<ClientEntity> registeredBefore(LocalDate toDate) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (toDate == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.lessThanOrEqualTo(
                criteriaBuilder.function("DATE", LocalDate.class, root.get(CREATED_AT_FIELD)),
                toDate
            );
        };
    }

    /**
     * Фільтр за VIP статусом
     */
    public static Specification<ClientEntity> isVip(Boolean isVip) {
        return createEqualSpecification(IS_VIP_FIELD, isVip);
    }

    /**
     * Композиційний метод для розширеного пошуку
     * Збирає всі фільтри з ClientSearchRequest
     */
    public static Specification<ClientEntity> buildAdvancedSearch(
            String query,
            String firstName,
            String lastName,
            String phone,
            String email,
            String city,
            ClientSourceType sourceType,
            List<CommunicationMethodType> communicationMethods,
            LocalDate registrationDateFrom,
            LocalDate registrationDateTo,
            Boolean isVip) {

        return Specification.where(generalSearch(query))
                .and(firstNameContains(firstName))
                .and(lastNameContains(lastName))
                .and(phoneContains(phone))
                .and(emailContains(email))
                .and(cityContains(city))
                .and(hasSourceType(sourceType))
                .and(hasCommunicationMethods(communicationMethods))
                .and(registeredAfter(registrationDateFrom))
                .and(registeredBefore(registrationDateTo))
                .and(isVip(isVip));
    }

    /**
     * Специфікація для топ клієнтів за замовленнями
     */
    public static Specification<ClientEntity> hasOrders() {
        return (root, criteriaQuery, criteriaBuilder) ->
            criteriaBuilder.greaterThan(root.get(TOTAL_ORDERS_FIELD), 0);
    }

    /**
     * Специфікація для клієнтів з витратами
     */
    public static Specification<ClientEntity> hasSpending() {
        return (root, criteriaQuery, criteriaBuilder) ->
            criteriaBuilder.greaterThan(root.get(TOTAL_SPENT_FIELD), 0);
    }

    /**
     * Специфікація для клієнтів без замовлень
     */
    public static Specification<ClientEntity> hasNoOrders() {
        return (root, criteriaQuery, criteriaBuilder) ->
            criteriaBuilder.equal(root.get(TOTAL_ORDERS_FIELD), 0);
    }

    /**
     * Специфікація для неактивних клієнтів
     */
    public static Specification<ClientEntity> inactiveSince(LocalDate cutoffDate) {
        return (root, criteriaQuery, criteriaBuilder) ->
            criteriaBuilder.and(
                criteriaBuilder.isNotNull(root.get(LAST_ORDER_DATE_FIELD)),
                criteriaBuilder.lessThan(root.get(LAST_ORDER_DATE_FIELD), cutoffDate)
            );
    }
}
